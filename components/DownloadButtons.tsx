'use client'
import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'

interface Props {
  type: string
  data: Record<string, unknown>
}

export default function DownloadButtons({ type, data }: Props) {
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingDocx, setLoadingDocx] = useState(false)

  async function download(format: 'pdf' | 'docx') {
    const setLoading = format === 'pdf' ? setLoadingPdf : setLoadingDocx
    setLoading(true)
    try {
      const res = await fetch(`/api/generate/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `document.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors de la génération du document.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={() => download('pdf')}
        disabled={loadingPdf}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
        Télécharger PDF
      </button>
      <button
        onClick={() => download('docx')}
        disabled={loadingDocx}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loadingDocx ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
        Télécharger DOCX
      </button>
    </div>
  )
}
