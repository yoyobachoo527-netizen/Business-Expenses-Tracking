import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/journal')
      .then(r => setEntries(r.data))
      .catch(() => toast.error('Erreur lors du chargement du journal'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Journal comptable</h1>
        <p className="text-gray-500 mt-1">{entries.length} écriture(s)</p>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-400">Aucune écriture comptable.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                    {new Date(entry.date).toLocaleDateString('fr-MA')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{entry.description || 'Sans description'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Réf: {entry.reference || '—'} | Pièce: {entry.piece_number || '—'}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {entry.JournalLines?.length || 0} ligne(s) • {expanded === entry.id ? '▲' : '▼'}
                </div>
              </button>
              {expanded === entry.id && entry.JournalLines && (
                <div className="border-t border-gray-100 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 font-semibold text-gray-500">Compte</th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-500">Libellé</th>
                        <th className="text-right px-5 py-3 font-semibold text-gray-500">Débit (MAD)</th>
                        <th className="text-right px-5 py-3 font-semibold text-gray-500">Crédit (MAD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {entry.JournalLines.map(line => (
                        <tr key={line.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-mono text-primary-700">
                            {line.Account?.code} — {line.Account?.label}
                          </td>
                          <td className="px-5 py-3 text-gray-600">{line.label || '—'}</td>
                          <td className="px-5 py-3 text-right text-green-700 font-medium">
                            {parseFloat(line.debit) > 0 ? parseFloat(line.debit).toLocaleString('fr-MA', { minimumFractionDigits: 2 }) : ''}
                          </td>
                          <td className="px-5 py-3 text-right text-red-700 font-medium">
                            {parseFloat(line.credit) > 0 ? parseFloat(line.credit).toLocaleString('fr-MA', { minimumFractionDigits: 2 }) : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
