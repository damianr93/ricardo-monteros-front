import React, { useState, useEffect } from 'react'
import { Category } from '../../../data/types'
import Loading from '../../../components/loading'

interface CategoryFormProps {
  initial?: Category | null
  onSubmit: (name: string, available: boolean) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [name, setName] = useState(initial?.name || '')
  const [available, setAvailable] = useState(initial?.available || false)

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setAvailable(initial.available)
    }
  }, [initial])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(name, available)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-sm w-full relative">
        {/* Overlay de carga */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded">
            <Loading />
          </div>
        )}

        <h3 className="text-lg font-heading mb-4">
          {initial ? 'Editar Categoría' : 'Nueva Categoría'}
        </h3>
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <input
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            id="available"
            type="checkbox"
            checked={available}
            onChange={e => setAvailable(e.target.checked)}
            className="mr-2"
            disabled={isSubmitting}
          />
          <label htmlFor="available">Disponible</label>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-accent-coral text-white rounded hover:bg-accent-coral-light transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : initial ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm