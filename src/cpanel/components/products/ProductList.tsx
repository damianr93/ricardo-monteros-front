import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit, FaTrash, FaPlus, FaDownload, FaUpload } from 'react-icons/fa'
import { AppDispatch, RootState } from '../../../store/store'
import { createProduct, deleteProduct, fetchProducts, updateProduct, importProductsFromExcel } from '../../../store/products/thunks'
import { Product } from '../../../data/types'
import ProductForm from './ProductForm'
import CustomTable, { Action, Column } from '../customTable'
import Loading from '../../../components/loading'
import { exportProductsToExcel, importProductsFromExcel as importFromExcel, validateExcelData } from '../../../utils/excelUtils'
import { toast } from 'react-toastify'

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
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleExport = () => {
    if (products.length === 0) {
      toast.warning('No hay productos para exportar', {
        position: "top-right",
      })
      return
    }
    
    const filename = `productos_${new Date().toISOString().split('T')[0]}.xlsx`
    exportProductsToExcel(products, filename)
    
    toast.success('Productos exportados correctamente', {
      position: "top-right",
    })
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Por favor selecciona un archivo Excel (.xlsx o .xls)', {
        position: "top-right",
      })
      return
    }

    setIsImporting(true)
    try {
      const excelData = await importFromExcel(file)
      
      const validation = validateExcelData(excelData)
      
      if (!validation.valid) {
        toast.error(`Errores en el archivo: ${validation.errors.join(', ')}`, {
          position: "top-right",
        })
        return
      }

      // Confirmar importación
      const confirmed = window.confirm(
        `¿Estás seguro de que quieres actualizar ${excelData.length} productos? Esto modificará los productos existentes en la base de datos.`
      )
      
      if (confirmed) {
        await dispatch(importProductsFromExcel(excelData))
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar el archivo', {
        position: "top-right",
      })
    } finally {
      setIsImporting(false)
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading text-primary">Productos</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            disabled={loading || !!deletingId || products.length === 0}
            title="Exportar productos a Excel"
          >
            <FaDownload /> Exportar
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={loading || !!deletingId || isImporting}
            title="Actualizar productos desde Excel"
          >
            <FaUpload /> Importar
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 p-2 bg-primary text-secondary-lightest rounded hover:bg-primary-dark transition"
            disabled={loading || !!deletingId}
          >
            <FaPlus /> Añadir
          </button>
        </div>
      </div>

      {/* Input oculto para seleccionar archivo */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {loading || isImporting ? (
        <div className="flex flex-col justify-center items-center py-20">
          <Loading />
          {isImporting && (
            <p className="mt-4 text-secondary-darkest">Importando productos...</p>
          )}
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
          isLoading={loading || isImporting}
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
