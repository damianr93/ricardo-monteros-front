import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

// Estilos ya declarados en main.ts como mencionaste

interface Block {
    titleLines: [string, string?]
    backgroundImage: string
    href: string
}

const blocks: Block[] = [
    { titleLines: ['FLORES'], backgroundImage: '/img/flores.png', href: '/catalogo?item=flores' },
    { titleLines: ['PLANTAS'], backgroundImage: '/img/plantas.jpg', href: '/catalogo?item=plantas' },
    { titleLines: ['CERÁMICAS'], backgroundImage: '/img/ceramica.png', href: '/catalogo?item=ceramica' },
    { titleLines: ['CORONAS'], backgroundImage: '/img/corona.png', href: '/catalogo?item=coronas' },
]

const SubproductosCarousel: React.FC = () => {
    // Registramos los módulos de Swiper
    useEffect(() => {
        // Registrar Swiper y sus componentes (enfoque alternativo)
        register();
    }, []);

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
