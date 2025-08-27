import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User } from 'lucide-react';

const ParticipantSearch = ({ 
  participantes, 
  categorias, 
  selectedParticipantId, 
  onSelectParticipant, 
  disabled = false,
  placeholder = "Buscar por dorsal, nombre o categoría...",
  // Nuevas props para control de z-index y clases
  dropdownClassName,
  containerClassName,
  // Props adicionales para mayor flexibilidad
  maxResults = 20,
  showKeyboardHelp = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const listRef = useRef(null);

  // Filtrar participantes basado en el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredParticipants([]);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = participantes.filter(participante => {
      const categoria = categorias.find(c => c.id === participante.categoria_id);
      
      // Buscar en dorsal (exacto o que comience con)
      const dorsalMatch = participante.dorsal?.toString().toLowerCase().includes(term);
      
      // Buscar en nombre completo
      const nombreCompleto = `${participante.nombre} ${participante.apellidos}`.toLowerCase();
      const nombreMatch = nombreCompleto.includes(term);
      
      // Buscar en nombre de categoría
      const categoriaMatch = categoria?.nombre?.toLowerCase().includes(term);
      
      return dorsalMatch || nombreMatch || categoriaMatch;
    });

    // Ordenar por relevancia: dorsal exacto primero, luego dorsal que comience con el término, luego nombre
    filtered.sort((a, b) => {
      const aDorsal = a.dorsal?.toString().toLowerCase();
      const bDorsal = b.dorsal?.toString().toLowerCase();
      const aNombre = `${a.nombre} ${a.apellidos}`.toLowerCase();
      const bNombre = `${b.nombre} ${b.apellidos}`.toLowerCase();
      
      // Dorsal exacto tiene prioridad máxima
      if (aDorsal === term && bDorsal !== term) return -1;
      if (bDorsal === term && aDorsal !== term) return 1;
      
      // Dorsal que comience con el término
      if (aDorsal?.startsWith(term) && !bDorsal?.startsWith(term)) return -1;
      if (bDorsal?.startsWith(term) && !aDorsal?.startsWith(term)) return 1;
      
      // Nombre que comience con el término
      if (aNombre.startsWith(term) && !bNombre.startsWith(term)) return -1;
      if (bNombre.startsWith(term) && !aNombre.startsWith(term)) return 1;
      
      // Orden por dorsal numéricamente
      return parseInt(a.dorsal || 0) - parseInt(b.dorsal || 0);
    });

    setFilteredParticipants(filtered.slice(0, maxResults));
    setHighlightedIndex(-1);
  }, [searchTerm, participantes, categorias, maxResults]);

  // Obtener el participante seleccionado actual
  const selectedParticipant = selectedParticipantId 
    ? participantes.find(p => p.id === selectedParticipantId)
    : null;

  // Manejar selección de participante
  const handleSelectParticipant = (participante) => {
    onSelectParticipant(participante.id);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Limpiar selección
  const handleClearSelection = () => {
    onSelectParticipant(null);
    setSearchTerm('');
    setIsOpen(false);
  };

  // Manejar teclas
  const handleKeyDown = (e) => {
    if (!isOpen || filteredParticipants.length === 0) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredParticipants.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredParticipants.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredParticipants.length) {
          handleSelectParticipant(filteredParticipants[highlightedIndex]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        searchRef.current?.blur();
        break;
    }
  };

  // Scroll al elemento destacado
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex + 1]; // +1 por el header
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  // Cerrar cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clases por defecto con z-index muy alto
  const defaultDropdownClassName = "absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto";
  const defaultContainerClassName = "relative";

  // Usar clases personalizadas si se proporcionan, sino usar las por defecto
  const finalDropdownClassName = dropdownClassName || defaultDropdownClassName;
  const finalContainerClassName = containerClassName || defaultContainerClassName;

  return (
    <div className={finalContainerClassName} ref={searchRef}>
      {/* Participante seleccionado actual */}
      {selectedParticipant && !searchTerm && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-green-600" />
            <div className="text-sm">
              <span className="font-semibold text-green-800">
                #{selectedParticipant.dorsal} - {selectedParticipant.nombre} {selectedParticipant.apellidos}
              </span>
              <div className="text-xs text-green-600">
                {categorias.find(c => c.id === selectedParticipant.categoria_id)?.nombre || 'Sin categoría'}
              </div>
            </div>
          </div>
          {!disabled && (
            <button
              onClick={handleClearSelection}
              className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
              title="Quitar selección"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Campo de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchTerm.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={selectedParticipant ? "Buscar otro participante..." : placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-200 disabled:text-gray-500 transition-all duration-200"
          autoComplete="off"
        />

        {/* Indicador de búsqueda activa */}
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={() => {
                setSearchTerm('');
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lista de resultados con z-index muy alto */}
      {isOpen && searchTerm.trim() && (
        <div className={finalDropdownClassName} style={{ zIndex: 9999 }}>
          {filteredParticipants.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se encontraron participantes</p>
              <p className="text-xs text-gray-400 mt-1">
                Busque por dorsal, nombre o categoría
              </p>
            </div>
          ) : (
            <div ref={listRef}>
              <div className="sticky top-0 p-2 text-xs text-gray-500 border-b bg-gray-50 z-10">
                {filteredParticipants.length} resultado{filteredParticipants.length !== 1 ? 's' : ''} encontrado{filteredParticipants.length !== 1 ? 's' : ''}
                {filteredParticipants.length === maxResults && ` (mostrando primeros ${maxResults})`}
              </div>
              
              {filteredParticipants.map((participante, index) => {
                const categoria = categorias.find(c => c.id === participante.categoria_id);
                const isHighlighted = index === highlightedIndex;
                const isSelected = selectedParticipantId === participante.id;
                
                return (
                  <button
                    key={participante.id}
                    onClick={() => handleSelectParticipant(participante)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors ${
                      isHighlighted ? 'bg-blue-100' : ''
                    } ${
                      isSelected ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isSelected 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            #{participante.dorsal}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {participante.nombre} {participante.apellidos}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {categoria?.nombre || 'Sin categoría'}
                              {categoria?.hora_salida && ` • Salida: ${categoria.hora_salida}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="ml-2 text-green-600">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Ayuda de teclado - Solo mostrar si está habilitada */}
      {showKeyboardHelp && isOpen && searchTerm.trim() && filteredParticipants.length > 0 && (
        <div className="fixed top-4 right-4 z-[10000]">
          <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-gray-700">
            <div className="flex items-center space-x-3">
              <span>↑↓ navegar</span>
              <span>•</span>
              <span>Enter seleccionar</span>
              <span>•</span>
              <span>Esc cerrar</span>
            </div>
          </div>
        </div>
      )}

      {/* Overlay invisible para mejorar la detección de clicks fuera */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => {
            setIsOpen(false);
            setHighlightedIndex(-1);
          }}
        />
      )}
    </div>
  );
};

export default ParticipantSearch;