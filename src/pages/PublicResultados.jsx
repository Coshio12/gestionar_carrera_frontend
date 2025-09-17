import React, { useState, useEffect } from "react";
import {
  Trophy,
  Clock,
  BarChart3,
  Medal,
  Users,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/Landing/PublicHeader";
import Footer from "../components/Landing/Footer";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";

const PublicResultados = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [etapaActiva, setEtapaActiva] = useState(null);
  const [tiempos, setTiempos] = useState([]);
  const [clasificacion, setClasificacion] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("clasificacion");
  const [showEtapasDropdown, setShowEtapasDropdown] = useState(false);
  const [showCategoriasDropdown, setShowCategoriasDropdown] = useState(false);

  // Función para formatear tiempo (copiada de useTiempo.js)
  const formatTime = (timeMs) => {
    if (!timeMs || timeMs < 0) return "00:00:00.00";

    const hours = Math.floor(timeMs / 3600000); // 3600000 ms = 1 hora
    const minutes = Math.floor((timeMs % 3600000) / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const centiseconds = Math.floor((timeMs % 1000) / 10);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Función para calcular la clasificación general correcta
  const calcularClasificacionGeneral = (todosLosTiempos, categoriaId) => {
    // Filtrar tiempos por categoría
    const tiemposPorCategoria = todosLosTiempos.filter(
      tiempo => tiempo.participantes?.categoria_id === categoriaId
    );

    // Agrupar por participante
    const participantesTiempos = {};
    
    tiemposPorCategoria.forEach(tiempo => {
      const participanteId = tiempo.participantes?.id;
      if (!participanteId) return;

      if (!participantesTiempos[participanteId]) {
        participantesTiempos[participanteId] = {
          participante: tiempo.participantes,
          etapa1: null,
          etapa2: null
        };
      }

      // Determinar si es etapa de ida (1) o vuelta (2)
      const numeroEtapa = tiempo.etapas?.numero_etapa;
      if (numeroEtapa === 1) {
        participantesTiempos[participanteId].etapa1 = tiempo;
      } else if (numeroEtapa === 2) {
        participantesTiempos[participanteId].etapa2 = tiempo;
      }
    });

    // Calcular tiempo total para cada participante
    const clasificacionFinal = Object.values(participantesTiempos).map(data => {
      const PENALIZACION_ETAPA_FALTANTE = 5 * 60 * 60 * 1000; // 5:00:00 en ms

      let tiempoEtapa1 = 0;
      let tiempoEtapa2 = 0;

      // Calcular tiempo etapa 1 (ida)
      if (data.etapa1) {
        tiempoEtapa1 = data.etapa1.tiempo_final || 0;
      } else {
        tiempoEtapa1 = PENALIZACION_ETAPA_FALTANTE; // 5:00:00 si no participó
      }

      // Calcular tiempo etapa 2 (vuelta)
      if (data.etapa2) {
        tiempoEtapa2 = data.etapa2.tiempo_final || 0;
      } else {
        tiempoEtapa2 = PENALIZACION_ETAPA_FALTANTE; // 5:00:00 si no participó
      }

      const tiempoTotal = tiempoEtapa1 + tiempoEtapa2;

      return {
        participante_id: data.participante.id,
        participantes: data.participante,
        tiempo_etapa1: tiempoEtapa1,
        tiempo_etapa2: tiempoEtapa2,
        tiempo_total: tiempoTotal,
        tiene_etapa1: !!data.etapa1,
        tiene_etapa2: !!data.etapa2
      };
    });

    // Ordenar por tiempo total y asignar posiciones
    clasificacionFinal.sort((a, b) => a.tiempo_total - b.tiempo_total);
    
    clasificacionFinal.forEach((participante, index) => {
      participante.posicion = index + 1;
    });

    // Limitar a los primeros 30 participantes
    return clasificacionFinal.slice(0, 30);
  };

  useEffect(() => {
    fetchCategorias();
    fetchEtapas();
  }, []);

  useEffect(() => {
    if (activeTab === "tiempos" && etapaActiva) {
      fetchTiemposEtapa();
    } else if (activeTab === "clasificacion" && categoriaActiva) {
      fetchClasificacionGeneral();
    }
  }, [etapaActiva, categoriaActiva, activeTab]);

  const fetchCategorias = async () => {
    try {
      // Llamada pública sin token de autenticación
      const response = await axios.get(`${API_BASE_URL}/api/public/categorias`);

      const categoriasData = response.data.categorias || [];
      setCategorias(categoriasData);
      if (categoriasData.length > 0) {
        setCategoriaActiva(categoriasData[0]);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
      // Si no existe endpoint público, intentar con el privado (podría funcionar sin auth)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/inscripciones/categorias`
        );
        const categoriasData = response.data.categorias || [];
        setCategorias(categoriasData);
        if (categoriasData.length > 0) {
          setCategoriaActiva(categoriasData[0]);
        }
      } catch (secondError) {
        console.error(
          "Error cargando categorías (segundo intento):",
          secondError
        );
      }
    }
  };

  const fetchEtapas = async () => {
    try {
      // Llamada pública sin token de autenticación
      const response = await axios.get(`${API_BASE_URL}/api/public/etapas`);

      const etapasData = response.data.etapas || [];
      setEtapas(etapasData);
      if (etapasData.length > 0) {
        setEtapaActiva(etapasData[0]);
      }
    } catch (error) {
      console.error("Error cargando etapas:", error);
      // Si no existe endpoint público, intentar con el privado
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tiempos/etapas`);
        const etapasData = response.data.etapas || [];
        setEtapas(etapasData);
        if (etapasData.length > 0) {
          setEtapaActiva(etapasData[0]);
        }
      } catch (secondError) {
        console.error("Error cargando etapas (segundo intento):", secondError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTiemposEtapa = async () => {
    if (!etapaActiva) return;

    setLoading(true);
    try {
      // Llamada pública para tiempos
      const response = await axios.get(
        `${API_BASE_URL}/api/public/etapas/${etapaActiva.id}/tiempos`
      );
      setTiempos(response.data.tiempos || []);

      // Llamada para estadísticas
      const statsResponse = await axios.get(
        `${API_BASE_URL}/api/public/etapas/${etapaActiva.id}/estadisticas`
      );
      setEstadisticas(statsResponse.data);
    } catch (error) {
      console.error("Error cargando tiempos:", error);
      // Fallback a endpoints privados
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/tiempos/etapas/${etapaActiva.id}/tiempos`
        );
        setTiempos(response.data.tiempos || []);

        const statsResponse = await axios.get(
          `${API_BASE_URL}/api/tiempos/etapas/${etapaActiva.id}/estadisticas`
        );
        setEstadisticas(statsResponse.data);
      } catch (secondError) {
        console.error("Error cargando tiempos (segundo intento):", secondError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchClasificacionGeneral = async () => {
    if (!categoriaActiva) return;

    setLoading(true);
    try {
      // Obtener TODOS los tiempos de TODAS las etapas para poder calcular correctamente
      const responseEtapa1 = await axios.get(
        `${API_BASE_URL}/api/public/etapas/1/tiempos`
      ).catch(() => ({ data: { tiempos: [] } }));
      
      const responseEtapa2 = await axios.get(
        `${API_BASE_URL}/api/public/etapas/2/tiempos`
      ).catch(() => ({ data: { tiempos: [] } }));

      // Si no funcionan los endpoints públicos, intentar con privados
      let todosLosTiempos = [
        ...(responseEtapa1.data.tiempos || []),
        ...(responseEtapa2.data.tiempos || [])
      ];

      // Si no hay datos, intentar con endpoints privados
      if (todosLosTiempos.length === 0) {
        try {
          const privada1 = await axios.get(
            `${API_BASE_URL}/api/tiempos/etapas/1/tiempos`
          ).catch(() => ({ data: { tiempos: [] } }));
          
          const privada2 = await axios.get(
            `${API_BASE_URL}/api/tiempos/etapas/2/tiempos`
          ).catch(() => ({ data: { tiempos: [] } }));

          todosLosTiempos = [
            ...(privada1.data.tiempos || []),
            ...(privada2.data.tiempos || [])
          ];
        } catch (secondError) {
          console.error("Error cargando tiempos (segundo intento):", secondError);
        }
      }

      // Calcular clasificación con la lógica correcta
      const clasificacionCalculada = calcularClasificacionGeneral(
        todosLosTiempos, 
        categoriaActiva.id
      );

      setClasificacion(clasificacionCalculada);

    } catch (error) {
      console.error("Error cargando clasificación:", error);
      setClasificacion([]);
    } finally {
      setLoading(false);
    }
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
        return (
          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-600">
            {position}
          </span>
        );
    }
  };

  if (loading && !etapas.length) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="text-center">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando resultados...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicHeader />

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Botón de regreso */}
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al inicio</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                Resultados de la Carrera
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Consulta los tiempos por etapa y la clasificación general de todos
              los participantes
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab("clasificacion")}
                className={`flex-1 px-4 py-4 sm:px-6 text-center font-medium transition-colors text-sm sm:text-base ${
                  activeTab === "clasificacion"
                    ? "border-b-2 border-yellow-500 text-yellow-600 bg-yellow-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">
                    Clasificación General
                  </span>
                  <span className="sm:hidden">Clasificación</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Contenido de Clasificación General */}
          {activeTab === "clasificacion" && (
            <>
              {/* Selector de Categorías */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Seleccionar Categoría
                </h2>

                {/* Desktop view */}
                <div className="hidden md:flex flex-wrap gap-3">
                  {categorias.map((categoria) => (
                    <button
                      key={categoria.id}
                      onClick={() => setCategoriaActiva(categoria)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        categoriaActiva?.id === categoria.id
                          ? "bg-yellow-500 text-white shadow-lg scale-105"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-102"
                      }`}
                    >
                      {categoria.nombre}
                    </button>
                  ))}
                </div>

                {/* Mobile view */}
                <div className="md:hidden relative">
                  <button
                    onClick={() =>
                      setShowCategoriasDropdown(!showCategoriasDropdown)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg font-medium"
                  >
                    <span className="text-sm">
                      {categoriaActiva
                        ? categoriaActiva.nombre
                        : "Seleccionar Categoría"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showCategoriasDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showCategoriasDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {categorias.map((categoria) => (
                        <button
                          key={categoria.id}
                          onClick={() => {
                            setCategoriaActiva(categoria);
                            setShowCategoriasDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                            categoriaActiva?.id === categoria.id
                              ? "bg-yellow-50 text-yellow-600"
                              : "text-gray-700"
                          }`}
                        >
                          {categoria.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Clasificación General */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Clasificación General - {categoriaActiva?.nombre}
                  </h3>
                  <p className="text-yellow-100 text-sm mt-1">
                    Tiempo total = Tiempo Ida + Tiempo Vuelta (5:00:00 si falta una etapa)
                  </p>
                </div>

                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse" />
                    <p>Cargando clasificación...</p>
                  </div>
                ) : clasificacion.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay clasificación disponible para esta categoría</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="md:hidden">
                      {clasificacion.map((participante, index) => {
                        const diferencia =
                          index === 0
                            ? 0
                            : participante.tiempo_total -
                              clasificacion[0].tiempo_total;
                        return (
                          <div
                            key={participante.participante_id}
                            className={`p-4 border-b ${
                              index < 3
                                ? "bg-gradient-to-r from-yellow-50 to-orange-50"
                                : "bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                {getPositionIcon(participante.posicion)}
                                <span className="font-bold text-lg">
                                  {participante.posicion}°
                                </span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                  #{participante.participantes?.dorsal}
                                </span>
                              </div>
                              <span className="font-mono text-xl font-bold text-gray-800">
                                {formatTime(participante.tiempo_total)}
                              </span>
                            </div>

                            <div className="mb-2">
                              <div className="font-semibold text-gray-900">
                                {participante.participantes?.nombre}{" "}
                                {participante.participantes?.apellidos}
                              </div>
                              <div className="text-sm text-gray-500">
                                CI: {participante.participantes?.ci}
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <div className="flex space-x-4">
                                <div className="text-green-600">
                                  Ida: {formatTime(participante.tiempo_etapa1)}
                                  {!participante.tiene_etapa1 && " (5:00:00)"}
                                </div>
                                <div className="text-blue-600">
                                  Vuelta: {formatTime(participante.tiempo_etapa2)}
                                  {!participante.tiene_etapa2 && " (5:00:00)"}
                                </div>
                              </div>
                              <div className="text-gray-600 font-medium">
                                {diferencia > 0
                                  ? `+${formatTime(diferencia)}`
                                  : "Líder"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Posición
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dorsal
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Participante
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tiempo Ida
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tiempo Vuelta
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tiempo Total
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Diferencia
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {clasificacion.map((participante, index) => {
                            const diferencia =
                              index === 0
                                ? 0
                                : participante.tiempo_total -
                                  clasificacion[0].tiempo_total;
                            return (
                              <tr
                                key={participante.participante_id}
                                className={`${
                                  index < 3
                                    ? "bg-gradient-to-r from-yellow-50 to-orange-50"
                                    : "bg-white"
                                } hover:bg-gray-50 transition-colors`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {getPositionIcon(participante.posicion)}
                                    <span className="ml-3 font-bold text-lg">
                                      {participante.posicion}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    #{participante.participantes?.dorsal}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {participante.participantes?.nombre}{" "}
                                      {participante.participantes?.apellidos}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      CI: {participante.participantes?.ci}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-green-700">
                                    <span className="font-mono font-bold">
                                      {formatTime(participante.tiempo_etapa1)}
                                    </span>
                                    {!participante.tiene_etapa1 && (
                                      <div className="text-xs text-red-500">
                                        Llego despues de una 1hr (+5:00:00)
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-blue-700">
                                    <span className="font-mono font-bold">
                                      {formatTime(participante.tiempo_etapa2)}
                                    </span>
                                    {!participante.tiene_etapa2 && (
                                      <div className="text-xs text-red-500">
                                        Llego despues de una 1hr (+5:00:00)
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="font-mono text-xl font-bold text-gray-800">
                                    {formatTime(participante.tiempo_total)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                                  {diferencia > 0
                                    ? `+${formatTime(diferencia)}`
                                    : "Líder"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PublicResultados;