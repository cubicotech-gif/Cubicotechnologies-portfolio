# 🚀 Namecheap Hosting Deployment Guide

## Complete Guide to Deploy Your Portfolio Website to Namecheap

---

## 📋 **WHAT YOU NEED**

- ✅ Namecheap domain (you already have this)
- ✅ Namecheap hosting plan (Shared Hosting, WordPress Hosting, or VPS)
- ✅ cPanel access credentials
- ✅ Your website files (ready in this repository)

---

## 🎯 **DEPLOYMENT OPTIONS**

### **Option 1: Using cPanel File Manager (Easiest - Recommended)**
### **Option 2: Using FTP/SFTP Client (FileZilla)**
### **Option 3: Using Git Deployment (Advanced)**

---

## 📦 **STEP 1: PREPARE YOUR FILES**

### Files to Upload:
```
📁 Your Namecheap hosting root (public_html)
├── index.html
├── services.html
├── process.html
├── contact.html
├── 📁 css/
│   └── style.css
└── 📁 js/
    ├── main.js
    └── supabase-config.js
```

### ⚠️ Important Notes:
- **DO NOT** upload: `.git` folder, `README.md`, `NAMECHEAP-DEPLOYMENT-GUIDE.md`
- **ONLY** upload: HTML files, CSS folder, JS folder
- Upload to `public_html` folder (this is your website root)

---

## 🌐 **OPTION 1: DEPLOY USING cPANEL FILE MANAGER**

### Step 1: Access cPanel

1. **Login to Namecheap**
   - Go to: https://www.namecheap.com
   - Click "Sign In"
   - Enter your credentials

2. **Access Your Hosting Dashboard**
   - Go to **Dashboard** > **Hosting List**
   - Find your domain
   - Click **"Manage"** or **"Go to cPanel"**

3. **Open cPanel**
   - You'll see the cPanel dashboard
   - Look for **"File Manager"** icon
   - Click on it

### Step 2: Navigate to Public Directory

1. In File Manager, navigate to: `public_html`
2. This is where your website files go
3. **Clear existing files** (if any):
   - Select all files (usually default Namecheap placeholder files)
   - Click **"Delete"**
   - Confirm deletion

### Step 3: Upload Your Website Files

#### Method A: Upload Individual Files

1. **Click "Upload"** button at the top
2. **Select files**:
   - Upload `index.html`
   - Upload `services.html`
   - Upload `process.html`
   - Upload `contact.html`
3. **Wait for uploads to complete**

#### Method B: Upload as ZIP (Faster - Recommended)

1. **First, create a ZIP file on your computer**:
   ```bash
   # Run this command in your project directory
   zip -r website.zip . -x "*.git*" -x "*README.md" -x "*DEPLOYMENT*"
   ```

   Or manually create a ZIP containing:
   - All HTML files
   - css/ folder
   - js/ folder

2. **In cPanel File Manager**:
   - Click **"Upload"**
   - Select your `website.zip` file
   - Wait for upload to complete

3. **Extract the ZIP**:
   - Go back to File Manager
   - Find `website.zip` in `public_html`
   - Right-click on it
   - Select **"Extract"**
   - Confirm extraction
   - Delete `website.zip` after extraction

### Step 4: Create Folders (if uploaded individually)

1. **Create CSS folder**:
   - Click **"+ Folder"** button
   - Name it: `css`
   - Click **"Create New Folder"**

2. **Create JS folder**:
   - Click **"+ Folder"** button
   - Name it: `js`
   - Click **"Create New Folder"**

3. **Upload files to folders**:
   - Open `css` folder
   - Upload `style.css`
   - Go back
   - Open `js` folder
   - Upload `main.js` and `supabase-config.js`

### Step 5: Set Permissions

1. **Select all files and folders**
2. **Click "Permissions"** at the top
3. **Set permissions**:
   - Files: `644` (Owner: Read+Write, Group: Read, Public: Read)
   - Folders: `755` (Owner: All, Group: Read+Execute, Public: Read+Execute)
4. **Check "Recurse into subdirectories"**
5. **Click "Change Permissions"**

### Step 6: Verify Deployment

