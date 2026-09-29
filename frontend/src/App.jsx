import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/"
          element={
            <Navigate
              to={token ? '/dashboard' : '/login'}
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={token ? '/dashboard' : '/login'}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App