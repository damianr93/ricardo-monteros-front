import React, { useState, useEffect, useRef } from 'react'
import SelectExistingImagesModal from './SelectImageModal'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { Product } from '../../../data/types'
import Loading from '../../../components/loading'

interface ProductFormProps {
  initial?: Product
  onSubmit: (data: Omit<Product, 'id' | 'user'>, imageFiles?: File[]) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const categories = useSelector((state: RootState) => state.categories.list)
  const categoriesLoading = useSelector((state: RootState) => state.categories.loading)

  // Estados, incluyendo ahora `codigo`
  const [name, setName] = useState(initial?.name || '')
  const [codigo, setCodigo] = useState(initial?.codigo?.toString() || '')
  const [price, setPrice] = useState(initial?.price?.toString() || '0')
  const [available, setAvailable] = useState(initial?.available || false)
  const [categoryId, setCategoryId] = useState(initial?.category?.id || '')
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(initial?.img ?? [])
  const [previewImages, setPreviewImages] = useState<string[]>(initial?.img ?? [])
  const [showExistingImagesModal, setShowExistingImagesModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setCodigo(initial.codigo?.toString() || '')
      setPrice(initial.price.toString())
      setAvailable(initial.available)
      setCategoryId(initial.category?.id || '')
      setTitle(initial.title || '')
      setDescription(initial.description || '')
      setExistingImages(initial.img ?? [])
      setPreviewImages(initial.img ?? [])
      setImageFiles([])
    }
  }, [initial])

  const getImageSrc = (src: string) =>
    src.startsWith('blob:') || src.startsWith('http')
      ? src
      : `${import.meta.env.VITE_BASE_AWS_URL}${src}`

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const previews = files.map(f => URL.createObjectURL(f))
    setImageFiles(prev => [...prev, ...files])
    setPreviewImages(prev => [...prev, ...previews])
  }

  const handleRemoveImage = (idx: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== idx))
    setImageFiles(prev => prev.filter((_, i) => i !== idx))
    setExistingImages(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSelectExisting = (selected: string[]) => {
    const newImgs = selected.filter(img => !previewImages.includes(img))
    setExistingImages(prev => [...prev, ...newImgs])
    setPreviewImages(prev => [...prev, ...newImgs])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const category = categories.find(c => c.id === categoryId)
    if (!category) return alert('Selecciona categoría')

    onSubmit(
      {
        name,
        codigo,                                    
        price: parseFloat(price),
        available,
        category,
        title,
        description,
        img: existingImages
      },
      imageFiles
    )
  }

  return (
    <div className="mt-20 fixed inset-0 bg-secondary-darkest bg-opacity-50 flex items-start justify-center z-40 overflow-auto pt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary-lightest p-6 rounded-lg shadow-lg max-w-lg w-full space-y-6 relative"
      >
        {(isSubmitting || categoriesLoading) && (
          <div className="absolute inset-0 bg-secondary-lightest bg-opacity-75 flex items-center justify-center rounded-lg">
            <Loading />
          </div>
        )}

        <h3 className="text-2xl font-heading text-primary text-center">
          {initial ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>

        <div className="space-y-4">
          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border border-secondary-darkest rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Código */}
          <input
            type="text"
            placeholder="Código (opcional)"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            className="w-full border border-secondary-darkest rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Precio */}
          <input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            className="w-full border border-secondary-darkest rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Categoría */}
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
            className="w-full border border-secondary-darkest rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>Selecciona categoría</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Título */}
          <input
            type="text"
            placeholder="Título (opcional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-secondary-darkest rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Descripción */}
          <textarea
            placeholder="Descripción (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border border-secondary-darkest rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Imágenes */}
          <div className="space-y-2">
            <label className="text-secondary-darkest">Imágenes del producto</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowExistingImagesModal(true)}
                className="px-4 py-2 bg-secondary-accent text-secondary-lightest rounded hover:bg-secondary-dark transition"
              >
                Seleccionar existentes
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-secondary-accent text-secondary-lightest rounded hover:bg-secondary-dark transition"
              >
                Seleccionar archivo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="grid grid-cols-3 gap-2">
              {previewImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative border border-secondary-darkest rounded overflow-hidden"
                >
                  <img
                    src={getImageSrc(src)}
                    alt="preview"
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-primary text-secondary-lightest p-1 rounded-full hover:bg-primary-dark transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={available}
                onChange={e => setAvailable(e.target.checked)}
                className="rounded focus:ring-primary"
              />
              <span className="text-secondary-darkest">Disponible</span>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-secondary-darkest rounded hover:bg-secondary-lightest transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || categoriesLoading}
            className="px-4 py-2 bg-primary text-secondary-lightest rounded hover:bg-primary-dark transition"
          >
            {isSubmitting ? 'Procesando...' : initial ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>

      {/* Modal de selección de imágenes existentes */}
      {showExistingImagesModal && (
        <SelectExistingImagesModal
          onClose={() => setShowExistingImagesModal(false)}
          onSelect={handleSelectExisting}
          initialSelected={existingImages}
        />
      )}
    </div>
  )
}

export default ProductForm