#!/usr/bin/env python3
"""Re-encrypt the seating bundle under a new password.

Decrypts ultetes-data.enc.json with the current password and writes it back
encrypted with a new one, using the same parameters the browser expects:
PBKDF2-SHA256 for the key, AES-GCM for the payload.

Passwords are never taken as arguments, so they stay out of shell history.
In a normal terminal they are prompted for. Where there is no TTY (an editor
pane, CI), pass files holding them instead — write those with an editor, not
with echo, or the password lands in history anyway.

A fresh salt and nonce are generated every run: reusing a nonce with AES-GCM
would be a real break, not a style issue.

Usage:
    python3 rotate_password.py
    python3 rotate_password.py --old-file OLD.txt --new-file NEW.txt
"""

import argparse
import base64
import getpass
import hashlib
import json
import os
import shutil
import sys

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

BUNDLE = "ultetes-data.enc.json"
ITERATIONS = 310_000
KEY_BYTES = 32
SALT_BYTES = 16
NONCE_BYTES = 12


def derive(password, salt):
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERATIONS, KEY_BYTES)


def decrypt(payload, password):
    key = derive(password, base64.b64decode(payload["salt"]))
    nonce = base64.b64decode(payload["nonce"])
    data = base64.b64decode(payload["data"])
    return AESGCM(key).decrypt(nonce, data, None)


def encrypt(plaintext, password):
    salt = os.urandom(SALT_BYTES)
    nonce = os.urandom(NONCE_BYTES)
    key = derive(password, salt)
    data = AESGCM(key).encrypt(nonce, plaintext, None)
    return {
        "kdf": "PBKDF2-SHA256",
        "iterations": ITERATIONS,
        "cipher": "AES-GCM",
        "salt": base64.b64encode(salt).decode("ascii"),
        "nonce": base64.b64encode(nonce).decode("ascii"),
        "data": base64.b64encode(data).decode("ascii"),
    }


def read_file(path):
    with open(path, encoding="utf-8") as handle:
        # Trailing newlines are an artefact of the editor, not the password.
        return handle.read().rstrip("\r\n")


def ask(prompt):
    if not sys.stdin.isatty():
        sys.exit(
            "No terminal available for a password prompt.\n"
            "Either run this in a normal terminal, or pass\n"
            "  --old-file OLD.txt --new-file NEW.txt\n"
            "with the passwords written into those files by an editor."
        )
    return getpass.getpass(prompt)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--old-file", help="file holding the current password")
    parser.add_argument("--new-file", help="file holding the new password")
    args = parser.parse_args()

    with open(BUNDLE, encoding="utf-8") as handle:
        payload = json.load(handle)

    current = read_file(args.old_file) if args.old_file else ask("Current password: ")
    try:
        plaintext = decrypt(payload, current)
    except Exception:
        sys.exit("Wrong password — the bundle was not touched.")

    # Prove we decrypted something usable before overwriting anything.
    guests = json.loads(plaintext.decode("utf-8"))
    print("Decrypted %d bytes, plan versions: %s" % (len(plaintext), ", ".join(guests["plans"])))

    if args.new_file:
        new = read_file(args.new_file)
    else:
        new = ask("New password: ")
        if new != ask("New password again: "):
            sys.exit("Passwords did not match — the bundle was not touched.")
    if not new:
        sys.exit("Empty password refused — the bundle was not touched.")

    rotated = encrypt(plaintext, new)

    # Round-trip against the new password before replacing the only copy.
    assert decrypt(rotated, new) == plaintext, "verification failed"

    shutil.copyfile(BUNDLE, BUNDLE + ".bak")
    with open(BUNDLE, "w", encoding="utf-8") as handle:
        json.dump(rotated, handle, indent=2)
        handle.write("\n")

    print("Rotated. Previous bundle saved as %s.bak — delete it once you are happy." % BUNDLE)
    print("Guests with an open tab must re-enter the password (sessionStorage still holds the old one).")


if __name__ == "__main__":
    main()
