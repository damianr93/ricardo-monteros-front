import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { formatArs } from '../utils/currency'

// Cinta superior con información de la web que se desplaza de derecha a izquierda
// de forma continua. Se renderizan DOS copias idénticas del track y la animación
// mueve el contenedor -50% (una copia): cuando la primera copia sale por la
// izquierda, la segunda ya ocupa su lugar, por lo que el bucle no tiene cortes.
// Cada track ocupa al menos el ancho de la pantalla (min-w-[100vw]) con las
// frases repartidas (justify-around), para que el texto llene la cinta sin
// huecos negros.
const Marquee: React.FC = () => {
  const minOrderAmount = useSelector((state: RootState) => state.settings.minOrderAmount)

  const messages = useMemo(() => {
    const base = [
      'En el catálogo están todos nuestros productos',
      'Registrate para ver los precios y enviar tu pedido',
    ]
    if (minOrderAmount > 0) {
      base.push(`La compra mínima es de ${formatArs(minOrderAmount)}`)
    }
    return base
  }, [minOrderAmount])

  const renderTrack = (hidden: boolean) => (
    <div
      className="flex shrink-0 min-w-[100vw] items-center justify-around gap-16 px-8"
      aria-hidden={hidden || undefined}
    >
      {messages.map((message, i) => (
        <span key={i} className="text-xs whitespace-nowrap">
          {message}
        </span>
      ))}
    </div>
  )

  return (
    <div className="bg-black text-white h-8 flex items-center overflow-hidden">
      <div className="flex shrink-0 animate-marquee">
        {renderTrack(false)}
        {renderTrack(true)}
      </div>
    </div>
  )
}

export default Marquee
