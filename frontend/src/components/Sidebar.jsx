import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  DocumentTextIcon,
  BookOpenIcon,
  CalculatorIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', icon: HomeIcon },
  { to: '/factures', label: 'Factures', icon: DocumentTextIcon },
  { to: '/journal', label: 'Journal', icon: BookOpenIcon },
  { to: '/comptes', label: 'Plan comptable', icon: CalculatorIcon },
  { to: '/clients', label: 'Clients', icon: UsersIcon },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-primary-900 text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-primary-800">
        <h1 className="text-lg font-bold leading-tight">Comptabilité</h1>
        <p className="text-primary-300 text-xs mt-1">PME Maroc - CGNC</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-800">
        <p className="text-primary-400 text-xs text-center">© 2024 Comptabilité PME</p>
      </div>
    </aside>
  )
}
