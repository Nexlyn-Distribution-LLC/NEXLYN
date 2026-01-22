<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1TooJrvvYNEPtXmyX5sfuyYKZ-ofUdW0j

## Run Locally

**Prerequisites:** Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```env
   # Gemini AI API Key
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Cloudinary Configuration (for admin image uploads)
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Cloudinary Setup for Image Uploads

The admin panel uses Cloudinary for secure image hosting. Follow these steps:

### 1. Create a Free Cloudinary Account
- Go to https://cloudinary.com/users/register/free
- Sign up for a free account (25GB storage, 25GB bandwidth/month)

### 2. Get Your Cloud Name
- After logging in, go to Dashboard
- Copy your **Cloud Name** (e.g., `dxxxxxxxxxxxxx`)

### 3. Create an Upload Preset
- Go to Settings → Upload → Upload Presets
- Click "Add upload preset"
- Set **Signing Mode** to "Unsigned"
- Set **Folder** to "nexlyn-products" (optional)
- Copy the **Upload preset name** (e.g., `nexlyn_unsigned`)

### 4. Update .env.local
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name_here
```

## Features

### ✅ Retained from Original Design
- **WhatsApp Integration** - Existing ICONS.WhatsApp component
- **AI Chat** - "Grid Expert" and "NEX-AI Active" branding
- **Admin Panel Structure** - Security authorization, stats dashboard

### 🆕 New Enhancements
- **File Upload** - Direct image upload to Cloudinary with preview
- **Image Management** - Upload progress, file validation, preview
- **Dual Input** - Support both file upload and manual URL entry

## Tech Stack
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Google Gemini AI** for chat intelligence
- **Cloudinary** for image hosting

## Deployment
This app is optimized for deployment on:
- GitHub Pages
- Vercel
- Netlify

Make sure to set environment variables in your deployment platform's settings.
