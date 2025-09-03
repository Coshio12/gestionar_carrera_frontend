import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Shield } from "lucide-react";

export default function InscripcionDestacada() {
  return (
    <section id="inscripcion" className="py-12 sm:py-16 px-4 bg-gradient-to-r from-yellow-100 to-green-100">
      <div className="max-w-screen-xl mx-auto text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-green-800">
          ¡Inscripciones Abiertas!
        </h3>
        
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-700 max-w-3xl mx-auto px-4">
          Participa en una experiencia inolvidable. Te puedes registrar hasta el viernes 12 de septiembre a las 19:00pm Bolivia.
          Incluye kit del corredor.
        </p>

        {/* Grid de beneficios responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h4 className="font-bold text-base sm:text-lg mb-2">Fecha Confirmada</h4>
            <p className="text-gray-600 text-sm sm:text-base">13 de Septiembre 2025</p>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h4 className="font-bold text-base sm:text-lg mb-2">Kit Incluido</h4>
            <p className="text-gray-600 text-sm sm:text-base">Dorsal y más</p>
          </div>
          
        </div>

        {/* Botón principal responsive */}
        <Link
          to="/inscripcion"
          className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg sm:text-xl py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:from-green-700 hover:to-green-600 transform hover:scale-105 transition-all duration-300 mx-4"
        >
          ¡Inscríbete Ahora!
        </Link>

        {/* Información adicional */}
        <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-600 px-4">
          <p>
            <strong>Proceso rápido y seguro.</strong> Tu inscripción se confirma inmediatamente tras el pago.
          </p>
        </div>
      </div>
    </section>
  );
}