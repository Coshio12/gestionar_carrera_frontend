import React, { useState } from 'react';
import { Edit, Trash2, Medal, Clock, User, ChevronUp, ChevronDown, AlertTriangle, MoreVertical } from 'lucide-react';

const TablaTiempos = ({ tiempos = [], onEdit, onDelete, loading }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [openMenus, setOpenMenus] = useState({});

  const formatTime = (timeMs) => {
    if (!timeMs || timeMs < 0) return '00:00.00';
    
    const hours = Math.floor(timeMs / 3600000);
    const minutes = Math.floor((timeMs % 3600000) / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const centiseconds = Math.floor((timeMs % 1000) / 10);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />;
      default:
        return <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-600">{position}</span>;
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleMenu = (tiempoId) => {
    setOpenMenus(prev => ({
      ...prev,
      [tiempoId]: !prev[tiempoId]
    }));
  };

  const closeAllMenus = () => {
    setOpenMenus({});
  };

  // Validar que tiempos sea un array
  const tiemposArray = Array.isArray(tiempos) ? tiempos : [];

  // Ordenar tiempos
  const tiemposOrdenados = React.useMemo(() => {
    if (tiemposArray.length === 0) return [];
    
    let sortableItems = [...tiemposArray];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'participante':
            aValue = `${a.participantes?.nombre || ''} ${a.participantes?.apellidos || ''}`.toLowerCase();
            bValue = `${b.participantes?.nombre || ''} ${b.participantes?.apellidos || ''}`.toLowerCase();
            break;
          case 'dorsal':
            aValue = a.participantes?.dorsal || '';
            bValue = b.participantes?.dorsal || '';
            break;
          case 'etapa':
            aValue = a.etapas?.numero_etapa || 0;
            bValue = b.etapas?.numero_etapa || 0;
            break;
          case 'tiempo':
            aValue = a.tiempo_final || 0;
            bValue = b.tiempo_final || 0;
            break;
          case 'posicion':
            aValue = a.posicion || 0;
            bValue = b.posicion || 0;
            break;
          case 'fecha':
            aValue = new Date(a.created_at || 0);
            bValue = new Date(b.created_at || 0);
            break;
          default:
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [tiemposArray, sortConfig]);

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 hover:text-blue-600 transition-colors text-left"
    >
      <span className="truncate">{children}</span>
      {sortConfig.key === column ? (
        sortConfig.direction === 'asc' ? (
          <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        )
      ) : (
        <div className="h-3 w-3 sm:h-4 sm:w-4" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 animate-spin mx-auto mb-2" />
        <p className="text-gray-600 text-sm sm:text-base">Cargando tiempos...</p>
      </div>
    );
  }

  if (tiemposArray.length === 0) {
    return (
      <div className="p-6 sm:p-8 text-center text-gray-500">
        <Clock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm sm:text-base">No hay tiempos registrados</p>
        <p className="text-xs sm:text-sm mt-1">Los tiempos aparecerán aquí cuando se registren en el sistema</p>
      </div>
    );
  }

  return (
    <div className="w-full" onClick={closeAllMenus}>
      {/* Versión mobile - Cards */}
      <div className="block sm:hidden">
        <div className="space-y-3 p-4">
          {tiemposOrdenados.map((tiempo, index) => {
            const participante = tiempo.participantes;
            const etapa = tiempo.etapas;
            
            return (
              <div
                key={tiempo.id || index}
                className={`border rounded-lg p-3 ${
                  tiempo.posicion <= 3 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getPositionIcon(tiempo.posicion)}
                    <span className="font-semibold text-sm">#{tiempo.posicion}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {participante?.dorsal || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(tiempo.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {openMenus[tiempo.id] && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit(tiempo);
                            closeAllMenus();
                          }}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete && onDelete(tiempo);
                            closeAllMenus();
                          }}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {participante?.nombre || ''} {participante?.apellidos || ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      CI: {participante?.ci || 'N/A'} | {participante?.categorias?.nombre || 'Sin categoría'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600">Etapa {etapa?.numero_etapa || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{etapa?.nombre || 'Sin nombre'}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold">
                        {formatTime(tiempo.tiempo_final || tiempo.tiempo)}
                      </div>
                      {tiempo.penalizacion > 0 && (
                        <div className="text-xs text-red-600 flex items-center justify-end">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          +{formatTime(tiempo.penalizacion)}
                        </div>
                      )}
                    </div>
                  </div>

                  {tiempo.observaciones && (
                    <div className="text-xs text-gray-600 bg-gray-100 rounded p-2" title={tiempo.observaciones}>
                      📝 {tiempo.observaciones.length > 40 
                        ? `${tiempo.observaciones.substring(0, 40)}...` 
                        : tiempo.observaciones}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                    {tiempo.created_at 
                      ? new Date(tiempo.created_at).toLocaleDateString() + ' ' + new Date(tiempo.created_at).toLocaleTimeString()
                      : 'Fecha no disponible'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Versión desktop - Tabla */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="posicion">Posición</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="dorsal">Dorsal</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="participante">Participante</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="etapa">Etapa</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="tiempo">Tiempo</SortButton>
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="fecha">Fecha</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tiemposOrdenados.map((tiempo, index) => {
              const participante = tiempo.participantes;
              const etapa = tiempo.etapas;
              
              return (
                <tr
                  key={tiempo.id || index}
                  className={`${
                    tiempo.posicion <= 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  {/* Posición */}
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPositionIcon(tiempo.posicion)}
                      <span className="ml-2 font-semibold text-sm">{tiempo.posicion}</span>
                    </div>
                  </td>

                  {/* Dorsal */}
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {participante?.dorsal || 'N/A'}
                    </span>
                  </td>

                  {/* Participante */}
                  <td className="px-3 lg:px-6 py-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {participante?.nombre || ''} {participante?.apellidos || ''}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          CI: {participante?.ci || 'N/A'} | {participante?.categorias?.nombre || 'Sin categoría'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Etapa */}
                  <td className="px-3 lg:px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        Etapa {etapa?.numero_etapa || 'N/A'}
                      </div>
                      <div className="text-gray-500 truncate max-w-[150px]">{etapa?.nombre || 'Sin nombre'}</div>
                    </div>
                  </td>

                  {/* Tiempo */}
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-mono text-base lg:text-lg font-bold">
                        {formatTime(tiempo.tiempo_final || tiempo.tiempo)}
                      </div>
                      {tiempo.penalizacion > 0 && (
                        <div className="text-xs text-red-600 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          +{formatTime(tiempo.penalizacion)}
                        </div>
                      )}
                      {tiempo.observaciones && (
                        <div className="text-xs text-gray-600 mt-1" title={tiempo.observaciones}>
                          📝 {tiempo.observaciones.length > 15 
                            ? `${tiempo.observaciones.substring(0, 15)}...` 
                            : tiempo.observaciones}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Fecha - Solo visible en desktop */}
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="font-medium">
                        {tiempo.created_at 
                          ? new Date(tiempo.created_at).toLocaleDateString()
                          : 'N/A'}
                      </div>
                      <div className="text-xs">
                        {tiempo.created_at 
                          ? new Date(tiempo.created_at).toLocaleTimeString()
                          : ''}
                      </div>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                      <button
                        onClick={() => onEdit && onEdit(tiempo)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-100 rounded"
                        title="Editar tiempo"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(tiempo)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-100 rounded"
                        title="Eliminar tiempo"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaTiempos;