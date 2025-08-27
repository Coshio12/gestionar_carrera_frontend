import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ClipboardList, 
  Clock, 
  Trophy, 
  ListChecks, 
  UserPlus, 
  LogOut, 
  Bike, 
  FilterX,
  Menu,
  X,
  GaugeCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CronometroSidebar } from './CronometroDisplay';

const navItems = [
  { name: 'Inicio', path: '/admin', icon: Home },
  { name: 'Categorías', path: '/categorias', icon: FilterX },
  { name: 'Etapas', path: '/etapas', icon: GaugeCircle },
  { name: 'Inscripciones', path: '/inscripciones', icon: UserPlus },
  { name: 'Lista de Inscritos', path: '/lista-inscritos', icon: ClipboardList },
  { name: 'Lista de Tiempos', path: '/lista-tiempos', icon: Trophy },
  { name: 'Control de Tiempo', path: '/control-tiempo', icon: Clock },
  { name: 'Resultados', path: '/resultados', icon: ListChecks },
  { name: 'Registro Rápido', path: '/registro-rapido', icon: UserPlus },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      logout();
    }, 50);
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Close mobile menu when clicking outside
  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-gradient-to-r from-green-600 to-green-400 text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-gradient-to-r from-green-600 via-lime-500 to-green-400 shadow-lg text-white transition-all duration-300
        ${/* Desktop styles */ ''}
        lg:sticky lg:top-0 lg:min-h-screen lg:flex lg:flex-col lg:animate-slide-in-left
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        ${/* Mobile styles */ ''}
        fixed top-0 left-0 h-full z-40 w-64 flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header del sidebar */}
        <div className="p-4 border-b border-black">
          <div className="flex items-center justify-between">
            {/* Logo/Title - Hide on collapsed desktop, show on mobile */}
            {(!isCollapsed || window.innerWidth < 1024) && (
              <h2 className="text-lg sm:text-xl font-bold flex items-center">
                <span className="hidden sm:inline">Carreras 🚴</span>
                <span className="sm:hidden">🚴</span>
              </h2>
            )}
            
            {/* Desktop collapse button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
            
            {/* Mobile close button */}
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cronómetro en el sidebar - Hide when collapsed on desktop, always show on mobile */}
        {(!isCollapsed || window.innerWidth < 1024) && (
          <div className="p-4 border-b border-black">
            <CronometroSidebar className="bg-green-700 border-black" />
          </div>
        )}

        {/* Navegación */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={name}
                to={path}
                onClick={closeMobileMenu} // Close mobile menu on navigation
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-green-700 ${
                    isActive ? 'bg-green-700' : ''
                  }`
                }
              >
                <Icon size={20} className="flex-shrink-0" />
                {/* Text - Hide on collapsed desktop, always show on mobile */}
                {(!isCollapsed || window.innerWidth < 1024) && (
                  <span className="text-sm sm:text-base truncate">{name}</span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Parte inferior: Usuario + Cerrar sesión */}
        <div className="p-4 border-t border-black">
          {/* User info - Hide when collapsed on desktop, show on mobile */}
          {user && (!isCollapsed || window.innerWidth < 1024) && (
            <div className="mb-3">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-white truncate">{user.email}</p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-red-800 hover:text-white hover:bg-red-600 transition-all duration-200"
          >
            <LogOut size={16} className="flex-shrink-0" />
            {/* Text - Hide on collapsed desktop, always show on mobile */}
            {(!isCollapsed || window.innerWidth < 1024) && (
              <span className="text-sm sm:text-base">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}