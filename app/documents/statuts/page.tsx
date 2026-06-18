'use client'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DownloadButtons from '@/components/DownloadButtons'
import { Plus, Trash2 } from 'lucide-react'

const schema = z.object({
  denomination: z.string().min(1, 'Requis'),
  formeJuridique: z.string().min(1, 'Requis'),
  capital: z.string().min(1, 'Requis'),
  siegeSocial: z.string().min(1, 'Requis'),
  objetSocial: z.string().min(1, 'Requis'),
  duree: z.string().min(1, 'Requis'),
  gerantPresident: z.string().min(1, 'Requis'),
  associes: z.array(z.object({ nom: z.string().min(1), parts: z.string().min(1) })).min(1),
  dateConstitution: z.string().min(1, 'Requis'),
  ville: z.string().min(1, 'Requis'),
})

type FormData = z.infer<typeof schema>

const inp = 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a2744]'
const lbl = 'block text-sm font-medium text-gray-700 mb-1'

export default function StatutsPage() {
  const { register, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { formeJuridique: 'SARL', duree: '99', associes: [{ nom: '', parts: '' }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'associes' })
  const formData = watch()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1a2744] mb-2">Statuts de Société</h1>
      <p className="text-gray-500 mb-8">Remplissez les informations pour générer vos statuts.</p>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lbl}>Dénomination sociale *</label><input {...register('denomination')} className={inp} placeholder="Ex: Ma Société" />{errors.denomination && <p className="text-red-500 text-xs mt-1">{errors.denomination.message}</p>}</div>
          <div><label className={lbl}>Forme juridique *</label><select {...register('formeJuridique')} className={inp}><option>SARL</option><option>SAS</option><option>SASU</option><option>SA</option><option>SNC</option><option>EURL</option></select></div>
          <div><label className={lbl}>Capital social (€) *</label><input {...register('capital')} className={inp} placeholder="Ex: 10 000" /></div>
          <div><label className={lbl}>Siège social *</label><input {...register('siegeSocial')} className={inp} placeholder="Adresse complète" /></div>
          <div><label className={lbl}>Durée (années) *</label><input {...register('duree')} className={inp} placeholder="99" /></div>
          <div><label className={lbl}>Gérant / Président *</label><input {...register('gerantPresident')} className={inp} placeholder="Nom complet" /></div>
          <div><label className={lbl}>Date de constitution *</label><input type="date" {...register('dateConstitution')} className={inp} /></div>
          <div><label className={lbl}>Ville *</label><input {...register('ville')} className={inp} placeholder="Paris" /></div>
        </div>
        <div><label className={lbl}>Objet social *</label><textarea {...register('objetSocial')} rows={3} className={inp} placeholder="Description des activités de la société..." /></div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={lbl}>Associés *</label>
            <button type="button" onClick={() => append({ nom: '', parts: '' })} className="flex items-center gap-1 text-sm text-[#1a2744] hover:text-blue-600"><Plus className="w-4 h-4" /> Ajouter un associé</button>
          </div>
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input {...register(`associes.${i}.nom`)} placeholder="Nom de l'associé" className="flex-1 border rounded-lg px-3 py-2" />
              <input {...register(`associes.${i}.parts`)} placeholder="Nb parts" className="w-28 border rounded-lg px-3 py-2" />
              {fields.length > 1 && <button type="button" onClick={() => remove(i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>}
            </div>
          ))}
        </div>
        <div className="pt-4 border-t"><DownloadButtons type="statuts" data={formData as Record<string, unknown>} /></div>
      </div>
    </div>
  )
}
