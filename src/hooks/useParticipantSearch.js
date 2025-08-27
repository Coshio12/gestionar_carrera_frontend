import { useState, useMemo } from 'react';

export const useParticipantSearch = (participants) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredParticipants = useMemo(() => {
    if (!participants || participants.length === 0) {
      return [];
    }

    let filtered = participants;

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(participant => {
        const nombre = `${participant.nombre} ${participant.apellidos}`.toLowerCase();
        const ci = participant.ci?.toString().toLowerCase() || '';
        const dorsal = participant.dorsal?.toString().toLowerCase() || '';
        
        // Manejar equipo como texto directo o como objeto con nombre
        const equipo = (participant.equipo?.nombre || participant.equipo || '').toLowerCase();
        const comunidad = participant.comunidad?.toLowerCase() || '';
        
        return nombre.includes(term) ||
               ci.includes(term) ||
               dorsal.includes(term) ||
               equipo.includes(term) ||
               comunidad.includes(term);
      });
    }

    // Filtrar por estado
    if (filterStatus) {
      filtered = filtered.filter(participant => {
        const dorsalAsignado = participant.dorsal && participant.dorsal !== null;
        const tieneComprobante = participant.comprobante_url;
        const tieneFotosCI = participant.foto_anverso_url && participant.foto_reverso_url;
        
        switch (filterStatus) {
          case 'completo':
            return dorsalAsignado && tieneComprobante && tieneFotosCI;
          case 'dorsal_pendiente':
            return !dorsalAsignado;
          case 'documentos_incompletos':
            return dorsalAsignado && (!tieneComprobante || !tieneFotosCI);
          default:
            return true;
        }
      });
    }

    // Ordenar: primero los que no tienen dorsal asignado, luego por nombre
    filtered.sort((a, b) => {
      const aHasDorsal = a.dorsal && a.dorsal !== null;
      const bHasDorsal = b.dorsal && b.dorsal !== null;
      
      // Si uno tiene dorsal y el otro no, el que no tiene va primero
      if (aHasDorsal !== bHasDorsal) {
        return aHasDorsal ? 1 : -1;
      }
      
      // Si ambos tienen dorsal o ambos no tienen, ordenar por nombre
      const aName = `${a.nombre} ${a.apellidos}`.toLowerCase();
      const bName = `${b.nombre} ${b.apellidos}`.toLowerCase();
      return aName.localeCompare(bName);
    });

    return filtered;
  }, [participants, searchTerm, filterStatus]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredParticipants
  };
};