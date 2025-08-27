import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-lime-500 mb-4">Bienvenido al sistema de gestión</h1>
        <p className="text-gray-700">Selecciona una opción del menú lateral para comenzar.</p>
      </div>
    </div>
  );
}
