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
            elif img.mode == 'RGB':
                img = img.convert('RGBA')
            
            # Remove common background colors (white, light gray, dark gray)
            # Use a smarter approach: detect background by checking corners and edges
            if img.mode == 'RGBA' and 'route' in input_path.lower():
                # Get corner pixels to determine background color
                width, height = img.size
                corners = [
                    img.getpixel((0, 0)),  # top-left
                    img.getpixel((width-1, 0)),  # top-right
                    img.getpixel((0, height-1)),  # bottom-left
                    img.getpixel((width-1, height-1)),  # bottom-right
                ]
                
                # Find the most common corner color (likely the background)
                corner_colors = {}
                for corner in corners:
                    r, g, b, a = corner
                    # Round to nearest 10 to group similar colors
                    key = (r//10*10, g//10*10, b//10*10)
                    corner_colors[key] = corner_colors.get(key, 0) + 1
                
                # Get the most common background color
                if corner_colors:
                    bg_color = max(corner_colors.items(), key=lambda x: x[1])[0]
                    bg_r, bg_g, bg_b = bg_color
                    
                    # Also check edge pixels for background
                    edge_samples = []
                    for x in [0, width//4, width//2, 3*width//4, width-1]:
                        edge_samples.append(img.getpixel((x, 0)))
                        edge_samples.append(img.getpixel((x, height-1)))
                    for y in [0, height//4, height//2, 3*height//4, height-1]:
                        edge_samples.append(img.getpixel((0, y)))
                        edge_samples.append(img.getpixel((width-1, y)))
                    
                    # Find background color range from edges
                    bg_colors = set()
                    for r, g, b, a in edge_samples:
                        if abs(r - g) < 15 and abs(g - b) < 15:  # Gray tones
                            bg_colors.add((r//10*10, g//10*10, b//10*10))
                    
                    # Process all pixels
                    data = img.getdata()
                    new_data = []
                    for item in data:
                        r, g, b, a = item
                        # Check if pixel matches background colors
                        pixel_key = (r//10*10, g//10*10, b//10*10)
                        is_gray = abs(r - g) < 15 and abs(g - b) < 15
                        
                        # Remove if it's a gray/white background color
                        if (pixel_key in bg_colors or 
                            (is_gray and (r > 150 or r < 50)) or  # Light or dark gray
                            (r > 240 and g > 240 and b > 240)):  # White
                            # Make transparent
                            new_data.append((r, g, b, 0))
                        else:
                            new_data.append(item)
                    
                    img.putdata(new_data)
        elif ext == '.webp':
            # For WebP, preserve transparency if present
            if img.mode == 'P':
                img = img.convert('RGBA')
            elif img.mode == 'LA':
                img = img.convert('RGBA')
            # Keep RGBA as is for transparency, convert RGB if needed
            if img.mode not in ('RGBA', 'RGB'):
                img = img.convert('RGB')
        
        # Resize if too large (but not for route icons - they should stay their original size)
        if 'route' not in input_path.lower():
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
        'route-stop-1.png',
        'route-stop-2.png',
        'route-stop-3.png',
        'route-stop-4.png',
        'route-bus.png',
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
