import { useEffect, useState } from 'react'
import './index.css'

type User = {
  name: string
  email: string
  picture?: string
}

type Equipment = {
  id: string
  title: string
  description?: string
  pricePerDay: number
  image?: string
}

type RentalRequest = {
  id: string
  equipmentId: string
  equipmentTitle: string
  userEmail: string
  userName: string
  startDate: string
  endDate: string
  status: 'pending' | 'approved' | 'disapproved'
  adminNote?: string
  createdAt: string
}

function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

const SAMPLE_EQUIPMENTS: Equipment[] = [
  { id: 'e1', title: 'Equipment 1', description: 'Multi-purpose equipment 1', pricePerDay: 10.0, image: 'https://via.placeholder.com/160?text=Equipment+1' },
  { id: 'e2', title: 'Equipment 2', description: 'Multi-purpose equipment 2', pricePerDay: 12.5, image: 'https://via.placeholder.com/160?text=Equipment+2' },
  { id: 'e3', title: 'Equipment 3', description: 'Multi-purpose equipment 3', pricePerDay: 8.99, image: 'https://via.placeholder.com/160?text=Equipment+3' },
  { id: 'e4', title: 'Equipment 4', description: 'Multi-purpose equipment 4', pricePerDay: 15.0, image: 'https://via.placeholder.com/160?text=Equipment+4' },
]

