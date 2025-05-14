import React, { useState, useEffect } from 'react'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router'
import Sidebar from './SideBar'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ProductList from './ProductList'
import PaymentForm from './PaymentForm'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchMe, logoutUser } from '../store/logged/thunks'
import { fetchProducts } from '../store/products/thunks'
import { Product } from '../data/types'

const ProductPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const itemParam = searchParams.get('item') || 'flores'
  const [selectedCategory, setSelectedCategory] = useState<string>(itemParam)
  const [mode, setMode] = useState<'browse' | 'login' | 'register' | 'checkout'>('browse')
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isLoggedIn } = useSelector((state: RootState) => state.isLoggedUser)
  const { list: products } = useSelector((state: RootState) => state.products)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchMe())
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    const q = searchParams.get('item')
    if (q && q.toLowerCase() !== selectedCategory.toLowerCase()) {
      setSelectedCategory(q)
    }
  }, [searchParams])

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName)
    searchParams.set('item', catName)
    setSearchParams(searchParams)
    setMode('browse')
    setSidebarOpen(false)
    navigate(`/catalogo?item=${catName}`, { replace: true })
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
  const handleCheckoutClick = () => setMode('checkout')
  const handlePaymentSuccess = () => { setCartItems([]); setMode('browse') }
  const onLogoutClick = () => dispatch(logoutUser())

  const itemsToShow = products.filter(
    item => item.category.name.toLowerCase() === selectedCategory.toLowerCase()
  )

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

      {/* Sidebar */}
      <Sidebar
        className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed top-16 bottom-0 left-0 w-64 overflow-y-auto z-40 bg-neutral-50 shadow-lg`}
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
          <>
            {products.length === 0 ? (
              <p className="text-center text-gray-500 italic">Cargando productos...</p>
            ) : itemsToShow.length === 0 ? (
              <p className="text-center text-gray-500 italic">No hay productos disponibles en esta categoría.</p>
            ) : (
              <ProductList
                items={itemsToShow}
                isLoggedIn={isLoggedIn}
                onAddToCart={handleAddToCart}
              />
            )}
          </>
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
