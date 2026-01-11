# Cubico Technologies Website

A professional 4-page website for Cubico Technologies, featuring Islamic educational content, animations, and digital solutions.

## 📁 Project Structure

```
cubico-website/
├── index.html          # Home page
├── services.html       # Services page
├── process.html        # Our Process page
├── contact.html        # Contact page with form
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── main.js         # General JavaScript
│   └── supabase-config.js  # Supabase integration
└── README.md           # This file
```

## 🚀 Deployment Guide

### Step 1: Upload to GitHub

1. **Create a GitHub Account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Click "Sign Up" and follow the steps

2. **Create a New Repository**
   - Click the "+" icon in the top right → "New repository"
   - Name it `cubico-website` (or any name you prefer)
   - Set to **Public** (for Vercel free tier)
   - Click "Create repository"

3. **Upload Files via GitHub Web Interface**
   - Click "uploading an existing file"
   - Drag and drop ALL your website files
   - Make sure to include the folder structure (css/, js/)
   - Add commit message: "Initial website upload"
   - Click "Commit changes"

   **Alternative: Upload via Git Command Line**
   ```bash
   # Navigate to your website folder
   cd cubico-website

   # Initialize Git
   git init

   # Add all files
   git add .

   # Commit
   git commit -m "Initial website upload"

   # Add remote repository (replace with your URL)
   git remote add origin https://github.com/YOUR_USERNAME/cubico-website.git

   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy on Vercel

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" → "Continue with GitHub"
   - Authorize Vercel to access your GitHub

2. **Import Your Repository**
   - From Vercel dashboard, click "Add New..." → "Project"
   - Find and select your `cubico-website` repository
   - Click "Import"

3. **Configure Project Settings**
   - Framework Preset: **Other** (since it's plain HTML)
   - Root Directory: Leave as `.` (current directory)
   - Build Command: Leave empty
   - Output Directory: Leave empty

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 30-60 seconds)
   - Your site is now live at `https://cubico-website.vercel.app` (or similar URL)

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `cubico.tech`)
   - Follow Vercel's DNS configuration instructions

---

### Step 3: Set Up Supabase (Database for Contact Form)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with GitHub (recommended) or email

2. **Create a New Project**
   - Click "New project"
   - Select your organization
   - Enter project details:
     - Name: `cubico-contacts`
     - Database Password: Create a strong password (save this!)
     - Region: Choose closest to your users
   - Click "Create new project"
   - Wait for setup (~2 minutes)

3. **Create the Contacts Table**
   - Go to **SQL Editor** (left sidebar)
   - Click "New Query"
   - Paste this SQL and click "Run":

   ```sql
   -- Create contacts table
   CREATE TABLE contacts (
     id BIGSERIAL PRIMARY KEY,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT,
     service TEXT,
     budget TEXT,
     message TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     is_read BOOLEAN DEFAULT FALSE,
     notes TEXT
   );

   -- Enable Row Level Security (RLS)
   ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

   -- Create policy to allow inserts from anonymous users
   CREATE POLICY "Allow anonymous inserts" ON contacts
     FOR INSERT
     WITH CHECK (true);

   -- Create policy to allow authenticated users to read
   CREATE POLICY "Allow authenticated reads" ON contacts
     FOR SELECT
     USING (auth.role() = 'authenticated');

   -- Create indexes for performance
   CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
   CREATE INDEX idx_contacts_email ON contacts(email);

   -- Grant permissions
   GRANT INSERT ON contacts TO anon;
   GRANT SELECT ON contacts TO authenticated;
   ```

4. **Get Your API Credentials**
   - Go to **Settings** (gear icon) → **API**
   - Copy these values:
     - **Project URL**: `https://xxxxxxxx.supabase.co`
     - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5...`

5. **Update Your Website Code**
   - Open `js/supabase-config.js`
   - Replace the placeholder values:

   ```javascript
   const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

6. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Add Supabase configuration"
   git push
   ```
   
   Vercel will automatically redeploy with your changes.

7. **Test the Contact Form**
   - Visit your live website
   - Fill out and submit the contact form
   - Check Supabase → Table Editor → contacts to see submissions

---

### Step 4: View Contact Submissions

1. **In Supabase Dashboard**
   - Go to **Table Editor** → **contacts**
   - You'll see all form submissions
   - Click on a row to see full details

2. **Mark as Read**
   - Click on a row
   - Change `is_read` to `true`
   - Add notes if needed

---

## 🛠 Customization

### Update Contact Information
Edit the following in all HTML files:
- Email: Search for `info@cubico.tech`
- Phone: Search for `+92 XXX XXXXXXX`
- Address: Search for `Karachi, Pakistan`

### Update Social Media Links
In the footer section of each HTML file, update the `href` attributes for social media links.

### Change Colors
Edit CSS variables in `css/style.css`:
```css
:root {
  --primary: #0d4f4f;      /* Main teal color */
  --accent: #d4a853;       /* Gold accent */
  /* ... other colors */
}
```

### Add Real Images
Replace the emoji placeholders with actual images:
1. Add images to an `images/` folder
2. Update `src` attributes in HTML files

---

## 📱 Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth scroll animations
- ✅ Modern, professional design
- ✅ Contact form with validation
- ✅ Supabase database integration
- ✅ SEO-friendly structure
- ✅ Fast loading (no heavy frameworks)

---

## 🔧 Troubleshooting

### Form not submitting?
1. Check browser console for errors (F12 → Console)
2. Verify Supabase credentials are correct
3. Ensure RLS policies are set up correctly

### Styling not loading?
1. Verify file paths are correct
2. Clear browser cache (Ctrl + Shift + R)

### Vercel deployment failed?
1. Check all files are in the repository
2. Ensure no syntax errors in HTML/CSS/JS

---

## 📞 Support

For questions or issues with this website:
- Review the code comments
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)

---

## 📄 License

This website template is created for Cubico Technologies.

---

*Built with ❤️ for Islamic educational excellence*
