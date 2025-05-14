import React, { useEffect, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchCategories } from '../store/categories/thunks'
import { fetchProducts } from '../store/products/thunks'

const SubproductosCarousel: React.FC = () => {
    const { list: categories } = useSelector((state: RootState) => state.categories)
    const { list: products } = useSelector((state: RootState) => state.products)
    const dispatch = useDispatch<AppDispatch>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            await Promise.all([
                dispatch(fetchCategories()),
                dispatch(fetchProducts())
            ])
            setIsLoading(false)
        }

        loadData()
    }, [dispatch])

    const blocks = useMemo(() => {

        return categories
            .filter(c => c.available)
            .map(category => {
                // Buscar un producto para esta categoría (aunque no tenga imagen)
                const product = products.find(p => p.category?.id === category.id)

                // Si no hay ningún producto, saltamos esta categoría
                if (!product) return null

                return {
                    titleLines: [category.name.toUpperCase()],
                    // Usa una imagen si existe, o null si no hay
                    backgroundImage: product.img?.[0] ?? null,
                    href: `/catalogo?item=${encodeURIComponent(category.name)}`,
                    // Guardamos la referencia al producto
                    productName: product.name
                }
            })
            .filter((block): block is {
                titleLines: string[]
                backgroundImage: string | null
                href: string
                productName: string
            } => block !== null)
    }, [categories, products])

    const shouldEnableLoop = blocks.length >= 4

    if (isLoading) {
        return (
            <section className="py-12 bg-neutral-100">
                <div className="container mx-auto px-4 text-center">
                    <p>Cargando productos...</p>
                </div>
            </section>
        )
    }

    if (blocks.length === 0) {
        return (
            <section className="py-12 bg-neutral-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-heading text-brand-green text-3xl md:text-4xl font-semibold">
                        Nuestros productos
                    </h2>
                    <p className="mt-4">No hay productos disponibles en este momento.</p>
                </div>
            </section>
        )
    }

    const placeholderColors = [
        'bg-brand-green-light',
        'bg-brand-green',        
        'bg-leaf-light',         
        'bg-leaf',                
        'bg-accent-coral-light',  
        'bg-accent-coral'     
    ];


    return (
        <section className="py-12 bg-neutral-100">
            <div className="container mx-auto px-4 text-center max-w-2xl mb-8">
                <h2 className="font-heading text-brand-green text-3xl md:text-4xl font-semibold">
                    Nuestros productos
                </h2>
            </div>

            <div className="container mx-auto px-4">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    slidesPerView={1}
                    spaceBetween={24}
                    loop={shouldEnableLoop}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    navigation={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        640: { slidesPerView: Math.min(2, blocks.length) },
                        1024: { slidesPerView: Math.min(3, blocks.length) },
                    }}
                    className="products-swiper"
                >
                    {blocks.map((block, index) => (
                        <SwiperSlide key={block.href || index}>
                            <a
                                href={block.href}
                                className={`block w-full h-80 rounded-lg overflow-hidden shadow-lg relative group ${!block.backgroundImage ? placeholderColors[index % placeholderColors.length] : ''}`}
                                style={block.backgroundImage ? {
                                    backgroundImage: `url(${import.meta.env.VITE_API_URL}/images/products/${block.backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                } : {}}
                            >
                                {/* Si no hay imagen, mostrar un texto alternativo */}
                                {!block.backgroundImage && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white text-opacity-70 font-semibold text-lg">
                                            {block.productName}
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                    {block.titleLines.map((line, i) => (
                                        <h3
                                            key={i}
                                            className="text-xl md:text-2xl font-heading font-bold text-white leading-snug"
                                        >
                                            {line}
                                        </h3>
                                    ))}
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}

export default SubproductosCarousel