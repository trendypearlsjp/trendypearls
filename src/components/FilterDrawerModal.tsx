import React from 'react';
import { X, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import type { ProductFilterState, StockStatus } from '../types/product';

interface FilterDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilterState;
  categories: string[];
  onFilterChange: (newFilters: Partial<ProductFilterState>) => void;
  onResetFilters: () => void;
}

export const FilterDrawerModal: React.FC<FilterDrawerModalProps> = ({
  isOpen,
  onClose,
  filters,
  categories,
  onFilterChange,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  const stockOptions: { value: StockStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Items' },
    { value: 'in_stock', label: 'In Stock Only' },
    { value: 'sold_out', label: 'Sold Out' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-content max-w-md p-6 relative border border-amber-500/40 text-slate-100 bg-zinc-950 shadow-2xl rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-white">Filter & Sort Products</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6 text-xs">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Sort Products By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="w-full bg-zinc-900 border border-amber-500/30 rounded-xl p-2.5 text-sm text-white outline-none focus:border-amber-400"
            >
              <option value="featured">⭐ Featured First</option>
              <option value="newest">🔥 Newest Arrivals</option>
              <option value="price_asc">💵 Price: Low to High</option>
              <option value="price_desc">💎 Price: High to Low</option>
              <option value="stock_high">📦 Stock Quantity: High to Low</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Stock Availability
            </label>
            <div className="grid grid-cols-2 gap-2">
              {stockOptions.map((opt) => {
                const isSelected = filters.stockStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onFilterChange({ stockStatus: opt.value })}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Product Categories
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => onFilterChange({ selectedCategory: 'all' })}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  filters.selectedCategory === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border-l-4 border-amber-400 font-bold'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onFilterChange({ selectedCategory: cat })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    filters.selectedCategory === cat
                      ? 'bg-amber-500/20 text-amber-300 border-l-4 border-amber-400 font-bold'
                      : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-zinc-400 uppercase tracking-wider">Price Range</span>
              <span className="font-mono text-amber-400 font-bold">
                ${filters.minPrice} - ${filters.maxPrice}+
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={300}
              step={5}
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
            <button
              onClick={onResetFilters}
              className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
            </button>
            <button onClick={onClose} className="btn btn-primary btn-sm">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
