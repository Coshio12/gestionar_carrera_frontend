import React from "react";

export default function SobreCarrera() {
  return (
    <section id="sobre-carrera" className="py-8 sm:py-10 md:py-12 px-4 bg-white rounded-lg mb-6 sm:mb-8">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-4 sm:mb-6">
          ¿Qué es la Carrera Chaguaya?
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6 px-2">
          Es una travesía en bicicleta que mezcla la devoción con la aventura, recorriendo paisajes únicos del sur de Bolivia.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8 text-left">
          <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-3">
              🚴‍♂️ La Experiencia
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              Un recorrido de 65 km que conecta la ciudad de Tarija con el histórico Santuario de Chaguaya, 
              pasando por hermosos paisajes andinos y comunidades locales.
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-3">
              🏆 Más que una Carrera
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              Es una celebración de la fe, el deporte y la cultura tarijeña. Una oportunidad única 
              de vivir una experiencia deportiva con profundo significado espiritual.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}