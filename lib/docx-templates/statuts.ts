import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export interface StatutsData {
  denomination: string
  formeJuridique: string
  capital: string
  siegeSocial: string
  objetSocial: string
  duree: string
  gerantPresident: string
  associes: Array<{ nom: string; parts: string }>
  dateConstitution: string
  ville: string
}

export function generateStatutsDocx(data: StatutsData): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: `${data.formeJuridique} « ${data.denomination} »`, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
        new Paragraph({ text: 'STATUTS', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        new Paragraph({ children: [new TextRun({ text: 'Entre les soussignés :', bold: true })], spacing: { after: 200 } }),
        ...data.associes.map(a => new Paragraph({ text: `- ${a.nom}, titulaire de ${a.parts} parts sociales`, spacing: { after: 100 } })),
        new Paragraph({ text: '', spacing: { after: 200 } }),
        new Paragraph({ text: 'Il a été convenu et arrêté les statuts suivants :', spacing: { after: 400 } }),
        new Paragraph({ text: 'TITRE PREMIER — FORME, DÉNOMINATION, OBJET, SIÈGE, DURÉE', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 1 — Forme', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `Il est formé entre les propriétaires des parts sociales ci-après créées une société (${data.formeJuridique}) régie par les dispositions législatives et réglementaires en vigueur, notamment par les articles L. 223-1 et suivants du Code de commerce, ainsi que par les présents statuts.`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 2 — Dénomination sociale', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `La société a pour dénomination sociale : « ${data.denomination} ».`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 3 — Objet social', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `La société a pour objet : ${data.objetSocial}`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 4 — Siège social', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `Le siège social est fixé à : ${data.siegeSocial}.`, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 5 — Durée', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `La durée de la société est fixée à ${data.duree} ans à compter de la date de son immatriculation au Registre du Commerce et des Sociétés.`, spacing: { after: 400 } }),
        new Paragraph({ text: 'TITRE DEUXIÈME — CAPITAL SOCIAL', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 6 — Capital social', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `Le capital social est fixé à la somme de ${data.capital} euros. Il est divisé en parts sociales de valeur nominale égale.`, spacing: { after: 400 } }),
        new Paragraph({ text: 'TITRE TROISIÈME — GÉRANCE / DIRECTION', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Article 7 — Gérant / Président', bold: true })], spacing: { after: 100 } }),
        new Paragraph({ text: `La société est gérée et administrée par : ${data.gerantPresident}, investi(e) des pouvoirs les plus étendus pour agir en toutes circonstances au nom de la société dans la limite de l'objet social.`, spacing: { after: 400 } }),
        new Paragraph({ text: 'TITRE QUATRIÈME — DISPOSITIONS FINALES', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Paragraph({ text: "Les présents statuts ont été établis et signés par les associés fondateurs en autant d'originaux que nécessaire pour les formalités légales.", spacing: { after: 400 } }),
        new Paragraph({ text: `Fait à ${data.ville}, le ${data.dateConstitution}`, spacing: { after: 600 } }),
        new Paragraph({ children: [new TextRun({ text: 'Signatures des associés fondateurs :', bold: true })], spacing: { after: 300 } }),
        ...data.associes.map(a => new Paragraph({ text: `${a.nom} : _______________________`, spacing: { after: 200 } })),
      ],
    }],
  })
}
