import Link from 'next/link'
import { FileText, Users, ArrowRightLeft, FileSignature } from 'lucide-react'

const documentTypes = [
  {
    href: '/documents/statuts',
    icon: FileText,
    title: 'Statuts de Société',
    description: 'Rédigez les statuts constitutifs de votre société.',
    types: ['SARL', 'SAS / SASU', 'SA', 'SNC'],
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    href: '/documents/pv',
    icon: Users,
    title: 'Procès-Verbaux',
    description: 'Formalisez les décisions collectives de votre société.',
    types: ['AG Ordinaire', 'AG Extraordinaire', 'Décision de Gérant'],
    color: 'bg-green-50 border-green-200 hover:border-green-400',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    href: '/documents/cession',
    icon: ArrowRightLeft,
    title: 'Actes de Cession',
    description: 'Documentez les transferts de propriété.',
    types: ['Cession de parts sociales', "Cession d'actions", 'Cession de fonds de commerce'],
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    href: '/documents/contrats',
    icon: FileSignature,
    title: 'Contrats',
    description: 'Établissez vos contrats professionnels.',
    types: ['Bail commercial', 'NDA / Confidentialité', 'Prestation de services'],
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1a2744] mb-4">
          Générateur de Documents Juridiques
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Créez vos documents juridiques professionnels en quelques minutes.
          Téléchargez en <strong>PDF</strong> ou <strong>Word (DOCX)</strong>.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentTypes.map((doc) => {
          const Icon = doc.icon
          return (
            <Link key={doc.href} href={doc.href}>
              <div className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer ${doc.color}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${doc.iconBg} shrink-0`}>
                    <Icon className={`w-6 h-6 ${doc.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[#1a2744] mb-1">{doc.title}</h2>
                    <p className="text-gray-600 text-sm mb-3">{doc.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {doc.types.map((t) => (
                        <span key={t} className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      <p className="text-center text-xs text-gray-400 mt-12">
        Documents générés à titre informatif. Consultez un professionnel du droit pour validation.
      </p>
    </div>
  )
}
