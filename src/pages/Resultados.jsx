import React, { useState, useEffect } from 'react';
import { Trophy, Clock, BarChart3, Medal, Users, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useTiempo } from '../hooks/useTiempo';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:10000';

const Resultados = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [etapaActiva, setEtapaActiva] = useState(null);
  const [tiempos, setTiempos] = useState([]);
  const [clasificacion, setClasificacion] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tiempos');
  const [showEtapasDropdown, setShowEtapasDropdown] = useState(false);
  const [showCategoriasDropdown, setShowCategoriasDropdown] = useState(false);

  const { formatTime, fetchTiemposByEtapa, fetchClasificacion, fetchEstadisticasEtapa } = useTiempo();

  useEffect(() => {
    fetchCategorias();
    fetchEtapas();
  }, []);

  useEffect(() => {
    if (activeTab === 'tiempos' && etapaActiva) {
      fetchTiemposEtapa();
    } else if (activeTab === 'clasificacion' && categoriaActiva) {
      fetchClasificacionGeneral();
    }
  }, [etapaActiva, categoriaActiva, activeTab]);

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/inscripciones/categorias`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const categoriasData = response.data.categorias || [];
      setCategorias(categoriasData);
      if (categoriasData.length > 0) {
        setCategoriaActiva(categoriasData[0]);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const fetchEtapas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/etapas`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const etapasData = response.data.etapas || [];
      setEtapas(etapasData);
      if (etapasData.length > 0) {
        setEtapaActiva(etapasData[0]);
      }
    } catch (error) {
      console.error('Error cargando etapas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTiemposEtapa = async () => {
    if (!etapaActiva) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/etapas/${etapaActiva.id}/tiempos`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setTiempos(response.data.tiempos || []);
      
      const statsResponse = await axios.get(
        `${API_BASE_URL}/api/tiempos/etapas/${etapaActiva.id}/estadisticas`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setEstadisticas(statsResponse.data);
    } catch (error) {
      console.error('Error cargando tiempos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasificacionGeneral = async () => {
    if (!categoriaActiva) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/clasificacion/${categoriaActiva.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setClasificacion(response.data.clasificacion || []);
    } catch (error) {
      console.error('Error cargando clasificación:', error);
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
        return <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-600">{position}</span>;
    }
  };

  if (loading && !etapas.length) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando resultados...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 bg-white p-3 sm:p-4 rounded-lg shadow">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Resultados</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-4 sm:mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab('tiempos')}
                className={`flex-1 px-3 py-3 sm:px-6 sm:py-4 text-center font-medium transition-colors text-sm sm:text-base ${
                  activeTab === 'tiempos'
                    ? 'border-b-2 border-lime-500 text-lime-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Tiempos por Etapa</span>
                  <span className="sm:hidden">Tiempos</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('clasificacion')}
                className={`flex-1 px-3 py-3 sm:px-6 sm:py-4 text-center font-medium transition-colors text-sm sm:text-base ${
                  activeTab === 'clasificacion'
                    ? 'border-b-2 border-yellow-500 text-yellow-600 bg-yellow-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Clasificación General</span>
                  <span className="sm:hidden">Clasificación</span>
                </div>
              </button>
            </div>
          </div>

          {/* Contenido de Tiempos por Etapa */}
          {activeTab === 'tiempos' && (
            <>
              {/* Selector de Etapas */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-lime-500" />
                  Seleccionar Etapa
                </h2>
                
                {/* Desktop view */}
                <div className="hidden md:flex flex-wrap gap-3">
                  {etapas.map((etapa) => (
                    <button
                      key={etapa.id}
                      onClick={() => setEtapaActiva(etapa)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                        etapaActiva?.id === etapa.id
                          ? 'bg-lime-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <div>Etapa {etapa.numero_etapa}: {etapa.nombre}</div>
                      <div className="text-xs opacity-75">
                        {etapa.categorias?.nombre}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Mobile view */}
                <div className="md:hidden relative">
                  <button
                    onClick={() => setShowEtapasDropdown(!showEtapasDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg font-medium"
                  >
                    <span className="text-sm">
                      {etapaActiva ? `Etapa ${etapaActiva.numero_etapa}: ${etapaActiva.nombre}` : 'Seleccionar Etapa'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showEtapasDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showEtapasDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {etapas.map((etapa) => (
                        <button
                          key={etapa.id}
                          onClick={() => {
                            setEtapaActiva(etapa);
                            setShowEtapasDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                            etapaActiva?.id === etapa.id ? 'bg-lime-50 text-lime-600' : 'text-gray-700'
                          }`}
                        >
                          <div>Etapa {etapa.numero_etapa}: {etapa.nombre}</div>
                          <div className="text-xs opacity-75">{etapa.categorias?.nombre}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Estadísticas de la Etapa */}
              {estadisticas && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-lime-500 mx-auto mb-2" />
                    <div className="text-lg sm:text-2xl font-bold text-gray-800">{estadisticas.total_participantes}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Participantes</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-lg sm:text-2xl font-bold text-gray-800">{formatTime(estadisticas.tiempo_mejor)}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Mejor Tiempo</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 mx-auto mb-2" />
                    <div className="text-lg sm:text-2xl font-bold text-gray-800">{formatTime(estadisticas.tiempo_promedio)}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Tiempo Promedio</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-lg sm:text-2xl font-bold text-gray-800">{formatTime(estadisticas.tiempo_peor)}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Tiempo Más Alto</div>
                  </div>
                </div>
              )}

              {/* Tabla de Tiempos */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 border-b">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Resultados - {etapaActiva?.nombre} (Etapa {etapaActiva?.numero_etapa})
                  </h3>
                </div>
                
                {loading ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500">Cargando tiempos...</div>
                ) : tiempos.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500">
                    <Clock className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay tiempos registrados para esta etapa</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="md:hidden">
                      <Sidebar />
                      {tiempos.map((tiempo, index) => {
                        const diferencia = index === 0 ? 0 : tiempo.tiempo_final - tiempos[0].tiempo_final;
                        return (
                          <div key={tiempo.id} className={`p-4 border-b ${index < 3 ? 'bg-yellow-50' : 'bg-white'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getPositionIcon(tiempo.posicion)}
                                <span className="font-semibold text-lg">{tiempo.posicion}</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                  {tiempo.participantes?.dorsal}
                                </span>
                              </div>
                              <span className="font-mono text-lg font-bold">
                                {formatTime(tiempo.tiempo_final)}
                              </span>
                            </div>
                            
                            <div className="mb-1">
                              <div className="font-medium text-gray-900">
                                {tiempo.participantes?.nombre} {tiempo.participantes?.apellidos}
                              </div>
                              <div className="text-sm text-gray-500">CI: {tiempo.participantes?.ci}</div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                              {tiempo.penalizacion > 0 && (
                                <div className="text-red-600">
                                  +{formatTime(tiempo.penalizacion)} penalización
                                </div>
                              )}
                              <div className="text-gray-600 ml-auto">
                                {diferencia > 0 ? `+${formatTime(diferencia)}` : '-'}
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dorsal</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participante</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diferencia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {tiempos.map((tiempo, index) => {
                            const diferencia = index === 0 ? 0 : tiempo.tiempo_final - tiempos[0].tiempo_final;
                            return (
                              <tr key={tiempo.id} className={index < 3 ? 'bg-yellow-50' : 'bg-white'}>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {getPositionIcon(tiempo.posicion)}
                                    <span className="ml-2 font-semibold">{tiempo.posicion}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    {tiempo.participantes?.dorsal}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {tiempo.participantes?.nombre} {tiempo.participantes?.apellidos}
                                    </div>
                                    <div className="text-sm text-gray-500">CI: {tiempo.participantes?.ci}</div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="font-mono text-lg font-bold">
                                    {formatTime(tiempo.tiempo_final)}
                                  </span>
                                  {tiempo.penalizacion > 0 && (
                                    <div className="text-xs text-red-600">
                                      +{formatTime(tiempo.penalizacion)} penalización
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                                  {diferencia > 0 ? `+${formatTime(diferencia)}` : '-'}
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

          {/* Contenido de Clasificación General */}
          {activeTab === 'clasificacion' && (
            <>
              {/* Selector de Categorías */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
                  Seleccionar Categoría
                </h2>
                
                {/* Desktop view */}
                <div className="hidden md:flex flex-wrap gap-3">
                  {categorias.map((categoria) => (
                    <button
                      key={categoria.id}
                      onClick={() => setCategoriaActiva(categoria)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        categoriaActiva?.id === categoria.id
                          ? 'bg-yellow-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {categoria.nombre}
                    </button>
                  ))}
                </div>

                {/* Mobile view */}
                <div className="md:hidden relative">
                  <button
                    onClick={() => setShowCategoriasDropdown(!showCategoriasDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg font-medium"
                  >
                    <span className="text-sm">
                      {categoriaActiva ? categoriaActiva.nombre : 'Seleccionar Categoría'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showCategoriasDropdown ? 'rotate-180' : ''}`} />
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
                            categoriaActiva?.id === categoria.id ? 'bg-yellow-50 text-yellow-600' : 'text-gray-700'
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
                <div className="p-4 sm:p-6 border-b">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Clasificación General - {categoriaActiva?.nombre}
                  </h3>
                </div>
                
                {loading ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500">Cargando clasificación...</div>
                ) : clasificacion.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500">
                    <Trophy className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay clasificación disponible para esta categoría</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="md:hidden">
                      {clasificacion.map((participante, index) => {
                        const diferencia = index === 0 ? 0 : participante.tiempo_total - clasificacion[0].tiempo_total;
                        return (
                          <div key={participante.participante_id} className={`p-4 border-b ${index < 3 ? 'bg-yellow-50' : 'bg-white'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getPositionIcon(participante.posicion)}
                                <span className="font-semibold text-lg">{participante.posicion}</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                  {participante.participantes?.dorsal}
                                </span>
                              </div>
                              <span className="font-mono text-lg font-bold">
                                {formatTime(participante.tiempo_total)}
                              </span>
                            </div>
                            
                            <div className="mb-1">
                              <div className="font-medium text-gray-900">
                                {participante.participantes?.nombre} {participante.participantes?.apellidos}
                              </div>
                              <div className="text-sm text-gray-500">CI: {participante.participantes?.ci}</div>
                            </div>
                            
                            <div className="text-sm text-gray-600 text-right">
                              {diferencia > 0 ? `+${formatTime(diferencia)}` : '-'}
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dorsal</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participante</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diferencia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {clasificacion.map((participante, index) => {
                            const diferencia = index === 0 ? 0 : participante.tiempo_total - clasificacion[0].tiempo_total;
                            return (
                              <tr key={participante.participante_id} className={index < 3 ? 'bg-yellow-50' : 'bg-white'}>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {getPositionIcon(participante.posicion)}
                                    <span className="ml-2 font-semibold">{participante.posicion}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    {participante.participantes?.dorsal}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {participante.participantes?.nombre} {participante.participantes?.apellidos}
                                    </div>
                                    <div className="text-sm text-gray-500">CI: {participante.participantes?.ci}</div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="font-mono text-lg font-bold">
                                    {formatTime(participante.tiempo_total)}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                                  {diferencia > 0 ? `+${formatTime(diferencia)}` : '-'}
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
      </main>
    </div>
  );
};

export default Resultados;