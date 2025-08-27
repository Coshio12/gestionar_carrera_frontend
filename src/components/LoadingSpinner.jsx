import React from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "./Sidebar";

const LoadingSpinner = ({ 
  message = "Cargando...", 
  subMessage = "", 
  showSidebar = false,
  className = ""
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center min-h-96 px-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 max-w-md w-full mx-auto">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner animado */}
          <div className="relative">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-lime-600 animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
          </div>
          
          {/* Mensaje principal */}
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {message}
            </h3>
            {subMessage && (
              <p className="text-xs sm:text-sm text-gray-600">
                {subMessage}
              </p>
            )}
          </div>
          
          {/* Barra de progreso animada */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-lime-600 h-2 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showSidebar) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:ml-0">
          {content}
        </main>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;