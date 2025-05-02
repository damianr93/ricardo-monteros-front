import React from 'react'
import { ExampleItem } from '../data/items'

interface SidebarProps {
  className?: string
  selectedId: string
  onSelect: (id: string) => void
  onLoginClick: () => void
  onRegisterClick: () => void
  onLogoutClick: () => void                // <-- nueva prop
  cartItems: ExampleItem[]
  onCheckoutClick: () => void
  onRemoveFromCart: (id: string) => void
  isLoggedIn: boolean
}

const categories = ['flores', 'plantas', 'ceramica', 'coronas']

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
}) => {
  const counts = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1
    return acc
  }, {})
  const uniqueItems = Array.from(new Set(cartItems.map(i => i.id)))

  return (
    <aside className={`${className} w-64 bg-white mt-10 p-8 border-r border-gray-200 sticky top-16 h-[calc(100vh-4rem)] overflow-auto`}>
      {/* Bloque de autenticación */}
      {!isLoggedIn ? (
        <div className="mb-6 space-y-2">
          <button
            onClick={onLoginClick}
            className="w-full bg-accent-coral text-black py-2 rounded-md hover:bg-accent-coral transition"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onRegisterClick}
            className="w-full border border-accent-coral text-accent-coral py-2 rounded-md hover:bg-accent-coral-light hover:text-white transition"
          >
            Registrarse
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <button
            onClick={onLogoutClick}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      )}

      {/* Categorías */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 uppercase mb-4">Categorías</h3>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat}>
              <button
                onClick={() => onSelect(cat)}
                className={`w-full text-left px-4 py-2 rounded-md transition focus:outline-none ${selectedId === cat
                    ? 'bg-accent-coral text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Carrito (solo si está logueado) */}
      {isLoggedIn && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 uppercase mb-4">Carrito</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío</p>
          ) : (
            <ul className="space-y-2 max-h-40 overflow-auto mb-4">
              {uniqueItems.map(id => {
                const item = cartItems.find(i => i.id === id) as ExampleItem
                return (
                  <li key={id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{item.title}</span>
                      <button
                        onClick={() => onRemoveFromCart(id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        ×
                      </button>
                    </div>
                    <span>x{counts[id]}</span>
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
            Finalizar Compra
          </button>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
