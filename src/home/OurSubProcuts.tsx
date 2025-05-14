import React, { useEffect, useMemo } from 'react'
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

    useEffect(() => {
        dispatch(fetchCategories())
        dispatch(fetchProducts())
    }, [])

    const blocks = useMemo(() => {
        return categories
            .filter(c => c.available)
            .map(category => {
                const product = products.find(
                    p => p.category?.id === category.id && p.img && p.img.length > 0
                )

                if (!product) return null

                return {
                    titleLines: [category.name.toUpperCase()],
                    backgroundImage: product.img?.[0] ?? '',
                    href: `/catalogo?item=${encodeURIComponent(category.name)}`,
                }
            })
            .filter((block): block is {
                titleLines: string[]
                backgroundImage: string
                href: string
            } => block !== null)
    }, [categories, products])

    return (
        <section className="py-12 bg-neutral-100">
            <div className="container mx-auto px-4 text-center max-w-2xl mb-8">
                <h2 className="font-heading text-brand-green text-3xl md:text-4xl font-semibold">
                    Nuestros productos destacados
                </h2>
            </div>

            <div className="container mx-auto px-4">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    slidesPerView={4}
                    spaceBetween={24}
                    loop={true}
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
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="products-swiper"
                >
                    {blocks.map(block => (
                        <SwiperSlide key={block.href}>
                            <a
                                href={block.href}
                                className="block w-full h-80 rounded-lg overflow-hidden shadow-lg relative group"
                                style={{
                                    backgroundImage: `url(http://localhost:3000/api/images/products/${block.backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
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
