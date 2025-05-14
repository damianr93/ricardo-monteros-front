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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/sendEmail`, {
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

    const groupedItems = items.reduce<Record<string, { product: Product; quantity: number }>>((acc, item) => {
        if (item.title) {
            if (acc[item.title]) {
                acc[item.title].quantity += 1
            } else {
                acc[item.title] = { product: item, quantity: 1 }
            }
        }
        return acc
    }, {})

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8 border border-gray-100"
        >
            <h2 className="text-3xl font-bold text-brand-green text-center">Confirmar Pedido</h2>

            <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">Resumen</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                    {Object.entries(groupedItems).map(([title, { product, quantity }], i) => (
                        <li key={i} className="flex justify-between">
                            <span>{title} <span className="text-gray-500">x{quantity}</span></span>
                            <span>${(product.price * quantity).toFixed(2)}</span>
                        </li>
                    ))}
                    <li className="flex justify-between font-semibold text-brand-green border-t border-gray-200 pt-2 mt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre o Razón Social *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido (opcional)</label>
                    <input
                        type="text"
                        value={surname}
                        onChange={e => setSurname(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto *</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                    />
                </div>
            </div>

            {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-coral text-white py-3 rounded-xl font-semibold hover:bg-accent-coral-light transition-transform transform hover:-translate-y-0.5 disabled:opacity-50"
            >
                {loading ? 'Enviando...' : 'Enviar pedido'}
            </button>
        </form>
    )
}

export default PaymentForm
