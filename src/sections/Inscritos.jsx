import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Shield } from "lucide-react";

export default function InscripcionDestacada() {
  const handleDownloadPDFDamas = () => {
    const pdfUrl = "/pdfs/Lista DAMAS 2025.pdf"; // desde public
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Lista DAMAS 2025.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDFFederados = () => {
    const pdfUrl = "/pdfs/Lista FEDERADOS 2025.pdf"; // desde public
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Lista FEDERADOS 2025.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDFCampesinos = () => {
    const pdfUrl = "/pdfs/Lista CAMPESINOS 2025.pdf"; // desde public
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Lista CAMPESINOS 2025.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDFMasters = () => {
    const pdfUrl = "/pdfs/Lista MASTERS 2025.pdf"; // desde public
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Lista MASTERS 2025.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <section
      id="inscripcion"
      className="py-12 sm:py-16 px-4 bg-gradient-to-r from-yellow-100 to-green-100"
    >
      <div className="max-w-screen-xl mx-auto text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-green-800">
          ¡Listas de todos los Inscritos por categoria!
        </h3>

        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-700 max-w-3xl mx-auto px-4">
          Mira a todos los participantes de la carrera.
        </p>

        {/* Grid de beneficios responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h4 className="font-bold text-base sm:text-lg mb-2">
              Lista de inscritos categoria DAMAS
            </h4>
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-m mb-2">
              Todos los registrados de la lista de inscritos de DAMAS    de la carrera San Roque Chaguaya 2025
            </h3>
            <button
              onClick={handleDownloadPDFDamas}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm sm:text-base rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Descargar PDF
            </button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h4 className="font-bold text-base sm:text-lg mb-2">
              Lista de inscritos categoria FEDERADOS
            </h4>
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-m mb-2">
              Todos los registrados de la lista de inscritos de FEDERADOS de la carrera San Roque Chaguaya 2025
            </h3>
            <button
              onClick={handleDownloadPDFFederados}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm sm:text-base rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Descargar PDF
            </button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h4 className="font-bold text-base sm:text-lg mb-2">
              Lista de inscritos categoria CAMPESINOS
            </h4>
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-m mb-2">
              Todos los registrados de la lista de inscritos de CAMPESINOS de la carrera San Roque Chaguaya 2025
            </h3>
            <button
              onClick={handleDownloadPDFCampesinos}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm sm:text-base rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Descargar PDF
            </button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h4 className="font-bold text-base sm:text-lg mb-2">
              Lista de inscritos categoria MASTERS
            </h4>
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-m mb-2">
              Todos los registrados de la lista de inscritos de MASTERS de la carrera San Roque Chaguaya 2025
            </h3>
            <button
              onClick={handleDownloadPDFMasters}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm sm:text-base rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
