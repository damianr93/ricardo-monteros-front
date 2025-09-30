import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'
import { fetchCategories } from '../store/categories/thunks'
import { fetchProducts } from '../store/products/thunks'
import { fetchUsers } from '../store/users/thunks'
import CategoryList from './components/categories/CategoryList'
import ProductList from './components/products/ProductList'
import UserList from './components/users/UserList'
import Loading from '../components/loading'

const CPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [view, setView] = useState<'categories' | 'products' | 'users'>('categories')
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // Cargar datos solo una vez al montar el componente
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCategories()),
          dispatch(fetchProducts()),
          dispatch(fetchUsers())
        ])
        setDataLoaded(true)
      } catch (error) {
        console.error('Error cargando datos:', error)
        setDataLoaded(true) // Marcar como cargado incluso si hay error
      }
    }
    
    loadData()
  }, []) // Solo se ejecuta una vez al montar

  if (!dataLoaded) {
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
      </div>

      {/* Navigation */}
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
        <button
          onClick={() => setView('users')}
          className={`px-3 py-1 ${view === 'users' ? 'bg-primary text-secondary-lightest rounded' : 'text-secondary-darkest hover:text-primary transition'}`}
        >
          Usuarios
        </button>
      </div>

      {/* Content */}
      {view === 'categories' ? (
        <CategoryList />
      ) : view === 'products' ? (
        <ProductList />
      ) : (
        <UserList />
      )}
    </div>
  )
}

export default CPanel