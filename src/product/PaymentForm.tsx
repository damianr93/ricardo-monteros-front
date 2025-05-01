import React, { useState } from 'react'
import { ExampleItem } from '../data/items'

interface PaymentFormProps {
    items: ExampleItem[]
    total: number
    onSuccess: () => void
}

const PaymentForm: React.FC<PaymentFormProps> = ({ items, total, onSuccess }) => {
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simula pago
        onSuccess()
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow space-y-6">
            <h2 className="font-heading text-2xl text-brand-green mb-4">Pago</h2>
            <ul className="mb-4 space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="flex justify-between">
                        <span>{item.title}</span>
                        <span>${item.price}</span>
                    </li>
                ))}
                <li className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </li>
            </ul>
            <div>
                <label className="block mb-2">Número de tarjeta</label>
                <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2">Vence</label>
                    <input
                        type="text"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                </div>
                <div>
                    <label className="block mb-2">CVV</label>
                    <input
                        type="text"
                        value={cvv}
                        onChange={e => setCvv(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                </div>
            </div>
            <button type="submit" className="w-full bg-accent-coral text-white py-2 rounded-md hover:bg-accent-coral-light transition">
                Pagar $ {total.toFixed(2)}
            </button>
        </form>
    )
}

export default PaymentForm