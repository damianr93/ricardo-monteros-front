import React, { useState } from 'react'
import { toast } from 'react-toastify'

interface RegisterFormProps {
    onSuccess: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Por favor ingrese un email válido', {
                position: 'top-left'
            })
            return
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres', {
                position: 'top-left'
            })
            return
        }

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden', {
                position: 'top-left'
            })
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error al registrarse')
            }

            toast.info('Registro exitoso, puede logearse ahora', {
                position: 'top-left'
            })
            onSuccess()
        } catch (err: any) {
            toast.error('Algo salio mal, intente nuevamente', {
                position: 'top-left'
            })
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-8 rounded-lg shadow"
        >
            <h2 className="font-heading text-2xl mb-6 text-brand-green">Registrarse</h2>
            <div className="mb-4">
                <label className="block mb-2">Nombre</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </div>
            <div className="mb-6">
                <label className="block mb-2">Confirmar Contraseña</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-colors ${confirmPassword === ''
                            ? 'border-gray-300 focus:ring-brand-green'
                            : password === confirmPassword
                                ? 'border-green-400 bg-green-50 focus:ring-green-400'
                                : 'border-red-400 bg-red-50 focus:ring-red-400'
                        }`}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-accent-coral text-white py-2 rounded-md hover:bg-accent-coral-light transition"
            >
                Crear Cuenta
            </button>
        </form>
    )
}
export default RegisterForm