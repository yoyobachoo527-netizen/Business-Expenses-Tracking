import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { StatutsData } from '../docx-templates/statuts'

const s = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.6 },
  header: { backgroundColor: '#1a2744', padding: 10, marginBottom: 20 },
  headerText: { color: 'white', fontSize: 12, textAlign: 'center' },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 30 },
  sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginTop: 20, marginBottom: 8 },
  articleTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 12, marginBottom: 4 },
  text: { marginBottom: 8 },
})

export function StatutsPDF({ data }: { data: StatutsData }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerText}>DOCUMENT JURIDIQUE — CONFIDENTIEL</Text>
        </View>
        <Text style={s.title}>{data.formeJuridique} « {data.denomination} »</Text>
        <Text style={s.subtitle}>STATUTS</Text>
        <Text style={s.text}>Entre les soussignés :</Text>
        {data.associes.map((a, i) => (
          <Text key={i} style={s.text}>- {a.nom}, titulaire de {a.parts} parts sociales</Text>
        ))}
        <Text style={s.text}>Il a été convenu et arrêté les statuts suivants :</Text>
        <Text style={s.sectionTitle}>TITRE PREMIER — FORME, DÉNOMINATION, OBJET, SIÈGE, DURÉE</Text>
        <Text style={s.articleTitle}>Article 1 — Forme</Text>
        <Text style={s.text}>Il est formé une société {data.formeJuridique} régie par les dispositions législatives et réglementaires en vigueur, notamment par les articles L. 223-1 et suivants du Code de commerce.</Text>
        <Text style={s.articleTitle}>Article 2 — Dénomination sociale</Text>
        <Text style={s.text}>La société a pour dénomination sociale : « {data.denomination} ».</Text>
        <Text style={s.articleTitle}>Article 3 — Objet social</Text>
        <Text style={s.text}>La société a pour objet : {data.objetSocial}</Text>
        <Text style={s.articleTitle}>Article 4 — Siège social</Text>
        <Text style={s.text}>Le siège social est fixé à : {data.siegeSocial}.</Text>
        <Text style={s.articleTitle}>Article 5 — Durée</Text>
        <Text style={s.text}>La durée de la société est fixée à {data.duree} ans.</Text>
        <Text style={s.sectionTitle}>TITRE DEUXIÈME — CAPITAL SOCIAL</Text>
        <Text style={s.articleTitle}>Article 6 — Capital social</Text>
        <Text style={s.text}>Le capital social est fixé à {data.capital} euros.</Text>
        <Text style={s.sectionTitle}>TITRE TROISIÈME — GÉRANCE</Text>
        <Text style={s.articleTitle}>Article 7 — Gérant / Président</Text>
        <Text style={s.text}>La société est gérée par : {data.gerantPresident}.</Text>
        <Text style={[s.text, { marginTop: 30 }]}>Fait à {data.ville}, le {data.dateConstitution}</Text>
        {data.associes.map((a, i) => (
          <Text key={i} style={s.text}>{a.nom} : _______________________</Text>
        ))}
      </Page>
    </Document>
  )
}
