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
    <div className="fixed inset-0 bg-secondary-darkest bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-secondary-lightest p-6 rounded-lg shadow-lg max-w-sm w-full relative">
        {/* Overlay de carga */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-secondary-lightest bg-opacity-75 flex items-center justify-center rounded-lg">
            <Loading />
          </div>
        )}

        <h3 className="text-xl font-heading text-primary mb-4">
          {initial ? 'Editar Categoría' : 'Nueva Categoría'}
        </h3>

        <div className="mb-4">
          <label className="block mb-1 text-secondary-darkest">Nombre</label>
          <input
            className="w-full border border-secondary-darkest rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="h-4 w-4 text-primary focus:ring-primary border-secondary-darkest rounded"
            disabled={isSubmitting}
          />
          <label htmlFor="available" className="ml-2 text-secondary-darkest">Disponible</label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-secondary-darkest rounded hover:bg-secondary-light transition"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-secondary-lightest rounded hover:bg-primary-dark transition disabled:opacity-50"
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
