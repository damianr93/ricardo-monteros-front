// File: src/pages/ProductPage.tsx
import React, { useState, useEffect } from 'react'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router'
import { ExampleItem, PRODUCTOS } from '../data/items'
import Sidebar from './SideBar'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ProductList from './ProductList'
import PaymentForm from './PaymentForm'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchMe, logoutUser } from '../store/logged/thunks'


const ProductPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const itemParam = searchParams.get('item') || 'flores'
  const [selectedCategory, setSelectedCategory] = useState<string>(itemParam)
  const [mode, setMode] = useState<'browse' | 'login' | 'register' | 'checkout'>('browse')
  const [cartItems, setCartItems] = useState<ExampleItem[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isLoggedIn, user } = useSelector((state: RootState) => state.isLoggedUser)
  const dispatch = useDispatch<AppDispatch>();

  console.log(isLoggedIn, user)

  useEffect(() => {
    dispatch(fetchMe());
  }, []);

  useEffect(() => {
    const q = searchParams.get('item')
    if (q && q !== selectedCategory) {
      setSelectedCategory(q)
    }
  }, [searchParams])



  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat)
    searchParams.set('item', cat)
    setSearchParams(searchParams)
    setMode('browse')
    setSidebarOpen(false)
    // Opcional: navegar explícito
    navigate(`/catalogo?item=${cat}`, { replace: true })
  }

  const handleLoginClick = () => { setMode('login'); setSidebarOpen(false) }
  const handleRegisterClick = () => { setMode('register'); setSidebarOpen(false) }
  const handleAuthSuccess = () => setMode('browse')
  const handleAddToCart = (item: ExampleItem) => setCartItems(prev => [...prev, item])
  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === id)
      if (idx === -1) return prev
      const copy = [...prev]
      copy.splice(idx, 1)
      return copy
    })
  }
  const handleCheckoutClick = () => setMode('checkout')
  const handlePaymentSuccess = () => { setCartItems([]); setMode('browse') }
  const onLogoutClick = () => {
    dispatch(logoutUser())
  }

  const itemsToShow = PRODUCTOS.filter(item => item.category === selectedCategory)

  return (
    <div className="flex flex-col lg:flex-row pt-16 min-h-screen bg-neutral-50">
      {/* Mobile toggle arrow */}
      <button
        className="fixed top-1/2 transform -translate-y-1/2 lg:hidden z-50 p-2 bg-accent-coral text-black rounded-full"
        onClick={() => setSidebarOpen(open => !open)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FaChevronLeft className="w-3 h-3" /> : <FaChevronRight className="w-3 h-3" />}
      </button>

      {/* Sidebar: hidden on mobile unless open */}
      <Sidebar
        className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}
        selectedId={selectedCategory}
        onSelect={handleSelectCategory}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        cartItems={cartItems}
        onLogoutClick={onLogoutClick}
        onCheckoutClick={handleCheckoutClick}
        onRemoveFromCart={handleRemoveFromCart}
        isLoggedIn={isLoggedIn}
      />

      {/* Main content */}
      <main className="flex-1 p-6 pt-14 lg:p-12">
        {mode === 'login' && <LoginForm onSuccess={handleAuthSuccess} />}
        {mode === 'register' && <RegisterForm onSuccess={handleAuthSuccess} />}
        {mode === 'browse' && (
          <ProductList
            items={itemsToShow}
            isLoggedIn={isLoggedIn}
            onAddToCart={handleAddToCart}
          />
        )}
        {mode === 'checkout' && (
          <PaymentForm
            items={cartItems}
            total={cartItems.reduce((sum, i) => sum + i.price, 0)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </main>
    </div>
  )
}

export default ProductPage
