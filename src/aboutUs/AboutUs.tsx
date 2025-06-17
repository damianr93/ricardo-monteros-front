import React from 'react'

const QuienesSomos: React.FC = () => {
  return (
    <div className="bg-secondary-lightest py-16 px-4 sm:px-8 lg:px-24">
      {/* Hero mejorado */}
      <div
        className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg mb-16"
        style={{ backgroundImage: "url('/img/slide-2.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
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
          <p className="font-body text-secondary-darkest text-base md:text-lg mb-6">
            Más de dos décadas cultivando belleza y emociones: La historia de nuestra familia en “RICARDO MONTERO FLORES ARTIFICIALES”.
          </p>

          <p className="font-body text-secondary-darkest text-base md:text-lg mb-6">
            En Ricardo Montero Flores Artificiales, creemos que cada detalle cuenta. Somos una empresa familiar con raíces profundas que desde hace más de 20 años, nos dedicamos con pasión a embellecer hogares, eventos y acompañarte en momentos especiales. Lo que comenzó como un sueño, hoy es una realidad que ha florecido gracias a la dedicación y el compromiso de cada generación.
          </p>

          <ul className="list-disc list-inside font-body text-secondary-darkest text-base md:text-lg mb-6 space-y-2">
            <li>Flores artificiales y plantas de alta calidad: Perfectas para decorar cualquier espacio, nuestras flores y plantas son la opción ideal para quienes buscan belleza duradera sin mantenimiento.</li>
            <li>Coronas fúnebres: Con el mayor respeto y sensibilidad, elaboramos arreglos que acompañan en los momentos más difíciles, ofreciendo un homenaje digno y sereno.</li>
            <li>Papeles y regalería: Porque sabemos que un regalo bien presentado habla por sí solo, encontrarás opciones creativas y originales para cada ocasión.</li>
            <li>Macetas rotomoldeadas: Duraderas, versátiles y con diseños modernos, son el complemento ideal para tus plantas, tanto de interior como de exterior.</li>
            <li>Decoración en cerámica: Piezas únicas que añaden un toque de arte y elegancia a cualquier ambiente, desde lo clásico hasta lo contemporáneo.</li>
          </ul>

          <p className="font-body text-secondary-darkest text-base md:text-lg mb-4">
            En Ricardo Montero Flores Artificiales, cada producto es elegido o creado con el mismo amor y dedicación que si fuera para nuestra propia casa. Nuestro compromiso no es solo con la calidad, sino también con la atención personalizada que nos caracteriza. Sabemos que detrás de cada compra hay una historia, una celebración, un recuerdo, y nos enorgullece ser parte de ellos.
          </p>
          <p className="font-body text-secondary-darkest text-base md:text-lg">
            Gracias por permitirnos seguir siendo parte de tu vida y por confiar en la trayectoria de una familia que, durante más de dos décadas, ha puesto el corazón en cada detalle. Te invitamos a explorar nuestro catálogo y descubrir todo lo que tenemos para ofrecerte.
          </p>
        </div>
      </section>
    </div>
  )
}

export default QuienesSomos
