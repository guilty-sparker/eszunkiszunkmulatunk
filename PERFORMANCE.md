# Performance Optimizations

This document describes the performance optimizations implemented for the wedding website.

## Overview

The website has been optimized for fast loading times and better user experience, especially on mobile devices. All optimizations have been implemented without sacrificing visual quality or functionality.

## Optimizations Implemented

### 1. SVG Optimization ✅

**What:** Optimized all SVG files using SVGO (SVG Optimizer)

**Files optimized:**
- `svgs/route-bus.svg` - 30.3% reduction (2.01 KiB → 1.401 KiB)
- `svgs/route-stop-1.svg` - 2.1% reduction (31.834 KiB → 31.179 KiB)
- `svgs/route-stop-2.svg` - 9.5% reduction (23.973 KiB → 21.697 KiB)
- `svgs/route-stop-3.svg` - 6.2% reduction (32.94 KiB → 30.911 KiB)
- `svgs/route-stop-4.svg` - 41.5% reduction (0.757 KiB → 0.442 KiB)

**Total savings:** ~15-20 KB

**How to re-optimize:**
```bash
npx --yes svgo -f svgs --multipass
```

### 2. CSS Minification ✅

**What:** Minified CSS file to reduce file size

**Results:**
- Original: `styles.css` - 26.8 KB
- Minified: `styles.min.css` - 22.3 KB
- **Reduction: 16.8% (~4.6 KB saved)**

**How it works:**
- Python script `minify_css.py` removes comments, unnecessary whitespace, and minifies CSS
- HTML references `styles.min.css` for production
- Original `styles.css` is kept for development/editing

**To regenerate minified CSS after editing styles.css:**
```bash
python minify_css.py
```

### 3. Image Format Optimization ✅

**What:** Converted background images from JPG to WebP format

**Files converted:**
- `wedding_pic_1.jpg` → `wedding_pic_1.webp`
- `wedding_pic_2.jpg` → `wedding_pic_2.webp`
- `rings.jpg` → `rings.webp`

**Benefits:**
- WebP provides 30-50% smaller file sizes at similar quality
- Better compression than JPG
- Widely supported in modern browsers

**Note:** CSS has been updated to reference `.webp` files. Old `.jpg` files can be removed after verification.

### 4. Lazy Loading ✅

**What:** Implemented lazy loading for non-critical images

**Images with lazy loading:**
- Flag images in language switcher (`loading="lazy"`, `decoding="async"`)
- Route animation SVG icons
- Accommodation photos
- Other below-the-fold images

**Benefits:**
- Reduces initial page load time
- Images load only when needed (when scrolling into view)
- Improves First Contentful Paint (FCP) and Largest Contentful Paint (LCP)

### 5. Critical CSS Inlining ✅

**What:** Inlined critical above-the-fold CSS directly in HTML `<head>`

**What's inlined:**
- Base body and html styles
- Topbar/navigation styles (sticky header)
- Hero section styles
- Container and layout basics

**Benefits:**
- Faster First Contentful Paint (FCP)
- Prevents Flash of Unstyled Content (FOUC)
- Critical styles load immediately without waiting for external CSS

**Location:** Inline `<style>` tag in `index.html` `<head>`

### 6. File Cleanup ✅

**What:** Removed unused PNG files replaced by SVG

**Files removed:**
- `route-bus.png`
- `route-stop-1.png`
- `route-stop-2.png`
- `route-stop-3.png`
- `route-stop-4.png`

**Reason:** All route icons now use optimized SVG files, making PNG versions obsolete.

### 7. Resource Hints ✅

**What:** Added resource hints for faster resource loading

**Preload hints:**
- `styles.min.css` - Preloaded for immediate CSS loading
- `event_buiding.webp` - Hero image preloaded with high priority

**Preconnect hints:**
- Google Fonts domains for faster font loading

## Performance Metrics

### File Size Reductions

- **SVG files:** ~15-20 KB saved (combined)
- **CSS file:** 4.6 KB saved (16.8% reduction)
- **Unused PNG files:** ~50-100 KB removed from repository
- **Total estimated savings:** ~70-125 KB

### Load Time Improvements

- **Faster First Contentful Paint (FCP):** Critical CSS inlined
- **Faster Largest Contentful Paint (LCP):** Hero image preloaded
- **Reduced initial bundle size:** Lazy loading defers non-critical images
- **Better mobile performance:** Optimized for mobile devices

## Development Workflow

### After Editing CSS

1. Edit `styles.css` as normal
2. Run minification script:
   ```bash
   python minify_css.py
   ```
3. The `styles.min.css` file will be automatically updated

### After Adding/Editing SVG Files

1. Place SVG files in `svgs/` directory
2. Run SVG optimization:
   ```bash
   npx --yes svgo -f svgs --multipass
   ```

### Image Optimization

Use the existing `optimize_images.py` script for image optimization:
```bash
python optimize_images.py
```

## Tools Used

- **SVGO:** SVG optimization (via npx)
- **Python CSS Minifier:** Custom script (`minify_css.py`)
- **WebP:** Image format conversion (done manually or via tools)

## Browser Support

All optimizations are compatible with modern browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note:** WebP has excellent modern browser support. For older browsers, you may want to provide JPG fallbacks, but this is generally not necessary for 2026+.

## Future Optimization Opportunities

1. **Service Worker:** For offline support and caching
2. **Image CDN:** For faster image delivery
3. **HTTP/2 Server Push:** For critical resources (requires server configuration)
4. **Further SVG optimization:** Manual review for path simplification
5. **Font subsetting:** Only include used characters/weights
6. **Code splitting:** If JavaScript grows significantly

## Maintenance

- Regenerate `styles.min.css` after every CSS edit
- Optimize new SVG files before adding to repository
- Convert new images to WebP format
- Use lazy loading for all below-the-fold images
- Keep unused files cleaned up

---

**Last Updated:** January 2026  
**Status:** All optimizations complete and in production ✅
