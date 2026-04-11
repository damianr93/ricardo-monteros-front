import ExcelJS from 'exceljs'
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

function cellToPrimitive(cell: ExcelJS.Cell): string | number | boolean | undefined {
  const v = cell.value
  if (v === null || v === undefined) return undefined
  if (typeof v === 'number' || typeof v === 'boolean') return v
  if (typeof v === 'string') return v
  if (typeof v === 'object' && v !== null && 'result' in v) {
    const r = (v as { result?: unknown }).result
    if (typeof r === 'number' || typeof r === 'boolean' || typeof r === 'string') return r
  }
  if (typeof v === 'object' && v !== null && 'text' in v) {
    return String((v as { text: string }).text)
  }
  return String(v)
}

export async function exportProductsToExcel(
  products: Product[],
  filename: string = 'productos.xlsx'
): Promise<void> {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Productos')

  const rows = products.map((product) => ({
    id: product.id,
    name: product.name,
    title: product.title || '',
    description: product.description || '',
    category: product.category.name,
    codigo: product.codigo || '',
    price: product.price,
    available: product.available,
    img: product.img
      ? Array.isArray(product.img)
        ? product.img.join(', ')
        : product.img
      : '',
  }))

  ws.columns = [
    { header: 'id', key: 'id', width: 12 },
    { header: 'name', key: 'name', width: 25 },
    { header: 'title', key: 'title', width: 25 },
    { header: 'description', key: 'description', width: 40 },
    { header: 'category', key: 'category', width: 20 },
    { header: 'codigo', key: 'codigo', width: 15 },
    { header: 'price', key: 'price', width: 10 },
    { header: 'available', key: 'available', width: 10 },
    { header: 'img', key: 'img', width: 30 },
  ]

  rows.forEach((r) => ws.addRow(r))

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function importProductsFromExcel(file: File): Promise<ExcelProduct[]> {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(await file.arrayBuffer())
  const ws = wb.worksheets[0]
  if (!ws) {
    throw new Error('El archivo no contiene hojas')
  }

  const headerRow = ws.getRow(1)
  const headers: string[] = []
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber - 1] = String(cellToPrimitive(cell) ?? '').trim()
  })

  const jsonData: ExcelProduct[] = []

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return

    const rowObj: Record<string, unknown> = {}
    for (let i = 0; i < headers.length; i++) {
      const key = headers[i]
      if (!key) continue
      const cell = row.getCell(i + 1)
      rowObj[key] = cellToPrimitive(cell)
    }

    jsonData.push(rowObj as unknown as ExcelProduct)
  })

  const validatedData = jsonData.map((row, index) => {
    if (!row.name || !row.category || row.price === undefined) {
      throw new Error(
        `Fila ${index + 2}: Faltan campos requeridos (name, category, price)`
      )
    }

    return {
      ...row,
      price: Number(row.price),
      available: Boolean(row.available),
      codigo: row.codigo || undefined,
    }
  })

  return validatedData
}

export const validateExcelData = (data: ExcelProduct[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  data.forEach((row, index) => {
    const rowNum = index + 2

    if (row.name === undefined || row.name === null || String(row.name).trim() === '') {
      errors.push(`Fila ${rowNum}: El nombre es requerido`)
    }

    if (row.category === undefined || row.category === null || String(row.category).trim() === '') {
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
    errors,
  }
}
