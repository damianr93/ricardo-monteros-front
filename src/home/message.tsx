const InitialMessage: React.FC = () => {
    return (
        <section className="py-16 bg-secondary-lightest">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="font-heading text-primary text-3xl md:text-4xl font-semibold mb-6">
                    Creamos ambientes con estilo y calidez
                </h2>
                <p className="font-body text-secondary-darkest text-base md:text-lg mb-4">
                    En Ricardo Montero Decoraciones ofrecemos flores artificiales, cerámica artesanal y accesorios únicos que transforman tu hogar.
                </p>
                <p className="font-body text-secondary-darkest text-base md:text-lg mb-4">
                    Con más de ... años de trayectoria, elaboramos piezas de alta calidad y diseño atemporal, pensando en cada detalle.
                </p>
                <p className="font-body text-secondary-darkest text-base md:text-lg mb-8">
                    Nuestro compromiso es ayudarte a crear espacios acogedores y llenos de personalidad, con soluciones de decoración a medida.
                </p>
                <a
                    href="/catalogo"
                    className="inline-block bg-secondary-accent text-white font-medium text-base px-6 py-3 rounded-lg hover:bg-secondary-dark transition"
                >
                    Ver Catalogo
                </a>
            </div>
        </section>
    )
}

export default InitialMessage
