# Complete Image Upload System Documentation

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER WORKFLOW                             │
├─────────────────────────────────────────────────────────────┤
│ 1. Admin opens /admin/hero                                  │
│ 2. Selects folder (hero/portfolio/projects/etc)            │
│ 3. Uploads image (drag-drop or click)                      │
│ 4. Image → API → Supabase Storage (cloud)                  │
│ 5. Gets back cloud URL                                      │
│ 6. Adds to hero_images database with category & order      │
│ 7. Image appears on homepage hero background               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 File Structure

```
nextjs-site/
├── app/
│   ├── api/
│   │   ├── upload-image/
│   │   │   └── route.ts          ← Upload API (handles file upload)
│   │   └── hero-images/
│   │       └── route.ts          ← Database API (CRUD operations)
│   ├── admin/
│   │   └── hero/
│   │       └── page.tsx          ← Admin interface
│   └── page.tsx                  ← Homepage (displays hero)
├── components/
│   └── AnimatedCardsBackground.tsx  ← Hero background component
├── lib/
│   └── supabase.ts               ← Supabase client config
├── .env.local                     ← Environment variables
├── .env.example                   ← Environment template
├── next.config.js                 ← Next.js config (image domains)
└── package.json                   ← Dependencies
```

---

## 🔧 Configuration Files

### 1. Environment Variables (.env.local)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://snlehtiwmoxqxcglnlwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Purpose**: Store Supabase credentials
**Security**: .env.local is in .gitignore (never committed)

---

### 2. Next.js Config (next.config.js)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snlehtiwmoxqxcglnlwd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

**Purpose**: Allow Next.js Image component to load Supabase images
**Required**: Must match your Supabase URL

---

### 3. Supabase Client (lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for browser and server
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

export default supabase;
```

**Purpose**: Initialize Supabase client
**Two clients**:
- `supabase`: For client-side (uses anon key)
- `supabaseAdmin`: For server-side (uses service_role key)

---

## 🗄️ Database Schema (Supabase)

### Table: `hero_images`

```sql
CREATE TABLE hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT,
  category TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_hero_images_order ON hero_images("order");
CREATE INDEX idx_hero_images_active ON hero_images(active);

-- Row Level Security
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access" ON hero_images
  FOR SELECT USING (true);

CREATE POLICY "Service role full access" ON hero_images
  FOR ALL USING (auth.role() = 'service_role');
```

**Columns**:
- `id`: Unique identifier (UUID)
- `filename`: Original filename
- `url`: Supabase Storage public URL
- `category`: Logo Design, Artwork, Video, etc.
- `order`: Display sequence (1, 2, 3...)
- `active`: Show/hide toggle
- `created_at`: Timestamp

---

## ☁️ Storage Configuration (Supabase)

### Bucket: `images`

**Structure**:
```
images/                    ← Bucket (public)
├── hero/                  ← Folder
│   ├── 1234567-logo.png
│   └── 1234568-art.jpg
├── portfolio/
├── projects/
├── logos/
├── team/
└── general/
```

**Storage Policies**:
```sql
-- Allow public to read
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow service role to upload
CREATE POLICY "Service role upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images'
  AND auth.role() = 'service_role'
);
```

---

## 🔌 API Routes

### 1. Upload API (app/api/upload-image/route.ts)

**Purpose**: Handle file uploads to Supabase Storage

**Endpoints**:
- `POST /api/upload-image` - Upload file
- `GET /api/upload-image?folder=hero` - List files in folder

**Key Features**:
- Validates file type (jpg, png, gif, webp, svg)
- Validates file size (max 10MB)
- Organizes by folder (hero, portfolio, etc.)
- Generates unique filename with timestamp
- Returns public URL

**Flow**:
```
1. Receive FormData with file + folder
2. Validate file (type, size)
3. Generate unique filename: {timestamp}-{filename}
4. Upload to Supabase Storage: images/{folder}/{filename}
5. Get public URL
6. Return: { success, filename, url, folder }
```

**Code Snippet**:
```typescript
// Upload to Supabase
const { data, error } = await supabaseAdmin.storage
  .from('images')
  .upload(filePath, buffer, {
    contentType: file.type,
    upsert: false,
  });

// Get public URL
const { data: publicUrlData } = supabaseAdmin.storage
  .from('images')
  .getPublicUrl(filePath);

