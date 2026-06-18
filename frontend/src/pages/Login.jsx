import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (isRegister) {
        await registerUser(data.name, data.email, data.password, data.company_name)
        toast.success('Compte créé avec succès!')
      } else {
        await login(data.email, data.password)
        toast.success('Connexion réussie!')
      }
      navigate('/dashboard')
    } catch (error) {
      const msg = error.response?.data?.error || 'Une erreur est survenue'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Comptabilité PME</h1>
          <p className="text-gray-500 text-sm mt-2">Système de gestion comptable CGNC</p>
          <p className="text-gray-400 text-xs mt-1">المغرب - Maroc</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isRegister ? 'bg-white shadow text-primary-700' : 'text-gray-500'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isRegister ? 'bg-white shadow text-primary-700' : 'text-gray-500'}`}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  {...register('name', { required: 'Nom requis' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Mohammed Alaoui"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
                <input
                  {...register('company_name')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="SARL Mon Entreprise"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email', { required: 'Email requis', pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' } })}
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="exemple@entreprise.ma"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              {...register('password', { required: 'Mot de passe requis', minLength: { value: 6, message: 'Minimum 6 caractères' } })}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Chargement...' : (isRegister ? 'Créer un compte' : 'Se connecter')}
          </button>
        </form>
      </div>
    </div>
  )
}
