import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-gray-800 font-semibold text-base">Gestion Comptable</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserCircleIcon className="h-6 w-6 text-primary-600" />
          <span className="font-medium">{user?.name}</span>
          <span className="text-gray-400">|</span>
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </header>
  )
}
