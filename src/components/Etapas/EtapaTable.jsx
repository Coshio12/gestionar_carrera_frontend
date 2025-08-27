import React from "react";
import { Edit2, Trash2, MapPin, Hash, Calendar, Target, CheckCircle, XCircle } from "lucide-react";

const EtapaTable = ({ etapas, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-lime-600 mx-auto mb-2"></div>
        <span className="text-sm sm:text-base">Cargando etapas...</span>
      </div>
    );
  }

  if (etapas.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 px-4">
        <MapPin className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">No hay etapas</h3>
        <p className="text-sm text-gray-500">Comience creando una nueva etapa.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-center font-semibold">ETAPA</th>
              <th className="px-4 py-3 text-center font-semibold">NOMBRE</th>
              <th className="px-4 py-3 text-center font-semibold">CATEGORIAS</th>
              <th className="px-4 py-3 text-center font-semibold">DISTANCIA</th>
              <th className="px-4 py-3 text-center font-semibold">ESTADO</th>
              <th className="px-4 py-3 text-center font-semibold">FECHA NAC</th>
              <th className="px-4 py-3 text-center font-semibold">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {etapas.map((etapa, index) => (
              <EtapaRowDesktop
                key={etapa.id}
                etapa={etapa}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile and Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {etapas.map((etapa, index) => (
          <EtapaCardMobile
            key={etapa.id}
            etapa={etapa}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

const EtapaRowDesktop = ({ etapa, index, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDistance = (distance) => {
    if (!distance) return '-';
    return `${distance} km`;
  };

  const renderCategorias = (categorias) => {
    if (!categorias || categorias.length === 0) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
          Sin categoría
        </span>
      );
    }

    if (categorias.length === 1) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {categorias[0].nombre}
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1 justify-center">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {categorias[0].nombre}
        </span>
        {categorias.length > 1 && (
          <span 
            className="px-2 py-1 bg-blue-200 text-blue-900 rounded-full text-xs font-medium cursor-help"
            title={`Otras categorías: ${categorias.slice(1).map(c => c.nombre).join(', ')}`}
          >
            +{categorias.length - 1}
          </span>
        )}
      </div>
    );
  };

  return (
    <tr className={index % 2 === 0 ? "bg-white" : "bg-lime-100"}>
      <td className="px-4 py-3">
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium inline-flex items-center">
          <Hash className="w-3 h-3 mr-1" />
          {etapa.numero_etapa}
        </span>
      </td>
      <td className="px-4 py-3">
        <div>
          <span className="font-medium text-gray-900">
            {etapa.nombre}
          </span>
          {etapa.descripcion && (
            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={etapa.descripcion}>
              {etapa.descripcion}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {renderCategorias(etapa.categorias)}
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center">
          <Target className="w-3 h-3 mr-1" />
          {formatDistance(etapa.distancia_km)}
        </span>
      </td>
      <td className="px-4 py-3">
        {etapa.activa ? (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activa
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium inline-flex items-center">
            <XCircle className="w-3 h-3 mr-1" />
            Inactiva
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium inline-flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(etapa.created_at)}
        </span>
      </td>
      <td className="px-4 py-3">
        <ActionButtons
          etapa={etapa}
          onEdit={onEdit}
          onDelete={onDelete}
          compact={false}
        />
      </td>
    </tr>
  );
};

const EtapaCardMobile = ({ etapa, index, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDistance = (distance) => {
    if (!distance) return '-';
    return `${distance} km`;
  };

  const renderCategorias = (categorias) => {
    if (!categorias || categorias.length === 0) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
          Sin categoría
        </span>
      );
    }

    if (categorias.length === 1) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {categorias[0].nombre}
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {categorias[0].nombre}
        </span>
        {categorias.length > 1 && (
          <span 
            className="px-2 py-1 bg-blue-200 text-blue-900 rounded-full text-xs font-medium"
            title={`Otras categorías: ${categorias.slice(1).map(c => c.nombre).join(', ')}`}
          >
            +{categorias.length - 1}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-lg p-4 shadow-sm border ${
      index % 2 === 0 ? "bg-white" : "bg-lime-50"
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium inline-flex items-center">
            <Hash className="w-3 h-3 mr-1" />
            {etapa.numero_etapa}
          </span>
          {etapa.activa ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Activa
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium inline-flex items-center">
              <XCircle className="w-3 h-3 mr-1" />
              Inactiva
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
        {etapa.nombre}
      </h3>

      {/* Description */}
      {etapa.descripcion && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {etapa.descripcion}
        </p>
      )}

      {/* Info Grid */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Categorías:</span>
          <div>{renderCategorias(etapa.categorias)}</div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Distancia:</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center">
            <Target className="w-3 h-3 mr-1" />
            {formatDistance(etapa.distancia_km)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Fecha:</span>
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium inline-flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(etapa.created_at)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
        <ActionButtons
          etapa={etapa}
          onEdit={onEdit}
          onDelete={onDelete}
          compact={true}
        />
      </div>
    </div>
  );
};

const ActionButtons = ({ etapa, onEdit, onDelete, compact = false }) => {
  return (
    <div className={`flex items-center space-x-2 ${compact ? 'justify-end' : 'justify-center'}`}>
      <button
        onClick={() => onEdit(etapa)}
        className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-xs"
        title="Editar etapa"
      >
        <Edit2 className="w-4 h-4" />
        <span className={compact ? 'hidden sm:inline' : ''}></span>
      </button>
      
      <button
        onClick={() => onDelete(etapa)}
        className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs"
        title="Eliminar etapa"
      >
        <Trash2 className="w-4 h-4" />
        <span className={compact ? 'hidden sm:inline' : ''}></span>
      </button>
    </div>
  );
};

export default EtapaTable;