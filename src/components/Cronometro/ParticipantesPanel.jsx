import React, { useState } from "react";
import { User } from "lucide-react";
import { useTimeCalculations } from "../../hooks/useTimeCalculations";

const ParticipantesPanel = ({
  participantes,
  participantesFiltrados,
  categorias,
  categoriaFiltro,
  setCategoriaFiltro,
  horaSalidaBase
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { calcularDiferenciaSalida } = useTimeCalculations();

  // Filtrar participantes por término de búsqueda
  const participantesBuscados = participantesFiltrados.filter((participante) =>
    searchTerm
      ? participante.dorsal.toString().includes(searchTerm.toLowerCase()) ||
        participante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participante.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const handleParticipantClick = (participante) => {
    navigator.clipboard.writeText(
      `${participante.dorsal} ${participante.nombre} ${participante.apellidos}`
    );
  };

  return (
    <>
      {/* Filtro de categorías */}
      <div className="mb-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Filtrar participantes:
          </label>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">
              Todas las categorías ({participantes.length})
            </option>
            {categorias.map((categoria) => {
              const count = participantes.filter(
                (p) => p.categoria_id === categoria.id
              ).length;
              return (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre} (Salida: {categoria.hora_salida}) - {count} participantes
                </option>
              );
            })}
          </select>
          <span className="text-sm text-gray-500">
            Mostrando {participantesBuscados.length} de {participantes.length} participantes
          </span>
        </div>
      </div>

      {/* Panel de participantes */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Participantes Disponibles ({participantesBuscados.length})
        </h3>

        {/* Búsqueda rápida */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Búsqueda rápida por dorsal o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Tip: También puede buscar directamente en los campos de selección de participantes arriba
          </p>
        </div>

        {participantesBuscados.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay participantes disponibles</p>
            {participantes.length > 0 ? (
              <p className="text-sm">
                Hay {participantes.length} participantes en total. Cambie el filtro de categoría o búsqueda.
              </p>
            ) : (
              <p className="text-sm">No hay participantes cargados</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-sm max-h-80 overflow-y-auto">
            {participantesBuscados.map((participante) => {
              const categoria = categorias.find(
                (c) => c.id === participante.categoria_id
              );
              const diferenciaSalida =
                horaSalidaBase && categoria
                  ? calcularDiferenciaSalida(categoria.hora_salida, horaSalidaBase) / 1000 / 60
                  : 0;

              return (
                <div
                  key={participante.id}
                  className="bg-blue-50 px-3 py-2 rounded border hover:bg-blue-100 transition-colors cursor-pointer"
                  title={`Click para copiar: #${participante.dorsal} ${participante.nombre} ${participante.apellidos}`}
                  onClick={() => handleParticipantClick(participante)}
                >
                  <div className="font-semibold text-blue-900">
                    #{participante.dorsal} - {participante.nombre} {participante.apellidos}
                  </div>
                  <div className="text-xs text-gray-600">
                    {categoria?.nombre || "Sin categoría"} - ID: {participante.categoria_id}
                  </div>
                  <div className="text-xs text-blue-600">
                    Salida: {categoria?.hora_salida || "N/A"}
                    {diferenciaSalida > 0 && (
                      <span className="ml-1 text-orange-600">
                        (+{Math.round(diferenciaSalida)}min)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ParticipantesPanel;