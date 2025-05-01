// File: src/components/QuienesSomos.tsx
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'

const QuienesSomos: React.FC = () => {
  return (
    <>
      {/* Hero mejorado */}
      <section
        className="relative w-full h-80 sm:h-96 md:h-[70vh] bg-center bg-cover"
        style={{ backgroundImage: "url('/img/slide-3.webp')" }}
      >
        {/* Overlay oscuro con degradado */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/70"></div>
        {/* Contenido del hero */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white font-semibold mb-2">
            Quiénes Somos
          </h1>
          <p className="font-body text-lg sm:text-xl text-neutral-200 mb-6 max-w-2xl">
            Transformamos espacios con pasión, detalle y creatividad.
          </p>
          {/* Indicador para hacer scroll */}
          <a href="#sobre-nosotros" className="animate-bounce text-white">
            <FaChevronDown className="h-6 w-6" />
          </a>
        </div>
      </section>

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
    </>
  )
}

export default QuienesSomos
