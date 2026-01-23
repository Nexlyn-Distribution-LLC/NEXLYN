<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NEXLYN - MikroTik® Master Distributor Website

A lightweight, production-ready website for NEXLYN Distributions, an authorized MikroTik® Master Distributor based in Dubai.

## Features

- **Product Catalog** - Browse and search MikroTik hardware inventory
- **Category Management** - Filter products by Routing, Switching, Wireless, 5G/LTE, IoT, and Accessories
- **Admin Panel** - Secure product and settings management
- **WhatsApp Integration** - Direct customer engagement for quotes and inquiries
- **Dark/Light Mode** - Full theme support
- **Responsive Design** - Optimized for all devices

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

The admin panel is protected by a passcode defined in `constants.tsx`. Access it by navigating to the Admin section and entering the passcode.

Default features:
- Product management (add, edit, delete)
- WhatsApp number configuration
- Company information updates
- Inventory statistics dashboard

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** (via inline styles) for modern UI
- **LocalStorage** for data persistence

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
├── App.tsx           # Main application component
├── constants.tsx     # Product data and configuration
├── types.ts          # TypeScript type definitions
├── index.tsx         # Application entry point
├── index.html        # HTML template
└── vite.config.ts    # Vite configuration
```

## Performance

This optimized version features:
- ✅ Minimal dependency footprint (only React and React-DOM)
- ✅ Fast build times (~100ms)
- ✅ Small bundle size
- ✅ No external API dependencies
- ✅ Production-ready code

## License

© 2025 NEXLYN LLC. All rights reserved.

NEXLYN Distributions LLC is an independent authorized MikroTik® Master Distributor. All hardware systems are genuine and factory-sealed.
