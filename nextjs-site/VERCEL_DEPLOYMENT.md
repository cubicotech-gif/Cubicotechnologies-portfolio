# Vercel Deployment Guide with Custom Domain

Complete guide to deploy your Next.js website to Vercel using your custom domain **cubicotech.com**.

---

## Part 1: Deploy to Vercel (5 minutes)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub" (recommended)
4. Authorize Vercel to access your GitHub repositories

### Step 2: Import Your Project
1. Click "Add New..." → "Project"
2. Find your `Cubicotechnologies-portfolio` repository
3. Click "Import"
4. Vercel will auto-detect Next.js configuration

### Step 3: Configure Build Settings
Vercel should auto-fill these, but verify:
- **Framework Preset**: Next.js
- **Root Directory**: `nextjs-site`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a temporary `.vercel.app` URL (e.g., `cubico-technologies.vercel.app`)
4. Visit the URL to verify your site works

---

## Part 2: Configure Custom Domain (10 minutes)

### Step 1: Add Domain in Vercel
1. Go to your project dashboard on Vercel
2. Click "Settings" tab
3. Click "Domains" in the left sidebar
4. Click "Add"
5. Enter: `cubicotech.com`
6. Click "Add"

### Step 2: Add www Subdomain (Optional but Recommended)
1. Click "Add" again
2. Enter: `www.cubicotech.com`
3. Click "Add"

Vercel will now show you the DNS records you need to configure.

---

## Part 3: Configure DNS Records

You need to update your domain's DNS settings. This is done at your domain registrar (where you bought cubicotech.com - like GoDaddy, Namecheap, HostGator, etc.).

### Option A: Using A Records (Recommended)

**For cubicotech.com (root domain):**
1. Log in to your domain registrar
2. Find DNS settings / DNS management
3. Add an **A Record**:
   - **Type**: A
   - **Name**: @ (or leave blank for root)
   - **Value**: `76.76.21.21`
   - **TTL**: 3600 (or Auto)

**For www.cubicotech.com:**
4. Add a **CNAME Record**:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: 3600 (or Auto)

### Option B: Using CNAME (If A Records Don't Work)

Some registrars don't allow A records on root domains. Use this alternative:

1. Add **CNAME Record**:
   - **Type**: CNAME
   - **Name**: @ (or leave blank)
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: 3600

2. Add **CNAME Record** for www:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: 3600

### Common Registrars - Where to Find DNS Settings

**GoDaddy:**
1. Go to My Products
2. Click DNS next to your domain
3. Scroll to Records section

**Namecheap:**
1. Domain List → Manage
2. Advanced DNS tab
3. Add records under Host Records

**HostGator:**
1. cPanel → Zone Editor
2. Manage next to your domain
3. Add Record

**Google Domains:**
1. My Domains → Manage
2. DNS tab on left
3. Custom records section

---

## Part 4: Verify Domain Configuration (15-60 minutes)

### Step 1: Wait for DNS Propagation
- DNS changes take 5 minutes to 48 hours (usually 15-30 minutes)
- Vercel will automatically verify when DNS propagates

### Step 2: Check Status in Vercel
1. Go to Settings → Domains in Vercel
2. You'll see status next to each domain:
   - ⏳ **Pending**: DNS not propagated yet (wait)
   - ✅ **Valid**: Domain is working!
   - ❌ **Invalid Configuration**: Check DNS records

### Step 3: Test Your Domain
Once status shows "Valid":
1. Visit `https://cubicotech.com` in your browser
2. Visit `https://www.cubicotech.com`
3. Both should show your Next.js website!

---

## Part 5: SSL Certificate (Automatic)

Vercel automatically provides free SSL certificates for custom domains:
- ✅ Your site will have `https://` (secure)
- ✅ Certificate auto-renews
- ✅ No configuration needed

---

## Troubleshooting

### Domain Shows "Invalid Configuration"
1. Double-check DNS records match exactly
2. Wait 30 more minutes for propagation
3. Use [dnschecker.org](https://dnschecker.org) to verify DNS propagation globally

### Site Shows 404 Error
1. Verify "Root Directory" is set to `nextjs-site` in Vercel settings
2. Redeploy: Deployments tab → Click ⋯ → Redeploy

### DNS Records Not Saving
1. Remove any existing A/CNAME records for @ and www
2. Some registrars require you to disable "domain parking" first
3. Contact your registrar support if issues persist

### Want to Redirect www to Root (or Vice Versa)?
Vercel handles this automatically. Both domains will work, and Vercel will redirect to your preferred one.

---

## Quick Reference: DNS Records

Copy these exact values into your DNS settings:

```
TYPE    NAME    VALUE                   TTL
A       @       76.76.21.21            3600
CNAME   www     cname.vercel-dns.com   3600
```

---

## Next Steps After Deployment

1. **Set Primary Domain** (optional):
   - Vercel Settings → Domains
   - Click ⋯ next to preferred domain → "Set as Primary"
   - This becomes the canonical URL

2. **Environment Variables** (if needed later):
   - Settings → Environment Variables
   - Add API keys, database URLs, etc.

3. **Analytics** (optional):
   - Vercel provides free analytics
   - Settings → Analytics → Enable

4. **Custom 404 Page** (optional):
   - Create `app/not-found.tsx` in your Next.js project

---

## Cost

Everything is **100% FREE**:
- ✅ Vercel hosting (Free tier)
- ✅ SSL certificate
- ✅ Custom domain support
- ✅ Automatic deployments
- ✅ Bandwidth (up to 100GB/month)

You only pay for your domain registration (usually $10-15/year at your registrar).

---

## Automatic Deployments

Once connected:
- Every `git push` to your main branch → automatic deployment
- See live preview at cubicotech.com in ~2 minutes
- No manual deployment needed ever again!

---

## Summary

1. **Deploy**: Import repository to Vercel
2. **Add Domain**: Add cubicotech.com in Vercel settings
3. **Configure DNS**: Add A/CNAME records at your registrar
4. **Wait**: 15-60 minutes for DNS propagation
5. **Done**: Visit https://cubicotech.com - your site is live!

---

**Need help?**
- Vercel Docs: [vercel.com/docs/custom-domains](https://vercel.com/docs/custom-domains)
- Vercel Support: Available in dashboard (chat icon)

**Questions about your specific registrar?**
Let me know where you registered cubicotech.com and I can provide specific steps!
