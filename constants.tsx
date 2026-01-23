
import React from 'react';
import { Product, Category, HeroSlide } from './types';

export const COLORS = {
  primary: '#E60026',
  accent: '#FFD700',
  dark: '#0A0A0A',
};

// Abstract Hardware Visuals (SVG Data URLs)
const VISUALS = {
  ROUTING: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9InVybCgjZ3JhZDEpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjAiIHkxPSIwIiB4Mj0iODAwIiB5Mj0iODAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzE0MDAwNSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAzMDMwMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0xMDAgMzAwSDcwME0xMDAgNTAwSDcwME0zMDAgMTAwVjcwME01MDAgMTAwVjcwMCIgc3Ryb2tlPSIjRTYwMDI2IiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIvPjxyZWN0IHg9IjIwMCIgeT0iMzUwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEwMCIgcng9IjQiIGZpbGw9IiNFMzAwMjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIgc3Ryb2tlPSIjRTYwMDI2IiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIyNDAiIGN5PSI0MDAiIHI9IjUiIGZpbGw9IiNFMzAwMjYiLz48Y2lyY2xlIGN4PSIyNzAiIGN5PSI0MDAiIHI9IjUiIGZpbGw9IiNFMzAwMjYiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI0MDAiIHI9IjUiIGZpbGw9IiNFMzAwMjYiLz48L3N2Zz4=',
  SWITCHING: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9InVybCgjZ3JhZDIpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMiIgeDE9IjgwMCIgeTE9IjgwMCIgeDI9IjAiIHkyPSIwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0U2MDAyNiIgc3RvcC1vcGFjaXR5PSIwLjE1Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDMwMzAzIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMTUwIiB5PSIyMDAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNDAwIiByeD0iOCIgc3Ryb2tlPSIjRTYwMDI2IiBzdHJva2Utd2lkdGg9IjAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48cGF0aCBkPSJNMTgwIDI0MEg2MjBNMTgwIDI4MEg2MjBNMTgwIDMyMEg2MjBNMTgwIDM2MEg2MjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9zdmc+',
  WIRELESS: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9IiMwMzAzMDMiLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSI0MDAiIHI9IjMwMCIgc3Ryb2tlPSIjRTYwMDI2IiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSI0MDAiIHI9IjIwMCIgc3Ryb2tlPSIjRTYwMDI2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1vcGFjaXR5PSIwLjIiLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSI0MDAiIHI9IjEwMCIgc3Ryb2tlPSIjRTYwMDI2IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSI0MDAiIHI9IjEwIiBmaWxsPSIjRTYwMDI2Ii8+PC9zdmc+',
  LTE: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9InVybCgjZ3JhZDMpIi8+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJncmFkMyIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIj48c3RvcCBzdG9wLWNvbG9yPSIjRTYwMDI2IiBzdHJva2Utd2lkdGg9IjAuMiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAzMDMwMyIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik00MDAgMTAwTDQwMCA3MDBNNDAwIDEwMEwzNTAgMTUwTTQwMCAxMDBMNDUwIDE1MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2Utb3BhY2l0eT0iMC44Ii8+PC9zdmc+',
  ACCESSORIES: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9IiMwYjBiMGIiLz48cmVjdCB4PSIzMDAiIHk9IjMwMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMDUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjIiLz48L3N2Zz4='
};

export const ICONS = {
  Globe: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>,
  Search: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Grid: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>,
  WhatsApp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26.1.41 1.53.34.49-.08 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z"/>
    </svg>
  ),
  Bolt: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Shield: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Router: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 18h.01"/><path d="M10 18h.01"/><path d="M14 18h.01"/><path d="M18 18h.01"/><path d="M2 14v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/><path d="M12 2v6"/></svg>,
  Wifi: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/></svg>,
  Menu: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  X: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Upload: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
};

