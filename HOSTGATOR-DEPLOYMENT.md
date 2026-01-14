# 🚀 HOSTGATOR DEPLOYMENT GUIDE - Complete Step-by-Step

## Your Situation: WordPress Site Already Running

**Current Setup:**
- ✅ HostGator hosting account
- ✅ WordPress website with 4 pages
- ✅ Domain connected to HostGator
- 🆕 Want to deploy new portfolio website

**⚠️ IMPORTANT:** We need to choose where to deploy your new portfolio to avoid overwriting WordPress!

---

## 🎯 **DEPLOYMENT OPTIONS**

### **OPTION 1: Replace WordPress (Complete Replacement)**

**What Happens:**
- ❌ WordPress site is **REMOVED**
- ✅ New portfolio becomes **main website**
- 📍 URL: `https://yourdomain.com`

**When to Choose:**
- You don't need WordPress anymore
- You want only the new portfolio site
- You've backed up WordPress (just in case)

**Deployment Location:** `/public_html/`

---

### **OPTION 2: Subdomain (RECOMMENDED) ⭐**

**What Happens:**
- ✅ WordPress **stays at** `https://yourdomain.com`
- ✅ Portfolio **lives at** `https://portfolio.yourdomain.com`
- 🎯 Both websites **fully functional**

**When to Choose:**
- You want to keep WordPress
- You want clean separation
- Professional setup

**Deployment Location:** `/public_html/portfolio/` (subdomain folder)

**Example URLs:**
- Main site (WordPress): `https://cubicotechnologies.com`
- Portfolio: `https://portfolio.cubicotechnologies.com`

---

### **OPTION 3: Subfolder**

**What Happens:**
- ✅ WordPress **stays at** `https://yourdomain.com`
- ✅ Portfolio **lives at** `https://yourdomain.com/portfolio`
- 🎯 Both websites **accessible**

**When to Choose:**
- Want to keep WordPress
- Don't need separate subdomain
- Simpler setup

**Deployment Location:** `/public_html/portfolio/`

**Example URLs:**
- Main site (WordPress): `https://cubicotechnologies.com`
- Portfolio: `https://cubicotechnologies.com/portfolio`

---

## 📋 **CHOOSE YOUR OPTION**

**Which option do you want?**

Tell me, and I'll give you exact steps for that option!

For now, I'll provide guides for **ALL THREE OPTIONS** below.

---

---

# 🔧 OPTION 1: REPLACE WORDPRESS

## ⚠️ **WARNING: This will DELETE your WordPress site!**

### **Before Starting - BACKUP WordPress:**

1. **Login to HostGator cPanel**
2. **Find "Backup Wizard"**
3. **Click "Backup"**
4. **Download "Home Directory"** backup
5. **Download "MySQL Databases"** backup
6. **Save backups** to your computer

### **Step-by-Step Deployment:**

#### **STEP 1: Get HostGator FTP Credentials**

1. **Login to HostGator** → **cPanel**
2. **Find "FTP Accounts"** (under Files section)
3. **Your main FTP account** is shown at top:
   - Server: Usually your domain or `gator1234.hostgator.com`
   - Username: Your cPanel username
   - Password: Your cPanel password (or create new FTP user)

4. **OR Create Dedicated FTP Account:**
   - Click "Add FTP Account"
   - Login: `deploy`
   - Password: (create strong password)
   - Directory: `public_html`
   - Click "Create FTP Account"

5. **Write Down:**
   - ✏️ FTP Server: `yourdomain.com` or `gator1234.hostgator.com`
   - ✏️ Username: `deploy@yourdomain.com`
   - ✏️ Password: (your FTP password)

#### **STEP 2: Clear WordPress Files**

1. **In cPanel** → **File Manager**
2. **Navigate to:** `/public_html/`
3. **Select ALL files and folders**
4. **Click "Delete"** (⚠️ This removes WordPress!)
5. **Confirm deletion**

#### **STEP 3: Add FTP to GitHub Secrets**

1. **Go to:** https://github.com/cubicotech-gif/Cubicotechnologies-portfolio
2. **Settings** → **Secrets and variables** → **Actions**
3. **Add 3 secrets:**

   ```
   Name: FTP_SERVER
   Value: yourdomain.com
   ```

   ```
   Name: FTP_USERNAME
   Value: deploy@yourdomain.com
   ```

   ```
   Name: FTP_PASSWORD
   Value: your-ftp-password
   ```

#### **STEP 4: Update Deployment Path**

The workflow is already set to deploy to `/public_html/` - perfect for replacing WordPress!

#### **STEP 5: Deploy**

1. **Go to** → **Actions** tab in GitHub
2. **Click** → **"Run workflow"**
3. **Select branch:** `claude/deploy-improve-aesthetics-ZaWDJ`
4. **Click** → **"Run workflow"**
5. **Wait 2-3 minutes**
6. **Visit:** `https://yourdomain.com` ✨

**Your new portfolio is LIVE!** (WordPress is gone)

---

---

# 🔧 OPTION 2: SUBDOMAIN (RECOMMENDED)

## ✅ **Keeps WordPress + Adds Portfolio**

### **Step-by-Step Deployment:**

#### **STEP 1: Create Subdomain in HostGator**

1. **Login to HostGator cPanel**
2. **Find "Subdomains"** (under Domains section)
3. **Create Subdomain:**
   - Subdomain: `portfolio`
   - Domain: Select your main domain
   - Document Root: Should auto-fill as `public_html/portfolio`
4. **Click "Create"**

