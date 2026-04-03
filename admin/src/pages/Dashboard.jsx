import React, { useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Brands from './Brands'
import Models from './Models'
import Problems from './Problems'

const NAV = [
  { path: '/', label: 'Brands', icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
    </svg>
  )},
  { path: '/models', label: 'Models', icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1m6-11h6l2 5"/>
    </svg>
  )},
  { path: '/problems', label: 'Problems', icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
    </svg>
  )},
]

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/login')
  }

  const sidebarItem = (item) => {
    const active = location.pathname === item.path
    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '0.75rem 1rem', borderRadius: '0.75rem',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: active ? '#1e40af' : 'transparent',
          color: active ? '#fff' : '#94a3b8',
          fontWeight: active ? 600 : 400, fontSize: '0.9rem',
          transition: 'all 0.15s',
          marginBottom: '0.25rem'
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#f1f5f9' }}}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}}
      >
        {item.icon}
        {item.label}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', background: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', top: 0, left: 0
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9' }}>
            Auto Aid<span style={{ color: '#3b82f6' }}>X</span>
          </h2>
          <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>Admin Panel</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem' }}>
          {NAV.map(sidebarItem)}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', textAlign: 'left',
              padding: '0.75rem 1rem', borderRadius: '0.75rem',
              border: 'none', cursor: 'pointer', background: 'transparent',
              color: '#64748b', display: 'flex', alignItems: 'center',
              gap: '0.75rem', fontSize: '0.9rem', transition: 'color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Brands />} />
          <Route path="/models" element={<Models />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
