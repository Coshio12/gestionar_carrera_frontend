import React from 'react';
import { Clock, Users, Trophy, Target, TrendingUp } from 'lucide-react';

const EstadisticasTiempos = ({ estadisticas }) => {
  const formatTime = (timeMs) => {
    if (!timeMs || timeMs < 0) return '00:00.00';
    
    const hours = Math.floor(timeMs / 3600000);
    const minutes = Math.floor((timeMs % 3600000) / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const centiseconds = Math.floor((timeMs % 1000) / 10);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  if (!estadisticas) {
    return null;
  }

  const estadisticasData = [
    {
      id: 'total',
      title: 'Total Registros',
      value: estadisticas.total_tiempos || 0,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      id: 'mejor',
      title: 'Mejor Tiempo',
      value: formatTime(estadisticas.mejor_tiempo),
      icon: Trophy,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'promedio',
      title: 'Tiempo Promedio',
      value: formatTime(estadisticas.tiempo_promedio),
      icon: Target,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      iconColor: 'text-green-600'
    },
    {
      id: 'peor',
      title: 'Tiempo Más Alto',
      value: formatTime(estadisticas.peor_tiempo),
      icon: TrendingUp,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {estadisticasData.map((stat) => {
        const IconComponent = stat.icon;
        
        return (
          <div
            key={stat.id}
            className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className={`${stat.bgColor} p-2 rounded-lg inline-block mb-2 sm:mb-3`}>
                  <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.iconColor}`} />
                </div>
                
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                  {stat.value}
                </div>
                
                <div className="text-xs sm:text-sm text-gray-600 mt-1 leading-tight">
                  {stat.title}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EstadisticasTiempos;