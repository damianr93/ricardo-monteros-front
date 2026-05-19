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
  { field: 'name',          headerName: 'Nombre',     align: 'left'   },
  { field: 'title',         headerName: 'Título',     align: 'left'   },
  { field: 'category.name', headerName: 'Categoría',  align: 'left'   },
  { field: 'codigo',        headerName: 'Código',     align: 'left'   },
  { field: 'price',         headerName: 'Precio',     align: 'right'  },
  { field: 'available',     headerName: 'Disponible', align: 'center' },
]

const actions: Action[] = [
  { name: 'editar',   icon: <FaEdit />,  color: 'primary',   tooltip: 'Editar'    },
  { name: 'eliminar', icon: <FaTrash />, color: 'secondary', tooltip: 'Eliminar'  },
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

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  const handleSubmit = async (data: Omit<Product, 'id' | 'user'>, imageFiles?: File[]) => {
    setIsSubmitting(true)
    try {
      if (editing?.id) {
        await dispatch(updateProduct(editing.id, data, imageFiles))
      } else {
        await dispatch(createProduct(data, imageFiles))
        dispatch(fetchProducts())
      }
      setShowForm(false)
    } catch {
      // toast shown by thunk — keep form open
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
      } catch {
        // toast shown by thunk
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleExport = async () => {
    if (products.length === 0) { toast.warning('No hay productos para exportar', { position: 'top-right' }); return }
    try {
      await exportProductsToExcel(products, `productos_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Exportado correctamente', { position: 'top-right' })
    } catch {
      toast.error('No se pudo exportar el archivo', { position: 'top-right' })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.match(/\.xlsx?$/)) {
      toast.error('Selecciona un archivo Excel (.xlsx o .xls)', { position: 'top-right' })
      return
    }
    setIsImporting(true)
    try {
      const excelData = await importFromExcel(file)
      const validation = validateExcelData(excelData)
      if (!validation.valid) {
        toast.error(`Errores: ${validation.errors.join(', ')}`, { position: 'top-right' })
        return
      }
      if (window.confirm(`¿Actualizar ${excelData.length} productos desde el archivo?`)) {
        await dispatch(importProductsFromExcel(excelData))
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al procesar el archivo', { position: 'top-right' })
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading || isImporting) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loading />
        {isImporting && <p className="text-secondary-darkest text-sm">Importando productos...</p>}
      </div>
    )
  }

  if (error) return <p className="text-red-600 p-4">{error}</p>

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-heading text-primary">
          Productos
          <span className="ml-2 text-sm font-body text-secondary-light font-normal">({products.length})</span>
        </h2>
        <div className="flex gap-2">
          <button onClick={handleExport} disabled={products.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition">
            <FaDownload size={12} /> Exportar
          </button>
          <button onClick={() => fileInputRef.current?.click()} disabled={isImporting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition">
            <FaUpload size={12} /> Importar
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true) }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition">
            <FaPlus size={12} /> Añadir
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />

      <CustomTable
        columns={columns}
        data={products}
        actions={actions}
        onActionClick={handleActionClick}
        pagination={{ rowsPerPage: 20, rowsPerPageOptions: [20, 50, 100] }}
        isDeletingId={deletingId}
        isLoading={loading || isImporting}
        searchPlaceholder="Buscar por nombre, título, código o categoría..."
      />

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
