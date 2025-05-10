import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { Product } from '../../../data/types'

interface ProductFormProps {
    initial?: Product
    onSubmit: (data: Omit<Product, 'id' | 'user'>, imageFile?: File) => void
    onCancel: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ initial, onSubmit, onCancel }) => {
    const categories = useSelector((state: RootState) => state.categories.list)
    const [name, setName] = useState(initial?.name || '')
    const [price, setPrice] = useState(initial?.price.toString() || '0')
    const [available, setAvailable] = useState(initial?.available || false)
    const [categoryId, setCategoryId] = useState(initial?.category?.id || '')
    const [title, setTitle] = useState(initial?.title || '')
    const [description, setDescription] = useState(initial?.description || '')
    const [previewImage, setPreviewImage] = useState<string | undefined>(initial?.img)
    const [imageFile, setImageFile] = useState<File | undefined>(undefined)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (initial) {
            setName(initial.name)
            setPrice(initial.price.toString())
            setAvailable(initial.available)
            setCategoryId(initial.category?.id || '')
            setTitle(initial.title || '')
            setDescription(initial.description || '')
            setPreviewImage(initial.img)
            setImageFile(undefined)
        }
    }, [initial])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            // Crear una URL temporal para previsualizar la imagen
            const objectUrl = URL.createObjectURL(file)
            setPreviewImage(objectUrl)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Encontrar el objeto Category completo basado en el ID seleccionado
        const selectedCategory = categories.find(c => c.id === categoryId)

        if (!selectedCategory) {
            alert('Por favor selecciona una categoría válida')
            return
        }

        onSubmit({
            name,
            price: parseFloat(price),
            available,
            category: selectedCategory,
            title,
            description,
            img: previewImage
        }, imageFile)
    }

    return (
        
        <div className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-start justify-center z-[40] overflow-y-auto pt-10">

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
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
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

                    {/* Campo para subir imagen */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Imagen del producto
                        </label>

                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                Seleccionar archivo
                            </button>

                            <span className="text-sm text-gray-500">
                                {imageFile ? imageFile.name : 'Ningún archivo seleccionado'}
                            </span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {/* Vista previa de la imagen */}
                        {previewImage && (
                            <div className="mt-2">
                                <img
                                    src={`http://localhost:3000/api/images/products/${previewImage}`}
                                    alt="Vista previa"
                                    className="max-h-40 rounded border"
                                />
                            </div>
                        )}
                    </div>

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