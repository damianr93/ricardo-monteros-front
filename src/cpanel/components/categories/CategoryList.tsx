import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { AppDispatch, RootState } from '../../../store/store'
import { Category } from '../../../data/types'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../../../store/categories/thunks'
import CategoryForm from './CategoryForm'
import CustomTable, { Action, Column } from './../customTable'
import Loading from '../../../components/loading'

const columns: Column[] = [
  { field: "name", headerName: "Nombre categoria", align: "left" },
  { field: "available", headerName: "Activa", align: "left" },
];

const actions: Action[] = [
  { name: "editar", icon: <FaEdit />, color: "primary", tooltip: "Editar R/O" },
  { name: "eliminar", icon: <FaTrash />, color: "secondary", tooltip: "Eliminar" }
];

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>() as AppDispatch
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
    } catch (error) {
      console.error('Error al guardar la categoría:', error)
      // Opcionalmente puedes mostrar un mensaje de error aquí
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleActionClick = async (action: Action, row: any) => {
    if (action.name === "editar") {
      setEditing(row)
      setShowForm(true)
    } else if (action.name === "eliminar") {
      try {
        // Establece el ID que está siendo eliminado
        setDeletingId(row.id)
        // Ejecuta la acción de eliminación
        await dispatch(deleteCategory(row.id))
      } catch (error) {
        console.error('Error al eliminar la categoría:', error)
      } finally {
        // Elimina el ID al finalizar, independientemente del resultado
        setDeletingId(null)
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading">Categorías</h2>
        <button
          onClick={handleAdd}
          className="p-2 bg-accent-coral text-white rounded flex items-center gap-2"
          disabled={loading || deletingId !== null}
        >
          <FaPlus /> Añadir
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-red-500 p-4 bg-red-50 rounded">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No hay categorías disponibles</p>
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