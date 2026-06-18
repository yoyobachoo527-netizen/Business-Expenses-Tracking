import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { PlusIcon } from '@heroicons/react/24/outline'

const statusConfig = {
  brouillon: { label: 'Brouillon', class: 'bg-gray-100 text-gray-700' },
  envoyée: { label: 'Envoyée', class: 'bg-blue-100 text-blue-700' },
  payée: { label: 'Payée', class: 'bg-green-100 text-green-700' },
  annulée: { label: 'Annulée', class: 'bg-red-100 text-red-700' },
}

export default function Factures() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/invoices')
      .then(r => setInvoices(r.data))
      .catch(() => toast.error('Erreur lors du chargement des factures'))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/invoices/${id}`, { status })
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv))
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
          <p className="text-gray-500 mt-1">{invoices.length} facture(s)</p>
        </div>
        <Link
          to="/factures/nouvelle"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Nouvelle facture
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-400">Aucune facture. Créez votre première facture.</p>
          <Link to="/factures/nouvelle" className="mt-4 inline-block text-primary-600 hover:underline text-sm">
            Créer une facture
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Numéro</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Client</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Échéance</th>
                <th className="text-right px-6 py-4 font-semibold text-gray-600">Total (MAD)</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Statut</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map(inv => {
                const status = statusConfig[inv.status] || statusConfig.brouillon
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary-700">{inv.number}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(inv.date).toLocaleDateString('fr-MA')}</td>
                    <td className="px-6 py-4 text-gray-700">{inv.Client?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{inv.due_date ? new Date(inv.due_date).toLocaleDateString('fr-MA') : '—'}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {parseFloat(inv.total).toLocaleString('fr-MA', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={inv.status}
                        onChange={e => updateStatus(inv.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                      >
                        <option value="brouillon">Brouillon</option>
                        <option value="envoyée">Envoyée</option>
                        <option value="payée">Payée</option>
                        <option value="annulée">Annulée</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
