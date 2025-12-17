import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { fetchUsers, updateUserApproval, updateUser, deleteUser, createUser } from '../../../store/users/thunks'
import CustomTable, { Column, Action } from '../customTable'
import { User } from '../../../interfaces/users'
import UserForm from './UserForm'
import Loading from '../../../components/loading'
import { Delete, CheckCircle, Edit } from '@mui/icons-material'

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading } = useSelector((state: RootState) => state.users)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    dispatch(fetchUsers())
  }, []) // Solo se ejecuta una vez al montar el componente

  const columns: Column[] = [
    { field: 'name', headerName: 'Nombre', align: 'left' },
    { field: 'email', headerName: 'Email', align: 'left' },
    { field: 'razonSocial', headerName: 'Razón Social', align: 'left' },
    { field: 'CUIT', headerName: 'CUIT', align: 'center' },
    { field: 'phone', headerName: 'Teléfono', align: 'center' },
    { 
      field: 'approvalStatus', 
      headerName: 'Estado', 
      align: 'center' 
    },
    { 
      field: 'role', 
      headerName: 'Rol', 
      align: 'center' 
    },
  ]



  const actions: Action[] = [
    {
      name: 'edit',
      icon: <Edit />,
      tooltip: 'Editar usuario',
      color: 'primary'
    },
    {
      name: 'approve',
      icon: <CheckCircle />,
      tooltip: 'Aprobar usuario',
      color: 'primary'
    },
    {
      name: 'delete',
      icon: <Delete />,
      tooltip: 'Eliminar usuario',
      color: 'secondary'
    }
  ]

  const handleActionClick = (action: Action, user: User) => {
    switch (action.name) {
      case 'edit':
        setEditingUser(user)
        setShowUserForm(true)
        break
      case 'approve':
        if (user.approvalStatus !== 'APPROVED') {
          dispatch(updateUserApproval(user.id, 'APPROVED'))
        }
        break
      case 'delete':
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.name}?`)) {
          dispatch(deleteUser(user.id))
        }
        break
    }
  }

  const handleCloseForm = () => {
    setShowUserForm(false)
    setEditingUser(null)
  }

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      dispatch(updateUser(editingUser.id, userData))
    } else {
      dispatch(createUser(userData))
    }
    handleCloseForm()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loading />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading text-primary">Gestión de Usuarios</h2>
        <button
          onClick={() => {
            setEditingUser(null)
            setShowUserForm(true)
          }}
          className="bg-primary text-secondary-lightest px-4 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <CustomTable
          columns={columns}
          data={users}
          actions={actions}
          onActionClick={handleActionClick}
          pagination={{ rowsPerPage: 10 }}
          isLoading={loading}
        />
      </div>

      {showUserForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}

export default UserList
