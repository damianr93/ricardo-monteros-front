import React, { useEffect } from 'react';
import { Image } from '../../../data/types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllImages } from '../../../store/imgAws/thunks';
import { AppDispatch, RootState } from '../../../store/store';

interface SelectExistingImagesModalProps {
    onClose: () => void;
    onSelect: (selectedImages: string[]) => void;
    initialSelected?: string[];
}

const SelectExistingImagesModal: React.FC<SelectExistingImagesModalProps> = ({
    onClose,
    onSelect,
    initialSelected = []
}) => {
    const [selectedImages, setSelectedImages] = React.useState<string[]>(initialSelected);
    const { list, loading, error } = useSelector((state: RootState) => state.images);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        if (list.length === 0) {
            dispatch(fetchAllImages());
        }
    }, []);

    const toggleImageSelection = (imageUrl: string) => {
        setSelectedImages(prev =>
            prev.includes(imageUrl)
                ? prev.filter(url => url !== imageUrl)
                : [...prev, imageUrl]
        );
    };

    const handleSubmit = () => {
        onSelect(selectedImages);
        onClose();
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p>Cargando imágenes...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <div className="text-center py-8">
                        <p className="text-red-500 mb-4">Error al cargar imágenes: {error}</p>
                        <div className="flex justify-center space-x-2">
                            <button
                                onClick={() => dispatch(fetchAllImages())}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Reintentar
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border rounded"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Seleccionar imágenes existentes</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </div>

                {list.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No hay imágenes disponibles</p>
                        <button
                            onClick={() => dispatch(fetchAllImages())}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Recargar
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {list.map((image: Image) => (
                            <div
                                key={image.key}
                                className={`relative border-2 rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-lg
                                    ${selectedImages.includes(image.url)
                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => toggleImageSelection(image.url)}
                            >
                                <img
                                    src={image.url}
                                    alt={`Imagen ${image.key}`}
                                    className="w-full h-32 object-cover"
                                    onError={(e) => {
                                        // Fallback en caso de error al cargar la imagen
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNjggNzJIMTMyVjg0SDY4VjcyWiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg==';
                                    }}
                                />

                                {selectedImages.includes(image.url) && (
                                    <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                                        <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                                            <span className="text-white text-lg font-bold">✓</span>
                                        </div>
                                    </div>
                                )}

                                {/* Información adicional en hover */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 opacity-0 hover:opacity-100 transition-opacity">
                                    <p className="truncate">{image.key.split('/').pop()}</p>
                                    <p>{(image.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-500">
                        {list.length} imágenes disponibles
                    </p>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={selectedImages.length === 0}
                            className={`px-4 py-2 rounded font-medium transition-colors
                                ${selectedImages.length > 0
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Seleccionar ({selectedImages.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectExistingImagesModal;