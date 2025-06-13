import React from 'react'

interface WelcomeMessageProps {
    onLoginClick: () => void
    onRegisterClick: () => void
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
    onLoginClick,
    onRegisterClick
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="max-w-2xl mx-auto">
                {/* Título principal */}
                <h1 className="text-4xl md:text-5xl font-heading text-primary mb-6">
                    Bienvenido a nuestro catálogo
                </h1>

                {/* Subtítulo */}
                <p className="text-xl text-secondary-darkest mb-8">
                    Descubre nuestra amplia variedad de productos para decoración
                </p>

                {/* Mensaje para acceder a precios */}
                <div className="bg-primary-light rounded-lg p-8 mb-8">
                    <h2 className="text-2xl font-heading text-primary mb-4">
                        Para ver precios y realizar cotizaciones
                    </h2>
                    <p className="text-secondary-darkest mb-6">
                        Necesitas tener una cuenta para acceder a nuestros precios exclusivos
                        y poder realizar cotizaciones personalizadas.
                    </p>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* Botón para nuevos clientes */}
                        <div className="text-center">
                            <p className="text-sm text-secondary-muted mb-2">
                                ¿Eres nuevo cliente?
                            </p>
                            <button
                                onClick={onRegisterClick}
                                className="w-full sm:w-auto px-8 py-3 bg-primary text-secondary-lightest rounded-md hover:bg-primary-dark transition font-medium"
                            >
                                Registrarse
                            </button>
                        </div>

                        {/* Separador */}
                        <div className="flex items-center justify-center sm:mx-4">
                            <span className="text-secondary-muted">o</span>
                        </div>

                        {/* Botón para clientes existentes */}
                        <div className="text-center">
                            <p className="text-sm text-secondary-muted mb-2">
                                ¿Ya tienes cuenta?
                            </p>
                            <button
                                onClick={onLoginClick}
                                className="w-full sm:w-auto px-8 py-3 border border-primary text-primary rounded-md hover:bg-primary-light hover:text-secondary-lightest transition font-medium"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="text-secondary-muted">
                    <p className="mb-2">
                        Una vez que inicies sesión podrás:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                        <li>Ver precios de todos nuestros productos</li>
                        <li>Agregar productos a tu pedido</li>
                        <li>Realizar cotizaciones personalizadas</li>
                        <li>Contactar directamente con nuestro equipo</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default WelcomeMessage