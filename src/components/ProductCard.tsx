import React from 'react';
import { MessageCircle, Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
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
          Low Stock
        </span>
      );
    }
    return (
      <span className="badge badge-in-stock">
        <CheckCircle className="w-3.5 h-3.5" />
        In Stock
      </span>
    );
  };

  return (
    <article className="product-card rounded-xl flex flex-col justify-between overflow-hidden border border-amber-500/20 bg-zinc-950">
      {/* Square Clean Product Image Box */}
      <div className="product-image-box aspect-square relative overflow-hidden bg-black group cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.imageUrl}
          alt={`${product.name} - ${product.category}`}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600';
          }}
        />

        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {renderStockBadge()}
        </div>

        {/* Info (i) Quick Details Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 flex items-center justify-center text-amber-300 hover:text-white hover:scale-110 transition-all shadow-md"
            title="Product Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 text-[11px] text-zinc-400">
            <span className="font-semibold text-amber-400 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="font-mono text-zinc-500 text-[10px]">{product.sku}</span>
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-serif font-bold text-white hover:text-amber-300 transition-colors line-clamp-2 cursor-pointer mb-1.5 leading-snug"
          >
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-amber-300 font-serif">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-zinc-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
          <button
            onClick={() => onOpenWhatsAppModal(product)}
            disabled={product.stockStatus === 'sold_out' || product.stockStatus === 'out_of_stock'}
            className={`btn btn-whatsapp w-full py-2 text-xs ${
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
