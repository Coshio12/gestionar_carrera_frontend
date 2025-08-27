import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Upload } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function PublicInscripcionForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    ci: '',
    fecha_nacimiento: '',
    categoria_id: '',
    equipo: '',
    metodo_pago: '',
    comunidad: '',
    comprobante: null,
    foto_anverso: null,
    foto_reverso: null
  });

  const [categorias, setCategorias] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  // Cargar categorías y equipos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        console.log('Intentando cargar categorías y equipos...');
        
        const [categoriasRes, equiposRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/inscripciones/categorias`),
          axios.get(`${API_BASE_URL}/api/inscripciones/equipos`)
        ]);
        
        console.log('Respuesta categorías:', categoriasRes.data);
        console.log('Respuesta equipos:', equiposRes.data);
        
        setCategorias(categoriasRes.data.categorias || []);
        setEquipos(equiposRes.data.equipos || []);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
        showMessage('Error cargando categorías y equipos. Verifica que el servidor esté funcionando.', 'error');
        setCategorias([]);
        setEquipos([]);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType('');
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'comprobante' || name === 'foto_anverso' || name === 'foto_reverso') {
      const file = files[0];
      if (file) {
        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
          showMessage('El archivo no debe superar 5MB', 'error');
          return;
        }
        
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
          showMessage('Solo se permiten archivos JPG, PNG o PDF', 'error');
          return;
        }
      }
      setForm(prev => ({ ...prev, [name]: file }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones
      if (!form.comprobante || !form.foto_anverso || !form.foto_reverso) {
        showMessage('Debe subir el comprobante de pago y las fotos del CI (anverso y reverso)', 'error');
        setLoading(false);
        return;
      }

      // Validar edad
      const age = calculateAge(form.fecha_nacimiento);
      if (age < 16) {
        showMessage('Debe ser mayor de 16 años para participar', 'error');
        setLoading(false);
        return;
      }

      // Crear FormData con todos los datos incluyendo los archivos
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('apellidos', form.apellidos);
      formData.append('ci', form.ci);
      formData.append('fecha_nacimiento', form.fecha_nacimiento);
      formData.append('categoria_id', form.categoria_id);
      formData.append('equipo', form.equipo);
      formData.append('metodo_pago', form.metodo_pago);
      formData.append('comunidad', form.comunidad);
      formData.append('comprobante', form.comprobante);
      formData.append('foto_anverso', form.foto_anverso);
      formData.append('foto_reverso', form.foto_reverso);

      // Enviar datos
      const response = await axios.post(
        `${API_BASE_URL}/api/inscripciones/participantes/publico`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      showMessage(
        `¡Inscripción exitosa! ${form.nombre} ${form.apellidos} ha sido registrado. El número de dorsal será asignado posteriormente.`,
        'success'
      );

      // Resetear formulario
      setForm({
        nombre: '',
        apellidos: '',
        ci: '',
        fecha_nacimiento: '',
        categoria_id: '',
        equipo: '',
        metodo_pago: '',
        comunidad: '',
        comprobante: null,
        foto_anverso: null,
        foto_reverso: null
      });

      // Resetear inputs de archivo
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');

    } catch (error) {
      console.error('Error en inscripción:', error);
      const errorMessage = error.response?.data?.error || 'Error en la inscripción';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mx-2 sm:mx-4 md:mx-auto max-w-6xl">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-2">
          Formulario de Inscripción
        </h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Completa todos los campos para confirmar tu participación
        </p>
      </div>

      {/* Loader inicial */}
      {dataLoading && (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-flex items-center gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm sm:text-base text-gray-600">Cargando formulario...</span>
          </div>
        </div>
      )}

      {/* Formulario */}
      {!dataLoading && (
        <>
          {/* Mensaje de estado */}
          {message && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-start gap-3 text-sm sm:text-base ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              <div className="flex-shrink-0 mt-0.5">
                {messageType === 'success' ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <span className="flex-1">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  placeholder="Ingresa tus apellidos"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* CI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CI/DNI *
                </label>
                <input
                  name="ci"
                  value={form.ci}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <input
                  name="fecha_nacimiento"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  type="date"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
                {form.fecha_nacimiento && (
                  <p className="text-xs text-gray-600 mt-1">
                    Edad: {calculateAge(form.fecha_nacimiento)} años
                  </p>
                )}
              </div>

              {/* Comunidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comunidad *
                </label>
                <input
                  name="comunidad"
                  value={form.comunidad}
                  onChange={handleChange}
                  placeholder="Ingresa tu comunidad"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="categoria_id"
                  value={form.categoria_id}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.length > 0 ? (
                    categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))
                  ) : (
                    <option value="" disabled>No hay categorías disponibles</option>
                  )}
                </select>
              </div>

              {/* Equipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipo (Opcional)
                </label>
                <input
                  name="equipo"
                  value={form.equipo}
                  onChange={handleChange}
                  placeholder="Nombre de tu equipo (opcional)"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago *
                </label>
                <select
                  name="metodo_pago"
                  value={form.metodo_pago}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
                  required
                >
                  <option value="">Selecciona método de pago</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="qr">Pago QR</option>
                </select>
              </div>
            </div>

            {/* Sección de archivos completamente responsive */}
            <div className="space-y-4 sm:space-y-6 border-t pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Documentos Requeridos</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Comprobante */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprobante de Pago *
                  </label>
                  <div className="relative">
                    <input
                      name="comprobante"
                      type="file"
                      onChange={handleChange}
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      required
                    />
                    <Upload className="absolute right-2 sm:right-3 top-2 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, PDF (máx. 5MB)
                  </p>
                </div>

                {/* Foto Anverso CI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CI/DNI - Anverso (Frente) *
                  </label>
                  <div className="relative">
                    <input
                      name="foto_anverso"
                      type="file"
                      onChange={handleChange}
                      accept="image/jpeg,image/jpg,image/png"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                    <Upload className="absolute right-2 sm:right-3 top-2 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Solo JPG, PNG (máx. 5MB)
                  </p>
                </div>

                {/* Foto Reverso CI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CI/DNI - Reverso (Atrás) *
                  </label>
                  <div className="relative">
                    <input
                      name="foto_reverso"
                      type="file"
                      onChange={handleChange}
                      accept="image/jpeg,image/jpg,image/png"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                    <Upload className="absolute right-2 sm:right-3 top-2 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Solo JPG, PNG (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de envío responsive */}
            <div className="text-center pt-4 sm:pt-6">
              <button 
                disabled={loading} 
                type="submit" 
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-base sm:text-lg rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg min-w-[200px]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">Procesando Inscripción...</span>
                  </div>
                ) : (
                  'Inscribirme Ahora'
                )}
              </button>
            </div>
          </form>

          {/* Nota final responsive */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              <strong>Nota:</strong> Tu inscripción será verificada una vez que subas todos los documentos requeridos. 
              El número de dorsal será asignado por los organizadores y te será comunicado posteriormente.
            </p>
          </div>
        </>
      )}
    </div>    
  );
}