export type StockStatus = 'in_stock' | 'sold_out' | 'out_of_stock';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  stockStatus: StockStatus;
  imageUrl: string;
  instagramPostUrl?: string;
  tags?: string[];
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface ProductFilterState {
  searchQuery: string;
  selectedCategory: string;
  stockStatus: StockStatus | 'all';
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'stock_high';
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}
