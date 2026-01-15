# Cubico Technologies - Next.js Website

Modern, professional website built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- ✅ **Next.js 14** - Latest React framework with App Router
- ✅ **TypeScript** - Type-safe code
- ✅ **Tailwind CSS** - Modern utility-first CSS
- ✅ **Black/White/Grey Theme** - Clean, professional design
- ✅ **Responsive** - Mobile-first design
- ✅ **Animated Counters** - Statistics count up on scroll
- ✅ **Client Testimonials** - 6 real testimonials with ratings
- ✅ **SEO Optimized** - Meta tags and semantic HTML
- ✅ **Fast Performance** - Optimized images and code splitting

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Development

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nextjs-site/
├── app/
│   ├── layout.tsx          # Root layout with Navigation & Footer
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── services/           # Services page
│   ├── process/            # Process page
│   └── contact/            # Contact page
├── components/
│   ├── Navigation.tsx      # Header navigation
│   └── Footer.tsx          # Footer component
├── public/
│   └── images/
│       └── logos/          # Logo files
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎨 Color Scheme

- **Primary**: White (#ffffff)
- **Secondary**: Grey (#888888)
- **Background**: Black (#050505)
- **Text**: White/Grey tones

## 🚢 Deployment

### Option 1: Vercel (Recommended - FREE)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (automatic!)

### Option 2: Export Static Files

```bash
# Build static export
npm run build

# Upload 'out' folder to any hosting (HostGator, Netlify, etc.)
```

### Option 3: Node.js Server

```bash
npm run build
npm start
```

## 📝 Pages

- `/` - Homepage with hero, stats, testimonials
- `/services` - All services and offerings
- `/process` - Our work process
- `/contact` - Contact form and information

## 🔧 Customization

Edit these files to customize:
- `app/layout.tsx` - Site-wide layout, metadata
- `tailwind.config.ts` - Colors, fonts, animations
- `components/` - Reusable UI components
- `public/images/` - Add your images/logos

## 📊 Performance

- **Lighthouse Score**: 95+ (aim)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized with code splitting

## 🎯 Next Steps

1. Add your logo to `public/images/logos/`
2. Customize content in page files
3. Add contact form integration (Supabase, etc.)
4. Deploy to Vercel or your preferred host

## 💡 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)
- **Image Optimization**: Next/Image

## 📄 License

Private - Cubico Technologies

---

**Built with ❤️ by Claude for Cubico Technologies**
