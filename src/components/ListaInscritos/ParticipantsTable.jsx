import React from "react";
import { Edit2, FileText, Eye, Trash2, AlertCircle, DollarSign, CreditCard, Shield } from "lucide-react";

const ParticipantsTable = ({
  loading,
  participants,
  filteredParticipants,
  searchTerm,
  onEdit,
  onDelete,
  onViewComprobante,
  onViewDocumento // Nueva función para ver documentos
}) => {
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-lime-600 mx-auto mb-2"></div>
        <span className="text-sm sm:text-base">Cargando participantes...</span>
      </div>
    );
  }

  if (filteredParticipants.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 px-4">
        <span className="text-sm sm:text-base">
          {searchTerm 
            ? 'No se encontraron participantes con ese criterio de búsqueda.' 
            : 'No hay inscritos en esta categoría.'
          }
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-gray-700 text-center">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="px-4 py-3 border-r border-lime-400 font-semibold">DORSAL</th>
              <th className="px-4 py-3 border-r border-lime-400 font-semibold">NOMBRES</th>
              <th className="px-4 py-3 border-r border-lime-400 font-semibold">APELLIDOS</th>
              <th className="px-4 py-3 border-r border-lime-400 font-semibold">EDAD</th>
              <th className="px-4 py-3 border-r border-lime-400 font-semibold">CI/DNI</th>
              <th className="px-4 py-3 border-r border-lime-400 font-semibold">EQUIPO</th>
              <th className="px-4 py-3 border-r border-lime-400 font-semibold">COMUNIDAD</th>
              <th className="px-4 py-3 border-r border-lime-400 font-semibold">ESTADO</th>
              <th className="px-4 py-3 border-r border-lime-400 font-semibold">ACCIONES</th>
              <th className="px-4 py-3 font-semibold">DOCUMENTOS</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <ParticipantRowDesktop
                key={participant.id}
                participant={participant}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewComprobante={onViewComprobante}
                onViewDocumento={onViewDocumento}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {participants.map((participant, index) => (
          <ParticipantCardMobile
            key={participant.id}
            participant={participant}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewComprobante={onViewComprobante}
            onViewDocumento={onViewDocumento}
          />
        ))}
      </div>
    </>
  );
};

const ParticipantRowDesktop = ({ participant, index, onEdit, onDelete, onViewComprobante, onViewDocumento }) => {
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      
      if (isNaN(birth.getTime())) return 'N/A';
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age >= 0 && age <= 120 ? age : 'N/A';
    } catch (error) {
      console.error('Error calculando edad:', error);
      return 'N/A';
    }
  };

  const edad = calculateAge(participant.fecha_nacimiento);
  const dorsalAsignado = participant.dorsal && participant.dorsal !== null;
  const equipoNombre = participant.equipo?.nombre || participant.equipo || '';

  return (
    <tr className={index % 2 === 0 ? "bg-white" : "bg-lime-100"}>
      <td className="px-4 py-3">
        {dorsalAsignado ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            {participant.dorsal.toString().padStart(3, "0")}
          </span>
        ) : (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1 justify-center">
            <AlertCircle className="w-3 h-3" />
            Pendiente
          </span>
        )}
      </td>
      <td className="px-4 py-3 font-medium max-w-32 break-words">{participant.nombre}</td>
      <td className="px-4 py-3 font-medium max-w-32 break-words">{participant.apellidos}</td>
      <td className="px-4 py-3">{edad}</td>
      <td className="px-4 py-3 font-mono max-w-32 break-words">{participant.ci}</td>
      <td className="px-4 py-3">
        {equipoNombre ? (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            {equipoNombre}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">Sin equipo</span>
        )}
      </td>
      <td className="px-4 py-3">
        {participant.comunidad ? (
          <span className="text-gray-700 text-xs max-w-32 break-words">{participant.comunidad}</span>
        ) : (
          <span className="text-gray-400 text-xs">No especificado</span>
        )}
      </td>
      <td className="px-4 py-3">
        <ParticipantStatus participant={participant} />
      </td>
      <td className="px-4 py-3 flex items-center justify-center">
        <EditDeleteButtons
          participant={participant}
          onEdit={onEdit}
          onDelete={onDelete}
          compact={false}
        />
      </td>
      <td className="px-4 py-3">
        <DocumentButtons
          participant={participant}
          onViewComprobante={onViewComprobante}
          onViewDocumento={onViewDocumento}
          compact={false}
        />
      </td>
    </tr>
  );
};

