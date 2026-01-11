# ⚡ QUICK DEPLOYMENT GUIDE - NAMECHEAP HOSTING

## 🎯 **5-MINUTE DEPLOYMENT**

### **What You Need:**
- ✅ Namecheap account with hosting plan
- ✅ Your domain name
- ✅ The file: `cubico-website-package.zip` (already created!)

---

## 📋 **SIMPLE 6-STEP PROCESS**

### **STEP 1: Login to Namecheap**
```
1. Go to: https://www.namecheap.com
2. Click "Sign In"
3. Enter your username & password
```

### **STEP 2: Access cPanel**
```
1. Click "Dashboard" (top right)
2. Go to "Hosting List" (left sidebar)
3. Find your domain
4. Click "Manage" or "Go to cPanel"
```

### **STEP 3: Open File Manager**
```
1. In cPanel, find "FILES" section
2. Click "File Manager" icon
3. Navigate to "public_html" folder
4. Delete any existing files (select all > Delete)
```

### **STEP 4: Upload Your Website**
```
1. Click "Upload" button (top toolbar)
2. Click "Select File"
3. Choose: cubico-website-package.zip
4. Wait for upload to complete (progress bar)
5. Close upload window
```

### **STEP 5: Extract Files**
```
1. Back in File Manager, find "cubico-website-package.zip"
2. Right-click on the ZIP file
3. Click "Extract"
4. Click "Extract Files" button
5. After extraction, DELETE the ZIP file
```

### **STEP 6: Visit Your Website**
```
1. Open a new browser tab
2. Type: https://yourdomain.com
3. 🎉 YOUR WEBSITE IS LIVE!
```

---

## 🔒 **ENABLE HTTPS (SSL Certificate)**

### After deploying, enable SSL:

```
1. In cPanel, search for "SSL/TLS Status" or "AutoSSL"
2. Click on it
3. Find your domain in the list
4. Click "Run AutoSSL"
5. Wait 5-10 minutes
6. Your site will now use HTTPS 🔒
```

---

## ⚙️ **CONFIGURE CONTACT FORM**

Your contact form needs Supabase to work:

### **Option A: Set up Supabase (Recommended)**

1. **Create Supabase account**: https://supabase.com (FREE)
2. **Create new project** (wait 2 minutes)
3. **Run this SQL** (in SQL Editor):
   ```sql
   CREATE TABLE contacts (
       id BIGSERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT NOT NULL,
       phone TEXT,
       service TEXT NOT NULL,
       budget TEXT NOT NULL,
       message TEXT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW()
   );

   ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow anonymous inserts" ON contacts
       FOR INSERT TO anon WITH CHECK (true);
   ```
4. **Get credentials** (Settings > API):
   - Project URL
   - anon/public key
5. **Update config file** in cPanel:
   - File Manager > `public_html/js/supabase-config.js`
   - Click "Edit"
   - Replace `YOUR_SUPABASE_URL_HERE` with your URL
   - Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your key
   - Save

### **Option B: Use Email Form (Simple Alternative)**

If you don't want to set up Supabase, you can use a form service:

1. **Formspree** (free): https://formspree.io
2. **Emailjs** (free): https://www.emailjs.com
3. **Web3Forms** (free): https://web3forms.com

---

## 📊 **FILE STRUCTURE** (What You Uploaded)

```
public_html/
├── index.html          (Home page)
├── services.html       (Services page)
├── process.html        (Process page)
├── contact.html        (Contact page)
├── css/
│   └── style.css       (All styling)
└── js/
    ├── main.js         (Interactivity)
    └── supabase-config.js (Form backend)
```

---

## 🐛 **TROUBLESHOOTING**

### **Website shows 404 or blank page**
- ✅ Check: Is `index.html` in `public_html`?
- ✅ Clear browser cache: `Ctrl + Shift + R`
- ✅ Wait 5 minutes for server to update

### **Website looks broken (no colors/styling)**
- ✅ Check: Is `css` folder in `public_html`?
- ✅ Check: Is `style.css` inside `css` folder?
- ✅ Press F12, check Console for errors

### **Can't find cPanel**
- ✅ Check email from Namecheap (hosting activation)
- ✅ Wait 24-48 hours after purchasing hosting
- ✅ Contact Namecheap support (24/7 chat)

### **Need to make changes**
- ✅ Edit files directly in cPanel File Manager
- ✅ Or re-upload individual files via FTP
- ✅ Or upload new ZIP package

---

## 📞 **GET HELP**

**Namecheap Support:**
- 🌐 Website: https://www.namecheap.com/support/
- 💬 Live Chat: 24/7 (click chat icon in bottom right)
- 📧 Email: Via support ticket system
- 📱 Phone: Available for premium hosting

**Knowledge Base:**
- cPanel Guide: https://www.namecheap.com/support/knowledgebase/article.aspx/9194/5/how-to-use-cpanel
- File Manager: https://www.namecheap.com/support/knowledgebase/article.aspx/855/205/how-to-use-the-file-manager

---

## ✅ **QUICK CHECKLIST**

Before you start:
- [ ] Namecheap account created
- [ ] Hosting plan activated
- [ ] Domain name ready
- [ ] Downloaded `cubico-website-package.zip`

After deployment:
- [ ] Website loads at your domain
- [ ] All pages work (Home, Services, Process, Contact)
- [ ] Website looks good on mobile
- [ ] SSL certificate enabled (HTTPS)
- [ ] Contact form configured (optional)
- [ ] Updated contact information

---

## 🎉 **YOU'RE DONE!**

Your beautiful portfolio website is now live on the internet!

**What's Next?**
1. ✅ Share your website link
2. ✅ Add to social media profiles
3. ✅ Submit to Google Search Console
4. ✅ Set up Google Analytics
5. ✅ Create business email (you@yourdomain.com)

---

**Need the detailed guide?** See: `NAMECHEAP-DEPLOYMENT-GUIDE.md`

**Questions?** Let me know! I'm here to help. 🚀
