import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CessionData } from '../docx-templates/cession'

const s = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.6 },
  header: { backgroundColor: '#1a2744', padding: 10, marginBottom: 20 },
  headerText: { color: 'white', fontSize: 12, textAlign: 'center' },
  title: { fontSize: 15, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 30 },
  articleTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 14, marginBottom: 6 },
  bold: { fontFamily: 'Helvetica-Bold' },
  center: { textAlign: 'center', fontFamily: 'Helvetica-Bold', marginBottom: 20 },
  text: { marginBottom: 8 },
})

export function CessionPDF({ data }: { data: CessionData }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerText}>DOCUMENT JURIDIQUE — CONFIDENTIEL</Text>
        </View>
        <Text style={s.title}>ACTE DE {data.typeCession.toUpperCase()}</Text>
        <Text style={[s.text, s.bold]}>ENTRE LES SOUSSIGNÉS :</Text>
        <Text style={[s.text, s.bold]}>LE CÉDANT :</Text>
        <Text style={s.text}>{data.cedantNom}, demeurant au {data.cedantAdresse}</Text>
        <Text style={[s.text, s.bold]}>LE CESSIONNAIRE :</Text>
        <Text style={s.text}>{data.cessionnairenom}, demeurant au {data.cessionnaireAdresse}</Text>
        <Text style={s.center}>IL A ÉTÉ CONVENU CE QUI SUIT :</Text>
        <Text style={s.articleTitle}>Article 1 — Objet</Text>
        <Text style={s.text}>Le Cédant cède {data.nombreParts} parts de {data.formeJuridique} « {data.denomination} » (RCS : {data.rcs}), au capital de {data.capital} €.</Text>
        <Text style={s.articleTitle}>Article 2 — Prix</Text>
        <Text style={s.text}>Prix total : {data.prixTotal} € ({data.prixParPart} € / part).</Text>
        <Text style={s.articleTitle}>Article 3 — Date d&apos;effet</Text>
        <Text style={s.text}>Prise d&apos;effet : {data.dateEffet}.</Text>
        <Text style={s.articleTitle}>Article 4 — Garanties</Text>
        <Text style={s.text}>Le Cédant garantit la propriété libre de tout nantissement et l&apos;éviction.</Text>
        <Text style={s.articleTitle}>Article 5 — Droit applicable</Text>
        <Text style={s.text}>Droit français. Litige soumis aux tribunaux compétents.</Text>
        <Text style={[s.text, { marginTop: 30 }]}>Fait à {data.ville}, le {data.date}</Text>
        <Text style={s.text}>Le Cédant : _______________________</Text>
        <Text style={s.text}>Le Cessionnaire : _______________________</Text>
      </Page>
    </Document>
  )
}
