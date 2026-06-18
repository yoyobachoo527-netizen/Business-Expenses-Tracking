import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export interface PVData {
  typePV: string
  denomination: string
  formeJuridique: string
  capital: string
  siegeSocial: string
  rcs: string
  date: string
  heure: string
  lieu: string
  president: string
  secretaire: string
  presents: Array<{ nom: string; qualite: string; parts?: string }>
  ordresDuJour: string[]
  resolutions: Array<{ numero: string; titre: string; texte: string; vote: string }>
  ville: string
}

export function generatePVDocx(data: PVData): Document {
  const resolutionParagraphs = data.resolutions.flatMap(r => [
    new Paragraph({ children: [new TextRun({ text: `RÉSOLUTION N°${r.numero} — ${r.titre.toUpperCase()}`, bold: true })], spacing: { after: 100 } }),
    new Paragraph({ text: r.texte, spacing: { after: 100 } }),
    new Paragraph({ children: [new TextRun({ text: `Vote : ${r.vote}`, italics: true })], spacing: { after: 300 } }),
  ])

  return new Document({
    sections: [{
      children: [
        new Paragraph({ text: `${data.formeJuridique} « ${data.denomination} »`, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: `Capital : ${data.capital} € — Siège : ${data.siegeSocial}`, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
        new Paragraph({ text: `RCS : ${data.rcs}`, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        new Paragraph({ text: `PROCÈS-VERBAL DE ${data.typePV.toUpperCase()}`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        new Paragraph({ text: `Date : ${data.date} — Heure : ${data.heure} — Lieu : ${data.lieu}`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'PRÉSENTS ET REPRÉSENTÉS :', bold: true })], spacing: { after: 150 } }),
        ...data.presents.map(p => new Paragraph({ text: `- ${p.nom} (${p.qualite})${p.parts ? ` — ${p.parts} parts` : ''}`, spacing: { after: 100 } })),
        new Paragraph({ text: '', spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'ORDRE DU JOUR :', bold: true })], spacing: { after: 150 } }),
        ...data.ordresDuJour.map((o, i) => new Paragraph({ text: `${i + 1}. ${o}`, spacing: { after: 100 } })),
        new Paragraph({ text: '', spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: `${data.president} préside la séance.`, italics: true })], spacing: { after: 400 } }),
        new Paragraph({ text: 'DÉLIBÉRATIONS', heading: HeadingLevel.HEADING_2, spacing: { after: 300 } }),
        ...resolutionParagraphs,
        new Paragraph({ text: "L'ordre du jour étant épuisé, la séance est levée.", spacing: { after: 400 } }),
        new Paragraph({ text: `Fait à ${data.ville}, le ${data.date}`, spacing: { after: 600 } }),
        new Paragraph({ children: [new TextRun({ text: 'Le Président : _______________________', bold: true })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Le Secrétaire : _______________________', bold: true })] }),
      ],
    }],
  })
}
