import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Factures from './pages/Factures'
import NouvelleFacture from './pages/NouvelleFacture'
import Journal from './pages/Journal'
import PlanComptable from './pages/PlanComptable'
import Clients from './pages/Clients'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="factures" element={<Factures />} />
        <Route path="factures/nouvelle" element={<NouvelleFacture />} />
        <Route path="journal" element={<Journal />} />
        <Route path="comptes" element={<PlanComptable />} />
        <Route path="clients" element={<Clients />} />
      </Route>
    </Routes>
  )
}
