# NEXLYN Codebase - AI Consumption Summary

## Quick Overview
**NEXLYN** is a React + TypeScript single-page application (SPA) for MikroTik hardware distribution with integrated Gemini AI chat support.

---

## File Structure & Responsibilities

### 1. **App.tsx** (Main Application - 2000+ lines)
The core component containing all application logic and UI.

**Key Sections:**
- **State Management** (lines ~7-50): All useState declarations
- **Sub-Components** (lines ~12-400): Memoized React components
  - CategoryPill, Logo, Header, Hero, ProductCard, ProductGrid, ProductDetail, AdminPanel, ChatInterface
- **Helper Functions** (lines ~400-500): openWhatsApp, formatPrice, etc.
- **Lifecycle Hooks** (lines ~500-600): useEffect for scroll, theme, carousel
- **Main Render** (lines ~600+): View switching, layout structure

**State Variables:**
```typescript
view: 'home' | 'products' | 'detail' | 'admin' | 'about'
selectedProduct: Product | null
selectedCategory: string
searchQuery: string
adminAuth: boolean
products: Product[]
chatMessages: Message[]
theme: 'light' | 'dark'
isScrolled: boolean
currentSlide: number
```

**Component Hierarchy:**
```
App
├── Header (navigation, search, theme toggle)
├── Home View
│   ├── Hero (carousel)
│   ├── Featured Products
│   └── Category Showcase
├── Products View
│   ├── Category Filters
│   └── Product Grid
├── Detail View
│   └── Product Detail Card
├── Admin View
│   ├── Auth Guard
│   ├── Dashboard Stats
│   ├── Charts (Recharts)
│   └── Product Management Form
├── About View
│   └── Company Info
└── Chat Interface (floating, overlay)
```

---

### 2. **constants.tsx** (~400 lines)
Centralized data storage and configuration.

**Exports:**
- `COLORS`: Brand color palette (`primary: '#E60026'`)
- `VISUALS`: Base64-encoded SVG placeholders for product images
- `ICONS`: React SVG components (functional components)
- `PRODUCTS`: Array of Product objects (full catalog)
- `CATEGORIES`: Array of Category objects
- `WHATSAPP_NUMBER`: Contact number string
- `ADMIN_PASSCODE`: Admin authentication passcode
- `HERO_SLIDES`: Carousel slide data

**Product Schema:**
```typescript
{
  id: string,              // Unique identifier
  name: string,            // Full product name
  code: string,            // Product code/SKU
  category: string,        // Must match CATEGORIES[].id
  specs: string[],         // Technical specifications
  description: string,     // Detailed description
  imageUrl: string,        // Cloudinary URL or data URL
  status: 'In Stock' | 'Limited' | 'Pre-Order'
}
```

---

### 3. **types.ts** (~20 lines)
TypeScript type definitions.

```typescript
export interface Product { /* ... */ }
export interface Category { /* ... */ }
export interface Message {
  text: string;
  sender: 'user' | 'ai';
  sources?: GroundingSource[];
}
export interface GroundingSource {
  title: string;
  uri: string;
}
export interface HeroSlide { /* ... */ }
```

---

### 4. **services/geminiService.ts** (~75 lines)
Gemini AI integration wrapper.

**Class:** `GeminiService`

**Methods:**
```typescript
// Streaming chat (async generator)
async *streamTech(prompt: string): AsyncGenerator<{text, sources}>

// Non-streaming fallback
async searchTech(prompt: string): Promise<{text, sources}>
```

**Configuration:**
- Model: `gemini-3-flash-preview`
- Tools: `[{ googleSearch: {} }]`
- System Instruction: MikroTik expertise prompt

**Usage in App.tsx:**
```typescript
import { gemini } from './services/geminiService';

// In chat handler:
for await (const chunk of gemini.streamTech(userInput)) {
  // Update UI with chunk.text and chunk.sources
}
```

---

### 5. **services/cloudinaryService.ts** (~30 lines)
Image upload utility.

**Function:**
```typescript
export async function uploadImage(file: File): Promise<string>
```

**Process:**
1. Create FormData with file
2. Add upload_preset and cloud_name from env
3. POST to Cloudinary API
4. Return secure_url from response

