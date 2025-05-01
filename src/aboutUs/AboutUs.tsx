// File: src/components/QuienesSomos.tsx
import React from 'react'

const QuienesSomos: React.FC = () => {
  return (
    <div className="bg-neutral-50 py-16 px-4 sm:px-8 lg:px-24">
      {/* Hero mejorado */}
      <div
        className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg mb-16"
        style={{ backgroundImage: "url('/img/slide-3.webp')", backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/70 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-heading">
            Quienes somos
          </h1>
        </div>
      </div>

      {/* Sección de texto */}
      <section id="sobre-nosotros" className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading text-brand-green text-4xl md:text-5xl font-semibold mb-6">
            Nuestra Historia
          </h2>
          <p className="font-body text-neutral-700 text-base md:text-lg mb-4">
            En Ricardo Montero Decoraciones llevamos más de una década convirtiendo hogares en espacios llenos de encanto. Nacimos de la pasión por el diseño y el amor por los detalles, ofreciendo soluciones de decoración a medida que reflejan tu estilo y personalidad.
          </p>
          <p className="font-body text-neutral-700 text-base md:text-lg mb-4">
            Nuestro equipo de artesanos y decoradores trabaja mano a mano contigo para seleccionar las flores artificiales más realistas, la cerámica más refinada y los accesorios más exclusivos. Cada pieza es cuidadosamente elegida o elaborada, garantizando calidad, durabilidad y un acabado impecable.
          </p>
          <p className="font-body text-neutral-700 text-base md:text-lg">
            Creemos en la sostenibilidad y en el buen gusto. Combinamos materiales respetuosos con el medio ambiente con diseños atemporales que perduran más allá de las tendencias. Nuestro compromiso es acompañarte 365 días al año, desde la idea inicial hasta la puesta en escena final.
          </p>
        </div>
      </section>
    </div>
  )
}

export default QuienesSomos
