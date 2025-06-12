import React from 'react'
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaInstagram,
  FaFacebookF,
  FaWhatsapp
} from 'react-icons/fa'

const Footer: React.FC = () => (
  <footer className="bg-primary-light text-secondary-darkest pt-12 backdrop-blur bg-opacity-90">
    {/* Contenido principal */}
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* Contacto */}
      <div>
        <h4 className="font-heading text-2xl mb-6">
          Contáctanos
        </h4>
        <ul className="space-y-4">
          <li className="flex items-center">
            <FaPhoneAlt className="h-6 w-6 mr-3" />
            <span>+54 9 353 4287484</span>
          </li>
          <li className="flex items-center">
            <FaWhatsapp className="h-6 w-6 mr-3" />
            <span>+54 9 353 4287484</span>
          </li>
          <li className="flex items-start">
            <FaMapMarkerAlt className="h-6 w-6 mr-3 mt-1" />
            <div>
              <p>Villa María</p>
              <p>Córdoba, Argentina</p>
            </div>
          </li>
          <li className="flex items-center">
            <FaEnvelope className="h-6 w-6 mr-3" />
            <span>ricardomontero.floresart@gmail.com</span>
          </li>
        </ul>
      </div>

      {/* Enlaces rápidos */}
      <div>
        <h4 className="font-heading text-2xl mb-6">
          Enlaces
        </h4>
        <ul className="space-y-3">
          {[
            { label: 'Inicio', to: '/' },
            { label: 'Quiénes Somos', to: '/nosotros' },
            { label: 'Productos', to: '/catalogo' },
            { label: 'Contacto', to: '/contacto' }
          ].map(link => (
            <li key={link.to}>
              <a
                href={link.to}
                className="hover:text-primary transition"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Redes sociales */}
      <div>
        <h4 className="font-heading text-2xl mb-6">
          Síguenos
        </h4>
        <ul className="flex space-x-6">
          {[FaInstagram, FaFacebookF, FaWhatsapp].map((Icon, i) => (
            <li key={i}>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition"
              >
                <Icon className="h-6 w-6" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Barra inferior */}
    <div className="mt-12 border-t border-secondary-darkest border-opacity-20 pt-6 pb-4">
      <div className="container mx-auto px-6 text-center text-sm">
        <span className="text-secondary-darkest">&copy; 2025 Ricardo Montero Decoraciones. Todos los derechos reservados.</span>
        <p className="text-xs text-secondary-darkest/60 flex items-center justify-center space-x-2 mt-2">
          <span>Desarrollado por</span>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:opacity-80"
          >
            <img
              src="/img/DS.png"
              alt="DuckSolutions"
              className="h-4 w-4 rounded-full mr-1"
            />
            <span>DuckSolutions</span>
          </a>
        </p>
      </div>
    </div>
  </footer>
)

export default Footer