1. **Open your browser**
2. **Visit your domain**: `https://yourdomain.com`
3. **Your website should load!** 🎉

---

## 🔧 **OPTION 2: DEPLOY USING FTP/SFTP (FileZilla)**

### Step 1: Get FTP Credentials

1. **In cPanel**, find **"FTP Accounts"**
2. **Create FTP Account**:
   - Username: `yoursite@yourdomain.com`
   - Password: (create a strong password)
   - Directory: `public_html`
   - Click **"Create FTP Account"**

3. **Note down**:
   - FTP Server: `ftp.yourdomain.com` or your server IP
   - FTP Username: `yoursite@yourdomain.com`
   - FTP Password: (the one you created)
   - Port: `21` (FTP) or `22` (SFTP)

### Step 2: Download FileZilla

1. **Download**: https://filezilla-project.org/
2. **Install** FileZilla Client (free)

### Step 3: Connect to Your Hosting

1. **Open FileZilla**
2. **Enter connection details** at the top:
   - Host: `ftp.yourdomain.com`
   - Username: `yoursite@yourdomain.com`
   - Password: (your FTP password)
   - Port: `21`
3. **Click "Quickconnect"**
4. **Accept certificate** if prompted

### Step 4: Upload Files

1. **Left side** = Your local computer
2. **Right side** = Your hosting server

3. **Navigate on right side** to: `/public_html`
4. **Delete any existing files** on the server

5. **On left side**, navigate to your project folder:
   `/home/user/Cubicotechnologies-portfolio`

6. **Select and drag** to the right side:
   - `index.html`
   - `services.html`
   - `process.html`
   - `contact.html`
   - `css/` folder (entire folder)
   - `js/` folder (entire folder)

7. **Wait for transfer to complete**

### Step 5: Verify Upload

1. **In FileZilla right panel**, you should see:
   ```
   /public_html/
   ├── index.html
   ├── services.html
   ├── process.html
   ├── contact.html
   ├── css/
   └── js/
   ```

2. **Visit your domain** to test!

---

## 🎯 **OPTION 3: DEPLOY USING GIT (Advanced)**

### Prerequisites:
- SSH access enabled on your Namecheap hosting
- Git installed on your hosting server

### Steps:

1. **Enable SSH in cPanel**
   - Go to cPanel > Security > SSH Access
   - Enable SSH
   - Generate SSH keys if needed

2. **Connect via SSH**
   ```bash
   ssh username@yourdomain.com
   ```

3. **Navigate to public_html**
   ```bash
   cd public_html
   ```

4. **Clone your repository**
   ```bash
   git clone https://github.com/cubicotech-gif/Cubicotechnologies-portfolio.git temp
   ```

5. **Move files to root**
   ```bash
   mv temp/*.html .
   mv temp/css .
   mv temp/js .
   rm -rf temp
   ```

6. **Set permissions**
   ```bash
   chmod 644 *.html
   chmod 755 css js
   chmod 644 css/* js/*
   ```

---

## 🔒 **SSL CERTIFICATE (HTTPS)**

### Enable Free SSL Certificate:

1. **In cPanel**, find **"SSL/TLS Status"** or **"AutoSSL"**
2. **Select your domain**
3. **Click "Run AutoSSL"**
4. **Wait 5-10 minutes** for certificate installation
5. **Your site will now use HTTPS** 🔒

### Force HTTPS Redirect:

