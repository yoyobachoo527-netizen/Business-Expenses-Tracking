import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export interface ContratData {
  typeContrat: string
  partieA: string
  partieAAdresse: string
  partieB: string
  partieBAdresse: string
  objet: string
  duree: string
  prix: string
  modalitesPaiement: string
  ville: string
  date: string
}

const typeLabels: Record<string, string> = {
  nda: 'ACCORD DE CONFIDENTIALITÉ (NDA)',
  prestation: 'CONTRAT DE PRESTATION DE SERVICES',
  bail: 'BAIL COMMERCIAL',
}

export function generateContratDocx(data: ContratData): Document {
  return new Document({
    sections: [{
      children: [
        new Paragraph({ text: typeLabels[data.typeContrat] ?? 'CONTRAT', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        new Paragraph({ children: [new TextRun({ text: 'ENTRE :', bold: true })], spacing: { after: 200 } }),
        new Paragraph({ text: `${data.partieA}, sis(e) au ${data.partieAAdresse}, ci-après « la Partie A »,`, spacing: { after: 200 } }),
        new Paragraph({ text: 'ET', alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
        new Paragraph({ text: `${data.partieB}, sis(e) au ${data.partieBAdresse}, ci-après « la Partie B »,`, spacing: { after: 400 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 1 — Objet', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: data.objet, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 2 — Durée', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `Le présent contrat est conclu pour une durée de ${data.duree}.`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 3 — Prix et modalités de paiement', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `Rémunération : ${data.prix}. Modalités : ${data.modalitesPaiement}.`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 4 — Obligations des parties', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: "Chaque partie s'engage à exécuter ses obligations de bonne foi et conformément aux termes du présent contrat.", spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 5 — Confidentialité', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: "Les parties s'engagent à ne pas divulguer les informations confidentielles échangées dans le cadre du présent contrat.", spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 6 — Résiliation', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: "En cas de manquement grave à ses obligations par l'une des parties, l'autre partie pourra résilier le présent contrat après mise en demeure restée infructueuse pendant 15 jours.", spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 7 — Droit applicable et juridiction', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: 'Le présent contrat est régi par le droit français. Tout litige sera soumis aux tribunaux compétents.', spacing: { after: 400 } }),
        new Paragraph({ text: `Fait à ${data.ville}, le ${data.date}, en deux exemplaires.`, spacing: { after: 600 } }),
        new Paragraph({ children: [new TextRun({ text: 'La Partie A : _______________________', bold: true })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'La Partie B : _______________________', bold: true })] }),
      ],
    }],
  })
}
