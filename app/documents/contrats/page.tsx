'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DownloadButtons from '@/components/DownloadButtons'

const schema = z.object({
  typeContrat: z.string().min(1),
  partieA: z.string().min(1),
  partieAAdresse: z.string().min(1),
  partieB: z.string().min(1),
  partieBAdresse: z.string().min(1),
  objet: z.string().min(1),
  duree: z.string().min(1),
  prix: z.string().min(1),
  modalitesPaiement: z.string().min(1),
  ville: z.string().min(1),
  date: z.string().min(1),
})

type FormData = z.infer<typeof schema>

const inp = 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a2744]'
const lbl = 'block text-sm font-medium text-gray-700 mb-1'

export default function ContratsPage() {
  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { typeContrat: 'prestation' },
  })
  const formData = watch()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1a2744] mb-2">Contrats</h1>
      <p className="text-gray-500 mb-8">Générez vos contrats professionnels.</p>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full"><label className={lbl}>Type de contrat *</label><select {...register('typeContrat')} className={inp}><option value="prestation">Contrat de prestation de services</option><option value="nda">Accord de confidentialité (NDA)</option><option value="bail">Bail commercial</option></select></div>
          <div><label className={lbl}>Partie A (prestataire / bailleur) *</label><input {...register('partieA')} className={inp} placeholder="Nom ou raison sociale" /></div>
          <div><label className={lbl}>Adresse Partie A *</label><input {...register('partieAAdresse')} className={inp} placeholder="Adresse complète" /></div>
          <div><label className={lbl}>Partie B (client / preneur) *</label><input {...register('partieB')} className={inp} placeholder="Nom ou raison sociale" /></div>
          <div><label className={lbl}>Adresse Partie B *</label><input {...register('partieBAdresse')} className={inp} placeholder="Adresse complète" /></div>
          <div><label className={lbl}>Durée *</label><input {...register('duree')} className={inp} placeholder="Ex: 12 mois" /></div>
          <div><label className={lbl}>Rémunération / Loyer *</label><input {...register('prix')} className={inp} placeholder="Ex: 5 000 € HT/mois" /></div>
          <div><label className={lbl}>Modalités de paiement *</label><input {...register('modalitesPaiement')} className={inp} placeholder="Ex: virement à 30 jours" /></div>
          <div><label className={lbl}>Ville *</label><input {...register('ville')} className={inp} placeholder="Paris" /></div>
          <div><label className={lbl}>Date de signature *</label><input type="date" {...register('date')} className={inp} /></div>
          <div className="col-span-full"><label className={lbl}>Objet du contrat *</label><textarea {...register('objet')} rows={3} className={inp} placeholder="Description précise des prestations ou de l'objet..." /></div>
        </div>
        <div className="pt-4 border-t"><DownloadButtons type="contrat" data={formData as Record<string, unknown>} /></div>
      </div>
    </div>
  )
}
