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

  // 1) Leemos el status de la slice
  const status = useSelector((state: RootState) => state.isLoggedUser.status)
  const isLoading = status === 'loading'

  // 2) Cuando pase a 'succeeded', disparamos onSuccess()
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
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow"
    >
      <h2 className="font-heading text-2xl mb-6 text-brand-green">
        Iniciar Sesión
      </h2>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent-coral text-white py-2 rounded-md hover:bg-accent-coral-light transition disabled:opacity-50"
      >
        Entrar
      </button>
    </form>
  )
}

export default LoginForm