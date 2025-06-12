import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchMe } from '../store/logged/thunks'
import { fetchCategories } from '../store/categories/thunks'
import { fetchProducts } from '../store/products/thunks'
import CategoryList from './components/categories/CategoryList'
import ProductList from './components/products/ProductList'
import Loading from '../components/loading'
import LoginForm from '../product/LoginForm'

const CPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { isLoggedIn, status: userStatus } = useSelector((state: RootState) => state.isLoggedUser)
  const { loading: categoriesLoading } = useSelector((state: RootState) => state.categories)
  const { loading: productsLoading } = useSelector((state: RootState) => state.products)

  const [view, setView] = useState<'categories' | 'products'>('categories')
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  const isCheckingAuth = userStatus === 'loading'
  const isLoadingData = !initialDataLoaded && (categoriesLoading || productsLoading)

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  useEffect(() => {
    if (isLoggedIn && !initialDataLoaded) {
      Promise.all([
        dispatch(fetchCategories()),
        dispatch(fetchProducts())
      ]).then(() => setInitialDataLoaded(true))
    }
  }, [isLoggedIn, initialDataLoaded, dispatch])

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary-lightest">
        <Loading />
      </div>
    )
  }

  return (
    <div className="relative z-20 p-6 pt-[120px] bg-secondary-lightest min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading text-primary">Panel de Control</h1>
        {!isLoggedIn && (
          <button
            onClick={() => setShowLoginForm(true)}
            className="bg-primary text-secondary-lightest px-4 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Iniciar Sesión
          </button>
        )}
      </div>

      {/* Login Modal */}
      {!isLoggedIn && showLoginForm && (
        <div className="fixed inset-0 bg-secondary-darkest bg-opacity-50 flex items-center justify-center z-50">
          <LoginForm onSuccess={() => { dispatch(fetchMe()); setShowLoginForm(false) }} />
        </div>
      )}

      {/* Content */}
      {isLoggedIn && (
        <>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setView('categories')}
              className={`px-3 py-1 ${view === 'categories' ? 'bg-primary text-secondary-lightest rounded' : 'text-secondary-darkest hover:text-primary transition'}`}
            >
              Categorías
            </button>
            <button
              onClick={() => setView('products')}
              className={`px-3 py-1 ${view === 'products' ? 'bg-primary text-secondary-lightest rounded' : 'text-secondary-darkest hover:text-primary transition'}`}
            >
              Productos
            </button>
          </div>

          {isLoadingData ? (
            <div className="flex items-center justify-center py-20">
              <Loading />
            </div>
          ) : view === 'categories' ? (
            <CategoryList />
          ) : (
            <ProductList />
          )}
        </>
      )}
    </div>
  )
}

export default CPanel