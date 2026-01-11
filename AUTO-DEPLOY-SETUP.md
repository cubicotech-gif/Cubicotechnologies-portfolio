# 🚀 AUTOMATED DEPLOYMENT SETUP GUIDE

## Push to GitHub → Automatically Updates Namecheap! ✨

This guide will set up **automatic deployment** so whenever you push code to GitHub, your Namecheap website updates automatically. No manual FTP uploads needed!

---

## 🎯 **HOW IT WORKS**

```
┌─────────────────┐
│  Make Changes   │  ← You or Claude updates your code
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Push to GitHub │  ← Commit and push to repository
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │  ← Automatically triggered
│  (Workflow)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy via FTP  │  ← Uploads files to Namecheap
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Website LIVE! 🎉│  ← Your website is updated
└─────────────────┘
```

**Time from push to live**: ~2-3 minutes! ⚡

---

## 📋 **SETUP STEPS (One-Time Setup)**

### **STEP 1: Get Your Namecheap FTP Credentials**

You need 3 pieces of information from Namecheap:

#### Option A: Use Existing Hosting FTP Credentials

1. **Login to Namecheap** → Dashboard → Hosting List
2. **Click "Manage"** on your hosting
3. **In cPanel**, search for **"FTP Accounts"**
4. **Your main FTP account is shown at the top**:
   - **FTP Server**: Usually `ftp.yourdomain.com` or your server IP
   - **Username**: Usually `username@yourdomain.com`
   - **Password**: If you don't know it, you can reset it here

#### Option B: Create New FTP Account (Recommended for Security)

1. **In cPanel** → **"FTP Accounts"**
2. **Click "Create FTP Account"**
3. **Fill in**:
   - **Login**: `deploy` (or any name you want)
   - **Password**: (generate a strong password)
   - **Directory**: `/public_html`
   - **Quota**: Unlimited
4. **Click "Create FTP Account"**
5. **Note down**:
   - **FTP Server**: `ftp.yourdomain.com`
   - **Username**: `deploy@yourdomain.com`
   - **Password**: (the password you created)

**✅ Write these down - you'll need them in Step 2!**

---

### **STEP 2: Add FTP Credentials to GitHub Secrets**

**⚠️ IMPORTANT**: Never put passwords directly in code! We'll use GitHub Secrets (encrypted storage).

1. **Go to your GitHub repository**:
   ```
   https://github.com/cubicotech-gif/Cubicotechnologies-portfolio
   ```

2. **Click on "Settings"** (top tab)

3. **In left sidebar**, click:
   - **"Secrets and variables"** → **"Actions"**

4. **Click "New repository secret"** button

5. **Add 3 secrets** (one by one):

   **Secret #1: FTP_SERVER**
   - Name: `FTP_SERVER`
   - Value: `ftp.yourdomain.com` (or your server IP)
   - Click "Add secret"

   **Secret #2: FTP_USERNAME**
   - Name: `FTP_USERNAME`
   - Value: `deploy@yourdomain.com` (your FTP username)
   - Click "Add secret"

   **Secret #3: FTP_PASSWORD**
   - Name: `FTP_PASSWORD`
   - Value: `your-ftp-password` (your FTP password)
   - Click "Add secret"

**✅ Your secrets are now stored securely!**

---

### **STEP 3: Enable GitHub Actions**

1. **In your repository**, click **"Actions"** tab (top)
2. **If prompted**, click **"I understand my workflows, go ahead and enable them"**
3. **Done!** GitHub Actions is now enabled

---

### **STEP 4: Test the Deployment**

Now let's test if it works:

#### Option A: Manual Test (Recommended First)

1. **Go to** → **"Actions"** tab in your repository
2. **Click on** → **"🚀 Deploy to Namecheap via FTP"** (left sidebar)
3. **Click** → **"Run workflow"** dropdown (right side)
4. **Select branch**: `claude/deploy-improve-aesthetics-ZaWDJ`
5. **Click** → **"Run workflow"** button
6. **Watch the deployment**:
   - A new workflow run will appear
   - Click on it to see live progress
   - Watch the logs (it takes ~2 minutes)
   - ✅ Should show "Deployment Successful!"

7. **Check your website**: Visit `https://yourdomain.com`
   - Your website should be live! 🎉

#### Option B: Test by Making a Change

