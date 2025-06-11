// File: src/components/Footer.tsx
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
  <footer className="bg-brand-green-dark text-neutral-50 pt-12">
    {/* Contenido principal */}
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* Contacto */}
      <div>
        <h4 className="font-heading text-2xl mb-6 text-accent-coral">
          Contáctanos
        </h4>
        <ul className="space-y-4 text-neutral-100">
          <li className="flex items-center">
            <FaPhoneAlt className="h-6 w-6 mr-3" />
            <span>(+54 9 353) 4287484</span>
          </li>
          <li className="flex items-center">
            <FaWhatsapp className="h-6 w-6 mr-3" />
            <span>(+54 9 353) 4287484</span>
          </li>
          <li className="flex items-start">
            <FaMapMarkerAlt className="h-6 w-6 mr-3 mt-1" />
            <div>
              <p>Villa Maria</p>
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
        <h4 className="font-heading text-2xl mb-6 text-accent-coral">
          Enlaces
        </h4>
        <ul className="space-y-3">
          <li>
            <a href="/" className="hover:text-accent-coral-light transition">
              Inicio
            </a>
          </li>
          <li>
            <a href="/nosotros" className="hover:text-accent-coral-light transition">
              Quiénes Somos
            </a>
          </li>
          <li>
            <a href="/catalogo" className="hover:text-accent-coral-light transition">
              Productos
            </a>
          </li>
          <li>
            <a href="/contacto" className="hover:text-accent-coral-light transition">
              Contacto
            </a>
          </li>
        </ul>
      </div>

      {/* Redes sociales */}
      <div>
        <h4 className="font-heading text-2xl mb-6 text-accent-coral">
          Síguenos
        </h4>
        <ul className="flex space-x-6">
          <li>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-100 hover:text-accent-coral-light transition"
            >
              <FaInstagram className="h-6 w-6" />
            </a>
          </li>
          <li>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-100 hover:text-accent-coral-light transition"
            >
              <FaFacebookF className="h-6 w-6" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Barra inferior */}
    <div className="mt-12 border-t border-neutral-100 border-opacity-20 pt-6 pb-4">
      <div className="container mx-auto px-6 text-center text-sm text-neutral-200">
        &copy; 2025 Ricardo Montero Decoraciones. Todos los derechos reservados.
        <p className="text-xs text-brand-light/60 flex items-center justify-center space-x-2">
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
              className="h-4 w-4 rounded-full"
            />
            <span className="ml-1">DuckSolutions</span>
          </a>
        </p>
      </div>
    </div>
  </footer>
)

export default Footer
