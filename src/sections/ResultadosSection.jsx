import React, { useState, useEffect } from 'react';
import { Trophy, Clock, BarChart3, ExternalLink, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicResultados } from '../hooks/usePublicResultados';

const ResultadosSection = () => {
  const [resumen, setResumen] = useState(null);
  const { fetchResumenResultados, checkResultadosDisponibles, loading } = usePublicResultados();

  useEffect(() => {
    const loadResumen = async () => {
      const disponibles = await checkResultadosDisponibles();
      if (disponibles) {
        const resumenData = await fetchResumenResultados();
        if (resumenData.success) {
          setResumen(resumenData.data);
        }
      }
    };

    loadResumen();
  }, [checkResultadosDisponibles, fetchResumenResultados]);

  // No mostrar la sección si no hay resultados disponibles
  if (!resumen || !resumen.hay_resultados) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            <span>Resultados Disponibles</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Consulta los Resultados
          </h2>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Ya puedes ver los tiempos de cada etapa y la clasificación general de todos los participantes
          </p>
        </div>

        {/* Tarjeta Principal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-8 text-center">
            <Trophy className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Resultados Oficiales
            </h3>
            <p className="text-yellow-100">
              Tiempos actualizados en tiempo real
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {resumen.total_etapas || 0}
                </div>
                <div className="text-sm text-gray-600">Etapas</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {resumen.total_categorias || 0}
                </div>
                <div className="text-sm text-gray-600">Categorías</div>
              </div>
              
            </div>

            {/* Opciones de resultados */}
            <div className="space-y-4 mb-6">

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Clasificación General</h4>
                    <p className="text-sm text-gray-600">Ranking completo por categorías</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón principal */}
            <div className="text-center">
              <Link
                to="/resultados-publicos"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Trophy className="w-6 h-6" />
                <span>Ver Resultados Completos</span>
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultadosSection;