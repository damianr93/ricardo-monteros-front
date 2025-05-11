import React, { useState } from 'react'
import { Product } from '../data/types'

interface PaymentFormProps {
    items: Product[]
    total: number
    onSuccess: () => void
}

const PaymentForm: React.FC<PaymentFormProps> = ({ items, total, onSuccess }) => {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('http://localhost:3000/api/sendEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    surname,
                    phone,
                    items,
                    total
                })
            })
            if (!res.ok) throw new Error('Error al enviar el pedido')
            onSuccess()
        } catch (err: any) {
            console.error(err)
            setError('Ocurrió un problema al enviar el pedido.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow space-y-6">
            <h2 className="font-heading text-2xl text-brand-green mb-4">Datos para enviar tu pedido</h2>

            <ul className="mb-4 space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm text-gray-700">
                        <span>{item.title}</span>
                        <span>${item.price}</span>
                    </li>
                ))}
                <li className="flex justify-between font-semibold text-brand-green">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </li>
            </ul>

            <div>
                <label className="block mb-1 font-medium">Nombre o Razón Social *</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-brand-green"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Apellido (opcional)</label>
                <input
                    type="text"
                    value={surname}
                    onChange={e => setSurname(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-brand-green"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Teléfono de contacto *</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-brand-green"
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-coral text-white py-2 rounded hover:bg-accent-coral-light transition disabled:opacity-50"
            >
                {loading ? 'Enviando...' : 'Enviar pedido'}
            </button>
        </form>
    )
}

export default PaymentForm
