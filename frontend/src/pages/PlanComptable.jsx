import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const typeColors = {
  actif: 'bg-blue-100 text-blue-700',
  passif: 'bg-purple-100 text-purple-700',
  charge: 'bg-red-100 text-red-700',
  produit: 'bg-green-100 text-green-700',
  tresorerie: 'bg-amber-100 text-amber-700',
}

const typeLabels = {
  actif: 'Actif',
  passif: 'Passif',
  charge: 'Charge',
  produit: 'Produit',
  tresorerie: 'Trésorerie',
}

export default function PlanComptable() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    api.get('/accounts')
      .then(r => setAccounts(r.data))
      .catch(() => toast.error('Erreur lors du chargement des comptes'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = accounts.filter(a => {
    const matchSearch = !search || a.code.includes(search) || a.label.toLowerCase().includes(search.toLowerCase())
    const matchType = !filterType || a.type === filterType
    return matchSearch && matchType
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plan Comptable CGNC</h1>
        <p className="text-gray-500 mt-1">Code Général de la Normalisation Comptable — {accounts.length} comptes</p>
      </div>
      <div className="flex gap-3 mb-6">
        <input type="text" placeholder="Rechercher par code ou libellé..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Tous les types</option>
          {Object.entries(typeLabels).map(([key, val]) => (
            <option key={key} value={key}>{val}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Code</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Libellé</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(account => (
                <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-mono font-medium text-primary-700"
                    style={{ paddingLeft: `${Math.max(24, (account.code.length - 1) * 8)}px` }}>
                    {account.code}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{account.label}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[account.type] || 'bg-gray-100 text-gray-700'}`}>
                      {typeLabels[account.type] || account.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400">Aucun compte trouvé</div>}
        </div>
      )}
    </div>
  )
}
