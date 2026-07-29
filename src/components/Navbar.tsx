import React from 'react';
import { Search } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
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
            <p className="text-[10px] text-zinc-400 tracking-widest uppercase">
              Boutique Collection
            </p>
          </div>
        </div>

        {/* Live Quick Search Bar */}
        <div className="w-full sm:max-w-md order-3 sm:order-2">
          <div className="search-input-wrapper">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search toys, dresses, sarees, jewelry..."
              className="search-input"
              aria-label="Search boutique products"
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
        </div>

        {/* Clean right badge */}
        <div className="hidden sm:block order-3 text-right">
          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
            ✨ Boutique Shop
          </span>
        </div>
      </div>
    </header>
  );
};
