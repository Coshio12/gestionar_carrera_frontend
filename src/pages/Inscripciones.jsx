import Sidebar from '../components/Sidebar';
import InscripcionForm from '../components/form/InscripcionForm';

export default function Inscripciones() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-10 animate-fade-in">
        {/* Header */}
        <div className="mb-8">

          <div className='bg-white p-6 rounded-lg shadow mb-6'>

          <h1 className="text-3xl font-bold text-lime-500 mb-2">
            Inscripción de Participantes
          </h1>
          <p className="text-gray-600">
            Registre nuevos participantes completando el formulario con toda la información requerida.
          </p>
          </div>
        </div>

        {/* Formulario */}
        <InscripcionForm />
        
      </div>
    </div>
  );
}