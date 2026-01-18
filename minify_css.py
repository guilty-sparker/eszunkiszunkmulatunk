#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSS minification script for wedding website.
Removes comments, unnecessary whitespace, and minifies CSS.
"""

import re
import sys
import os

def minify_css(css_content):
    """Minify CSS by removing comments and unnecessary whitespace."""
    # Remove CSS comments (/* ... */)
    css_content = re.sub(r'/\*[^*]*\*+(?:[^/*][^*]*\*+)*/', '', css_content)
    
    # Remove unnecessary whitespace around selectors, properties, and values
    # But preserve whitespace in strings (e.g., font-family: "Cormorant Garamond")
    
    # Collapse multiple spaces/tabs/newlines to single space
    css_content = re.sub(r'\s+', ' ', css_content)
    
    # Remove spaces around certain characters
    css_content = re.sub(r'\s*{\s*', '{', css_content)
    css_content = re.sub(r'\s*}\s*', '}', css_content)
    css_content = re.sub(r'\s*:\s*', ':', css_content)
    css_content = re.sub(r'\s*;\s*', ';', css_content)
    css_content = re.sub(r'\s*,\s*', ',', css_content)
    css_content = re.sub(r'\s*>\s*', '>', css_content)
    css_content = re.sub(r'\s*\+\s*', '+', css_content)
    css_content = re.sub(r'\s*~\s*', '~', css_content)
    
    # Remove trailing semicolons before closing braces
    css_content = re.sub(r';}', '}', css_content)
    
    # Remove spaces at start and end
    css_content = css_content.strip()
    
    return css_content

def main():
    """Main function to minify CSS file."""
    input_file = 'styles.css'
    output_file = 'styles.min.css'
    
    if not os.path.exists(input_file):
        print(f"[ERROR] File not found: {input_file}")
        return 1
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        original_size = len(original_content)
        
        minified_content = minify_css(original_content)
        
        new_size = len(minified_content)
        reduction = ((original_size - new_size) / original_size) * 100
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(minified_content)
        
        print(f"[OK] {input_file}: {original_size/1024:.1f} KB -> {new_size/1024:.1f} KB ({reduction:.1f}% reduction)")
        print(f"[OK] Minified CSS saved to {output_file}")
        
    except Exception as e:
        print(f"[ERROR] Error processing {input_file}: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
