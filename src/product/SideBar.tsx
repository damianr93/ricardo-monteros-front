import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchCategories } from '../store/categories/thunks'
import { Product } from '../data/types'

interface SidebarProps {
  className?: string
  selectedId: string
  onSelect: (id: string) => void
  onLoginClick: () => void
  onRegisterClick: () => void
  onLogoutClick: () => void
  cartItems: Product[]
  onCheckoutClick: () => void
  onRemoveFromCart: (id: string) => void
  isLoggedIn: boolean
  cartTotal: number
  minOrderAmount: number
}

const Sidebar: React.FC<SidebarProps> = ({
  className = '',
  selectedId,
  onSelect,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
  cartItems,
  onCheckoutClick,
  onRemoveFromCart,
  isLoggedIn,
  cartTotal,
  minOrderAmount,
}) => {
  const belowMinimum = minOrderAmount > 0 && cartTotal < minOrderAmount
  const counts = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1
    return acc
  }, {})
  const { list: categories } = useSelector((state: RootState) => state.categories)
  const dispatch = useDispatch<AppDispatch>()
  const uniqueItems = Array.from(new Set(cartItems.map(i => i.id)))

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <aside className={`${className} w-64 bg-secondary-lightest p-6 border-r border-secondary-dark h-full overflow-y-auto`}>
      {/* Bloque de autenticación */}
      {!isLoggedIn ? (
        <div className="mb-6 space-y-2">
          <button
            onClick={onLoginClick}
            className="w-full bg-primary text-secondary-lightest py-2 rounded-md hover:bg-primary-dark transition"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onRegisterClick}
            className="w-full border border-primary text-primary py-2 rounded-md hover:bg-primary-light hover:text-secondary-lightest transition"
          >
            Registrarse
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <button
            onClick={onLogoutClick}
            className="w-full bg-secondary-accent text-secondary-lightest py-2 rounded-md hover:bg-secondary-dark transition"
          >
            Cerrar Sesión
          </button>
        </div>
      )}

      {/* Categorías */}
      <div>
        <h3 className="text-xl font-heading mb-4 text-primary uppercase">Categorías</h3>
        {categories.length === 0 ? (
          <p className="text-secondary-muted italic">No hay categorías disponibles</p>
        ) : (
          <ul className="space-y-2">
            {categories.map(cat =>
              cat.available && (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelect(cat.name)}
                    className={`w-full text-left px-4 py-2 rounded-md transition focus:outline-none ${selectedId === cat.name
                        ? 'bg-primary text-secondary-lightest'
                        : 'text-secondary-darkest hover:bg-secondary-light'
                      }`}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {/* Carrito (solo si está logueado) */}
      {isLoggedIn && (
        <div className="mt-8">
          <h3 className="text-xl font-heading mb-4 text-primary uppercase">Pedido</h3>
          {cartItems.length === 0 ? (
            <p className="text-secondary-muted">Tu pedido está vacío</p>
          ) : (
            <ul className="space-y-2 max-h-40 overflow-auto mb-4">
              {uniqueItems.map(id => {
                const item = cartItems.find(i => i.id === id) as Product
                return (
                  <li key={id} className="flex justify-between items-center text-sm text-secondary-darkest">
                    <span>{item.title}</span>
                    <div className="flex items-center space-x-2">
                      <span>x{counts[id]}</span>
                      <button
                        onClick={() => onRemoveFromCart(id)}
                        className="text-secondary-accent hover:text-secondary-dark transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {cartItems.length > 0 && (
            <div className="flex justify-between text-sm font-semibold text-secondary-darkest mb-2">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          )}

          {belowMinimum && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-2">
              El pedido no alcanza el monto mínimo de compra de ${minOrderAmount.toFixed(2)}.
            </p>
          )}

          <button
            disabled={cartItems.length === 0 || belowMinimum}
            onClick={onCheckoutClick}
            className="w-full bg-primary text-secondary-lightest py-2 rounded-md hover:bg-primary-dark transition disabled:opacity-50"
          >
            Realizar pedido
          </button>
        </div>
      )}
    </aside>
  )
}

export default Sidebar