1. **Make a small change** to any HTML file (or ask me to!)
2. **Commit and push** to GitHub
3. **GitHub Actions automatically starts**
4. **Within 2-3 minutes**, your website updates!

---

## 🔄 **HOW TO USE (Daily Workflow)**

### **Scenario 1: You Want to Update Your Website**

1. **Ask me**: "Update the homepage hero text to say..."
2. **I make the changes** and commit to GitHub
3. **I push to the repository**
4. **GitHub Actions automatically deploys** (2-3 minutes)
5. **Your website is updated!** ✨

### **Scenario 2: You Make Changes Yourself**

1. **Edit files** on your computer
2. **Commit changes**: `git commit -m "Update contact info"`
3. **Push to GitHub**: `git push`
4. **Wait 2-3 minutes** → Website updated automatically! 🚀

---

## 📊 **VIEWING DEPLOYMENT STATUS**

### **Check Deployment Progress:**

1. **Go to repository** → **"Actions"** tab
2. **See all deployments** in the list
3. **Click any deployment** to see:
   - ✅ What files were deployed
   - ⏱️ How long it took
   - 📋 Detailed logs
   - ❌ Any errors (if failed)

### **Deployment Notifications:**

You can enable email notifications:
1. **GitHub Settings** (your profile) → **Notifications**
2. **Enable "Actions"** notifications
3. **Get emails** when deployments succeed or fail

---

## ⚙️ **CONFIGURATION OPTIONS**

### **Change Which Branch Deploys:**

Edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main              # Change this to your preferred branch
      - production        # Add more branches if needed
```

### **Deploy Only Specific Files:**

Edit the `exclude:` section to control what NOT to deploy.

### **Change Deployment Folder:**

Edit the `server-dir:` setting:

```yaml
server-dir: /public_html/subfolder/    # Deploy to a subfolder
```

### **Test Deployment (Dry Run):**

Change this to test without actually deploying:

```yaml
dry-run: true    # Set to false to actually deploy
```

---

## 🔒 **SECURITY BEST PRACTICES**

✅ **What We've Done Right:**

- ✅ FTP credentials stored in GitHub Secrets (encrypted)
- ✅ Using FTPS (FTP over SSL) for secure transfer
- ✅ Credentials never exposed in code or logs
- ✅ Only necessary files deployed

**Additional Security Tips:**

1. **Use a dedicated FTP account** (not your main cPanel account)
2. **Limit FTP account** to only `/public_html` directory
3. **Use strong passwords** (20+ characters)
4. **Regularly rotate** FTP passwords
5. **Monitor deployments** in GitHub Actions

---

## 🐛 **TROUBLESHOOTING**

### **Deployment Fails - "FTP Connection Error"**

**Fix:**
- ✅ Check FTP_SERVER secret (correct server address?)
- ✅ Check FTP_USERNAME secret (correct format?)
- ✅ Check FTP_PASSWORD secret (correct password?)
- ✅ Verify FTP account exists in Namecheap cPanel
- ✅ Try connecting with FileZilla to test credentials

### **Deployment Succeeds but Website Not Updated**

**Fix:**
- ✅ Check deployment went to correct folder (`/public_html/`)
- ✅ Clear browser cache (Ctrl + Shift + R)
- ✅ Check file permissions in cPanel (files: 644, folders: 755)
- ✅ Verify FTP account has write permissions

### **"Secrets Not Found" Error**

**Fix:**
- ✅ Go to Settings → Secrets and variables → Actions
- ✅ Verify all 3 secrets exist:
  - `FTP_SERVER`
  - `FTP_USERNAME`
  - `FTP_PASSWORD`
- ✅ Re-create secrets if missing

### **Deployment Takes Too Long**

**Normal time**: 2-4 minutes

**If longer than 10 minutes:**
- ✅ Check Namecheap server status
- ✅ Check FTP port (try port 22 for SFTP instead of 21)
- ✅ Contact Namecheap support

### **Files Not Deploying**

**Fix:**
- ✅ Check `exclude:` section in `deploy.yml`
- ✅ Make sure files aren't excluded by mistake
- ✅ Check GitHub Actions logs for which files were uploaded

---

## 📝 **DEPLOYMENT WORKFLOW FILE**

The automation is configured in:
```
.github/workflows/deploy.yml
```

**What it does:**
1. ✅ Triggers on push to main or claude branches
2. ✅ Checks out your code
3. ✅ Shows what will be deployed
4. ✅ Connects to Namecheap via FTPS
5. ✅ Uploads only website files (HTML, CSS, JS)
6. ✅ Excludes unnecessary files (.git, docs, etc.)
7. ✅ Shows deployment summary

---

## 🎯 **WHAT GETS DEPLOYED**

### **✅ Deployed (Uploaded to Namecheap):**
- ✅ `index.html`
- ✅ `services.html`
- ✅ `process.html`
- ✅ `contact.html`
- ✅ `css/style.css`
- ✅ `js/main.js`
- ✅ `js/supabase-config.js`
- ✅ Any images (if you add them)

### **❌ NOT Deployed (Excluded):**
- ❌ `.git` folder
- ❌ README files
- ❌ Deployment guides
- ❌ Shell scripts
- ❌ GitHub Actions folder
- ❌ Package ZIP files

---

## 💡 **TIPS & TRICKS**

### **Tip 1: View Deployment History**

See all past deployments:
- **Actions tab** → Shows complete history
- **See what changed** in each deployment
- **Replay any deployment** if needed

### **Tip 2: Manual Deployment**

Deploy without making code changes:
- **Actions tab** → **"Run workflow"**
- **Useful for** re-deploying after server issues

### **Tip 3: Multiple Environments**

You can set up:
- `main` branch → Production site
- `staging` branch → Staging/test site
- Different FTP credentials for each

### **Tip 4: Deployment Notifications**

Get Slack/Discord notifications:
- Add notification steps to workflow
- Get alerted when deployments succeed/fail

---

## 🎉 **BENEFITS OF AUTO-DEPLOYMENT**

✅ **No Manual FTP Uploads** - Just push code!
✅ **Faster Updates** - Deploy in 2-3 minutes
✅ **No Mistakes** - Automated, consistent deployments
✅ **Version Control** - Every deployment tracked in GitHub
✅ **Easy Rollback** - Revert to previous version anytime
✅ **Secure** - Credentials encrypted in GitHub Secrets
✅ **Team Friendly** - Multiple people can deploy safely
✅ **Professional** - Industry-standard CI/CD workflow

---

## 📚 **WHAT YOU'VE SET UP**

You now have a **professional CI/CD pipeline**:

```
GitHub (Source Code)
    ↓
