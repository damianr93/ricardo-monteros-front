import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchMe } from '../store/logged/thunks'
import { fetchCategories } from '../store/categories/thunks'
import { fetchProducts } from '../store/products/thunks'
import CategoryList from './components/categories/CategoryList'
import ProductList from './components/products/ProductList'
import LoginForm from '../product/LoginForm'
import Loading from '../components/loading'

const CPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const {
    isLoggedIn,
    status: userStatus
  } = useSelector((state: RootState) => state.isLoggedUser)

  const { loading: categoriesLoading } = useSelector((state: RootState) => state.categories)
  const { loading: productsLoading } = useSelector((state: RootState) => state.products)

  const [view, setView] = useState<'categories' | 'products'>('categories')
  const [showLoginForm, setShow] = useState(false)
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  const isCheckingAuth = userStatus === 'loading'
  const isLoadingData = !initialDataLoaded && (categoriesLoading || productsLoading)

  // Comprueba sesión al montar
  useEffect(() => {
    dispatch(fetchMe())
  }, [])

  // Carga datos una vez que el usuario está autenticado
  useEffect(() => {
    if (isLoggedIn && !initialDataLoaded) {
      // Carga inicial de datos
      Promise.all([
        dispatch(fetchCategories()),
        dispatch(fetchProducts())
      ]).then(() => {
        setInitialDataLoaded(true)
      })
    }
  }, [isLoggedIn])

  // Mientras comprobamos auth, mostramos spinner full-screen
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    )
  }

  return (
    <div className="relative z-20 p-6 pt-[120px] bg-neutral-50 min-h-screen">
      {/* Header: título + botón de login */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading">Panel de Control</h1>
        {!isLoggedIn && (
          <button
            onClick={() => setShow(true)}
            className="bg-accent-coral text-white px-4 py-2 rounded-lg border-2 border-accent-coral hover:bg-brand-green-light transition"
          >
            Iniciar Sesión
          </button>
        )}
      </div>

      {/* Modal de login */}
      {!isLoggedIn && showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000">
          <LoginForm
            onSuccess={() => {
              dispatch(fetchMe())
              setShow(false)
            }}
          />
        </div>
      )}

      {/* Contenido del panel */}
      {isLoggedIn && (
        <>
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setView('categories')}
              className={view === 'categories' ? 'underline' : ''}
            >
              Categorías
            </button>
            <button
              onClick={() => setView('products')}
              className={view === 'products' ? 'underline' : ''}
            >
              Productos
            </button>
          </div>

          {/* Mientras se cargan los datos, mostramos spinner */}
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