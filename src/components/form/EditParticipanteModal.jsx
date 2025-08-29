import { useState, useEffect } from 'react';
import { X, Upload, Eye, Calendar, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

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
    foto_reverso: null,
    autorizacion: null
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
        foto_reverso: null,
        autorizacion: null
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

  const getBirthYear = (birthDate) => {
    if (!birthDate) return null;
    return new Date(birthDate).getFullYear();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'comprobante' || name === 'foto_anverso' || name === 'foto_reverso' || name === 'autorizacion') {
      const file = files[0];
      if (file) {
        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
          showError('El archivo no debe superar 5MB');
          return;
        }
        
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
          showError('Solo se permiten archivos JPG, PNG o PDF');
          return;
        }
      }
      setForm(prev => ({ ...prev, [name]: file }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateFormData = () => {
    // Validar campos básicos requeridos
    if (!form.nombre || !form.apellidos || !form.ci || !form.fecha_nacimiento || 
        !form.categoria_id || !form.metodo_pago || !form.dorsal) {
      showError('Todos los campos marcados con (*) son obligatorios');
      return false;
    }

    // Validar año de nacimiento - solo se admiten personas nacidas desde 2011 en adelante
    const birthYear = getBirthYear(form.fecha_nacimiento);
    console.log(birthYear)
    if (birthYear > 2011) {
      showError('Solo se admiten participantes nacidos desde el año 2011 en adelante');
      return false;
    }

    // Validar edad para autorización
    const age = calculateAge(form.fecha_nacimiento);
    if (typeof age === 'number' && age < 18 && !form.autorizacion && !participante?.autorizacion_url) {
      showError('Para participantes menores de 18 años es obligatorio subir la autorización firmada por los padres/tutores');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      return;
    }

    setLoading(true);

    try {
      const age = calculateAge(form.fecha_nacimiento);
      const token = localStorage.getItem('token');

      // Si hay archivos nuevos, usar FormData y el endpoint de actualización con archivos
      if (form.comprobante || form.foto_anverso || form.foto_reverso || form.autorizacion) {
        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('apellidos', form.apellidos);
        formData.append('ci', form.ci);
        formData.append('fecha_nacimiento', form.fecha_nacimiento);
        formData.append('dorsal', form.dorsal);
        formData.append('categoria_id', form.categoria_id);
        formData.append('equipo', form.equipo || '');
        formData.append('metodo_pago', form.metodo_pago);
        formData.append('comunidad', form.comunidad || '');

        // Solo agregar archivos si fueron seleccionados
        if (form.comprobante) {
          formData.append('comprobante', form.comprobante);
        }
        if (form.foto_anverso) {
          formData.append('foto_anverso', form.foto_anverso);
        }
        if (form.foto_reverso) {
          formData.append('foto_reverso', form.foto_reverso);
        }
        if (form.autorizacion) {
          formData.append('autorizacion', form.autorizacion);
        }

        // Validar que si se sube una foto del CI, se suban ambas
        if ((form.foto_anverso && !form.foto_reverso) || (!form.foto_anverso && form.foto_reverso)) {
          showError('Si actualiza las fotos del CI, debe subir tanto el anverso como el reverso');
          setLoading(false);
          return;
        }

        const response = await axios.put(
          `${API_BASE_URL}/api/inscripciones/participantes/${participante.id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
            timeout: 30000
          }
        );

        const successMessage = typeof age === 'number' && age < 18 
          ? `Participante ${form.nombre} ${form.apellidos} (menor de edad) actualizado correctamente con dorsal ${form.dorsal}`
          : `Participante ${form.nombre} ${form.apellidos} actualizado correctamente con dorsal ${form.dorsal}`;

        showSuccess(successMessage);
        
        if (onParticipanteUpdated) {
          onParticipanteUpdated(response.data.participante);
        }
        
      } else {
        // Solo datos sin archivos - usar JSON
        const participanteData = {
          nombre: form.nombre.trim(),
          apellidos: form.apellidos.trim(),
          ci: form.ci.trim(),
          fecha_nacimiento: form.fecha_nacimiento,
          dorsal: form.dorsal.trim(),
          categoria_id: form.categoria_id,
          equipo: form.equipo.trim() || null,
          metodo_pago: form.metodo_pago,
          comunidad: form.comunidad.trim() || null,
          // Mantener URLs existentes
          comprobante_url: participante?.comprobante_url || null,
          foto_anverso_url: participante?.foto_anverso_url || null,
          foto_reverso_url: participante?.foto_reverso_url || null,
          autorizacion_url: participante?.autorizacion_url || null
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

        const successMessage = typeof age === 'number' && age < 18 
          ? `Participante ${form.nombre} ${form.apellidos} (menor de edad) actualizado correctamente con dorsal ${form.dorsal}`
          : `Participante ${form.nombre} ${form.apellidos} actualizado correctamente con dorsal ${form.dorsal}`;

        showSuccess(successMessage);
        
        if (onParticipanteUpdated) {
          onParticipanteUpdated(response.data.participante);
        }
      }
      
      onClose();

    } catch (error) {
      console.error('Error actualizando participante:', error);
      let errorMessage = 'Error actualizando participante';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'La actualización está tardando demasiado. Por favor, inténtalo de nuevo.';
      } else if (error.response?.status === 413) {
        errorMessage = 'Los archivos son demasiado grandes. Por favor, reduce el tamaño e inténtalo de nuevo.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const dorsalAsignado = participante?.dorsal && participante.dorsal !== null;
  const currentAge = form.fecha_nacimiento ? calculateAge(form.fecha_nacimiento) : null;
  const currentBirthYear = form.fecha_nacimiento ? getBirthYear(form.fecha_nacimiento) : null;
  const isMenorDeEdad = typeof currentAge === 'number' && currentAge < 18;
  const isValidBirthYear = currentBirthYear && currentBirthYear <= 2011;

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
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {form.fecha_nacimiento && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-600">
                      Edad: {calculateAge(form.fecha_nacimiento)} años (Año: {getBirthYear(form.fecha_nacimiento)})
                    </p>
                    {!isValidBirthYear && (
                      <p className="text-xs text-red-600 font-medium">
                        ⚠ No cumple con el requisito de edad (debe ser nacido desde 2011)
                      </p>
                    )}
                    {isValidBirthYear && isMenorDeEdad && (
                      <p className="text-xs text-orange-600 font-medium">
                        ⚠️ Menor de edad - Autorización requerida
                      </p>
                    )}
                    {isValidBirthYear && !isMenorDeEdad && (
                      <p className="text-xs text-green-600 font-medium">
                        ✓ Edad válida para participar
                      </p>
                    )}
                  </div>
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
                  Dorsal *
                </label>
                <input
                  name="dorsal"
                  value={form.dorsal}
                  onChange={handleChange}
                  placeholder="Número de dorsal"
                  type="number"
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !dorsalAsignado 
                      ? 'border-orange-300 bg-orange-50' 
                      : 'border-gray-300'
                  }`}
                  required
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
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

              {/* Autorización */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autorización {isMenorDeEdad ? '*' : '(Opcional)'}
                </label>
                <div className="relative">
                  <input
                    name="autorizacion"
                    type="file"
                    onChange={handleChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs hover:file:bg-orange-100 ${
                      isMenorDeEdad 
                        ? 'border-orange-300 focus:ring-orange-500 file:bg-orange-50 file:text-orange-700' 
                        : 'border-gray-300 focus:ring-blue-500 file:bg-purple-50 file:text-purple-700'
                    }`}
                    required={isMenorDeEdad && !participante?.autorizacion_url}
                  />
                  <Upload className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {participante?.autorizacion_url && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Autorización actual disponible
                  </p>
                )}
                <div className="text-xs mt-1">
                  <p className="text-gray-500">JPG, PNG, PDF (máx. 5MB)</p>
                  {isMenorDeEdad && !participante?.autorizacion_url && (
                    <div className="mt-1 p-2 bg-orange-50 rounded border border-orange-200">
                      <div className="flex items-start gap-2">
                        <Info className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-orange-700">
                          <strong>Requerido:</strong> Documento firmado por padres/tutores autorizando la participación del menor de edad.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
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
              disabled={loading || (form.fecha_nacimiento && !isValidBirthYear)}
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