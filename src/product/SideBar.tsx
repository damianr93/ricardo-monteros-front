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
}


const Sidebar: React.FC<SidebarProps> = ({
  className = '',
  selectedId,
  onSelect,
  onLoginClick,
  onRegisterClick,
  cartItems,
  onCheckoutClick,
  onRemoveFromCart,
  isLoggedIn,
}) => {
  const counts = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1
    return acc
  }, {})
  const { list: categories } = useSelector((state: RootState) => state.categories)
  const dispatch = useDispatch<AppDispatch>()
  const uniqueItems = Array.from(new Set(cartItems.map(i => i.id)))

  useEffect(() => {
    dispatch(fetchCategories())
  }
    , [dispatch])

  return (
    <aside className={`${className} w-64 bg-white mt-10 p-8 border-r border-gray-200 sticky top-16 h-[calc(100vh-4rem)] overflow-auto`}>
      <div className="mb-6 space-y-2">
        <button
          onClick={onLoginClick}
          className="w-full bg-accent-coral text-black py-2 rounded-md hover:bg-accent-coral transition"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={onRegisterClick}
          className="w-full border border-primary text-primary py-2 rounded-md hover:bg-primary-light hover:bg-accent-coral hover:text-white transition"
        >
          Registrarse
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 uppercase mb-4">Categorías</h3>
        <ul className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-gray-500 italic">No hay categorías disponibles</p>
          ) : (
            <ul className="space-y-2">
              {categories.map(cat => (
                cat.available && (
                  <li key={cat.id}>
                    <button
                      onClick={() => onSelect(cat.name)}
                      className={`w-full text-left px-4 py-2 rounded-md transition focus:outline-none ${selectedId === cat.name
                        ? 'bg-accent-coral text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {cat.name.toUpperCase()}
                    </button>
                  </li>
                )
              ))}
            </ul>
          )}
        </ul>
      </div>

      {/* Carrito (solo si está logueado) */}
      {isLoggedIn && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 uppercase mb-4">Pedido</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Tu pedido está vacío</p>
          ) : (
            <ul className="space-y-2 max-h-40 overflow-auto mb-4">
              {uniqueItems.map(id => {
                const item = cartItems.find(i => i.id === id) as Product
                return (
                  <li key={id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>x{counts[id]}</span>
                      <button
                        onClick={() => onRemoveFromCart(id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <button
            disabled={cartItems.length === 0}
            onClick={onCheckoutClick}
            className="w-full bg-accent-coral text-white py-2 rounded-md hover:bg-accent-coral-light transition disabled:opacity-50"
          >
            Realizar pedido
          </button>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
