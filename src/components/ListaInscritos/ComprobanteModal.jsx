import { useState, useEffect } from 'react';
import { X, Download, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:10000';

export default function ComprobanteModal({ 
  isOpen, 
  onClose, 
  comprobantePath, 
  participanteName 
}) {
  const [comprobanteUrl, setComprobanteUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    if (isOpen && comprobantePath) {
      fetchComprobanteUrl();
    }
  }, [isOpen, comprobantePath]);

  const fetchComprobanteUrl = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/inscripciones/archivo/${encodeURIComponent(comprobantePath)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const url = response.data.url;
      setComprobanteUrl(url);
      
      // Determinar el tipo de archivo por la extensión
      const extension = comprobantePath.toLowerCase().split('.').pop();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        setFileType('image');
      } else if (extension === 'pdf') {
        setFileType('pdf');
      } else {
        setFileType('unknown');
      }
      
    } catch (err) {
      console.error('Error obteniendo URL del comprobante:', err);
      setError('No se pudo cargar el comprobante');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (comprobanteUrl) {
      const link = document.createElement('a');
      link.href = comprobanteUrl;
      link.download = comprobantePath.split('/').pop();
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
          <p className="text-sm sm:text-base text-gray-600">Cargando comprobante...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4">
          <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" />
          <p className="text-sm sm:text-base text-red-600 text-center px-4">{error}</p>
          <button
            onClick={fetchComprobanteUrl}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (!comprobanteUrl) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4">
          <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
          <p className="text-sm sm:text-base text-gray-600">No hay comprobante disponible</p>
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <div className="flex justify-center p-2">
            <img
              src={comprobanteUrl}
              alt="Comprobante"
              className="max-w-full max-h-[50vh] sm:max-h-[70vh] object-contain rounded-lg shadow-lg"
              onError={() => setError('Error al cargar la imagen')}
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="w-full h-[50vh] sm:h-[70vh]">
            <iframe
              src={comprobanteUrl}
              className="w-full h-full border-0 rounded-lg"
              title="Comprobante PDF"
              onError={() => setError('Error al cargar el PDF')}
            />
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4">
            <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
            <p className="text-sm sm:text-base text-gray-600 text-center">Tipo de archivo no soportado para vista previa</p>
            <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
              Archivo: {comprobantePath.split('/').pop()}
            </p>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span>Descargar archivo</span>
            </button>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b bg-gray-50 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {fileType === 'image' ? (
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                Comprobante de Pago
              </h2>
              {participanteName && (
                <p className="text-xs sm:text-sm text-gray-600 truncate">{participanteName}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {comprobanteUrl && !loading && !error && (
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs sm:text-sm"
                title="Descargar comprobante"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Descargar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="Cerrar"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(95vh-140px)]">
          {renderContent()}
        </div>

        {/* Footer */}
        {comprobantePath && !loading && !error && (
          <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t">
            <p className="text-xs text-gray-500 truncate">
              Archivo: {comprobantePath.split('/').pop()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}