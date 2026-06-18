import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

import { Packer } from 'docx'
import { generateStatutsDocx } from '@/lib/docx-templates/statuts'
import { generatePVDocx } from '@/lib/docx-templates/pv'
import { generateCessionDocx } from '@/lib/docx-templates/cession'
import { generateContratDocx } from '@/lib/docx-templates/contrats'

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json()

    let buffer: Uint8Array
    let filename = 'document.docx'

    switch (type) {
      case 'statuts': {
        const doc = generateStatutsDocx(data)
        buffer = await Packer.toBuffer(doc)
        filename = `statuts-${data.denomination ?? 'societe'}.docx`
        break
      }
      case 'pv': {
        const doc = generatePVDocx(data)
        buffer = await Packer.toBuffer(doc)
        filename = `pv-${data.denomination ?? 'societe'}-${data.date ?? ''}.docx`
        break
      }
      case 'cession': {
        const doc = generateCessionDocx(data)
        buffer = await Packer.toBuffer(doc)
        filename = `cession-${data.denomination ?? 'societe'}.docx`
        break
      }
      case 'contrat': {
        const doc = generateContratDocx(data)
        buffer = await Packer.toBuffer(doc)
        filename = `contrat-${data.typeContrat ?? 'contrat'}.docx`
        break
      }
      default:
        return NextResponse.json({ error: 'Type inconnu' }, { status: 400 })
    }

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur de génération DOCX' }, { status: 500 })
  }
}
