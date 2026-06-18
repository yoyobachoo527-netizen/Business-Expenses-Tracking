import Link from 'next/link'
import { Scale } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-[#1a2744] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Scale className="w-7 h-7 text-amber-400" />
            <span className="font-semibold text-lg tracking-wide">LexDocs</span>
          </Link>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/documents/statuts" className="hover:text-amber-400 transition-colors">Statuts</Link>
            <Link href="/documents/pv" className="hover:text-amber-400 transition-colors">PV</Link>
            <Link href="/documents/cession" className="hover:text-amber-400 transition-colors">Cession</Link>
            <Link href="/documents/contrats" className="hover:text-amber-400 transition-colors">Contrats</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
