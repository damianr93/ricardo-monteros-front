import React, { useState, useRef, useCallback } from 'react'
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

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const imageRef = useRef<HTMLImageElement>(null)
  const images = Array.isArray(item.img) ? item.img : [item.img]

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImage(prev => (prev + 1) % images.length)
    resetZoom()
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImage(prev => (prev - 1 + images.length) % images.length)
    resetZoom()
  }

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleImgError: React.DOMAttributes<HTMLImageElement>['onError'] = e => {
    e.currentTarget.onerror = null
    e.currentTarget.src = DEFAULT_IMG
  }

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const container = e.currentTarget as HTMLElement
      const rect = container.getBoundingClientRect()

      const mouseX = e.clientX - rect.left - rect.width / 2
      const mouseY = e.clientY - rect.top - rect.height / 2

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.min(Math.max(scale * zoomFactor, 0.5), 5)

      const scaleChange = newScale / scale
      const newX = mouseX - (mouseX - position.x) * scaleChange
      const newY = mouseY - (mouseY - position.y) * scaleChange

      setScale(newScale)
      setPosition({ x: newX, y: newY })
    },
    [scale, position]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale > 1) {
        e.preventDefault()
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    },
    [scale, position]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || scale <= 1) return

      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, scale, dragStart]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (scale > 1) {
        resetZoom()
      } else {
        setScale(2)
        setPosition({ x: 0, y: 0 })
      }
    },
    [scale]
  )

  const closeModal = () => {
    setShowModal(false)
    resetZoom()
  }

  React.useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'

      const preventWheelScroll = (e: WheelEvent) => e.preventDefault()
      const preventTouchScroll = (e: TouchEvent) => e.preventDefault()

      document.addEventListener('wheel', preventWheelScroll, { passive: false, capture: true })
      document.addEventListener('touchmove', preventTouchScroll, { passive: false })

      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('wheel', preventWheelScroll, true)
        document.removeEventListener('touchmove', preventTouchScroll)
      }
    }
  }, [showModal])

  return (
    <>
      <div
        className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer relative group"
        onClick={() => setShowModal(true)}
      >
        {/* Imagen principal con navegación */}
        <div className="relative w-full h-48 bg-white p-2 overflow-hidden flex items-center justify-center">
          <img
            src={`${import.meta.env.VITE_BASE_AWS_URL}${images[currentImage]}`}
            alt={item.title}
            onError={handleImgError}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-95"
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
          <h4 className="font-heading text-lg text-secondary-darkest">{item.title}</h4>
          <p className="text-xs text-secondary-muted">Código: {item.codigo}</p>
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

      {/* Modal de galería con zoom */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-hidden"
          onClick={closeModal}
          style={{ touchAction: 'none' }}
          onWheel={e => e.stopPropagation()}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            style={{
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              overflow: 'hidden'
            }}
          >
            {/* Controles de navegación */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-secondary-lightest p-3 rounded-full hover:bg-secondary-light transition z-10"
                >
                  ◀
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-secondary-lightest p-3 rounded-full hover:bg-secondary-light transition z-10"
                >
                  ▶
                </button>
              </>
            )}

            {/* Imagen con zoom */}
            <div
              className="flex items-center justify-center w-full h-full"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              <img
                ref={imageRef}
                src={`${import.meta.env.VITE_BASE_AWS_URL}${images[currentImage]}`}
                alt={`${item.title} ${currentImage + 1}`}
                onError={handleImgError}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded"
                draggable={false}
              />
            </div>

            {/* Indicadores de zoom */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
              {Math.round(scale * 100)}%
            </div>

            {/* Instrucciones */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm text-center">
              Rueda: Zoom • Doble click: Reset • Arrastrar cuando ampliada
            </div>

            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-secondary-lightest text-secondary-darkest p-2 rounded-full hover:bg-secondary-light transition text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard
