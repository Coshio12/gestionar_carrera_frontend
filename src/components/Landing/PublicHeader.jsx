import React, { useState } from "react";
import { Menu, X, Settings, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

import Icon from "../../assets/race-flag.png";

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const menuItems = [
    { name: "Inicio", link: "#inicio" },
    { name: "Significado", link: "#sobre-carrera" },
    { name: "Recorrido", link: "#recorrido" },
    { name: "Galería", link: "#galeria" },
    { name: "Inscripción", link: "#inscripcion" },
  ];

  return (
    <header className="bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 shadow-lg p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={Icon}
            alt="Logo Bicicleta"
            className="w-10 h-10 animate-pulse"
          />
          <h1 className="text-white text-2xl font-bold tracking-wide drop-shadow-md">
            TotalSport360 | SanRoque - Chaguaya -SanRoque |
          </h1>
        </div>

        {/* Botón hamburguesa */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Navegación en pantallas grandes */}
        <nav className="hidden md:flex gap-6 items-center">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="text-white font-medium text-lg hover:text-yellow-100 hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              {item.name}
            </a>
          ))}

          {/* Botón de Resultados */}
          <Link
            to="/resultados-publicos"
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-yellow-600 hover:scale-105 transition duration-300 flex items-center gap-2"
          >
            <Trophy size={18} />
            Resultados
          </Link>

          {/* Botón de acceso al sistema administrativo */}
          <Link
            to="/login"
            className="bg-white text-green-600 font-bold py-2 px-4 rounded-full shadow-md hover:bg-green-100 hover:scale-105 transition duration-300 flex items-center gap-2"
          >
            <Settings size={18} />
            Admin
          </Link>
        </nav>
        
      </div>

      {/* Menú colapsable móvil */}
      {menuOpen && (
        <div className="mt-4 flex flex-col gap-4 md:hidden bg-white p-4 rounded-lg shadow-md">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="text-green-700 font-semibold text-base hover:text-lime-600 transition"
              onClick={toggleMenu}
            >
              {item.name}
            </a>
          ))}

          {/* Botón de Resultados en móvil */}
          <Link
            to="/resultados-publicos"
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-yellow-600 transition duration-300 flex items-center justify-center gap-2 mt-2"
            onClick={toggleMenu}
          >
            <Trophy size={18} />
            Ver Resultados
          </Link>

          {/* Botón de acceso admin en móvil */}
          <Link
            to="/login"
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2 mt-2"
            onClick={toggleMenu}
          >
            <Settings size={18} />
            Acceso Administrativo
          </Link>
        </div>
      )}
    </header>
  );
}