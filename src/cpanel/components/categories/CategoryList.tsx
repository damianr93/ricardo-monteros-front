import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { AppDispatch, RootState } from '../../../store/store'
import { Category } from '../../../data/types'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../../../store/categories/thunks'
import CategoryForm from './CategoryForm'
import CustomTable, { Action, Column } from './../customTable';


const columns: Column[] = [
  { field: "name", headerName: "Nombre categoria", align: "left" },
  { field: "available", headerName: "Activa", align: "left" },

];

const actions: Action[] = [
  { name: "editar", icon: <FaEdit />, color: "primary", tooltip: "Editar R/O" },
  { name: "eliminar", icon: <FaTrash />, color: "secondary", tooltip: "Eliminar" }
];


const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: categories, loading, error } = useSelector((state: RootState) => state.categories)
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  const handleAdd = () => { setEditing(null); setShowForm(true) }
  const handleSubmit = (name: string, available: boolean) => {
    if (editing) dispatch(updateCategory(editing.id, { name, available }))
    else dispatch(createCategory({ name, available }))
    setShowForm(false)
  }

  const handleActionClick = (action: Action, row: any) => {
    if (action.name === "editar") {
      setEditing(row);
      setShowForm(true)
    } else if (action.name === "eliminar") {
      dispatch(deleteCategory(row.id))
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading">Categorías</h2>
        <button onClick={handleAdd} className="p-2 bg-accent-coral text-white rounded"><FaPlus /> Añadir</button>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <CustomTable
        columns={columns}
        data={categories}
        actions={actions}
        onActionClick={handleActionClick}

      />

      {showForm && <CategoryForm initial={editing} onCancel={() => setShowForm(false)} onSubmit={handleSubmit} />}
    </div>
  )
}

export default CategoryList