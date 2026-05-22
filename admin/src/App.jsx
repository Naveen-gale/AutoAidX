import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

// Protected route — redirects to login if no token
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // If frontend sent us a ?token= in the URL, grab it first
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('adminToken', token)
      // Remove the token from the URL bar (clean look)
      window.history.replaceState({}, document.title, '/')
    }
    setReady(true)
  }, [])

  // Don't render routes until we've processed the token
  if (!ready) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
