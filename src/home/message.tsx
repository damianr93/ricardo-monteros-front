const InitialMessage: React.FC = () => {
    return (
        <section className="py-16 bg-secondary-lightest">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="font-heading text-primary text-3xl md:text-4xl font-semibold mb-6">
                    Calidad y compromiso familiar
                </h2>
                <p className="font-body text-secondary-darkest text-base md:text-lg mb-4">
                    Somos Ricardo, Martin Montero y familia: lo que empezó como un sueño, hoy es una realidad que llega a florerías, comercios y funerarias, de todo el país.
                </p>
                <p className="font-body text-secondary-darkest text-base md:text-lg mb-4">
                    Te invitamos a explorar nuestro catálogo y descubrir todo lo que podemos ofrecerte.
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