GitHub Actions (Automation)
    ↓
Namecheap Hosting (Live Website)
```

**This is the same system used by**:
- Fortune 500 companies
- Professional development teams
- Modern web applications

**And you have it for FREE!** 🎉

---

## 🚀 **QUICK REFERENCE**

### **Deploy Website:**
```bash
git add .
git commit -m "Update website"
git push
# Wait 2-3 minutes → Website updated!
```

### **View Deployments:**
```
GitHub.com → Your Repo → Actions Tab
```

### **Manual Deploy:**
```
Actions Tab → Run workflow → Select branch → Run
```

### **Update FTP Credentials:**
```
Settings → Secrets and variables → Actions → Edit secrets
```

---

## ✅ **SETUP CHECKLIST**

- [ ] Got FTP credentials from Namecheap
- [ ] Added FTP_SERVER to GitHub Secrets
- [ ] Added FTP_USERNAME to GitHub Secrets
- [ ] Added FTP_PASSWORD to GitHub Secrets
- [ ] Enabled GitHub Actions
- [ ] Tested manual deployment
- [ ] Deployment succeeded
- [ ] Website updated and live
- [ ] Understood how to use daily

---

## 🎊 **YOU'RE ALL SET!**

**Your automated deployment pipeline is ready!**

**From now on:**
1. You (or I) make changes to code
2. Push to GitHub
3. Website automatically updates in 2-3 minutes
4. That's it! ✨

**No more:**
- ❌ Manual FTP uploads
- ❌ Forgetting which files to upload
- ❌ Uploading to wrong folder
- ❌ Overwriting files by mistake

**Just:**
- ✅ Push code
- ✅ Wait 2 minutes
- ✅ Website updated! 🚀

---

## 📞 **NEED HELP?**

If you have questions about:
- Setting up FTP credentials
- Adding GitHub Secrets
- Understanding deployment logs
- Troubleshooting errors
- Customizing the workflow

**Just ask!** I'm here to help you get this working perfectly. 🎉

---

**Your website now has professional-grade automated deployment!** 🚀✨