return NextResponse.json({
  success: true,
  filename: filename,
  folder: folder,
  url: publicUrlData.publicUrl,
});
```

---

### 2. Hero Images API (app/api/hero-images/route.ts)

**Purpose**: CRUD operations for hero_images database

**Endpoints**:
- `GET /api/hero-images` - Get all hero images
- `POST /api/hero-images` - Add image to hero section
- `PUT /api/hero-images` - Update image (order, active, category)
- `DELETE /api/hero-images?id={id}` - Remove image

**Flow for Adding Image**:
```
1. Receive: { filename, url, category, order }
2. Insert into hero_images table
3. Return new image record with UUID
```

**Code Snippet**:
```typescript
const { data, error } = await supabaseAdmin
  .from('hero_images')
  .insert([{
    filename,
    url,
    category,
    order,
    active: true,
  }])
  .select()
  .single();
```

---

## 🖥️ Frontend Components

### 1. Admin Page (app/admin/hero/page.tsx)

**Purpose**: Image management interface

**Key Features**:
- Folder selector dropdown
- Drag-and-drop upload
- Image browser (shows images from selected folder)
- Add to hero section form
- Display active hero images with controls

**State Management**:
```typescript
const [images, setImages] = useState<HeroImage[]>([]);        // Hero images from DB
const [availableImages, setAvailableImages] = useState([]);   // Files in storage
const [uploadFolder, setUploadFolder] = useState('hero');     // Current folder
const [filename, setFilename] = useState('');                 // Selected file
const [imageUrl, setImageUrl] = useState('');                 // Cloud URL
const [category, setCategory] = useState('Logo Design');      // Category
const [order, setOrder] = useState(1);                        // Display order
```

**Upload Flow**:
```typescript
1. User drops/selects file
2. handleFileUpload() triggered
3. Create FormData with file + folder
4. POST to /api/upload-image
5. Receive { url, filename }
6. Store in state (imageUrl, filename)
7. User clicks "Add to Hero"
8. POST to /api/hero-images with { filename, url, category, order }
9. Refresh images list
```

---

### 2. Hero Background (components/AnimatedCardsBackground.tsx)

**Purpose**: Display animated cards on homepage

**How It Works**:
```typescript
1. Fetch hero images from /api/hero-images
2. Filter active images: images.filter(img => img.active)
3. Sort by order: images.sort((a, b) => a.order - b.order)
4. Distribute across 5 columns (23 total cards)
5. Each column animates up or down
6. Images cycle through: Card[i] = images[i % images.length]
```

**Column Configuration**:
```typescript
// 5 columns with different speeds/directions
[
  { position: '5%',  direction: 'up',   duration: 40, cards: 5 },
  { position: '25%', direction: 'down', duration: 35, cards: 5 },
  { position: '50%', direction: 'up',   duration: 45, cards: 3 },
  { position: '75%', direction: 'down', duration: 38, cards: 5 },
  { position: '95%', direction: 'up',   duration: 42, cards: 5 },
]
```

**Image Distribution**:
```typescript
// With 2 images and 23 cards:
const imageIndex = (columnIndex * count + cardIndex) % images.length;
const image = images[imageIndex];

// Result: Images repeat to fill all cards
// Card 0: Image 0
// Card 1: Image 1
// Card 2: Image 0  ← Repeats
// Card 3: Image 1  ← Repeats
// ...etc
```

---

## 📊 Data Flow Diagrams

### Upload Flow
```
┌──────────┐    FormData     ┌─────────────┐
│  Admin   │  ──────────────> │   Upload    │
│  Page    │                  │     API     │
└──────────┘                  └─────────────┘
                                     │
                              POST file + folder
                                     ↓
                              ┌─────────────┐
                              │  Supabase   │
                              │   Storage   │
                              │   /images/  │
                              │   {folder}/ │
                              └─────────────┘
                                     │
                              Returns public URL
                                     ↓
┌──────────┐    { url }       ┌─────────────┐
│  Admin   │  <──────────────  │   Upload    │
│  Page    │                  │     API     │
└──────────┘                  └─────────────┘
```

### Add to Hero Flow
```
┌──────────┐  { url, category }  ┌─────────────┐
│  Admin   │  ──────────────────> │ Hero Images │
│  Page    │                      │     API     │
└──────────┘                      └─────────────┘
                                         │
                                  INSERT INTO
                                   hero_images
                                         ↓
                                  ┌─────────────┐
                                  │  Supabase   │
                                  │  Database   │
                                  │ hero_images │
                                  └─────────────┘
```

### Display Flow
```
┌──────────┐    GET /api/     ┌─────────────┐
│ Homepage │  ──────────────> │ Hero Images │
│   Hero   │   hero-images    │     API     │
└──────────┘                  └─────────────┘
     ↑                               │
     │                        SELECT * FROM
     │                         hero_images
     │                        WHERE active=true
     │                               ↓
     │                        ┌─────────────┐
     │                        │  Supabase   │
     │         { images }     │  Database   │
     └────────────────────────┤ hero_images │
                              └─────────────┘
