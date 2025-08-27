import { Calendar, Upload } from 'lucide-react';

export default function InscripcionFields({ form, handleChange, categorias, equipos = [], loading = false }) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Nacimiento *
          </label>
          <div className="relative">
            <input
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              type="date"
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
            <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        {/* Dorsal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Dorsal (Opcional)
          </label>
          <input
            name="dorsal"
            value={form.dorsal}
            onChange={handleChange}
            placeholder="Ingresa el número de dorsal"
            type="text"
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <p className="text-xs text-gray-500 mt-1">
            Si no especifica un dorsal, se asignará automáticamente
          </p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          >
            <option value="">Selecciona método de pago</option>
            <option value="efectivo">Efectivo</option>
            <option value="qr">Pago QR</option>
          </select>
        </div>
      </div>

      {/* Sección de archivos */}
      <div className="space-y-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Documentos Requeridos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                required
              />
              <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                required
              />
              <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Solo JPG, PNG (máx. 5MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}