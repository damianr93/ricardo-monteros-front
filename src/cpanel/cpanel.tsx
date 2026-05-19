import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'
import { fetchCategories } from '../store/categories/thunks'
import { fetchProducts } from '../store/products/thunks'
import { fetchUsers } from '../store/users/thunks'
import { fetchMe } from '../store/logged/thunks'
import CategoryList from './components/categories/CategoryList'
import ProductList from './components/products/ProductList'
import UserList from './components/users/UserList'
import Loading from '../components/loading'
import { FaLayerGroup, FaBoxOpen, FaUsers } from 'react-icons/fa'

type View = 'categories' | 'products' | 'users'

const tabs: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'categories', label: 'Categorías', icon: <FaLayerGroup /> },
  { id: 'products',   label: 'Productos',  icon: <FaBoxOpen />    },
  { id: 'users',      label: 'Usuarios',   icon: <FaUsers />      },
]

const CPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [view, setView] = useState<View>('categories')
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // fetchMe re-validates the session against the server first.
    // If the token is invalid or the role changed, Redux state corrects itself
    // and SimpleProtectedRoute will redirect before any data is shown.
    // Re-validates session against the server. If token is invalid or role changed,
    // Redux state corrects itself and SimpleProtectedRoute redirects automatically.
    dispatch(fetchMe())

    Promise.all([
      dispatch(fetchCategories()),
      dispatch(fetchProducts()),
      dispatch(fetchUsers()),
    ]).finally(() => setDataLoaded(true))
  }, [])

  if (!dataLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary-lightest">
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-lightest pt-[112px]">
      {/* Page header + tabs — sticky just below the fixed navbar */}
      <div className="sticky top-[112px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-3">
          <h1 className="text-2xl font-heading text-primary">Panel de Control</h1>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="sticky top-[161px] z-30 bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                view === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {view === 'categories' && <CategoryList />}
        {view === 'products'   && <ProductList />}
        {view === 'users'      && <UserList />}
      </div>
    </div>
  )
}

export default CPanel