export const PRODUCTS: Product[] = [
  // ROUTERS
  {
    id: 'ccr2004-12s',
    name: 'MikroTik® CCR2004-1G-12S+2XS',
    code: 'Cloud Core Router',
    category: 'Routing',
    specs: ['12× 10G SFP+', '2× 25G SFP28', 'RouterOS v7', 'AL52400 quad-core @ 2 GHz', 'BGP/OSPF/MPLS'],
    description: 'The definitive solution for ISP backbones and enterprise core routing. Features phenomenal single-core performance.',
    imageUrl: VISUALS.ROUTING,
    status: 'In Stock',
    featured: true
  },
  {
    id: 'hap-ax3',
    name: 'MikroTik® hAP ax³',
    code: 'Home Access Point',
    category: 'Wireless',
    specs: ['Wi-Fi 6 (802.11ax)', '2.5 Gigabit Ethernet', 'Triple-chain 5 GHz', 'PoE-in/out', 'IPsec acceleration'],
    description: 'Our top-of-the-line home/small office access point. Blazing fast wireless with the most advanced security features.',
    imageUrl: VISUALS.WIRELESS,
    status: 'In Stock',
    featured: true
  },
  {
    id: 'rb5009',
    name: 'MikroTik® RB5009UG+S+IN',
    code: 'RouterBOARD',
    category: 'Routing',
    specs: ['7× Gigabit Ethernet', '1× 2.5G Ethernet', '1× 10G SFP+', 'ARM quad-core @ 1.4 GHz', '1GB RAM'],
    description: 'The ultimate heavy-duty home lab router. Seven times faster than the previous generation with versatile power options.',
    imageUrl: VISUALS.ROUTING,
    status: 'In Stock'
  },
  // SWITCHES
  {
    id: 'crs518',
    name: 'MikroTik® CRS518-16XS-2XQ-RM',
    code: 'Cloud Router Switch',
    category: 'Switching',
    specs: ['16× 10G SFP+', '2× 100G QSFP28', 'Hot-swap PSU', 'Quad-core 2 GHz', 'SwOS/RouterOS'],
    description: 'High-density fiber switching for data centers and enterprise backbones. 100G capacity on every core port.',
    imageUrl: VISUALS.SWITCHING,
    status: 'In Stock',
    featured: true
  },
  {
    id: 'crs326',
    name: 'MikroTik® CRS326-24G-2S+RM',
    code: 'Cloud Router Switch',
    category: 'Switching',
    specs: ['24× Gigabit Ethernet', '2× 10G SFP+ uplinks', 'Rackmount 1U', 'PoE available', 'L3 routing'],
    description: 'Reliable access layer switching with wire-speed performance and RouterOS L3 capabilities.',
    imageUrl: VISUALS.SWITCHING,
    status: 'In Stock'
  },
  {
    id: 'css610',
    name: 'MikroTik® CSS610-8G-2S+IN',
    code: 'Cloud Smart Switch',
    category: 'Switching',
    specs: ['8× Gigabit Ethernet', '2× 10G SFP+', 'SwOS', 'Low power', 'Fanless'],
    description: 'Compact 10G aggregation for small businesses. Silent, efficient, and professional.',
    imageUrl: VISUALS.SWITCHING,
    status: 'In Stock'
  },
  // WIRELESS
  {
    id: 'audience-ax',
    name: 'MikroTik® Audience Wi-Fi 6',
    code: 'Access Point',
    category: 'Wireless',
    specs: ['Wi-Fi 6', 'Tri-radio Mesh', '4×4 MIMO on 5 GHz', '2.5G uplink', 'PoE 802.3at'],
    description: 'Stylish tri-band mesh solution for high-density environments like hotels, conferences, and modern offices.',
    imageUrl: VISUALS.WIRELESS,
    status: 'In Stock'
  },
  {
    id: 'wap-ax',
    name: 'MikroTik® wAP ax',
    code: 'Wireless Access Point',
    category: 'Wireless',
    specs: ['Wi-Fi 6 dual-concurrent', 'Weatherproof IP54', 'PoE 802.3af/at', 'Integrated antennas'],
    description: 'Rugged, weatherproof outdoor access point. Perfect for campus networks, warehouses, and mobile deployments.',
    imageUrl: VISUALS.WIRELESS,
    status: 'In Stock'
  },
  {
    id: 'lhg-5-ac',
    name: 'MikroTik® LHG 5 ac',
    code: 'Light Head Grid',
    category: 'Wireless',
    specs: ['5 GHz 802.11ac', '24.5 dBi antenna', 'PtP up to 10 km', 'Weatherproof', 'RouterOS L3'],
    description: 'The standard for point-to-point wireless links. Grid design offers unmatched wind protection for high-altitude installs.',
    imageUrl: VISUALS.WIRELESS,
    status: 'In Stock'
  },
  // 5G/LTE
  {
    id: 'chateau-5g-ax',
    name: 'MikroTik® Chateau 5G ax',
    code: '5G Router',
    category: '5G/LTE',
    specs: ['5G NR R16 modem', 'Wi-Fi 6 dual-band', '2.5 Gigabit Ethernet', 'eSIM + nano SIM'],
    description: 'Carrier-grade 5G connectivity for home and enterprise. Features advanced carrier aggregation and high-gain antennas.',
    imageUrl: VISUALS.LTE,
    status: 'In Stock'
  },
  {
    id: 'ltap-lte',
    name: 'MikroTik® LtAP LTE kit',
    code: 'LTE Access Point',
    category: '5G/LTE',
    specs: ['LTE Cat 4', 'Dual-SIM failover', 'Wi-Fi 2.4/5 GHz', 'GPS', 'Weatherproof IP67'],
    description: 'Industrial-grade mobile gateway for vehicles and remote IoT deployments with GPS and triple SIM slots.',
    imageUrl: VISUALS.LTE,
    status: 'In Stock'
  },
  // ACCESSORIES
  {
    id: 's-rj10',
    name: 'MikroTik® S+RJ10',
    code: 'SFP+ Module',
    category: 'Accessories',
    specs: ['10GBASE-T copper SFP+', 'RJ45 Connector', '100m on Cat6a', 'Low power consumption'],
    description: 'Transform your SFP+ ports into 10G copper ports. Supports 6 speeds for maximum hardware compatibility.',
    imageUrl: VISUALS.ACCESSORIES,
    status: 'In Stock'
  }
];

