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
    setParticipante,
    tiemposRecientes,
    buscarParticipante,
    registrarTiempo,
    limpiarFormulario,
    bonificaciones,
  } = useRegistroRapido();

  const dorsalRef = useRef(null);
  const tiempoRef = useRef(null);
  const posicionRef = useRef(null);
  const isInitialMount = useRef(true);

  // Focus automático al dorsal SOLO cuando se carga por primera vez y hay etapa seleccionada
  useEffect(() => {
    if (isInitialMount.current && etapaSeleccionada && dorsalRef.current) {
      dorsalRef.current.focus();
      isInitialMount.current = false;
    }
  }, [etapaSeleccionada]);

  // Función para formatear tiempo automáticamente
  const formatTimeInput = (value) => {
    // Remover todo lo que no sea número o punto
    const numbersOnly = value.replace(/[^\d.]/g, '');
    
    // Si está vacío, retornar vacío
    if (!numbersOnly) return '';
    
    // Separar parte entera y decimales
    const parts = numbersOnly.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    let formatted = '';
    
    // Formatear según la longitud
    if (integerPart.length <= 2) {
      // MM (minutos) - hasta 2 dígitos
      formatted = integerPart;
    } else if (integerPart.length <= 4) {
      // MM:SS - 3-4 dígitos
      const minutes = integerPart.slice(0, -2);
      const seconds = integerPart.slice(-2);
      formatted = `${minutes}:${seconds}`;
    } else if (integerPart.length <= 6) {
      // HH:MM:SS - 5-6 dígitos
      const hours = integerPart.slice(0, -4);
      const minutes = integerPart.slice(-4, -2);
      const seconds = integerPart.slice(-2);
      formatted = `${hours}:${minutes}:${seconds}`;
    } else {
      // Más de 6 dígitos, tomar solo los primeros 6
      const truncated = integerPart.slice(0, 6);
      const hours = truncated.slice(0, -4);
      const minutes = truncated.slice(-4, -2);
      const seconds = truncated.slice(-2);
      formatted = `${hours}:${minutes}:${seconds}`;
    }
    
    // Agregar decimales si existen
    if (decimalPart !== undefined) {
      // Limitar a 2 decimales máximo
      const limitedDecimals = decimalPart.slice(0, 2);
      formatted += `.${limitedDecimals}`;
    }
    
    return formatted;
  };

  // Manejar cambio de etapa con prevención de auto-selección
  const handleEtapaChange = (e) => {
    const selectedValue = e.target.value;
    setEtapaSeleccionada(selectedValue);
    
    // Solo hacer focus si realmente se selecciona una etapa válida
    if (selectedValue && dorsalRef.current) {
      // Usar setTimeout para evitar conflictos con el re-render
      setTimeout(() => {
        if (dorsalRef.current) {
          dorsalRef.current.focus();
        }
      }, 100);
    }
  };

  const handleDorsalChange = (e) => {
    const valor = e.target.value;
    
    // Solo permitir números en el dorsal
    const numbersOnly = valor.replace(/[^\d]/g, '');
    
    // Limitar a 3 dígitos máximo
    const limitedValue = numbersOnly.slice(0, 3);
    
    setDorsal(limitedValue);

    // Limpiar participante inmediatamente al cambiar dorsal
    setParticipante(null);

    // Buscar participante cuando el dorsal tenga al menos 1 carácter
    if (limitedValue.trim()) {
      buscarParticipante(limitedValue);
    }
  };

  // Función mejorada para el onChange del tiempo
  const handleTiempoChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatTimeInput(inputValue);
    setTiempo(formattedValue);
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

              {/* Selección de etapa - CORREGIDO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etapa
                </label>
                <select
                  value={etapaSeleccionada}
                  onChange={handleEtapaChange}
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
                  placeholder="Ingrese el dorsal (ej: 012)..."
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
                      Dorsal: {participante.dorsal} | Categoría:{" "}
                      {participante.categorias?.nombre || "Sin categoría"}
                    </div>
                  </div>
                )}

                {dorsal && !participante && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-800">
                        Participante no encontrado con dorsal: {dorsal.padStart(3, '0')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tiempo con formato automático */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo (formato automático)
                </label>
                <input
                  ref={tiempoRef}
                  type="text"
                  value={tiempo}
                  onChange={handleTiempoChange}
                  onKeyPress={(e) => handleKeyPress(e, posicionRef)}
                  placeholder="Solo números: 452350 → 45:23.50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg"
                />
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-gray-500">
                    Escriba solo números. Se formatea automáticamente:
                  </p>
                  <div className="text-xs text-blue-600 grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <span>• 4523 → 45:23</span>
                    <span>• 452350 → 45:23.50</span>
                    <span>• 1452350 → 1:45:23.50</span>
                  </div>
                </div>
              </div>

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
          </div>

          {/* Tiempos recientes */}
          {tiemposRecientes.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Registros Recientes</span>
              </h2>
              <div className="space-y-2">
                {tiemposRecientes.map((registro, index) => (
                  <div
                    key={registro.id || index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        #{registro.dorsal}
                      </span>
                      <span className="font-medium">{registro.participante}</span>
                      <span className="text-gray-500 text-sm">{registro.etapa}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-lg font-semibold">
                        {registro.tiempo}
                      </span>
                      {registro.bonificacion && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          -{registro.bonificacion}
                        </span>
                      )}
                      <span className="text-gray-400 text-xs">
                        {registro.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistroRapido;