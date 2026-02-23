# NEXLYN Project Hub

NEXLYN is the central project hub for **Nexlyn-Distribution-LLC**.  
This repository documents architecture, ownership, operations, and development workflows for Nexlyn initiatives.

## Organization Structure

### 1) Nexlyn Core Organization
- Organization: `Nexlyn-Distribution-LLC`
- Role: Main business and product umbrella for Nexlyn work

Repositories:
- `Nexlyn-Distribution-LLC/NEXLYN` (public)
  - Main project hub and web/app experience
  - Documentation, onboarding, workflow references
- `Nexlyn-Distribution-LLC/IXR-Verified-Access` (private)
  - Internal/private data-access and verification workflows

### 2) Parallel Brand Organizations
- `BA-GOO`
  - `BA-GOO/BA-GOO-eMoto-Hub` (public)
  - Dedicated e-Moto project space
- `API-9Ruby`
  - Reserved for API-focused projects (currently no active repositories)

## Consolidation Policy

To keep ownership clean and scalable:
- All Nexlyn-owned repositories live under `Nexlyn-Distribution-LLC`
- BA-GOO assets live under `BA-GOO`
- API-first projects should live under `API-9Ruby`
- Personal accounts are used for individual identity and contributor access, not long-term project ownership

## Repository Governance

### Naming Standards
- Use clear, product-focused names
- Avoid temporary suffixes for production repos
- Keep one canonical repo per product line

### Visibility Standards
- Public repos: product sites, docs, open workflows
- Private repos: sensitive data pipelines, internal tools, partner-only operations

### Access Model
- Organization ownership stays centralized
- Contributors can be added with least privilege (`read` / `write` / `admin` as needed)
- Use org-owned repos for continuity across account changes

## NEXLYN App Quickstart

This repository also contains the NEXLYN app setup.

### Prerequisites
- Node.js 18+
- npm

### Local Run
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

3. Start development server:
```bash
npm run dev
```

## Cloudinary Setup (Image Upload)
1. Create free account: <https://cloudinary.com/users/register/free>
2. Copy **Cloud Name** from dashboard
3. Create unsigned upload preset in **Settings -> Upload Presets**
4. Add values to `.env.local`

## Core Features
- WhatsApp integration
- AI chat workflow
- Admin dashboard and authorization paths
- Product/image upload pipeline (Cloudinary)

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Google Gemini integration
- Cloudinary media pipeline

## Deployment Targets
- GitHub Pages
- Vercel
- Netlify

## Operations Checklist
- Keep org/repo ownership aligned with project brand
- Keep README and runbooks current after structural changes
- Protect default branch and require PR review for production repos
- Use issue templates for incidents, features, and release checklists

## Change Log (Structure)
- 2026-02-23: Consolidated Nexlyn repos under `Nexlyn-Distribution-LLC`
- 2026-02-23: Moved BA-GOO repo under `BA-GOO`
- 2026-02-23: Expanded `NEXLYN` README into organization-level project documentation
