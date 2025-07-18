import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { AppDispatch, RootState } from '../../../store/store'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../../../store/products/thunks'
import { Product } from '../../../data/types'
import ProductForm from './ProductForm'
import CustomTable, { Action, Column } from '../customTable'
import Loading from '../../../components/loading'

const columns: Column[] = [
  { field: 'name', headerName: 'Nombre Producto', align: 'left' },
  { field: 'title', headerName: 'Título Producto', align: 'left' },
  { field: 'description', headerName: 'Descripción', align: 'left' },
  { field: 'category.name', headerName: 'Categoría', align: 'left' },
  { field: 'codigo', headerName: 'codigo', align: 'left' },
  { field: 'price', headerName: 'Precio', align: 'left' },
  { field: 'available', headerName: 'Activa', align: 'left' },
]

const actions: Action[] = [
  { name: 'editar', icon: <FaEdit />, color: 'primary', tooltip: 'Editar' },
  { name: 'eliminar', icon: <FaTrash />, color: 'secondary', tooltip: 'Eliminar' }
]

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: products, loading, error } = useSelector((state: RootState) => state.products)
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAdd = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleSubmit = async (
    data: Omit<Product, 'id' | 'user'>,
    imageFiles?: File[]
  ) => {
    setIsSubmitting(true)
    try {
      if (editing?.id) {
        await dispatch(updateProduct(editing.id, data, imageFiles))
      } else {
        await dispatch(createProduct(data, imageFiles))
      }
      setShowForm(false)
    } catch (err) {
      console.error('Error al guardar el producto:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleActionClick = async (action: Action, row: Product) => {
    if (action.name === 'editar') {
      setEditing(row)
      setShowForm(true)
    } else if (action.name === 'eliminar') {
      setDeletingId(row.id)
      try {
        await dispatch(deleteProduct(row.id))
      } catch (err) {
        console.error('Error al eliminar el producto:', err)
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading text-primary">Productos</h2>
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
      ) : products.length === 0 ? (
        <p className="text-center py-10 text-secondary-muted">No hay productos disponibles</p>
      ) : (
        <CustomTable
          columns={columns}
          data={products}
          actions={actions}
          onActionClick={handleActionClick}
          isDeletingId={deletingId}
          isLoading={loading}
        />
      )}

      {showForm && (
        <ProductForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

export default ProductList
