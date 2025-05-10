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
    const res = await fetch(`${baseUrl}/products`, {
      method: 'GET',
      credentials: "include"
    })
    if (!res.ok) throw new Error('Error fetching products')
    const json = await res.json() as { products: Product[] }
    dispatch(prodFetchSuccess(json.products))
  } catch (err: any) {
    dispatch(prodFetchFailure(err.message))
  }
}

export const createProduct = (payload: Omit<Product, 'id' | 'user'>): AppThunk => async dispatch => {
  
  try {
      // Si hay una URL blob, necesitamos convertirla a un archivo
    if (payload.img && payload.img.startsWith('blob:')) {
      // Crear un FormData para enviar la imagen
      const formData = new FormData();

      // Primero añadimos todos los campos excepto img
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'category') {
          // Para la categoría solo enviamos el ID
          formData.append(key, typeof value === 'object' && value !== null ? String(value.id) : String(value));
        } else if (key !== 'img') {
          formData.append(key, String(value));
        }
      });

      // Convertir la URL blob a un archivo y añadirlo al FormData
      try {
        const response = await fetch(payload.img);
        const blob = await response.blob();
        const fileFromBlob = new File([blob], 'image.jpg', { type: blob.type });
        formData.append('img', fileFromBlob);
      } catch (error) {
        console.error('Error converting blob URL to file:', error);
      }

      // Enviar con FormData
      const res = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        credentials: "include",
        // No establecemos Content-Type, dejamos que el navegador lo configure automáticamente
        body: formData
      });
    if (!res.ok) throw new Error('Error creating product')
    const data: Product = await res.json()
    dispatch(prodAddSuccess(data))
    }
  } catch (err: any) {
    dispatch(prodFetchFailure(err.message))
  }
}


export const updateProduct = (id: string, payload: Partial<Omit<Product, 'id' | 'user'>>): AppThunk => async dispatch => {
  try {
    // Si hay una URL blob, necesitamos convertirla a un archivo
    if (payload.img && payload.img.startsWith('blob:')) {
      // Crear un FormData para enviar la imagen
      const formData = new FormData();

      // Primero añadimos todos los campos excepto img
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'category') {
          // Para la categoría solo enviamos el ID
          formData.append(key, typeof value === 'object' && value !== null ? String(value.id) : String(value));
        } else if (key !== 'img') {
          formData.append(key, String(value));
        }
      });

      // Convertir la URL blob a un archivo y añadirlo al FormData
      try {
        const response = await fetch(payload.img);
        const blob = await response.blob();
        const fileFromBlob = new File([blob], 'image.jpg', { type: blob.type });
        formData.append('img', fileFromBlob);
      } catch (error) {
        console.error('Error converting blob URL to file:', error);
      }

      // Enviar con FormData
      const res = await fetch(`${baseUrl}/products/${id}`, {
        method: 'PATCH',
        credentials: "include",
        // No establecemos Content-Type, dejamos que el navegador lo configure automáticamente
        body: formData
      });

      if (!res.ok) throw new Error('Error updating product');
      const data: Product = await res.json();
      dispatch(prodUpdateSuccess(data));
    } else {
      // Si no hay URL blob, enviamos como JSON normalmente
      const res = await fetch(`${baseUrl}/products/${id}`, {
        method: 'PATCH',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          // Asegurarnos de que solo enviamos el ID de la categoría
          category: payload.category?.id || payload.category
        })
      });

      if (!res.ok) throw new Error('Error updating product');
      const data: Product = await res.json();
      dispatch(prodUpdateSuccess(data));
    }
  } catch (err: any) {
    dispatch(prodFetchFailure(err.message));
  }
};

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