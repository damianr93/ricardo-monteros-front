/**
 * Formatea un monto como pesos argentinos con separador de miles y el símbolo
 * al final, sin decimales. Ej: 500000 -> "500.000$".
 */
export const formatArs = (amount: number): string => {
  const value = Number.isFinite(amount) ? amount : 0
  return `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)}$`
}
