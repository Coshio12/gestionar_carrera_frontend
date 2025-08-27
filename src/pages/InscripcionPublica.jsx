import React from "react";
import PublicHeader from "../components/Landing/PublicHeader";
import Footer from "../components/Landing/Footer";
import PublicInscripcionForm from "../components/Public/PublicInscripcionForm";

export default function InscripcionPublica() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <PublicHeader />
      
      {/* Hero de la página de inscripción */}
      <section className="bg-gradient-to-r from-green-600 to-green-400 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ¡Inscríbete a la Carrera Chaguaya!
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Completa el formulario y sé parte de esta increíble aventura
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg">Fácil y Rápido</h3>
              <p>Proceso de inscripción simple</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg">Kit Incluido</h3>
              <p>Recibe tu kit del corredor</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg">Seguro Incluido</h3>
              <p>Cobertura durante la carrera</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de inscripción */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <PublicInscripcionForm />
        </div>
      </section>

      {/* Información adicional */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Información Importante
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Requisitos
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Ser mayor de 16 años</li>
                <li>• Presentar documento de identidad (ambas caras)</li>
                <li>• Completar formulario de inscripción</li>
                <li>• Realizar el pago correspondiente</li>
                <li>• Indicar tu comunidad de origen</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Métodos de Pago
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Efectivo:</strong> En puntos autorizados</li>
                <li>• <strong>QR:</strong> Pago digital inmediato</li>
                <li>• Subir comprobante obligatorio</li>
                <li>• Inscripción válida tras verificación</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg md:col-span-2">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Documentos Necesarios
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-gray-700">
                <div>
                  <h4 className="font-semibold">Comprobante de Pago</h4>
                  <p className="text-sm">Foto o captura del pago realizado</p>
                </div>
                <div>
                  <h4 className="font-semibold">CI/DNI Anverso</h4>
                  <p className="text-sm">Foto clara del frente del documento</p>
                </div>
                <div>
                  <h4 className="font-semibold">CI/DNI Reverso</h4>
                  <p className="text-sm">Foto clara del reverso del documento</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nota sobre dorsales */}
          <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-xl font-semibold text-orange-700 mb-3">
              Asignación de Dorsales
            </h3>
            <p className="text-gray-700 text-sm">
              <strong>Importante:</strong> Los números de dorsal serán asignados por los organizadores después de verificar tu inscripción y documentos. 
              No necesitas elegir un número durante el registro. Te contactaremos para comunicarte tu dorsal asignado.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}