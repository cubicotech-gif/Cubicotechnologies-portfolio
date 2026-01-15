# Media & Images Guide for Cubico Technologies Website

## 📁 Directory Structure

```
nextjs-site/public/
├── images/
│   ├── logos/
│   │   └── logo.png (your main logo - already added!)
│   ├── projects/      ← Add project screenshots here
│   ├── team/          ← Add team member photos here
│   ├── clients/       ← Add client logos here
│   └── hero/          ← Add hero/banner images here
```

## 🖼️ Recommended Image Sizes

### Logo
- **Current**: 28KB PNG
- **Display size**: 256x80px (navigation), 288x96px (footer)
- **Status**: ✅ Already optimized!

### Project Showcase Images
- **Recommended size**: 1200x800px (3:2 aspect ratio)
- **Format**: JPG or PNG
- **Max file size**: 200KB per image
- **Location**: `/public/images/projects/`
- **Example names**:
  - `islamic-history-series.jpg`
  - `quranpath-lms.jpg`
  - `adhkar-app.jpg`

### Hero/Banner Images
- **Recommended size**: 1920x1080px (16:9)
- **Format**: JPG (use PNG only if transparency needed)
- **Max file size**: 300KB
- **Location**: `/public/images/hero/`

### Team Photos
- **Recommended size**: 400x400px (square)
- **Format**: JPG
- **Max file size**: 50KB per photo
- **Location**: `/public/images/team/`

### Client Logos
- **Recommended size**: 200x80px
- **Format**: PNG with transparent background
- **Max file size**: 30KB per logo
- **Location**: `/public/images/clients/`

## 📏 How to Check Image Sizes

### On Windows:
1. Right-click image file
2. Select "Properties"
3. Click "Details" tab
4. Look for "Dimensions" (shows width x height in pixels)
5. Look for "Size" (shows file size in KB/MB)

### On Mac:
1. Select image file
2. Press `Cmd + I` (Get Info)
3. Dimensions shown under "More Info"
4. File size shown at top

### On Linux:
```bash
# Get dimensions
identify image.png

# Get file size
ls -lh image.png
```

### Online Tools:
- **https://www.iloveimg.com/** - Resize, compress, convert
- **https://tinypng.com/** - Compress PNG/JPG (reduces file size by 50-80%)
- **https://squoosh.app/** - Google's image optimizer

## 🎨 Optimizing Images

### Before Adding to Website:
1. **Resize** to recommended dimensions
2. **Compress** to reduce file size:
   - Use TinyPNG for PNG files
   - Use JPG quality 85-90% (sweet spot)
3. **Convert** to web-friendly format:
   - Photos → JPG
   - Logos/graphics → PNG
   - Modern browsers → WebP (optional)

### Quick Compression:
```bash
# Using online tools (easiest):
1. Visit tinypng.com
2. Upload your image
3. Download compressed version
4. Can reduce 28KB logo to 15KB without quality loss!
```

## 📦 How to Add Images to Your Website

### Step 1: Add Image Files
```bash
# Example: Adding a project image
1. Place file in: nextjs-site/public/images/projects/lms-dashboard.jpg
2. File will be accessible at: /images/projects/lms-dashboard.jpg
```

### Step 2: Use in Components
```typescript
import Image from 'next/image';

// Method 1: With fixed dimensions
<Image
  src="/images/projects/lms-dashboard.jpg"
  alt="LMS Dashboard Screenshot"
  width={600}
  height={400}
  className="rounded-xl"
/>

// Method 2: Fill container (responsive)
<div className="relative w-full h-64">
  <Image
    src="/images/projects/lms-dashboard.jpg"
    alt="LMS Dashboard"
    fill
    className="object-cover rounded-xl"
  />
</div>
```

### Step 3: Commit to Git
```bash
git add nextjs-site/public/images/
git commit -m "Add project images"
git push
```

## 🚀 Next.js Image Component Benefits

Next.js automatically:
- ✅ Optimizes images (converts to WebP when supported)
- ✅ Lazy loads (only loads when visible)
- ✅ Prevents layout shift
- ✅ Serves responsive sizes
- ✅ Caches optimized versions

**You upload 200KB JPG → Users download ~50KB WebP!**

## 📋 Current Image Status

### ✅ Already Added:
- Logo (logo.png) - 28KB - Perfect size!

### ❌ Still Needed:
- Project screenshots (5-10 images)
- Client logos (optional, 6-12 logos)
- Team photos (optional)
- Hero banner images (optional)

## 💡 Pro Tips

### File Naming:
- ✅ `islamic-history-series.jpg` (descriptive, lowercase, hyphens)
- ❌ `IMG_1234.jpg` (not descriptive)
- ❌ `Islamic History Series.jpg` (spaces cause issues)

### File Sizes:
- Logo: < 50KB
- Photos: < 200KB
- Hero images: < 300KB
- Icons: < 20KB

### Formats:
- **JPG**: Photos, screenshots, complex images
- **PNG**: Logos, graphics with transparency
- **SVG**: Icons, simple graphics (infinitely scalable!)
- **WebP**: Modern format (Next.js converts automatically)

## 🎯 Quick Checklist Before Adding Images

- [ ] Resized to recommended dimensions?
- [ ] Compressed to reduce file size?
- [ ] Descriptive file name (lowercase-with-hyphens)?
- [ ] Placed in correct /public/images/ subfolder?
- [ ] Tested image loads on website?

## 🔧 Troubleshooting

### Image Not Showing:
1. Check file path starts with `/` (e.g., `/images/logo.png`)
2. Verify file exists in `nextjs-site/public/` folder
3. Check file extension matches (case-sensitive)
4. Clear browser cache and refresh

### Image Too Large (Slow Loading):
1. Compress using TinyPNG or Squoosh
2. Reduce dimensions if unnecessary
3. Convert PNG photos to JPG

### Image Blurry:
1. Use higher resolution source (2x display size)
2. Don't upscale small images
3. Use proper aspect ratio

## 📞 Need Help?

Common scenarios:

**"How do I resize images?"**
→ Use https://www.iloveimg.com/resize-image

**"How do I compress images?"**
→ Use https://tinypng.com

**"How do I check image dimensions?"**
→ Windows: Right-click → Properties → Details
→ Mac: Select file → Cmd+I
→ Online: Upload to iloveimg.com

**"What if my image is 5MB?"**
→ Way too large! Compress to <300KB using TinyPNG

---

**Your logo is perfect - 28KB at great resolution!** 🎉

Now you can add project screenshots, client logos, and other images following this guide.
