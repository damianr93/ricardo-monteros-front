import React, { useState } from 'react'
import { Product } from '../data/types'


interface ProductCardProps {
    item: Product
    isLoggedIn: boolean
    onAddToCart: (item: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ item, isLoggedIn, onAddToCart }) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <div
                className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => setShowModal(true)}
            >
                <img
                    src={`http://localhost:3000/api/images/products/${item.img}`}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                    <h4 className="font-heading text-lg">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                    {isLoggedIn ? (
                        <div className="flex justify-between items-center">
                            <p className="text-accent-coral font-semibold">${item.price}</p>
                            <button
                                onClick={e => { e.stopPropagation(); onAddToCart(item) }}
                                className="bg-brand-green text-white px-3 py-1 rounded-md hover:bg-brand-green-light transition text-sm"
                            >
                                Añadir
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">Regístrate para ver el precio</p>
                    )}
                </div>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <img
                        src={`http://localhost:3000/api/images/products/${item.img}`}
                        alt={item.title}
                        className="max-h-[80vh] max-w-[90vw] object-contain rounded"
                    />
                </div>
            )}
        </>
    )
}

export default ProductCard