import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { updateUserApproval, updateUser, deleteUser, createUser } from '../../../store/users/thunks'
import CustomTable, { Column, Action } from '../customTable'
import { User } from '../../../interfaces/users'
import UserForm from './UserForm'
import Loading from '../../../components/loading'
import { FaPlus } from 'react-icons/fa'
import { Delete, CheckCircle, Edit } from '@mui/icons-material'

const columns: Column[] = [
  { field: 'name',           headerName: 'Nombre',       align: 'left'   },
  { field: 'email',          headerName: 'Email',        align: 'left'   },
  { field: 'razonSocial',    headerName: 'Razón Social', align: 'left'   },
  { field: 'CUIT',           headerName: 'CUIT',         align: 'center' },
  { field: 'phone',          headerName: 'Teléfono',     align: 'center' },
  { field: 'approvalStatus', headerName: 'Estado',       align: 'center' },
  { field: 'role',           headerName: 'Rol',          align: 'center' },
]

const actions: Action[] = [
  { name: 'edit',    icon: <Edit />,         tooltip: 'Editar',           color: 'primary'   },
  { name: 'approve', icon: <CheckCircle />,  tooltip: 'Aprobar usuario',  color: 'primary'   },
  { name: 'delete',  icon: <Delete />,       tooltip: 'Eliminar usuario', color: 'secondary' },
]

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading } = useSelector((state: RootState) => state.users)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleActionClick = (action: Action, user: User) => {
    switch (action.name) {
      case 'edit':
        setEditingUser(user)
        setShowUserForm(true)
        break
      case 'approve':
        if (user.approvalStatus !== 'APPROVED') dispatch(updateUserApproval(user.id, 'APPROVED'))
        break
      case 'delete':
        if (window.confirm(`¿Eliminar al usuario ${user.name}?`)) dispatch(deleteUser(user.id))
        break
    }
  }

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      dispatch(updateUser(editingUser.id, userData))
    } else {
      dispatch(createUser(userData))
    }
    setShowUserForm(false)
    setEditingUser(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loading />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-heading text-primary">
          Usuarios
          <span className="ml-2 text-sm font-body text-secondary-light font-normal">({users.length})</span>
        </h2>
        <button
          onClick={() => { setEditingUser(null); setShowUserForm(true) }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        >
          <FaPlus size={12} /> Nuevo usuario
        </button>
      </div>

      <CustomTable
        columns={columns}
        data={users}
        actions={actions}
        onActionClick={handleActionClick}
        pagination={{ rowsPerPage: 10, rowsPerPageOptions: [10, 25, 50] }}
        isLoading={loading}
        searchPlaceholder="Buscar por nombre, email, CUIT..."
      />

      {showUserForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => { setShowUserForm(false); setEditingUser(null) }}
        />
      )}
    </div>
  )
}

export default UserList
