import React, { useState } from 'react'
import { Product } from '../data/types'
import Loading from '../components/loading'

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
                body: JSON.stringify({ name, surname, phone, items, total })
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
            if (acc[item.title]) acc[item.title].quantity += 1
            else acc[item.title] = { product: item, quantity: 1 }
        }
        return acc
    }, {})

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-secondary-lightest p-8 rounded-2xl shadow-lg space-y-8 border border-secondary-dark"
        >
            <h2 className="text-3xl font-heading text-primary text-center">Confirmar Pedido</h2>

            <div className="bg-secondary-lightest p-4 rounded-lg shadow-inner space-y-2 border border-secondary-dark">
                <h3 className="text-lg font-semibold text-secondary-darkest">Resumen</h3>
                <ul className="space-y-1 text-sm text-secondary-darkest">
                    {Object.entries(groupedItems).map(([title, { product, quantity }], i) => (
                        <li key={i} className="flex justify-between">
                            <span>{title} <span className="text-secondary-muted">x{quantity}</span></span>
                            <span>${(product.price * quantity).toFixed(2)}</span>
                        </li>
                    ))}
                    <li className="flex justify-between font-semibold text-primary border-t border-secondary-dark pt-2 mt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-secondary-darkest mb-1">Nombre o Razón Social *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary-darkest mb-1">Apellido (opcional)</label>
                    <input
                        type="text"
                        value={surname}
                        onChange={e => setSurname(e.target.value)}
                        className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary-darkest mb-1">Teléfono de contacto *</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {error && (
                <p className="text-accent-coral text-sm text-center">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary-accent text-secondary-lightest py-3 rounded-xl font-semibold hover:bg-secondary-dark transition disabled:opacity-50"
            >
                {loading ? <Loading /> : 'Enviar pedido'}
            </button>
        </form>
    )
}

export default PaymentForm