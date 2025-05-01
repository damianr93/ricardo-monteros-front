// File: src/components/Navbar.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { FaInstagram, FaFacebookF, FaWhatsapp, FaChevronRight } from 'react-icons/fa'
import { NavLink } from 'react-router'

interface NavItem {
  label: string
  to?: string
  items?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Quiénes Somos', to: '/nosotros' },
  {
    label: 'Productos',
    items: [
      { label: 'Flores', to: '/catalogo?item=flores' },
      { label: 'Plantas', to: '/catalogo?item=plantas' },
      { label: 'Cerámica', to: '/catalogo?item=ceramica' },
      { label: 'Coronas', to: '/catalogo?item=coronas' },
    ],
  },
  { label: 'Contacto', to: '/contacto' },
]

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set())
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleSubmenu = useCallback((label: string) => {
    setOpenMenus(prev => {
      const nxt = new Set(prev)
      nxt.has(label) ? nxt.delete(label) : nxt.add(label)
      return nxt
    })
  }, [])

  return (
    <header className={`fixed w-full z-50 bg-neutral-50 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="backdrop-blur bg-neutral-50 bg-opacity-90 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0">
            <img src="/img/logo_sin_fondo.png" alt="Ricardo Montero" className="h-20" />
          </NavLink>

          {/* Menú Desktop */}
          <nav className="hidden md:flex space-x-8 font-heading text-neutral-800">
            {navItems.map(item => (
              <div key={item.label} className="relative group py-2">
                {item.items ? (
                  <>
                    <button className="flex items-center space-x-1 hover:text-accent-coral transition">
                      <span>{item.label}</span>
                      <FaChevronRight className="w-3 h-3 rotate-90" />
                    </button>
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <ul className="bg-white rounded-lg shadow-lg w-40 py-1">
                        {item.items.map(sub => (
                          <li key={sub.label}>
                            <NavLink
                              to={sub.to!}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm ${isActive ? 'bg-accent-coral text-white' : 'text-neutral-700 hover:bg-neutral-100 hover:text-accent-coral'}`
                              }
                            >
                              {sub.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={item.to!}
                    className={({ isActive }) =>
                      `hover:underline transition ${isActive ? 'text-accent-coral font-semibold' : 'text-neutral-800'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Iconos + Menú móvil */}
          <div className="flex items-center space-x-4">
            <a href="https://www.instagram.com/ricardo_montero/" className="text-neutral-800 hover:text-accent-coral transition">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/ricardo_montero/" className="text-neutral-800 hover:text-accent-coral transition">
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a href="https://wa.me/5493534210083" className="text-neutral-800 hover:text-accent-coral transition">
              <FaWhatsapp className="w-5 h-5" />
            </a>

            <button
              className="md:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú"
            >
              <HiMenu className="w-6 h-6 text-neutral-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Móvil */}
      <div
        className={`fixed top-0 ${drawerOpen ? 'right-0' : '-right-full'} h-full w-3/4 max-w-xs bg-neutral-50 shadow-xl p-6 transition-transform duration-300 lg:hidden z-50`}
      >
        <button
          className="mb-8 text-neutral-800"
          onClick={() => setDrawerOpen(false)}
          aria-label="Cerrar menú"
        >
          <HiX className="w-6 h-6" />
        </button>
        <ul className="space-y-4 font-body text-neutral-800">
          {navItems.map(item => {
            const hasChildren = !!item.items
            const isOpen = openMenus.has(item.label)
            return (
              <li key={item.label}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className="flex justify-between w-full"
                    >
                      <span>{item.label}</span>
                      <FaChevronRight
                        className={`transform transition ${isOpen ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <ul className="mt-2 ml-4 space-y-2">
                        {item.items!.map(sub => (
                          <li key={sub.label}>
                            <NavLink
                              to={sub.to!}
                              className="block hover:text-accent-coral transition"
                              onClick={() => setDrawerOpen(false)}
                            >
                              {sub.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.to!}
                    className="block hover:text-accent-coral transition"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Overlay for mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </header>
  )
}

export default Navbar