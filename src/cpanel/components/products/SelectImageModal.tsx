import React, { useEffect, useState } from 'react';
import { Image } from '../../../data/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchImagesPaginated } from '../../../store/imgAws/thunks';

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
    const dispatch = useDispatch<AppDispatch>();
    const [selectedImages, setSelectedImages] = useState<string[]>(initialSelected);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { list, loading, error, nextToken, hasMore } = useSelector((state: RootState) => state.images);

    const loadNextPage = () => {
        if (hasMore && !loading) {
            dispatch(fetchImagesPaginated(nextToken ?? undefined));
        }
    };



    const ITEMS_PER_PAGE = 12; // 3x4 grid

    useEffect(() => {
        if (list.length === 0) {
            dispatch(fetchImagesPaginated());
        }
    }, []);

    // Filtrar imágenes por término de búsqueda
    const filteredImages = list.filter((image: Image) =>
        image.key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular paginación
    const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentImages = filteredImages.slice(startIndex, endIndex);

    // Resetear página cuando cambia el filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const selectAllCurrentPage = () => {
        const currentPageUrls = currentImages.map(img => img.url);
        const newSelected = [...selectedImages];

        currentPageUrls.forEach(url => {
            if (!newSelected.includes(url)) {
                newSelected.push(url);
            }
        });

        setSelectedImages(newSelected);
    };

    const deselectAllCurrentPage = () => {
        const currentPageUrls = currentImages.map(img => img.url);
        setSelectedImages(prev => prev.filter(url => !currentPageUrls.includes(url)));
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Botón "Anterior"
        if (currentPage > 1) {
            buttons.push(
                <button
                    key="prev"
                    onClick={() => goToPage(currentPage - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                    ←
                </button>
            );
        }

        // Botones de páginas
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-1 border rounded ${i === currentPage
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Botón "Siguiente"
        if (currentPage < totalPages) {
            buttons.push(
                <button
                    key="next"
                    onClick={() => goToPage(currentPage + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                    →
                </button>
            );
        }

        return buttons;
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
                                onClick={() => dispatch(fetchImagesPaginated())}
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
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Seleccionar imágenes existentes</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </div>

                {/* Búsqueda */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar imágenes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Controles de selección */}
                {currentImages.length > 0 && (
                    <div className="flex justify-between items-center mb-4 text-sm">
                        <div className="flex space-x-2">
                            <button
                                onClick={selectAllCurrentPage}
                                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                                Seleccionar página
                            </button>
                            <button
                                onClick={deselectAllCurrentPage}
                                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                            >
                                Deseleccionar página
                            </button>
                        </div>
                        <span className="text-gray-500">
                            Página {currentPage} de {totalPages} | {filteredImages.length} imágenes
                        </span>
                    </div>
                )}

                {/* Grid de imágenes */}
                <div className="flex-1 overflow-y-auto">
                    {filteredImages.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">
                                {searchTerm ? 'No se encontraron imágenes' : 'No hay imágenes disponibles'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => dispatch(fetchImagesPaginated())}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Recargar
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {currentImages.map((image: Image) => (
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
                </div>

                {hasMore && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={loadNextPage}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Cargando...' : 'Cargar más'}
                        </button>
                    </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 space-x-1">
                        {renderPaginationButtons()}
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <p className="text-sm text-gray-500">
                        {selectedImages.length} seleccionadas de {filteredImages.length} imágenes
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