const ParticipantCardMobile = ({ participant, index, onEdit, onDelete, onViewComprobante, onViewDocumento }) => {
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      
      if (isNaN(birth.getTime())) return 'N/A';
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age >= 0 && age <= 120 ? age : 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

  const edad = calculateAge(participant.fecha_nacimiento);
  const dorsalAsignado = participant.dorsal && participant.dorsal !== null;
  const equipoNombre = participant.equipo?.nombre || participant.equipo || '';

  return (
    <div className={`rounded-lg p-4 shadow-sm border ${
      index % 2 === 0 ? "bg-white" : "bg-lime-50"
    }`}>
      {/* Header with Dorsal and Status */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          {dorsalAsignado ? (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              #{participant.dorsal.toString().padStart(3, "0")}
            </span>
          ) : (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Sin dorsal
            </span>
          )}
        </div>
        <ParticipantStatus participant={participant} />
      </div>

      {/* Name - Cambiado para permitir salto de línea */}
      <h3 className="font-semibold text-gray-900 text-lg mb-3 break-words">
        {participant.nombre} {participant.apellidos}
      </h3>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <span className="text-gray-500 block">Edad:</span>
          <span className="font-medium">{edad}</span>
        </div>
        <div>
          <span className="text-gray-500 block">CI/DNI:</span>
          <span className="font-mono text-sm break-words">{participant.ci}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Equipo:</span>
          {equipoNombre ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-block break-words">
              {equipoNombre}
            </span>
          ) : (
            <span className="text-gray-400 text-xs">Sin equipo</span>
          )}
        </div>
        <div>
          <span className="text-gray-500 block">Comunidad:</span>
          <span className="text-xs break-words">
            {participant.comunidad || "No especificado"}
          </span>
        </div>
      </div>

      {/* Separador de secciones */}
      <div className="border-t border-gray-200 pt-3 mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Documentos</h4>
        <div className="flex justify-start space-x-2 mb-3">
          <DocumentButtons
            participant={participant}
            onViewComprobante={onViewComprobante}
            onViewDocumento={onViewDocumento}
            compact={true}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
        <EditDeleteButtons
          participant={participant}
          onEdit={onEdit}
          onDelete={onDelete}
          compact={true}
        />
      </div>
    </div>
  );
};

const ParticipantStatus = ({ participant }) => {
  const dorsalAsignado = participant.dorsal && participant.dorsal !== null;
  const tieneComprobante = participant.comprobante_url;
  const tieneFotosCI = participant.foto_anverso_url && participant.foto_reverso_url;
  const tieneAutorizacion = participant.autorizacion_url;
  
  // Calcular edad para determinar si necesita autorización
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      
      if (isNaN(birth.getTime())) return null;
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age >= 0 && age <= 120 ? age : null;
    } catch (error) {
      return null;
    }
  };

  const edad = calculateAge(participant.fecha_nacimiento);
  const esMenorDeEdad = edad !== null && edad < 18;
  const necesitaAutorizacion = esMenorDeEdad;
  
  // Verificar si está completo
  const documentosCompletos = tieneFotosCI && (!necesitaAutorizacion || tieneAutorizacion);
  
  if (dorsalAsignado && tieneComprobante && documentosCompletos) {
    return (
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        ✓ Completo
      </span>
    );
  } else if (!dorsalAsignado) {
    return (
      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
        Dorsal pendiente
      </span>
    );
  } else {
    // Determinar qué documentos faltan
    const documentosFaltantes = [];
    if (!tieneComprobante) documentosFaltantes.push('pago');
    if (!tieneFotosCI) documentosFaltantes.push('CI');
    if (necesitaAutorizacion && !tieneAutorizacion) documentosFaltantes.push('autorización');
    
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
        ⚠ Falta: {documentosFaltantes.join(', ')}
      </span>
    );
  }
};

