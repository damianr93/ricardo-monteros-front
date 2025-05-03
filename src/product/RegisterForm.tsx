import React, { useState } from 'react'
import { baseUrl } from '../store/API'
import { toast } from 'react-toastify'

interface RegisterFormProps {
    onSuccess: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch(`${baseUrl}/auth/register`, {
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
            <div className="mb-6">
                <label className="block mb-2">Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
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
