import React, { useState } from 'react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { PackageX, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onOpenWhatsAppModal: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenWhatsAppModal,
  onQuickView,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  if (products.length === 0) {
    return (
      <div className="glass-panel p-12 text-center my-8 max-w-lg mx-auto flex flex-col items-center gap-4 border border-amber-500/30">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <PackageX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-white">No Products Found</h3>
        <p className="text-sm text-zinc-400">
          We couldn't find any products matching your current search query or filter selection. Try adjusting your filters or search keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 border border-amber-500/30">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 font-medium">
          <LayoutGrid className="w-4 h-4 text-amber-400" />
          <span>
            Showing <strong className="text-white">{startIndex + 1}</strong> -{' '}
            <strong className="text-white">{Math.min(startIndex + itemsPerPage, products.length)}</strong> of{' '}
            <strong className="text-amber-400">{products.length}</strong> items
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-zinc-900 border border-amber-500/30 rounded px-2.5 py-1 text-white outline-none focus:border-amber-400"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary btn-icon btn-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold px-2 text-zinc-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-secondary btn-icon btn-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenWhatsAppModal={onOpenWhatsAppModal}
            onQuickView={onQuickView}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
            .map((page, idx, arr) => {
              const showDots = idx > 0 && page - arr[idx - 1] > 1;
              return (
                <React.Fragment key={page}>
                  {showDots && <span className="text-zinc-400">...</span>}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`btn btn-sm ${
                      currentPage === page ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-sm"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
