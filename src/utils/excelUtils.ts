import * as XLSX from 'xlsx'
import { Product } from '../data/types'

export interface ExcelProduct {
  id?: string
  name: string
  title?: string
  description?: string
  category: string
  codigo?: string | number
  price: number
  available: boolean
  img?: string
}

export const exportProductsToExcel = (products: Product[], filename: string = 'productos.xlsx') => {
  // Convertir productos a formato Excel
  const excelData: ExcelProduct[] = products.map(product => ({
    id: product.id,
    name: product.name,
    title: product.title || '',
    description: product.description || '',
    category: product.category.name,
    codigo: product.codigo || '',
    price: product.price,
    available: product.available,
    img: product.img ? (Array.isArray(product.img) ? product.img.join(', ') : product.img) : ''
  }))

  // Crear workbook y worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)

  // Ajustar ancho de columnas
  const colWidths = [
    { wch: 10 }, // id
    { wch: 25 }, // name
    { wch: 25 }, // title
    { wch: 40 }, // description
    { wch: 20 }, // category
    { wch: 15 }, // codigo
    { wch: 10 }, // price
    { wch: 10 }, // available
    { wch: 30 }  // img
  ]
  ws['!cols'] = colWidths

  // Agregar worksheet al workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Productos')

  // Descargar archivo
  XLSX.writeFile(wb, filename)
}

export const importProductsFromExcel = (file: File): Promise<ExcelProduct[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Obtener la primera hoja
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelProduct[]
        
        // Validar datos
        const validatedData = jsonData.map((row, index) => {
          if (!row.name || !row.category || row.price === undefined) {
            throw new Error(`Fila ${index + 2}: Faltan campos requeridos (name, category, price)`)
          }
          
          return {
            ...row,
            price: Number(row.price),
            available: Boolean(row.available),
            codigo: row.codigo || undefined
          }
        })
        
        resolve(validatedData)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

export const validateExcelData = (data: ExcelProduct[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  data.forEach((row, index) => {
    const rowNum = index + 2 // +2 porque Excel empieza en 1 y la primera fila son headers
    
    if (!row.name || row.name.trim() === '') {
      errors.push(`Fila ${rowNum}: El nombre es requerido`)
    }
    
    if (!row.category || row.category.trim() === '') {
      errors.push(`Fila ${rowNum}: La categoría es requerida`)
    }
    
    if (row.price === undefined || row.price === null || isNaN(Number(row.price))) {
      errors.push(`Fila ${rowNum}: El precio debe ser un número válido`)
    }
    
    if (Number(row.price) < 0) {
      errors.push(`Fila ${rowNum}: El precio no puede ser negativo`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}
