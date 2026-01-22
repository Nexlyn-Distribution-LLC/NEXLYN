# NEXLYN - Quick Reference Guide for AI
## Code Snippets, Examples, and Common Tasks

---

## 🚀 Quick Start Commands

```bash
# Installation
git clone https://github.com/vishnu-madhavan-git/NEXLYN---v2.git
cd NEXLYN---v2
npm install

# Environment Setup
cp .env.local.example .env.local
# Edit .env.local with your keys

# Development
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build

# Deployment
vercel              # Deploy to Vercel
netlify deploy      # Deploy to Netlify
```

---

## 📝 Environment Variables Template

```env
# .env.local
GEMINI_API_KEY=AIzaSy...your_key_here
VITE_CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

---

## 🎯 Common Code Patterns

### 1. Adding a New Product

**Location:** `constants.tsx`

```typescript
export const PRODUCTS: Product[] = [
  // ... existing products
  {
    id: 'ccr2116-12g-4s',
    name: 'MikroTik® CCR2116-12G-4S+',
    code: 'Cloud Core Router',
    category: 'Routing',
    specs: [
      '12× Gigabit Ethernet',
      '4× 10G SFP+',
      'AL52400 @ 2 GHz',
      '16 GB RAM',
      'RouterOS v7'
    ],
    description: 'Powerful cloud router with excellent price-to-performance ratio for medium enterprises.',
    imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/product.jpg',
    status: 'In Stock',
  },
];
```

---

### 2. Adding a New Category

**Location:** `constants.tsx`

```typescript
export const CATEGORIES: Category[] = [
  // ... existing categories
  {
    id: 'security',
    name: 'Security',
    icon: 'Shield',  // Must exist in ICONS object
    count: 0,        // Auto-calculated by app
    description: 'Security and monitoring solutions'
  },
];
```

---

### 3. Adding a New Icon

**Location:** `constants.tsx`

```typescript
export const ICONS = {
  // ... existing icons
  Security: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
         viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};
```

---

### 4. Using Gemini AI Service

**In any component:**

```typescript
import { gemini } from './services/geminiService';

// Streaming response
async function handleChatMessage(userInput: string) {
  for await (const chunk of gemini.streamTech(userInput)) {
    console.log('Text chunk:', chunk.text);
    console.log('Sources:', chunk.sources);
    // Update UI with chunk
  }
}

// Non-streaming (simple)
async function quickQuery(prompt: string) {
  const response = await gemini.searchTech(prompt);
  console.log('Response:', response.text);
  console.log('Sources:', response.sources);
  return response;
}
```

---

### 5. Uploading Image to Cloudinary

**In admin panel or form:**

```typescript
import { uploadImage } from './services/cloudinaryService';

