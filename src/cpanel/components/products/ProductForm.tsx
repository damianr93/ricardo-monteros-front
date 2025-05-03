import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { Product } from '../../../data/types'

interface ProductFormProps {
    initial?: Product
    onSubmit: (data: Omit<Product, 'id' | 'user'>) => void
    onCancel: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ initial, onSubmit, onCancel }) => {
    const categories = useSelector((state: RootState) => state.categories.list)
    const [name, setName] = useState(initial?.name || '')
    const [price, setPrice] = useState(initial?.price.toString() || '0')
    const [available, setAvailable] = useState(initial?.available || false)
    const [category, setCategory] = useState(initial?.category || '')
    const [title, setTitle] = useState(initial?.title || '')
    const [description, setDescription] = useState(initial?.description || '')
    const [img, setImg] = useState(initial?.img || '')

    useEffect(() => {
        if (initial) {
            setName(initial.name)
            setPrice(initial.price.toString())
            setAvailable(initial.available)
            setCategory(initial.category)
            setTitle(initial.title || '')
            setDescription(initial.description || '')
            setImg(initial.img || '')
        }
    }, [initial])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            name,
            price: parseFloat(price),
            available,
            category,
            title,
            description,
            img
        })
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg w-full space-y-4">
                <h3 className="text-lg font-heading mb-2">
                    {initial ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green"
                    />

                    <input
                        type="number"
                        placeholder="Precio"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green"
                    />

                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green"
                    >
                        <option value="" disabled>Selecciona categoría</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Título (opcional)"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green"
                    />

                    <textarea
                        placeholder="Descripción (opcional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green"
                    />

                    <input
                        type="text"
                        placeholder="URL de imagen (opcional)"
                        value={img}
                        onChange={e => setImg(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green"
                    />

                    <div className="flex items-center">
                        <input
                            id="prod-available"
                            type="checkbox"
                            checked={available}
                            onChange={e => setAvailable(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="prod-available">Disponible</label>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
                        Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-accent-coral text-white rounded hover:bg-accent-coral-light transition">
                        {initial ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProductForm