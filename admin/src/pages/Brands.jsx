import { useEffect, useState } from 'react'

const BACKEND = 'http://localhost:5000'
const token = () => localStorage.getItem('adminToken')

const styles = {
  page: { maxWidth: '900px' },
  h2: { fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1.5rem' },
  card: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' },
  input: { width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '0.7rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' },
  btn: (color = '#2563eb') => ({ background: color, color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' },
  brandCard: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' },
}

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [name, setName] = useState('')
  const [logo, setLogo] = useState(null)
  const [logoName, setLogoName] = useState('Choose logo image')
  const [msg, setMsg] = useState({ text: '', ok: true })
  const [loading, setLoading] = useState(false)

  const load = () =>
    fetch(`${BACKEND}/api/brands`).then(r => r.json()).then(setBrands)

  useEffect(() => { load() }, [])

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg({ text: '', ok: true }), 4000)
  }

  const add = async () => {
    if (!name.trim() || !logo) return showMsg('Name and logo are required.', false)
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', name); fd.append('logo', logo)
      const res = await fetch(`${BACKEND}/api/brands`, {
        method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showMsg('Brand added successfully!')
      setName(''); setLogo(null); setLogoName('Choose logo image')
      load()
    } catch (e) { showMsg(e.message, false) }
    finally { setLoading(false) }
  }

  const del = async (id) => {
    if (!confirm('Delete this brand?')) return
    await fetch(`${BACKEND}/api/brands/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    load()
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.h2}>Manage <span style={{ color: '#3b82f6' }}>Brands</span></h2>

      {/* Add Form */}
      <div style={styles.card}>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem', fontWeight: 600 }}>Add New Brand</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={styles.label}>Brand Name</label>
            <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Toyota" />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={styles.label}>Logo Image</label>
            <label style={{ ...styles.input, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', width: 'auto' }}>
              📎 {logoName}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { setLogo(e.target.files[0]); setLogoName(e.target.files[0]?.name || 'Choose logo image') }} />
            </label>
          </div>
          <button style={styles.btn()} onClick={add} disabled={loading}>
            {loading ? 'Adding...' : '+ Add Brand'}
          </button>
        </div>
        {msg.text && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: msg.ok ? '#4ade80' : '#f87171' }}>{msg.text}</p>}
      </div>

      {/* List */}
      {brands.length === 0
        ? <p style={{ color: '#475569' }}>No brands yet. Add one above.</p>
        : <div style={styles.grid}>
            {brands.map(b => (
              <div key={b._id} style={styles.brandCard}>
                <div style={{ width: '72px', height: '72px', background: '#fff', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={b.logo} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <p style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'center' }}>{b.name}</p>
                <button onClick={() => del(b._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
