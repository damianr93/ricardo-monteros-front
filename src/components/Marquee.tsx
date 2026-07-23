import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { formatArs } from '../utils/currency'

// Cinta superior que se desplaza de derecha a izquierda de forma continua.
// Las frases se repiten para que el "track" sea más ancho que la pantalla (así
// nunca queda un hueco negro), y se renderizan DOS tracks idénticos: la
// animación mueve el contenedor -50% (un track), por lo que cuando el primero
// sale por la izquierda el segundo ya ocupa su lugar y el bucle no se corta.
const Marquee: React.FC = () => {
  const minOrderAmount = useSelector((state: RootState) => state.settings.minOrderAmount)

  const phrases = useMemo(() => {
    const base = [
      'En el catálogo están todos nuestros productos',
      'Registrate para ver los precios y enviar tu pedido',
    ]
    if (minOrderAmount > 0) {
      base.push(`La compra mínima es de ${formatArs(minOrderAmount)}`)
    }
    // Se repite la secuencia para asegurar que el track supere el ancho de la
    // pantalla y el desplazamiento sea siempre continuo.
    return [...base, ...base, ...base]
  }, [minOrderAmount])

  const renderTrack = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {phrases.map((phrase, i) => (
        <span key={i} className="flex items-center">
          <span className="text-xs whitespace-nowrap">{phrase}</span>
          <span className="mx-6 text-white/40" aria-hidden="true">•</span>
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
