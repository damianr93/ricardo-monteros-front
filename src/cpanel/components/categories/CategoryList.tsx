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
  { field: 'name',      headerName: 'Categoría',  align: 'left'   },
  { field: 'available', headerName: 'Disponible', align: 'center' },
]

const actions: Action[] = [
  { name: 'editar',   icon: <FaEdit />,  color: 'primary',   tooltip: 'Editar'   },
  { name: 'eliminar', icon: <FaTrash />, color: 'secondary', tooltip: 'Eliminar' },
]

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: categories, loading, error } = useSelector((state: RootState) => state.categories)
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  const handleSubmit = async (name: string, available: boolean) => {
    setIsSubmitting(true)
    try {
      if (editing) {
        await dispatch(updateCategory(editing.id, { name, available }))
      } else {
        await dispatch(createCategory({ name, available }))
      }
      setShowForm(false)
    } catch {
      // toast shown by thunk — keep form open
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
      } catch {
        // toast shown by thunk
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loading />
      </div>
    )
  }

  if (error) return <p className="text-red-600 p-4">{error}</p>

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-heading text-primary">
          Categorías
          <span className="ml-2 text-sm font-body text-secondary-light font-normal">({categories.length})</span>
        </h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          disabled={loading || !!deletingId}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-40 transition"
        >
          <FaPlus size={12} /> Añadir
        </button>
      </div>

      <CustomTable
        columns={columns}
        data={categories}
        actions={actions}
        onActionClick={handleActionClick}
        isDeletingId={deletingId}
        isLoading={loading}
        hideSearch
      />

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
