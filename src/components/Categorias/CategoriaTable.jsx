import React from "react";
import { Edit2, Trash2, Clock, FolderOpen } from "lucide-react";

const CategoriaTable = ({ categorias, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Cargando categorías...
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">No hay categorías</h3>
        <p className="text-sm text-gray-500">Comience creando una nueva categoría.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-center font-semibold">NOMBRE</th>
              <th className="px-4 py-3 text-center font-semibold">HORA DE SALIDA</th>
              <th className="px-4 py-3 text-center font-semibold">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria, index) => (
              <CategoriaRowDesktop
                key={categoria.id}
                categoria={categoria}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {categorias.map((categoria, index) => (
          <CategoriaCardMobile
            key={categoria.id}
            categoria={categoria}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

const CategoriaRowDesktop = ({ categoria, index, onEdit, onDelete }) => {
  const formatTime = (time) => {
    if (!time) return '-';
    return time.includes(':') ? time.substring(0, 5) : time;
  };

  return (
    <tr className={index % 2 === 0 ? "bg-white" : "bg-lime-50"}>
      <td className="px-4 py-3 text-center">
        <span className="font-medium text-gray-900">
          {categoria.nombre}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {formatTime(categoria.hora_salida)}
        </span>
      </td>
      <td className="px-4 py-3">
        <ActionButtons
          categoria={categoria}
          onEdit={onEdit}
          onDelete={onDelete}
          compact={false}
        />
      </td>
    </tr>
  );
};

const CategoriaCardMobile = ({ categoria, index, onEdit, onDelete }) => {
  const formatTime = (time) => {
    if (!time) return '-';
    return time.includes(':') ? time.substring(0, 5) : time;
  };

  return (
    <div className={`rounded-lg p-4 shadow-sm border ${
      index % 2 === 0 ? "bg-white" : "bg-lime-50"
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg">
          {categoria.nombre}
        </h3>
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {formatTime(categoria.hora_salida)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <ActionButtons
          categoria={categoria}
          onEdit={onEdit}
          onDelete={onDelete}
          compact={true}
        />
      </div>
    </div>
  );
};

const ActionButtons = ({ categoria, onEdit, onDelete, compact = false }) => {
  const buttonClass = compact 
    ? "flex items-center space-x-1 px-2 py-1 rounded-md transition-colors text-xs"
    : "flex items-center space-x-1 px-3 py-1 rounded-md transition-colors text-xs";

  return (
    <div className={`flex items-center space-x-2 ${compact ? 'justify-end' : 'justify-center'}`}>
      <button
        onClick={() => onEdit(categoria)}
        className={`${buttonClass} bg-yellow-500 text-white hover:bg-yellow-600`}
        title="Editar categoría"
      >
        <Edit2 className="w-4 h-4" />
        <span className={compact ? 'hidden sm:inline' : ''}></span>
      </button>
      
      <button
        onClick={() => onDelete(categoria)}
        className={`${buttonClass} bg-red-500 text-white hover:bg-red-600`}
        title="Eliminar categoría"
      >
        <Trash2 className="w-4 h-4" />
        <span className={compact ? 'hidden sm:inline' : ''}></span>
      </button>
    </div>
  );
};

export default CategoriaTable;