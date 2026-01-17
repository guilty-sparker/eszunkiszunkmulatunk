#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Image optimization script for wedding website.
Optimizes JPG, PNG, and WebP images to reduce file size while maintaining quality.
"""

import os
import sys
from PIL import Image

# Fix Windows console encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Quality settings
JPEG_QUALITY = 85  # Good balance between quality and size
WEBP_QUALITY = 85
PNG_OPTIMIZE = True

# Maximum dimensions (will maintain aspect ratio)
MAX_WIDTH = 1920
MAX_HEIGHT = 1920

def optimize_image(input_path, output_path=None):
    """Optimize a single image file."""
    if output_path is None:
        output_path = input_path
    
    try:
        # Open image
        img = Image.open(input_path)
        original_size = os.path.getsize(input_path)
        
        # Determine output format
        ext = os.path.splitext(output_path)[1].lower()
        
        # Handle different formats
        if ext in ('.jpg', '.jpeg'):
            # For JPEG, convert RGBA/LA/P to RGB with white background
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
        elif ext == '.png':
            # For PNG, preserve transparency - convert P to RGBA if needed
            if img.mode == 'P':
                img = img.convert('RGBA')
            elif img.mode == 'LA':
                img = img.convert('RGBA')
            # Keep RGBA as is for transparency
        elif ext == '.webp':
            # For WebP, preserve transparency if present
            if img.mode == 'P':
                img = img.convert('RGBA')
            elif img.mode == 'LA':
                img = img.convert('RGBA')
            # Keep RGBA as is for transparency, convert RGB if needed
            if img.mode not in ('RGBA', 'RGB'):
                img = img.convert('RGB')
        
        # Resize if too large
        if img.width > MAX_WIDTH or img.height > MAX_HEIGHT:
            img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
        
        # Save with appropriate format
        if ext in ('.jpg', '.jpeg'):
            img.save(output_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
        elif ext == '.webp':
            img.save(output_path, 'WEBP', quality=WEBP_QUALITY, method=6)
        elif ext == '.png':
            img.save(output_path, 'PNG', optimize=PNG_OPTIMIZE)
        else:
            print(f"Warning: Unknown format for {input_path}, skipping...")
            return False
        
        new_size = os.path.getsize(output_path)
        reduction = ((original_size - new_size) / original_size) * 100
        
        print(f"[OK] {os.path.basename(input_path)}: {original_size/1024:.1f} KB -> {new_size/1024:.1f} KB ({reduction:.1f}% reduction)")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Error processing {input_path}: {e}")
        return False

def main():
    """Main function to optimize all images."""
    # Image files to optimize
    image_files = [
        'event_buiding.webp',
        'rings.jpg',
        'wedding_pic_1.jpg',
        'wedding_pic_2.jpg',
        'accomodation_1.webp',
        'accomodation_2.webp',
        'flags/hu.png',
        'flags/en.png',
        'flags/ro.png',
    ]
    
    print("Starting image optimization...\n")
    
    optimized = 0
    failed = 0
    
    for img_file in image_files:
        if os.path.exists(img_file):
            if optimize_image(img_file):
                optimized += 1
            else:
                failed += 1
        else:
            print(f"[WARN] File not found: {img_file}")
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"Optimization complete!")
    print(f"[OK] Optimized: {optimized}")
    print(f"[ERROR] Failed: {failed}")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
