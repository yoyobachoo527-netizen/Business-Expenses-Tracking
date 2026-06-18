import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import ReactPDF from '@react-pdf/renderer'
import React from 'react'
import { StatutsPDF } from '@/lib/pdf-templates/StatutsPDF'
import { PVPDF } from '@/lib/pdf-templates/PVPDF'
import { CessionPDF } from '@/lib/pdf-templates/CessionPDF'
import { ContratPDF } from '@/lib/pdf-templates/ContratPDF'

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let element: React.ReactElement<any>
    let filename = 'document.pdf'

    switch (type) {
      case 'statuts':
        element = React.createElement(StatutsPDF, { data })
        filename = `statuts-${data.denomination ?? 'societe'}.pdf`
        break
      case 'pv':
        element = React.createElement(PVPDF, { data })
        filename = `pv-${data.denomination ?? 'societe'}.pdf`
        break
      case 'cession':
        element = React.createElement(CessionPDF, { data })
        filename = `cession-${data.denomination ?? 'societe'}.pdf`
        break
      case 'contrat':
        element = React.createElement(ContratPDF, { data })
        filename = `contrat-${data.typeContrat ?? 'contrat'}.pdf`
        break
      default:
        return NextResponse.json({ error: 'Type inconnu' }, { status: 400 })
    }

    const buffer = await ReactPDF.renderToBuffer(element)

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur de génération PDF' }, { status: 500 })
  }
}
