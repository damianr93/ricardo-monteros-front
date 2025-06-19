import React, { useState } from 'react'
import { Product } from '../data/types'

const DEFAULT_IMG = '/img/logo_con_fondo.png'

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
    setCurrentImage(prev => (prev + 1) % images.length)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImage(prev => (prev - 1 + images.length) % images.length)
  }

  const handleImgError: React.DOMAttributes<HTMLImageElement>['onError'] = e => {
    e.currentTarget.onerror = null // prevenir loop si DEFAULT_IMG falla
    e.currentTarget.src = DEFAULT_IMG
  }

  return (
    <>
      <div
        className="bg-primary-DEFAULT rounded-lg overflow-hidden shadow-lg cursor-pointer relative group"
        onClick={() => setShowModal(true)}
      >
        {/* Imagen principal con navegación */}
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={`${import.meta.env.VITE_BASE_AWS_URL}${images[currentImage]}`}
            alt={item.title}
            onError={handleImgError}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-95"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-secondary-lightest bg-opacity-80 text-secondary-darkest p-1 rounded-full text-sm hidden group-hover:block"
              >
                ◀
              </button>
              <button
                onClick={handleNext}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-secondary-lightest bg-opacity-80 text-secondary-darkest p-1 rounded-full text-sm hidden group-hover:block"
              >
                ▶
              </button>
            </>
          )}
        </div>

        {/* Info del producto */}
        <div className="p-4 space-y-2">
          {/* Título */}
          <h4 className="font-heading text-lg text-secondary-darkest">{item.title}</h4>
          {/* Código en tamaño extra pequeño */}
          <p className="text-xs text-secondary-muted">Código: {item.codigo}</p>
          {/* Descripción */}
          <p className="text-secondary-muted text-sm">{item.description}</p>

          {isLoggedIn ? (
            <div className="flex justify-between items-center">
              <p className="text-primary font-semibold">${item.price}</p>
              <button
                onClick={e => { e.stopPropagation(); onAddToCart(item) }}
                className="bg-primary text-secondary-lightest px-3 py-1 rounded-md hover:bg-primary-dark transition text-sm"
              >
                Añadir
              </button>
            </div>
          ) : (
            <p className="text-secondary-muted text-sm italic">
              Regístrate para ver el precio
            </p>
          )}
        </div>
      </div>

      {/* Modal de galería */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-h-[80vh] max-w-[90vw] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-secondary-lightest p-2 rounded-full hover:bg-secondary-light transition"
            >
              ◀
            </button>
            <img
              src={`${import.meta.env.VITE_BASE_AWS_URL}${images[currentImage]}`}
              alt={`${item.title} ${currentImage + 1}`}
              onError={handleImgError}
              className="max-h-[80vh] max-w-full object-contain rounded"
            />
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-secondary-lightest p-2 rounded-full hover:bg-secondary-light transition"
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