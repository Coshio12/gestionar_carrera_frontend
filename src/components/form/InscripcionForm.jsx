import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import InscripcionFields from './InscripcionFields';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL|| 'http://localhost:10000';

export default function InscripcionForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    ci: '',
    fecha_nacimiento: '',
    categoria_id: '',
    dorsal: '',
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
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        const headers = { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        const categoriasRes = await axios.get(`${API_BASE_URL}/api/categorias`, { 
          headers,
          timeout: 10000 // 10 segundos de timeout
        });
        
        // Verificar si la respuesta tiene datos válidos
        if (categoriasRes.data && categoriasRes.data.data && Array.isArray(categoriasRes.data.data)) {
          // Los datos vienen en formato { success: true, data: [...] }
          setCategorias(categoriasRes.data.data);
        } else if (categoriasRes.data && categoriasRes.data.categorias && Array.isArray(categoriasRes.data.categorias)) {
          // Los datos vienen en formato { categorias: [...] }
          setCategorias(categoriasRes.data.categorias);
        } else if (categoriasRes.data && Array.isArray(categoriasRes.data)) {
          // Los datos vienen directamente como array
          setCategorias(categoriasRes.data);
        } else {
          setCategorias([]);
        }

        // Intentar cargar equipos (opcional)
        try {
          
          if (equiposRes.data && equiposRes.data.data && Array.isArray(equiposRes.data.data)) {
            // Los datos vienen en formato { success: true, data: [...] }
            setEquipos(equiposRes.data.data);
          } else if (equiposRes.data && equiposRes.data.equipos && Array.isArray(equiposRes.data.equipos)) {
            // Los datos vienen en formato { equipos: [...] }
            setEquipos(equiposRes.data.equipos);
          } else if (equiposRes.data && Array.isArray(equiposRes.data)) {
            // Los datos vienen directamente como array
            setEquipos(equiposRes.data);
          } else {
            setEquipos([]);
          }
        } catch (equiposError) {
          setEquipos([]);
        }
        
      } catch (error) {
        
        let errorMessage = 'Error cargando datos del servidor.';
        
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          errorMessage = 'No se puede conectar al servidor. Verifica que esté ejecutándose en http://localhost:10000';
        } else if (error.response?.status === 401) {
          errorMessage = 'Token de autenticación inválido. Por favor, inicia sesión nuevamente.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Endpoint de categorías no encontrado. Verifica la URL de la API.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Error interno del servidor. Verifica los logs del backend.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Timeout de conexión. El servidor está tardando mucho en responder.';
        }
        
        showMessage(errorMessage, 'error');
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
      formData.append('dorsal', form.dorsal);
      formData.append('categoria_id', form.categoria_id);
      formData.append('equipo', form.equipo);
      formData.append('metodo_pago', form.metodo_pago);
      formData.append('comunidad', form.comunidad);
      formData.append('comprobante', form.comprobante);
      formData.append('foto_anverso', form.foto_anverso);
      formData.append('foto_reverso', form.foto_reverso);

      // Enviar datos al endpoint público
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/inscripciones/participantes/publico`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
            // No incluir Authorization header para endpoint público
          }
        }
      );

      showMessage(
        `¡Inscripción exitosa! ${form.nombre} ${form.apellidos} ha sido registrado correctamente.`,
        'success'
      );

      // Resetear formulario
      setForm({
        nombre: '',
        apellidos: '',
        ci: '',
        fecha_nacimiento: '',
        dorsal: '',
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
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-lime-500 mb-2">
          Formulario de Inscripción
        </h2>
        <p className="text-gray-600">
          Completa todos los campos para registrar un nuevo participante
        </p>
      </div>

      {/* Loader inicial */}
      {dataLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Cargando formulario...</span>
          </div>
        </div>
      )}

      {/* Formulario */}
      {!dataLoading && (
        <>
          {/* Mensaje de estado */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InscripcionFields
              form={form}
              handleChange={handleChange}
              categorias={categorias}
              equipos={equipos}
              loading={loading}
            />

            {/* Botón de envío */}
            <div className="text-center pt-6">
              <button 
                disabled={loading} 
                type="submit" 
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-lime-300 to-lime-400 text-white font-bold text-lg rounded-lg hover:from-lime-400 hover:to-lime-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando Inscripción...
                  </div>
                ) : (
                  'Registrar Participante'
                )}
              </button>
            </div>
          </form>

          {/* Nota final */}
          <div className="mt-8 p-4 bg-lime-50 rounded-lg border border-lime-200">
            <p className="text-sm text-lime-700">
              <strong>Nota:</strong> La inscripción será verificada una vez que se suban todos los documentos requeridos. 
              El número de dorsal será asignado automáticamente si no se especifica uno.
            </p>
          </div>
        </>
      )}
    </div>
  );
}