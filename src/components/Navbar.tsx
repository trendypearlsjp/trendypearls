import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenFilterDrawer,
  activeFilterCount,
}) => {
  return (
    <header className="glass-header sticky top-0 z-50 py-3.5 px-4 sm:px-8 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif font-extrabold text-xl shadow-lg shadow-amber-500/10">
            TP
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider font-serif bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
              TRENDY PEARLS
            </h1>
            <p className="text-[10px] text-zinc-400 tracking-widest uppercase font-semibold">
              Fancy Store — Townsville
            </p>
          </div>
        </div>

        {/* Live Search Bar & Filter Drawer Button */}
        <div className="w-full sm:max-w-md order-3 sm:order-2 flex items-center gap-2">
          <div className="search-input-wrapper flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search toys, dresses, sarees, jewelry..."
              className="search-input"
              aria-label="Search fancy store items"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white bg-zinc-800 px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Compact Filter Drawer Button */}
          <button
            onClick={onOpenFilterDrawer}
            className="btn btn-secondary py-2.5 px-3 rounded-xl border border-amber-500/30 flex items-center gap-1.5 text-xs text-amber-300 hover:bg-amber-500/10 shrink-0"
            title="Filter & Sort Products"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Store Badge */}
        <div className="hidden sm:block order-3 text-right">
          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
            ✨ Townsville Fancy Store
          </span>
        </div>
      </div>
    </header>
  );
};
