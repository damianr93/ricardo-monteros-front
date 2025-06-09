import { AppThunk } from "../store";
import { setImages } from "./imgAws";


export const fetchAllImages = (): AppThunk => async (dispatch) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/images/allimages`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        if (!Array.isArray(data.images)) {
            throw new Error('Expected an array of images but got different data structure');
        }

        dispatch(setImages(data));

    } catch (err: unknown) {
        console.error('Error fetching images:', err);
    }
};