**Environment Variables Required:**
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

---

### 6. **index.tsx** (~15 lines)
React app entry point.

```typescript
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

---

### 7. **index.html** (~150 lines)
HTML entry point with embedded Tailwind CSS.

**Key Features:**
- Tailwind CSS via CDN (development)
- Custom CSS variables for theme colors
- Meta tags for SEO and mobile
- Root div for React mount

**Tailwind Config:**
```javascript
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexlyn: '#E60026',
      }
    }
  }
}
```

---

### 8. **vite.config.ts** (~15 lines)
Vite build configuration.

```typescript
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
});
```

---

### 9. **tsconfig.json**
TypeScript compiler options.

**Key Settings:**
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled

---

### 10. **package.json**
Dependencies and scripts.

**Scripts:**
- `dev`: Vite dev server
- `build`: Production build
- `preview`: Preview prod build

**Dependencies:**
- react, react-dom (19.2.3)
- @google/genai (1.37.0)
- @cloudinary/react (1.13.0)
- recharts (3.6.0)

---

### 11. **.env.local** (gitignored)
Environment variables.

```env
GEMINI_API_KEY=xxx
VITE_CLOUDINARY_CLOUD_NAME=xxx
VITE_CLOUDINARY_UPLOAD_PRESET=xxx
```

---

### 12. **.env.local.example**
Template for environment setup.

---

### 13. **metadata.json**
App metadata for AI Studio.

```json
{
  "name": "NEXLYN - v2",
  "description": "High-end AI-powered distribution interface...",
  "requestFramePermissions": ["camera", "microphone", "geolocation"]
}
```

---

## Data Flow Diagrams

### Chat Flow
```
User types message
  ↓
setChatMessages([...messages, {text: userInput, sender: 'user'}])
  ↓
setIsStreaming(true)
  ↓
for await (chunk of gemini.streamTech(userInput))
  ↓
  setChatMessages(prev => {
    // Find last AI message or create new
    // Append chunk.text
    // Add chunk.sources
  })
  ↓
setIsStreaming(false)
```

### Product Filter Flow
```
User changes category/search
  ↓
setSelectedCategory(category) or setSearchQuery(query)
  ↓
filteredProducts = useMemo(() => {
  products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => searchQuery === '' || name/code matches)
}, [products, category, searchQuery])
  ↓
ProductGrid renders filteredProducts
```

### Admin CRUD Flow
```
Admin enters passcode
  ↓
if (input === ADMIN_PASSCODE) setAdminAuth(true)
  ↓
Admin fills product form
  ↓
Optional: Upload image → uploadImage(file) → get URL
  ↓
Click Save → setProducts([...products, newProduct])
  ↓
Auto-refresh products view
```

---

## Key Algorithms & Logic

### Category Count Calculation
```typescript
const categoriesWithCounts = useMemo(() => 
  CATEGORIES.map(cat => ({
    ...cat,
    count: products.filter(p => p.category === cat.id).length
  }))
, [products]);
```

### Search Filter
```typescript
const matchesSearch = (product: Product) => {
  const q = searchQuery.toLowerCase();
  return product.name.toLowerCase().includes(q) ||
         product.code.toLowerCase().includes(q) ||
         product.specs.some(s => s.toLowerCase().includes(q));
};
```

### Chat Message Streaming
```typescript
for await (const chunk of gemini.streamTech(prompt)) {
  setChatMessages(prev => {
    const lastMsg = prev[prev.length - 1];
    if (lastMsg && lastMsg.sender === 'ai') {
      return [
        ...prev.slice(0, -1),
        {
          ...lastMsg,
          text: lastMsg.text + chunk.text,
          sources: [...(lastMsg.sources || []), ...chunk.sources]
        }
      ];
    } else {
      return [...prev, { text: chunk.text, sender: 'ai', sources: chunk.sources }];
    }
  });
}
```

---

## Styling Approach

### Tailwind Utilities
- **Layout**: `flex`, `grid`, `max-w-7xl`, `mx-auto`
- **Spacing**: `p-6`, `gap-4`, `space-y-3`
- **Colors**: `bg-white`, `dark:bg-black`, `text-nexlyn`
- **Effects**: `hover:scale-105`, `transition-all`, `duration-300`
- **Responsive**: `md:grid-cols-3`, `lg:flex-row`

### Custom Classes (in index.html)
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.gradient-radial {
  background: radial-gradient(circle, ...);
}
```

