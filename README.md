<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NEXLYN - MikroTik® Distribution Platform

A lightweight, modern web application for NEXLYN Distributions - your professional MikroTik® hardware distributor. Built with React and optimized for fast performance and easy deployment.

## ✨ Features

- 🛍️ **Product Catalog** - Browse MikroTik® routers, switches, wireless equipment, and more
- 🔐 **Admin Panel** - Secure dashboard for managing products, settings, and content
- 📱 **WhatsApp Integration** - Direct B2B quote requests via WhatsApp
- 🎨 **Dark/Light Mode** - Beautiful themes with smooth transitions
- ☁️ **Cloudinary Integration** - Secure image hosting for product photos
- 📊 **Category Management** - Organized by Routing, Switching, Wireless, 5G/LTE, IoT, and Accessories
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile

## 🚀 Quick Start

**Prerequisites:** Node.js 16+ 

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables** (optional for admin panel image uploads):
   
   Copy `.env.local.example` to `.env.local` and configure:
   ```env
   # Cloudinary Configuration (optional - for admin image uploads)
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 Cloudinary Setup (Optional)

The admin panel supports direct image upload to Cloudinary. To enable this feature:

### 1. Create a Free Cloudinary Account
- Visit: https://cloudinary.com/users/register/free
- Free tier includes: 25GB storage, 25GB bandwidth/month

### 2. Get Your Credentials
- Go to your Cloudinary Dashboard
- Copy your **Cloud Name**

### 3. Create an Upload Preset
- Navigate to: Settings → Upload → Upload Presets
- Click "Add upload preset"
- Set **Signing Mode** to "Unsigned"
- Optional: Set **Folder** to "nexlyn-products"
- Copy the **Upload preset name**

### 4. Update .env.local
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name_here
```

**Note:** You can also add products with direct image URLs without Cloudinary configuration.

## 🎯 Tech Stack

- **React 19** - Modern UI library with TypeScript
- **Vite** - Lightning-fast build tool and dev server
- **Native CSS** - Custom styling with Tailwind-inspired utilities
- **Cloudinary API** - Optional image hosting via native fetch

## 📦 Deployment

This app is optimized for deployment on any static hosting platform:

- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables (if using Cloudinary)
4. Deploy!

### Environment Variables for Production

If using Cloudinary for image uploads, set these in your deployment platform:
```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🔐 Admin Access

The admin panel is protected by a passcode (defined in `constants.tsx`). Default features:

- Product management (add, edit, delete)
- WhatsApp number configuration
- About content editing
- Address and location settings
- Product statistics dashboard

## 📊 Bundle Size

- **Dependencies:** 68 packages (65% lighter than previous version)
- **Build time:** ~80ms
- **Optimized for:** Fast loading and minimal bandwidth

## 🛠️ Project Structure

```
NEXLYN---v2/
├── App.tsx              # Main application component
├── constants.tsx        # Product data, categories, settings
├── types.ts             # TypeScript type definitions
├── services/
│   └── cloudinaryService.ts  # Image upload service
├── index.tsx            # Application entry point
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies and scripts
```

## 📝 License

© NEXLYN Distributions. All rights reserved.

## 🤝 Contributing

This is a proprietary business application. For issues or feature requests, please contact the development team.

