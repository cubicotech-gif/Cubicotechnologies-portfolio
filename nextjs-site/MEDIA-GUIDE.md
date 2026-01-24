# 📸 Media Management Guide - Next.js Portfolio

## Overview
This guide explains how to add and manage images and videos in your Next.js website.

---

## 📁 Folder Structure

Your media files are organized in `/nextjs-site/public/images/`:

```
public/images/
├── logos/              # Company logos (logo.png)
├── hero/               # Homepage hero section preview images
├── projects/           # Portfolio/project screenshots
├── features/           # Feature highlight images
├── team/               # Team member photos (future)
├── clients/            # Client logos (future)
└── awards/             # Award badges and certificates (future)
```

---

## 🎯 Current Homepage Images

### 1. Hero Section Preview Cards (3 images)
**Location:** `/nextjs-site/public/images/hero/`

| File Name | What to Upload | Recommended Size |
|-----------|----------------|------------------|
| `dashboard-preview.svg` | LMS dashboard interface screenshot | 800x600px |
| `interactive-lessons.svg` | Interactive lesson/course screenshot | 800x600px |
| `analytics-preview.svg` | Analytics dashboard screenshot | 800x600px |

### 2. Featured Project (Large Card)
**Location:** `/nextjs-site/public/images/projects/`

| File Name | What to Upload | Recommended Size |
|-----------|----------------|------------------|
| `islamic-history-series.svg` | Animation still, promo art, or episode screenshot | 1200x800px or 1920x1080px |

### 3. Project Gallery (4 smaller cards)
**Location:** `/nextjs-site/public/images/projects/`

| File Name | What to Upload | Recommended Size |
|-----------|----------------|------------------|
| `quranpath-lms.svg` | LMS platform screenshot | 800x600px |
| `adhkar-app.svg` | Mobile app screenshot (mockup or real) | 800x600px |
| `hadith-search.svg` | Search interface screenshot | 800x600px |
| `virtual-hajj.svg` | 3D tour screenshot or render | 800x600px |

---

## 🔄 How to Replace Images

### Method 1: Direct File Replacement (Easiest)
1. Prepare your image (JPG, PNG, or WebP format)
2. Rename it to match the placeholder (e.g., `dashboard-preview.jpg`)
3. Delete the existing `.svg` placeholder file
4. Copy your new image to the folder
5. Update the file extension in the code

**Update in:** `/nextjs-site/app/page.tsx`

```tsx
// Before (placeholder)
{ image: '/images/hero/dashboard-preview.svg' }

// After (your image)
{ image: '/images/hero/dashboard-preview.jpg' }
```

### Method 2: Use Custom Filenames
1. Upload your image with any name (e.g., `my-dashboard-photo.jpg`)
2. Update the path in `/nextjs-site/app/page.tsx`

**Find these sections in `page.tsx`:**

**Line 183-185** - Hero cards:
```tsx
{ title: 'LMS Dashboard', image: '/images/hero/my-dashboard-photo.jpg' }
```

**Line 223** - Featured project:
```tsx
<Image src="/images/projects/my-islamic-history-image.jpg" ... />
```

**Lines 240, 248, 256, 264** - Project cards:
```tsx
<Image src="/images/projects/my-lms-screenshot.jpg" ... />
```

---

## 📤 Upload Methods

### Option A: Direct File Copy
```bash
# Copy your image to the folder
cp /path/to/your/image.jpg nextjs-site/public/images/hero/dashboard-preview.jpg
```

### Option B: Using Git
```bash
# Navigate to images folder
cd nextjs-site/public/images/hero/

# Add your image
# (copy it here manually or use cp command)

# Commit
git add .
git commit -m "Add dashboard preview image"
git push
```

### Option C: VS Code / File Manager
1. Open your project folder in VS Code or File Explorer
2. Navigate to `nextjs-site/public/images/`
3. Drag and drop your images into the appropriate subfolder
4. Rename if needed

---

## ✅ Supported Image Formats

Next.js Image component supports:
- ✅ **JPEG/JPG** - Best for photos (recommended)
- ✅ **PNG** - Best for graphics with transparency
- ✅ **WebP** - Modern format, smaller file size (recommended)
- ✅ **AVIF** - Newest format, excellent compression
- ✅ **SVG** - Vector graphics (current placeholders)
- ✅ **GIF** - Animated images

**Recommended: Use WebP or JPG for best performance**

---

## 📏 Image Size Recommendations

