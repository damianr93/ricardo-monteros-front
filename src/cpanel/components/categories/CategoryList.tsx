import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { AppDispatch, RootState } from '../../../store/store'
import { Category } from '../../../data/types'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../../../store/categories/thunks'
import CategoryForm from './CategoryForm'

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: categories, loading, error } = useSelector((state: RootState) => state.categories)
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  const handleAdd = () => { setEditing(null); setShowForm(true) }
  const handleEdit = (cat: Category) => { setEditing(cat); setShowForm(true) }
  const handleDelete = (id: string) => { if (window.confirm('¿Eliminar categoría?')) dispatch(deleteCategory(id)) }
  const handleSubmit = (name: string, available: boolean) => {
    if (editing) dispatch(updateCategory(editing.id, { name, available }))
    else dispatch(createCategory({ name, available }))
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading">Categorías</h2>
        <button onClick={handleAdd} className="p-2 bg-accent-coral text-white rounded"><FaPlus /> Añadir</button>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {categories.map((cat: Category) => (
          <li key={cat.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
            <span>{cat.name} {cat.available ? '(Activo)' : '(Inactivo)'}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(cat)} className="p-1 hover:text-brand-green"><FaEdit /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-1 hover:text-accent-coral"><FaTrash /></button>
            </div>
          </li>
        ))}
      </ul>
      {showForm && <CategoryForm initial={editing} onCancel={() => setShowForm(false)} onSubmit={handleSubmit} />}
    </div>
  )
}

export default CategoryList