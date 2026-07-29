import React from 'react';

interface BannerProps {
  totalItems: number;
  inStockItems: number;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
  onSelectPriceDeal: (maxPrice: number, category?: string) => void;
}

export const Banner: React.FC<BannerProps> = ({
  totalItems,
  inStockItems,
  onSelectCategory,
  selectedCategory,
  onSelectPriceDeal,
}) => {
  const categories = [
    { name: 'all', label: 'All Products' },
    { name: 'Kids Toys', label: '🧩 Kids Toys' },
    { name: 'Kids Dresses', label: '👶 Kids Dresses' },
    { name: 'Sarees', label: '🥻 Sarees' },
    { name: 'Blouses & Tops', label: '👚 Blouses' },
    { name: 'Earrings', label: '💎 Earrings' },
    { name: 'Rings & Jewelry', label: '💍 Rings' },
    { name: 'Handbags & Purses', label: '👜 Handbags' },
    { name: 'Footwear & Heels', label: '👠 Footwear' },
    { name: 'Gowns & Dresses', label: '👗 Gowns' },
  ];

  const budgetDeals = [
    { label: '🧩 Toys Under $25', maxPrice: 25, cat: 'Kids Toys' },
    { label: '🥻 Sarees Under $100', maxPrice: 100, cat: 'Sarees' },
    { label: '💎 Earrings Under $30', maxPrice: 30, cat: 'Earrings' },
    { label: '💍 Rings Under $20', maxPrice: 20, cat: 'Rings & Jewelry' },
    { label: '👶 Kids Wear Under $30', maxPrice: 30, cat: 'Kids Dresses' },
  ];

  return (
    <section className="cover-banner-floral p-6 sm:p-10 my-4 text-white shadow-2xl relative border border-amber-500/30 rounded-2xl">
      {/* Golden Floral Accents */}
      <div className="absolute top-4 right-6 text-4xl select-none opacity-25 pointer-events-none">
        🌸🌿🌺
      </div>
      <div className="absolute bottom-4 left-6 text-4xl select-none opacity-25 pointer-events-none">
        🌺🍃🌸
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            <span>🌸 Fancy Store — Townsville</span>
            <span>•</span>
            <span>{inStockItems} of {totalItems} Items Available</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif mb-2 bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Explore Our Products
          </h2>
          <p className="text-zinc-300 text-sm font-medium max-w-xl">
            Browse our complete collection of kids toys, dresses, sarees, blouses, earrings, and rings with direct WhatsApp ordering.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 max-w-xl">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-bold shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800 border border-amber-500/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flipkart-Style Budget Deal Channels */}
      <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider shrink-0 font-serif">
          🔥 Quick Budget Deals:
        </span>
        <div className="flex items-center gap-2">
          {budgetDeals.map((deal, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPriceDeal(deal.maxPrice, deal.cat)}
              className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold shrink-0 transition-colors"
            >
              {deal.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
