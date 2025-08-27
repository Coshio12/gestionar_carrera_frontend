import React from "react";
import { Search, Filter } from "lucide-react";

const SearchBar = ({ searchTerm, onSearchChange, filteredCount, showFilters = false, onFilterChange }) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, dorsal, CI, equipo o comunidad..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm sm:text-base"
          />
        </div>
        
        {showFilters && (
          <div className="w-full sm:w-auto">
            <select
              onChange={onFilterChange}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm sm:text-base"
            >
              <option value="">Todos los estados</option>
              <option value="completo">Completos</option>
              <option value="dorsal_pendiente">Dorsal pendiente</option>
              <option value="documentos_incompletos">Documentos incompletos</option>
            </select>
          </div>
        )}
      </div>
      
      {searchTerm && (
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs sm:text-sm text-gray-600">
            Mostrando {filteredCount} resultado(s) para "{searchTerm}"
          </p>
          <div className="text-xs text-gray-500">
            💡 Busca por: nombre, dorsal, CI, equipo o comunidad
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;