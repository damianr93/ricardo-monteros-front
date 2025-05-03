import { Product } from '../../data/types'
import { baseUrl } from '../API'
import { AppThunk } from '../store'
import {
  prodFetchStart,
  prodFetchSuccess,
  prodFetchFailure,
  prodAddSuccess,
  prodUpdateSuccess,
  prodRemoveSuccess
} from './slice'

export const fetchProducts = (): AppThunk => async dispatch => {
  dispatch(prodFetchStart())
  try {
    const res = await fetch(`${baseUrl}/products`)
    if (!res.ok) throw new Error('Error fetching products')
    const json = await res.json() as { products: Product[] }
    dispatch(prodFetchSuccess(json.products))
  } catch (err: any) {
    dispatch(prodFetchFailure(err.message))
  }
}

export const createProduct = (payload: Omit<Product, 'id' | 'user'>): AppThunk => async dispatch => {
  try {
    const res = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Error creating product')
    const data: Product = await res.json()
    dispatch(prodAddSuccess(data))
  } catch (err: any) {
    dispatch(prodFetchFailure(err.message))
  }
}

export const updateProduct = (id: string, payload: Partial<Omit<Product, 'id' | 'user'>>): AppThunk => async dispatch => {
  try {
    const res = await fetch(`${baseUrl}/products/${id}`, {
      method: 'PUT',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Error updating product')
    const data: Product = await res.json()
    dispatch(prodUpdateSuccess(data))
  } catch (err: any) {
    dispatch(prodFetchFailure(err.message))
  }
}

export const deleteProduct = (id: string): AppThunk => async dispatch => {
  try {
    const res = await fetch(`${baseUrl}/products/${id}`, {
      method: 'DELETE',
      credentials: "include",
    })
    if (!res.ok) throw new Error('Error deleting product')
    dispatch(prodRemoveSuccess(id))
  } catch (err: any) {
    dispatch(prodFetchFailure(err.message))
  }
}