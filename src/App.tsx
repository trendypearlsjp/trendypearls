import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Banner } from './components/Banner';
import { ProductGrid } from './components/ProductGrid';
import { FilterSidebar } from './components/FilterSidebar';
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
  const [currentRoute, setCurrentRoute] = useState<string>(
    window.location.pathname === '/admin' ? 'admin' : 'shop'
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
      if (window.location.pathname === '/admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('shop');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    const path = route === 'admin' ? '/admin' : '/';
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
      throw err;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      await loadData();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert('Delete notice: ' + (err.message || err));
    }
  };

  const inStockCount = products.filter((p) => p.stockStatus === 'in_stock' && p.stockQuantity > 0).length;

  if (currentRoute === 'admin') {
    return (
      <>
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
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-zinc-100">
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex-grow w-full">
        <Banner
          totalItems={products.length}
          inStockItems={inStockCount}
          onSelectCategory={(cat) => handleFilterChange({ selectedCategory: cat })}
          selectedCategory={filters.selectedCategory}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start my-6">
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>

          <div className="lg:col-span-3">
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
        </div>
      </main>

      <footer className="glass-header mt-12 border-t border-amber-500/30 py-8 px-4 sm:px-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-black font-serif font-bold text-xs">
              TP
            </div>
            <span className="font-bold text-white text-sm font-serif">TRENDY PEARLS</span>
            <span>— Boutique Collection</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => navigateTo('admin')}
              className="text-zinc-400 hover:text-amber-400 transition-colors"
            >
              Admin Portal
            </button>
          </div>

          <div className="text-zinc-400">
            © 2026 Trendy Pearls. All rights reserved.
          </div>
        </div>
      </footer>

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
