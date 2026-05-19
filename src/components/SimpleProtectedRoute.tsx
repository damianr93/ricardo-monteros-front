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

  // Auth still initializing — wait only when not yet authenticated.
  // If already logged in and a re-fetch is running (status=loading), keep
  // the protected content mounted to avoid an unmount/remount loop.
  if ((status === 'loading' || status === 'idle') && !isLoggedIn) {
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
