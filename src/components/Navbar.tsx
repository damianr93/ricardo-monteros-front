import React, { useState, useEffect, useCallback } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { FaWhatsapp, FaChevronRight, FaEnvelope } from 'react-icons/fa'
import { NavLink } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchCategories } from '../store/categories/thunks'

interface NavItem {
  label: string
  to?: string
  items?: NavItem[]
}

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set())
  const [isScrolled, setIsScrolled] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const categories = useSelector((state: RootState) => state.categories.list)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.pageYOffset > 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleSubmenu = useCallback((label: string) => {
    setOpenMenus(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }, [])

  const dynamicNavItems: NavItem[] = [
    { label: 'Inicio', to: '/' },
    { label: 'Quiénes Somos', to: '/nosotros' },
    {
      label: 'Productos',
      items: categories
        .filter(cat => cat.available)
        .map(cat => ({
          label: cat.name,
          to: `/catalogo?item=${encodeURIComponent(cat.name)}`,
        })),
    },
    { label: 'Contacto', to: '/contacto' },
  ]

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 overflow-visible ${isScrolled
          ? 'bg-primary-light backdrop-blur bg-opacity-90'
          : 'bg-primary-light'
          }`}
      >
        <div className="py-4">
          <div className="container mx-auto px-6 flex items-center justify-between">
            <NavLink to="/" className="flex-shrink-0">
              <img src="/img/logo_sin_fondo.png" alt="Logo" className="h-20" />
            </NavLink>

            <nav className="hidden md:flex overflow-visible space-x-8 font-heading text-secondary-darkest">
              {dynamicNavItems.map(item => (
                <div key={item.label} className="relative group py-2">
                  {item.items ? (
                    <>
                      <button className="flex items-center space-x-1 hover:text-primary transition">
                        <span>{item.label}</span>
                        <FaChevronRight className="w-3 h-3 rotate-90" />
                      </button>
                      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <ul className="bg-primary-light rounded-lg shadow-lg w-40 py-1">
                          {item.items.map(sub => (
                            <li key={sub.label}>
                              <NavLink
                                to={sub.to!}
                                className="block px-4 py-2 text-sm text-secondary-darkest hover:bg-primary-light hover:text-primary transition"
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
                        `hover:text-primary transition ${isActive
                          ? 'text-primary font-semibold'
                          : 'text-secondary-darkest'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <a
                className="text-secondary-darkest hover:text-primary transition"
                href="https://wa.me/5493534287484?text=Hola%20Ricardo%20Montero%20Flores%2C%20quiero%20realizar%20una%20cotizaci%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                className="text-secondary-darkest hover:text-primary transition"
                href={
                  "https://mail.google.com/mail/?view=cm&fs=1" +
                  "&to=ricardomontero.floresart@gmail.com" +
                  "&su=Consulta%20desde%20sitio%20web"
                }
              >
                <FaEnvelope className="h-6 w-6 mr-3" />

              </a>

              <button
                className="md:hidden text-secondary-darkest"
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir menú"
              >
                <HiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header >

      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-primary-light p-6 shadow-xl transition-transform duration-300 lg:hidden z-50 overflow-y-auto ${drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <button onClick={() => setDrawerOpen(false)} aria-label="Cerrar menú">
          <HiX className="w-6 h-6 text-secondary-darkest mb-8" />
        </button>
        <ul className="space-y-4 font-body text-secondary-darkest">
          {dynamicNavItems.map(item => {
            const isOpen = openMenus.has(item.label)
            return (
              <li key={item.label}>
                {item.items ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className="flex justify-between w-full hover:text-primary transition"
                    >
                      <span>{item.label}</span>
                      <FaChevronRight
                        className={`transform transition ${isOpen ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <ul className="mt-2 ml-4 space-y-2 bg-primary-light rounded-lg p-2">
                        {item.items!.map(sub => (
                          <li key={sub.label}>
                            <NavLink
                              to={sub.to!}
                              className="block hover:text-primary transition"
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
                    className="block hover:text-primary transition"
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

      {
        drawerOpen && (
          <div
            className="fixed inset-0 bg-secondary-darkest bg-opacity-30 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )
      }
    </>
  )
}

export default Navbar