// Componente separado para los botones de editar y eliminar
const EditDeleteButtons = ({ participant, onEdit, onDelete, compact = false }) => {
  const dorsalAsignado = participant.dorsal && participant.dorsal !== null;
  
  return (
    <div className={`flex items-center space-x-1 ${compact ? 'justify-end' : 'justify-center'} flex-wrap gap-1`}>
      {/* Botón Editar */}
      <button
        onClick={() => onEdit(participant)}
        className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs"
        title={dorsalAsignado ? "Editar participante" : "Editar participante y asignar dorsal"}
      >
        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className={compact ? 'hidden sm:inline' : ''}>
          {dorsalAsignado ? 'Editar' : "Asignar"}
        </span>
      </button>

      {/* Botón Eliminar */}
      <button
        onClick={() => onDelete(participant)}
        className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs"
        title="Eliminar participante"
      >
        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className={compact ? 'hidden sm:inline' : ''}>Eliminar</span>
      </button>
    </div>
  );
};

// Componente separado para los botones de documentos
const DocumentButtons = ({ participant, onViewComprobante, onViewDocumento, compact = false }) => {
  const tieneAnverso = participant.foto_anverso_url;
  const tieneReverso = participant.foto_reverso_url;
  const tieneAutorizacion = participant.autorizacion_url;
  

  
  return (
    <div className={`flex items-center space-x-1 ${compact ? 'justify-start' : 'justify-center'} flex-wrap gap-1`}>
      {/* Botón Ver Comprobante */}
      {participant.comprobante_url ? (
        <button
          onClick={() => onViewComprobante(participant)}
          className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs"
          title="Ver comprobante de pago"
        >
          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className={compact ? 'hidden sm:inline' : ''}>Pago</span>
        </button>
      ) : (
        <span className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-gray-300 text-gray-500 rounded-md text-xs cursor-not-allowed" title="Sin comprobante de pago">
          <FileText className="w-3 h-3" />
          <span className={compact ? 'hidden sm:inline' : ''}>Sin pago</span>
        </span>
      )}

      {/* Dropdown para documentos del CI y autorización */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-xs">
          <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className={compact ? 'hidden sm:inline' : ''}>Docs</span>
        </button>
        
        {/* Dropdown menu */}
        <div className="absolute bottom-full right-0 mb-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="py-1">
            {/* CI Anverso */}
            <button
              onClick={() => onViewDocumento(participant, 'anverso')}
              disabled={!tieneAnverso}
              className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 ${
                tieneAnverso 
                  ? 'hover:bg-gray-100 text-gray-700' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>CI Anverso</span>
              {tieneAnverso && <span className="ml-auto text-green-500">✓</span>}
            </button>
            
            {/* CI Reverso */}
            <button
              onClick={() => onViewDocumento(participant, 'reverso')}
              disabled={!tieneReverso}
              className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 ${
                tieneReverso 
                  ? 'hover:bg-gray-100 text-gray-700' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>CI Reverso</span>
              {tieneReverso && <span className="ml-auto text-green-500">✓</span>}
            </button>
            
            {/* Autorización - Mejorada la detección */}
            <button
              onClick={() => onViewDocumento(participant, 'autorizacion')}
              disabled={!tieneAutorizacion}
              className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 ${
                tieneAutorizacion 
                  ? 'hover:bg-gray-100 text-gray-700' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Autorización</span>
              {tieneAutorizacion && <span className="ml-auto text-green-500">✓</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsTable;