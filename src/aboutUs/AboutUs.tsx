import React from 'react'

const QuienesSomos: React.FC = () => {
  return (
    <div className="bg-secondary-lightest py-16 px-4 sm:px-8 lg:px-24">
      {/* Hero mejorado */}
      <div
        className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg mb-16"
        style={{
          backgroundImage: "url('/img/slide-2.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/70 flex items-center justify-center">
          <h1 className="text-secondary-lightest text-3xl md:text-4xl lg:text-5xl font-heading text-center px-4">
            Quiénes somos
          </h1>
        </div>
      </div>

      {/* Sección de texto */}
      <section id="sobre-nosotros" className="py-16 bg-secondary-lightest">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Contenido actualizado */}
          <h2 className="font-heading text-2xl md:text-3xl text-secondary-darkest mb-4">
            <strong>Tu éxito es nuestra misión:</strong> más de 30 años acompañando tu crecimiento.
          </h2>
          <p className="font-body text-secondary-darkest text-base md:text-lg mb-6">
            Somos una <b>empresa familiar con más de tres décadas de experiencia</b>, dedicada a la <b>importación, venta mayorista y distribución de una amplia variedad de productos</b>. Nos enorgullece ser tu socio estratégico, y brindarte la calidad y el respaldo que necesitás para que tu negocio siga creciendo.
          </p>
          {/* Imagen de la familia - centrada */}
          <div className="flex justify-center my-12">
            <img
              src="/img/familia-empresa.jpg"
              alt="Familia Ricardo Montero - Dueños de la empresa"
              className="rounded-lg shadow-lg max-w-md w-full h-auto"
            />
          </div>
          <p className="font-body text-secondary-darkest text-base md:text-lg mb-6">
            Ofrecemos <b>atención personalizada</b> para que selecciones los productos ideales y nos encargamos de <b>llevártelos hasta la puerta de tu local</b>.
          </p>
          <p className="font-body text-secondary-darkest text-base md:text-lg mb-6">
            En <b>Ricardo Montero Flores Artificiales</b>, entendemos el valor de cada producto que ofreces. Por eso, nos especializamos en crear y seleccionar por vos, productos novedosos de la mejor calidad, para que puedas ofrecerlos a tus clientes y seas parte de los momentos más significativos de su vida.
          </p>

          <h2 className="font-heading text-2xl md:text-3xl text-secondary-darkest mb-4">
            Productos que impulsan tu negocio
          </h2>
          <ul className="list-disc list-inside font-body text-secondary-darkest text-base md:text-lg mb-6">
            <li>Desde nuestros comienzos, nos dedicamos a la elaboración de <b>Coronas fúnebres artesanales</b>: con el máximo respeto y sensibilidad.</li>
            <li>Importamos <b>Flores y plantas artificiales de alta calidad, papeles y artículos de regalaría, floreros, macetas roto moldeadas y artículos de decoración en cerámica</b>.</li>
          </ul>

          <h2 className="font-heading text-2xl md:text-3xl text-secondary-darkest mb-4">
            Calidad y compromiso familiar
          </h2>
          <p className="font-body text-secondary-darkest text-base md:text-lg mb-4">
            Somos Ricardo, Martin Montero y familia: lo que empezó como un sueño, hoy es una realidad que llega a florerías, comercios y funerarias de todo el país.
          </p>
          <p className="font-body text-secondary-darkest text-base md:text-lg mb-6">
            Te invitamos a explorar nuestro catálogo y descubrir todo lo que podemos ofrecerte.
          </p>



          {/* Logo de la empresa - centrado y más pequeño */}
          <div className="flex justify-center mt-12">
            <img
              src="/img/logo_sin_fondo.png"
              alt="Logo Ricardo Montero Flores Artificiales"
              className="w-48 h-auto opacity-80"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default QuienesSomos
