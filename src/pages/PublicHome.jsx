import React from "react";
import PublicHeader from "../components/Landing/PublicHeader";
import Hero from "../sections/Hero";
import SobreCarrera from "../sections/SobreCarrera";
import Recorrido from "../sections/Recorrido";
import InscripcionDestacada from "../sections/InscripcionDestacada";
import Footer from "../components/Landing/Footer";
import GaleriaCarrera from "../sections/GaleriaCarrera";
import Patrocinios from "../sections/Patrocinios";

import Tarija from "../assets/tarija.jpg";

export default function PublicHome() {
  return (
    <>
      <PublicHeader />
      <Hero />
      
      <div
        className="bg-cover bg-center bg-no-repeat py-8 sm:py-12 md:py-16"
        style={{
          backgroundImage: `url(${Tarija})`,
        }}
      >
        {/* Overlay mejorado con mejor padding responsive */}
        <div className="bg-black/50 p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl max-w-7xl mx-auto">
          <SobreCarrera />
          <Recorrido />
          <GaleriaCarrera/>
        </div>
      </div>
      
      <InscripcionDestacada />
      <Patrocinios />
      <Footer />
    </>
  );
}