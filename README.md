<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NEXLYN - MikroTik® Master Distributor Website

A lightweight, production-ready website for NEXLYN Distributions, an authorized MikroTik® Master Distributor based in Dubai.

## Features

- **Product Catalog** - Browse and search MikroTik hardware inventory
- **Category Management** - Filter products by Routing, Switching, Wireless, 5G/LTE, IoT, and Accessories
- **Admin Panel** - Secure product, banner, and settings management
- **Banner Management** - Dynamic home page banner creation and editing
- **WhatsApp Integration** - Direct customer engagement with official branding
- **Dark/Light Mode** - Full theme support with Sun/Moon toggle
- **Responsive Design** - Optimized for all devices
- **MikroTik Compliance** - Legal trademark disclaimers in footer

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Admin Panel Access

The admin panel is protected by a passcode. Access it by clicking the shield icon in the header and entering the passcode.

**Admin Passcode:** `vidi-admin-2025`

Features:
- Product management (add, edit, delete)
- Banner management (create, edit, delete home page banners)
- WhatsApp number configuration
- Company information updates
- Data persistence via localStorage

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS v3.4** (npm package, not CDN)
- **LocalStorage** for data persistence
- **No external APIs** - Fully self-contained

## Deployment

This app is optimized for deployment on:
- **Vercel**
- **Netlify**
- **GitHub Pages**
- Any static hosting platform

Simply build the project and deploy the `dist` folder.

## Project Structure

```
/
├── App.tsx           # Main application component with all features
├── constants.tsx     # Product data, categories, and configuration
├── types.ts          # TypeScript type definitions
├── index.tsx         # Application entry point
├── index.css         # Tailwind CSS directives and custom utilities
├── index.html        # HTML template
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js  # PostCSS configuration
├── vite.config.ts    # Vite build configuration
└── package.json      # Dependencies and scripts
```

## Performance

This optimized version features:
- ✅ Minimal dependencies (139 packages total)
- ✅ Fast build times (~2.2 seconds)
- ✅ Small bundle size (266KB JS + 39KB CSS, gzipped: 77KB + 6.5KB)
- ✅ No external API dependencies
- ✅ Production-ready code
- ✅ Proper Tailwind CSS integration (no CDN)

## License

© 2025 NEXLYN LLC. All rights reserved.

NEXLYN Distributions LLC is an independent authorized MikroTik® Master Distributor. All hardware systems are genuine and factory-sealed.
