import React from 'react';
import { MessageCircle, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onOpenWhatsAppModal: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenWhatsAppModal,
  onQuickView,
}) => {
  const renderStockBadge = () => {
    if (product.stockStatus === 'sold_out') {
      return (
        <span className="badge badge-sold-out">
          <XCircle className="w-3.5 h-3.5" />
          Sold Out
        </span>
      );
    }
    if (product.stockStatus === 'out_of_stock' || product.stockQuantity === 0) {
      return (
        <span className="badge badge-out-of-stock">
          <XCircle className="w-3.5 h-3.5" />
          Out of Stock
        </span>
      );
    }
    if (product.stockQuantity > 0 && product.stockQuantity <= 5) {
      return (
        <span className="badge badge-gold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Low Stock ({product.stockQuantity} Left)
        </span>
      );
    }
    return (
      <span className="badge badge-in-stock">
        <CheckCircle className="w-3.5 h-3.5" />
        In Stock ({product.stockQuantity})
      </span>
    );
  };

  const stockPercentage = Math.min(100, Math.max(0, (product.stockQuantity / 30) * 100));

  const getStockBarColor = () => {
    if (product.stockStatus === 'sold_out') return '#71717a';
    if (product.stockStatus === 'out_of_stock' || product.stockQuantity === 0) return '#ef4444';
    if (product.stockQuantity <= 5) return '#f59e0b';
    return '#d4af37';
  };

  return (
    <article className="product-card rounded-2xl flex flex-col justify-between overflow-hidden">
      <div className="product-image-box group">
        <img
          src={product.imageUrl}
          alt={`${product.name} - ${product.category}`}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600';
          }}
        />

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {renderStockBadge()}
          {product.isFeatured && (
            <span className="badge bg-amber-500/80 text-black border border-amber-300 font-bold backdrop-blur-md">
              ⭐ Featured
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => onQuickView(product)}
            className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 flex items-center justify-center text-amber-300 hover:text-white hover:scale-110 transition-all"
            title="Quick Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 text-xs text-zinc-400">
            <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <span className="font-mono text-zinc-500 text-[10px]">SKU: {product.sku}</span>
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="text-base font-serif font-bold text-white hover:text-amber-300 transition-colors line-clamp-2 cursor-pointer mb-1.5"
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-amber-300 font-serif">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-zinc-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium">
              <span>Stock Level</span>
              <span>{product.stockQuantity} units</span>
            </div>
            <div className="stock-bar-container">
              <div
                className="stock-bar-fill"
                style={{
                  width: `${stockPercentage}%`,
                  backgroundColor: getStockBarColor(),
                }}
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-2">
          <button
            onClick={() => onOpenWhatsAppModal(product)}
            disabled={product.stockStatus === 'sold_out' || product.stockStatus === 'out_of_stock'}
            className={`btn btn-whatsapp w-full ${
              product.stockStatus === 'sold_out' || product.stockStatus === 'out_of_stock'
                ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500 border border-zinc-700'
                : ''
            }`}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>
              {product.stockStatus === 'sold_out'
                ? 'Sold Out'
                : product.stockStatus === 'out_of_stock'
                ? 'Out of Stock'
                : 'Order on WhatsApp'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
