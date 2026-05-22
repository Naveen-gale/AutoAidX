import { useEffect, useState } from 'react'

const BACKEND = 'http://localhost:5000'
const token = () => localStorage.getItem('adminToken')

const s = {
  page: { maxWidth: '900px' },
  h2: { fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1.5rem' },
  card: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' },
  input: { width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '0.7rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' },
  select: { width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '0.7rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' },
  btn: (c = '#2563eb') => ({ background: c, color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  mCard: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', overflow: 'hidden' },
}

export default function Models() {
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [filterBrand, setFilterBrand] = useState('')
  const [selBrand, setSelBrand] = useState('')
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const [imgName, setImgName] = useState('Choose model image')
  const [msg, setMsg] = useState({ text: '', ok: true })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${BACKEND}/api/brands`).then(r => r.json()).then(setBrands)
  }, [])

  useEffect(() => { loadModels() }, [brands, filterBrand])

  const loadModels = async () => {
    if (brands.length === 0) return
    const all = []
    const list = filterBrand ? brands.filter(b => b._id === filterBrand) : brands
    for (const b of list) {
      const res = await fetch(`${BACKEND}/api/models/${b._id}`)
      const m = await res.json()
      all.push(...m.map(mo => ({ ...mo, brandName: b.name })))
    }
    setModels(all)
  }

  const showMsg = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg({ text: '', ok: true }), 4000) }

  const add = async () => {
    if (!selBrand || !name.trim() || !image) return showMsg('All fields and image are required.', false)
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', name); fd.append('brandId', selBrand); fd.append('image', image)
      const res = await fetch(`${BACKEND}/api/models`, { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showMsg('Model added successfully!')
      setName(''); setImage(null); setImgName('Choose model image'); setSelBrand('')
      loadModels()
    } catch (e) { showMsg(e.message, false) }
    finally { setLoading(false) }
  }

  const del = async (id) => {
    if (!confirm('Delete this model?')) return
    await fetch(`${BACKEND}/api/models/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    loadModels()
  }

  return (
    <div style={s.page}>
      <h2 style={s.h2}>Manage <span style={{ color: '#3b82f6' }}>Models</span></h2>

      <div style={s.card}>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem', fontWeight: 600 }}>Add New Model</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={s.label}>Brand</label>
            <select style={s.select} value={selBrand} onChange={e => setSelBrand(e.target.value)}>
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Model Name</label>
            <input style={s.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Camry" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ flex: 1, ...s.input, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
            📎 {imgName}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { setImage(e.target.files[0]); setImgName(e.target.files[0]?.name || 'Choose model image') }} />
          </label>
          <button style={s.btn()} onClick={add} disabled={loading}>{loading ? 'Adding...' : '+ Add Model'}</button>
        </div>
        {msg.text && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: msg.ok ? '#4ade80' : '#f87171' }}>{msg.text}</p>}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Filter by brand:</span>
        <select style={{ ...s.select, width: 'auto' }} value={filterBrand} onChange={e => setFilterBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      {models.length === 0
        ? <p style={{ color: '#475569' }}>No models yet.</p>
        : <div style={s.grid}>
            {models.map(m => (
              <div key={m._id} style={s.mCard}>
                <div style={{ height: '150px', overflow: 'hidden' }}>
                  <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>{m.name}</p>
                    {m.brandName && <p style={{ color: '#475569', fontSize: '0.75rem' }}>{m.brandName}</p>}
                  </div>
                  <button onClick={() => del(m._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
