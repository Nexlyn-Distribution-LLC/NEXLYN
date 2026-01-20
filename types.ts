
export interface Product {
  id: string;
  slug?: string;
  name: string;
  code: string;
  category: 'Wireless' | 'Switching' | 'Routing' | '5G/LTE' | 'IoT' | 'Accessories';
  specs: string[];
  description: string;
  imageUrl: string;
  status: 'In Stock' | 'Low Stock' | 'Backorder';
  featured?: boolean;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: GroundingSource[];
  thought?: string;
}

export interface Category {
  name: string;
  id: string;
  count: number;
  icon?: string;
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  image?: string;
  categoryId?: string;
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';
