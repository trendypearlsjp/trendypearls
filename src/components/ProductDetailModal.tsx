import React from 'react';
import { X, MessageCircle, Tag, Box, Share2 } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenWhatsAppModal: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenWhatsAppModal,
}) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-content max-w-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.instagramPostUrl && (
              <a
                href={product.instagramPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 left-3 bg-pink-600/90 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-lg"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>View Post</span>
              </a>
            )}
          </div>

          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-pink-500/20 text-pink-300 text-xs px-2.5 py-1 rounded-full font-bold">
                  {product.category}
                </span>
                <span className="font-mono text-xs text-slate-400">SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl font-extrabold text-white mb-2 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-white">${product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-slate-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="space-y-3 border-t border-b border-slate-800 py-3 mb-4 text-xs text-slate-300">
                <p className="text-slate-300 leading-relaxed">{product.description}</p>

                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-pink-400" />
                  <span>
                    Stock Status:{' '}
                    <strong className="text-emerald-400 uppercase">
                      {product.stockStatus.replace('_', ' ')} ({product.stockQuantity} available)
                    </strong>
                  </span>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center pt-2">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenWhatsAppModal(product);
                }}
                className="btn btn-whatsapp w-full py-3 text-base font-bold shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Order Product on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
