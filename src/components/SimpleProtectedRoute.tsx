import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

interface SimpleProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const SimpleProtectedRoute: React.FC<SimpleProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isLoggedIn, user, isAdmin } = useSelector((state: RootState) => state.userLogged)

  if (!isLoggedIn || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary-lightest">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-primary mb-4">Acceso Restringido</h2>
          <p className="text-secondary-darkest">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary-lightest">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-primary mb-4">Acceso Denegado</h2>
          <p className="text-secondary-darkest">No tienes permisos de administrador para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default SimpleProtectedRoute