```

---

## 🔍 Current Implementation Status

### ✅ Working Features

1. **Upload System**
   - ✅ File validation (type, size)
   - ✅ Folder organization (6 folders)
   - ✅ Supabase Storage upload
   - ✅ Public URL generation
   - ✅ Drag-and-drop interface
   - ✅ Image browser

2. **Database System**
   - ✅ PostgreSQL table (hero_images)
   - ✅ CRUD operations
   - ✅ Row Level Security
   - ✅ Indexes for performance

3. **Admin Interface**
   - ✅ Folder selector
   - ✅ Upload area
   - ✅ Image preview
   - ✅ Add to hero form
   - ✅ Active hero images list
   - ✅ Order management
   - ✅ Active/inactive toggle

4. **Display System**
   - ✅ Hero background animation
   - ✅ 5 columns, 23 cards
   - ✅ Image cycling
   - ✅ Responsive (desktop + mobile)

---

## ⚠️ Potential Missing Pieces

### 1. **Image Deletion from Storage**
**Missing**: Delete file from Supabase Storage when removed from hero section

**Current**: Only removes from database, file stays in storage

**Fix Needed**:
```typescript
// In DELETE /api/hero-images
const image = await getImageById(id);
if (image.url) {
  // Extract path from URL
  const path = image.url.split('/public/')[1];
  await supabaseAdmin.storage.from('images').remove([path]);
}
```

---

### 2. **Portfolio Page Integration**
**Missing**: No page to display portfolio folder images

**Current**: Can upload to portfolio folder, but nowhere to show them

**Needs**:
- `/portfolio` page
- Grid display of portfolio images
- Similar CRUD system for portfolio items

---

### 3. **Projects Page Integration**
**Missing**: No page to display projects folder images

**Current**: Can upload to projects folder, but not used

**Needs**:
- Projects showcase section
- API to manage featured projects
- Link project images to project data

---

### 4. **Image Optimization**
**Partial**: Using Next.js Image component but `unoptimized` flag

**Current**: Images load unoptimized (for debugging)

**Improvement**:
```typescript
// Remove unoptimized flag once working
<Image
  src={image.url}
  alt={image.category}
  fill
  className="object-cover"
  // unoptimized  ← Remove this
