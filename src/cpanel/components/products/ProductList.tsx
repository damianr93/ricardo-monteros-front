import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { AppDispatch, RootState } from '../../../store/store'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../../../store/products/thunks'
import { Product } from '../../../data/types'
import ProductForm from './ProductForm'
import CustomTable, { Action, Column } from '../customTable'

const columns: Column[] = [
  { field: "name", headerName: "Nombre Producto", align: "left" },
  { field: "title", headerName: "Titulo producto", align: "left" },
  { field: "description", headerName: "Descripcion", align: "left" },
  { field: "category.name", headerName: "Categoria", align: "left" },
  { field: "price", headerName: "Precio", align: "left" },
  { field: "available", headerName: "Activa", align: "left" },
];

const actions: Action[] = [
  { name: "editar", icon: <FaEdit />, color: "primary", tooltip: "Editar R/O" },
  { name: "eliminar", icon: <FaTrash />, color: "secondary", tooltip: "Eliminar" }
];

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: products, loading, error } = useSelector((state: RootState) => state.products)
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  console.log(products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAdd = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleSubmit = (
    data: Omit<Product, 'id' | 'user'>,
    imageFiles?: File[]
  ) => {
    if (editing?.id) {
      dispatch(updateProduct(editing.id, data, imageFiles));
    } else {
      dispatch(createProduct(data, imageFiles));
    }
    setShowForm(false);
  };

  const handleActionClick = (action: Action, row: any) => {
    if (action.name === "editar") {
      setEditing(row);
      setShowForm(true)
    } else if (action.name === "eliminar") {
      dispatch(deleteProduct(row.id))
    }
  };

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


      <CustomTable
        columns={columns}
        data={products}
        actions={actions}
        onActionClick={handleActionClick}

      />
      {showForm && (
        <ProductForm
          initial={editing || undefined}
          onSubmit={(data, images) => handleSubmit(data, images)}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default ProductList
