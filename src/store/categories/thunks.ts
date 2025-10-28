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


export const fetchCategories = (): AppThunk => async dispatch => {
  dispatch(fetchStart())
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`)
    if (!res.ok) throw new Error('Error fetching categories')
      const json = await res.json() as { categories: Category[] }
    dispatch(fetchSuccess(json.categories))
  } catch (err: any) {
    dispatch(fetchFailure(err.message))
  }
}

export const createCategory = (payload: { name: string; available: boolean }): AppThunk => async dispatch => {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Error creating category')
    const data: Category = await res.json()
    dispatch(addSuccess(data))
  } catch (err: any) {
    dispatch(fetchFailure(err.message))
  }
}

export const updateCategory = (id: string, payload: { name: string; available: boolean }): AppThunk => async dispatch => {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Error updating category')
    const data: Category = await res.json()
    dispatch(updateSuccess(data))
  } catch (err: any) {
    dispatch(fetchFailure(err.message))
  }
}

export const deleteCategory = (id: string): AppThunk => async dispatch => {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/categories/${id}`, 
      { method: 'DELETE' })
    if (!res.ok) throw new Error('Error deleting category')
    dispatch(removeSuccess(id))
  } catch (err: any) {
    dispatch(fetchFailure(err.message))
  }
}