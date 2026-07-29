import React, { useState } from 'react';
import { ShieldCheck, Plus, Search, Edit, Trash2, LogOut, CheckCircle, AlertTriangle, XCircle, Package, KeyRound } from 'lucide-react';
import type { Product, AdminUser } from '../../types/product';

interface AdminDashboardProps {
  products: Product[];
  adminUser: AdminUser;
  onLogin: (email: string) => void;
  onLogout: () => void;
  onOpenAddModal: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, action: 'increment' | 'decrement' | 'set_in_stock' | 'set_sold_out' | 'set_out_of_stock') => void;
  onBackToShop: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  adminUser,
  onLogin,
  onLogout,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onUpdateStock,
  onBackToShop,
}) => {
  const [loginEmail, setLoginEmail] = useState('admin@trendypearls.shop');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const totalCount = products.length;
  const inStockCount = products.filter((p) => p.stockStatus === 'in_stock' && p.stockQuantity > 0).length;
  const soldOutCount = products.filter((p) => p.stockStatus === 'sold_out').length;
  const outOfStockCount = products.filter((p) => p.stockStatus === 'out_of_stock' || (p.stockQuantity === 0 && p.stockStatus !== 'sold_out')).length;

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && p.stockStatus === filterStatus;
  });

  if (!adminUser.isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="glass-panel max-w-md w-full p-8 border border-amber-500/40 text-center bg-zinc-950 shadow-2xl rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 shadow-md text-amber-400 font-serif font-extrabold text-2xl">
            TP
          </div>

          <h2 className="text-2xl font-serif font-extrabold text-white mb-1">Trendy Pearls Admin</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Protected Admin Management Console
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin(loginEmail);
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-amber-500/30 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-amber-500/30 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 font-bold text-sm">
              <KeyRound className="w-4 h-4" />
              <span>Log In to Admin Console</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
            <span>Trendy Pearls Portal</span>
            <button onClick={onBackToShop} className="text-amber-400 hover:underline font-semibold">
              ← Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      <div className="max-w-6xl mx-auto glass-panel p-6 border border-amber-500/40 bg-zinc-950 shadow-2xl rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-extrabold text-white">Trendy Pearls Inventory Admin</h2>
              <p className="text-xs text-zinc-400">
                Logged in as <strong className="text-amber-400">{adminUser.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onOpenAddModal} className="btn btn-primary btn-sm">
              <Plus className="w-4 h-4" /> Add Product & Category
            </button>
            <button onClick={onBackToShop} className="btn btn-secondary btn-sm">
              View Storefront
            </button>
            <button onClick={onLogout} className="btn btn-secondary btn-sm" title="Log Out">
              <LogOut className="w-4 h-4 text-zinc-400" /> Log Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3">
            <Package className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Total Products</div>
              <div className="text-xl font-extrabold text-white">{totalCount}</div>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">In Stock</div>
              <div className="text-xl font-extrabold text-emerald-400">{inStockCount}</div>
            </div>
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-zinc-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Sold Out</div>
              <div className="text-xl font-extrabold text-zinc-300">{soldOutCount}</div>
            </div>
          </div>

          <div className="p-4 bg-red-950/40 rounded-xl border border-red-500/30 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Out of Stock</div>
              <div className="text-xl font-extrabold text-red-400">{outOfStockCount}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
          <div className="search-input-wrapper sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, SKU, category..."
              className="search-input py-2 text-xs"
            />
          </div>

          <div className="flex gap-2 text-xs">
            {['all', 'in_stock', 'sold_out', 'out_of_stock'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] ${
                  filterStatus === st
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900 text-zinc-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock & Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-zinc-900/60">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-10 h-12 object-cover rounded border border-zinc-800"
                      />
                      <span className="font-bold text-white line-clamp-1">{prod.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-zinc-400">{prod.sku}</td>
                  <td className="p-3 font-semibold text-amber-300">{prod.category}</td>
                  <td className="p-3 font-bold text-white">${prod.price.toFixed(2)}</td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white">{prod.stockQuantity} units</span>
                      <div className="flex gap-1 text-[9px]">
                        <button
                          onClick={() => onUpdateStock(prod.id, 'set_in_stock')}
                          className={`px-1.5 py-0.5 rounded ${
                            prod.stockStatus === 'in_stock' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          In Stock
                        </button>
                        <button
                          onClick={() => onUpdateStock(prod.id, 'set_sold_out')}
                          className={`px-1.5 py-0.5 rounded ${
                            prod.stockStatus === 'sold_out' ? 'bg-zinc-600 text-white' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          Sold Out
                        </button>
                        <button
                          onClick={() => onUpdateStock(prod.id, 'set_out_of_stock')}
                          className={`px-1.5 py-0.5 rounded ${
                            prod.stockStatus === 'out_of_stock' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          Out
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditProduct(prod)}
                        className="btn btn-secondary btn-icon btn-sm"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete product "${prod.name}"?`)) {
                            onDeleteProduct(prod.id);
                          }
                        }}
                        className="btn btn-danger btn-icon btn-sm"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
