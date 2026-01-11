# ⚡ QUICK START - Automated Deployment

## 🎯 **3-Step Setup (5 Minutes)**

### **STEP 1: Get FTP Info from Namecheap**

1. Login to **Namecheap** → **cPanel**
2. Find **"FTP Accounts"**
3. **Write down**:
   - Server: `ftp.yourdomain.com`
   - Username: `youruser@yourdomain.com`
   - Password: (your FTP password)

---

### **STEP 2: Add to GitHub Secrets**

1. Go to your **GitHub repository**
2. Click **Settings** → **Secrets and variables** → **Actions**
3. **Add 3 secrets**:

   ```
   Name: FTP_SERVER
   Value: ftp.yourdomain.com
   ```

   ```
   Name: FTP_USERNAME
   Value: youruser@yourdomain.com
   ```

   ```
   Name: FTP_PASSWORD
   Value: your-ftp-password
   ```

---

### **STEP 3: Test Deployment**

1. Go to **Actions** tab in GitHub
2. Click **"Run workflow"**
3. Select your branch
4. Click **"Run workflow"** button
5. **Wait 2 minutes** ⏱️
6. ✅ **Website is LIVE!**

---

## 🚀 **Daily Use**

### **Update Your Website:**

```bash
# Make changes (or ask me to!)
git add .
git commit -m "Update homepage"
git push

# Wait 2-3 minutes → Website updated automatically! ✨
```

---

## 📋 **What Happens Automatically:**

```
1. You push code to GitHub
   ↓
2. GitHub Actions detects push
   ↓
3. Connects to Namecheap via FTP
   ↓
4. Uploads only website files
   ↓
5. Your website updates (2-3 min)
   ↓
6. Done! 🎉
```

---

## 🎊 **THAT'S IT!**

**You now have professional automated deployment!**

- ✅ No manual FTP uploads
- ✅ Just push → website updates
- ✅ Professional CI/CD pipeline
- ✅ Industry-standard workflow

**Full guide**: See `AUTO-DEPLOY-SETUP.md` 📖

---

## 💡 **Need Help?**

**Just ask me!** I can help you:
- Set up FTP credentials
- Add GitHub Secrets
- Test the deployment
- Fix any errors

**Ready to go live?** Let's do this! 🚀