function currency(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [requests, setRequests] = useState<RentalRequest[]>([])

  // request UI
  const [requesting, setRequesting] = useState<Equipment | null>(null)
  const [rentStart, setRentStart] = useState('')
  const [rentEnd, setRentEnd] = useState('')

  // admin UI
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [adminNote, setAdminNote] = useState('')

  // Initialize Google Identity Services
  useEffect(() => {
    let cancelled = false
    let initialized = false
    const tryInit = () => {
      if (initialized) return
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if (!clientId) return
      if (typeof window === 'undefined' || !(window as any).google || !(window as any).google.accounts) return
      try {
        ;(window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp: any) => {
            const decoded = decodeJwt(resp.credential)
            if (decoded && !cancelled) {
              setUser({ name: decoded.name, email: decoded.email, picture: decoded.picture })
            }
          },
        })
        const el = document.getElementById('g_id_signin')
        if (el) {
          ;(window as any).google.accounts.id.renderButton(el, { theme: 'outline', size: 'large' })
        }
        initialized = true
        // once initialized we don't need to retry anymore
        if (interval) clearInterval(interval)
      } catch (e) {
        // ignore until script loads
      }
    }
    const interval = setInterval(tryInit, 300)
    tryInit()
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // load from localStorage on mount
  useEffect(() => {
    const rawEq = localStorage.getItem('equipments')
    if (rawEq) {
      try {
        setEquipments(JSON.parse(rawEq))
      } catch (e) {
        setEquipments(SAMPLE_EQUIPMENTS)
      }
    } else {
      setEquipments(SAMPLE_EQUIPMENTS)
    }

    const rawReq = localStorage.getItem('rental_requests')
    if (rawReq) {
      try {
        setRequests(JSON.parse(rawReq))
      } catch (e) {
        setRequests([])
      }
    } else {
      setRequests([])
    }
  }, [])

  const signOut = () => {
    if ((window as any).google && (window as any).google.accounts) {
      ;(window as any).google.accounts.id.disableAutoSelect()
    }
    setUser(null)
    setRequesting(null)
    setRentStart('')
    setRentEnd('')
  }

  const openRequest = (eq: Equipment) => {
    setRequesting(eq)
    setRentStart('')
    setRentEnd('')
  }

  const submitRequest = () => {
    if (!user || !requesting) return
    if (!rentStart || !rentEnd) return alert('Please select start and end dates')
    if (new Date(rentEnd) < new Date(rentStart)) return alert('End date must be after start date')
    const req: RentalRequest = {
      id: `req_${Date.now()}`,
      equipmentId: requesting.id,
      equipmentTitle: requesting.title,
      userEmail: user.email,
      userName: user.name,
      startDate: rentStart,
      endDate: rentEnd,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    const updated = [req, ...requests]
    setRequests(updated)
    localStorage.setItem('rental_requests', JSON.stringify(updated))
    setRequesting(null)
    setRentStart('')
    setRentEnd('')
    alert('Rental request submitted — admin will review it')
  }

  // Admin credentials are read from environment variables set in .env
  // Set VITE_ADMIN_USER and VITE_ADMIN_PASS in your frontend/.env
  const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'thiganth'
  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'thiganth'

  const adminLogin = () => {
    if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
      setAdminLoggedIn(true)
    } else {
      alert('Invalid admin credentials')
    }
  }

  const adminLogout = () => {
    setAdminLoggedIn(false)
    setAdminUser('')
    setAdminPass('')
  }

  const saveEquipments = (next: Equipment[]) => {
    setEquipments(next)
    localStorage.setItem('equipments', JSON.stringify(next))
  }

  const addEquipment = (title: string) => {
    const next: Equipment = { id: `e_${Date.now()}`, title, description: '', pricePerDay: 0, image: '' }
    saveEquipments([next, ...equipments])
  }

  const updateRequestStatus = (id: string, status: RentalRequest['status'], note?: string) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status, adminNote: note } : r))
    setRequests(updated)
    localStorage.setItem('rental_requests', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img src="/vite.svg" alt="logo" className="h-8" />
            <h1 className="text-2xl font-bold">Equipments Rental</h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-right">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                {user.picture && <img src={user.picture} alt="avatar" className="h-10 w-10 rounded-full" />}
                <button onClick={signOut} className="px-3 py-1 bg-red-500 text-white rounded">
                  Sign out
                </button>
              </>
            ) : (
              <div>
                <div id="g_id_signin" />
                {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                  <div className="text-xs text-red-600">VITE_GOOGLE_CLIENT_ID not set. Add .env</div>
                )}
              </div>
            )}

            <button
              onClick={() => setAdminPanelOpen((s) => !s)}
              className="px-3 py-1 bg-gray-200 rounded"
              title="Open admin panel"
            >
              Admin
            </button>
          </div>
        </header>

        {adminPanelOpen ? (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold">Admin Panel</h2>
            {!adminLoggedIn ? (
              <div className="mt-4 max-w-sm">
                <label className="block text-sm">Username</label>
                <input value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className="w-full border p-2 rounded" />
                <label className="block text-sm mt-2">Password</label>
                <input value={adminPass} onChange={(e) => setAdminPass(e.target.value)} type="password" className="w-full border p-2 rounded" />
                <div className="mt-3 flex space-x-2">
                  <button onClick={adminLogin} className="px-3 py-1 bg-blue-600 text-white rounded">Login</button>
                  <button onClick={() => setAdminPanelOpen(false)} className="px-3 py-1 bg-gray-200 rounded">Close</button>
                </div>
                <div className="text-xs text-gray-500 mt-2">Admin credentials are configured via <code>.env</code> (VITE_ADMIN_USER / VITE_ADMIN_PASS)</div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold">Manage Equipments</h3>
                  <AddEquipmentForm onAdd={(title) => addEquipment(title)} />
                  <div className="mt-3 space-y-2">
                    {equipments.map((e) => (
                      <div key={e.id} className="border rounded p-2 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{e.title}</div>
                          <div className="text-xs text-gray-500">{e.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{currency(e.pricePerDay)} / day</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Rental Requests</h3>
                  <div className="mt-2 space-y-3">
                    {requests.length === 0 ? (
                      <div className="text-sm text-gray-500">No requests yet</div>
                    ) : (
                      requests.map((r) => (
                        <div key={r.id} className="border rounded p-2">
                          <div className="flex justify-between">
                            <div className="font-medium">{r.equipmentTitle}</div>
                            <div className="text-xs text-gray-500">{r.status}</div>
                          </div>
                          <div className="text-xs">{r.userName} — {r.userEmail}</div>
                          <div className="text-xs">{r.startDate} → {r.endDate}</div>
                          <div className="mt-2">
                            <textarea placeholder="Admin note (optional)" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className="w-full border rounded p-1 text-sm" />
                            <div className="mt-2 flex space-x-2">
                              <button onClick={() => { updateRequestStatus(r.id, 'approved', adminNote); setAdminNote('') }} className="px-2 py-1 bg-green-600 text-white rounded text-sm">Approve</button>
                              <button onClick={() => { updateRequestStatus(r.id, 'disapproved', adminNote); setAdminNote('') }} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Disapprove</button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <div>
                    <button onClick={adminLogout} className="px-3 py-1 bg-gray-200 rounded">Logout</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Equipments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {equipments.map((p) => (
                  <div key={p.id} className="bg-white rounded shadow p-4 flex space-x-4">
                    <img src={p.image || 'https://via.placeholder.com/160?text=Equipment'} alt={p.title} className="h-24 w-24 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-sm text-gray-500">{p.description}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-lg font-semibold">{currency(p.pricePerDay)} / day</div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openRequest(p)} className="px-3 py-1 bg-blue-600 text-white rounded">Request rent</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="bg-white rounded shadow p-4">
              <h3 className="font-semibold">My rental requests</h3>
              {user ? (
                <div className="mt-3 space-y-3">
                  {requests.filter((r) => r.userEmail === user.email).length === 0 ? (
                    <div className="text-sm text-gray-500">No rental requests yet</div>
                  ) : (
                    requests.filter((r) => r.userEmail === user.email).map((r) => (
                      <div key={r.id} className="border rounded p-2">
                        <div className="flex justify-between">
                          <div className="font-medium">{r.equipmentTitle}</div>
                          <div className="text-xs text-gray-500">{r.status}</div>
                        </div>
                        <div className="text-xs">{r.startDate} → {r.endDate}</div>
                        {r.adminNote && <div className="text-xs text-red-600 mt-1">Admin: {r.adminNote}</div>}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500 mt-2">Sign in to make requests</div>
              )}
            </aside>
          </main>
        )}

        {/* Request modal / panel */}
        {requesting && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded p-6 w-full max-w-md">
              <h3 className="font-semibold">Request rental for {requesting.title}</h3>
              <div className="mt-3">
                <label className="block text-sm">Start date</label>
                <input type="date" value={rentStart} onChange={(e) => setRentStart(e.target.value)} className="w-full border p-2 rounded" />
                <label className="block text-sm mt-2">End date</label>
                <input type="date" value={rentEnd} onChange={(e) => setRentEnd(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => setRequesting(null)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                <button onClick={submitRequest} className="px-3 py-1 bg-blue-600 text-white rounded">Submit request</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AddEquipmentForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('')
  return (
    <div className="mt-2">
      <input placeholder="Equipment title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
      <div className="mt-2 flex justify-end">
        <button onClick={() => { if (title.trim()) { onAdd(title.trim()); setTitle('') } }} className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
      </div>
    </div>
  )
}

