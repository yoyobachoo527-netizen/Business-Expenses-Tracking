import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { PVData } from '../docx-templates/pv'

const s = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.6 },
  header: { backgroundColor: '#1a2744', padding: 10, marginBottom: 20 },
  headerText: { color: 'white', fontSize: 12, textAlign: 'center' },
  title: { fontSize: 15, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 11, textAlign: 'center', marginBottom: 4 },
  pvTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 20, marginTop: 10 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 14, marginBottom: 6 },
  bold: { fontFamily: 'Helvetica-Bold' },
  italic: { fontFamily: 'Helvetica-Oblique' },
  text: { marginBottom: 6 },
})

export function PVPDF({ data }: { data: PVData }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerText}>DOCUMENT JURIDIQUE — CONFIDENTIEL</Text>
        </View>
        <Text style={s.title}>{data.formeJuridique} « {data.denomination} »</Text>
        <Text style={s.subtitle}>Capital : {data.capital} € — RCS : {data.rcs}</Text>
        <Text style={s.subtitle}>{data.siegeSocial}</Text>
        <Text style={s.pvTitle}>PROCÈS-VERBAL DE {data.typePV.toUpperCase()}</Text>
        <Text style={s.text}>Date : {data.date} — Heure : {data.heure} — Lieu : {data.lieu}</Text>
        <Text style={[s.text, s.bold]}>PRÉSENTS ET REPRÉSENTÉS :</Text>
        {data.presents.map((p, i) => (
          <Text key={i} style={s.text}>- {p.nom} ({p.qualite}){p.parts ? ` — ${p.parts} parts` : ''}</Text>
        ))}
        <Text style={[s.text, s.bold, { marginTop: 10 }]}>ORDRE DU JOUR :</Text>
        {data.ordresDuJour.map((o, i) => (
          <Text key={i} style={s.text}>{i + 1}. {o}</Text>
        ))}
        <Text style={s.sectionTitle}>DÉLIBÉRATIONS</Text>
        {data.resolutions.map((r, i) => (
          <View key={i}>
            <Text style={[s.text, s.bold]}>RÉSOLUTION N°{r.numero} — {r.titre.toUpperCase()}</Text>
            <Text style={s.text}>{r.texte}</Text>
            <Text style={[s.text, s.italic]}>Vote : {r.vote}</Text>
          </View>
        ))}
        <Text style={[s.text, { marginTop: 20 }]}>{"L'ordre du jour étant épuisé, la séance est levée."}</Text>
        <Text style={[s.text, { marginTop: 30 }]}>Fait à {data.ville}, le {data.date}</Text>
        <Text style={s.text}>Le Président : _______________________</Text>
        <Text style={s.text}>Le Secrétaire : _______________________</Text>
      </Page>
    </Document>
  )
}
