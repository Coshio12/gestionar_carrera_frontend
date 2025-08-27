import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import img1 from "../assets/recorrido/Ida1erSegmento.png"
import img2 from "../assets/recorrido/Ida2doSegmento.png"
import img3 from "../assets/recorrido/Vuelta1erSegmento.png"
import img4 from "../assets/recorrido/Vuelta2doSegmento.png"

export default function Recorrido() {
  const imagenes = [img1, img2, img3, img4];

  const handleDownloadPDF = () => {
    const pdfUrl = "public/pdfs/CARRERA-CICLISTA-2025.pdf";
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Convocatoria-San-Roque-Chaguaya.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="recorrido" className="py-8 sm:py-10 md:py-12 px-4 bg-white rounded-lg mb-6 sm:mb-8">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-700 mb-6 sm:mb-8">
          📍 Recorrido de la Carrera
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Información del recorrido */}
          <div className="order-2 lg:order-1">
            <h4 className="text-lg sm:text-xl font-semibold text-green-600 mb-4">
              Ruta Completa
            </h4>
            
            <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
              El recorrido abarca <strong>60 km IDA</strong> y <strong>65 km VUELTA</strong> desde la Iglesia San Roque en
              Tarija hasta el Santuario de Chaguaya, pasando por
              comunidades locales.
            </p>
            
            <div className="bg-green-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
              <h5 className="font-semibold text-green-700 mb-3 text-base sm:text-lg">
                Puntos Destacados:
              </h5>
              <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <span>🏛</span> 
                  <span><strong>Salida:</strong> Iglesia San Roque</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>⛪</span> 
                  <span><strong>Meta:</strong> Santuario de Chaguaya</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🏔️</span> 
                  <span><strong>Paisajes:</strong> Valles y montañas andinas</span>
                </li>
              </ul>
            </div>

            {/* Descarga PDF responsive */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg shadow-md">
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="text-center">
                  <h6 className="text-base sm:text-lg font-bold text-green-700 mb-1 sm:mb-2">
                    📄 Convocatoria Oficial
                  </h6>
                  <p className="text-xs sm:text-sm text-gray-600 px-2">
                    Descarga el documento completo con todas las bases y reglamentos
                  </p>
                </div>
                
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm sm:text-base rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 hover:shadow-xl w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Descargar PDF
                </button>
                
                <div className="flex flex-wrap items-center justify-center text-xs text-gray-500 gap-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                    Formato PDF
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2C5.582 2 2 5.582 2 10s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                    ~2MB
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carrusel de imágenes responsive */}
          <div className="text-center order-1 lg:order-2">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              className="shadow-xl overflow-hidden rounded-lg"
            >
              {imagenes.map((src, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center">
                  <img
                    src={src}
                    alt={`Recorrido ${index + 1}`}
                    className="object-contain h-48 sm:h-64 md:h-80 lg:h-96 w-full mx-auto border-4 border-white shadow-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Mapa ilustrativo del recorrido
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}