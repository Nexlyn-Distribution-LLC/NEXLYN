import React, { useState, useEffect, useMemo } from 'react';
import { ICONS, PRODUCTS as INITIAL_PRODUCTS, CATEGORIES, WHATSAPP_NUMBER as INITIAL_WA, ADMIN_PASSCODE, HERO_SLIDES } from './constants';
import { Product, Message, GroundingSource, Category } from './types';
import { gemini } from './services/geminiService';

type ViewType = 'home' | 'products' | 'detail' | 'admin' | 'about';
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
  const [waNumber, setWaNumber] = useState(() => localStorage.getItem('nexlyn_wa') || INITIAL_WA);
  const [aboutContent, setAboutContent] = useState(() => localStorage.getItem('nexlyn_about') || "Nexlyn is a premier MikroTik® Master Distributor based in Dubai, serving the Middle East and Africa. We specialize in providing carrier-grade routing, high-density switching, and professional wireless deployments for internet service providers and large-scale enterprises.");
  const [address, setAddress] = useState(() => localStorage.getItem('nexlyn_address') || "Silicon Oasis, Dubai Digital Park, UAE");
  const [mapUrl, setMapUrl] = useState(() => localStorage.getItem('nexlyn_map_url') || "https://maps.app.goo.gl/971502474482");

  // --- UI STATE ---
  const [view, setView] = useState<ViewType>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  
  // --- ADMIN STATE ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);

  // --- AI CHAT STATE ---
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am the Nexlyn Assistant. I can help you with MikroTik® hardware specifications and network planning. What are you looking for today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    localStorage.setItem('nexlyn_wa', waNumber);
    localStorage.setItem('nexlyn_about', aboutContent);
    localStorage.setItem('nexlyn_address', address);
    localStorage.setItem('nexlyn_map_url', mapUrl);
  }, [products, waNumber, aboutContent, address, mapUrl]);

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

  const handleBannerClick = (slide: typeof HERO_SLIDES[0]) => {
    if (slide.categoryId) {
      setSelectedCat(slide.categoryId);
      setView('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- REFINED UI COMPONENTS ---
  const CategoryPill = ({ category, active, onClick }: { category: Category, active: boolean, onClick: () => void }) => {
    const Icon = category.icon ? (ICONS as any)[category.icon] : null;
    
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
          {category.count}
        </span>
      </button>
    );
  };

  const Logo = () => (
    <div 
      className="flex items-center gap-4 cursor-pointer group shrink-0" 
      onClick={() => { setView('home'); setSearchQuery(''); }}
    >
      <svg width="48" height="32" viewBox="0 0 100 66" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
        <path d="M10 66L28 0H46L28 66H10Z" fill="#E60026" />
        <path d="M42 66L60 0H78L60 66H42Z" fill="currentColor" className="text-slate-900 dark:text-white" fillOpacity="0.9" />
        <path d="M30 33L85 0H95L40 33L30 33Z" fill="#E60026" />
        <path d="M5 33L60 66H70L15 33L5 33Z" fill="currentColor" className="text-slate-900 dark:text-white" fillOpacity="0.9" />
      </svg>
      <div className="flex flex-col">
        <span className="font-extrabold text-2xl tracking-[0.15em] text-slate-900 dark:text-white leading-tight uppercase font-sans">NEXLYN</span>
        <span className="text-[8px] font-black tracking-[0.55em] uppercase opacity-60 text-nexlyn leading-none">DISTRIBUTIONS</span>
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
            className="p-2.5 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-nexlyn/50 transition-all text-slate-600 dark:text-slate-400"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <ICONS.Globe className="w-4 h-4" /> : <ICONS.Grid className="w-4 h-4" />}
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

  const AdminView = () => (
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
          />
          <button 
            onClick={() => passInput === ADMIN_PASSCODE ? setIsAdmin(true) : alert('Invalid Passcode')}
            className="w-full py-4 bg-nexlyn text-white rounded-xl font-bold uppercase text-xs"
          >Authorize</button>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-black italic uppercase text-slate-900 dark:text-white">Management <span className="text-nexlyn">Panel</span></h2>
            <button onClick={() => setIsAdmin(false)} className="text-xs font-bold uppercase text-slate-500 hover:text-white">Exit Dashboard</button>
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

          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white">Product Catalog</h3>
              <button 
                onClick={() => setEditProduct({ id: Date.now().toString(), name: '', code: '', category: 'Routing', specs: [], status: 'In Stock', description: '', imageUrl: '' })}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase hover:bg-nexlyn hover:text-white transition-all"
              >Add Product</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="glass-panel p-5 rounded-2xl flex justify-between items-center border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-4 flex-1 truncate">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-nexlyn to-black flex items-center justify-center overflow-hidden">
                      <img src={p.imageUrl} className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{p.name}</div>
                      <div className="text-[9px] text-slate-500 uppercase">{p.category}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditProduct(p)} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Edit</button>
                    <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="p-2 text-red-500/50 hover:text-red-500 transition-colors">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-panel p-10 rounded-[2.5rem] space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white">Hardware Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500">Name</label>
                <input value={editProduct.name} onChange={e => setEditProduct({...editProduct, name: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500">Model Code</label>
                <input value={editProduct.code} onChange={e => setEditProduct({...editProduct, code: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500">Category</label>
                <select value={editProduct.category} onChange={e => setEditProduct({...editProduct, category: e.target.value as any})} className="w-full bg-slate-100 dark:bg-black border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm text-slate-900 dark:text-white">
                  {['Routing', 'Switching', 'Wireless', '5G/LTE', 'IoT', 'Accessories'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500">Image URL</label>
                <input value={editProduct.imageUrl} onChange={e => setEditProduct({...editProduct, imageUrl: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500">Description</label>
              <textarea value={editProduct.description} onChange={e => setEditProduct({...editProduct, description: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm h-32 resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500">Specifications (Comma separated)</label>
              <input value={editProduct.specs?.join(', ')} onChange={e => setEditProduct({...editProduct, specs: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm" />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  if (products.find(p => p.id === editProduct.id)) {
                    setProducts(products.map(p => p.id === editProduct.id ? editProduct as Product : p));
                  } else {
                    setProducts([...products, editProduct as Product]);
                  }
                  setEditProduct(null);
                }}
                className="flex-1 py-4 bg-nexlyn text-white rounded-xl font-bold uppercase text-xs"
              >Save Hardware</button>
              <button onClick={() => setEditProduct(null)} className="flex-1 py-4 bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white rounded-xl font-bold uppercase text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-500">
      <Header />
      
      <main>
        {view === 'home' && (
          <>
            <section 
              className="relative h-[100vh] flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => handleBannerClick(HERO_SLIDES[slideIndex])}
            >
              {HERO_SLIDES.map((slide, idx) => (
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
                <div className="inline-flex items-center gap-4 px-6 py-2 glass-panel rounded-full border border-nexlyn/40 stagger-1 shadow-2xl shadow-nexlyn/20">
                  <div className="w-2 h-2 rounded-full bg-nexlyn animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">
                    Category Focus: <span className="text-nexlyn">{HERO_SLIDES[slideIndex].categoryId}</span>
                  </span>
                </div>
                
                <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.85] uppercase italic text-slate-900 dark:text-white stagger-2 drop-shadow-2xl">
                  {HERO_SLIDES[slideIndex].title.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? 'text-nexlyn' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                
                <p className="max-w-2xl mx-auto text-slate-700 dark:text-slate-200 text-lg md:text-xl font-bold leading-relaxed drop-shadow stagger-3">
                  {HERO_SLIDES[slideIndex].subtitle}
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
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map(p => (
                    <div key={p.id} onClick={() => { setActiveProduct(p); setView('detail'); }} className="group glass-panel p-6 rounded-[2rem] border border-black/5 dark:border-white/5 hover:border-nexlyn/40 transition-all cursor-pointer overflow-hidden flex flex-col h-full">
                      <div className="aspect-square rounded-2xl bg-gradient-to-br from-nexlyn/20 via-black to-black overflow-hidden mb-8 border border-black/5 dark:border-white/5 relative">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-screen opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      </div>
                      <div className="space-y-3 mt-auto">
                        <span className="text-[8px] font-black uppercase tracking-widest text-nexlyn px-3 py-1 bg-nexlyn/10 rounded-full">{p.category}</span>
                        <h3 className="text-xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white leading-tight truncate">{p.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">{p.description}</p>
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
             <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-20">
                <div className="space-y-2 shrink-0">
                  <h2 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">The <span className="text-nexlyn">Catalog.</span></h2>
                  {searchQuery && <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Search results for: "{searchQuery}"</p>}
                </div>
                
                <div className="flex flex-wrap gap-3 items-center">
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
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map(p => (
                    <div key={p.id} onClick={() => { setActiveProduct(p); setView('detail'); }} className="group glass-panel p-6 rounded-2xl border border-black/5 dark:border-white/5 hover:border-nexlyn/30 transition-all cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent rounded-xl overflow-hidden mb-6 relative">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 mix-blend-screen" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[7px] font-black uppercase text-nexlyn">{p.category}</span>
                        <h3 className="text-lg font-black uppercase italic text-slate-900 dark:text-white truncate">{p.name}</h3>
                        <div className="text-[9px] text-slate-500 font-bold">{p.code}</div>
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
                      <div className="text-5xl font-black italic text-nexlyn">Since 2020</div>
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

        {view === 'detail' && activeProduct && (
           <div className="pt-40 px-6 max-w-7xl mx-auto pb-40 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                 <div className="aspect-square glass-panel rounded-[3rem] overflow-hidden border border-black/10 dark:border-white/10 group bg-gradient-to-br from-nexlyn/20 to-black relative">
                    <img src={activeProduct.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 mix-blend-screen opacity-90" alt={activeProduct.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 </div>
                 <div className="flex flex-col justify-center space-y-12">
                    <div className="space-y-6">
                       <span className="px-5 py-1.5 bg-nexlyn/10 text-nexlyn border border-nexlyn/30 rounded-full text-[9px] font-black uppercase tracking-widest">{activeProduct.category}</span>
                       <h1 className="text-7xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white leading-none">{activeProduct.name}</h1>
                       <div className="text-xs font-bold text-slate-500 uppercase">Model Series: {activeProduct.code}</div>
                       <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{activeProduct.description}</p>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
                       <div className="text-[10px] font-black uppercase text-nexlyn tracking-widest">Technical Specifications</div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeProduct.specs && activeProduct.specs.map(s => (
                            <div key={s} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                               <div className="w-1.5 h-1.5 bg-nexlyn rounded-full shadow-lg shadow-nexlyn/50" />
                               {s}
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="flex gap-4 pt-10">
                       <button onClick={() => openWhatsApp('product', activeProduct)} className="flex-1 py-6 bg-nexlyn text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-nexlyn/20">Request Pricing & Availability</button>
                       <button onClick={() => setView('products')} className="px-12 py-6 glass-panel border border-black/10 dark:border-white/10 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-widest text-xs">Return to Catalog</button>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase italic tracking-widest">* All sales are final and governed by MikroTik® global distribution warranty policy.</p>
                 </div>
              </div>
           </div>
        )}

        {view === 'admin' && <AdminView />}
      </main>

      <div className={`fixed inset-y-0 right-0 w-full md:w-[420px] z-[200] transition-transform duration-700 ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full glass-panel border-l border-black/10 dark:border-white/10 flex flex-col shadow-2xl">
          <div className="p-8 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-nexlyn rounded-lg flex items-center justify-center text-white shadow-lg">
                <ICONS.Bolt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg italic uppercase text-slate-900 dark:text-white">Grid Expert</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-nexlyn">AI Live Support</span>
                </div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">×</button>
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
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a technical question..."
              className="w-full glass-panel py-4 px-6 rounded-xl border border-black/10 dark:border-white/10 focus:outline-none focus:border-nexlyn text-sm text-slate-900 dark:text-white"
            />
          </form>
        </div>
      </div>

      <div className="fixed bottom-10 right-10 z-[150] flex flex-col items-end gap-6">
        <button onClick={() => setChatOpen(true)} className="w-16 h-16 glass-panel border border-black/10 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
          <ICONS.Bolt className="w-8 h-8" />
        </button>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-[#25D366] rounded-2xl animate-sonar pointer-events-none" />
          <button 
            onClick={() => openWhatsApp('general')} 
            className="relative w-16 h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-10"
            title="Chat with Us on WhatsApp"
          >
            <ICONS.WhatsApp className="w-9 h-9 fill-white stroke-none" />
          </button>
        </div>
      </div>

      <footer className="py-24 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 relative">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-6">
               <Logo />
               <p className="text-slate-500 text-[10px] leading-relaxed font-bold uppercase tracking-widest">{aboutContent.substring(0, 100)}...</p>
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
            <div className="text-[9px] font-black tracking-widest text-slate-500 dark:text-slate-600 uppercase">© 2025 NEXLYN LLC. Official Master Distributions Hub.</div>
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