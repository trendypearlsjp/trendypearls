import React from 'react';
import { SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import type { ProductFilterState, StockStatus } from '../types/product';

interface FilterSidebarProps {
  filters: ProductFilterState;
  categories: string[];
  onFilterChange: (newFilters: Partial<ProductFilterState>) => void;
  onResetFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  categories,
  onFilterChange,
  onResetFilters,
}) => {
  const stockOptions: { value: StockStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Items' },
    { value: 'in_stock', label: 'In Stock Only' },
    { value: 'sold_out', label: 'Sold Out' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ];

  return (
    <aside className="glass-panel p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 font-serif font-bold text-amber-300 text-base">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Filters & Sort</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Reset All
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
          Sort Products By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
          className="w-full bg-zinc-950 border border-amber-500/30 rounded-xl p-2.5 text-sm text-white outline-none focus:border-amber-400 transition-colors"
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
        <div className="space-y-1.5">
          {stockOptions.map((opt) => {
            const isSelected = filters.stockStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onFilterChange({ stockStatus: opt.value })}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
          Product Categories
        </label>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
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
    </aside>
  );
};
