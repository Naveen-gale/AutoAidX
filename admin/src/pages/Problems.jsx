import React, { useEffect, useState } from 'react'

const BACKEND = 'http://localhost:5000'
const token = () => localStorage.getItem('adminToken')

const s = {
  h2: { fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1.5rem' },
  card: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' },
  input: { width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '0.7rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' },
  select: { width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '0.7rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' },
  btn: (c = '#dc2626') => ({ background: c, color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  pCard: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', overflow: 'hidden' },
}

export default function Problems() {
  const [brands, setBrands] = useState([])
  const [filterModels, setFilterModels] = useState([])
  const [addModels, setAddModels] = useState([])
  const [problems, setProblems] = useState([])
  const [selBrand, setSelBrand] = useState('')
  const [selModel, setSelModel] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [filterModel, setFilterModel] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [image, setImage] = useState(null)
  const [imgName, setImgName] = useState('Choose problem image')
  const [msg, setMsg] = useState({ text: '', ok: true })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${BACKEND}/api/brands`).then(r => r.json()).then(setBrands)
  }, [])

  useEffect(() => {
    if (!selBrand) { setAddModels([]); return }
    fetch(`${BACKEND}/api/models/${selBrand}`).then(r => r.json()).then(setAddModels)
  }, [selBrand])

  useEffect(() => {
    if (!filterBrand) { setFilterModels([]); loadProblems(); return }
    fetch(`${BACKEND}/api/models/${filterBrand}`).then(r => r.json()).then(setFilterModels)
  }, [filterBrand])

  useEffect(() => { loadProblems() }, [filterModel, brands])

  const loadProblems = async () => {
    if (brands.length === 0) return
    let all = []
    if (filterModel) {
      const res = await fetch(`${BACKEND}/api/problems/${filterModel}`)
      all = await res.json()
    } else {
      for (const b of brands) {
        const mRes = await fetch(`${BACKEND}/api/models/${b._id}`)
        const models = await mRes.json()
        for (const m of models) {
          const pRes = await fetch(`${BACKEND}/api/problems/${m._id}`)
          const probs = await pRes.json()
          all.push(...probs.map(p => ({ ...p, modelName: m.name, brandName: b.name })))
        }
      }
    }
    setProblems(all)
  }

  const showMsg = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg({ text: '', ok: true }), 4000) }

  const add = async () => {
    if (!selModel || !title.trim() || !desc.trim() || !image) return showMsg('All fields and image are required.', false)
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', title); fd.append('desc', desc); fd.append('modelId', selModel); fd.append('image', image)
      const res = await fetch(`${BACKEND}/api/problems`, { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showMsg('Problem added successfully!')
      setTitle(''); setDesc(''); setImage(null); setImgName('Choose problem image'); setSelModel(''); setSelBrand('')
      loadProblems()
    } catch (e) { showMsg(e.message, false) }
    finally { setLoading(false) }
  }

  const del = async (id) => {
    if (!confirm('Delete this problem?')) return
    await fetch(`${BACKEND}/api/problems/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    loadProblems()
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <h2 style={s.h2}>Manage <span style={{ color: '#ef4444' }}>Problems</span></h2>

      <div style={s.card}>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem', fontWeight: 600 }}>Add New Problem</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={s.label}>Brand</label>
            <select style={s.select} value={selBrand} onChange={e => { setSelBrand(e.target.value); setSelModel('') }}>
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Model</label>
            <select style={s.select} value={selModel} onChange={e => setSelModel(e.target.value)} disabled={!selBrand}>
              <option value="">Select Model</option>
              {addModels.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Problem Title</label>
            <input style={s.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Engine Overheating" />
          </div>
          <div>
            <label style={s.label}>Short Description</label>
            <input style={s.input} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description of symptoms" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ flex: 1, ...s.input, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
            📎 {imgName}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { setImage(e.target.files[0]); setImgName(e.target.files[0]?.name || 'Choose problem image') }} />
          </label>
          <button style={s.btn()} onClick={add} disabled={loading}>{loading ? 'Adding...' : '+ Add Problem'}</button>
        </div>
        {msg.text && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: msg.ok ? '#4ade80' : '#f87171' }}>{msg.text}</p>}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Filter:</span>
        <select style={{ ...s.select, width: 'auto' }} value={filterBrand} onChange={e => { setFilterBrand(e.target.value); setFilterModel('') }}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <select style={{ ...s.select, width: 'auto' }} value={filterModel} onChange={e => setFilterModel(e.target.value)} disabled={!filterBrand}>
          <option value="">All Models</option>
          {filterModels.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
      </div>

      {problems.length === 0
        ? <p style={{ color: '#475569' }}>No problems yet.</p>
        : <div style={s.grid}>
            {problems.map(p => (
              <div key={p._id} style={s.pCard}>
                <div style={{ height: '130px', overflow: 'hidden' }}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.5)' }} />
                </div>
                <div style={{ padding: '0.875rem' }}>
                  <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{p.title}</p>
                  <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{p.desc}</p>
                  {p.brandName && <p style={{ color: '#475569', fontSize: '0.7rem' }}>{p.brandName} → {p.modelName}</p>}
                  <button onClick={() => del(p._id)} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
