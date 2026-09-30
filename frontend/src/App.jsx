import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Cursos from './pages/Cursos'
import Diplomados from './pages/Diplomados'
import Inscripciones from './pages/Inscripciones'
import Cotizaciones from './pages/Cotizaciones'
import Alquileres from './pages/Alquileres'
import Catering from './pages/Catering'
import Pagos from './pages/Pagos'
import Usuarios from './pages/Usuarios'
import Roles from './pages/Roles'
import Agenda from './pages/Agenda'
import Historial from './pages/Historial'
import HistorialCliente from './pages/HistorialCliente'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* CLIENTES */}

        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
        {/* CURSOS */}
        <Route
          path="/cursos"
          element={
            <ProtectedRoute>
              <Cursos />
            </ProtectedRoute>
          }
        />
        {/*DIPLOMADOS */}
        <Route
          path="/diplomados"
          element={
            <ProtectedRoute>
              <Diplomados />
            </ProtectedRoute>
          }
        />
        {/*INSCRIPCIONES*/}
        <Route
          path="/inscripciones"
          element={
            <ProtectedRoute>
              <Inscripciones />
            </ProtectedRoute>
          }
        />
        {/*COTIZACIONES*/}
        <Route
          path="/cotizaciones"
          element={
            <ProtectedRoute>
              <Cotizaciones />
            </ProtectedRoute>
          }
        />
        {/*ALQUILERES*/}
        <Route
          path="/alquileres"
          element={
            <ProtectedRoute>
              <Alquileres />
            </ProtectedRoute>
          }
        />
        {/*CATERING*/}
        <Route
          path="/catering"
          element={
            <ProtectedRoute>
              <Catering />
            </ProtectedRoute>
          }
        />
        {/*PAGOS*/}
        <Route
          path="/pagos"
          element={
            <ProtectedRoute>
              <Pagos />
            </ProtectedRoute>
          }
        />
        {/*USUARIOS*/}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        {/*ROLES*/}
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>
          }
        />
        {/*AGENDA*/}
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <Agenda />
            </ProtectedRoute>
          }
        />
        {/*HISTORIAL*/}
        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <Historial />
            </ProtectedRoute>
          }
        />
        {/*HISTORIALCLIENTE*/}
        <Route
          path="/clientes/:id/historial"
          element={
            <ProtectedRoute>
              <HistorialCliente />
            </ProtectedRoute>
          }
        />
        {/* INICIO */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* RUTA NO ENCONTRADA */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App