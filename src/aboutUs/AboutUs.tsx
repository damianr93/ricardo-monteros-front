
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
            Más de dos décadas cultivando belleza y emociones: La historia de nuestra familia en <b>RICARDO MONTERO FLORES ARTIFICIALES</b>.
          </p>

          <p className="font-body text-secondary-darkest text-base md:text-lg mb-6">
            En Ricardo Montero Flores Artificiales, creemos que cada detalle cuenta. Somos una empresa familiar con raíces profundas que desde hace más de 20 años, nos dedicamos a la venta mayorista de productos que embellecen hogares, eventos y que te acompañan en momentos especiales.
          </p>

          <p className="font-body text-secondary-darkest text-base md:text-lg mb-6">
            Lo que comenzó como un sueño, hoy es una realidad que ha florecido gracias a la dedicación y el compromiso de cada generación. Distribuimos nuestros productos a empresas ubicadas en distintos puntos de nuestro país.
          </p>

          <p className="font-body text-secondary-darkest text-base md:text-lg mb-4">
            Nos especializamos en una amplia gama de artículos cuidadosamente seleccionados:
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full mt-3 flex-shrink-0"></div>
              <p className="font-body text-secondary-darkest text-base md:text-lg">
                <strong>Flores artificiales y plantas de alta calidad:</strong> Perfectas para decorar cualquier espacio, nuestras flores y plantas son la opción ideal para quienes buscan belleza duradera sin mantenimiento.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mt-3 flex-shrink-0"></div>
              <p className="font-body text-secondary-darkest text-base md:text-lg">
                <strong>Coronas fúnebres:</strong> Con el mayor respeto y sensibilidad, elaboramos arreglos que acompañan en los momentos más difíciles, ofreciendo un homenaje digno y sereno.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full mt-3 flex-shrink-0"></div>
              <p className="font-body text-secondary-darkest text-base md:text-lg">
                <strong>Papeles y regalería:</strong> Porque sabemos que un regalo bien presentado habla por sí solo, encontrarás opciones creativas y originales para cada ocasión.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-3 flex-shrink-0"></div>
              <p className="font-body text-secondary-darkest text-base md:text-lg">
                <strong>Macetas rotomoldeadas:</strong> Duraderas, versátiles y con diseños modernos, son el complemento ideal para tus plantas, tanto de interior como de exterior.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-3 flex-shrink-0"></div>
              <p className="font-body text-secondary-darkest text-base md:text-lg">
                <strong>Decoración en cerámica:</strong> Piezas únicas que añaden un toque de arte y elegancia a cualquier ambiente, desde lo clásico hasta lo contemporáneo.
              </p>
            </div>
          </div>

          {/* Imagen de la familia - centrada */}
          <div className="flex justify-center my-12">
            <img
              src="/img/familia-empresa.jpg"
              alt="Familia Ricardo Montero - Dueños de la empresa"
              className="rounded-lg shadow-lg max-w-md w-full h-auto"
            />
          </div>

          <p className="font-body text-secondary-darkest text-base md:text-lg mb-4">
            En Ricardo Montero Flores Artificiales, cada producto es elegido o creado con el mismo amor y dedicación que si fuera para nuestra propia casa. Nuestro compromiso no es solo con la calidad, sino también con la atención personalizada que nos caracteriza. Sabemos que detrás de cada compra hay una historia, una celebración, un recuerdo, y nos enorgullece ser parte de ellos.
          </p>

          <p className="font-body text-secondary-darkest text-base md:text-lg">
            Gracias por permitirnos seguir siendo parte de tu negocio y por confiar en la trayectoria de una familia que, durante más de dos décadas, ha puesto el corazón en cada detalle. Te invitamos a explorar nuestro catálogo y descubrir todo lo que tenemos para ofrecerte.
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