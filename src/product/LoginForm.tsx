import React, { useState } from 'react'

interface LoginFormProps {
    onSuccess: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simula login
        localStorage.setItem('authToken', 'token')
        onSuccess()
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-8 rounded-lg shadow"
        >
            <h2 className="font-heading text-2xl mb-6 text-brand-green">Iniciar Sesión</h2>
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
                Entrar
            </button>
        </form>
    )
}

export default LoginForm