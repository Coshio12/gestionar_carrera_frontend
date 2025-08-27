import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Check, 
  X, 
  RefreshCw, 
  Clock, 
  Users, 
  Trophy,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

const PersistenceStatus = ({ 
  etapas, 
  participantes, 
  categorias, 
  lapTimes, 
  isRunning, 
  lastUpdate,
  onRefresh,
  isRefreshing 
}) => {
  const [storageUsed, setStorageUsed] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);

  // Calcular uso de localStorage
  useEffect(() => {
    try {
      let totalSize = 0;
      const keys = [
        'cronometro_state',
        'control_tiempo_etapas',
        'control_tiempo_participantes',
        'control_tiempo_categorias',
        'control_tiempo_hora_salida_base',
        'control_tiempo_categoria_filtro',
        'control_tiempo_last_update',
        'control_tiempo_ui_state'
      ];

      keys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      });

      setStorageUsed(totalSize);
    } catch (error) {
      console.error('Error calculando uso de storage:', error);
    }
  }, [etapas, participantes, categorias, lapTimes]);

  // Monitorear estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Formatear tamaño en bytes
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Formatear tiempo desde última actualización
  const formatTimeSince = (timestamp) => {
    if (!timestamp) return 'Nunca';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `hace ${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `hace ${minutes}m`;
    } else {
      return 'ahora mismo';
    }
  };

  // Determinar color del indicador basado en el estado
  const getStatusColor = () => {
    if (!isOnline) return 'bg-orange-500';
    if (isRunning) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Sin conexión - Datos seguros localmente';
    if (isRunning) return 'Cronómetro activo - Guardando automáticamente';
    return 'Sistema listo - Datos persistentes';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header compacto */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Database className="w-5 h-5 text-gray-600" />
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor()} rounded-full animate-pulse`}></div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Estado de Persistencia
            </span>
            <span className="text-xs text-gray-500">
              {getStatusText()}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Indicador de conexión */}
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-orange-500" />
          )}

          {/* Botón de refresh */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefresh && onRefresh();
            }}
            disabled={isRefreshing}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Indicador de expansión */}
          <div className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {/* Detalles expandibles */}
      {showDetails && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          {/* Estadísticas de datos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <div>
                <div className="text-sm font-medium">{etapas.length}</div>
                <div className="text-xs text-gray-500">Etapas</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">{participantes.length}</div>
                <div className="text-xs text-gray-500">Participantes</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium">{lapTimes.length}</div>
                <div className="text-xs text-gray-500">Tiempos</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-sm font-medium">{formatBytes(storageUsed)}</div>
                <div className="text-xs text-gray-500">Almacenado</div>
              </div>
            </div>
          </div>

          {/* Estado de sincronización */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              <span className="text-sm text-gray-700">
                {isOnline ? 'Conectado al servidor' : 'Modo sin conexión'}
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              Actualizado {formatTimeSince(lastUpdate)}
            </div>
          </div>

          {/* Características de persistencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">Cronómetro se mantiene al recargar</span>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">Tiempos guardados localmente</span>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">Datos sincronizados entre pestañas</span>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">Filtros y preferencias guardadas</span>
            </div>
          </div>

          {/* Advertencias si es necesario */}
          {!isOnline && (
            <div className="flex items-start space-x-2 p-3 bg-orange-50 border border-orange-200 rounded">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                <div className="font-medium">Sin conexión a internet</div>
                <div className="text-xs mt-1">
                  Los datos se guardan localmente y se sincronizarán cuando se restaure la conexión.
                  El cronómetro y todas las funciones siguen disponibles.
                </div>
              </div>
            </div>
          )}

          {/* Información técnica para desarrolladores */}
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t border-gray-200 pt-3">
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Claves de localStorage:</strong></div>
                <div className="ml-2 font-mono text-xs">
                  cronometro_state, control_tiempo_*, control_tiempo_ui_state
                </div>
                <div><strong>Actualización automática:</strong> Cada 5 minutos o al interactuar</div>
                <div><strong>Broadcast:</strong> Supabase realtime para sincronización</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersistenceStatus;