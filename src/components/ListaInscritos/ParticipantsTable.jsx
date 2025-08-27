import React from "react";
import { Edit2, FileText, Eye, Trash2, AlertCircle, DollarSign } from "lucide-react";

const ParticipantsTable = ({
  loading,
  participants,
  filteredParticipants,
  searchTerm,
  onEdit,
  onDelete,
  onViewComprobante
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
              <th className="px-4 py-3 font-semibold">ACCIONES</th>
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
          />
        ))}
      </div>
    </>
  );
};

const ParticipantRowDesktop = ({ participant, index, onEdit, onDelete, onViewComprobante }) => {
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
      <td className="px-4 py-3 font-medium">{participant.nombre}</td>
      <td className="px-4 py-3 font-medium">{participant.apellidos}</td>
      <td className="px-4 py-3">{edad}</td>
      <td className="px-4 py-3 font-mono">{participant.ci}</td>
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
          <span className="text-gray-700 text-xs">{participant.comunidad}</span>
        ) : (
          <span className="text-gray-400 text-xs">No especificado</span>
        )}
      </td>
      <td className="px-4 py-3">
        <ParticipantStatus participant={participant} />
      </td>
      <td className="px-4 py-3">
        <ActionButtons
          participant={participant}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewComprobante={onViewComprobante}
          compact={false}
        />
      </td>
    </tr>
  );
};

const ParticipantCardMobile = ({ participant, index, onEdit, onDelete, onViewComprobante }) => {
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

      {/* Name */}
      <h3 className="font-semibold text-gray-900 text-lg mb-3">
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
          <span className="font-mono text-sm">{participant.ci}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Equipo:</span>
          {equipoNombre ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-block">
              {equipoNombre}
            </span>
          ) : (
            <span className="text-gray-400 text-xs">Sin equipo</span>
          )}
        </div>
        <div>
          <span className="text-gray-500 block">Comunidad:</span>
          <span className="text-xs">
            {participant.comunidad || "No especificado"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
        <ActionButtons
          participant={participant}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewComprobante={onViewComprobante}
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
  
  if (dorsalAsignado && tieneComprobante && tieneFotosCI) {
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
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
        ⚠ Documentos incompletos
      </span>
    );
  }
};

const ActionButtons = ({ participant, onEdit, onDelete, onViewComprobante, compact = false }) => {
  const dorsalAsignado = participant.dorsal && participant.dorsal !== null;
  
  return (
    <div className={`flex items-center space-x-2 ${compact ? 'justify-end' : 'justify-center'}`}>
      <button
        onClick={() => onEdit(participant)}
        className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs"
        title={dorsalAsignado ? "Editar participante" : "Editar participante y asignar dorsal"}
      >
        <Edit2 className="w-4 h-4" />
        <span className={compact ? 'hidden sm:inline' : ''}>
          {dorsalAsignado ? "" : "Asignar"}
        </span>
      </button>
      
      {participant.comprobante_url ? (
        <button
          onClick={() => onViewComprobante(participant)}
          className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs"
          title="Ver comprobante"
        >
          <DollarSign className="w-4 h-4" />
          <span className={compact ? 'hidden sm:inline' : ''}></span>
        </button>
      ) : (
        <span className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-gray-300 text-gray-500 rounded-md text-xs cursor-not-allowed">
          <FileText className="w-3 h-3" />
          <span className={compact ? 'hidden sm:inline' : ''}>Sin pago</span>
        </span>
      )}

      <button
        onClick={() => onDelete(participant)}
        className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs"
        title="Eliminar participante"
      >
        <Trash2 className="w-4 h-4" />
        <span className={compact ? 'hidden sm:inline' : ''}></span>
      </button>
    </div>
  );
};

export default ParticipantsTable;