import { useCallback } from "react";

export const useTimeCalculations = () => {
  // Convertir hora HH:MM:SS a minutos desde medianoche
  const timeToMinutes = useCallback((timeString) => {
    if (!timeString) return 0;
    const [hours, minutes, seconds = 0] = timeString.split(":").map(Number);
    return hours * 60 + minutes + seconds / 60;
  }, []);

  // Calcular diferencia de salida en milisegundos entre dos horas
  const calcularDiferenciaSalida = useCallback(
    (horaSalidaCategoria, horaSalidaBase) => {
      const minutosCategoria = timeToMinutes(horaSalidaCategoria);
      const minutosBase = timeToMinutes(horaSalidaBase);
      return (minutosCategoria - minutosBase) * 60 * 1000;
    },
    [timeToMinutes]
  );

  return {
    timeToMinutes,
    calcularDiferenciaSalida,
  };
};