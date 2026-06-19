import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const loadClients = () => {
    api.get('/clients')
      .then(r => setClients(r.data))
      .catch(() => toast.error('Erreur lors du chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadClients() }, [])

  const onSubmit = async (data) => {
    try {
      await api.post('/clients', data)
      toast.success('Client ajouté avec succès!')
      reset()
      setShowForm(false)
      loadClients()
    } catch {
      toast.error("Erreur lors de l'ajout du client")
    }
  }

  const deleteClient = async (id) => {
    if (!window.confirm('Supprimer ce client?')) return
    try {
      await api.delete(`/clients/${id}`)
      toast.success('Client supprimé')
      setClients(prev => prev.filter(c => c.id !== id))
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">{clients.length} client(s)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {showForm ? <XMarkIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
          {showForm ? 'Annuler' : 'Nouveau client'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Ajouter un client</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input {...register('name', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nom du client" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ICE</label>
              <input {...register('ice')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Identifiant Commun Entreprise" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" {...register('email')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="email@client.ma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input {...register('phone')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="+212 6 00 00 00 00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input {...register('city')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Casablanca" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input {...register('address')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Adresse complète" />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end">
              <button type="submit" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                Ajouter le client
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-400">Aucun client. Ajoutez votre premier client.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Nom</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">ICE</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Téléphone</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Ville</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-xs">{client.ice || '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{client.email || '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{client.phone || '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{client.city || '—'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => deleteClient(client.id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
