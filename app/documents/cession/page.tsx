'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DownloadButtons from '@/components/DownloadButtons'

const schema = z.object({
  typeCession: z.string().min(1),
  denomination: z.string().min(1),
  formeJuridique: z.string().min(1),
  capital: z.string().min(1),
  rcs: z.string().min(1),
  cedantNom: z.string().min(1),
  cedantAdresse: z.string().min(1),
  cessionnairenom: z.string().min(1),
  cessionnaireAdresse: z.string().min(1),
  nombreParts: z.string().min(1),
  prixTotal: z.string().min(1),
  prixParPart: z.string().min(1),
  dateEffet: z.string().min(1),
  ville: z.string().min(1),
  date: z.string().min(1),
})

type FormData = z.infer<typeof schema>

const inp = 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a2744]'
const lbl = 'block text-sm font-medium text-gray-700 mb-1'

export default function CessionPage() {
  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { typeCession: 'CESSION DE PARTS SOCIALES', formeJuridique: 'SARL' },
  })
  const formData = watch()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1a2744] mb-2">Acte de Cession</h1>
      <p className="text-gray-500 mb-8">Documentez le transfert de propriété.</p>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lbl}>Type de cession *</label><select {...register('typeCession')} className={inp}><option>CESSION DE PARTS SOCIALES</option><option>CESSION D&apos;ACTIONS</option><option>CESSION DE FONDS DE COMMERCE</option></select></div>
          <div><label className={lbl}>Dénomination de la société *</label><input {...register('denomination')} className={inp} placeholder="Nom société" /></div>
          <div><label className={lbl}>Forme juridique *</label><select {...register('formeJuridique')} className={inp}><option>SARL</option><option>SAS</option><option>SASU</option><option>SA</option><option>EURL</option></select></div>
          <div><label className={lbl}>Capital (€) *</label><input {...register('capital')} className={inp} placeholder="10 000" /></div>
          <div><label className={lbl}>N° RCS *</label><input {...register('rcs')} className={inp} placeholder="Paris 123 456 789" /></div>
          <div />
          <div><label className={lbl}>Nom du Cédant *</label><input {...register('cedantNom')} className={inp} placeholder="Nom complet" /></div>
          <div><label className={lbl}>Adresse du Cédant *</label><input {...register('cedantAdresse')} className={inp} placeholder="Adresse complète" /></div>
          <div><label className={lbl}>Nom du Cessionnaire *</label><input {...register('cessionnairenom')} className={inp} placeholder="Nom complet" /></div>
          <div><label className={lbl}>Adresse du Cessionnaire *</label><input {...register('cessionnaireAdresse')} className={inp} placeholder="Adresse complète" /></div>
          <div><label className={lbl}>Nombre de parts cédées *</label><input {...register('nombreParts')} className={inp} placeholder="Ex: 50" /></div>
          <div><label className={lbl}>Prix total (€) *</label><input {...register('prixTotal')} className={inp} placeholder="Ex: 5 000" /></div>
          <div><label className={lbl}>Prix par part (€) *</label><input {...register('prixParPart')} className={inp} placeholder="Ex: 100" /></div>
          <div><label className={lbl}>Date d&apos;effet *</label><input type="date" {...register('dateEffet')} className={inp} /></div>
          <div><label className={lbl}>Ville *</label><input {...register('ville')} className={inp} placeholder="Paris" /></div>
          <div><label className={lbl}>Date de signature *</label><input type="date" {...register('date')} className={inp} /></div>
        </div>
        <div className="pt-4 border-t"><DownloadButtons type="cession" data={formData as Record<string, unknown>} /></div>
      </div>
    </div>
  )
}
