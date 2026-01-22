# NEXLYN - Complete Project Documentation
## AI-Powered Distribution Interface for MikroTik Master Distributor

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [Features & Functionality](#features--functionality)
5. [Code Components](#code-components)
6. [Setup & Installation](#setup--installation)
7. [Environment Configuration](#environment-configuration)
8. [Deployment](#deployment)
9. [API & Integrations](#api--integrations)
10. [Admin Panel](#admin-panel)
11. [AI Integration (Gemini)](#ai-integration-gemini)
12. [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

**NEXLYN** is a high-end, AI-powered web application serving as the distribution interface for **Nexlyn LLC**, a MikroTik Master Distributor. The platform combines modern web technologies with Google's Gemini AI to create an intelligent B2B e-commerce and support platform.

### Key Purpose
- **B2B Distribution Platform**: Showcase and manage MikroTik networking hardware catalog
- **AI-Powered Support**: Integrate Gemini AI ("Grid Expert") for technical support and product recommendations
- **Administrative Control**: Secure admin panel for product and inventory management
- **WhatsApp Integration**: Direct B2B communication channel for quotes and inquiries

### Target Users
- ISPs (Internet Service Providers)
- Enterprise Network Administrators
- System Integrators
- Telecommunications Companies
- Distributors and Resellers

---

## 🏗️ Architecture & Technology Stack

### Frontend Framework
- **React 18.2.3** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite 6.2.0** - Lightning-fast build tool and dev server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework (configured inline)
- **Custom Design System** - Brand colors, components, and animations
- **Dark/Light Theme** - User-toggleable theme system
- **Responsive Design** - Mobile-first approach

### AI & Intelligence
- **Google Gemini AI** - `@google/genai` v1.37.0
  - Model: `gemini-3-flash-preview` (fast responses)
  - Features: Streaming responses, web grounding, system instructions
  - Use Case: Technical support chatbot ("Grid Expert")

### Cloud Services
- **Cloudinary** - Image hosting and management
  - `@cloudinary/react` v1.13.0
  - `@cloudinary/url-gen` v1.19.0
  - Features: Direct upload, image optimization, CDN delivery

### Data Visualization
- **Recharts 3.6.0** - Admin dashboard charts and analytics

### Build & Development
- **Vite** - Module bundler with HMR (Hot Module Replacement)
- **TypeScript Compiler** - Type checking and compilation
- **Node.js** - Runtime environment

---

## 📁 Project Structure

```
NEXLYN---v2/
├── .env.local              # Environment variables (API keys, credentials)
├── .env.local.example      # Environment variable template
├── .gitignore              # Git ignore rules
├── README.md               # Setup and deployment guide
├── metadata.json           # App metadata and permissions
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── index.html              # HTML entry point
├── index.tsx               # React app mount point
├── App.tsx                 # Main application component (2000+ lines)
├── constants.tsx           # Product catalog, categories, icons
├── types.ts                # TypeScript type definitions
├── services/
│   ├── geminiService.ts    # Gemini AI integration
│   └── cloudinaryService.ts # Cloudinary image upload
└── .github/                # GitHub workflows and configs
```

---

## ✨ Features & Functionality

### 1. **Multi-View Application**
- **Home View**: Hero carousel, featured products, category showcase
- **Products View**: Filterable catalog with search and category filters
- **Detail View**: Comprehensive product specifications and actions
- **Admin View**: Protected admin panel with authentication
- **About View**: Company information and mission

### 2. **Product Catalog**
- **Categories**:
  - Routing (Cloud Core Routers)
  - Switching (CRS series)
  - Wireless (hAP, Chateau)
  - LTE/5G (Mobile connectivity)
  - Accessories (Antennas, PoE, licenses)

- **Product Data**:
  - Technical specifications
  - Stock status
  - Images (Cloudinary-hosted or data URLs)
  - Detailed descriptions
  - SKU/Product codes

### 3. **AI-Powered Chat ("Grid Expert")**
- **Gemini AI Integration**: Real-time streaming responses
- **System Instruction**: Specialized for MikroTik hardware and networking
- **Web Grounding**: AI can search the web for current information
- **Technical Expertise**:
  - RouterOS v7 configurations
  - BGP, OSPF, MPLS protocols
  - Network design recommendations
  - Product comparisons

- **Chat Features**:
  - Persistent chat history
  - Code block formatting
  - Source citations
  - Floating chat button
  - Minimizable interface

### 4. **Admin Panel**
- **Authentication**: Passcode-protected (ADMIN_PASSCODE in constants.tsx)
- **Dashboard**: Statistics (total products, categories, stock, value)
- **Product Management**:
  - Add new products
  - Edit existing products
  - Image upload (Cloudinary)
  - Manual URL entry option
  - Form validation

- **Analytics Charts**:
  - Category distribution (pie chart)
  - Stock levels (bar chart)
  - Built with Recharts

### 5. **WhatsApp Integration**
- **Direct B2B Communication**: Pre-filled message templates
- **Contact Points**:
  - General inquiries
  - Product-specific quotes
  - Technical support requests
- **Phone Number**: Configurable in constants.tsx

### 6. **Theme System**
- **Light/Dark Modes**: User-toggleable
- **Persistent**: Saved to localStorage
- **Comprehensive**: All components themed
- **Smooth Transitions**: CSS animations

### 7. **Responsive Design**
- **Mobile-First**: Optimized for phones and tablets
- **Breakpoints**: Tailwind's responsive system
- **Mobile Menu**: Collapsible navigation
- **Touch-Friendly**: Large tap targets

---

## 🧩 Code Components

### Main Application (`App.tsx`)

#### State Management
```typescript
// View states
const [view, setView] = useState<ViewType>('home');
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [selectedCategory, setSelectedCategory] = useState<string>('All');
const [searchQuery, setSearchQuery] = useState('');

// Admin states
const [adminAuth, setAdminAuth] = useState(false);
const [adminPasscodeInput, setAdminPasscodeInput] = useState('');
const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
const [whatsappNumber, setWhatsappNumber] = useState(INITIAL_WA);

// Chat states
const [chatMessages, setChatMessages] = useState<Message[]>([]);
const [chatInput, setChatInput] = useState('');
const [isStreaming, setIsStreaming] = useState(false);
const [chatOpen, setChatOpen] = useState(false);

// UI states
const [theme, setTheme] = useState<ThemeType>('dark');
const [isScrolled, setIsScrolled] = useState(false);
const [currentSlide, setCurrentSlide] = useState(0);
```

#### Key Components

**CategoryPill**
- Renders category filter buttons
- Active state styling
- Product count badge
- Icon support

**Logo**
- Custom SVG logo
- Click handler to return home
- Hover animations

**Header**
- Fixed navigation bar
- Search functionality
- Mobile menu toggle
- Theme switcher
- View navigation

**Hero Section**
- Auto-rotating carousel
- Featured products/messages
- CTA buttons
- Background animations

**Product Grid**
- Responsive layout
- Lazy loading
- Hover effects
- Quick actions (WhatsApp, Details)

**Product Detail**
- Full specifications
- Image display
- Related products
- Action buttons

**Admin Panel**
- Authentication guard
- Product CRUD operations
- Image upload integration
- Dashboard analytics

**AI Chat**
- Floating button
- Expandable interface
- Streaming message display
- Source citations
- Message history

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Git** (for cloning)

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/vishnu-madhavan-git/NEXLYN---v2.git
cd NEXLYN---v2
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Access Application**
- Open browser to `http://localhost:5173`
- App will auto-reload on file changes

---

## 🔐 Environment Configuration

### Required Variables

Create `.env.local` file:

```env
# Gemini AI API Key
# Get from: https://ai.google.dev/
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary Configuration
# Get from: https://cloudinary.com/console
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Obtaining API Keys

#### Gemini API Key
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with Google account
3. Create new API key
4. Copy key to `.env.local`

#### Cloudinary Setup
1. Create account at [Cloudinary](https://cloudinary.com/users/register/free)
2. Navigate to Dashboard
3. Copy **Cloud Name**
4. Go to Settings → Upload → Upload Presets
5. Create new preset with **Unsigned** signing mode
6. Copy preset name
7. Add both values to `.env.local`

### Security Notes
- **Never commit `.env.local`** to version control
- `.env.local` is in `.gitignore`
- Use `.env.local.example` as template
- Rotate keys regularly
- Use different keys for production

---

## 🌐 Deployment

### Supported Platforms

#### 1. **Vercel** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

**Vercel Configuration:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables:**
- Add `GEMINI_API_KEY`
- Add `VITE_CLOUDINARY_CLOUD_NAME`
- Add `VITE_CLOUDINARY_UPLOAD_PRESET`

#### 2. **Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Or use Netlify UI
```

**Netlify Configuration:**
- Build Command: `npm run build`
- Publish Directory: `dist`
- Add environment variables in Site Settings

#### 3. **GitHub Pages**

**Build for GitHub Pages:**
```bash
npm run build
# Upload dist/ folder to gh-pages branch
```

**vite.config.ts** already configured with base path handling

#### 4. **Traditional Hosting**
```bash
# Build production bundle
npm run build

# Upload dist/ folder to web server
# Serve with any static file server (nginx, Apache, etc.)
```

---

## 🔌 API & Integrations

### Gemini AI Service

**Location:** `services/geminiService.ts`

**Class:** `GeminiService`

**Methods:**

```typescript
// Streaming chat responses
async *streamTech(prompt: string): AsyncGenerator<{text: string, sources: GroundingSource[]}>

// Non-streaming fallback
async searchTech(prompt: string): Promise<{text: string, sources: GroundingSource[]}>
```

**Configuration:**
- Model: `gemini-3-flash-preview`
- Tools: Google Search (web grounding)
- System Instruction: MikroTik expertise persona

**System Instruction:**
```
You are the Nexlyn AI Master Architect ("Grid Expert").
Your Expertise:
1. MikroTik® Hardware (CCR, CRS, hAP, Chateau, etc.)
2. RouterOS v7 configurations (BGP, OSPF, MPLS, WireGuard, Container support)
3. Global Distribution Logistics (MENA region, Dubai hub, export compliance)
4. ISP & Enterprise Network Design.

Your Persona:
Professional, engineering-focused, concise, and highly knowledgeable.
You assist B2B customers with technical specs and deployment planning.
Always recommend official MikroTik® documentation for complex CLI tasks.
If a user asks about pricing, direct them to use the "B2B Quote" or WhatsApp buttons.
```

### Cloudinary Service

**Location:** `services/cloudinaryService.ts`

**Function:** `uploadImage(file: File): Promise<string>`

**Upload Configuration:**
- Unsigned upload (no authentication required on client)
- Upload preset: configured in environment
- Returns: Public URL of uploaded image

**Usage Example:**
```typescript
const imageUrl = await uploadImage(fileInput.files[0]);
// Use imageUrl in product data
```

### WhatsApp Integration

**Function:** `openWhatsApp(context: string)`

**Message Templates:**
- General inquiry
- Product-specific quote (includes product details)
- Technical support request

**Implementation:**
```typescript
const openWhatsApp = (context: string = 'general') => {
  const baseUrl = `https://wa.me/${whatsappNumber}`;
  let message = 'Hello Nexlyn Team,';
  
  if (context === 'general') {
    message = 'Hello! I am interested in your MikroTik distribution services.';
  } else if (context.startsWith('product_')) {
    const product = products.find(p => p.id === context.split('_')[1]);
    if (product) {
      message = `Hi! I'd like a B2B quote for:\n\n${product.name}\nCode: ${product.code}`;
    }
  }
  
  window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, '_blank');
};
```

---

## 👨‍💼 Admin Panel

### Access
- Navigate to Admin view via header
- Enter passcode (defined in `constants.tsx`)
- Default passcode: Check `ADMIN_PASSCODE` constant

### Features

#### 1. **Dashboard Statistics**
- Total Products
- Total Categories
- In Stock Count
- Total Inventory Value

#### 2. **Analytics Charts**
- **Category Distribution**: Pie chart showing product count per category
- **Stock Levels**: Bar chart showing inventory by category

#### 3. **Product Management**

**Add Product Form:**
```typescript
interface ProductForm {
  name: string;
  code: string;
  category: string;
  specs: string[];      // Comma-separated
  description: string;
  imageUrl: string;     // Upload or manual URL
  status: 'In Stock' | 'Limited' | 'Pre-Order';
}
```

**Image Upload:**
- Direct file upload to Cloudinary
- Upload progress indicator
- Image preview
- Fallback to manual URL entry
- File validation (images only)

**Edit Product:**
- Same form as add
- Pre-populated with existing data
- Update in-memory state (persists until page reload)

**Delete Product:**
- Confirmation required
- Removes from product list

### WhatsApp Configuration
- Update contact number
- Affects all WhatsApp CTAs
- Persists until page reload

### Persistence Note
- Current version stores data in React state (in-memory)
- Data resets on page refresh
- Future enhancement: Backend API for persistence

---

## 🤖 AI Integration (Gemini)

### Overview
The application integrates Google's Gemini AI to provide intelligent technical support and product recommendations through the "Grid Expert" chat interface.

### Implementation Details

#### 1. **Service Architecture**

**File:** `services/geminiService.ts`

**API Client:**
```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**Model Selection:**
```typescript
const MODELS = {
  CHAT_PRO: "gemini-3-pro-preview",    // High-quality responses
  FAST_FLASH: "gemini-3-flash-preview", // Fast responses (currently used)
};
```

#### 2. **Chat Configuration**

**System Instruction:**
- Defines AI personality and expertise
- MikroTik hardware specialist
- RouterOS v7 expert
- Professional B2B tone
- Directs pricing questions to WhatsApp/quote system

**Tools Enabled:**
- **Google Search**: AI can search web for current information
- **Grounding**: Provides source citations for responses

**Streaming:**
- Uses `generateContentStream` for real-time responses
- Yields chunks as they arrive
- Better UX (user sees response building)

#### 3. **Chat UI Components**

**Floating Button:**
- Fixed position, bottom-right
- Pulse animation
- Badge notification
- Click to open/minimize

**Chat Window:**
- Expandable overlay
- Message history
- Streaming indicator
- Code block formatting
- Source citations (clickable links)

**Message Types:**
```typescript
interface Message {
  text: string;
  sender: 'user' | 'ai';
  sources?: GroundingSource[];  // Web citations
}

interface GroundingSource {
  title: string;
  uri: string;
}
```

#### 4. **User Interaction Flow**

1. User opens chat via floating button
2. Types question about MikroTik/networking
3. Sends message
4. AI streams response in real-time
5. Response includes web sources if grounding used
6. User can continue conversation
7. History persists in session (until page reload)

#### 5. **Example Queries**

**Technical Support:**
- "How do I configure BGP on CCR2004?"
- "What's the difference between hAP ac² and hAP ac³?"
- "Best router for 1000+ user network?"

**Product Recommendations:**
- "I need a switch with 48 ports and PoE"
- "Compare CRS312 vs CRS326"
- "Which antenna for 5km point-to-point link?"

**Networking Advice:**
- "OSPF vs BGP for ISP network?"
- "How to setup VPN with WireGuard on RouterOS?"
- "MPLS configuration basics"

#### 6. **AI Response Format**

**Structured Responses:**
- Clear, concise answers
- Technical accuracy
- Official documentation references
- Redirects to WhatsApp for pricing

**Source Citations:**
- Displayed below AI message
- Clickable links
- Title and URL shown
- Helps verify information

---

## 💻 Development Workflow

### Available Scripts

```bash
# Start development server
npm run dev
# → Starts Vite dev server at localhost:5173
# → Hot Module Replacement enabled
# → Fast refresh for React components

# Build for production
npm run build
# → TypeScript compilation
# → Vite optimization
# → Output to dist/ directory
# → Minified and tree-shaken

# Preview production build
npm run preview
# → Serves dist/ folder
# → Test production build locally
```

### Development Best Practices

#### 1. **Code Organization**
- Keep components modular
- Use React.memo for expensive renders
- Separate business logic from UI
- TypeScript for type safety

#### 2. **State Management**
- useState for local state
- useEffect for side effects
- useMemo for expensive computations
- useRef for DOM references

#### 3. **Performance**
- Lazy load images
- Debounce search inputs
- Memoize complex calculations
- Optimize re-renders

#### 4. **Styling**
- Tailwind utility classes
- Custom design tokens
- Dark mode support
- Responsive breakpoints

#### 5. **TypeScript**
- Define interfaces for data structures
- Type all props and state
- Use strict mode
- Avoid `any` type

### File Modifications

#### Adding Products
**Edit:** `constants.tsx`
```typescript
export const PRODUCTS: Product[] = [
  {
    id: 'unique-id',
    name: 'Product Name',
    code: 'Product Code',
    category: 'Routing', // Must match CATEGORIES
    specs: ['Spec 1', 'Spec 2'],
    description: 'Detailed description',
    imageUrl: 'https://...',
    status: 'In Stock',
  },
  // ... more products
];
```

#### Adding Categories
**Edit:** `constants.tsx`
```typescript
export const CATEGORIES: Category[] = [
  {
    id: 'category-id',
    name: 'Category Name',
    icon: 'IconName', // From ICONS object
    count: 0, // Auto-calculated
    description: 'Category description',
  },
];
```

#### Updating AI Behavior
**Edit:** `services/geminiService.ts`
- Modify `SYSTEM_INSTRUCTION` for personality changes
- Change model selection for quality/speed tradeoffs
- Add additional tools or configurations

#### Changing Theme
**Edit:** `App.tsx`
- Modify Tailwind classes in components
- Update color scheme in `constants.tsx`
- Adjust dark mode selectors

---

## 🔧 Technical Details

### Type Definitions

**Location:** `types.ts`

```typescript
export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  specs: string[];
  description: string;
  imageUrl: string;
  status: 'In Stock' | 'Limited' | 'Pre-Order';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
}

export interface Message {
  text: string;
  sender: 'user' | 'ai';
  sources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  cta: string;
  background: string;
}
```

### Build Configuration

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
});
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["*.ts", "*.tsx"]
}
```

### Package Dependencies

**Production:**
```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "@google/genai": "^1.37.0",
  "@cloudinary/react": "^1.13.0",
  "@cloudinary/url-gen": "^1.19.0",
  "recharts": "^3.6.0"
}
```

**Development:**
```json
{
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

---

## 📊 Data Flow

### Application State Flow

```
User Action
    ↓
State Update (useState/setState)
    ↓
React Re-render
    ↓
UI Update
```

### Chat Message Flow

```
User Input
    ↓
Add to chatMessages (sender: 'user')
    ↓
Call gemini.streamTech(prompt)
    ↓
For each chunk:
    ↓
Update chatMessages (sender: 'ai')
    ↓
Display in UI (streaming)
    ↓
Complete with sources
```

### Product Management Flow

```
Admin Login
    ↓
Verify Passcode
    ↓
Set adminAuth = true
    ↓
Show Admin Panel
    ↓
CRUD Operations
    ↓
Update products state
    ↓
Re-render product views
```

### Image Upload Flow

```
File Selected
    ↓
Call uploadImage(file)
    ↓
Cloudinary API Request
    ↓
Receive public URL
    ↓
Set in product form
    ↓
Save with product data
```

---

## 🎨 Design System

### Colors

**Brand Primary:**
- Nexlyn Red: `#E60026`
- Used for: Buttons, accents, hover states

**Neutrals:**
- Light mode: Slate grays
- Dark mode: True blacks with subtle grays

**Status:**
- Success/In Stock: Green tones
- Warning/Limited: Yellow/Orange
- Info: Blue tones

### Typography

**Font Family:**
- System fonts for performance
- `font-sans` utility (Tailwind default stack)

**Font Weights:**
- Regular: Product descriptions
- Bold: Navigation, labels
- Black (900): Headers, emphasis

**Font Sizes:**
- Hero: `text-5xl` and above
- Headers: `text-2xl` to `text-4xl`
- Body: `text-sm` to `text-base`
- Labels: `text-xs` to `text-[11px]`

### Spacing

- Uses Tailwind's 4px base unit
- Consistent padding/margin scales
- Gap utilities for flex/grid layouts

### Border Radius

- Small elements: `rounded-lg` (8px)
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Pills: `rounded-full`

### Shadows

- Subtle: `shadow-sm`
- Default: `shadow`
- Prominent: `shadow-xl`
- Colored: `shadow-nexlyn/30` (brand color shadow)

---

## 🔒 Security Considerations

### Current Implementation

**Admin Authentication:**
- Client-side passcode check
- Stored in constants.tsx
- Not suitable for production without backend

**API Keys:**
- Environment variables
- Not exposed to client (Vite handles)
- `.env.local` in `.gitignore`

**Image Uploads:**
- Unsigned Cloudinary uploads
- Public access to uploaded images
- No size/type restrictions enforced server-side

### Recommendations for Production

1. **Backend API:**
   - Move admin logic to server
   - JWT authentication
   - Database for products

2. **API Key Management:**
   - Server-side Gemini API calls
   - Rate limiting
   - User session management

3. **Image Upload:**
   - Signed uploads (server-side signature)
   - File validation
   - Upload limits

4. **HTTPS:**
   - Always use HTTPS in production
   - Secure cookie flags
   - HSTS headers

---

## 🌟 Future Enhancements

### Potential Features

1. **Backend Integration:**
   - REST or GraphQL API
   - Database (PostgreSQL, MongoDB)
   - User authentication

2. **Advanced Admin:**
   - Multi-user support
   - Role-based access control
   - Audit logs

3. **E-commerce:**
   - Shopping cart
   - Checkout flow
   - Payment integration

4. **Analytics:**
   - Google Analytics
   - User behavior tracking
   - Conversion funnels

5. **SEO:**
   - Server-side rendering (Next.js migration)
   - Dynamic meta tags
   - Sitemap generation

6. **Internationalization:**
   - Multi-language support
   - Currency conversion
   - Regional pricing

7. **Performance:**
   - Service worker (PWA)
   - Offline support
   - Image lazy loading optimization

---

## 📞 Support & Contact

### Repository
- **GitHub:** https://github.com/vishnu-madhavan-git/NEXLYN---v2

### AI Studio
- **App Link:** https://ai.studio/apps/drive/1TooJrvvYNEPtXmyX5sfuyYKZ-ofUdW0j

### Business Contact
- **WhatsApp:** Configured in `constants.tsx` (`WHATSAPP_NUMBER`)
- **Website:** NEXLYN LLC - MikroTik Master Distributor

---

## 📝 License & Usage

This application is built for **Nexlyn LLC** as a proprietary B2B distribution platform.

**Technology Credits:**
- React (Meta)
- Vite (Evan You)
- Google Gemini AI (Google)
- Cloudinary (Cloudinary Ltd.)
- Recharts (Recharts contributors)
- Tailwind CSS (Tailwind Labs)

---

## 🚀 Quick Start Summary

```bash
# 1. Clone and install
git clone https://github.com/vishnu-madhavan-git/NEXLYN---v2.git
cd NEXLYN---v2
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your API keys

# 3. Run development server
npm run dev

# 4. Build for production
npm run build

# 5. Deploy to platform of choice
# (Vercel, Netlify, GitHub Pages, etc.)
```

---

## 📚 Additional Resources

### Documentation Links
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Gemini API](https://ai.google.dev/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [MikroTik Wiki](https://wiki.mikrotik.com/)

### Learning Resources
- [React Patterns](https://reactpatterns.com/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Vite Optimization](https://vitejs.dev/guide/build.html)

---

**Last Updated:** January 2026  
**Version:** 2.0  
**Status:** Active Development

---

*This documentation provides complete access to the NEXLYN project for AI consumption and human understanding. All code, architecture, and integration details are included above.*
