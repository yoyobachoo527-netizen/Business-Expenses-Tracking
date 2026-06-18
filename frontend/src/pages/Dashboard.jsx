import { useState, useEffect } from 'react'
import api from '../api/axios'
import {
  DocumentTextIcon,
  UsersIcon,
  BookOpenIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const [stats, setStats] = useState({ invoices: 0, clients: 0, journal: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [invoicesRes, clientsRes, journalRes] = await Promise.all([
          api.get('/invoices'),
          api.get('/clients'),
          api.get('/journal')
        ])
        const invoices = invoicesRes.data
        const revenue = invoices
          .filter(i => i.status === 'payée')
          .reduce((sum, i) => sum + parseFloat(i.total || 0), 0)
        setStats({
          invoices: invoices.length,
          clients: clientsRes.data.length,
          journal: journalRes.data.length,
          revenue
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const cards = [
    { label: 'Total Factures', value: stats.invoices, icon: DocumentTextIcon, color: 'bg-blue-500', bg: 'bg-blue-50' },
    { label: 'Clients', value: stats.clients, icon: UsersIcon, color: 'bg-green-500', bg: 'bg-green-50' },
    { label: 'Écritures Journal', value: stats.journal, icon: BookOpenIcon, color: 'bg-purple-500', bg: 'bg-purple-50' },
    { label: 'Chiffre d\'affaires (MAD)', value: stats.revenue.toLocaleString('fr-MA', { minimumFractionDigits: 2 }), icon: BanknotesIcon, color: 'bg-amber-500', bg: 'bg-amber-50' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de votre activité comptable</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement des statistiques...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${bg} p-3 rounded-xl`}>
                  <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations CGNC</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Classes', value: '7', desc: 'Plan comptable' },
            { label: 'TVA 20%', value: 'Standard', desc: 'Taux normal' },
            { label: 'TVA 14%', value: 'Réduit', desc: 'Transport, eau' },
            { label: 'TVA 10%', value: 'Réduit', desc: 'Hôtellerie, alimentation' },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-4">
              <p className="text-lg font-bold text-primary-700">{item.value}</p>
              <p className="text-xs font-medium text-gray-700">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
