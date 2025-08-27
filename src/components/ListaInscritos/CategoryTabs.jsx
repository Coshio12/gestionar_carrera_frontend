import React from "react";

const CategoryTabs = ({ categorias, categoriaActiva, setCategoriaActiva }) => {
  return (
    <div className="mb-4">
      {/* Mobile: Dropdown selector */}
      <div className="block sm:hidden">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base transition-all duration-200 ${
              categoriaActiva?.id === cat.id
                ? "bg-white text-lime-500 font-semibold shadow-sm"
                : "text-lime-700 hover:bg-white hover:shadow-sm hover:text-lime-600"
            }`}
          >
            {cat.nombre.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Desktop/Tablet: Tab buttons */}
      <div className="hidden sm:flex flex-wrap gap-2 bg-lime-200 p-2 rounded-lg">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base transition-all duration-200 ${
              categoriaActiva?.id === cat.id
                ? "bg-white text-lime-500 font-semibold shadow-sm"
                : "text-lime-700 hover:bg-white hover:shadow-sm hover:text-lime-600"
            }`}
          >
            {cat.nombre.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Active category indicator for mobile */}
      <div className="block sm:hidden mt-2">
        <div className="text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lime-100 text-lime-800">
            Categoría actual: {categoriaActiva?.nombre?.toUpperCase() || 'NINGUNA'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;