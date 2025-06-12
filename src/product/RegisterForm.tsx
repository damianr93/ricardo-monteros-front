// File: src/components/RegisterForm.tsx
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Por favor ingrese un email válido', { position: 'top-left' })
            return
        }
        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres', { position: 'top-left' })
            return
        }
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden', { position: 'top-left' })
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error al registrarse')
            }
            toast.info('Registro exitoso, puede logearse ahora', { position: 'top-left' })
            onSuccess()
        } catch (err: any) {
            toast.error('Algo salió mal, intente nuevamente', { position: 'top-left' })
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-secondary-lightest p-8 rounded-lg shadow-lg space-y-6 border border-secondary-dark"
        >
            <h2 className="font-heading text-2xl text-primary text-center mb-6">
                Registrarse
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-secondary-darkest mb-2">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-secondary-darkest mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-secondary-darkest mb-2">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-secondary-darkest mb-2">Confirmar Contraseña</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-colors ${confirmPassword === ''
                            ? 'border-secondary-darkest focus:ring-primary'
                            : password === confirmPassword
                                ? 'border-secondary-accent bg-secondary-lightest focus:ring-secondary-accent'
                                : 'border-accent-coral bg-accent-coral-light focus:ring-accent-coral'
                            }`}
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-primary text-secondary-lightest py-2 rounded-md hover:bg-primary-dark transition"
            >
                Crear Cuenta
            </button>
        </form>
    )
}

export default RegisterForm