async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;
  
  try {
    const imageUrl = await uploadImage(file);
    console.log('Uploaded image URL:', imageUrl);
    // Use imageUrl in your product data
    setProductForm(prev => ({ ...prev, imageUrl }));
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

// JSX
<input 
  type="file" 
  accept="image/*"
  onChange={handleImageUpload}
/>
```

---

### 6. WhatsApp Integration

**Generate WhatsApp link:**

```typescript
function openWhatsApp(context: string = 'general', product?: Product) {
  const number = '1234567890';  // Your WhatsApp number
  let message = 'Hello Nexlyn Team,';
  
  if (context === 'general') {
    message = 'I am interested in your MikroTik distribution services.';
  } else if (context === 'product' && product) {
    message = `Hi! I'd like a B2B quote for:\n\n${product.name}\nCode: ${product.code}\n\nPlease send pricing and availability.`;
  } else if (context === 'support') {
    message = 'I need technical support for my network setup.';
  }
  
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Usage
<button onClick={() => openWhatsApp('general')}>
  Contact Us
</button>

<button onClick={() => openWhatsApp('product', selectedProduct)}>
  Get Quote
</button>
```

---

### 7. Theme Toggle Implementation

```typescript
function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Load theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, []);
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

---

### 8. Product Filtering

```typescript
import { useMemo } from 'react';

function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      const matchesCategory = selectedCategory === 'All' || 
                             product.category === selectedCategory;
      
      // Search filter
      const query = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(query) ||
        product.code.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.specs.some(spec => spec.toLowerCase().includes(query));
      
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);
  
  return (
    <>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
      />
      
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
```

---

### 9. Admin Authentication

```typescript
function AdminPanel() {
  const [adminAuth, setAdminAuth] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  
  const handleLogin = () => {
    if (passcodeInput === ADMIN_PASSCODE) {
      setAdminAuth(true);
      setPasscodeInput('');
    } else {
      alert('Incorrect passcode');
    }
  };
  
  if (!adminAuth) {
    return (
      <div className="admin-login">
        <h2>Admin Access</h2>
        <input 
          type="password"
          value={passcodeInput}
          onChange={(e) => setPasscodeInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Enter passcode"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }
  
  return (
    <div className="admin-panel">
      {/* Admin content */}
    </div>
  );
}
```

---

### 10. Product Form with Image Upload

```typescript
function ProductForm() {
  const [form, setForm] = useState({
    name: '',
    code: '',
    category: 'Routing',
    specs: '',  // Comma-separated
    description: '',
    imageUrl: '',
    status: 'In Stock' as const,
  });
  const [uploading, setUploading] = useState(false);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleSubmit = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...form,
      specs: form.specs.split(',').map(s => s.trim()),
    };
    
    setProducts(prev => [...prev, newProduct]);
    // Reset form
    setForm({
      name: '', code: '', category: 'Routing',
      specs: '', description: '', imageUrl: '', status: 'In Stock'
    });
  };
  
  return (
    <form>
      <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Product Name" />
      <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} placeholder="Product Code" />
      
      <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
        {CATEGORIES.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      
      <textarea value={form.specs} onChange={(e) => setForm({...form, specs: e.target.value})} placeholder="Specs (comma-separated)" />
      <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description" />
      
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploading && <p>Uploading...</p>}
      {form.imageUrl && <img src={form.imageUrl} alt="Preview" style={{width: 100}} />}
      
      <button type="button" onClick={handleSubmit}>Add Product</button>
    </form>
  );
}
```

---

### 11. Chat Interface with Streaming

```typescript
function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  
  const handleSend = async () => {
    if (!input.trim() || streaming) return;
    
    // Add user message
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setStreaming(true);
    
    // Stream AI response
    let aiMessageIndex = messages.length + 1;
    
    try {
      for await (const chunk of gemini.streamTech(input)) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[aiMessageIndex];
          
          if (lastMsg && lastMsg.sender === 'ai') {
            // Update existing AI message
            newMessages[aiMessageIndex] = {
              ...lastMsg,
              text: lastMsg.text + chunk.text,
              sources: [...(lastMsg.sources || []), ...chunk.sources],
            };
          } else {
            // Create new AI message
            newMessages.push({
              text: chunk.text,
              sender: 'ai',
              sources: chunk.sources,
            });
          }
          
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setStreaming(false);
    }
  };
  
  return (
    <div className="chat">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
            {msg.sources && msg.sources.length > 0 && (
              <div className="sources">
                {msg.sources.map((src, j) => (
                  <a key={j} href={src.uri} target="_blank" rel="noopener">
                    {src.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={streaming}
        />
        <button onClick={handleSend} disabled={streaming}>
          {streaming ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
```

---

### 12. Responsive Layout Example

```typescript
function ResponsiveGrid() {
  return (
    <div className="
      grid 
      grid-cols-1          /* 1 column on mobile */
      sm:grid-cols-2       /* 2 columns on small screens */
      md:grid-cols-3       /* 3 columns on medium screens */
      lg:grid-cols-4       /* 4 columns on large screens */
      gap-6                /* Spacing between items */
      px-4                 /* Horizontal padding */
      py-8                 /* Vertical padding */
      max-w-7xl            /* Max width */
      mx-auto              /* Center horizontally */
    ">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

### 13. Tailwind Dark Mode Classes

```typescript
function ThemedComponent() {
  return (
    <div className="
      bg-white dark:bg-black               /* Background */
      text-slate-900 dark:text-white       /* Text color */
      border border-black/10 dark:border-white/10  /* Borders */
      shadow-lg dark:shadow-white/5        /* Shadows */
    ">
      <button className="
        bg-nexlyn                          /* Brand color background */
        text-white                         /* White text */
        hover:bg-nexlyn/90                 /* Hover state */
        active:scale-95                    /* Click animation */
        transition-all duration-300        /* Smooth transitions */
      ">
        Click Me
      </button>
    </div>
  );
}
```

---

### 14. Auto-Rotating Carousel

```typescript
function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = HERO_SLIDES;
  
  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  return (
    <div className="carousel">
      <div className="slides">
        {slides.map((slide, i) => (
          <div 
            key={i}
            className={`slide ${i === currentSlide ? 'active' : ''}`}
            style={{
              transform: `translateX(${(i - currentSlide) * 100}%)`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <button>{slide.cta}</button>
          </div>
        ))}
      </div>
      
      {/* Dots */}
      <div className="dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={i === currentSlide ? 'active' : ''}
          />
        ))}
      </div>
    </div>
  );
}
```

---

### 15. Analytics Dashboard with Recharts

```typescript
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const categoryData = CATEGORIES.map(cat => ({
    name: cat.name,
    value: products.filter(p => p.category === cat.id).length
  }));
  
  const COLORS = ['#E60026', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
  
  return (
    <div className="dashboard">
      <h2>Category Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={entry => entry.name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <h2>Stock Levels</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={categoryData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill="#E60026" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## 🎨 Styling Utilities Reference

### Glass Morphism Effect
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradient Background
```css
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-radial {
  background: radial-gradient(circle at 50% 50%, #E60026 0%, #000 100%);
}
```

### Animation Classes
```css
.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-up {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```

### Hover Effects
```typescript
<div className="
  transition-all duration-300
  hover:scale-105
  hover:shadow-xl
  hover:border-nexlyn
  active:scale-95
">
  Hover me!
</div>
```

---

## 🔧 Utility Functions

### Format Currency
```typescript
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}

// Usage: formatPrice(1299) → "$1,299"
```

### Truncate Text
```typescript
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
```

### Debounce Search
```typescript
import { useEffect, useState } from 'react';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  useEffect(() => {
    // Perform search with debouncedSearch
  }, [debouncedSearch]);
}
```

### Copy to Clipboard
```typescript
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}
```

---

## 🐛 Debugging Snippets

### Console Log with Style
```typescript
console.log(
  '%c🚀 NEXLYN Debug',
  'color: #E60026; font-size: 16px; font-weight: bold;',
  { data: yourData }
);
```

### Performance Measurement
```typescript
console.time('Operation');
// ... your code
console.timeEnd('Operation'); // Logs: "Operation: 123.456ms"
```

### React DevTools Helper
```typescript
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);

useEffect(() => {
  console.log('Dependency changed:', dependency);
}, [dependency]);
```

---

## 📦 Export/Import Patterns

### Named Exports
```typescript
// constants.tsx
export const PRODUCTS = [...];
export const CATEGORIES = [...];
export const ICONS = {...};

// App.tsx
import { PRODUCTS, CATEGORIES } from './constants';
```

### Default Export
```typescript
// geminiService.ts
export class GeminiService {...}
export const gemini = new GeminiService();

// App.tsx
import { gemini } from './services/geminiService';
```

### Type Exports
```typescript
// types.ts
export interface Product {...}
export interface Message {...}

// App.tsx
import { Product, Message } from './types';
```

---

## 🌐 API Response Handling

### Gemini API Response
```typescript
// Response structure
{
  text: "AI response text here...",
  candidates: [
    {
      groundingMetadata: {
        groundingChunks: [
          {
            web: {
              title: "Source Title",
              uri: "https://example.com"
            }
          }
        ]
      }
    }
  ]
}
```

### Cloudinary Upload Response
```typescript
// Response structure
{
  secure_url: "https://res.cloudinary.com/...",
  public_id: "folder/filename",
  format: "jpg",
  width: 1920,
  height: 1080
}
```

---

## 🎯 Common Tasks Checklist

### ✅ Add New Product
1. Open `constants.tsx`
2. Add product object to `PRODUCTS` array
3. Ensure category matches existing category
4. Save file
5. Test in browser

### ✅ Change Theme Colors
1. Open `constants.tsx`
2. Modify `COLORS` object
3. Open `index.html`
4. Update Tailwind config colors
5. Test light/dark modes

### ✅ Update AI Behavior
1. Open `services/geminiService.ts`
2. Modify `SYSTEM_INSTRUCTION`
3. Save file
4. Test chat interface

### ✅ Deploy to Vercel
1. Run `npm run build`
2. Test with `npm run preview`
3. Install Vercel CLI: `npm i -g vercel`
4. Run `vercel`
5. Add env vars in Vercel dashboard
6. Deploy: `vercel --prod`

---

## 📚 Common Error Solutions

### Error: "GEMINI_API_KEY is not defined"
**Solution:**
```bash
# Create .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Restart dev server
npm run dev
```

### Error: "Module not found"
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Error: Cloudinary upload failing
**Solution:**
```typescript
// Check environment variables
console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

// Verify upload preset is "unsigned" in Cloudinary dashboard
```

### Error: Build fails
**Solution:**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix any type errors
# Then rebuild
npm run build
```

---

## 🚀 Production Optimization

### Vite Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'ai': ['@google/genai'],
        }
      }
    }
  }
});
```

### Image Optimization
```typescript
// Cloudinary transformations
const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_800,q_auto,f_auto/${publicId}`;
```

---

**This quick reference guide provides all the essential code snippets and examples needed to work with NEXLYN.**
