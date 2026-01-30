# Firebase Storage Setup Guide

This guide will help you set up Firebase Storage for image uploads in your portfolio website.

## Why Firebase?

- ✅ **Free Tier**: 5GB storage + 1GB/day downloads (more than enough!)
- ✅ **Google Infrastructure**: Fast, reliable, global CDN
- ✅ **No Credit Card Required**: Free tier doesn't require payment info
- ✅ **Works on Vercel**: Perfect for serverless deployments

---

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `cubico-portfolio` (or any name you like)
4. **Disable** Google Analytics (not needed for storage)
5. Click **"Create project"**
6. Wait for project to be created
7. Click **"Continue"**

### 2. Enable Firebase Storage

1. In the left sidebar, click **"Build"** → **"Storage"**
2. Click **"Get started"**
3. **Security Rules**: Select **"Start in production mode"** (we'll set it to public later)
4. Click **"Next"**
5. **Storage location**: Choose closest to your users (e.g., `us-central` for USA)
6. Click **"Done"**

### 3. Set Storage Rules (Make Public)

1. Still in **Storage**, click the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;  // Anyone can read
      allow write: if false; // Only your server can write
    }
  }
}
```

3. Click **"Publish"**

### 4. Get Firebase Configuration

#### A. Get Public Config (Web App Config)

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"**
4. Click the **Web icon** `</>`
5. Register app:
   - App nickname: `cubico-portfolio-web`
   - **Don't** check "Also set up Firebase Hosting"
   - Click **"Register app"**
6. You'll see **firebaseConfig** object. Copy these values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",           // ← Copy this
  authDomain: "your-project.firebaseapp.com",              // ← Copy this
  projectId: "your-project",                                // ← Copy this
  storageBucket: "your-project.appspot.com",               // ← Copy this
  messagingSenderId: "123456789012",                       // ← Copy this
  appId: "1:123456789012:web:abcdef123456"                 // ← Copy this
};
```

#### B. Get Admin SDK (Service Account)

1. Still in **Project settings**, click the **"Service accounts"** tab
2. Click **"Generate new private key"**
3. Click **"Generate key"** (a JSON file will download)
4. **IMPORTANT**: Keep this file safe! It contains admin credentials.

Open the downloaded JSON file. You'll need these values:
- `client_email`: `firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com`
- `private_key`: `"-----BEGIN PRIVATE KEY-----\n..."`

### 5. Configure Environment Variables

#### Local Development (.env.local)

Create or update `/nextjs-site/.env.local`:

```env
# Public Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Firebase Admin (from service account JSON)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...(your private key)...\n-----END PRIVATE KEY-----\n"
```

**IMPORTANT**: For `FIREBASE_PRIVATE_KEY`:
- Keep the quotes
- Keep the `\n` at the beginning and end
- Copy the entire key from the JSON file

#### Production (Vercel)

1. Go to **https://vercel.com/dashboard**
2. Select your project
3. **Settings** → **Environment Variables**
4. Add **ALL 8 variables** from above (copy/paste from .env.local)
5. Click **"Save"** for each one

**Vercel Tip**: For the private key, you can paste the entire key with line breaks or use `\n` - both work!

### 6. Test Locally

```bash
cd nextjs-site
npm run dev
```

Visit `http://localhost:3000/admin/hero` and try uploading an image!

### 7. Deploy to Vercel

```bash
git add .
git commit -m "Add Firebase Storage"
git push
```

Vercel will auto-deploy. After deployment, test the upload on your live site!

---

## Troubleshooting

### Error: "Could not load the default credentials"

**Solution**: Make sure all environment variables are set correctly. Check for typos!

### Error: "Permission denied"

**Solution**: Make sure Storage Rules are set to public read:

```javascript
allow read: if true;
allow write: if false;
```

### Images not showing

**Solution**: Make sure the file was made public. The upload API calls `makePublic()` automatically.

### Private key format issues

**Solution**: The private key should be on ONE line with `\n` for line breaks:

```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBAD...\n-----END PRIVATE KEY-----\n"
```

---

## Firebase Console Quick Links

- **Project Overview**: https://console.firebase.google.com/project/your-project/overview
- **Storage**: https://console.firebase.google.com/project/your-project/storage
- **Settings**: https://console.firebase.google.com/project/your-project/settings/general

---

## Security Notes

- ✅ **Public Firebase Config** (NEXT_PUBLIC_*): Safe to expose in browser
- ⚠️ **Private Key**: NEVER commit to Git (already in .gitignore)
- ⚠️ **Service Account**: Only use on server-side (API routes)

---

## Free Tier Limits

- **Storage**: 5 GB
- **Downloads**: 1 GB/day
- **Uploads**: 20,000/day

For a portfolio with ~100 images (~50MB total), you'll use **less than 1% of the free tier**!

---

## Need Help?

If you get stuck, check:
1. Firebase Console → Storage → Files (are files being uploaded?)
2. Browser Console (F12) for error messages
3. Vercel deployment logs

---

Happy uploading! 🚀
