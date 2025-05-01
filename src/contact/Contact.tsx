// File: src/pages/Contacto.tsx
import React, { useState } from 'react'
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    localidad: '',
    phone: '',
    empresa: '',
    actividad: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Enviar form:', formData)
    // TODO: enviar al servidor...
  }

  return (
    <div className="bg-neutral-50 py-16 px-4 sm:px-8 lg:px-24">
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg mb-16"
        style={{ backgroundImage: "url('/img/slide-3.webp')", backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/70 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-heading">
            Contacto
          </h1>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-heading mb-6 text-brand-green">Información de Contacto</h2>
          <ul className="space-y-6 text-neutral-700">
            <li className="flex items-start">
              <FaPhoneAlt className="text-brand-green mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">Teléfono</h3>
                <p>(+54 353) 0303-456 / 0303-456</p>
              </div>
            </li>
            <li className="flex items-start">
              <FaWhatsapp className="text-green-500 mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">WhatsApp</h3>
                <a
                  href="https://wa.me/5493534210083"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-green hover:underline"
                >
                  (+54 9 353) 4210-083
                </a>
              </div>
            </li>
            <li className="flex items-start">
              <FaMapMarkerAlt className="text-brand-green mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">Ubicación</h3>
                <p>Av. falsa 123</p>
                <p>Villa Maria, Córdoba, Argentina</p>
              </div>
            </li>
            <li className="flex items-start">
              <FaEnvelope className="text-brand-green mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a
                  href="mailto:contacto@ricardomontero.com"
                  className="text-brand-green hover:underline"
                >
                  contacto@ricardomontero.com
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-heading mb-6 text-brand-green">Envíanos un mensaje</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre *"
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail *"
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="localidad"
                value={formData.localidad}
                onChange={handleChange}
                placeholder="Localidad"
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono *"
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                placeholder="Empresa"
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div>
              <input
                type="text"
                name="actividad"
                value={formData.actividad}
                onChange={handleChange}
                placeholder="Actividad"
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div>
              <textarea
                name="message"
                rows={5}
                maxLength={1000}
                placeholder="Tu mensaje..."
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="px-8 py-3 bg-accent-coral hover:bg-accent-coral-light text-white font-medium rounded-full shadow"
              >
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contacto