export const CATEGORIES: Category[] = [
  { name: 'All', id: 'all', count: 12, icon: 'Globe' },
  { name: 'Routing', id: 'routing', count: 3, icon: 'Router' },
  { name: 'Switching', id: 'switching', count: 3, icon: 'Grid' },
  { name: 'Wireless', id: 'wireless', count: 3, icon: 'Wifi' },
  { name: '5G/LTE', id: '5g', count: 2, icon: 'Bolt' },
  { name: 'Accessories', id: 'accessories', count: 1, icon: 'Shield' },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    title: 'OFFICIAL MIKROTIK® MASTER DISTRIBUTOR.',
    subtitle: 'NEXLYN Distribution LLC: Your authorized source for genuine network infrastructure in the MENA region.',
    image: VISUALS.ROUTING,
    categoryId: 'Routing'
  },
  {
    title: 'ENTERPRISE-GRADE INFRASTRUCTURE.',
    subtitle: 'Deploy 100G carrier-grade hardware for data centers, ISPs, and large-scale enterprise environments.',
    image: VISUALS.SWITCHING,
    categoryId: 'Switching'
  },
  {
    title: 'B2B DISTRIBUTION EXCELLENCE.',
    subtitle: 'Tiered volume pricing and technical logistics for authorized resellers and system integrators.',
    image: VISUALS.WIRELESS,
    categoryId: 'Wireless'
  },
  {
    title: 'NEXT-GEN 5G CONNECTIVITY.',
    subtitle: 'High-speed LTE and 5G NR hardware for mission-critical mobile and remote networking deployments.',
    image: VISUALS.LTE,
    categoryId: '5G/LTE'
  },
  {
    title: 'PROFESSIONAL NETWORK ACCESSORIES.',
    subtitle: 'SFP+ modules, high-gain antennas, and specialized technical accessories for complete build-outs.',
    image: VISUALS.ACCESSORIES,
    categoryId: 'Accessories'
  }
];

export const WHATSAPP_NUMBER = '971502474482';
export const ADMIN_PASSCODE = 'vidi-admin-2025';
