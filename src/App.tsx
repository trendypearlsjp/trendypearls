import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Banner } from './components/Banner';
import { ProductGrid } from './components/ProductGrid';
import { FilterDrawerModal } from './components/FilterDrawerModal';
import { AboutUsSection } from './components/AboutUsSection';
import { WhatsAppModal } from './components/WhatsAppModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminModal } from './components/Admin/AdminModal';

import type { Product, ProductFilterState, AdminUser } from './types/product';
import {
  fetchProducts,
  updateStockLevel,
  saveProduct,
  deleteProduct,
} from './services/productService';

export const App: React.FC = () => {
  const isCurrentlyAdmin = () => {
    const p = window.location.pathname;
    const h = window.location.hash;
    return p.endsWith('/gp') || p.endsWith('/gp/') || h.includes('gp');
  };

  const [currentRoute, setCurrentRoute] = useState<string>(
    isCurrentlyAdmin() ? 'admin' : 'shop'
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ProductFilterState>({
    searchQuery: '',
    selectedCategory: 'all',
    stockStatus: 'all',
    minPrice: 0,
    maxPrice: 300,
    sortBy: 'featured',
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [adminUser, setAdminUser] = useState<AdminUser>({
    email: 'admin@trendypearls.shop',
    isAuthenticated: false,
  });

  const [selectedWhatsAppProduct, setSelectedWhatsAppProduct] = useState<Product | null>(null);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isAdminProductModalOpen, setIsAdminProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      if (isCurrentlyAdmin()) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('shop');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    const basePath = window.location.pathname.startsWith('/trendypearls') ? '/trendypearls/' : '/';
    const path = route === 'admin' ? `${basePath}#gp` : basePath;
    window.history.pushState({}, '', path);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts(filters);
      setProducts(res.products);
      setCategories(res.categories);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleSearchChange = (q: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: q }));
  };

  const handleFilterChange = (newFilters: Partial<ProductFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: 'all',
      stockStatus: 'all',
      minPrice: 0,
      maxPrice: 300,
      sortBy: 'featured',
    });
  };

  const handleSelectPriceDeal = (maxPrice: number, cat?: string) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice,
      selectedCategory: cat || 'all',
    }));
  };

  const handleStockUpdate = async (
    id: string,
    action: 'increment' | 'decrement' | 'set_in_stock' | 'set_sold_out' | 'set_out_of_stock'
  ) => {
    try {
      await updateStockLevel(id, action);
      await loadData();
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      await saveProduct(productData);
      await loadData();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      await loadData();
    } catch (err: any) {
      console.error('Error deleting product:', err);
    }
  };

  const activeFilterCount =
    (filters.selectedCategory !== 'all' ? 1 : 0) +
    (filters.stockStatus !== 'all' ? 1 : 0) +
    (filters.maxPrice < 300 ? 1 : 0) +
    (filters.sortBy !== 'featured' ? 1 : 0);

  const inStockCount = products.filter((p) => p.stockStatus === 'in_stock' && p.stockQuantity > 0).length;

  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-black text-zinc-100">
        <AdminDashboard
          products={products}
          adminUser={adminUser}
          onLogin={(email) => setAdminUser({ email, isAuthenticated: true })}
          onLogout={() => setAdminUser({ email: '', isAuthenticated: false })}
          onOpenAddModal={() => {
            setEditingProduct(null);
            setIsAdminProductModalOpen(true);
          }}
          onEditProduct={(prod) => {
            setEditingProduct(prod);
            setIsAdminProductModalOpen(true);
          }}
          onDeleteProduct={handleDeleteProduct}
          onUpdateStock={handleStockUpdate}
          onBackToShop={() => navigateTo('shop')}
        />

        <AdminModal
          isOpen={isAdminProductModalOpen}
          editingProduct={editingProduct}
          categories={categories}
          onClose={() => {
            setIsAdminProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100">
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex-grow w-full">
        <Banner
          totalItems={products.length}
          inStockItems={inStockCount}
          onSelectCategory={(cat) => handleFilterChange({ selectedCategory: cat })}
          selectedCategory={filters.selectedCategory}
          onSelectPriceDeal={handleSelectPriceDeal}
        />

        <div className="my-6">
          {loading ? (
            <div className="glass-panel p-12 text-center my-8 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-zinc-400">Loading catalog items...</p>
            </div>
          ) : (
            <ProductGrid
              products={products}
              onOpenWhatsAppModal={(prod) => setSelectedWhatsAppProduct(prod)}
              onQuickView={(prod) => setSelectedDetailProduct(prod)}
            />
          )}
        </div>

        {/* Townsville SEO About Us Section */}
        <AboutUsSection />
      </main>

      <footer className="glass-header mt-12 border-t border-amber-500/30 py-8 px-4 sm:px-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-black font-serif font-bold text-xs">
              TP
            </div>
            <span className="font-bold text-white text-sm font-serif">TRENDY PEARLS</span>
            <span>— Fancy Store, Townsville</span>
          </div>

          <div className="text-zinc-400">
            © 2026 Trendy Pearls. All rights reserved.
          </div>
        </div>
      </footer>

      <FilterDrawerModal
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {selectedWhatsAppProduct && (
        <WhatsAppModal
          product={selectedWhatsAppProduct}
          onClose={() => setSelectedWhatsAppProduct(null)}
        />
      )}

      {selectedDetailProduct && (
        <ProductDetailModal
          product={selectedDetailProduct}
          onClose={() => setSelectedDetailProduct(null)}
          onOpenWhatsAppModal={(prod) => setSelectedWhatsAppProduct(prod)}
        />
      )}
    </div>
  );
};

export default App;
