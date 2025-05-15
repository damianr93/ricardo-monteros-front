import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Product } from '../../../data/types';
import Loading from '../../../components/loading'; // Asumiendo que es el mismo componente Loading

interface ProductFormProps {
    initial?: Product;
    onSubmit: (data: Omit<Product, 'id' | 'user'>, imageFiles?: File[]) => void;
    onCancel: () => void;
    isSubmitting?: boolean; // Nueva prop para indicar si está enviando el formulario
}

const ProductForm: React.FC<ProductFormProps> = ({ initial, onSubmit, onCancel, isSubmitting = false }) => {
    const categories = useSelector((state: RootState) => state.categories.list);
    const categoriesLoading = useSelector((state: RootState) => state.categories.loading);
    
    const [name, setName] = useState(initial?.name || '');
    const [price, setPrice] = useState(initial?.price?.toString() || '0');
    const [available, setAvailable] = useState(initial?.available || false);
    const [categoryId, setCategoryId] = useState(initial?.category?.id || '');
    const [title, setTitle] = useState(initial?.title || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initial) {
            setName(initial.name);
            setPrice(initial.price.toString());
            setAvailable(initial.available);
            setCategoryId(initial.category?.id || '');
            setTitle(initial.title || '');
            setDescription(initial.description || '');
            setExistingImages(initial.img ?? []);
            setPreviewImages(initial.img ?? []);
            setImageFiles([]);
        }
    }, [initial]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));

        setImageFiles(prev => [...prev, ...newFiles]);
        setPreviewImages(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (index: number) => {
        const isBlob = previewImages[index].startsWith('blob:');

        if (isBlob) {
            const blobIndexes = previewImages.map((src, i) => src.startsWith('blob:') ? i : -1).filter(i => i !== -1);
            const fileIndex = blobIndexes.indexOf(index);
            if (fileIndex !== -1) {
                setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
            }
        } else {
            const nonBlobIndexes = previewImages.map((src, i) => !src.startsWith('blob:') ? i : -1).filter(i => i !== -1);
            const existingIndex = nonBlobIndexes.indexOf(index);
            if (existingIndex !== -1) {
                setExistingImages(prev => prev.filter((_, i) => i !== existingIndex));
            }
        }

        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedCategory = categories.find(c => c.id === categoryId);
        if (!selectedCategory) {
            alert('Por favor selecciona una categoría válida');
            return;
        }

        onSubmit({
            name,
            price: parseFloat(price),
            available,
            category: selectedCategory,
            title,
            description,
            img: existingImages
        }, imageFiles);
    };

    return (
        <div className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-start justify-center z-[40] overflow-y-auto pt-10">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg w-full space-y-4 relative">
                {/* Overlay de carga cuando está enviando o cargando categorías */}
                {(isSubmitting || categoriesLoading) && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                        <Loading />
                    </div>
                )}

                <h3 className="text-lg font-heading mb-2">{initial ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <div className="grid grid-cols-1 gap-4">
                    <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green" />
                    <input type="number" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} required className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green" />
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green">
                        <option value="" disabled>Selecciona categoría</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="text" placeholder="Título (opcional)" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green" />
                    <textarea placeholder="Descripción (opcional)" value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-green" />

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Imágenes del producto</label>
                        <div className="flex items-center space-x-4">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Seleccionar archivo</button>
                            <span className="text-sm text-gray-500">{imageFiles.length > 0 ? imageFiles.map(f => f.name).join(', ') : 'Ningún archivo seleccionado'}</span>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple name="images" onChange={handleImageChange} className="hidden" />

                        <div className="grid grid-cols-3 gap-2">
                            {previewImages.map((src, index) => (
                                <div key={index} className="relative w-full aspect-square border rounded overflow-hidden">
                                    <img
                                        src={src.startsWith('blob:') ? src : `${import.meta.env.VITE_BASE_AWS_URL}${src}`}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-0 left-0 right-0 bg-red-600 bg-opacity-80 text-white flex justify-center items-center h-8">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="text-white hover:scale-110 transition-transform"
                                            aria-label="Eliminar imagen"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center">
                            <input id="prod-available" type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} className="mr-2" />
                            <label htmlFor="prod-available">Disponible</label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="px-4 py-2 rounded border"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-accent-coral text-white rounded hover:bg-accent-coral-light transition"
                        disabled={isSubmitting || categoriesLoading}
                    >
                        {isSubmitting ? 'Procesando...' : initial ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;