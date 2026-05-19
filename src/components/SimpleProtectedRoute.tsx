import React from 'react'
import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import Loading from './loading'

interface SimpleProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const SimpleProtectedRoute: React.FC<SimpleProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isLoggedIn, user, status } = useSelector((state: RootState) => state.userLogged)

  // Auth still initializing — wait before deciding
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary-lightest">
        <Loading />
      </div>
    )
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />
  }

  // Derive admin status from the role array returned by the server — not from a stored boolean
  const isAdmin = Array.isArray(user.role) && user.role.includes('ADMIN_ROLE')

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default SimpleProtectedRoute