1. **In cPanel File Manager**, edit `.htaccess` in `public_html`
   (Create it if it doesn't exist)

2. **Add this code**:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

3. **Save the file**
4. **Now all HTTP traffic redirects to HTTPS**

---

## ⚙️ **POST-DEPLOYMENT CONFIGURATION**

### 1. Setup Supabase for Contact Form

**In your cPanel File Manager:**

1. Navigate to: `public_html/js/supabase-config.js`
2. Click **"Edit"**
3. Replace these lines:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
   ```

   With your actual credentials:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-actual-anon-key-here';
   ```
4. **Save Changes**

### 2. Update Contact Information

Edit these files to add your real contact info:

- `index.html` (line ~185)
- `services.html` (footer section)
- `process.html` (footer section)
- `contact.html` (contact section and footer)

Update:
- Email address
- Phone number
- Physical address
- Social media links

### 3. Update Copyright Year

In all HTML files, update footer:
```html
<p>&copy; 2024 Cubico Technologies. All rights reserved.</p>
```
Change `2024` to current year or use dynamic year (already in JS).

---

## 🐛 **TROUBLESHOOTING**

### Problem: Website shows 404 or Namecheap placeholder

**Solution:**
- Make sure files are in `public_html` not `public_html/yourfolder`
- Ensure `index.html` is in the root of `public_html`
- Clear browser cache (Ctrl+Shift+R)

### Problem: CSS/JS not loading (website looks broken)

**Solution:**
- Check folder names: must be `css` and `js` (lowercase)
- Verify file paths in HTML are correct
- Check file permissions: folders `755`, files `644`
- Check browser console (F12) for errors

### Problem: Can't access cPanel

**Solution:**
- Check Namecheap email for hosting activation
- Wait 24-48 hours after purchasing hosting
- Contact Namecheap support: https://www.namecheap.com/support/

### Problem: SSL certificate not working

**Solution:**
- Wait 24 hours after domain setup
- Ensure domain DNS is pointing to Namecheap hosting
- Run AutoSSL in cPanel again
- Contact Namecheap support for assistance

### Problem: Contact form not submitting

**Solution:**
- Configure Supabase credentials in `js/supabase-config.js`
- Check browser console (F12) for errors
- Ensure Supabase table is created correctly
- Test in different browsers

---

## 📊 **DNS CONFIGURATION (If Domain is External)**

If your domain is registered elsewhere:

### Update Nameservers:

**Get Namecheap nameservers from your hosting dashboard:**
- Usually: `dns1.registrar-servers.com`
- And: `dns2.registrar-servers.com`

**Update at your domain registrar:**
1. Login to your domain registrar
2. Find DNS/Nameserver settings
3. Replace existing nameservers with Namecheap's
4. Save changes
5. **Wait 24-48 hours** for propagation

---

## ✅ **DEPLOYMENT CHECKLIST**

- [ ] Logged into Namecheap account
- [ ] Accessed cPanel
- [ ] Navigated to `public_html`
- [ ] Deleted default/old files
- [ ] Uploaded all HTML files
- [ ] Created `css` and `js` folders
- [ ] Uploaded CSS files to `css/` folder
- [ ] Uploaded JS files to `js/` folder
- [ ] Set correct file permissions (644 for files, 755 for folders)
- [ ] Configured SSL certificate (HTTPS)
- [ ] Updated Supabase configuration
- [ ] Updated contact information
- [ ] Tested website in browser
- [ ] Tested on mobile device
- [ ] Tested contact form
- [ ] Checked all pages (Home, Services, Process, Contact)
- [ ] Verified social media links
- [ ] Set up website analytics (optional)

---

## 🎉 **QUICK START SUMMARY**

**5-Minute Deployment:**

1. **Login to cPanel** (from Namecheap dashboard)
2. **Open File Manager** > Navigate to `public_html`
3. **Delete** existing files
4. **Upload** your website files (or upload ZIP and extract)
5. **Visit** your domain → Website is live! 🚀

**That's it!** Your beautiful portfolio website is now live on Namecheap hosting with your custom domain.

---

## 📞 **NEED HELP?**

- **Namecheap Support**: https://www.namecheap.com/support/
- **Live Chat**: Available 24/7 in Namecheap dashboard
- **Knowledge Base**: https://www.namecheap.com/support/knowledgebase/

---

## 🎨 **WHAT'S NEXT?**

After deployment:

1. ✅ Set up **Google Analytics** for visitor tracking
2. ✅ Configure **Supabase** for contact form
3. ✅ Add **Google Search Console** for SEO
4. ✅ Set up **email forwarding** (info@yourdomain.com)
5. ✅ Create **business email** accounts
6. ✅ Add **social media** links
7. ✅ Test on multiple devices and browsers
8. ✅ Share your website! 🎉

---

**Your website is production-ready and looks absolutely stunning!** 🚀

Need help with any step? Let me know!
