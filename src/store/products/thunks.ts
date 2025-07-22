import { Product } from "../../data/types";
import { fetchWithAuth } from "../logged/thunks";
import { AppThunk } from "../store";
import {
  prodFetchStart,
  prodFetchSuccess,
  prodFetchFailure,
  prodAddSuccess,
  prodUpdateSuccess,
  prodRemoveSuccess,
} from "./slice";

export const fetchProducts = (): AppThunk => async (dispatch) => {
  dispatch(prodFetchStart());
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/products`);
    if (!res.ok) throw new Error("Error fetching products");
    const json = (await res.json()) as { products: Product[] };
    dispatch(prodFetchSuccess(json.products));
  } catch (err: any) {
    dispatch(prodFetchFailure(err.message));
  }
};

export const createProduct =
  (payload: Omit<Product, "id" | "user">, images?: File[]): AppThunk =>
  async (dispatch) => {
    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "category") {
          formData.append(
            key,
            typeof value === "object" && value !== null && !Array.isArray(value)
              ? String(value.id)
              : String(value)
          );
        } else if (key !== "img") {
          formData.append(key, String(value));
        }
      });

      if (images && images.length > 0) {
        for (const file of images) {
          formData.append("images", file);
        }
      }

      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Error creating product");
      const data: Product = await res.json();
      dispatch(prodAddSuccess(data));
    } catch (err: any) {
      dispatch(prodFetchFailure(err.message));
    }
  };

export const updateProduct =
  (
    id: string,
    payload: Partial<Omit<Product, "id" | "user">>,
    images?: File[]
  ): AppThunk =>
  async (dispatch) => {
    try {
      const hasNewImages = images && images.length > 0;

      if (hasNewImages) {
        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          if (key === "category") {
            formData.append(
              "category",
              Array.isArray(value)
                ? value.join(",")
                : typeof value === "object" && value !== null
                ? String(value.id)
                : String(value)
            );
          } else if (key !== "img") {
            formData.append(key, String(value));
          }
        });

        if (payload.img && Array.isArray(payload.img)) {
          payload.img.forEach((existingName) => {
            formData.append("img", existingName);
          });
        }

        images.forEach((file) => {
          formData.append("images", file);
        });

        const res = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/products/${id}`,
          {
            method: "PATCH",
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Error updating product");
        const data: Product = await res.json();
        dispatch(prodUpdateSuccess(data));
      } else {
        const res = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/products/${id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...payload,
              category: payload.category?.id || payload.category,
            }),
          }
        );

        if (!res.ok) throw new Error("Error updating product");
        const data: Product = await res.json();
        dispatch(prodUpdateSuccess(data));
      }
    } catch (err: any) {
      dispatch(prodFetchFailure(err.message));
    }
  };

export const deleteProduct =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Error deleting product");
      dispatch(prodRemoveSuccess(id));
    } catch (err: any) {
      dispatch(prodFetchFailure(err.message));
    }
  };