| Image Type | Dimensions | Max File Size | Format |
|------------|-----------|---------------|--------|
| Hero cards | 800x600px | 200KB | JPG/WebP |
| Featured project | 1200x800px or 1920x1080px | 500KB | JPG/WebP |
| Project cards | 800x600px | 200KB each | JPG/WebP |
| Logo | 500x500px | 50KB | PNG (transparent) |

---

## 🎬 Adding Videos

### Option 1: Video Backgrounds (Hero Section)
Create `/nextjs-site/public/videos/` folder and add your video:

```tsx
<div className="relative h-screen">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/videos/hero-background.mp4" type="video/mp4" />
    <source src="/videos/hero-background.webm" type="video/webm" />
  </video>
  {/* Your content */}
</div>
```

**Video recommendations:**
- Format: MP4 (H.264) + WebM fallback
- Resolution: 1920x1080px
- Max size: 10MB (compress if larger)
- FPS: 30fps
- Duration: 15-30 seconds for loops

### Option 2: YouTube/Vimeo Embeds
```tsx
<div className="aspect-video rounded-xl overflow-hidden">
  <iframe
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    className="w-full h-full"
    allowFullScreen
  />
</div>
```

### Option 3: Project Demo Videos
Replace project images with videos:

```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-full object-cover"
>
  <source src="/videos/project-demo.mp4" type="video/mp4" />
</video>
```

---

## 🛠️ Image Optimization Tips

### Before Uploading:

1. **Resize to recommended dimensions**
   - Don't upload 4K images if you only need 800px
   - Use: Photoshop, GIMP, or online tools

2. **Compress images**
   - **TinyPNG**: https://tinypng.com (PNG/JPG)
   - **Squoosh**: https://squoosh.app (All formats)
   - **ImageOptim**: https://imageoptim.com (Mac)

3. **Convert to WebP** (optional, for 30% smaller files)
   - Use: https://cloudconvert.com/jpg-to-webp
   - Or: Squoosh.app

### Next.js Auto-Optimization

The `<Image>` component automatically:
- ✅ Resizes images for different screen sizes
- ✅ Serves WebP/AVIF to supported browsers
- ✅ Lazy loads images (better performance)
- ✅ Prevents layout shift

No manual optimization needed!

---

## 📝 Code Reference

**Homepage image configuration:** `/nextjs-site/app/page.tsx`

**Key lines:**
- Line 4: Image component import
- Lines 183-185: Hero cards (array with image paths)
- Line 223: Featured project image
- Lines 240, 248, 256, 264: Project card images

---

## 🚀 Quick Start Steps

1. **Prepare your images**
   - Screenshot your projects/dashboards
   - Resize to recommended dimensions
   - Compress to reduce file size

2. **Upload to folders**
   ```bash
   # Hero section
   cp dashboard.jpg nextjs-site/public/images/hero/dashboard-preview.jpg
   cp lessons.jpg nextjs-site/public/images/hero/interactive-lessons.jpg
   cp analytics.jpg nextjs-site/public/images/hero/analytics-preview.jpg

   # Projects
   cp islamic-history.jpg nextjs-site/public/images/projects/islamic-history-series.jpg
   cp lms.jpg nextjs-site/public/images/projects/quranpath-lms.jpg
   # ... etc
   ```

3. **Update file extensions in code**
   - Open `nextjs-site/app/page.tsx`
   - Change `.svg` to `.jpg` (or your format)

4. **Test locally**
   ```bash
   cd nextjs-site
   npm run dev
   ```
   Open http://localhost:3000

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Add project images"
   git push
   ```

---

## 📋 Checklist

- [ ] Compress images (under recommended file sizes)
- [ ] Upload to correct folders
- [ ] Update file paths in `page.tsx` if needed
- [ ] Test locally with `npm run dev`
- [ ] Verify images load correctly
- [ ] Check mobile responsiveness
- [ ] Commit and push changes

---

## 💡 Tips

- **Use descriptive alt text** for accessibility
- **Keep consistent aspect ratios** within each section
- **Test on mobile devices** - images should look good everywhere
- **Use WebP format** for 30% smaller file sizes
- **Compress before uploading** to improve load times

---

## 🎯 What's Next?

After you've added your images, I can help you:
- Add team member photos
- Create client logos section
- Add video backgrounds
- Implement image galleries
- Add testimonial photos
- Create custom animations

Just let me know what you'd like to add next!
