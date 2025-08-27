import React, { useRef, useEffect } from "react";
import { Timer, Save, Trophy, AlertCircle, CheckCircle } from "lucide-react";
import { useRegistroRapido } from "../hooks/useRegistroRapido";
import Sidebar from "../components/Sidebar";

const RegistroRapido = () => {
  const {
    etapas,
    etapaSeleccionada,
    setEtapaSeleccionada,
    dorsal,
    setDorsal,
    tiempo,
    setTiempo,
    posicion,
    setPosicion,
    aplicarBonificacion,
    setAplicarBonificacion,
    loading,
    participante,
    tiemposRecientes,
    buscarParticipante,
    registrarTiempo,
    limpiarFormulario,
    bonificaciones,
  } = useRegistroRapido();

  const dorsalRef = useRef(null);
  const tiempoRef = useRef(null);
  const posicionRef = useRef(null);

  // Focus automático al dorsal cuando cambie la etapa
  useEffect(() => {
    if (etapaSeleccionada && dorsalRef.current) {
      dorsalRef.current.focus();
    }
  }, [etapaSeleccionada]);

  const handleDorsalChange = (e) => {
    const valor = e.target.value;
    setDorsal(valor);

    // Buscar participante cuando el dorsal tenga al menos 1 carácter
    if (valor.trim()) {
      buscarParticipante(valor.trim());
    }
  };

  const handleRegistrarTiempo = async () => {
    const success = await registrarTiempo();
    if (success) {
      limpiarFormulario();
      // Focus automático para siguiente registro
      if (dorsalRef.current) {
        dorsalRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      } else {
        handleRegistrarTiempo();
      }
    }
  };
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-10 animate-fade-in bg-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <div className=" bg-white p-3 rounded-lg shadow w-full flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Timer className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Registro Rápido
              </h1>
              <p className="text-gray-600">
                Sistema de registro rápido de tiempos
              </p>
            </div>
          </div>
        </div>

        <div className="">
          {/* Formulario de registro */}
          <div className=" bg-white p-6 rounded-lg shadow mb-8">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Nuevo Registro</h2>

              {/* Selección de etapa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etapa
                </label>
                <select
                  value={etapaSeleccionada}
                  onChange={(e) => setEtapaSeleccionada(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar etapa...</option>
                  {etapas.map((etapa) => (
                    <option key={etapa.id} value={etapa.id}>
                      Etapa {etapa.numero_etapa}: {etapa.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dorsal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dorsal
                </label>
                <input
                  ref={dorsalRef}
                  type="text"
                  value={dorsal}
                  onChange={handleDorsalChange}
                  onKeyPress={(e) => handleKeyPress(e, tiempoRef)}
                  placeholder="Ingrese el dorsal..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* Info del participante */}
                {participante && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-800 font-medium">
                        {participante.nombre} {participante.apellidos}
                      </span>
                    </div>
                    <div className="text-sm text-green-600">
                      Categoría:{" "}
                      {participante.categorias?.nombre || "Sin categoría"}
                    </div>
                  </div>
                )}

                {dorsal && !participante && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-800">
                        Participante no encontrado
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tiempo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo (MM:SS.CC o HH:MM:SS.CC)
                </label>
                <input
                  ref={tiempoRef}
                  type="text"
                  value={tiempo}
                  onChange={(e) => setTiempo(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, posicionRef)}
                  placeholder="ej: 45:23.50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos válidos: 45:23.50, 1:45:23.50
                </p>
              </div>

              {/* Posición y bonificación */}
              {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición (opcional)
                </label>
                <input
                  ref={posicionRef}
                  type="number"
                  value={posicion}
                  onChange={(e) => setPosicion(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, null)}
                  placeholder="1, 2, 3..."
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bonificación
                </label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="bonificacion"
                    checked={aplicarBonificacion}
                    onChange={(e) => setAplicarBonificacion(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="bonificacion"
                    className="text-sm text-gray-700"
                  >
                    Aplicar bonificación
                  </label>
                </div>
              </div>
            </div> */}

              {/* Tabla de bonificaciones */}
              {/* {aplicarBonificacion && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Bonificaciones:
                </h4>
                <div className="text-sm text-yellow-700">
                  <div className="grid grid-cols-5 gap-2">
                    <div>1°: -10s</div>
                    <div>2°: -6s</div>
                    <div>3°: -4s</div>
                    <div>4°: -2s</div>
                    <div>5°: -1s</div>
                  </div>
                </div>
              </div>
            )} */}

              {/* Botón de registro */}
              <button
                onClick={handleRegistrarTiempo}
                disabled={
                  loading ||
                  !etapaSeleccionada ||
                  !dorsal ||
                  !tiempo ||
                  !participante
                }
                className="w-full bg-lime-600 hover:bg-lime-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Registrar Tiempo</span>
                  </>
                )}
              </button>
            </div>

            {/* Registros recientes */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroRapido;
