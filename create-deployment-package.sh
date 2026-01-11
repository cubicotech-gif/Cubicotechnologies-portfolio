#!/bin/bash

# ========================================
# NAMECHEAP DEPLOYMENT PACKAGE CREATOR
# ========================================
# This script creates a clean ZIP file ready for Namecheap upload

echo "🚀 Creating Namecheap Deployment Package..."
echo ""

# Create deployment directory
echo "📦 Preparing files..."
rm -rf deployment-package 2>/dev/null
mkdir -p deployment-package

# Copy website files (only what's needed)
echo "📄 Copying HTML files..."
cp *.html deployment-package/

echo "🎨 Copying CSS files..."
cp -r css deployment-package/

echo "⚡ Copying JavaScript files..."
cp -r js deployment-package/

# Create ZIP file
echo "📦 Creating ZIP archive..."
cd deployment-package
zip -r ../cubico-website-package.zip . -q
cd ..

# Clean up
rm -rf deployment-package

echo ""
echo "✅ Deployment package created successfully!"
echo ""
echo "📦 File: cubico-website-package.zip"
echo "📊 Size: $(du -h cubico-website-package.zip | cut -f1)"
echo ""
echo "🌐 NEXT STEPS:"
echo "1. Download 'cubico-website-package.zip' to your computer"
echo "2. Login to your Namecheap cPanel"
echo "3. Go to File Manager > public_html"
echo "4. Upload this ZIP file"
echo "5. Extract it"
echo "6. Visit your domain - your website is live! 🎉"
echo ""
echo "📖 For detailed instructions, see: NAMECHEAP-DEPLOYMENT-GUIDE.md"
echo ""
