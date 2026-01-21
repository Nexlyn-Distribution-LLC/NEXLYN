import React, { useState, useEffect, useMemo } from 'react';
import { ICONS, PRODUCTS as INITIAL_PRODUCTS, CATEGORIES, WHATSAPP_NUMBER as INITIAL_WA, ADMIN_PASSCODE, OWNER_PASSCODE, HERO_SLIDES, VISUALS } from './constants';
import { Product, Message, GroundingSource, Category } from './types';
import { gemini } from './services/geminiService';

// Helper function to get category-specific gradient pattern
const getCategoryVisual = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'Routing': VISUALS.ROUTING,
    'Switching': VISUALS.SWITCHING,
    'Wireless': VISUALS.WIRELESS,
    '5G/LTE': VISUALS.LTE,
    'LTE': VISUALS.LTE,
    'IoT': VISUALS.WIRELESS,
    'Accessories': VISUALS.ACCESSORIES
  };
  return categoryMap[category] || VISUALS.ROUTING;
};

type ViewType = 'home' | 'products' | 'detail' | 'admin' | 'about' | 'contact';
type ThemeType = 'light' | 'dark';

const App: React.FC = () => {
  // --- THEME STATE ---
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('nexlyn_theme');
    return (saved as ThemeType) || 'dark';
  });

  // --- PERSISTENT DATA STATE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nexlyn_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [heroSlides, setHeroSlides] = useState<typeof HERO_SLIDES>(() => {
    const saved = localStorage.getItem('nexlyn_hero_slides');
    return saved ? JSON.parse(saved) : HERO_SLIDES;
  });
  const [waNumber, setWaNumber] = useState(() => localStorage.getItem('nexlyn_wa') || INITIAL_WA);
  const [aboutContent, setAboutContent] = useState(() => localStorage.getItem('nexlyn_about') || "Nexlyn is a premier MikroTik® Master Distributor based in Dubai, serving the Middle East and Africa. We specialize in providing carrier-grade routing, high-density switching, and professional wireless deployments for internet service providers and large-scale enterprises.");
  const [address, setAddress] = useState(() => localStorage.getItem('nexlyn_address') || "Deira, Gold Souk, Dubai, UAE");
  const [mapUrl, setMapUrl] = useState(() => localStorage.getItem('nexlyn_map_url') || "https://maps.app.goo.gl/971502474482");

  // --- UI STATE ---
  const [view, setView] = useState<ViewType>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [adminProductPage, setAdminProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;
  
  // --- ADMIN STATE ---
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const [isOwner, setIsOwner] = useState(() => sessionStorage.getItem('ownerAuth') === 'true');
  const [passInput, setPassInput] = useState('');
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [editSlide, setEditSlide] = useState<Partial<typeof HERO_SLIDES[0]> & { index?: number } | null>(null);

  // --- AI CHAT STATE ---
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hey there! � I\'m NEXY, your networking specialist here at Nexlyn. What can I help you find today? Maybe something powerful for your network? 💫' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // --- THEME SYNC ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nexlyn_theme', theme);
  }, [theme]);

  // --- SYNC TO LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('nexlyn_products', JSON.stringify(products));
    localStorage.setItem('nexlyn_hero_slides', JSON.stringify(heroSlides));
    localStorage.setItem('nexlyn_wa', waNumber);
    localStorage.setItem('nexlyn_about', aboutContent);
    localStorage.setItem('nexlyn_address', address);
    localStorage.setItem('nexlyn_map_url', mapUrl);
  }, [products, heroSlides, waNumber, aboutContent, address, mapUrl]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slide transition for Hero Blueprint Banners
  useEffect(() => {
    if (view === 'home') {
      const interval = setInterval(() => {
        setIsExiting(true);
        setTimeout(() => {
          setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
          setIsExiting(false);
        }, 700);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [view]);

  // --- COMPUTED ---
  // Dynamic category counts based on actual products
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCat === 'All' || p.category === selectedCat;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCat, searchQuery, products]);

  // --- ACTIONS ---
  const handleChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await gemini.searchTech(input);
      setMessages(prev => [...prev, { role: 'assistant', content: res.text, sources: res.sources }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, your browser doesn't support voice input. Please try using Chrome or Edge." }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        setMessages(prev => [...prev, { role: 'assistant', content: "I need microphone permission to use voice input. Please enable it in your browser settings." }]);
      } else if (event.error !== 'aborted') {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't understand that. Please try again or type your question." }]);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
    } catch (err) {
      setIsRecording(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Voice input is already active or there was an error. Please try again." }]);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const openWhatsApp = (context?: 'product' | 'reseller' | 'general' | 'category', data?: any) => {
    let text = "";
    if (context === 'product' && data) {
      text = `Hello NEXLYN Distributions,\n\nI’m interested in the *${data.name}* (${data.code}) for business deployment.\n\n*Product Details:*\n• ${data.specs.slice(0,3).join('\n• ')}\n\n*Please provide:*\n• Reseller/volume pricing tiers\n• Current stock availability\n• Lead time for export orders\n• Technical documentation\n• Warranty & RMA process\n\n*Company/Business:* [Your company name]\n*Estimated quantity:* [Quantity needed]\n*Delivery location:* [Country/Region]\n\nThank you!`;
    } else if (context === 'category' && data) {
      text = `Hello NEXLYN Distributions,\n\nI’m interested in your *${data}* products for business deployment.\n\n*Please provide:*\n• Product comparison & specifications\n• Volume pricing structure\n• Stock availability across range\n• Recommended solutions for my use case\n\n*Business details:*\n• Company: [Your company name]\n• Location: [Country/Region]\n\nThank you!`;
    } else if (context === 'reseller') {
      text = `Hello NEXLYN Distributions,\n\nI’m interested in becoming an *authorized MikroTik® reseller* in your territory.\n\n*Business Information:*\n• Company name: [Your company]\n• Territory: [City/Region]\n\n*I would like information about:*\n• Reseller program requirements\n• Volume pricing tiers\n• Technical training opportunities\n• Marketing support available\n• RMA & warranty procedures\n\nThank you!`;
    } else {
      text = `Hello NEXLYN Distributions,\n\nI’m interested in MikroTik® products for business/enterprise deployment.\n\n*Please provide information about:*\n• Product catalog & specifications\n• Pricing for business/volume orders\n• Technical consultation services\n• Training & certification programs\n• Export capabilities & documentation\n\n*Business details:*\n• Company: [Your company name]\n• Location: [Country/Region]\n\nThank you!`;
    }
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBannerClick = (slide: typeof heroSlides[0]) => {
    if (slide.categoryId) {
      setSelectedCat(slide.categoryId);
      setView('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- REFINED UI COMPONENTS ---
  const CategoryPill = ({ category, active, onClick }: { category: Category, active: boolean, onClick: () => void }) => {
    const Icon = category.icon ? (ICONS as any)[category.icon] : null;
    const actualCount = categoryCounts[category.name] || 0;
    
    return (
      <button 
        onClick={onClick}
        className={`group relative flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 whitespace-nowrap overflow-hidden
          ${active 
            ? 'bg-nexlyn border-nexlyn text-white shadow-xl shadow-nexlyn/20 translate-y-[-2px]' 
            : 'glass-panel border-black/10 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-nexlyn/20 hover:text-nexlyn dark:hover:text-white hover:translate-y-[-1px]'
          }`}
      >
        {active && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />}
        {Icon && <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-500'}`} />}
        <span className="text-[10px] font-black uppercase tracking-widest">{category.name}</span>
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border transition-colors
          ${active 
            ? 'bg-white/20 border-white/10 text-white' 
            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-slate-500 group-hover:text-slate-300'
          }`}>
          {actualCount}
        </span>
      </button>
    );
  };

  const Logo = () => (
    <div 
      className="flex items-center cursor-pointer group" 
      onClick={() => { setView('home'); setSearchQuery(''); }}
    >
      <div className="flex items-center">
        <span className="font-black text-[20px] text-black dark:text-white uppercase tracking-tight leading-none">NE</span>
        <span className="relative mx-1">
          <span className="font-black text-[42px] leading-none uppercase bg-gradient-to-br from-[#E60026] via-[#FF0033] to-[#FF1744] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(230,0,38,0.3)] group-hover:drop-shadow-[0_4px_12px_rgba(230,0,38,0.5)] transition-all duration-300 group-hover:scale-110" style={{fontWeight: 900, letterSpacing: '-0.02em'}}>X</span>
          <div className="absolute inset-0 bg-gradient-to-br from-[#E60026] to-[#FF1744] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
        </span>
        <span className="font-black text-[20px] text-black dark:text-white uppercase tracking-tight leading-none">LYN</span>
      </div>
    </div>
  );

  const Header = () => (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-4 bg-white/90 dark:bg-black/80 backdrop-blur-lg border-b border-black/5 dark:border-white/5 shadow-sm' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-6">
        <Logo />
        
        <div className="flex-1 max-w-lg relative hidden md:block">
          <input 
            type="text"
            placeholder="Search hardware by name or code..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (view !== 'products' && e.target.value.length > 0) setView('products');
            }}
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-[11px] font-bold text-slate-900 dark:text-white outline-none focus:border-nexlyn focus:bg-white/10 transition-all placeholder:text-slate-500"
          />
          <ICONS.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-lg font-light"
            >×</button>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-8 shrink-0">
          {['Home', 'Products', 'About', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => { setView(item.toLowerCase() as any); setSearchQuery(''); }} 
              className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${view === item.toLowerCase() ? 'text-nexlyn opacity-100' : 'text-slate-900 dark:text-white opacity-60 hover:opacity-100'}`}
            >{item}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl glass-panel border border-black/10 dark:border-white/10 hover:border-nexlyn/30 transition-all text-slate-900 dark:text-white"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <button onClick={() => setView('admin')} className="p-2 opacity-30 hover:opacity-100 transition-opacity hidden sm:block text-slate-900 dark:text-white"><ICONS.Shield className="w-5 h-5" /></button>
          <button onClick={() => openWhatsApp('general')} className="px-5 py-2.5 bg-nexlyn text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-nexlyn/20">B2B Quote</button>
        </div>
      </div>
      
      <div className="md:hidden px-6 mt-4">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search hardware..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (view !== 'products' && e.target.value.length > 0) setView('products');
            }}
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-bold text-slate-900 dark:text-white outline-none focus:border-nexlyn"
          />
          <ICONS.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
    </header>
  );

  const AdminView = () => {
    const [authError, setAuthError] = React.useState('');
    
    const handleAdminAuth = () => {
      if (passInput === OWNER_PASSCODE) {
        sessionStorage.setItem('ownerAuth', 'true');
        sessionStorage.setItem('adminAuth', 'true');
        setIsOwner(true);
        setIsAdmin(true);
        setAuthError('');
      } else if (passInput === ADMIN_PASSCODE) {
        sessionStorage.setItem('adminAuth', 'true');
        setIsAdmin(true);
        setAuthError('');
      } else {
        setAuthError('Invalid Admin Key. Access Denied.');
      }
    };

    return (
    <div className="pt-32 px-6 max-w-6xl mx-auto space-y-12 pb-40">
      {!isAdmin ? (
        <div className="max-w-md mx-auto glass-panel p-10 rounded-2xl text-center space-y-6">
          <h2 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Key" 
            className="w-full bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 p-4 rounded-xl text-center outline-none focus:border-nexlyn transition-all"
            value={passInput}
            onChange={e => setPassInput(e.target.value)}
            onFocus={() => setAuthError('')}
            onKeyPress={e => e.key === 'Enter' && handleAdminAuth()}
          />
          {authError && <div className="text-red-500 text-sm font-bold">{authError}</div>}
          <button 
            onClick={handleAdminAuth}
            className="w-full py-4 bg-nexlyn text-white rounded-xl font-bold uppercase text-xs hover:brightness-110 transition-all"
          >Authorize</button>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-black italic uppercase text-slate-900 dark:text-white">Management <span className="text-nexlyn">Panel</span></h2>
            <button onClick={() => { setIsAdmin(false); setIsOwner(false); sessionStorage.removeItem('adminAuth'); sessionStorage.removeItem('ownerAuth'); }} className="text-xs font-bold uppercase text-slate-500 hover:text-white">Exit Dashboard</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-nexlyn uppercase tracking-widest">Global Settings</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">WhatsApp Number</label>
                  <input type="text" value={waNumber} onChange={e => setWaNumber(e.target.value)} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Office Location</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Google Maps URL</label>
                  <input type="text" value={mapUrl} onChange={e => setMapUrl(e.target.value)} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm" />
                </div>
              </div>
            </div>
            <div className="glass-panel p-8 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-nexlyn uppercase tracking-widest">About Section</h3>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-500">Company Bio</label>
                <textarea value={aboutContent} onChange={e => setAboutContent(e.target.value)} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm h-48 resize-none" />
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="glass-panel p-8 rounded-2xl space-y-6 border-2 border-nexlyn/30">
              <div className="flex items-center gap-3">
                <ICONS.Shield className="w-6 h-6 text-nexlyn" />
                <h3 className="text-lg font-bold text-nexlyn uppercase tracking-widest">Owner Access Panel</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Access Credentials</div>
                  <div className="bg-nexlyn/10 p-4 rounded-xl space-y-2">
                    <div className="text-[9px] uppercase tracking-wider text-slate-500">Client Admin Password</div>
                    <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">3210</div>
                  </div>
                  <div className="bg-nexlyn/10 p-4 rounded-xl space-y-2">
                    <div className="text-[9px] uppercase tracking-wider text-slate-500">Owner Password</div>
                    <div className="font-mono text-sm font-bold text-nexlyn">4560</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">System Info</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-3 glass-panel rounded-lg">
                      <span className="text-slate-500">Total Products</span>
                      <span className="font-bold text-slate-900 dark:text-white">{products.length}</span>
                    </div>
                    <div className="flex justify-between p-3 glass-panel rounded-lg">
                      <span className="text-slate-500">Theme</span>
                      <span className="font-bold text-slate-900 dark:text-white capitalize">{theme}</span>
                    </div>
                    <div className="flex justify-between p-3 glass-panel rounded-lg">
                      <span className="text-slate-500">Access Level</span>
                      <span className="font-bold text-nexlyn">Owner</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white">Product Catalog</h3>
              <button 
                onClick={() => setEditProduct({ id: Date.now().toString(), name: '', code: '', category: 'Routing', specs: [], status: 'In Stock', description: '', imageUrl: '' })}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase hover:bg-nexlyn hover:text-white transition-all"
              >Add Product</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice((adminProductPage - 1) * PRODUCTS_PER_PAGE, adminProductPage * PRODUCTS_PER_PAGE).map(p => (
                <div key={p.id} className="glass-panel p-5 rounded-2xl flex justify-between items-center border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-4 flex-1 truncate">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-nexlyn/20 via-black to-black flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/5">
                      <img src={getCategoryVisual(p.category)} className="w-full h-full object-cover opacity-90 mix-blend-screen" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{p.name}</div>
                      <div className="text-[9px] text-slate-500 uppercase">{p.category}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditProduct(p)} className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit Product">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                      </svg>
                    </button>
                    <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete Product">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {Math.ceil(products.length / PRODUCTS_PER_PAGE) > 1 && (
              <div className="flex justify-center items-center gap-4 pt-6">
                <button 
                  onClick={() => setAdminProductPage(Math.max(1, adminProductPage - 1))}
                  disabled={adminProductPage === 1}
                  className="px-4 py-2 glass-panel border border-black/10 dark:border-white/10 rounded-lg text-xs font-black uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:border-nexlyn/40 transition-all"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.ceil(products.length / PRODUCTS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setAdminProductPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                        page === adminProductPage 
                          ? 'bg-nexlyn text-white' 
                          : 'glass-panel border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-nexlyn/40'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setAdminProductPage(Math.min(Math.ceil(products.length / PRODUCTS_PER_PAGE), adminProductPage + 1))}
                  disabled={adminProductPage === Math.ceil(products.length / PRODUCTS_PER_PAGE)}
                  className="px-4 py-2 glass-panel border border-black/10 dark:border-white/10 rounded-lg text-xs font-black uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:border-nexlyn/40 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Hero Banner Management */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white">Hero Banners</h3>
              <button 
                onClick={() => setEditSlide({ title: '', subtitle: '', image: '', categoryId: 'Routing', index: heroSlides.length })}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase hover:bg-nexlyn hover:text-white transition-all"
              >Add Banner</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroSlides.map((slide, index) => (
                <div key={index} className="glass-panel p-5 rounded-2xl border border-black/5 dark:border-white/5">
                  <div className="aspect-video rounded-lg overflow-hidden mb-4 relative group">
                    <img src={slide.image} className="w-full h-full object-cover" alt={slide.categoryId} />
                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-black/60 via-black/20 to-black/80' : 'bg-gradient-to-b from-white/60 via-white/20 to-white/80'}`} />
                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]'}`} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center space-y-2 px-4">
                        <div className="text-xs font-black text-nexlyn uppercase tracking-wider">{slide.categoryId}</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{slide.title}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-2">{slide.title}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-2">{slide.subtitle}</div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setEditSlide({ ...slide, index })} className="flex-1 p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-black/10 dark:border-white/10 rounded-lg" title="Edit Banner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                        </svg>
                      </button>
                      <button onClick={() => setHeroSlides(heroSlides.filter((_, i) => i !== index))} className="flex-1 p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-black/10 dark:border-white/10 rounded-lg" title="Delete Banner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/50 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-300" onClick={(e) => e.target === e.currentTarget && setEditProduct(null)}>
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 p-8 rounded-2xl space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white">Product Editor</h3>
              <button onClick={() => setEditProduct(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110 active:scale-95" title="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* MikroTik URL Auto-Fill */}
            <div className="p-5 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border border-red-200 dark:border-red-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <label className="text-xs font-bold uppercase text-red-700 dark:text-red-400">Quick Import from MikroTik</label>
              </div>
              <input 
                type="text"
                placeholder="Paste product URL (e.g., https://mikrotik.com/product/ccr2004...)"
                className="w-full bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 p-3 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                onPaste={(e) => {
                  const url = e.clipboardData.getData('text');
                  const match = url.match(/\/product\/([^/?]+)/);
                  if (match) {
                    const productCode = match[1].toUpperCase().replace(/_/g, '-');
                    setEditProduct({
                      ...editProduct,
                      code: productCode,
                      name: editProduct.name || `MikroTik® ${productCode}`
                    });
                  }
                }}
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">Auto-fills product code from MikroTik URL</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Product Name *</label>
                <input 
                  type="text"
                  value={editProduct.name || ''} 
                  onChange={e => setEditProduct({...editProduct, name: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="MikroTik® CCR2004..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Model Code *</label>
                <input 
                  type="text"
                  value={editProduct.code || ''} 
                  onChange={e => setEditProduct({...editProduct, code: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="CCR2004-1G-12S+2XS"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Category *</label>
                <select 
                  value={editProduct.category || 'Routing'} 
                  onChange={e => setEditProduct({...editProduct, category: e.target.value as any})} 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {['Routing', 'Switching', 'Wireless', '5G/LTE', 'IoT', 'Accessories'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Stock Status</label>
                <select 
                  value={editProduct.status || 'In Stock'} 
                  onChange={e => setEditProduct({...editProduct, status: e.target.value as any})} 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-Order">Pre-Order</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Image URL</label>
              <input 
                type="text"
                value={editProduct.imageUrl || ''} 
                onChange={e => setEditProduct({...editProduct, imageUrl: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="https://i.mt.lv/cdn/product_files/..."
              />
              {editProduct.imageUrl && (
                <div className="mt-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <img src={editProduct.imageUrl} alt="Preview" className="w-32 h-32 object-contain bg-gradient-to-br from-red-100 to-slate-200 dark:from-red-950 dark:to-slate-800 rounded-lg mx-auto" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjNjY2IiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'; }} />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Description</label>
              <textarea 
                value={editProduct.description || ''} 
                onChange={e => setEditProduct({...editProduct, description: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm h-28 resize-none text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="Enterprise-grade router..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">YouTube Video URL (Optional)</label>
              <input 
                type="text"
                value={editProduct.youtubeUrl || ''} 
                onChange={e => setEditProduct({...editProduct, youtubeUrl: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {editProduct.youtubeUrl && (
                <div className="mt-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <div className="aspect-video rounded overflow-hidden">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={editProduct.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]} 
                      title="Video Preview"
                      frameBorder="0"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Specifications (Comma separated)</label>
              <input 
                type="text"
                value={editProduct.specs?.join(', ') || ''} 
                onChange={e => setEditProduct({...editProduct, specs: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="12× 10G SFP+, 2× 25G SFP28, 4GB RAM"
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  if (editProduct.name && editProduct.code) {
                    if (products.find(p => p.id === editProduct.id)) {
                      setProducts(products.map(p => p.id === editProduct.id ? editProduct as Product : p));
                    } else {
                      setProducts([...products, editProduct as Product]);
                    }
                    setEditProduct(null);
                  } else {
                    alert('Please fill in Product Name and Model Code');
                  }
                }}
                className="flex-1 py-4 bg-[#E60026] text-white rounded-xl font-bold uppercase text-xs hover:bg-[#c00020] transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
              >Save Product</button>
              <button 
                onClick={() => setEditProduct(null)} 
                className="px-8 py-4 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold uppercase text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-all hover:scale-[1.02] active:scale-95"
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Editor Modal */}
      {editSlide && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/50 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-300" onClick={(e) => e.target === e.currentTarget && setEditSlide(null)}>
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 p-8 rounded-2xl space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white">Banner Editor</h3>
              <button onClick={() => setEditSlide(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110 active:scale-95" title="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Image Preview */}
            {editSlide.image && (
              <div className="aspect-video rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700">
                <img src={editSlide.image} className="w-full h-full object-cover" alt="Preview" />
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-black/60 via-black/20 to-black/80' : 'bg-gradient-to-b from-white/60 via-white/20 to-white/80'}`} />
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]'}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 px-6">
                    <div className="text-xs font-black text-nexlyn uppercase tracking-wider">{editSlide.categoryId}</div>
                    <div className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase italic">{editSlide.title}</div>
                    <div className="text-sm text-slate-700 dark:text-slate-200">{editSlide.subtitle}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Banner Title *</label>
              <input 
                type="text"
                value={editSlide.title || ''} 
                onChange={e => setEditSlide({...editSlide, title: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="OFFICIAL MIKROTIK® MASTER DISTRIBUTOR."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Banner Subtitle *</label>
              <textarea 
                value={editSlide.subtitle || ''} 
                onChange={e => setEditSlide({...editSlide, subtitle: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm h-24 resize-none text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="Your authorized source for genuine network infrastructure..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Category Focus</label>
              <select 
                value={editSlide.categoryId || 'Routing'} 
                onChange={e => setEditSlide({...editSlide, categoryId: e.target.value})} 
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {['Routing', 'Switching', 'Wireless', '5G/LTE', 'IoT', 'Accessories'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Background Image URL *</label>
              <input 
                type="text"
                value={editSlide.image || ''} 
                onChange={e => setEditSlide({...editSlide, image: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-3 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="https://images.unsplash.com/... or data:image/svg+xml..."
              />
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400">Theme Integration</div>
                <p className="text-xs text-blue-600 dark:text-blue-300">Banners automatically apply theme-aware overlays to ensure text readability in both dark and light modes. Choose high-contrast images for best results.</p>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  if (editSlide.title && editSlide.subtitle && editSlide.image) {
                    const newSlides = [...heroSlides];
                    if (typeof editSlide.index === 'number' && editSlide.index < heroSlides.length) {
                      newSlides[editSlide.index] = { title: editSlide.title, subtitle: editSlide.subtitle, image: editSlide.image, categoryId: editSlide.categoryId };
                    } else {
                      newSlides.push({ title: editSlide.title, subtitle: editSlide.subtitle, image: editSlide.image, categoryId: editSlide.categoryId });
                    }
                    setHeroSlides(newSlides);
                    setEditSlide(null);
                  } else {
                    alert('Please fill in all required fields');
                  }
                }}
                className="flex-1 py-4 bg-[#E60026] text-white rounded-xl font-bold uppercase text-xs hover:bg-[#c00020] transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
              >Save Banner</button>
              <button 
                onClick={() => setEditSlide(null)} 
                className="px-8 py-4 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold uppercase text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-all hover:scale-[1.02] active:scale-95"
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };

  return (
    <div className="min-h-screen transition-colors duration-500">
      <Header />
      
      <main>
        {view === 'home' && (
          <>
            <section 
              className="relative h-[100vh] flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => handleBannerClick(heroSlides[slideIndex])}
            >
              {heroSlides.map((slide, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === slideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                  <img 
                    src={slide.image} 
                    className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-linear ${idx === slideIndex ? 'scale-110' : 'scale-100'}`} 
                    alt={slide.categoryId}
                  />
                  <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-black/60 via-black/20 to-black/80' : 'bg-gradient-to-b from-white/60 via-white/20 to-white/80'}`} />
                  <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]'}`} />
                </div>
              ))}

              <div 
                key={`content-${slideIndex}`} 
                className={`relative z-10 max-w-7xl mx-auto px-6 w-full text-center space-y-12 ${isExiting ? 'hero-animate-out' : 'hero-animate-in'}`}
              >
                <div className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                  NEXLYN - <span className="text-nexlyn">MikroTik Master Distributor</span>
                </div>
                
                <div className="inline-flex items-center gap-4 px-6 py-2 glass-panel rounded-full border border-nexlyn/40 stagger-1 shadow-2xl shadow-nexlyn/20">
                  <div className="w-2 h-2 rounded-full bg-nexlyn animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">
                    Category Focus: <span className="text-nexlyn">{heroSlides[slideIndex].categoryId}</span>
                  </span>
                </div>
                
                <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.85] uppercase italic text-slate-900 dark:text-white stagger-2 drop-shadow-2xl">
                  {heroSlides[slideIndex].title.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? 'text-nexlyn' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                
                <p className="max-w-2xl mx-auto text-slate-700 dark:text-slate-200 text-lg md:text-xl font-bold leading-relaxed drop-shadow stagger-3">
                  {heroSlides[slideIndex].subtitle}
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 pt-6 stagger-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setView('products'); }} 
                    className="px-12 py-5 bg-nexlyn text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-nexlyn/30 hover:translate-y-[-2px] transition-all"
                  >
                    View Products
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openWhatsApp('reseller'); }} 
                    className="px-12 py-5 glass-panel border border-black/10 dark:border-white/20 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-all backdrop-blur-md"
                  >
                    Partner with Us
                  </button>
                </div>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  key={`bar-${slideIndex}`}
                  className="h-full bg-nexlyn animate-[data-flow_7s_linear_infinite]"
                  style={{ width: '100%' }}
                />
              </div>
            </section>

            <div className="bg-black/[0.02] dark:bg-white/[0.02] border-y border-black/5 dark:border-white/5 py-8 overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                {[
                  { label: 'Genuine MikroTik®', icon: '✔️' },
                  { label: 'Factory Warranty', icon: '🛡️' },
                  { label: 'Technical Training', icon: '🎓' },
                  { label: 'Export Documentation', icon: '📦' },
                  { label: 'Volume Pricing', icon: '💰' },
                  { label: 'RMA Support', icon: '🛠️' }
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-nexlyn font-bold">{item.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <WhyNexlyn />
            <ResellerProgram />

            {/* PREDICTIVE CORE INVENTORY GRID - SHOWING ALL FEATURED PRODUCTS */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
               <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">CORE <span className="text-nexlyn">INVENTORY.</span></h2>
                    <div className="h-1 w-24 bg-nexlyn rounded-full" />
                  </div>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 max-w-full">
                     {CATEGORIES.map(c => (
                       <CategoryPill 
                        key={c.id} 
                        category={c} 
                        active={selectedCat === c.name} 
                        onClick={() => setSelectedCat(c.name)} 
                       />
                     ))}
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {filteredProducts.slice(0, 16).map(p => (
                    <div key={p.id} onClick={() => { setActiveProduct(p); setView('detail'); }} className="group glass-panel p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-black/5 dark:border-white/5 hover:border-nexlyn/40 transition-all cursor-pointer overflow-hidden flex flex-col h-full">
                      <div className="aspect-square rounded-xl md:rounded-2xl bg-gradient-to-br from-nexlyn/20 via-black to-black overflow-hidden mb-4 md:mb-8 border border-black/5 dark:border-white/5 relative">
                        <img src={getCategoryVisual(p.category)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-screen opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      </div>
                      <div className="space-y-2 md:space-y-3 mt-auto">
                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-nexlyn px-2 md:px-3 py-1 bg-nexlyn/10 rounded-full">{p.category}</span>
                        <h3 className="text-sm md:text-xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white leading-tight line-clamp-2">{p.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs line-clamp-2 hidden md:block">{p.description}</p>
                      </div>
                    </div>
                  ))}
               </div>
               <div className="mt-16 text-center">
                  <button onClick={() => setView('products')} className="text-xs font-black uppercase tracking-widest text-nexlyn border-b-2 border-nexlyn/20 hover:border-nexlyn pb-2 transition-all">Explore Entire Catalog</button>
               </div>
            </section>
          </>
        )}

        {view === 'products' && (
          <div className="pt-40 px-6 max-w-7xl mx-auto pb-40 animate-in fade-in duration-500">
             <div className="space-y-8 mb-20">
                <div className="space-y-2">
                  <h2 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">The <span className="text-nexlyn">Catalog.</span></h2>
                  {searchQuery && <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Search results for: "{searchQuery}"</p>}
                </div>
                
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                   {CATEGORIES.map(c => (
                     <CategoryPill 
                        key={c.id} 
                        category={c} 
                        active={selectedCat === c.name} 
                        onClick={() => setSelectedCat(c.name)} 
                      />
                   ))}
                </div>
             </div>
             
             {filteredProducts.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {filteredProducts.map(p => (
                    <div key={p.id} onClick={() => { setActiveProduct(p); setView('detail'); }} className="group glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl border border-black/5 dark:border-white/5 hover:border-nexlyn/30 transition-all cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-nexlyn/20 via-black to-black rounded-lg md:rounded-xl overflow-hidden mb-4 md:mb-6 relative border border-black/5 dark:border-white/5">
                        <img src={getCategoryVisual(p.category)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 mix-blend-screen" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <span className="text-[6px] md:text-[7px] font-black uppercase text-nexlyn">{p.category}</span>
                        <h3 className="text-sm md:text-lg font-black uppercase italic text-slate-900 dark:text-white line-clamp-2">{p.name}</h3>
                        <div className="text-[8px] md:text-[9px] text-slate-500 font-bold truncate">{p.code}</div>
                      </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-20 text-center glass-panel rounded-3xl border border-black/5 dark:border-white/5">
                 <div className="text-4xl mb-4">🔍</div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No hardware found</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">We couldn't find any MikroTik® products matching your search criteria.</p>
                 <button onClick={() => { setSearchQuery(''); setSelectedCat('All'); }} className="mt-6 text-nexlyn font-bold uppercase text-[10px] tracking-widest border-b border-nexlyn/20">Clear all filters</button>
               </div>
             )}
          </div>
        )}

        {view === 'about' && (
          <div className="pt-40 px-6 max-w-4xl mx-auto space-y-20 pb-40 animate-in fade-in slide-in-from-bottom-6">
             <div className="space-y-8">
                <h2 className="text-7xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">The <span className="text-nexlyn">Nexlyn</span> Story.</h2>
                <p className="text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{aboutContent}</p>
                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-black/5 dark:border-white/5">
                   <div className="space-y-2">
                      <div className="text-5xl font-black italic text-nexlyn">Est. 2026</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Authorized Master Distributor</div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-5xl font-black italic text-nexlyn">130+</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Countries Served</div>
                   </div>
                </div>
             </div>
             <div className="glass-panel p-10 rounded-[2.5rem] space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white">Find Our Hub</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Headquartered in Dubai's premier digital hub, we ensure lightning-fast dispatch across the entire MENA region.</p>
                  <div className="text-slate-900 dark:text-white font-bold">{address}</div>
                </div>
                <a href={mapUrl} target="_blank" className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-[10px] hover:bg-nexlyn hover:text-white transition-all">
                  <ICONS.Globe className="w-5 h-5" />
                  View Location on Maps
                </a>
             </div>
          </div>
        )}

        {view === 'contact' && (
          <div className="pt-40 px-6 max-w-4xl mx-auto space-y-20 pb-40 animate-in fade-in slide-in-from-bottom-6">
             <div className="space-y-8">
                <h2 className="text-7xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Get In <span className="text-nexlyn">Touch.</span></h2>
                <p className="text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Connect with NEXLYN Distributions for all your MikroTik® hardware and B2B partnership inquiries.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-10 rounded-[2.5rem] space-y-8 border border-black/5 dark:border-white/5 hover:border-nexlyn/30 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-nexlyn/10 flex items-center justify-center">
                         <ICONS.Globe className="w-7 h-7 text-nexlyn" />
                      </div>
                      <div>
                         <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">Email</h3>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">General Inquiries</p>
                      </div>
                   </div>
                   <a href="mailto:contact@nexlyn.com" className="text-xl font-bold text-nexlyn hover:underline block">contact@nexlyn.com</a>
                </div>

                <div className="glass-panel p-10 rounded-[2.5rem] space-y-8 border border-black/5 dark:border-white/5 hover:border-nexlyn/30 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center">
                         <ICONS.WhatsApp className="w-7 h-7 text-[#25D366]" />
                      </div>
                      <div>
                         <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">WhatsApp</h3>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">B2B Direct Line</p>
                      </div>
                   </div>
                   <a href={`https://wa.me/${waNumber}`} target="_blank" className="text-xl font-bold text-[#25D366] hover:underline block">+{waNumber}</a>
                </div>

                <div className="glass-panel p-10 rounded-[2.5rem] space-y-8 border border-black/5 dark:border-white/5 hover:border-nexlyn/30 transition-all md:col-span-2">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-nexlyn/10 flex items-center justify-center">
                         <ICONS.Router className="w-7 h-7 text-nexlyn" />
                      </div>
                      <div>
                         <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">Distribution Hub</h3>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dubai Office - UAE</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{address}</div>
                      <a href={mapUrl} target="_blank" className="inline-flex items-center gap-3 px-8 py-4 bg-nexlyn text-white rounded-xl font-black uppercase text-[10px] hover:brightness-110 transition-all">
                         <ICONS.Globe className="w-4 h-4" />
                         Open in Google Maps
                      </a>
                   </div>
                </div>
             </div>

             <div className="glass-panel p-10 rounded-[2.5rem] space-y-8 border border-black/5 dark:border-white/5">
                <h3 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white">Business Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/5">
                         <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Sunday - Thursday</span>
                         <span className="text-sm font-black text-slate-900 dark:text-white">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/5">
                         <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Saturday</span>
                         <span className="text-sm font-black text-slate-900 dark:text-white">10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Friday</span>
                         <span className="text-sm font-black text-red-500">Closed</span>
                      </div>
                   </div>
                   <div className="bg-nexlyn/5 rounded-2xl p-6 border border-nexlyn/20">
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                         <strong className="text-nexlyn">24/7 WhatsApp Support:</strong> For urgent B2B inquiries outside business hours, reach us on WhatsApp for immediate assistance.
                      </p>
                   </div>
                </div>
             </div>

             <div className="text-center space-y-6 pt-10">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Ready to discuss your project?</p>
                <button 
                   onClick={() => openWhatsApp('general')} 
                   className="px-12 py-5 bg-nexlyn text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-nexlyn/30 hover:translate-y-[-2px] transition-all"
                >
                   Start B2B Conversation
                </button>
             </div>
          </div>
        )}

        {view === 'detail' && activeProduct && (
           <div className="pt-32 px-6 max-w-7xl mx-auto pb-40 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 <div className="space-y-6">
                    <div className="aspect-square glass-panel rounded-[2.5rem] overflow-hidden border-2 border-slate-200 dark:border-slate-700 group bg-gradient-to-br from-nexlyn/10 via-black to-black relative shadow-xl">
                       <img 
                         src={getCategoryVisual(activeProduct.category)} 
                         className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 mix-blend-screen opacity-90" 
                         alt={activeProduct.name}
                       />
                    </div>
                    
                    {/* YouTube Video Section */}
                    {activeProduct.youtubeUrl && (
                      <div className="glass-panel rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                        <div className="aspect-video">
                          <iframe 
                            width="100%" 
                            height="100%" 
                            src={activeProduct.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]} 
                            title="Product Video"
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                 </div>
                 
                 <div className="flex flex-col justify-center space-y-8">
                    <div className="space-y-6">
                       <div className="flex items-center gap-3">
                         <span className="px-4 py-2 bg-gradient-to-r from-[#E60026] to-[#FF1744] text-white border border-red-300 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-500/20">{activeProduct.category}</span>
                         <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                           activeProduct.status === 'In Stock' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                           activeProduct.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                           'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                         }`}>{activeProduct.status}</span>
                       </div>
                       <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{activeProduct.name}</h1>
                       <div className="flex items-baseline gap-2">
                         <span className="text-sm font-bold text-slate-500 uppercase">Model:</span>
                         <span className="text-lg font-black text-[#E60026]">{activeProduct.code}</span>
                       </div>
                       <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{activeProduct.description}</p>
                    </div>
                    
                    {activeProduct.specs && activeProduct.specs.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 space-y-5 shadow-lg">
                         <div className="flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#E60026]">
                             <polyline points="9 11 12 14 22 4"></polyline>
                             <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                           </svg>
                           <div className="text-xs font-black uppercase text-[#E60026] tracking-wider">Technical Specifications</div>
                         </div>
                         <div className="grid grid-cols-1 gap-3">
                            {activeProduct.specs.map(s => (
                              <div key={s} className="flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                 <div className="w-2 h-2 bg-gradient-to-br from-[#E60026] to-[#FF1744] rounded-full mt-1.5 flex-shrink-0 shadow-lg shadow-red-500/30" />
                                 <span>{s}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                       <button onClick={() => openWhatsApp('product', activeProduct)} className="flex-1 py-5 bg-gradient-to-r from-[#E60026] to-[#FF1744] text-white rounded-xl font-black uppercase tracking-wider text-sm shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                         </svg>
                         Request Pricing & Availability
                       </button>
                       <button onClick={() => setView('products')} className="px-8 py-5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-wider text-sm hover:border-[#E60026] dark:hover:border-[#E60026] hover:scale-[1.02] active:scale-95 transition-all">
                         Back to Catalog
                       </button>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold italic">* Subject to MikroTik® global warranty policy and terms</p>
                 </div>
              </div>
              
              {/* Related Products Section */}
              {activeProduct.relatedProducts && activeProduct.relatedProducts.length > 0 && (
                <div className="mt-24 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-[#E60026] to-[#FF1744] rounded-full" />
                    <h2 className="text-3xl font-black uppercase text-slate-900 dark:text-white tracking-tight">Related Products</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activeProduct.relatedProducts.map(relatedId => {
                      const relatedProduct = products.find(p => p.id === relatedId);
                      if (!relatedProduct) return null;
                      return (
                        <div 
                          key={relatedProduct.id} 
                          onClick={() => { setActiveProduct(relatedProduct); window.scrollTo(0,0); }}
                          className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-[#E60026] dark:hover:border-[#E60026] transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/10"
                        >
                          <div className="aspect-square bg-gradient-to-br from-nexlyn/10 via-black to-black rounded-xl mb-4 overflow-hidden border border-black/5 dark:border-white/5">
                            <img 
                              src={getCategoryVisual(relatedProduct.category)} 
                              alt={relatedProduct.name}
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 mix-blend-screen opacity-90"
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-black text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight">{relatedProduct.name}</h3>
                            <p className="text-xs font-bold text-[#E60026]">{relatedProduct.code}</p>
                            <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold uppercase">{relatedProduct.category}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
           </div>
        )}

        {view === 'admin' && <AdminView />}
      </main>

      <div className={`fixed inset-y-0 right-0 w-full md:w-[420px] z-[200] transition-transform duration-700 ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full glass-panel border-l border-black/10 dark:border-white/10 flex flex-col shadow-2xl">
          <div className="p-8 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden backdrop-blur-2xl border border-white/20 dark:border-white/10" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5" />
                <div className="absolute inset-0 backdrop-blur-xl" />
                <span className="relative z-10 font-black text-3xl bg-gradient-to-br from-[#E60026] via-[#FF0033] to-[#FF1744] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(230,0,38,0.4)]" style={{letterSpacing: '-0.02em'}}>X</span>
              </div>
              <div>
                <h3 className="font-black text-lg uppercase text-slate-900 dark:text-white">NEXY</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Online Now</span>
                </div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-2xl leading-none">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-6 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-nexlyn text-white rounded-tr-none' : 'glass-panel text-slate-700 dark:text-slate-300 rounded-tl-none border border-black/5 dark:border-white/5'}`}>
                   {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-2 px-4">
                  {[0, 0.2, 0.4].map(d => <div key={d} className="w-1.5 h-1.5 bg-nexlyn rounded-full animate-bounce" style={{animationDelay: `${d}s`}} />)}
               </div>
            )}
          </div>
          <form onSubmit={handleChat} className="p-8 border-t border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/60">
            <div className="relative flex items-center gap-3">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isRecording ? "Listening..." : "Ask a technical question..."}
                className="flex-1 glass-panel py-4 px-6 rounded-xl border border-black/10 dark:border-white/10 focus:outline-none focus:border-nexlyn text-sm text-slate-900 dark:text-white"
                disabled={isRecording}
              />
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-4 rounded-xl transition-all ${
                  isRecording 
                    ? 'bg-nexlyn text-white animate-pulse' 
                    : 'glass-panel border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-nexlyn hover:text-nexlyn'
                }`}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isRecording ? (
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  ) : (
                    <>
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" x2="12" y1="19" y2="22"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="fixed bottom-6 md:bottom-10 right-6 md:right-10 z-[150] flex flex-col items-end gap-4 md:gap-6">
        <button onClick={() => setChatOpen(true)} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group relative overflow-hidden backdrop-blur-2xl border border-white/20 dark:border-white/10" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent" />
          <div className="absolute inset-0 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E60026]/5 via-[#FF0033]/5 to-[#FF1744]/5 group-hover:from-[#E60026]/10 group-hover:via-[#FF0033]/10 group-hover:to-[#FF1744]/10 transition-all" />
          <span className="relative z-10 font-black text-3xl md:text-4xl bg-gradient-to-br from-[#E60026] via-[#FF0033] to-[#FF1744] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(230,0,38,0.4)] transition-transform group-hover:scale-110 group-hover:drop-shadow-[0_3px_12px_rgba(230,0,38,0.6)]" style={{letterSpacing: '-0.02em'}}>X</span>
        </button>
        
        <div className="relative group">
          <div className="absolute inset-0 rounded-2xl animate-sonar pointer-events-none bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/20 dark:from-[#34E877]/20 dark:to-[#25D366]/20" />
          <button 
            onClick={() => openWhatsApp('general')} 
            className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-10 backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/30 dark:border-white/15 overflow-hidden group"
            title="Chat with Us on WhatsApp"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/30 via-[#128C7E]/20 to-[#075E54]/30 dark:from-[#34E877]/25 dark:via-[#25D366]/15 dark:to-[#1EBE5D]/25 group-hover:opacity-100 opacity-80 transition-opacity" />
            <svg className="w-8 h-8 md:w-9 md:h-9 relative z-10 text-[#25D366] dark:text-[#34E877]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </button>
        </div>
      </div>

      <footer className="py-24 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 relative">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-6">
               <Logo />
               <p className="text-slate-500 text-[9px] leading-relaxed font-bold uppercase tracking-wide">{aboutContent}</p>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Catalog</h4>
               <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span className="hover:text-nexlyn cursor-pointer transition-colors" onClick={() => { setSelectedCat('Routing'); setView('products'); }}>Routers</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-colors" onClick={() => { setSelectedCat('Switching'); setView('products'); }}>Switches</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-colors" onClick={() => { setSelectedCat('Wireless'); setView('products'); }}>Wireless</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-colors" onClick={() => { setSelectedCat('5G/LTE'); setView('products'); }}>5G/LTE</span>
               </div>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Quick Links</h4>
               <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span className="hover:text-nexlyn cursor-pointer transition-colors" onClick={() => openWhatsApp('reseller')}>Reseller Portal</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-colors" onClick={() => setView('about')}>Distribution Hub</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-colors" onClick={() => setView('admin')}>Authorized Access</span>
               </div>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Disclaimer</h4>
               <p className="text-[9px] text-slate-500 dark:text-slate-600 leading-relaxed font-bold uppercase tracking-tight">
                 MikroTik® and RouterOS® are registered trademarks of Mikrotīkls SIA. NEXLYN Distributions LLC is an independent authorized distributor. No retail sales.
               </p>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-black/5 dark:border-white/5 text-center space-y-2">
            <div className="text-[9px] font-black tracking-widest text-slate-500 dark:text-slate-600 uppercase">© 2026 NEXLYN LLC. Official Master Distributions Hub.</div>
            <div className="text-[8px] font-bold tracking-[0.2em] text-slate-600 dark:text-slate-700 uppercase">Design Concept by <span className="text-slate-400">IX Ruby Digitals</span> / <span className="text-slate-400">Vishnu Madhav</span></div>
         </div>
      </footer>
    </div>
  );
};

const WhyNexlyn = () => (
  <section className="py-32 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-20 space-y-4">
       <h2 className="text-4xl md:text-5xl font-black italic uppercase text-slate-900 dark:text-white leading-tight">WHY <span className="text-nexlyn">NEXLYN</span> DISTRIBUTIONS?</h2>
       <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">Your partner in engineering robust, carrier-grade network solutions across the GCC and beyond.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { title: 'Official Master Distributor', desc: 'Authorized MikroTik® Master Distributor with full territorial rights, regional stock holdings, and authorized training center status.' },
        { title: '100% Genuine Products', desc: 'All products sourced directly from MikroTik® with factory-sealed packaging, serial verification, and full warranty support.' },
        { title: 'Technical Expertise', desc: 'Pre-sales engineering and integration support from certified consultants (MTCNA/MTCRE) and professional trainers.' },
        { title: 'Global Export Capability', desc: 'Complete export documentation and logistics for international shipping to over 130+ countries worldwide.' }
      ].map((card, i) => (
        <div key={i} className="glass-panel p-8 rounded-2xl border border-black/5 dark:border-white/5 space-y-4 hover:border-nexlyn/40 transition-all duration-500 group">
          <div className="w-12 h-1 bg-nexlyn/50 group-hover:bg-nexlyn group-hover:w-full transition-all rounded-full" />
          <h3 className="text-xl font-black italic uppercase text-slate-900 dark:text-white leading-tight">{card.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{card.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const ResellerProgram = () => (
  <section className="py-32 bg-nexlyn/5 relative overflow-hidden border-y border-nexlyn/10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 glass-panel rounded-full border border-nexlyn/30 text-nexlyn text-[10px] font-black uppercase tracking-widest">
          <ICONS.Bolt className="w-4 h-4" />
          Join the Network
        </div>
        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-[0.9]">AUTHORIZED <br/> <span className="text-nexlyn">RESELLER</span> PROGRAM.</h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">Expand your business with the most flexible networking hardware on the market. Our partners enjoy tiered volume pricing, specialized technical training, and priority RMA support.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="flex items-center gap-4 p-5 glass-panel rounded-2xl border border-black/5 dark:border-white/5 hover:border-nexlyn/30 transition-all">
              <span className="text-3xl">💰</span>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Volume Pricing</div>
                <div className="text-[9px] text-slate-500">Tiered committed rates</div>
              </div>
           </div>
           <div className="flex items-center gap-4 p-5 glass-panel rounded-2xl border border-black/5 dark:border-white/5 hover:border-nexlyn/30 transition-all">
              <span className="text-3xl">🎓</span>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Technical Training</div>
                <div className="text-[9px] text-slate-500">MTCNA & MTCRE Access</div>
              </div>
           </div>
        </div>
      </div>
      <div className="relative aspect-video glass-panel rounded-[3rem] border border-nexlyn/10 overflow-hidden flex items-center justify-center p-12 group">
        <div className="absolute inset-0 bg-nexlyn/5 animate-pulse" />
        <div className="text-[10rem] opacity-10 select-none group-hover:scale-110 transition-transform duration-1000">🤝</div>
        <div className="relative text-center space-y-4">
          <div className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter">MASTER LEVEL</div>
          <div className="text-[11px] font-black text-nexlyn uppercase tracking-[0.6em]">Authorized Distributor</div>
        </div>
      </div>
    </div>
  </section>
);

export default App;