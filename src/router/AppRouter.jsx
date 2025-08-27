import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { CronometroProvider } from '../context/CronometroContext';
import Login from '../pages/Login';
import PublicHome from '../pages/PublicHome'; // Nueva página pública
import InscripcionPublica from '../pages/InscripcionPublica'; // Página de inscripción pública
import Home from '../pages/Home'; // Dashboard administrativo
import Inscripciones from '../pages/Inscripciones';
import ListaInscritos from '../pages/ListaInscritos';
import ControlTiempo from '../pages/ControlTiempo';
import Resultados from '../pages/Resultados';
import Categoria from '../pages/Categoria';
import Etapas from '../pages/Etapas';
import ListaTiempos from '../pages/ListaTiempos';
import RegistroRapido from '../pages/RegistroRapido';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-600 text-lg">Cargando...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Componente específico para la ruta de login
const LoginRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Si está cargando, no mostrar nada para evitar parpadeos
  if (loading) {
    return null;
  }
  
  return !isAuthenticated ? children : <Navigate to="/admin" replace />;
};

// Componente para rutas públicas (cuando ya está logueado, redirige al admin)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-600 text-lg">Cargando...</div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/admin" replace />;
};

const AppRouter = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CronometroProvider>
          <BrowserRouter>
            <Routes>
              {/* Landing Carrera - Página pública principal (sin restricciones) */}
              <Route 
                path="/" 
                element={<PublicHome />} 
              />

              {/* Inscripción pública (sin restricciones) */}
              <Route 
                path="/inscripcion" 
                element={<InscripcionPublica />} 
              />
              
              {/* Login - solo disponible si no está autenticado */}
              <Route 
                path="/login" 
                element={
                  <LoginRoute>
                    <Login />
                  </LoginRoute>
                } 
              />
              
              {/* Dashboard administrativo - Cambié la ruta de /home a /admin */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/categorias" 
                element={
                  <ProtectedRoute>
                    <Categoria />
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/etapas"
                element={
                  <ProtectedRoute>
                    <Etapas />
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/inscripciones" 
                element={
                  <ProtectedRoute>
                    <Inscripciones />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/lista-inscritos" 
                element={
                  <ProtectedRoute>
                    <ListaInscritos />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/lista-tiempos"
                element={
                  <ProtectedRoute>
                    <ListaTiempos />
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/control-tiempo" 
                element={
                  <ProtectedRoute>
                    <ControlTiempo />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/registro-rapido"
                element={
                  <ProtectedRoute>
                    <RegistroRapido />
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/resultados" 
                element={
                  <ProtectedRoute>
                    <Resultados />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirección para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CronometroProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AppRouter;