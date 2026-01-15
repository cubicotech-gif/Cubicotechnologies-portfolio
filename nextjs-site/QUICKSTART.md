# 🚀 Quick Start Guide - Cubico Technologies Next.js Website

## ⚡ Get Running in 2 Minutes

### Step 1: Install Dependencies
```bash
cd nextjs-site
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Visit: [http://localhost:3000](http://localhost:3000)

**That's it!** Your modern Next.js website is running! 🎉

---

## 📦 What's Included

✅ **Homepage** - Hero, stats, testimonials, CTA
✅ **Services Page** - All service offerings
✅ **Process Page** - 7-step workflow
✅ **Contact Page** - Contact form & information
✅ **Navigation** - Responsive header with mobile menu
✅ **Footer** - Links and company info
✅ **Logo** - Your Cubico logo integrated
✅ **Animations** - Counters, hover effects, transitions

---

## 🎨 Features

- **Black/White/Grey Theme** - Clean, professional
- **Fully Responsive** - Mobile, tablet, desktop
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Next.js 14** - Latest React framework
- **Image Optimization** - Fast loading
- **SEO Ready** - Meta tags configured

---

## 🚢 Deploy to Production

### Option 1: Vercel (Recommended - FREE & Easy)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

**Done!** Your site is live with a free `.vercel.app` URL.

### Option 2: Build Static Export

```bash
npm run build
```

Upload the generated files to any hosting (HostGator, Netlify, etc.)

---

## 📝 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: '#ffffff',   // Change this
  secondary: '#888888', // And this
},
```

### Add Your Logo
Replace `public/images/logos/logo.svg` with your logo file.

### Edit Content
- Homepage: `app/page.tsx`
- Services: `app/services/page.tsx`
- Process: `app/process/page.tsx`
- Contact: `app/contact/page.tsx`

---

## 🔧 Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run linter
```

---

## 💡 Tips

1. **Hot Reload**: Changes auto-refresh in dev mode
2. **TypeScript**: Get autocomplete and type checking
3. **Components**: Reusable UI in `components/` folder
4. **Images**: Put images in `public/` folder
5. **Styling**: Use Tailwind classes or custom CSS

---

## 🆘 Troubleshooting

**"Module not found"**
→ Run `npm install` again

**"Port 3000 in use"**
→ Use a different port: `npm run dev -- -p 3001`

**Build errors**
→ Delete `.next` folder and rebuild

---

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

---

**Need help?** Check README.md for detailed documentation.

**Ready to deploy?** Follow the Vercel deployment steps above!

🎉 **Enjoy your modern, professional website!**
