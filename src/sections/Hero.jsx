import React, { useEffect, useState } from "react";

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const raceDate = new Date("2025-09-14T00:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const difference = raceDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="inicio"
      className="relative bg-gradient-to-r from-green-800 via-green-600 to-green-400 min-h-[350px] sm:min-h-[400px] md:h-[500px] text-white flex items-center justify-center px-4"
    >
      <div className="bg-black/60 p-4 sm:p-6 md:p-8 rounded-xl text-center max-w-4xl w-full mx-auto">
        {/* Título responsive */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 animate-fade-in">
          ¡Bienvenidos a la Carrera Chaguaya!
        </h2>
        
        {/* Subtítulo responsive */}
        <p className="text-lg sm:text-xl md:text-2xl mb-6">
          Pedalea por la devoción y la aventura en Tarija.
        </p>

        {/* Contador responsive */}
        <div className="bg-yellow-400 text-green-900 px-4 sm:px-6 md:px-8 py-3 md:py-4 mb-6 rounded-full text-base sm:text-lg md:text-xl font-semibold shadow-lg inline-block animate-bounce max-w-full">
          {timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <span>¡Faltan</span>
              <span className="flex flex-wrap justify-center gap-1 sm:gap-2">
                <span className="font-bold">{timeLeft.days}</span> días,
                <span className="font-bold">{timeLeft.hours}</span> horas y
                <span className="font-bold">{timeLeft.minutes}</span> minutos
              </span>
              <span>para la carrera!</span>
            </div>
          ) : (
            "¡La carrera ha comenzado o ha finalizado!"
          )}
        </div>

        {/* Grid de información responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="bg-white/20 p-3 sm:p-4 rounded-lg">
            <h3 className="font-bold text-base sm:text-lg">📅 Fecha</h3>
            <p className="text-sm sm:text-base">14 de Septiembre 2025</p>
          </div>
          <div className="bg-white/20 p-3 sm:p-4 rounded-lg">
            <h3 className="font-bold text-base sm:text-lg">📍 Distancia</h3>
            <p className="text-sm sm:text-base">60 Kilómetros IDA | 65 kilimetros VUELTA</p>
          </div>
          <div className="bg-white/20 p-3 sm:p-4 rounded-lg sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-base sm:text-lg">🚴‍♂️ Modalidad</h3>
            <p className="text-sm sm:text-base">Ciclismo de Ruta</p>
          </div>
        </div>
      </div>
    </section>
  );
}