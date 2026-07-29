import React, { useState, useEffect } from 'react';
import { X, Upload, Link, Image as ImageIcon, Loader2, Sparkles, Check, Plus } from 'lucide-react';
import type { Product, StockStatus } from '../../types/product';
import { uploadImageToCloudinary } from '../../lib/cloudinary';

interface AdminModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  categories: string[];
  onClose: () => void;
  onSave: (product: Partial<Product>) => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  editingProduct,
  categories: initialCategories,
  onClose,
  onSave,
}) => {
  const [categoriesList, setCategoriesList] = useState<string[]>(initialCategories);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    description: '',
    category: initialCategories[0] || 'Kids Toys',
    price: 0,
    originalPrice: 0,
    stockQuantity: 10,
    stockStatus: 'in_stock',
    imageUrl: '',
    instagramPostUrl: '',
    tags: [],
    isFeatured: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCategoriesList(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
      setTagInput(editingProduct.tags?.join(', ') || '');
    } else {
      setFormData({
        name: '',
        sku: 'TP-' + Math.floor(1000 + Math.random() * 9000),
        description: '',
        category: categoriesList[0] || 'Kids Toys',
        price: 29.99,
        originalPrice: 45.00,
        stockQuantity: 15,
        stockStatus: 'in_stock',
        imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600',
        instagramPostUrl: '',
        tags: ['New', 'Boutique'],
        isFeatured: true,
      });
      setTagInput('New, Boutique');
    }
    setUploadSuccess(false);
    setIsAddingNewCategory(false);
    setNewCategoryName('');
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleAddNewCategoryConfirm = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (!categoriesList.includes(trimmed)) {
      setCategoriesList((prev) => [...prev, trimmed]);
    }
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setIsAddingNewCategory(false);
    setNewCategoryName('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadSuccess(false);

    try {
      const cdnUrl = await uploadImageToCloudinary(file, (percent) => {
        setUploadProgress(percent);
      });

      setFormData((prev) => ({ ...prev, imageUrl: cdnUrl }));
      setUploadSuccess(true);
    } catch (err) {
      console.error('Failed to convert image file to CDN URL:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagsArray = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
      await onSave({
        ...formData,
        tags: tagsArray,
      });
      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-content max-w-2xl p-6 relative border border-amber-500/40 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-white">
              {editingProduct ? 'Edit Product Details' : 'Add New Product to Shop'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-zinc-300 uppercase">Product Title *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kanjivaram Soft Silk Saree or Kids Toy Set"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 uppercase">SKU Code *</label>
              <input
                type="text"
                required
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm font-mono text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Dynamic Category Selection & Add Custom Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-zinc-300 uppercase">Category *</label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>

              {isAddingNewCategory ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category Name"
                    className="w-full bg-zinc-900 border border-amber-400 rounded-lg p-2 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategoryConfirm}
                    className="btn btn-primary btn-sm px-2 text-[10px]"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  value={formData.category || categoriesList[0]}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-amber-400"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 uppercase">Stock Quantity</label>
              <input
                type="number"
                min={0}
                value={formData.stockQuantity ?? 0}
                onChange={(e) => {
                  const qty = Number(e.target.value);
                  let status: StockStatus = formData.stockStatus || 'in_stock';
                  if (qty === 0 && status === 'in_stock') status = 'out_of_stock';
                  if (qty > 0 && status === 'out_of_stock') status = 'in_stock';
                  setFormData({ ...formData, stockQuantity: qty, stockStatus: status });
                }}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 uppercase">Stock Status</label>
              <select
                value={formData.stockStatus || 'in_stock'}
                onChange={(e) =>
                  setFormData({ ...formData, stockStatus: e.target.value as StockStatus })
                }
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-amber-400 font-bold"
              >
                <option value="in_stock">🟢 In Stock</option>
                <option value="sold_out">⚪ Sold Out</option>
                <option value="out_of_stock">🔴 Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300 uppercase">Sale Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price ?? 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 uppercase">Original/List Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice ?? 0}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Cloudinary File-to-URL API Upload */}
          <div className="space-y-2 p-3 bg-zinc-950 rounded-xl border border-amber-500/30">
            <label className="font-bold text-amber-400 uppercase flex items-center justify-between">
              <span>Cloudinary Image API Upload (File → CDN URL)</span>
              {uploadSuccess && (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Converted to CDN URL!
                </span>
              )}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2">
                <label className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-dashed border-amber-500/50 rounded-xl cursor-pointer transition-colors text-amber-300 font-semibold text-xs">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Converting to URL... ({uploadProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Choose Picture File (JPEG, PNG, WebP)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-lg border border-amber-500/40"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <span className="text-[10px] text-zinc-400 line-clamp-2">
                  {formData.imageUrl ? 'URL Ready' : 'No Image'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-1">
                <Link className="w-3 h-3" />
                <span>Or Paste Image Web URL directly:</span>
              </div>
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-300 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-zinc-300 uppercase">Product Description</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe item details, fabric, sizing, specs..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300 uppercase">Instagram Post URL (Optional)</label>
              <input
                type="url"
                value={formData.instagramPostUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramPostUrl: e.target.value })}
                placeholder="https://instagram.com/p/..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 uppercase">Tags (comma separated)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Kids, Saree, Gold, Toys"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="btn btn-primary btn-sm min-w-[120px]"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
