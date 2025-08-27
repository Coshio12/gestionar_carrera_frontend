import React from "react";

const Pagination = ({ currentPage, totalPages, totalItems, onPrev, onNext }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
      {/* Previous button */}
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
      >
        Anterior
      </button>
      
      {/* Page info - responsive layout */}
      <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4">
        <span className="text-xs sm:text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        <span className="text-xs sm:text-sm text-gray-500">
          ({totalItems} participantes)
        </span>
      </div>
      
      {/* Next button */}
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;