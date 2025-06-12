// File: src/components/products/CategoryList.tsx
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../../../store/categories/thunks'
import { Category } from '../../../data/types'
import CategoryForm from './CategoryForm'
import CustomTable, { Action, Column } from '../customTable'
import Loading from '../../../components/loading'

const columns: Column[] = [
  { field: 'name', headerName: 'Nombre Categoría', align: 'left' },
  { field: 'available', headerName: 'Activa', align: 'center' }
]

const actions: Action[] = [
  { name: 'editar', icon: <FaEdit />, color: 'primary', tooltip: 'Editar' },
  { name: 'eliminar', icon: <FaTrash />, color: 'secondary', tooltip: 'Eliminar' }
]

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: categories, loading, error } = useSelector((state: RootState) => state.categories)
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleAdd = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleSubmit = async (name: string, available: boolean) => {
    setIsSubmitting(true)
    try {
      if (editing) {
        await dispatch(updateCategory(editing.id, { name, available }))
      } else {
        await dispatch(createCategory({ name, available }))
      }
      setShowForm(false)
    } catch (err) {
      console.error('Error al guardar la categoría:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleActionClick = async (action: Action, row: any) => {
    if (action.name === 'editar') {
      setEditing(row)
      setShowForm(true)
    } else if (action.name === 'eliminar') {
      setDeletingId(row.id)
      try {
        await dispatch(deleteCategory(row.id))
      } catch (err) {
        console.error('Error al eliminar la categoría:', err)
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading text-primary">Categorías</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 p-2 bg-primary text-secondary-lightest rounded hover:bg-primary-dark transition"
          disabled={loading || !!deletingId}
        >
          <FaPlus /> Añadir
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-accent-coral p-4 bg-secondary-lightest rounded">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-center py-10 text-secondary-muted">No hay categorías disponibles</p>
      ) : (
        <CustomTable
          columns={columns}
          data={categories}
          actions={actions}
          onActionClick={handleActionClick}
          isDeletingId={deletingId}
          isLoading={loading}
        />
      )}

      {showForm && (
        <CategoryForm
          initial={editing}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

export default CategoryList
