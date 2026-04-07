import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import MatchesPage from './pages/MatchesPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPages'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'matches', element: <MatchesPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])

export default router