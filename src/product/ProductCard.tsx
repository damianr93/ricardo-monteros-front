import React, { useState } from 'react'
import { Product } from '../data/types'

interface ProductCardProps {
    item: Product
    isLoggedIn: boolean
    onAddToCart: (item: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ item, isLoggedIn, onAddToCart }) => {
    const [showModal, setShowModal] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)
    const images = Array.isArray(item.img) ? item.img : [item.img]

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentImage((prev) => (prev + 1) % images.length)
    }

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <>
            <div
                className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer relative group"
                onClick={() => setShowModal(true)}
            >
                {/* Imagen principal con navegación */}
                <div className="relative w-full h-48 overflow-hidden">
                    <img
                        src={`${import.meta.env.VITE_BASE_AWS_URL}${images[currentImage]}`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-95"
                    />
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-1 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 text-black p-1 rounded-full text-sm hidden group-hover:block"
                            >
                                ◀
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 text-black p-1 rounded-full text-sm hidden group-hover:block"
                            >
                                ▶
                            </button>
                        </>
                    )}
                </div>

                {/* Info */}
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

            {/* Modal con imágenes */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative max-h-[80vh] max-w-[90vw] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handlePrev}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full"
                        >
                            ◀
                        </button>
                        <img
                            src={`${import.meta.env.VITE_BASE_AWS_URL}${images[currentImage]}`}
                            alt={`${item.title} ${currentImage + 1}`}
                            className="max-h-[80vh] max-w-full object-contain rounded"
                        />
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full"
                        >
                            ▶
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductCard
