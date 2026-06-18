import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const TVA_RATES = [20, 14, 10, 7]

export default function NouvelleFacture() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      number: `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'brouillon',
      lines: [{ description: '', quantity: 1, unit_price: 0, tva_rate: 20 }]
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = watch('lines')

  useEffect(() => {
    api.get('/clients').then(r => setClients(r.data)).catch(() => {})
  }, [])

  const subtotal = lines.reduce((sum, l) => sum + (parseFloat(l.quantity || 0) * parseFloat(l.unit_price || 0)), 0)
  const tva_amount = lines.reduce((sum, l) => {
    const base = parseFloat(l.quantity || 0) * parseFloat(l.unit_price || 0)
    return sum + (base * (parseFloat(l.tva_rate || 20) / 100))
  }, 0)
  const total = subtotal + tva_amount

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        subtotal: subtotal.toFixed(2),
        tva_amount: tva_amount.toFixed(2),
        total: total.toFixed(2),
        lines: data.lines.map(l => ({
          ...l,
          total: (parseFloat(l.quantity) * parseFloat(l.unit_price)).toFixed(2)
        }))
      }
      await api.post('/invoices', payload)
      toast.success('Facture créée avec succès!')
      navigate('/factures')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle Facture</h1>
        <p className="text-gray-500 mt-1">Créer une nouvelle facture client</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de facture</label>
              <input {...register('number', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" {...register('date', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
              <input type="date" {...register('due_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select {...register('client_id')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">— Sélectionner un client —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="brouillon">Brouillon</option>
                <option value="envoyée">Envoyée</option>
                <option value="payée">Payée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Lignes de facturation</h2>
            <button type="button" onClick={() => append({ description: '', quantity: 1, unit_price: 0, tva_rate: 20 })}
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
              <PlusIcon className="h-4 w-4" /> Ajouter une ligne
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-3 font-semibold text-gray-600">Description</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 w-24">Qté</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 w-32">Prix unitaire</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 w-28">TVA (%)</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-600 w-32">Total HT</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="px-3 py-2">
                      <input {...register(`lines.${index}.description`, { required: true })}
                        placeholder="Description du produit/service"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" step="0.01" min="0"
                        {...register(`lines.${index}.quantity`, { required: true, min: 0 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" step="0.01" min="0"
                        {...register(`lines.${index}.unit_price`, { required: true, min: 0 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </td>
                    <td className="px-3 py-2">
                      <select {...register(`lines.${index}.tva_rate`)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                        {TVA_RATES.map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-700">
                      {(parseFloat(lines[index]?.quantity || 0) * parseFloat(lines[index]?.unit_price || 0)).toLocaleString('fr-MA', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2">
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 p-1">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total HT</span>
                <span className="font-medium">{subtotal.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TVA</span>
                <span className="font-medium">{tva_amount.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold text-base border-t border-gray-200 pt-2">
                <span>Total TTC</span>
                <span>{total.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Mentions légales</label>
          <textarea {...register('notes')} rows={3}
            placeholder="Conditions de paiement, mentions légales..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/factures')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {loading ? 'Création...' : 'Créer la facture'}
          </button>
        </div>
      </form>
    </div>
  )
}
