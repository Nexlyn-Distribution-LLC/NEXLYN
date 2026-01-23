import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ICONS, PRODUCTS as INITIAL_PRODUCTS, CATEGORIES, WHATSAPP_NUMBER as INITIAL_WA, ADMIN_PASSCODE, HERO_SLIDES } from './constants';
import { Product, Category } from './types';

type ViewType = 'home' | 'products' | 'detail' | 'admin' | 'about';
type ThemeType = 'light' | 'dark';

// --- SUB-COMPONENTS ---

const CategoryPill = React.memo(({ category, active, onClick }: { category: Category, active: boolean, onClick: () => void }) => {
  const Icon = category.icon ? (ICONS as any)[category.icon] : null;
  return (
    <button 
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-6 py-3.5 rounded-2xl border transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-nexlyn focus:ring-offset-2 dark:focus:ring-offset-black
        ${active 
          ? 'bg-nexlyn border-nexlyn text-white shadow-xl shadow-nexlyn/30 translate-y-[-2px]' 
          : 'glass-panel border-black/10 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-nexlyn/40 hover:text-nexlyn dark:hover:text-white hover:translate-y-[-1px]'
        }`}
    >
      {Icon && <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-500'}`} />}
      <span className="text-[11px] font-black uppercase tracking-widest">{category.name}</span>
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border transition-colors
        ${active 
          ? 'bg-white/20 border-white/10 text-white' 
          : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-slate-500 group-hover:text-slate-300'
        }`}>
        {category.count}
      </span>
    </button>
  );
});

const Logo = React.memo(({ onClick }: { onClick: () => void }) => (
  <div 
    className="flex items-center gap-4 cursor-pointer group shrink-0 select-none" 
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
  >
    <div className="relative">
        <div className="absolute inset-0 bg-nexlyn blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
        <svg width="48" height="32" viewBox="0 0 100 66" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative transition-transform group-hover:scale-110">
          <path d="M10 66L28 0H46L28 66H10Z" fill="#E60026" />
          <path d="M42 66L60 0H78L60 66H42Z" fill="currentColor" className="text-slate-900 dark:text-white" fillOpacity="0.9" />
          <path d="M30 33L85 0H95L40 33L30 33Z" fill="#E60026" />
          <path d="M5 33L60 66H70L15 33L5 33Z" fill="currentColor" className="text-slate-900 dark:text-white" fillOpacity="0.9" />
        </svg>
    </div>
    <div className="flex flex-col">
      <span className="font-extrabold text-2xl tracking-[0.15em] text-slate-900 dark:text-white leading-tight uppercase font-sans">NEXLYN</span>
      <span className="text-[8px] font-black tracking-[0.55em] uppercase opacity-60 text-nexlyn leading-none">MASTER DISTRIBUTOR</span>
    </div>
  </div>
));

const Header = React.memo(({ isScrolled, searchQuery, setSearchQuery, view, setView, theme, toggleTheme, openWhatsApp }: any) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when view changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [view]);

  return (
    <>
      <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-4 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-sm' : 'py-6 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-8">
          <Logo onClick={() => { setView('home'); setSearchQuery(''); }} />
          
          <div className="flex-1 max-w-md relative hidden md:block">
            <input 
              type="text"
              placeholder="Search core inventory..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'products' && e.target.value.length > 0) setView('products');
              }}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-11 pr-11 text-[11px] font-bold text-slate-900 dark:text-white outline-none focus:border-nexlyn focus:bg-white/10 transition-all placeholder:text-slate-500"
            />
            <ICONS.Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 shrink-0">
            {['Home', 'Products', 'About'].map((item) => (
              <button 
                key={item} 
                onClick={() => { setView(item.toLowerCase() as any); setSearchQuery(''); }} 
                className={`text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:text-nexlyn ${view === item.toLowerCase() ? 'text-nexlyn border-b-2 border-nexlyn pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-nexlyn'}`}
              >{item}</button>
            ))}
            <button onClick={() => openWhatsApp('general')} className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-nexlyn focus:outline-none focus:text-nexlyn">Contact</button>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle Theme"
              className="p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-nexlyn transition-all text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-nexlyn"
            >
              {theme === 'dark' ? <ICONS.Globe className="w-4 h-4" /> : <ICONS.Grid className="w-4 h-4" />}
            </button>
            <button onClick={() => setView('admin')} aria-label="Admin Access" className="p-2 opacity-20 hover:opacity-100 transition-opacity hidden sm:block text-slate-900 dark:text-white focus:opacity-100 focus:outline-none"><ICONS.Shield className="w-5 h-5" /></button>
            
            {/* Mobile Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="lg:hidden p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white hover:border-nexlyn transition-all"
            >
              {mobileMenuOpen ? <ICONS.X className="w-4 h-4" /> : <ICONS.Menu className="w-4 h-4" />}
            </button>

            <button onClick={() => openWhatsApp('general')} className="hidden sm:block px-6 py-3 bg-nexlyn text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-nexlyn/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexlyn dark:focus:ring-offset-black">Get Quote</button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-white/95 dark:bg-black/95 backdrop-blur-xl lg:hidden flex flex-col pt-32 px-6 animate-in slide-in-from-top-10 duration-300">
           <div className="space-y-6 flex flex-col items-start">
             {['Home', 'Products', 'About'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => { setView(item.toLowerCase() as any); setMobileMenuOpen(false); }} 
                  className={`text-3xl font-black uppercase tracking-tighter ${view === item.toLowerCase() ? 'text-nexlyn' : 'text-slate-900 dark:text-white'}`}
                >{item}</button>
              ))}
              <button onClick={() => { openWhatsApp('general'); setMobileMenuOpen(false); }} className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Contact Support</button>
              
              <div className="w-full h-px bg-black/5 dark:bg-white/10 my-6" />
              
              <button onClick={() => { setView('admin'); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest">
                <ICONS.Shield className="w-4 h-4" /> Admin Console
              </button>
           </div>
        </div>
      )}
    </>
  );
});

const WhyNexlyn = () => (
  <section className="py-40 px-6 max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-4 text-nexlyn">
              <div className="w-12 h-[2px] bg-nexlyn" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em]">The Distinction</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase text-slate-900 dark:text-white leading-[0.85] tracking-tighter">WHY <span className="text-nexlyn">NEXLYN.</span></h2>
        </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        { title: "Direct Master Status", desc: "No intermediaries. We are a Tier-1 authorized distribution point for genuine MikroTik® hardware in the MEA region.", icon: <ICONS.Shield className="w-8 h-8"/> },
        { title: "Zero Latency Logistics", desc: "Our Dubai hub ensures the fastest turnaround times for air and sea freight across 130+ countries.", icon: <ICONS.Bolt className="w-8 h-8"/> },
        { title: "Engineering Support", desc: "Access direct technical assistance for complex RouterOS v7 deployments, BGP peering, and data center switching.", icon: <ICONS.Router className="w-8 h-8"/> }
      ].map((item, i) => (
        <div key={i} className="glass-panel p-10 rounded-[3rem] border border-black/5 dark:border-white/5 space-y-6 hover:translate-y-[-10px] transition-all duration-500 group">
          <div className="w-16 h-16 bg-nexlyn/10 rounded-2xl flex items-center justify-center text-nexlyn group-hover:bg-nexlyn group-hover:text-white transition-colors">
            {item.icon}
          </div>
          <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter">{item.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const ResellerProgram = ({ openWhatsApp }: { openWhatsApp: (t: 'reseller') => void }) => (
  <section className="py-40 px-6 max-w-7xl mx-auto relative overflow-hidden rounded-[4rem] glass-panel border border-nexlyn/20">
    <div className="absolute inset-0 bg-grid opacity-5" />
    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="p-10 space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-4 text-nexlyn">
              <div className="w-12 h-[2px] bg-nexlyn" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em]">Growth Partnership</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black italic uppercase text-slate-900 dark:text-white leading-[0.85] tracking-tighter">B2B <span className="text-nexlyn">PORTAL.</span></h2>
          <p className="text-2xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-lg">Become an authorized regional partner. Access tiered pricing, priority stock allocation, and technical certification paths.</p>
        </div>
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-nexlyn/20 flex items-center justify-center"><ICONS.Bolt className="w-3 h-3 text-nexlyn" /></div>
              <span className="text-sm font-black uppercase text-slate-700 dark:text-slate-300">Volume-based Discretionary Discounts</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-nexlyn/20 flex items-center justify-center"><ICONS.Bolt className="w-3 h-3 text-nexlyn" /></div>
              <span className="text-sm font-black uppercase text-slate-700 dark:text-slate-300">Dedicated Regional Account Manager</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-nexlyn/20 flex items-center justify-center"><ICONS.Bolt className="w-3 h-3 text-nexlyn" /></div>
              <span className="text-sm font-black uppercase text-slate-700 dark:text-slate-300">Advanced RMA Replacement Protocol</span>
            </div>
        </div>
        <button onClick={() => openWhatsApp('reseller')} className="px-14 py-7 bg-nexlyn text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-nexlyn/40 hover:scale-[1.05] transition-all focus:outline-none focus:ring-2 focus:ring-nexlyn focus:ring-offset-2 dark:focus:ring-offset-black">Submit Partnership Request</button>
      </div>
      <div className="hidden lg:block relative p-20">
          <div className="absolute inset-0 bg-nexlyn/20 blur-[100px] rounded-full" />
          <div className="relative glass-panel rounded-[3rem] border border-white/10 p-10 rotate-3 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                <div className="px-4 py-1.5 bg-nexlyn/20 text-nexlyn rounded-full text-[10px] font-black uppercase tracking-widest">Master Tier Partner</div>
            </div>
            <div className="space-y-4">
                <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                <div className="h-32 w-full bg-white/5 rounded-2xl" />
            </div>
            <div className="mt-10 flex justify-end">
                <div className="w-24 h-10 bg-nexlyn rounded-lg" />
            </div>
          </div>
      </div>
    </div>
  </section>
);

const AdminView = ({ 
  isAdmin, setIsAdmin, 
  products, setProducts, 
  waNumber, setWaNumber, 
  address, setAddress, 
  aboutContent, setAboutContent 
}: any) => {
  const [passInput, setPassInput] = useState('');
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);

  const stats = useMemo(() => ({
    total: products.length,
    routing: products.filter((p: Product) => p.category === 'Routing').length,
    switching: products.filter((p: Product) => p.category === 'Switching').length,
    wireless: products.filter((p: Product) => p.category === 'Wireless').length,
  }), [products]);

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto space-y-12 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {!isAdmin ? (
        <div className="max-w-md mx-auto glass-panel p-12 rounded-[2.5rem] text-center space-y-8 border border-nexlyn/20">
          <div className="w-20 h-20 bg-nexlyn/10 rounded-full flex items-center justify-center mx-auto">
              <ICONS.Shield className="w-10 h-10 text-nexlyn" />
          </div>
          <h2 className="text-3xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter">Security Authorization</h2>
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Access Token" 
              className="w-full bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 p-5 rounded-2xl text-center outline-none focus:border-nexlyn transition-all font-bold tracking-[0.5em]"
              value={passInput}
              onChange={e => setPassInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (passInput === ADMIN_PASSCODE ? setIsAdmin(true) : alert('Access Denied'))}
            />
            <button 
              onClick={() => passInput === ADMIN_PASSCODE ? setIsAdmin(true) : alert('Access Denied')}
              className="w-full py-5 bg-nexlyn text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-nexlyn/20 focus:outline-none focus:ring-2 focus:ring-nexlyn focus:ring-offset-2 dark:focus:ring-offset-black"
            >Establish Connection</button>
          </div>
        </div>
      ) : (
        <div className="space-y-16 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
                <h2 className="text-5xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter">Inventory <span className="text-nexlyn">Management</span></h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Master Distribution Node: Active</p>
            </div>
            <button onClick={() => setIsAdmin(false)} className="px-6 py-3 border border-black/10 dark:border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-nexlyn transition-colors">Exit Session</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total SKUs', val: stats.total, color: 'text-nexlyn' },
                { label: 'Routing', val: stats.routing, valColor: 'text-nexlyn' },
                { label: 'Switching', val: stats.switching, valColor: 'text-blue-500' },
                { label: 'Wireless', val: stats.wireless, valColor: 'text-green-500' }
              ].map(s => (
                <div key={s.label} className="glass-panel p-8 rounded-3xl border border-black/5 dark:border-white/5">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{s.label}</div>
                  <div className={`text-4xl font-black ${s.valColor || 'text-slate-900 dark:text-white'}`}>{s.val}</div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass-panel p-10 rounded-[2.5rem] space-y-8">
              <h3 className="text-lg font-black text-nexlyn uppercase tracking-widest border-b border-nexlyn/20 pb-4">Global Constants</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Distribution WhatsApp</label>
                  <input type="text" value={waNumber} onChange={e => setWaNumber(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Distribution Hub Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-sm font-bold" />
                </div>
              </div>
            </div>
            <div className="glass-panel p-10 rounded-[2.5rem] space-y-8">
              <h3 className="text-lg font-black text-nexlyn uppercase tracking-widest border-b border-nexlyn/20 pb-4">Corporate Narrative</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500">Bio / About Mission</label>
                <textarea value={aboutContent} onChange={e => setAboutContent(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-sm h-48 resize-none font-medium leading-relaxed" />
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter">Product Database</h3>
              <button 
                onClick={() => setEditProduct({ id: Date.now().toString(), name: '', code: '', category: 'Routing', specs: [], status: 'In Stock', description: '', imageUrl: '' })}
                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-nexlyn hover:text-white transition-all shadow-xl"
              >Register New Hardware</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p: Product) => (
                <div key={p.id} className="glass-panel p-6 rounded-3xl flex justify-between items-center border border-black/5 dark:border-white/5 group hover:border-nexlyn/20 transition-all">
                  <div className="flex items-center gap-5 flex-1 truncate">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-nexlyn/20 to-black flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/5">
                      <img src={p.imageUrl} className="w-full h-full object-cover opacity-80 mix-blend-screen" />
                    </div>
                    <div className="truncate">
                      <div className="font-black text-slate-900 dark:text-white truncate uppercase italic">{p.name}</div>
                      <div className="text-[9px] font-black text-nexlyn uppercase tracking-widest">{p.category}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditProduct(p)} className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-black/5 dark:bg-white/5 rounded-xl">Edit</button>
                    <button onClick={() => { if(confirm('Delete SKU?')) setProducts(products.filter((item: Product) => item.id !== p.id)) }} className="p-3 text-red-500/30 hover:text-red-500 transition-colors bg-red-500/5 rounded-xl">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {editProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-3xl glass-panel p-12 rounded-[3rem] space-y-10 max-h-[90vh] overflow-y-auto no-scrollbar border border-nexlyn/20 shadow-2xl">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-6">
                <h3 className="text-3xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter">SKU <span className="text-nexlyn">Configuration</span></h3>
                <button onClick={() => setEditProduct(null)} className="text-4xl leading-none text-slate-500 hover:text-white">&times;</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Formal Name</label>
                <input value={editProduct.name} onChange={e => setEditProduct({...editProduct, name: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-sm font-bold focus:border-nexlyn focus:outline-none transition-colors" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Hardware ID / Model</label>
                <input value={editProduct.code} onChange={e => setEditProduct({...editProduct, code: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-sm font-bold focus:border-nexlyn focus:outline-none transition-colors" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Market Category</label>
                <select value={editProduct.category} onChange={e => setEditProduct({...editProduct, category: e.target.value as any})} className="w-full bg-slate-100 dark:bg-black border border-black/10 dark:border-white/10 p-5 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:border-nexlyn focus:outline-none transition-colors">
                  {['Routing', 'Switching', 'Wireless', '5G/LTE', 'IoT', 'Accessories'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Product Visual URL</label>
                
                {/* Image Preview */}
                {editProduct.imageUrl && (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                    <img 
                      src={editProduct.imageUrl} 
                      alt="Product preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEditProduct({...editProduct, imageUrl: ''})}
                      className="absolute top-2 right-2 w-8 h-8 bg-nexlyn text-white rounded-full flex items-center justify-center hover:bg-nexlyn/80 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* URL Input */}
                <div className="space-y-2">
                  <input 
                    type="url"
                    value={editProduct.imageUrl || ''} 
                    onChange={e => setEditProduct({...editProduct, imageUrl: e.target.value})} 
                    placeholder="https://example.com/product-image.jpg"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-sm font-bold focus:border-nexlyn focus:outline-none transition-colors" 
                  />
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Enter a direct URL to the product image</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Technical Overview</label>
              <textarea value={editProduct.description} onChange={e => setEditProduct({...editProduct, description: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl text-sm h-32 resize-none leading-relaxed focus:border-nexlyn focus:outline-none transition-colors" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Engineering Specs (Comma separated)</label>
              <input value={editProduct.specs?.join(', ')} onChange={e => setEditProduct({...editProduct, specs: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-sm font-bold focus:border-nexlyn focus:outline-none transition-colors" />
            </div>
            <div className="flex gap-6 pt-6">
              <button 
                onClick={() => {
                  if (products.find((p: Product) => p.id === editProduct.id)) {
                    setProducts(products.map((p: Product) => p.id === editProduct.id ? editProduct as Product : p));
                  } else {
                    setProducts([...products, editProduct as Product]);
                  }
                  setEditProduct(null);
                }}
                className="flex-1 py-5 bg-nexlyn text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-nexlyn/20 hover:scale-[1.02] transition-transform"
              >Commit SKU to Ledger</button>
              <button onClick={() => setEditProduct(null)} className="flex-1 py-5 bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black/20 dark:hover:bg-white/20 transition-all">Abort</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---

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
  
  // --- ADMIN STATE (Only auth needed here, rest is in AdminView) ---
  const [isAdmin, setIsAdmin] = useState(false);

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

  // Slide transition for Hero
  useEffect(() => {
    if (view === 'home') {
      const interval = setInterval(() => {
        setIsExiting(true);
        setTimeout(() => {
          setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
          setIsExiting(false);
        }, 800);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [view]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  // --- COMPUTED ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCat === 'All' || p.category === selectedCat;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCat, searchQuery, products]);

  // --- ACTIONS ---
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const openWhatsApp = (context?: 'product' | 'reseller' | 'general' | 'category', data?: any) => {
    let text = "";
    if (context === 'product' && data) {
      text = `Hello NEXLYN Distributions,\n\nI’m interested in the *${data.name}* (${data.code}) for business deployment.\n\n*Product Specs:*\n• ${data.specs.slice(0,3).join('\n• ')}\n\n*Request:*\n• Price Quote (Reseller/Volume)\n• Stock availability\n• Regional lead time\n\n*Company:* [Your company name]\n*Delivery Area:* [Country/Region]\n\nThank you!`;
    } else if (context === 'category' && data) {
      text = `Hello NEXLYN Distributions,\n\nI’m inquiring about your *${data}* portfolio for an upcoming project.\n\nPlease share the latest B2B price list and availability.\n\nThank you!`;
    } else if (context === 'reseller') {
      text = `Hello NEXLYN Distributions,\n\nWe would like to apply to become an *Authorized MikroTik® Reseller*.\n\n*Business Details:*\n• Company: [Your company]\n• Location: [Region]\n• Focus: [WISP/Enterprise/Integration]\n\nThank you!`;
    } else {
      text = `Hello NEXLYN Distributions,\n\nI’m looking for professional networking hardware from MikroTik®.\n\nPlease put me in touch with a distribution manager.\n\nThank you!`;
    }
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen transition-colors duration-500 flex flex-col">
      <Header 
        isScrolled={isScrolled} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        view={view} 
        setView={setView} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        openWhatsApp={openWhatsApp}
      />
      
      <main className="flex-1">
        {view === 'home' && (
          <div className="animate-in fade-in duration-1000">
            <section 
              className="relative h-[100vh] flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => {
                const slide = HERO_SLIDES[slideIndex];
                if (slide.categoryId) { setSelectedCat(slide.categoryId); setView('products'); window.scrollTo(0,0); }
              }}
            >
              {HERO_SLIDES.map((slide, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${idx === slideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                  <img 
                    src={slide.image} 
                    className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${idx === slideIndex ? 'scale-110' : 'scale-100'}`} 
                    alt={slide.categoryId}
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-black/70 via-black/30 to-black/90' : 'bg-gradient-to-b from-white/70 via-white/30 to-white/90'}`} />
                  <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]'}`} />
                </div>
              ))}

              <div 
                key={`content-${slideIndex}`} 
                className={`relative z-10 max-w-7xl mx-auto px-6 w-full text-center space-y-12 ${isExiting ? 'hero-animate-out' : 'hero-animate-in'}`}
              >
                <div className="inline-flex items-center gap-4 px-8 py-3 glass-panel rounded-full border border-nexlyn/40 stagger-1 shadow-2xl shadow-nexlyn/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-nexlyn animate-pulse shadow-[0_0_15px_rgba(230,0,38,0.8)]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white">
                    {HERO_SLIDES[slideIndex].categoryId} <span className="text-nexlyn opacity-50">/</span> <span className="opacity-70 font-bold">Solutions</span>
                  </span>
                </div>
                
                <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.8] uppercase italic text-slate-900 dark:text-white stagger-2 drop-shadow-2xl">
                  {HERO_SLIDES[slideIndex].title.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? 'text-nexlyn' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                
                <p className="max-w-3xl mx-auto text-slate-700 dark:text-slate-200 text-lg md:text-2xl font-bold leading-relaxed drop-shadow-lg stagger-3 px-4">
                  {HERO_SLIDES[slideIndex].subtitle}
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 pt-10 stagger-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setView('products'); window.scrollTo(0,0); }} 
                    className="px-14 py-6 bg-nexlyn text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-nexlyn/40 hover:scale-[1.05] hover:shadow-nexlyn/60 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-nexlyn focus:ring-offset-2 dark:focus:ring-offset-black"
                  >
                    Browse Portfolio
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openWhatsApp('reseller'); }} 
                    className="px-14 py-6 glass-panel border border-black/10 dark:border-white/20 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-black/5 dark:hover:bg-white/10 transition-all backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    B2B Application
                  </button>
                </div>
              </div>

              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  key={`bar-${slideIndex}`}
                  className="h-full bg-nexlyn animate-[data-flow_8s_linear_infinite]"
                  style={{ width: '100%' }}
                />
              </div>
            </section>

            <div className="bg-black/[0.03] dark:bg-white/[0.03] border-y border-black/5 dark:border-white/5 py-10 overflow-hidden relative">
               <div className="absolute inset-0 bg-grid opacity-10" />
               <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-12 relative z-10">
                {[
                  { label: 'Carrier Grade', icon: '📡' },
                  { label: 'Authorized Hub', icon: '✅' },
                  { label: 'Dubai Logistics', icon: '✈️' },
                  { label: 'Expert Training', icon: '🎓' },
                  { label: 'Tier 1 Pricing', icon: '💵' },
                  { label: 'RMA Priority', icon: '🛠️' }
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <WhyNexlyn />
            <ResellerProgram openWhatsApp={openWhatsApp} />

            <section className="py-40 px-6 max-w-7xl mx-auto">
               <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 text-nexlyn">
                       <div className="w-12 h-[2px] bg-nexlyn" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em]">Real-time Inventory</span>
                    </div>
                    <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">CORE <span className="text-nexlyn">STOCK.</span></h2>
                  </div>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 max-w-full">
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
                    <div 
                      key={p.id} 
                      onClick={() => { setActiveProduct(p); setView('detail'); window.scrollTo(0,0); }} 
                      className="group glass-panel p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 hover:border-nexlyn/40 transition-all cursor-pointer overflow-hidden flex flex-col h-full hover:translate-y-[-10px] duration-500 focus:outline-none focus:ring-2 focus:ring-nexlyn focus:ring-offset-2 dark:focus:ring-offset-black"
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => e.key === 'Enter' && setActiveProduct(p)}
                    >
                      <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-nexlyn/20 via-black to-black overflow-hidden mb-10 border border-black/5 dark:border-white/5 relative">
                        <img src={p.imageUrl} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 mix-blend-screen opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                           <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest">{p.code}</span>
                           <div className="w-8 h-8 rounded-full bg-nexlyn/20 backdrop-blur-md flex items-center justify-center border border-nexlyn/30">
                              <ICONS.Bolt className="w-3.5 h-3.5 text-white" />
                           </div>
                        </div>
                      </div>
                      <div className="space-y-4 mt-auto">
                        <div className="flex justify-between items-center">
                           <span className="text-[9px] font-black uppercase tracking-widest text-nexlyn">{p.category}</span>
                           <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">In Stock</span>
                           </div>
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white leading-tight truncate group-hover:text-nexlyn transition-colors">{p.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 font-medium leading-relaxed">{p.description}</p>
                      </div>
                    </div>
                  ))}
               </div>
               <div className="mt-24 text-center">
                  <button onClick={() => { setView('products'); window.scrollTo(0,0); }} className="group inline-flex items-center gap-6 px-12 py-6 glass-panel border border-nexlyn/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white hover:bg-nexlyn hover:text-white hover:border-nexlyn transition-all shadow-2xl focus:outline-none focus:ring-2 focus:ring-nexlyn">
                    Expand Complete Registry
                    <ICONS.ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
               </div>
            </section>
          </div>
        )}

        {view === 'products' && (
          <div className="pt-48 px-6 max-w-7xl mx-auto pb-48 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
                <div className="space-y-4 shrink-0">
                  <div className="text-nexlyn text-[10px] font-black uppercase tracking-[0.6em]">Hardware Ecosystem</div>
                  <h2 className="text-7xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">The <span className="text-nexlyn">Matrix.</span></h2>
                  {searchQuery && <div className="inline-block px-4 py-1.5 bg-nexlyn/10 rounded-full text-[10px] font-black text-nexlyn uppercase tracking-widest">Searching: {searchQuery}</div>}
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
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
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  {filteredProducts.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => { setActiveProduct(p); setView('detail'); window.scrollTo(0,0); }} 
                      className="group glass-panel p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 hover:border-nexlyn/40 transition-all cursor-pointer hover:translate-y-[-5px] duration-500 focus:outline-none focus:ring-2 focus:ring-nexlyn"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="aspect-square bg-gradient-to-br from-nexlyn/10 to-transparent rounded-3xl overflow-hidden mb-8 relative border border-black/5 dark:border-white/5">
                        <img src={p.imageUrl} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 mix-blend-screen" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                        <div className="absolute top-4 left-4">
                           <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[8px] font-black text-white/70 tracking-widest uppercase">{p.code}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="text-[9px] font-black uppercase text-nexlyn tracking-widest">{p.category}</span>
                        <h3 className="text-xl font-black uppercase italic text-slate-900 dark:text-white truncate group-hover:text-nexlyn transition-colors">{p.name}</h3>
                        <div className="h-0.5 w-0 group-hover:w-16 bg-nexlyn transition-all duration-500" />
                      </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-40 text-center glass-panel rounded-[3rem] border border-black/5 dark:border-white/10 animate-pulse">
                 <div className="text-7xl mb-10 opacity-40">📡</div>
                 <h3 className="text-3xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter mb-4">No Hardware Detected</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto font-medium">We could not locate any SKUs matching your query parameters in the central ledger.</p>
                 <button onClick={() => { setSearchQuery(''); setSelectedCat('All'); }} className="mt-12 px-10 py-4 border border-nexlyn/30 text-nexlyn font-black uppercase text-[11px] tracking-widest hover:bg-nexlyn hover:text-white transition-all rounded-xl shadow-2xl">Reset Scanning Filters</button>
               </div>
             )}
          </div>
        )}

        {view === 'about' && (
          <div className="pt-48 px-6 max-w-5xl mx-auto space-y-32 pb-48 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="space-y-12">
                <div className="inline-flex items-center gap-4 text-nexlyn">
                   <div className="w-16 h-1 bg-nexlyn" />
                   <span className="text-[11px] font-black uppercase tracking-[0.7em]">The Core Mission</span>
                </div>
                <h2 className="text-8xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-[0.85]">Engineering <br/><span className="text-nexlyn">Distinction.</span></h2>
                <p className="text-3xl text-slate-700 dark:text-slate-300 font-bold leading-tight tracking-tight max-w-4xl">{aboutContent}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-black/5 dark:border-white/10">
                   <div className="space-y-3">
                      <div className="text-6xl font-black italic text-nexlyn tracking-tighter">130+</div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">Countries Reach</div>
                   </div>
                   <div className="space-y-3">
                      <div className="text-6xl font-black italic text-nexlyn tracking-tighter">24/7</div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">Regional Support</div>
                   </div>
                   <div className="space-y-3">
                      <div className="text-6xl font-black italic text-nexlyn tracking-tighter">GCC-1</div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">Master Hub Status</div>
                   </div>
                </div>
             </div>
             
             <div className="relative glass-panel p-16 rounded-[4rem] border border-nexlyn/10 group overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-nexlyn/5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-nexlyn/10 transition-colors" />
                <div className="relative z-10 space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-4xl font-black uppercase italic text-slate-900 dark:text-white tracking-tighter">Strategic Command Center</h3>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">Operating out of Dubai's Digital Hub, we leverage world-class logistics infrastructure to maintain the fastest hardware turnaround in the region.</p>
                    <div className="text-2xl text-slate-900 dark:text-white font-black italic uppercase tracking-tighter border-l-4 border-nexlyn pl-8 py-4 bg-nexlyn/5 rounded-r-2xl">{address}</div>
                  </div>
                  <a href={mapUrl} target="_blank" className="inline-flex items-center gap-6 px-14 py-7 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-nexlyn hover:text-white transition-all shadow-2xl focus:outline-none focus:ring-2 focus:ring-nexlyn">
                    <ICONS.Globe className="w-6 h-6" />
                    Coordinate Logistics Hub
                  </a>
                </div>
             </div>
          </div>
        )}

        {view === 'detail' && activeProduct && (
           <div className="pt-48 px-6 max-w-7xl mx-auto pb-48 animate-in zoom-in-95 duration-1000">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-nexlyn blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="aspect-square glass-panel rounded-[4rem] overflow-hidden border border-black/10 dark:border-white/10 relative z-10 bg-gradient-to-br from-nexlyn/30 via-black to-black shadow-2xl">
                       <img src={activeProduct.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] mix-blend-screen opacity-90" alt={activeProduct.name} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                       <div className="absolute top-10 right-10">
                          <div className="w-20 h-20 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center animate-spin-slow">
                             <div className="text-[10px] font-black text-white uppercase tracking-tighter">Genuine Hardware</div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col justify-center space-y-14 relative z-10">
                    <div className="space-y-8">
                       <div className="flex items-center gap-4">
                          <span className="px-6 py-2 bg-nexlyn/10 text-nexlyn border border-nexlyn/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">{activeProduct.category}</span>
                          <span className="px-6 py-2 glass-panel border border-white/10 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Verified Master Stock</span>
                       </div>
                       <h1 className="text-7xl md:text-8xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white leading-[0.85]">{activeProduct.name}</h1>
                       <div className="text-sm font-black text-slate-500 uppercase tracking-[0.4em]">Node Registry: <span className="text-nexlyn">{activeProduct.code}</span></div>
                       <p className="text-2xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed tracking-tight">{activeProduct.description}</p>
                    </div>
                    
                    <div className="glass-panel p-10 rounded-[2.5rem] border border-black/10 dark:border-white/10 space-y-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-1/2 h-full bg-grid opacity-5 pointer-events-none" />
                       <div className="text-[11px] font-black uppercase text-nexlyn tracking-[0.6em] flex items-center gap-4">
                          <ICONS.Bolt className="w-4 h-4" />
                          Technical Blueprint
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {activeProduct.specs && activeProduct.specs.map(s => (
                            <div key={s} className="flex items-start gap-4 text-sm font-black text-slate-700 dark:text-slate-300 uppercase italic tracking-tight group">
                               <div className="w-2 h-2 mt-1.5 bg-nexlyn rounded-full shadow-[0_0_10px_rgba(230,0,38,0.8)] transition-transform group-hover:scale-150" />
                               {s}
                            </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6 pt-10">
                       <button onClick={() => openWhatsApp('product', activeProduct)} className="flex-1 py-7 bg-nexlyn text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-nexlyn/40 hover:scale-[1.03] transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-nexlyn focus:ring-offset-2 dark:focus:ring-offset-black">Request Distribution Quote</button>
                       <button onClick={() => { setView('products'); window.scrollTo(0,0); }} className="px-14 py-7 glass-panel border border-black/10 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-black/5 dark:hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white">Back to Grid</button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <p className="text-[10px] text-slate-500 font-bold uppercase italic tracking-[0.2em]">Authorized Master Stock. Immediate Dispatch Available.</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {view === 'admin' && (
          <AdminView 
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            products={products}
            setProducts={setProducts}
            waNumber={waNumber}
            setWaNumber={setWaNumber}
            address={address}
            setAddress={setAddress}
            aboutContent={aboutContent}
            setAboutContent={setAboutContent}
          />
        )}
      </main>

      {/* WhatsApp Contact Button */}
      <div className="fixed bottom-12 right-12 z-[150] flex flex-col items-end gap-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-[#25D366] rounded-[2rem] animate-sonar pointer-events-none" />
          <button 
            onClick={() => openWhatsApp('general')} 
            className="relative w-20 h-20 bg-[#25D366] text-white rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-10 focus:outline-none focus:ring-2 focus:ring-green-400"
            title="Chat with Us on WhatsApp"
            aria-label="Contact via WhatsApp"
          >
            <ICONS.WhatsApp className="w-12 h-12 fill-white stroke-none" />
          </button>
        </div>
      </div>

      <footer className="py-32 border-t border-black/5 dark:border-white/10 bg-white/90 dark:bg-black/90 relative mt-20">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="space-y-8">
               <Logo onClick={() => { setView('home'); setSearchQuery(''); }} />
               <p className="text-slate-500 text-[11px] leading-relaxed font-bold uppercase tracking-widest opacity-80">{aboutContent.substring(0, 150)}...</p>
               <div className="flex gap-6">
                  {[ICONS.Globe, ICONS.Shield, ICONS.Grid].map((Icon, i) => <Icon key={i} className="w-5 h-5 text-slate-400 hover:text-nexlyn cursor-pointer transition-colors" />)}
               </div>
            </div>
            <div className="space-y-8">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Distribution Nodes</h4>
               <div className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <span className="hover:text-nexlyn cursor-pointer transition-all" onClick={() => { setSelectedCat('Routing'); setView('products'); window.scrollTo(0,0); }}>Core Routing</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-all" onClick={() => { setSelectedCat('Switching'); setView('products'); window.scrollTo(0,0); }}>Cloud Switching</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-all" onClick={() => { setSelectedCat('Wireless'); setView('products'); window.scrollTo(0,0); }}>60GHz Wireless</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-all" onClick={() => { setSelectedCat('5G/LTE'); setView('products'); window.scrollTo(0,0); }}>5G Mobile Hubs</span>
               </div>
            </div>
            <div className="space-y-8">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Partner Portal</h4>
               <div className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <span className="hover:text-nexlyn cursor-pointer transition-all" onClick={() => openWhatsApp('reseller')}>Reseller Verification</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-all" onClick={() => setView('about')}>Logistics Dashboard</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-all" onClick={() => setView('admin')}>Admin Console</span>
                  <span className="hover:text-nexlyn cursor-pointer transition-all" onClick={() => openWhatsApp('general')}>Export Inquiries</span>
               </div>
            </div>
            <div className="space-y-8">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Notice</h4>
               <p className="text-[10px] text-slate-500 dark:text-slate-600 leading-relaxed font-bold uppercase italic tracking-tight opacity-70">
                 NEXLYN Distributions LLC is an independent authorized MikroTik® Master Distributor. All hardware systems are genuine and factory-sealed. Trading governed by DIFC and international export law.
               </p>
               <div className="pt-4">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Authorized Status:</div>
                  <div className="text-nexlyn font-black text-sm italic uppercase tracking-tighter">MASTER TIER - GCC</div>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-24 pt-10 border-t border-black/5 dark:border-white/10 text-center space-y-4">
            <div className="text-[10px] font-black tracking-[0.4em] text-slate-500 dark:text-slate-600 uppercase">© 2025 NEXLYN LLC. CENTRAL DISTRIBUTION REGISTRY.</div>
            <div className="text-[9px] font-black tracking-[0.3em] text-slate-600 dark:text-slate-700 uppercase">Architecture by <span className="text-slate-400">IX Ruby Digitals</span> <span className="text-nexlyn">/</span> <span className="text-slate-400">Dubai, UAE</span></div>
         </div>
      </footer>
    </div>
  );
};

export default App;