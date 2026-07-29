import React, { useState } from 'react';
import { X, MessageCircle, Plus, Minus, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Product } from '../types/product';
import { buildWhatsAppOrderUrl } from '../utils/whatsapp';

interface WhatsAppModalProps {
  product: Product | null;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [customerNote, setCustomerNote] = useState('');

  if (!product) return null;

  const handleLaunchWhatsApp = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    const url = buildWhatsAppOrderUrl(product, quantity, customerNote);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-content p-6 border border-emerald-500/30 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Order via WhatsApp</h3>
              <p className="text-xs text-slate-400">Direct instant message to boutique sales desk</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-20 h-24 object-cover rounded-lg border border-slate-700"
          />
          <div className="flex flex-col justify-between flex-grow">
            <div>
              <span className="text-[10px] font-mono text-pink-400 uppercase font-semibold">
                SKU: {product.sku}
              </span>
              <h4 className="text-sm font-bold text-white line-clamp-1">{product.name}</h4>
              <p className="text-xs text-slate-400">{product.category}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-white">${product.price.toFixed(2)}</span>
              <span className="text-xs text-emerald-400 font-semibold">
                {product.stockStatus.toUpperCase().replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Quantity:
            </label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="btn btn-secondary btn-icon btn-sm text-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-white w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 99, q + 1))}
                className="btn btn-secondary btn-icon btn-sm text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Size / Color / Custom Request (Optional):
            </label>
            <input
              type="text"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="e.g. Size M, Rose Gold Color, Express Shipping"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl">
            <span className="text-xs font-semibold text-emerald-300">Total Estimated Price:</span>
            <span className="text-lg font-extrabold text-white">${totalPrice}</span>
          </div>
        </div>

        <button onClick={handleLaunchWhatsApp} className="btn btn-whatsapp w-full py-3.5 text-base shadow-xl">
          <Send className="w-5 h-5 fill-current" />
          <span>Proceed & Open WhatsApp Message</span>
        </button>

        <p className="text-[11px] text-center text-slate-400 mt-3">
          Clicking will open WhatsApp with your item title, price (${totalPrice}), and note pre-filled.
        </p>
      </div>
    </div>
  );
};
