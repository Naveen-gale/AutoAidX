import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND = 'http://localhost:5000'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('adminToken', data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#020617',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#0f172a', border: '1px solid #1e293b',
        borderRadius: '1.25rem', padding: '2.5rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', background: '#1e293b',
            borderRadius: '50%', border: '1px solid #334155',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>
            Admin <span style={{ color: '#3b82f6' }}>Access</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            AutoAidX Management Panel
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{
              background: '#450a0a', border: '1px solid #7f1d1d',
              borderRadius: '0.75rem', padding: '0.75rem 1rem',
              color: '#f87171', fontSize: '0.875rem', marginBottom: '1.25rem'
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@autoaidx.com"
              style={{
                width: '100%', background: '#1e293b', border: '1px solid #334155',
                borderRadius: '0.75rem', padding: '0.8rem 1rem',
                color: '#f1f5f9', fontSize: '1rem', outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#334155'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', background: '#1e293b', border: '1px solid #334155',
                borderRadius: '0.75rem', padding: '0.8rem 1rem',
                color: '#f1f5f9', fontSize: '1rem', outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#334155'}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', background: loading ? '#1d4ed8' : '#2563eb',
              color: '#fff', fontWeight: 600, fontSize: '1rem',
              padding: '0.875rem', borderRadius: '0.75rem', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = '#1d4ed8' }}
            onMouseLeave={e => { if (!loading) e.target.style.background = '#2563eb' }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '18px', height: '18px', border: '2px solid #93c5fd',
                  borderTopColor: 'transparent', borderRadius: '50%',
                  display: 'inline-block', animation: 'spin 0.8s linear infinite'
                }} />
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