### Dark Mode
```html
<html class="dark">  <!-- Toggled by JS -->
```
All components use `dark:` variants for theming.

---

## API Integration Points

### 1. Gemini AI
**Endpoint:** Via `@google/genai` SDK  
**Auth:** API key in env  
**Usage:** Chat interface, streaming responses

### 2. Cloudinary
**Endpoint:** `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`  
**Auth:** Unsigned (upload preset)  
**Usage:** Admin product image uploads

### 3. WhatsApp
**Endpoint:** `https://wa.me/{number}?text={message}`  
**Auth:** None (public link)  
**Usage:** CTA buttons, contact links

---

## Performance Optimizations

1. **React.memo**: All sub-components memoized
2. **useMemo**: Filtered products, category counts
3. **Lazy Loading**: (Opportunity for improvement)
4. **Code Splitting**: (Opportunity for improvement)
5. **Image Optimization**: Cloudinary CDN, data URLs for placeholders

---

## Security Considerations

**Current Limitations:**
1. Client-side admin auth (passcode visible in source)
2. No backend validation
3. Unsigned Cloudinary uploads (public)
4. API keys exposed to client (mitigated by Vite env handling)

**Production Requirements:**
1. Backend API for admin
2. JWT authentication
3. Database for products
4. Server-side Gemini API calls
5. Signed image uploads

---

## Testing Considerations

**Manual Testing Checklist:**
- [ ] Search functionality
- [ ] Category filtering
- [ ] Product detail view
- [ ] Admin login
- [ ] Admin CRUD operations
- [ ] Image upload
- [ ] Chat interface
- [ ] WhatsApp links
- [ ] Theme toggle
- [ ] Mobile responsiveness
- [ ] Dark mode

**Automated Testing (Not Implemented):**
- Unit tests for utility functions
- Component tests with React Testing Library
- E2E tests with Playwright
- API integration tests

---

## Deployment Checklist

1. ✅ Set environment variables
2. ✅ Run `npm run build`
3. ✅ Test production build locally (`npm run preview`)
4. ✅ Upload `dist/` folder to hosting
5. ✅ Configure environment on platform
6. ✅ Verify all features work in production
7. ✅ Test WhatsApp links
8. ✅ Test chat (Gemini API)
9. ✅ Test image upload (Cloudinary)

---

## Common Modifications

### Add New Product
**File:** `constants.tsx`
```typescript
{
  id: 'new-product-id',
  name: 'New Product Name',
  code: 'PRODUCT-CODE',
  category: 'Routing', // Must match existing category
  specs: ['Spec 1', 'Spec 2'],
  description: 'Description here',
  imageUrl: 'https://res.cloudinary.com/...',
  status: 'In Stock',
}
```

### Add New Category
**File:** `constants.tsx`
```typescript
{
  id: 'new-category',
  name: 'New Category',
  icon: 'IconName', // Must exist in ICONS
  count: 0, // Auto-calculated
  description: 'Category description',
}
```

### Change Admin Passcode
**File:** `constants.tsx`
```typescript
export const ADMIN_PASSCODE = 'NEW_PASSCODE_HERE';
```

### Change WhatsApp Number
**File:** `constants.tsx`
```typescript
export const WHATSAPP_NUMBER = '1234567890';
```

### Modify AI Behavior
**File:** `services/geminiService.ts`
```typescript
const SYSTEM_INSTRUCTION = `
  Your new instructions here...
`;
```

### Change Theme Colors
**File:** `index.html` and `constants.tsx`
```typescript
export const COLORS = {
  primary: '#NEW_COLOR',
  // ...
};
```

---

## Debugging Tips

### Chat Not Working
1. Check `GEMINI_API_KEY` in `.env.local`
2. Verify API key is valid at https://ai.google.dev/
3. Check browser console for errors
4. Ensure internet connection
5. Test with simple query like "Hello"

