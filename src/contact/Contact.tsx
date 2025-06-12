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

  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus({ type: null, message: '' })
    setIsLoading(true)

    try {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendFormData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Hubo un error al enviar el mensaje')

      setSubmitStatus({ type: 'success', message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.' })
      setFormData({ name: '', email: '', localidad: '', phone: '', empresa: '', message: '' })
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error instanceof Error ? error.message : 'Error desconocido al enviar el mensaje' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-secondary-lightest py-16 px-4 sm:px-8 lg:px-24">
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg mb-16"
        style={{ backgroundImage: `url('/img/slide-3.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/70 flex items-center justify-center">
          <h1 className="text-secondary-lightest text-3xl md:text-4xl lg:text-5xl font-heading">Contacto</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-secondary-lightest p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-heading mb-6 text-primary">Información de Contacto</h2>
          <ul className="space-y-6 text-secondary-darkest">
            <li className="flex items-start">
              <FaPhoneAlt className="text-primary mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">Teléfono</h3>
                <a
                  href="tel:+5493534287484"
                  className="text-primary hover:underline hover:text-primary-dark transition-colors"
                >
                  (+54 9 353) 4287484
                </a>
              </div>
            </li>
            <li className="flex items-start">
              <FaWhatsapp className="text-primary mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">WhatsApp</h3>
                <a
                  href="https://wa.me/5493534287484?text=Hola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline hover:text-primary-dark transition-colors"
                >
                  (+54 9 353) 4287484
                </a>
              </div>
            </li>
            <li className="flex items-start">
              <FaMapMarkerAlt className="text-primary mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">Ubicación</h3>
                <a
                  href="https://maps.google.com/?q=Villa+María,+Córdoba,+Argentina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline hover:text-primary-dark transition-colors"
                >
                  Villa María, Córdoba, Argentina
                </a>
              </div>
            </li>
            <li className="flex items-start">
              <FaEnvelope className="text-primary mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a
                  href={
                    "https://mail.google.com/mail/?view=cm&fs=1" +
                    "&to=ricardomontero.floresart@gmail.com" +
                    "&su=Consulta%20desde%20sitio%20web"}
                  className="text-primary hover:underline hover:text-primary-dark transition-colors"
                >
                  ricardomontero.floresart@gmail.com
                </a>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-secondary-lightest p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-heading mb-6 text-primary">Envíanos un mensaje</h2>
          {submitStatus.type && (
            <div className={`p-4 mb-6 rounded-lg ${submitStatus.type === 'success' ? 'bg-secondary-lightest text-primary' : 'bg-accent-coral-light text-accent-coral'}`}>
              {submitStatus.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre *" required className="w-full border border-secondary-darkest rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail *" required className="w-full border border-secondary-darkest rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input name="localidad" value={formData.localidad} onChange={handleChange} placeholder="Localidad" className="w-full border border-secondary-darkest rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono *" required className="w-full border border-secondary-darkest rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
            </div>
            <div>
              <input name="empresa" value={formData.empresa} onChange={handleChange} placeholder="Empresa" className="w-full border border-secondary-darkest rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
            </div>
            <div>
              <textarea name="message" rows={5} maxLength={1000} placeholder="Tu mensaje..." value={formData.message} onChange={handleChange} className="w-full border border-secondary-darkest rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full shadow flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? <Loading /> : 'Enviar Mensaje'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contacto
