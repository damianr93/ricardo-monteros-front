import { Category } from '../../data/types'
import { AppThunk } from '../store'
import { fetchWithAuth } from '../logged/thunks'
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addSuccess,
  updateSuccess,
  removeSuccess
} from './slice'
import { toast } from 'react-toastify'

const getApiError = async (res: Response, fallback: string): Promise<string> => {
  try {
    const body = await res.json()
    return body.error || body.message || fallback
  } catch {
    return fallback
  }
}

export const fetchCategories = (): AppThunk => async dispatch => {
  dispatch(fetchStart())
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/categories?limit=100`)
    if (!res.ok) throw new Error(await getApiError(res, 'Error al cargar categorías'))
    const json = await res.json() as { categories: Category[] }
    dispatch(fetchSuccess(json.categories))
  } catch (err: any) {
    dispatch(fetchFailure(err.message))
    toast.error(err.message || 'Error al cargar categorías', { position: 'top-right' })
  }
}

export const createCategory = (payload: { name: string; available: boolean }): AppThunk => async dispatch => {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(await getApiError(res, 'Error al crear la categoría'))
    const data: Category = await res.json()
    dispatch(addSuccess(data))
    toast.success('Categoría creada correctamente', { position: 'top-right' })
  } catch (err: any) {
    dispatch(fetchFailure(err.message))
    toast.error(err.message || 'Error al crear la categoría', { position: 'top-right' })
    throw err
  }
}

export const updateCategory = (id: string, payload: { name: string; available: boolean }): AppThunk => async dispatch => {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(await getApiError(res, 'Error al actualizar la categoría'))
    const data: Category = await res.json()
    dispatch(updateSuccess(data))
    toast.success('Categoría actualizada correctamente', { position: 'top-right' })
  } catch (err: any) {
    dispatch(fetchFailure(err.message))
    toast.error(err.message || 'Error al actualizar la categoría', { position: 'top-right' })
    throw err
  }
}

export const deleteCategory = (id: string): AppThunk => async dispatch => {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/categories/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await getApiError(res, 'Error al eliminar la categoría'))
    dispatch(removeSuccess(id))
    toast.success('Categoría eliminada', { position: 'top-right' })
  } catch (err: any) {
    dispatch(fetchFailure(err.message))
    toast.error(err.message || 'Error al eliminar la categoría', { position: 'top-right' })
    throw err
  }
}
