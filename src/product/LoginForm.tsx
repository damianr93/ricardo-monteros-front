import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/logged/thunks'
import { AppDispatch, RootState } from '../store/store'
import Loading from '../components/loading'

interface LoginFormProps {
  onSuccess: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch<AppDispatch>()

  const status = useSelector((state: RootState) => state.isLoggedUser.status)
  const isLoading = status === 'loading'

  useEffect(() => {
    if (status === 'succeeded') {
      onSuccess()
    }
  }, [status, onSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-secondary-lightest p-8 rounded-lg shadow-lg space-y-6"
    >
      <h2 className="font-heading text-2xl mb-6 text-primary text-center">
        Iniciar Sesión
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-secondary-darkest">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-2 text-secondary-darkest">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-secondary-lightest py-3 rounded-md hover:bg-primary-dark transition disabled:opacity-50"
      >
        Entrar
      </button>
    </form>
  )
}

export default LoginForm