### Image Upload Failing
1. Check Cloudinary credentials in `.env.local`
2. Verify upload preset is "unsigned"
3. Check network tab for API errors
4. Ensure file is an image
5. Check Cloudinary quota/limits

### Admin Panel Not Accessible
1. Verify passcode in `constants.tsx`
2. Check browser console for errors
3. Ensure `adminAuth` state is updating
4. Clear browser cache/localStorage

### Products Not Filtering
1. Check category IDs match between product and category
2. Verify `selectedCategory` state
3. Check `filteredProducts` useMemo
4. Console.log filter logic

---

## Performance Metrics

**Target Metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

**Current Bottlenecks:**
- Large App.tsx component (optimization opportunity)
- Inline Tailwind (production should use build step)
- No code splitting (all JS in one bundle)

**Optimization Opportunities:**
1. Split App.tsx into separate files
2. Implement React.lazy for views
3. Add image lazy loading
4. Optimize Tailwind (PurgeCSS)
5. Enable service worker

---

## Browser Compatibility

**Tested Browsers:**
- Chrome/Edge (Chromium): ✅
- Firefox: ✅
- Safari: ✅
- Mobile Safari: ✅
- Chrome Mobile: ✅

**Required Features:**
- ES2020 support
- Fetch API
- LocalStorage
- CSS Grid & Flexbox
- Async/Await & Generators

---

## Accessibility (A11y)

**Current Implementation:**
- Semantic HTML where possible
- ARIA labels on some buttons
- Keyboard navigation (basic)
- Focus states with `focus:` variants

**Improvements Needed:**
- Full keyboard navigation
- Screen reader optimization
- ARIA live regions for chat
- Color contrast verification
- Focus trap in modals

---

## Mobile Considerations

**Responsive Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Mobile Features:**
- Collapsible menu
- Touch-friendly tap targets
- Mobile search (can be improved)
- Swipeable carousel (opportunity)

---

## Code Quality Metrics

**Lines of Code:**
- App.tsx: ~2000
- constants.tsx: ~400
- Other files: ~200
- Total: ~2600 lines

**Complexity:**
- High cohesion in App.tsx (refactor opportunity)
- Clear separation of concerns in services
- Type safety with TypeScript

**Best Practices:**
- ✅ TypeScript strict mode
- ✅ React hooks best practices
- ✅ Memoization for performance
- ✅ Environment variables for secrets
- ⚠️ Component splitting needed
- ⚠️ Testing coverage needed

---

## Version History

**v2.0 (Current)**
- Gemini AI integration
- Cloudinary image uploads
- Admin panel with charts
- Dark mode support
- Mobile responsive

**v1.0 (Legacy)**
- Basic product catalog
- Static data
- No AI integration

---

## Future Roadmap

**Phase 1 (Immediate):**
- [ ] Add unit tests
- [ ] Split App.tsx into modules
- [ ] Implement proper error handling
- [ ] Add loading states

**Phase 2 (Short-term):**
- [ ] Backend API integration
- [ ] Database for products
- [ ] User authentication
- [ ] Shopping cart

**Phase 3 (Long-term):**
- [ ] Payment integration
- [ ] Order management
- [ ] Multi-language support
- [ ] Advanced analytics

---

## External Dependencies Documentation

### @google/genai
- **Docs:** https://ai.google.dev/docs
- **Key Types:** `GoogleGenAI`, `GenerateContentResponse`
- **Key Methods:** `generateContentStream`, `generateContent`

### @cloudinary/react
- **Docs:** https://cloudinary.com/documentation/react_integration
- **Usage:** Direct API upload (no React components used)

### recharts
- **Docs:** https://recharts.org/
- **Components Used:** `PieChart`, `BarChart`, `ResponsiveContainer`

---

## Glossary

**SPA:** Single Page Application  
**HMR:** Hot Module Replacement  
**CDN:** Content Delivery Network  
**B2B:** Business to Business  
**CRUD:** Create, Read, Update, Delete  
**MikroTik:** Network equipment manufacturer  
**RouterOS:** MikroTik's operating system  
**CCR:** Cloud Core Router  
**CRS:** Cloud Router Switch  
**PoE:** Power over Ethernet  

---

**This document provides a complete technical reference for AI agents to understand and work with the NEXLYN codebase.**
