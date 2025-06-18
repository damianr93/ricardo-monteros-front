import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Slide {
  id: number
  webp: string
  jpg: string
  pix: string
  title: string
  subtitle: string
}

const slides: Slide[] = [
  {
    id: 1,
    webp: '/img/slide-0.jpeg',
    jpg: '/img/slide-0.jpeg',
    pix: '/img/slide-0.jpeg',
    title: '',
    subtitle: ''
  },
  {
    id: 2,
    webp: '/img/slide-1.jpg',
    jpg: '/img/slide-1.jpg',
    pix: '/img/slide-1.jpg',
    title: 'Llegamos a todos los puntos del país',
    subtitle: 'Envíos seguros y rápidos para que recibas tus pedidos en perfectas condiciones.'
  },
  {
    id: 3,
    webp: '/img/slide-2.webp',
    jpg: '/img/slide-2.webp',
    pix: '/img/slide-2.webp',
    title: 'Productos que impulsan tu negocio',
    subtitle: ''
  },
  {
    id: 4,
    webp: '/img/slide-3.jpeg',
    jpg: '/img/slide-3.jpeg',
    pix: '/img/slide-3.jpeg',
    title: 'Atención personalizada en cada pedido',
    subtitle: 'Te acompañamos desde la selección hasta la entrega de tus decoraciones.'
  },
]

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isChanging, setIsChanging] = useState(false)

  const transitionDuration = 800    // ms
  const slideDuration = 6000   // ms

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true)
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length)
        setTimeout(() => setIsChanging(false), transitionDuration)
      }, transitionDuration / 2)
    }, slideDuration)

    return () => clearInterval(interval)
  }, [])

  // Variants
  const imageV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: transitionDuration / 800, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: transitionDuration / 800, ease: 'easeIn' } },
  }
  const textV = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: transitionDuration / 1000, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: transitionDuration / 2000, ease: 'easeIn' } },
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.picture
          key={slides[currentSlide].id}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={imageV}
          className="absolute inset-0 w-full h-full"
        >
          <source srcSet={slides[currentSlide].webp} type="image/webp" />
          <source srcSet={slides[currentSlide].jpg} type="image/jpeg" />
          <img
            src={slides[currentSlide].pix}
            alt={slides[currentSlide].title}
            className="object-cover w-full h-full"
          />
        </motion.picture>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70" />

      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isChanging && (
            <>
              <motion.h1
                key={`title-${slides[currentSlide].id}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={textV}
                className="font-heading text-4xl md:text-6xl text-white mb-4"
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p
                key={`sub-${slides[currentSlide].id}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={textV}
                className="font-body text-lg md:text-2xl text-neutral-200"
              >
                {slides[currentSlide].subtitle}
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!isChanging) {
                setIsChanging(true)
                setTimeout(() => {
                  setCurrentSlide(idx)
                  setTimeout(() => setIsChanging(false), transitionDuration)
                }, transitionDuration / 2)
              }
            }}
            className={`
        w-3 h-3 rounded-full transition-all duration-300
        border-2
        ${currentSlide === idx
                ? 'bg-accent-coral scale-125 border-white'
                : 'bg-white/50 hover:bg-white border-transparent'}
      `}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
