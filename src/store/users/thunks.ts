import { AppThunk } from "../store"
import { toast } from "react-toastify"
import { fetchWithAuth } from "../logged/thunks"
import {
  setUsersLoading,
  setUsersSuccess,
  setUsersError,
  updateUserInList,
  deleteUserFromList,
  addUserToList,
} from "./slice"
import { User } from "../../interfaces/users"

export const fetchUsers = (): AppThunk => async (dispatch) => {
  dispatch(setUsersLoading())
  try {
    const response = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/users`,
      {
        method: "GET",
      }
    )

    if (!response.ok) {
      throw new Error("Error al obtener usuarios")
    }

    const data = await response.json()
    // El backend devuelve { users: [...] }, necesitamos extraer el array
    const usersArray = data.users || data || []
    dispatch(setUsersSuccess(usersArray))
  } catch (error: any) {
    const errorMessage = error.message || "Error al cargar usuarios"
    dispatch(setUsersError(errorMessage))
    toast.error(errorMessage, {
      position: "top-right",
    })
  }
}

export const updateUserApproval = (
  userId: string,
  approvalStatus: 'APPROVED' | 'REJECTED'
): AppThunk => async (dispatch) => {
  try {
    const response = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/users/${userId}/approval`,
      {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
      }
    )

    if (!response.ok) {
      throw new Error("Error al actualizar estado de aprobación")
    }

    const data = await response.json()
    dispatch(updateUserInList(data))
    
    const statusText = approvalStatus === 'APPROVED' ? 'aprobado' : 'rechazado'
    toast.success(`Usuario ${statusText} correctamente`, {
      position: "top-right",
    })
  } catch (error: any) {
    const errorMessage = error.message || "Error al actualizar usuario"
    toast.error(errorMessage, {
      position: "top-right",
    })
  }
}

export const updateUser = (
  userId: string,
  userData: Partial<User>
): AppThunk => async (dispatch) => {
  try {
    const response = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/users/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify(userData),
      }
    )

    if (!response.ok) {
      throw new Error("Error al actualizar usuario")
    }

    const data = await response.json()
    dispatch(updateUserInList(data.user))
    
    toast.success("Usuario actualizado correctamente", {
      position: "top-right",
    })
  } catch (error: any) {
    const errorMessage = error.message || "Error al actualizar usuario"
    toast.error(errorMessage, {
      position: "top-right",
    })
  }
}

export const createUser = (userData: Partial<User>): AppThunk => async (dispatch) => {
  try {
    const response = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/users`,
      {
        method: "POST",
        body: JSON.stringify(userData),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error al crear usuario")
    }

    const data = await response.json()
    dispatch(addUserToList(data.user))
    
    toast.success("Usuario creado correctamente", {
      position: "top-right",
    })
  } catch (error: any) {
    const errorMessage = error.message || "Error al crear usuario"
    toast.error(errorMessage, {
      position: "top-right",
    })
  }
}

export const deleteUser = (userId: string): AppThunk => async (dispatch) => {
  try {
    const response = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/users/${userId}`,
      {
        method: "DELETE",
      }
    )

    if (!response.ok) {
      throw new Error("Error al eliminar usuario")
    }

    dispatch(deleteUserFromList(userId))
    
    toast.success("Usuario eliminado correctamente", {
      position: "top-right",
    })
  } catch (error: any) {
    const errorMessage = error.message || "Error al eliminar usuario"
    toast.error(errorMessage, {
      position: "top-right",
    })
  }
}
