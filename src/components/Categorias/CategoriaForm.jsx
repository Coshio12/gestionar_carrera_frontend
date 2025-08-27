export default function CategoriaForm({ form, handleChange, handleSubmit, loading, editingCategoria }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Nombre de categoría */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre de la categoría *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="SENIORS, MASTERS, ETC."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 text-sm sm:text-base"
            required
          />
        </div>

        {/* Hora de salida */}
        <div>
          <label htmlFor="hora_salida" className="block text-gray-700 text-sm font-bold mb-2">
            Hora de salida *
          </label>
          <input
            type="time"
            id="hora_salida"
            name="hora_salida"
            value={form.hora_salida}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 text-sm sm:text-base"
            required
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors duration-200 text-sm sm:text-base"
        >
          {loading ? 'Guardando...' : editingCategoria ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}