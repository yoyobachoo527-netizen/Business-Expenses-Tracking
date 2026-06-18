'use client'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DownloadButtons from '@/components/DownloadButtons'
import { Plus, Trash2 } from 'lucide-react'

const schema = z.object({
  typePV: z.string().min(1),
  denomination: z.string().min(1),
  formeJuridique: z.string().min(1),
  capital: z.string().min(1),
  siegeSocial: z.string().min(1),
  rcs: z.string().min(1),
  date: z.string().min(1),
  heure: z.string().min(1),
  lieu: z.string().min(1),
  president: z.string().min(1),
  secretaire: z.string().min(1),
  presents: z.array(z.object({ nom: z.string().min(1), qualite: z.string().min(1), parts: z.string().optional() })).min(1),
  ordresDuJour: z.array(z.object({ texte: z.string().min(1) })).min(1),
  resolutions: z.array(z.object({ numero: z.string().min(1), titre: z.string().min(1), texte: z.string().min(1), vote: z.string().min(1) })).min(1),
  ville: z.string().min(1),
})

type FormData = z.infer<typeof schema>

const inp = 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a2744]'
const lbl = 'block text-sm font-medium text-gray-700 mb-1'

export default function PVPage() {
  const { register, control, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      typePV: 'AG ORDINAIRE ANNUELLE', formeJuridique: 'SARL',
      presents: [{ nom: '', qualite: '', parts: '' }],
      ordresDuJour: [{ texte: '' }],
      resolutions: [{ numero: '1', titre: '', texte: '', vote: "Adoptée à l'unanimité" }],
    },
  })
  const presents = useFieldArray({ control, name: 'presents' })
  const ordres = useFieldArray({ control, name: 'ordresDuJour' })
  const resolutions = useFieldArray({ control, name: 'resolutions' })
  const formData = watch()
  const flatData = { ...formData, ordresDuJour: formData.ordresDuJour?.map(o => o.texte) ?? [] }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1a2744] mb-2">Procès-Verbal</h1>
      <p className="text-gray-500 mb-8">Formalisez les décisions de votre assemblée.</p>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lbl}>Type de PV *</label><select {...register('typePV')} className={inp}><option>AG ORDINAIRE ANNUELLE</option><option>AG EXTRAORDINAIRE</option><option>DÉCISION DE GÉRANT</option><option>AG ORDINAIRE</option></select></div>
          <div><label className={lbl}>Dénomination *</label><input {...register('denomination')} className={inp} placeholder="Nom de la société" /></div>
          <div><label className={lbl}>Forme juridique *</label><select {...register('formeJuridique')} className={inp}><option>SARL</option><option>SAS</option><option>SASU</option><option>SA</option><option>EURL</option></select></div>
          <div><label className={lbl}>Capital (€) *</label><input {...register('capital')} className={inp} placeholder="10 000" /></div>
          <div><label className={lbl}>Siège social *</label><input {...register('siegeSocial')} className={inp} placeholder="Adresse" /></div>
          <div><label className={lbl}>N° RCS *</label><input {...register('rcs')} className={inp} placeholder="Paris 123 456 789" /></div>
          <div><label className={lbl}>Date *</label><input type="date" {...register('date')} className={inp} /></div>
          <div><label className={lbl}>Heure *</label><input type="time" {...register('heure')} className={inp} /></div>
          <div><label className={lbl}>Lieu *</label><input {...register('lieu')} className={inp} placeholder="Siège social" /></div>
          <div><label className={lbl}>Président de séance *</label><input {...register('president')} className={inp} placeholder="Nom complet" /></div>
          <div><label className={lbl}>Secrétaire *</label><input {...register('secretaire')} className={inp} placeholder="Nom complet" /></div>
          <div><label className={lbl}>Ville *</label><input {...register('ville')} className={inp} placeholder="Paris" /></div>
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className={lbl}>Présents *</label><button type="button" onClick={() => presents.append({ nom: '', qualite: '', parts: '' })} className="text-sm text-[#1a2744] flex items-center gap-1"><Plus className="w-4 h-4" />Ajouter</button></div>
          {presents.fields.map((f, i) => (<div key={f.id} className="flex gap-2 mb-2"><input {...register(`presents.${i}.nom`)} placeholder="Nom" className="flex-1 border rounded-lg px-3 py-2" /><input {...register(`presents.${i}.qualite`)} placeholder="Qualité" className="flex-1 border rounded-lg px-3 py-2" /><input {...register(`presents.${i}.parts`)} placeholder="Parts" className="w-24 border rounded-lg px-3 py-2" />{presents.fields.length > 1 && <button type="button" onClick={() => presents.remove(i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>}</div>))}
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className={lbl}>Ordre du jour *</label><button type="button" onClick={() => ordres.append({ texte: '' })} className="text-sm text-[#1a2744] flex items-center gap-1"><Plus className="w-4 h-4" />Ajouter</button></div>
          {ordres.fields.map((f, i) => (<div key={f.id} className="flex gap-2 mb-2"><input {...register(`ordresDuJour.${i}.texte`)} placeholder={`Point ${i + 1}`} className="flex-1 border rounded-lg px-3 py-2" />{ordres.fields.length > 1 && <button type="button" onClick={() => ordres.remove(i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>}</div>))}
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className={lbl}>Résolutions *</label><button type="button" onClick={() => resolutions.append({ numero: String(resolutions.fields.length + 1), titre: '', texte: '', vote: "Adoptée à l'unanimité" })} className="text-sm text-[#1a2744] flex items-center gap-1"><Plus className="w-4 h-4" />Ajouter</button></div>
          {resolutions.fields.map((f, i) => (<div key={f.id} className="border rounded-lg p-3 mb-3 bg-gray-50"><div className="grid grid-cols-2 gap-2 mb-2"><input {...register(`resolutions.${i}.numero`)} placeholder="N°" className="border rounded-lg px-3 py-2" /><input {...register(`resolutions.${i}.titre`)} placeholder="Titre" className="border rounded-lg px-3 py-2" /></div><textarea {...register(`resolutions.${i}.texte`)} placeholder="Texte de la résolution..." rows={2} className="w-full border rounded-lg px-3 py-2 mb-2" /><input {...register(`resolutions.${i}.vote`)} placeholder="Résultat du vote" className="w-full border rounded-lg px-3 py-2" />{resolutions.fields.length > 1 && <button type="button" onClick={() => resolutions.remove(i)} className="text-red-500 text-sm mt-1 flex items-center gap-1"><Trash2 className="w-3 h-3" />Supprimer</button>}</div>))}
        </div>
        <div className="pt-4 border-t"><DownloadButtons type="pv" data={flatData as Record<string, unknown>} /></div>
      </div>
    </div>
  )
}
