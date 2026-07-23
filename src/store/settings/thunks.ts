import { AppThunk } from '../store'
import { fetchWithAuth } from '../logged/thunks'
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  updateSuccess,
  Settings
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

export const fetchSettings = (): AppThunk => async dispatch => {
  dispatch(fetchStart())
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/settings`)
    if (!res.ok) throw new Error(await getApiError(res, 'Error al cargar la configuración'))
    const json = await res.json() as Settings
    dispatch(fetchSuccess({ minOrderAmount: json.minOrderAmount }))
  } catch (err: any) {
    dispatch(fetchFailure(err.message))
  }
}

export const updateSettings = (payload: { minOrderAmount: number }): AppThunk => async dispatch => {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(await getApiError(res, 'Error al guardar la configuración'))
    const data = await res.json() as Settings
    dispatch(updateSuccess({ minOrderAmount: data.minOrderAmount }))
    toast.success('Configuración guardada correctamente', { position: 'top-right' })
  } catch (err: any) {
    toast.error(err.message || 'Error al guardar la configuración', { position: 'top-right' })
    throw err
  }
}
