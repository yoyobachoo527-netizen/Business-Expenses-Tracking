import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export interface CessionData {
  typeCession: string
  denomination: string
  formeJuridique: string
  capital: string
  rcs: string
  cedantNom: string
  cedantAdresse: string
  cessionnairenom: string
  cessionnaireAdresse: string
  nombreParts: string
  prixTotal: string
  prixParPart: string
  dateEffet: string
  ville: string
  date: string
}

export function generateCessionDocx(data: CessionData): Document {
  return new Document({
    sections: [{
      children: [
        new Paragraph({ text: `ACTE DE ${data.typeCession.toUpperCase()}`, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        new Paragraph({ children: [new TextRun({ text: 'ENTRE LES SOUSSIGNÉS :', bold: true })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'LE CÉDANT :', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `${data.cedantNom}, demeurant au ${data.cedantAdresse},`, spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'LE CESSIONNAIRE :', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `${data.cessionnairenom}, demeurant au ${data.cessionnaireAdresse},`, spacing: { after: 300 } }),
        new Paragraph({ text: 'IL A ÉTÉ CONVENU ET ARRÊTÉ CE QUI SUIT :', alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 1 — Objet de la cession', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `Le Cédant cède et transporte au Cessionnaire, qui accepte, ${data.nombreParts} parts sociales de la société ${data.formeJuridique} « ${data.denomination} » (RCS : ${data.rcs}), au capital de ${data.capital} euros.`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 2 — Prix de cession', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `La présente cession est consentie moyennant le prix de ${data.prixTotal} euros (soit ${data.prixParPart} euros par part).`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: "Article 3 — Date d'effet", bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `La présente cession prend effet à compter du ${data.dateEffet}.`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 4 — Garanties', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: "Le Cédant garantit qu'il est propriétaire des parts cédées, libres de tout nantissement, saisie ou opposition. Il garantit l'éviction et les vices cachés.", spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 5 — Droit applicable', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: 'Le présent acte est régi par le droit français. Tout litige sera soumis aux juridictions compétentes.', spacing: { after: 400 } }),
        new Paragraph({ text: `Fait à ${data.ville}, en deux exemplaires originaux, le ${data.date}.`, spacing: { after: 600 } }),
        new Paragraph({ children: [new TextRun({ text: 'Le Cédant : _______________________', bold: true })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Le Cessionnaire : _______________________', bold: true })] }),
      ],
    }],
  })
}
