import { AppThunk } from "../store";
import { toast } from "react-toastify";
import { fetchProducts } from "../products/thunks";
import {
  setUserDisloged,
  setUserError,
  setUserLoading,
  setUserLogged,
} from "./userLogged";

const TOKEN_KEY = "access_token";

const saveToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.warn("Error saving token to localStorage:", error);
  }
};

const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.warn("Error reading token from localStorage:", error);
    return null;
  }
};

const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.warn("Error removing token from localStorage:", error);
  }
};

// ✅ FUNCIÓN CORREGIDA: Solo añadir Content-Type si NO es FormData
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  // Solo añadir Content-Type si NO es FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export const loginUser =
  (dataToLogin: { email: string; password: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setUserLoading());
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToLogin),
        }
      );

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        saveToken(data.token);

        const isAdmin = data.user.role && data.user.role.includes('ADMIN_ROLE');
        dispatch(setUserLogged({ user: data.user, isAdmin }));
        dispatch(fetchProducts());

        toast.success("¡Bienvenido!", {
          position: "top-right",
        });
      } else {
        dispatch(setUserError(data.error || "Credenciales inválidas"));
        toast.error(data.error || "Credenciales inválidas", {
          position: "top-left",
        });
      }
    } catch (error: any) {
      dispatch(
        setUserError(error.message ?? "Error de red, intente nuevamente")
      );
      console.error("Failed to login:", error);
      toast.error("Error de conexión, intente nuevamente", {
        position: "top-left",
      });
    }
  };

export const fetchMe = (): AppThunk => async (dispatch) => {
  dispatch(setUserLoading());
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const res = await fetchWithAuth(`${apiUrl}/auth/me`, {
      method: "PUT",
    });

    if (!res.ok) {
      if (res.status === 401) {
        removeToken();
      }
      throw new Error("No autenticado");
    }

    const data = await res.json();
    dispatch(setUserLogged({ user: data.user, isAdmin: data.isAdmin }));
  } catch (error) {
    console.warn("fetchMe error:", error);
    removeToken();
    dispatch(setUserDisloged());
  }
};

export const logoutUser = (): AppThunk => async (dispatch) => {
  dispatch(setUserLoading());
  try {
    const res = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        method: "POST",
      }
    );

    removeToken();
    dispatch(setUserDisloged());

    if (!res.ok) {
      console.warn("Logout response not ok, but continuing...");
    }

    toast.success("Sesión cerrada correctamente", {
      position: "top-right",
    });
  } catch (error: any) {
    console.error("Failed to logout:", error);
    removeToken();
    dispatch(setUserDisloged());
    toast.success("Sesión cerrada", {
      position: "top-right",
    });
  }
};

export const initializeAuth = (): AppThunk => async (dispatch) => {
  const token = getToken();
  if (token) {
    dispatch(fetchMe());
  } else {
    dispatch(setUserDisloged());
  }
};

export const forgotPassword = (email: string): AppThunk => async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al enviar la solicitud");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error al enviar la solicitud");
  }
};

export const resetPassword = (data: { token: string; newPassword: string }): AppThunk => async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || "Error al actualizar la contraseña");
    }

    return responseData;
  } catch (error: any) {
    throw new Error(error.message || "Error al actualizar la contraseña");
  }
};

export const useAuthFetch = () => {
  return fetchWithAuth;
};
export { fetchWithAuth };
