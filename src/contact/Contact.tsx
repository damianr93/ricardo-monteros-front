import React, { useState } from 'react'
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import Loading from '../components/loading'

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    localidad: '',
    phone: '',
    empresa: '',
    message: '',
  })

  // Estados para manejar la carga y respuesta del formulario
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSubmitStatus({ type: null, message: '' })
    setIsLoading(true)

    try {
      // Adaptamos los nombres de los campos para que coincidan con el backend
      const backendFormData = {
        name: formData.name,
        correo: formData.email,
        localidad: formData.localidad,
        telefono: formData.phone,
        empresa: formData.empresa || undefined,
        mensaje: formData.message || undefined,
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/sendEmail/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendFormData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Hubo un error al enviar el mensaje')
      }

      // Éxito
      setSubmitStatus({
        type: 'success',
        message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'
      })

      // Limpiar el formulario
      setFormData({
        name: '',
        email: '',
        localidad: '',
        phone: '',
        empresa: '',
        message: '',
      })

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido al enviar el mensaje'
      })
    } finally {
      setIsLoading(false)
    }
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

          {/* Mensajes de estado */}
          {submitStatus.type && (
            <div
              className={`p-4 mb-6 rounded-lg ${submitStatus.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}
            >
              {submitStatus.message}
            </div>
          )}

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
                disabled={isLoading}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail *"
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono *"
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-3 bg-accent-coral hover:bg-accent-coral-light text-white font-medium rounded-full shadow flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? (
                  <Loading/>
                ) : (
                  'Enviar Mensaje'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contacto