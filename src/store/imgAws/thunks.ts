import { AppThunk } from "../store";
import { setImages } from "./imgAws";
import { toast } from "react-toastify";

export const fetchImagesPaginated = (token?: string, limit: number = 50): AppThunk => async (dispatch) => {
    try {
        const url = new URL(`${import.meta.env.VITE_API_URL}/images/allimageswithpagination`);
        url.searchParams.set('limit', limit.toString());
        if (token) url.searchParams.set('token', token);

        const response = await fetch(url.toString(), {
            method: 'GET',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`Error al cargar imágenes (${response.status})`);

        const { data } = await response.json();
        dispatch(setImages(data));
    } catch (err: any) {
        toast.error(err.message || 'Error al cargar las imágenes', { position: 'top-right' });
    }
};