**Your subdomain is created!**
- URL will be: `https://portfolio.yourdomain.com`
- Files go in: `/public_html/portfolio/`

#### **STEP 2: Get HostGator FTP Credentials**

1. **In cPanel** → **"FTP Accounts"**
2. **Create FTP Account:**
   - Login: `deploy`
   - Password: (create strong password)
   - Directory: `/public_html/portfolio` ⚠️ **Important: point to subdomain folder!**
   - Click "Create FTP Account"

3. **Write Down:**
   - ✏️ FTP Server: `yourdomain.com` or `gator1234.hostgator.com`
   - ✏️ Username: `deploy@yourdomain.com`
   - ✏️ Password: (your FTP password)

#### **STEP 3: Add FTP to GitHub Secrets**

1. **Go to:** https://github.com/cubicotech-gif/Cubicotechnologies-portfolio
2. **Settings** → **Secrets and variables** → **Actions**
3. **Add or Update 3 secrets:**

   ```
   Name: FTP_SERVER
   Value: yourdomain.com
   ```

   ```
   Name: FTP_USERNAME
   Value: deploy@yourdomain.com
   ```

   ```
   Name: FTP_PASSWORD
   Value: your-ftp-password
   ```

#### **STEP 4: Update Deployment Path**

I need to update the workflow to deploy to the subdomain folder.

**Tell me your subdomain name** and I'll update the workflow file!

Or you can manually edit `.github/workflows/deploy.yml`:

Find this line:
```yaml
server-dir: /public_html/
```

Change to:
```yaml
server-dir: /public_html/portfolio/
```

#### **STEP 5: Deploy**

1. **Go to** → **Actions** tab in GitHub
2. **Click** → **"Run workflow"**
3. **Select branch:** `claude/deploy-improve-aesthetics-ZaWDJ`
4. **Click** → **"Run workflow"**
5. **Wait 2-3 minutes**
6. **Visit:** `https://portfolio.yourdomain.com` ✨

**Your portfolio is LIVE!**
- WordPress: `https://yourdomain.com` ✅ Still working
- Portfolio: `https://portfolio.yourdomain.com` ✅ New!

---

---

# 🔧 OPTION 3: SUBFOLDER

## ✅ **Keeps WordPress + Portfolio in Subfolder**

### **Step-by-Step Deployment:**

#### **STEP 1: Create Folder in public_html**

1. **Login to HostGator cPanel**
2. **Open "File Manager"**
3. **Navigate to:** `/public_html/`
4. **Click "+ Folder"**
5. **Name:** `portfolio`
6. **Click "Create New Folder"**

**Folder created!**
- Files will go in: `/public_html/portfolio/`
- URL will be: `https://yourdomain.com/portfolio`

#### **STEP 2: Get HostGator FTP Credentials**

1. **In cPanel** → **"FTP Accounts"**
2. **Create FTP Account:**
   - Login: `deploy`
   - Password: (create strong password)
   - Directory: `/public_html` (FTP user can access whole public_html)
   - Click "Create FTP Account"

3. **Write Down:**
   - ✏️ FTP Server: `yourdomain.com`
   - ✏️ Username: `deploy@yourdomain.com`
   - ✏️ Password: (your FTP password)

#### **STEP 3: Add FTP to GitHub Secrets**

Same as Option 2 - add the 3 secrets to GitHub.

#### **STEP 4: Update Deployment Path**

Edit `.github/workflows/deploy.yml`:

Find:
```yaml
server-dir: /public_html/
```

Change to:
```yaml
server-dir: /public_html/portfolio/
```

#### **STEP 5: Deploy**

1. **Actions** tab → **Run workflow**
2. **Wait 2-3 minutes**
3. **Visit:** `https://yourdomain.com/portfolio` ✨

**Both sites live!**
- WordPress: `https://yourdomain.com` ✅
- Portfolio: `https://yourdomain.com/portfolio` ✅

---

---

# 🎯 QUICK COMPARISON

| Feature | Replace WordPress | Subdomain | Subfolder |
|---------|------------------|-----------|-----------|
| **WordPress Safe?** | ❌ Deleted | ✅ Safe | ✅ Safe |
| **Portfolio URL** | `yourdomain.com` | `portfolio.yourdomain.com` | `yourdomain.com/portfolio` |
| **Professional?** | ✅ Clean | ✅ Very Professional | ✅ Professional |
| **Easy Setup?** | ✅ Simple | ⚠️ Requires subdomain | ✅ Simple |
| **SEO** | ✅ Best | ✅ Good | ✅ Good |
| **Recommended?** | Only if no WP needed | ⭐ **BEST** | ✅ Good alternative |

---

# 📞 WHAT DO YOU WANT?

**Tell me:**

1. **Which option** do you prefer? (1, 2, or 3)
2. **Your domain name** (so I can give exact examples)
3. **Do you want to keep WordPress?** (Yes/No)

**Then I'll:**
- ✅ Update the deployment workflow for your choice
- ✅ Give you exact step-by-step commands
- ✅ Help you set up FTP credentials
- ✅ Test the deployment with you
- ✅ Make sure everything works perfectly!

---

# 🚀 AUTOMATED DEPLOYMENT WORKS WITH HOSTGATOR!

**The good news:** Everything I set up works with HostGator!

**How it works:**
1. You give me your FTP credentials (we add to GitHub Secrets)
2. I update the deployment path for your choice
3. You push code → Website updates automatically!
4. Same 2-3 minute deployment time ⚡

**HostGator + GitHub Actions = Professional Workflow** 🎉

---

**Ready to proceed? Tell me which option you want!** 🚀
