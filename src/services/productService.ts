import type { Product, ProductFilterState, StockStatus } from '../types/product';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'trendy_products_catalog_v1';

export function getLocalProducts(): Product[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read from localStorage', e);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export async function fetchProducts(filters: ProductFilterState): Promise<{
  products: Product[];
  total: number;
  categories: string[];
}> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (filters.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`);
      }
      if (filters.selectedCategory && filters.selectedCategory !== 'all') {
        query = query.eq('category_name', filters.selectedCategory);
      }
      if (filters.stockStatus && filters.stockStatus !== 'all') {
        query = query.eq('stock_status', filters.stockStatus);
      }
      if (filters.minPrice > 0) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice < 10000) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.sortBy === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (filters.sortBy === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else if (filters.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (filters.sortBy === 'stock_high') {
        query = query.order('stock_quantity', { ascending: false });
      } else {
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      }

      const { data, count, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        const formattedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          sku: item.sku,
          name: item.name,
          description: item.description || '',
          category: item.category_name || 'General',
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          stockQuantity: item.stock_quantity,
          stockStatus: item.stock_status as StockStatus,
          imageUrl: item.image_url,
          instagramPostUrl: item.instagram_post_url,
          tags: item.tags || [],
          isFeatured: item.is_featured || false,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        const { data: catData } = await supabase.from('categories').select('name');
        let categories = catData ? catData.map((c: any) => c.name) : [];
        if (categories.length === 0) {
          categories = Array.from(new Set(formattedProducts.map((p) => p.category)));
        }

        return {
          products: formattedProducts,
          total: count || formattedProducts.length,
          categories,
        };
      }
    } catch (err) {
      console.warn('Supabase query fallback to local catalog:', err);
    }
  }

  let items = getLocalProducts();

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase();
    items = items.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filters.selectedCategory && filters.selectedCategory !== 'all') {
    items = items.filter(p => p.category === filters.selectedCategory);
  }

  if (filters.stockStatus && filters.stockStatus !== 'all') {
    items = items.filter(p => p.stockStatus === filters.stockStatus);
  }

  items = items.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

  if (filters.sortBy === 'price_asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price_desc') {
    items.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'newest') {
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (filters.sortBy === 'stock_high') {
    items.sort((a, b) => b.stockQuantity - a.stockQuantity);
  } else {
    items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const allLocal = getLocalProducts();
  const categories = Array.from(new Set(allLocal.map(p => p.category)));

  return {
    products: items,
    total: items.length,
    categories,
  };
}

export async function updateStockLevel(
  id: string,
  action: 'increment' | 'decrement' | 'set_in_stock' | 'set_sold_out' | 'set_out_of_stock',
  targetQty?: number
): Promise<Product> {
  let products = getLocalProducts();
  const index = products.findIndex(p => p.id === id);
  let prod: Product;

  if (index !== -1) {
    prod = products[index];

    if (action === 'increment') {
      prod.stockQuantity += 1;
      if (prod.stockStatus === 'out_of_stock' || prod.stockStatus === 'sold_out') {
        prod.stockStatus = 'in_stock';
      }
    } else if (action === 'decrement') {
      prod.stockQuantity = Math.max(0, prod.stockQuantity - 1);
      if (prod.stockQuantity === 0) {
        prod.stockStatus = 'out_of_stock';
      }
    } else if (action === 'set_in_stock') {
      prod.stockStatus = 'in_stock';
      if (prod.stockQuantity === 0) prod.stockQuantity = 10;
    } else if (action === 'set_sold_out') {
      prod.stockStatus = 'sold_out';
      prod.stockQuantity = 0;
    } else if (action === 'set_out_of_stock') {
      prod.stockStatus = 'out_of_stock';
      prod.stockQuantity = 0;
    }

    if (targetQty !== undefined) {
      prod.stockQuantity = targetQty;
    }

    prod.updatedAt = new Date().toISOString();
    products[index] = prod;
    saveLocalProducts(products);
  } else {
    prod = { id } as Product;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('products')
        .update({
          stock_quantity: prod.stockQuantity,
          stock_status: prod.stockStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase stock update fallback to local:', e);
    }
  }

  return prod;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  let products = getLocalProducts();
  let savedProd: Product;

  if (product.id) {
    const idx = products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      savedProd = {
        ...products[idx],
        ...product,
        updatedAt: new Date().toISOString(),
      } as Product;
      products[idx] = savedProd;
    } else {
      savedProd = product as Product;
    }
  } else {
    const newId = 'prod-' + Date.now();
    const newSku = product.sku || 'TP-' + Math.floor(1000 + Math.random() * 9000);
    savedProd = {
      id: newId,
      sku: newSku,
      name: product.name || 'New Product',
      description: product.description || '',
      category: product.category || 'Kids Toys',
      price: product.price || 0,
      originalPrice: product.originalPrice,
      stockQuantity: product.stockQuantity ?? 10,
      stockStatus: product.stockStatus || (product.stockQuantity === 0 ? 'out_of_stock' : 'in_stock'),
      imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
      instagramPostUrl: product.instagramPostUrl,
      tags: product.tags || [],
      isFeatured: product.isFeatured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.unshift(savedProd);
  }

  // 1. Always save to local catalog FIRST so the user product saves 100% reliably!
  saveLocalProducts(products);

  // 2. Try background sync to live Supabase DB
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        name: savedProd.name,
        sku: savedProd.sku,
        description: savedProd.description,
        category_name: savedProd.category,
        price: savedProd.price,
        original_price: savedProd.originalPrice,
        stock_quantity: savedProd.stockQuantity,
        stock_status: savedProd.stockStatus,
        image_url: savedProd.imageUrl,
        instagram_post_url: savedProd.instagramPostUrl,
        is_featured: savedProd.isFeatured,
      };

      if (product.id) {
        await supabase.from('products').update(payload).eq('id', product.id);
      } else {
        const { data } = await supabase.from('products').insert([payload]).select();
        if (data && data[0]) {
          savedProd.id = data[0].id;
          products[0].id = data[0].id;
          saveLocalProducts(products);
        }
      }
    } catch (e) {
      console.warn('Supabase sync notice (saved to local store):', e);
    }
  }

  return savedProd;
}

export async function deleteProduct(id: string): Promise<void> {
  let products = getLocalProducts();
  products = products.filter(p => p.id !== id);
  saveLocalProducts(products);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete notice:', err);
    }
  }
}

export function resetLocalCatalog(): Product[] {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}
