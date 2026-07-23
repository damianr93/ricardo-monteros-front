import React, { useState, useEffect, useMemo } from 'react'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import ProductList from './ProductList'
import PaymentForm from './PaymentForm'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchMe, logoutUser } from '../store/logged/thunks'
import { fetchProducts } from '../store/products/thunks'
import { fetchSettings } from '../store/settings/thunks'
import Sidebar from './SideBar'
import WelcomeMessage from './WelcomeMessage'
import { Product } from '../data/types'

const ProductPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const itemParam = searchParams.get('item') || ''
  const [selectedCategory, setSelectedCategory] = useState<string>(itemParam)
  const [mode, setMode] = useState<'browse' | 'login' | 'register' | 'checkout' | 'forgot-password'>('browse')
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchBy, setSearchBy] = useState<'name' | 'codigo'>('name')
  const [catalogPage, setCatalogPage] = useState(1)
  const CATALOG_PAGE_SIZE = 24

  const isLoggedIn = useSelector((state: RootState) => state.userLogged.isLoggedIn)
  const products = useSelector((state: RootState) => state.products.list)
  const minOrderAmount = useSelector((state: RootState) => state.settings.minOrderAmount)
  const dispatch = useDispatch<AppDispatch>()

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.price, 0),
    [cartItems]
  )
  const belowMinimum = minOrderAmount > 0 && cartTotal < minOrderAmount

  useEffect(() => {
    dispatch(fetchMe())
    dispatch(fetchProducts())
    dispatch(fetchSettings())
  }, [dispatch])

  useEffect(() => {
    const q = searchParams.get('item')
    if (q && q.toLowerCase() !== selectedCategory.toLowerCase()) {
      setSelectedCategory(q)
    }
  }, [searchParams, selectedCategory])

  useEffect(() => {
    setCatalogPage(1)
  }, [selectedCategory, searchTerm])

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName)
    navigate(`/catalogo?item=${encodeURIComponent(catName)}`, { replace: true })
    setMode('browse')
    setSidebarOpen(false)
    setSearchTerm('')
  }
  const handleLoginClick = () => { setMode('login'); setSidebarOpen(false) }
  const handleRegisterClick = () => { setMode('register'); setSidebarOpen(false) }
  const handleAuthSuccess = () => setMode('browse')
  const handleAddToCart = (item: Product) => setCartItems(prev => [...prev, item])
  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === id)
      if (idx === -1) return prev
      const copy = [...prev]
      copy.splice(idx, 1)
      return copy
    })
  }
  const handleCheckoutClick = () => {
    if (belowMinimum) return
    setMode('checkout')
  }
  const handlePaymentSuccess = () => { setCartItems([]); setMode('browse') }
  const onLogoutClick = () => dispatch(logoutUser())

  const itemsByCategory = useMemo(() => selectedCategory
    ? products.filter(item =>
        item.category?.name.toLowerCase() === selectedCategory.toLowerCase()
      )
    : [],
    [products, selectedCategory]
  )

  const itemsToShow = useMemo(() => itemsByCategory.filter(item => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    if (searchBy === 'codigo') {
      return item.codigo !== undefined && item.codigo !== null
        ? String(item.codigo).toLowerCase().includes(term)
        : false
    }
    const text = `${item.name} ${item.title ?? ''} ${item.description ?? ''}`.toLowerCase()
    return text.includes(term)
  }), [itemsByCategory, searchTerm, searchBy])

  const catalogTotalPages = Math.ceil(itemsToShow.length / CATALOG_PAGE_SIZE)
  const paginatedItems = useMemo(() => itemsToShow.slice(
    (catalogPage - 1) * CATALOG_PAGE_SIZE,
    catalogPage * CATALOG_PAGE_SIZE
  ), [itemsToShow, catalogPage, CATALOG_PAGE_SIZE])

  const renderMainContent = () => {
    if (mode === 'login') return <LoginForm onSuccess={handleAuthSuccess} onForgotPassword={() => setMode('forgot-password')} />
    if (mode === 'register') return <RegisterForm onSuccess={handleAuthSuccess} />
    if (mode === 'forgot-password') return <ForgotPasswordForm onBack={() => setMode('login')} onSuccess={() => setMode('login')} />
    if (mode === 'checkout') {
      return (
        <PaymentForm
          items={cartItems}
          total={cartTotal}
          minOrderAmount={minOrderAmount}
          onSuccess={handlePaymentSuccess}
        />
      )
    }

    if (!selectedCategory) {
      return (
        <WelcomeMessage
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
        />
      )
    }

    if (itemsByCategory.length === 0) {
      return (
        <p className="text-center text-secondary-muted italic">
          {products.length === 0 ? 'Cargando productos...' : 'No hay productos en esta categoría.'}
        </p>
      )
    }

    return (
      <>
        {/* Barra de búsqueda con desplegable */}
        <div className="mb-4 mt-5 flex items-center space-x-2">
          <select
            value={searchBy}
            onChange={e => setSearchBy(e.target.value as 'name' | 'codigo')}
            className="
              min-w-[120px]          
              border border-secondary-dark 
              rounded-md 
              px-3 py-2             
              focus:outline-none 
              focus:ring-2 
              focus:ring-primary 
              focus:ring-opacity-50
            "
          >
            <option value="name">Nombre</option>
            <option value="codigo">Código</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={searchBy === 'codigo' ? 'Buscar por código...' : 'Buscar productos...'}
            className="
              flex-1
              border border-secondary-dark 
              rounded-md 
              px-4 py-2 
              focus:outline-none 
              focus:ring-2 
              focus:ring-primary 
              focus:ring-opacity-50
            "
          />
        </div>

        {/* Lista de productos filtrados */}
        {itemsToShow.length > 0 ? (
          <>
            <ProductList
              items={paginatedItems}
              isLoggedIn={isLoggedIn}
              onAddToCart={handleAddToCart}
            />

            {catalogTotalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setCatalogPage(p => Math.max(1, p - 1))}
                  disabled={catalogPage === 1}
                  className="flex items-center gap-1 px-4 py-2 border border-secondary-dark rounded-lg hover:bg-secondary-lightest disabled:opacity-40 transition"
                >
                  <FaChevronLeft size={12} /> Anterior
                </button>
                <span className="text-sm text-secondary-darkest">
                  {catalogPage} / {catalogTotalPages}
                </span>
                <button
                  onClick={() => setCatalogPage(p => Math.min(catalogTotalPages, p + 1))}
                  disabled={catalogPage === catalogTotalPages}
                  className="flex items-center gap-1 px-4 py-2 border border-secondary-dark rounded-lg hover:bg-secondary-lightest disabled:opacity-40 transition"
                >
                  Siguiente <FaChevronRight size={12} />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-secondary-muted italic">
            No se encontraron productos que coincidan con "{searchTerm}"
          </p>
        )}
      </>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row pt-36 min-h-screen bg-secondary-lightest">
      {/* Mobile toggle */}
      <button
        className="fixed top-1/2 transform -translate-y-1/2 lg:hidden z-50 p-2 bg-primary text-secondary-lightest rounded-full"
        onClick={() => setSidebarOpen(open => !open)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FaChevronLeft className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
      </button>

      {/* Sidebar */}
      <Sidebar
        className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed top-36 bottom-0 left-0 w-64 z-40 lg:sticky lg:top-36 lg:bottom-auto lg:z-auto lg:self-start lg:h-[calc(100vh-9rem)]`}
        selectedId={selectedCategory}
        onSelect={handleSelectCategory}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        onLogoutClick={onLogoutClick}
        cartItems={cartItems}
        onCheckoutClick={handleCheckoutClick}
        onRemoveFromCart={handleRemoveFromCart}
        isLoggedIn={isLoggedIn}
        cartTotal={cartTotal}
        minOrderAmount={minOrderAmount}
      />

      {/* Main */}
      <main className="flex-1 p-6 lg:p-12">
        {renderMainContent()}
      </main>
    </div>
  )
}

export default ProductPage