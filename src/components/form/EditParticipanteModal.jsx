import { useState, useEffect } from 'react';
import { X, Upload, Eye, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:10000';

export default function EditParticipanteModal({ 
  isOpen, 
  onClose, 
  participante, 
  onParticipanteUpdated,
  categorias = [], 
  equipos = [] 
}) {
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  // Cargar datos del participante cuando se abre el modal
  useEffect(() => {
    if (isOpen && participante) {
      // Convertir fecha_nacimiento al formato YYYY-MM-DD si existe
      let fechaNacimiento = '';
      if (participante.fecha_nacimiento) {
        const fecha = new Date(participante.fecha_nacimiento);
        if (!isNaN(fecha.getTime())) {
          fechaNacimiento = fecha.toISOString().split('T')[0];
        }
      }

      setForm({
        nombre: participante.nombre || '',
        apellidos: participante.apellidos || '',
        ci: participante.ci || '',
        fecha_nacimiento: fechaNacimiento,
        dorsal: participante.dorsal || '',
        categoria_id: participante.categoria_id || '',
        equipo: participante.equipo || '',
        metodo_pago: participante.metodo_pago || '',
        comunidad: participante.comunidad || '',
        comprobante: null,
        foto_anverso: null,
        foto_reverso: null
      });
    }
  }, [isOpen, participante]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      
      if (isNaN(birth.getTime())) return 'N/A';
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age >= 0 && age <= 120 ? age : 'N/A';
    } catch {
      return 'N/A';
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'comprobante' || name === 'foto_anverso' || name === 'foto_reverso') {
      const file = files[0];
      if (file) {
        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
          showError('El archivo no debe superar 5MB');
          return;
        }
        
        // Validar tipo de archivo
        const allowedTypes = name === 'comprobante' 
          ? ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
          : ['image/jpeg', 'image/jpg', 'image/png'];
          
        if (!allowedTypes.includes(file.type)) {
          const allowedText = name === 'comprobante' ? 'JPG, PNG o PDF' : 'JPG o PNG';
          showError(`Solo se permiten archivos ${allowedText}`);
          return;
        }
      }
      setForm(prev => ({ ...prev, [name]: file }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const uploadFile = async (file, endpoint, additionalData = {}) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Agregar el archivo con el nombre apropiado según el endpoint
      if (endpoint.includes('comprobante')) {
        formData.append('comprobante', file);
      } else if (endpoint.includes('ci-photos')) {
        formData.append('foto_anverso', file.foto_anverso);
        formData.append('foto_reverso', file.foto_reverso);
      }
      
      // Agregar datos adicionales
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/inscripciones/${endpoint}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return { path: response.data.path, error: null };
    } catch (error) {
      return { 
        path: null, 
        error: error.response?.data?.error || 'Error subiendo archivo' 
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar edad mínima
      if (form.fecha_nacimiento) {
        const age = calculateAge(form.fecha_nacimiento);
        if (typeof age === 'number' && age < 16) {
          showError('El participante debe ser mayor de 16 años');
          setLoading(false);
          return;
        }
      }

      let comprobante_url = participante?.comprobante_url || '';
      let foto_anverso_url = participante?.foto_anverso_url || '';
      let foto_reverso_url = participante?.foto_reverso_url || '';

      // Subir nuevo comprobante si se seleccionó uno
      if (form.comprobante && form.comprobante.size > 0) {
        const { path, error } = await uploadFile(
          form.comprobante, 
          'upload-comprobante', 
          { ci: form.ci }
        );
        if (error) {
          showError(error);
          setLoading(false);
          return;
        }
        comprobante_url = path;
      }

      // Subir nuevas fotos del CI si se seleccionaron
      if ((form.foto_anverso && form.foto_anverso.size > 0) || 
          (form.foto_reverso && form.foto_reverso.size > 0)) {
        
        // Validar que se hayan seleccionado ambas fotos si se va a actualizar
        if ((form.foto_anverso && !form.foto_reverso) || 
            (!form.foto_anverso && form.foto_reverso)) {
          showError('Debe seleccionar tanto la foto del anverso como del reverso del CI');
          setLoading(false);
          return;
        }

        const { path, error } = await uploadFile(
          { foto_anverso: form.foto_anverso, foto_reverso: form.foto_reverso }, 
          'upload-ci-photos', 
          { ci: form.ci }
        );
        if (error) {
          showError(error);
          setLoading(false);
          return;
        }
        
        // Asumir que el backend devuelve las rutas en un objeto
        if (path.foto_anverso_url) foto_anverso_url = path.foto_anverso_url;
        if (path.foto_reverso_url) foto_reverso_url = path.foto_reverso_url;
      }

      const token = localStorage.getItem('token');
      const participanteData = {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        ci: form.ci.trim(),
        fecha_nacimiento: form.fecha_nacimiento,
        dorsal: form.dorsal.trim() || null,
        categoria_id: form.categoria_id,
        equipo: form.equipo.trim() || null,
        metodo_pago: form.metodo_pago,
        comunidad: form.comunidad.trim() || null,
        comprobante_url: comprobante_url,
        foto_anverso_url: foto_anverso_url,
        foto_reverso_url: foto_reverso_url,
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/inscripciones/participantes/${participante.id}`,
        participanteData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showSuccess(`Participante ${form.nombre} ${form.apellidos} actualizado correctamente`);
      
      // Llamar callback para actualizar la lista
      if (onParticipanteUpdated) {
        onParticipanteUpdated(response.data.participante || participanteData);
      }
      
      onClose();

    } catch (error) {
      console.error('Error actualizando participante:', error);
      const errorMessage = error.response?.data?.error || 'Error actualizando participante';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const dorsalAsignado = participante?.dorsal && participante.dorsal !== null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Editar Participante</h2>
            <p className="text-sm text-gray-600 mt-1">
              {dorsalAsignado 
                ? `Dorsal actual: ${participante.dorsal.toString().padStart(3, "0")}` 
                : 'Asignar dorsal pendiente'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos *
                </label>
                <input
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  placeholder="Apellidos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CI/DNI *
                </label>
                <input
                  name="ci"
                  value={form.ci}
                  onChange={handleChange}
                  placeholder="CI"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento *
                </label>
                <div className="relative">
                  <input
                    name="fecha_nacimiento"
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                    type="date"
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {form.fecha_nacimiento && (
                  <p className="text-xs text-gray-600 mt-1">
                    Edad: {calculateAge(form.fecha_nacimiento)} años
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comunidad
                </label>
                <input
                  name="comunidad"
                  value={form.comunidad}
                  onChange={handleChange}
                  placeholder="Comunidad de origen"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipo
                </label>
                <input
                  name="equipo"
                  value={form.equipo}
                  onChange={handleChange}
                  placeholder="Nombre del equipo (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Información de Competencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Información de Competencia
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dorsal {!dorsalAsignado && '*'}
                </label>
                <input
                  name="dorsal"
                  value={form.dorsal}
                  onChange={handleChange}
                  placeholder={dorsalAsignado ? "Dorsal actual" : "Asignar dorsal"}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !dorsalAsignado 
                      ? 'border-orange-300 bg-orange-50' 
                      : 'border-gray-300'
                  }`}
                  required={!dorsalAsignado}
                />
                {!dorsalAsignado && (
                  <p className="text-xs text-orange-600 mt-1">
                    Este participante necesita un dorsal asignado
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  name="categoria_id"
                  value={form.categoria_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona Categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pago *
                </label>
                <select
                  name="metodo_pago"
                  value={form.metodo_pago}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Método de Pago</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="qr">QR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Documentos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Comprobante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comprobante de Pago
                </label>
                <div className="relative">
                  <input
                    name="comprobante"
                    type="file"
                    onChange={handleChange}
                    accept="image/*,application/pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"
                  />
                  <Upload className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {participante?.comprobante_url && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Comprobante actual disponible
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (máx. 5MB)</p>
              </div>

              {/* Foto Anverso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CI/DNI - Anverso
                </label>
                <div className="relative">
                  <input
                    name="foto_anverso"
                    type="file"
                    onChange={handleChange}
                    accept="image/jpeg,image/jpg,image/png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-green-50 file:text-green-700"
                  />
                  <Upload className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {participante?.foto_anverso_url && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Foto actual disponible
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Solo JPG, PNG (máx. 5MB)</p>
              </div>

              {/* Foto Reverso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CI/DNI - Reverso
                </label>
                <div className="relative">
                  <input
                    name="foto_reverso"
                    type="file"
                    onChange={handleChange}
                    accept="image/jpeg,image/jpg,image/png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-green-50 file:text-green-700"
                  />
                  <Upload className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {participante?.foto_reverso_url && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Foto actual disponible
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Solo JPG, PNG (máx. 5MB)</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-700">
                <strong>Nota:</strong> Solo sube nuevos archivos si deseas reemplazar los existentes. 
                Si subes nuevas fotos del CI, debes seleccionar tanto el anverso como el reverso.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? 'Actualizando...' : 'Actualizar Participante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}