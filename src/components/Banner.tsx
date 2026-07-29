import React from 'react';

interface BannerProps {
  totalItems: number;
  inStockItems: number;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
}

export const Banner: React.FC<BannerProps> = ({
  totalItems,
  inStockItems,
  onSelectCategory,
  selectedCategory,
}) => {
  const categories = [
    { name: 'all', label: 'All Items' },
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

  return (
    <section className="cover-banner-floral p-8 sm:p-12 my-6 text-white shadow-2xl relative border border-amber-500/30">
      {/* Golden Floral Vector & Botanical Watermarks */}
      <div className="absolute top-4 right-6 text-5xl select-none opacity-30 pointer-events-none">
        🌸🌿🌺
      </div>
      <div className="absolute bottom-4 left-6 text-5xl select-none opacity-30 pointer-events-none">
        🌺🍃🌸
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl select-none opacity-[0.03] pointer-events-none">
        🪻🌸🌺
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            <span>🌸 Boutique Collection</span>
            <span>•</span>
            <span>{inStockItems} of {totalItems} Items Available</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif mb-2 bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Trendy Pearls 🌸
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base font-medium max-w-xl">
            Explore our boutique collection of kids toys, dresses, sarees, blouses, earrings, and rings with real-time stock levels.
          </p>
        </div>

        {/* Minimalist Gold Category Filter Pills */}
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
    </section>
  );
};
