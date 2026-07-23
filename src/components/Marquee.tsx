import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { formatArs } from '../utils/currency'

// Cinta superior con información de la web que se desplaza de derecha a izquierda.
// El texto se duplica para que el bucle sea continuo (la animación mueve -50%).
const Marquee: React.FC = () => {
  const minOrderAmount = useSelector((state: RootState) => state.settings.minOrderAmount)

  const text = useMemo(() => {
    const messages = [
      'En el catálogo están todos nuestros productos',
      'Registrate para ver los precios y enviar tu pedido',
    ]
    if (minOrderAmount > 0) {
      messages.push(`La compra mínima es de ${formatArs(minOrderAmount)}`)
    }
    return messages.join('   •   ')
  }, [minOrderAmount])

  return (
    <div className="bg-black text-white h-8 flex items-center overflow-hidden">
      <div className="flex shrink-0 animate-marquee">
        <span className="text-xs px-6 whitespace-nowrap">{text}</span>
      </div>
      <div className="flex shrink-0 animate-marquee" aria-hidden="true">
        <span className="text-xs px-6 whitespace-nowrap">{text}</span>
      </div>
    </div>
  )
}

export default Marquee
