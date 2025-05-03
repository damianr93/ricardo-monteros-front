// File: src/components/products/ProductList.tsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { AppDispatch, RootState } from '../../../store/store'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../../../store/products/thunks'
import { Product } from '../../../data/types'
import ProductForm from './ProductForm'

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: products, loading, error } = useSelector((state: RootState) => state.products)
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAdd = () => {
    setEditing(null)
    setShowForm(true)
  }
  const handleEdit = (p: Product) => {
    setEditing(p)
    setShowForm(true)
  }
  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar producto?')) {
      dispatch(deleteProduct(id))
    }
  }
  const handleSubmit = (data: Omit<Product, 'id' | 'user'>, updateId?: string) => {
    if (updateId) {
      dispatch(updateProduct(updateId, data))
    } else {
      dispatch(createProduct(data))
    }
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading">Productos</h2>
        <button onClick={handleAdd} className="p-2 bg-accent-coral text-white rounded">
          <FaPlus /> Añadir
        </button>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
            <div>
              <strong>{p.name}</strong> — ${p.price.toFixed(2)} {p.available ? '(Activo)' : '(Inactivo)'}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(p)} className="p-1 hover:text-brand-green">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-1 hover:text-accent-coral">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showForm && (
        <ProductForm
          initial={editing || undefined}
          onSubmit={(data) => handleSubmit(data, editing?.id)}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default ProductList
