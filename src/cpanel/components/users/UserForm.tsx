import React, { useState, useEffect } from 'react'
import { User } from '../../../interfaces/users'

interface UserFormProps {
  user?: User | null
  onSave: (userData: Partial<User>) => void
  onClose: () => void
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    razonSocial: '',
    CUIT: '',
    phone: '',
    direccion: '',
    localidad: '',
    provincia: '',
    codigoPostal: '',
    approvalStatus: 'PENDING' as 'PENDING' | 'APPROVED' | 'REJECTED',
    role: ['USER_ROLE'] as string[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // No mostrar contraseña al editar
        razonSocial: user.razonSocial || '',
        CUIT: user.CUIT || '',
        phone: user.phone || '',
        direccion: user.direccion || '',
        localidad: user.localidad || '',
        provincia: user.provincia || '',
        codigoPostal: user.codigoPostal?.toString() || '',
        approvalStatus: user.approvalStatus || 'PENDING',
        role: user.role || ['USER_ROLE']
      })
    } else {
      // Resetear formulario para nuevo usuario
      setFormData({
        name: '',
        email: '',
        password: '',
        razonSocial: '',
        CUIT: '',
        phone: '',
        direccion: '',
        localidad: '',
        provincia: '',
        codigoPostal: '',
        approvalStatus: 'APPROVED', // Los usuarios creados por admin se aprueban automáticamente
        role: ['USER_ROLE']
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    // Solo validar contraseña para nuevos usuarios
    if (!user && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    } else if (!user && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (formData.CUIT && !/^\d{2}-\d{8}-\d{1}$/.test(formData.CUIT)) {
      newErrors.CUIT = 'El CUIT debe tener el formato XX-XXXXXXXX-X'
    }

    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener entre 10 y 15 dígitos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const userData: Partial<User> = {
      ...formData,
      codigoPostal: formData.codigoPostal ? parseInt(formData.codigoPostal) : undefined
    }

    // No enviar contraseña vacía al editar
    if (user && !formData.password) {
      delete userData.password
    }

    onSave(userData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      role: checked 
        ? [...prev.role, role]
        : prev.role.filter(r => r !== role)
    }))
  }

  return (
    <div className="fixed inset-0 bg-secondary-darkest bg-opacity-50 flex items-center justify-center z-50" style={{ paddingTop: '80px' }}>
      <div className="bg-secondary-lightest p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-heading text-primary">
              {user ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <button
              onClick={onClose}
              className="text-secondary-darkest hover:text-primary transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@ejemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {!user && (
                <div>
                  <label className="block text-sm font-medium text-secondary-darkest mb-1">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  Razón Social
                </label>
                <input
                  type="text"
                  value={formData.razonSocial}
                  onChange={(e) => handleInputChange('razonSocial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Razón social"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  CUIT
                </label>
                <input
                  type="text"
                  value={formData.CUIT}
                  onChange={(e) => handleInputChange('CUIT', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.CUIT ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="XX-XXXXXXXX-X"
                />
                {errors.CUIT && (
                  <p className="text-red-500 text-sm mt-1">{errors.CUIT}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1234567890"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  Código Postal
                </label>
                <input
                  type="number"
                  value={formData.codigoPostal}
                  onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1234"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-darkest mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Dirección completa"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  Localidad
                </label>
                <input
                  type="text"
                  value={formData.localidad}
                  onChange={(e) => handleInputChange('localidad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Localidad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  value={formData.provincia}
                  onChange={(e) => handleInputChange('provincia', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Provincia"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  Estado de Aprobación
                </label>
                <select
                  value={formData.approvalStatus}
                  onChange={(e) => handleInputChange('approvalStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="APPROVED">Aprobado</option>
                  <option value="REJECTED">Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-darkest mb-1">
                  Roles
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.role.includes('USER_ROLE')}
                      onChange={(e) => handleRoleChange('USER_ROLE', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Usuario</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.role.includes('ADMIN_ROLE')}
                      onChange={(e) => handleRoleChange('ADMIN_ROLE', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Administrador</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-secondary-lightest rounded-lg hover:bg-primary-dark transition"
              >
                {user ? 'Actualizar' : 'Crear'} Usuario
              </button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default UserForm