/>
```

---

### 5. **Error Handling**
**Missing**: Better error messages for users

**Current**: Console.log errors, generic messages

**Improvements Needed**:
- Show specific error messages to user
- Retry logic for failed uploads
- Validation messages before upload
- Network error handling

---

### 6. **Loading States**
**Partial**: Has upload spinner, but incomplete

**Missing**:
- Image preview while uploading
- Progress bar for large files
- Skeleton loaders in image browser

---

### 7. **Image Metadata**
**Missing**: No alt text, descriptions, or tags

**Current**: Only filename, category, order

**Could Add**:
```sql
ALTER TABLE hero_images ADD COLUMN alt_text TEXT;
ALTER TABLE hero_images ADD COLUMN description TEXT;
ALTER TABLE hero_images ADD COLUMN tags TEXT[];
```

---

### 8. **Batch Operations**
**Missing**: Can't select multiple images

**Could Add**:
- Bulk upload (multiple files at once)
- Bulk activate/deactivate
- Bulk delete
- Bulk reorder

---

### 9. **Image Cropping/Editing**
**Missing**: No image editing before upload

**Could Add**:
- Crop tool
- Resize options
- Filters
- Rotate/flip

---

### 10. **Search & Filter**
**Missing**: Can't search uploaded images

**Could Add**:
- Search by filename
- Filter by category
- Filter by date uploaded
- Filter by folder

---

## 🐛 Known Issues

### 1. **Same Image Repeats on All Cards**
**Status**: Not a bug - working as designed
**Reason**: Only 2 images uploaded, 23 cards need images
**Solution**: Upload 8-10 images for variety

### 2. **Dropdown Was Blank**
**Status**: ✅ Fixed
**Reason**: Black text on black background
**Fix**: Added `colorScheme: 'dark'` and styled options

### 3. **Images Not Loading Initially**
**Status**: ✅ Fixed
**Reason**: Supabase domain not whitelisted in next.config.js
**Fix**: Added domain to remotePatterns

### 4. **Upload URL Mismatch**
**Status**: ✅ Fixed
**Reason**: Changed from hero-images bucket to images bucket
**Fix**: Updated API to use 'images' bucket

---

## 🔐 Security Checklist

### ✅ Implemented

1. **Environment Variables**
   - ✅ Secrets in .env.local
   - ✅ .env.local in .gitignore
   - ✅ Service role key server-side only

2. **Row Level Security**
   - ✅ Enabled on hero_images table
   - ✅ Public read access
   - ✅ Service role write access

3. **File Validation**
   - ✅ File type checking
   - ✅ File size limit (10MB)
   - ✅ Filename sanitization

4. **Storage Policies**
   - ✅ Public read access
   - ✅ Service role upload only

### ⚠️ Could Improve

1. **Rate Limiting**
   - ❌ No upload rate limiting
   - Could add: Max 10 uploads per minute

2. **Authentication**
   - ❌ Admin page not protected
   - Could add: Login system

3. **CSRF Protection**
   - ⚠️ Relies on Next.js defaults
   - Could add: Custom CSRF tokens

4. **Input Sanitization**
   - ✅ Filename sanitized
   - ⚠️ Category not validated against enum

---

## 📝 API Reference

### Upload Image

**Endpoint**: `POST /api/upload-image`

**Request**:
```typescript
FormData {
  file: File,
  folder: 'hero' | 'portfolio' | 'projects' | 'logos' | 'team' | 'general'
}
```

**Response Success**:
```json
{
  "success": true,
  "filename": "1234567-image.png",
  "folder": "hero",
  "url": "https://snlehtiwmoxqxcglnlwd.supabase.co/storage/v1/object/public/images/hero/1234567-image.png",
  "path": "https://...",
  "message": "File uploaded successfully to hero folder"
}
```

**Response Error**:
```json
{
  "success": false,
  "error": "Invalid file type: image/bmp. Only images are allowed."
}
```

---

### List Images

**Endpoint**: `GET /api/upload-image?folder=hero`

**Response**:
```json
{
  "success": true,
  "images": [
    {
      "filename": "1234567-logo.png",
      "folder": "hero",
      "path": "https://...",
      "url": "https://..."
    }
  ],
  "folder": "hero"
}
```

---

### Get Hero Images

**Endpoint**: `GET /api/hero-images`

**Response**:
```json
{
  "success": true,
  "images": [
    {
      "id": "uuid",
      "filename": "1234567-logo.png",
      "url": "https://...",
      "category": "Logo Design",
      "order": 1,
      "active": true,
      "created_at": "2025-01-30T..."
    }
  ]
}
```

---

### Add Hero Image

**Endpoint**: `POST /api/hero-images`

**Request**:
```json
{
  "filename": "1234567-logo.png",
  "url": "https://...",
  "category": "Logo Design",
  "order": 1
}
```

**Response**:
```json
{
  "success": true,
  "image": { "id": "uuid", ... }
}
```

---

### Update Hero Image

**Endpoint**: `PUT /api/hero-images`

**Request**:
```json
{
  "id": "uuid",
  "category": "Artwork",  // optional
  "order": 2,             // optional
  "active": false         // optional
}
```

---

### Delete Hero Image

**Endpoint**: `DELETE /api/hero-images?id=uuid`

**Response**:
```json
{
  "success": true,
  "message": "Image removed from hero section"
}
```

---

## 🚀 Deployment Checklist

### Vercel Deployment

1. **Environment Variables**
   - [ ] Add NEXT_PUBLIC_SUPABASE_URL
   - [ ] Add NEXT_PUBLIC_SUPABASE_ANON_KEY
   - [ ] Add SUPABASE_SERVICE_ROLE_KEY

2. **Supabase Setup**
   - [ ] Database table created
   - [ ] Storage bucket created
   - [ ] RLS policies set
   - [ ] Storage policies set

3. **Next.js Config**
   - [ ] Image domain whitelisted
   - [ ] Build completes successfully

4. **Testing**
   - [ ] Upload works on production
   - [ ] Images display on production
   - [ ] Admin page accessible

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.93.3",
    "framer-motion": "^12.29.2",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  }
}
```

---

## 🎯 Summary

### What Works
✅ Complete upload system
✅ File organization (6 folders)
✅ Database CRUD operations
✅ Admin interface
✅ Hero background display
✅ Image cycling (repeats with few images)

### What Could Be Added
- Storage cleanup on delete
- Portfolio/Projects pages
- Better error handling
- Batch operations
- Search/filter
- Image editing
- Authentication
- Rate limiting

### Current Limitations
- Only 2 images = lots of repeats (need 8-10)
- No auth on admin page
- No delete from storage
- Unoptimized images (debugging flag)

---

**The system is FULLY FUNCTIONAL** - just needs more images for variety! 🎉
