import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Reusable Pagination Component for Admin Pages
 *
 * Props:
 *   currentPage  - current active page (1-indexed)
 *   totalPages   - total number of pages
 *   onPageChange - callback fn(pageNumber) when user clicks a page
 *   totalItems   - (optional) total item count for display
 *   itemsPerPage - (optional) items per page for display
 */
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  if (!totalPages || totalPages < 1) return null;

  // Generate page numbers to show (max 5 around current)
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // Adjust range to always show up to 5 pages
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate showing range
  const startItem = totalItems ? (currentPage - 1) * (itemsPerPage || 1) + 1 : null;
  const endItem = totalItems ? Math.min(currentPage * (itemsPerPage || 1), totalItems) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-gray-50/80 border-t border-gray-100 rounded-b-2xl">
      {/* Info Text */}
      <span className="text-[10px] text-gray-400 font-bold tracking-wide">
        {totalItems
          ? `Showing ${startItem}–${endItem} of ${totalItems}`
          : `Page ${currentPage} of ${totalPages}`}
      </span>

      {/* Page Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 border border-gray-200 hover:bg-white rounded-lg text-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 border border-gray-200 hover:bg-white rounded-lg text-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page Numbers */}
        {pageNumbers[0] > 1 && (
          <span className="px-1 text-[10px] text-gray-300 font-bold select-none">…</span>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`min-w-[28px] h-7 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all duration-200 ${
              num === currentPage
                ? 'bg-primary text-white shadow-sm shadow-primary/20 scale-105'
                : 'border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-800'
            }`}
          >
            {num}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <span className="px-1 text-[10px] text-gray-300 font-bold select-none">…</span>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 border border-gray-200 hover:bg-white rounded-lg text-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 border border-gray-200 hover:bg-white rounded-lg text-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
