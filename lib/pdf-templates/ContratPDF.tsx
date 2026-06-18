import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { ContratData } from '../docx-templates/contrats'

const s = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.6 },
  header: { backgroundColor: '#1a2744', padding: 10, marginBottom: 20 },
  headerText: { color: 'white', fontSize: 12, textAlign: 'center' },
  title: { fontSize: 15, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 30 },
  articleTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 14, marginBottom: 6 },
  bold: { fontFamily: 'Helvetica-Bold' },
  center: { textAlign: 'center', marginBottom: 10 },
  text: { marginBottom: 8 },
})

const typeLabels: Record<string, string> = {
  nda: 'ACCORD DE CONFIDENTIALITÉ (NDA)',
  prestation: 'CONTRAT DE PRESTATION DE SERVICES',
  bail: 'BAIL COMMERCIAL',
}

export function ContratPDF({ data }: { data: ContratData }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerText}>DOCUMENT JURIDIQUE — CONFIDENTIEL</Text>
        </View>
        <Text style={s.title}>{typeLabels[data.typeContrat] ?? 'CONTRAT'}</Text>
        <Text style={[s.text, s.bold]}>ENTRE :</Text>
        <Text style={s.text}>{data.partieA}, sis(e) au {data.partieAAdresse}, ci-après « la Partie A »,</Text>
        <Text style={[s.text, s.center]}>ET</Text>
        <Text style={s.text}>{data.partieB}, sis(e) au {data.partieBAdresse}, ci-après « la Partie B ».</Text>
        <Text style={s.articleTitle}>Article 1 — Objet</Text>
        <Text style={s.text}>{data.objet}</Text>
        <Text style={s.articleTitle}>Article 2 — Durée</Text>
        <Text style={s.text}>Durée : {data.duree}.</Text>
        <Text style={s.articleTitle}>Article 3 — Prix</Text>
        <Text style={s.text}>{data.prix}. Modalités : {data.modalitesPaiement}.</Text>
        <Text style={s.articleTitle}>Article 4 — Obligations</Text>
        <Text style={s.text}>{"Chaque partie s'engage à exécuter ses obligations de bonne foi."}</Text>
        <Text style={s.articleTitle}>Article 5 — Confidentialité</Text>
        <Text style={s.text}>{"Les parties s'engagent à la confidentialité des informations échangées."}</Text>
        <Text style={s.articleTitle}>Article 6 — Résiliation</Text>
        <Text style={s.text}>{"En cas de manquement grave, résiliation après mise en demeure de 15 jours."}</Text>
        <Text style={s.articleTitle}>Article 7 — Droit applicable</Text>
        <Text style={s.text}>Droit français. Litige soumis aux tribunaux compétents.</Text>
        <Text style={[s.text, { marginTop: 30 }]}>Fait à {data.ville}, le {data.date}</Text>
        <Text style={s.text}>La Partie A : _______________________</Text>
        <Text style={s.text}>La Partie B : _______________________</Text>
      </Page>
    </Document>
  )
}
