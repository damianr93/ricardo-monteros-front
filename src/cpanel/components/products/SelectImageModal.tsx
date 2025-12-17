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
    const [previewImage, setPreviewImage] = useState<string | null>(null);
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

    const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
        e.stopPropagation();
        setPreviewImage(imageUrl);
    };

    const closePreview = () => {
        setPreviewImage(null);
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
                    className="px-3 py-1 border border-primary-muted rounded hover:bg-primary-light transition"
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
                    className={`px-3 py-1 border rounded transition ${i === currentPage
                        ? 'bg-primary text-white border-primary'
                        : 'border-primary-muted hover:bg-primary-light'
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
                    className="px-3 py-1 border border-primary-muted rounded hover:bg-primary-light transition"
                >
                    →
                </button>
            );
        }

        return buttons;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-secondary-darkest bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-secondary-lightest rounded-lg p-6 max-w-md w-full">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-secondary-darkest">Cargando imágenes...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-secondary-darkest bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-secondary-lightest rounded-lg p-6 max-w-md w-full">
                    <div className="text-center py-8">
                        <p className="text-secondary-accent mb-4">Error al cargar imágenes: {error}</p>
                        <div className="flex justify-center space-x-2">
                            <button
                                onClick={() => dispatch(fetchImagesPaginated())}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
                            >
                                Reintentar
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-primary-muted rounded hover:bg-primary-light transition"
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
        <>
            <div className="fixed mt-20 pt-10 inset-0 bg-secondary-darkest bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-secondary-lightest rounded-lg p-8 max-w-6xl w-full max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold font-heading text-secondary-darkest">
                            Seleccionar imágenes existentes
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-secondary-light hover:text-secondary-darkest text-xl font-bold w-8 h-8 flex items-center justify-center transition"
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
                            className="w-full px-3 py-2 border border-primary-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-secondary-lightest text-secondary-darkest"
                        />
                    </div>

                    {/* Controles de selección */}
                    {currentImages.length > 0 && (
                        <div className="flex justify-between items-center mb-4 text-sm">
                            <span className="text-secondary-light font-body">
                                Página {currentPage} de {totalPages} | {filteredImages.length} imágenes
                            </span>
                        </div>
                    )}

                    {/* Grid de imágenes */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredImages.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-secondary-light mb-4 font-body">
                                    {searchTerm ? 'No se encontraron imágenes' : 'No hay imágenes disponibles'}
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => dispatch(fetchImagesPaginated())}
                                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
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
                                        className={`relative border-2 rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-lg group
                                            ${selectedImages.includes(image.url)
                                                ? 'border-primary ring-2 ring-primary-light'
                                                : 'border-primary-muted hover:border-primary'
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

                                        {/* Botón de previsualización */}
                                        <button
                                            onClick={(e) => handleImageClick(e, image.url)}
                                            className="absolute top-2 right-2 bg-secondary-darkest bg-opacity-70 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                                        >
                                            👁️
                                        </button>

                                        {selectedImages.includes(image.url) && (
                                            <div className="absolute inset-0 bg-primary bg-opacity-30 flex items-center justify-center">
                                                <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                                                    <span className="text-white text-lg font-bold">✓</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Información adicional en hover */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-secondary-darkest bg-opacity-70 text-white text-xs p-2 opacity-0 hover:opacity-100 transition-opacity">
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
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 transition"
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
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-primary-muted">
                        <p className="text-sm text-secondary-light font-body">
                            {selectedImages.length} seleccionadas de {filteredImages.length} imágenes
                        </p>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-primary-muted rounded hover:bg-primary-light transition font-body"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={selectedImages.length === 0}
                                className={`px-4 py-2 rounded font-medium transition-colors font-body
                                    ${selectedImages.length > 0
                                        ? 'bg-primary text-white hover:bg-primary-dark'
                                        : 'bg-primary-muted text-secondary-light cursor-not-allowed'
                                    }`}
                            >
                                Seleccionar ({selectedImages.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de previsualización */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-secondary-darkest bg-opacity-80 flex items-center justify-center z-[60]"
                    onClick={closePreview}
                >
                    <div className="relative w-full max-w-4xl h-[80vh] p-4">
                        <button
                            onClick={closePreview}
                            className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-dark transition z-10"
                        >
                            ✕
                        </button>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default SelectExistingImagesModal;