import { useEffect, useState } from 'react'
import './index.css'
import type { User, Equipment, RentalRequest } from './types'
import { decodeJwt } from './types/utils'
import Header from './components/shared/Header'
import EquipmentGrid from './components/client/EquipmentGrid'
import NotificationPanel from './components/client/NotificationPanel'
import DetailsModal from './components/client/DetailsModal'
import RentRequestModal from './components/client/RentRequestModal'
import AdminPanel from './components/admin/AdminPanel'

const SAMPLE_EQUIPMENTS: Equipment[] = [
  { id: 'e1', title: 'Equipment 1', description: 'Multi-purpose equipment 1', pricePerDay: 10.0, image: 'https://via.placeholder.com/160?text=Equipment+1' },
  { id: 'e2', title: 'Equipment 2', description: 'Multi-purpose equipment 2', pricePerDay: 12.5, image: 'https://via.placeholder.com/160?text=Equipment+2' },
  { id: 'e3', title: 'Equipment 3', description: 'Multi-purpose equipment 3', pricePerDay: 8.99, image: 'https://via.placeholder.com/160?text=Equipment+3' },
  { id: 'e4', title: 'Equipment 4', description: 'Multi-purpose equipment 4', pricePerDay: 15.0, image: 'https://via.placeholder.com/160?text=Equipment+4' },
]

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [requests, setRequests] = useState<RentalRequest[]>([])

  // request UI
  const [requesting, setRequesting] = useState<Equipment | null>(null)
  const [rentStart, setRentStart] = useState('')
  const [rentEnd, setRentEnd] = useState('')
  // details popup
  const [selectedDetail, setSelectedDetail] = useState<Equipment | null>(null)

  // admin UI
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  
  // notification UI
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)

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

  // Render Google sign-in button when user is not logged in
  useEffect(() => {
    // Only try to render if user is not logged in
    if (!user && (window as any).google?.accounts?.id) {
      // Wait a bit for the DOM element to be available after React render
      const timeout = setTimeout(() => {
        const el = document.getElementById('g_id_signin')
        if (el) {
          el.innerHTML = ''
          ;(window as any).google.accounts.id.renderButton(el, { theme: 'outline', size: 'large' })
        }
      }, 100)
      
      return () => clearTimeout(timeout)
    }
  }, [user])

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

  const openDetails = (eq: Equipment) => {
    setSelectedDetail(eq)
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

  const handleRequestFromDetails = (equipment: Equipment) => {
    openRequest(equipment)
    setSelectedDetail(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Header 
          user={user} 
          onSignOut={signOut}
          onAdminToggle={() => setAdminPanelOpen(!adminPanelOpen)}
          requests={requests}
          onNotificationToggle={() => setShowNotificationPanel(!showNotificationPanel)}
        />

        {adminPanelOpen ? (
          <AdminPanel
            equipments={equipments}
            requests={requests}
            onAddEquipment={addEquipment}
            onUpdateRequestStatus={updateRequestStatus}
            onClose={() => setAdminPanelOpen(false)}
          />
        ) : (
          <main>
            <EquipmentGrid 
              equipments={equipments} 
              onEquipmentClick={openDetails} 
            />
          </main>
        )}

        <NotificationPanel
          isOpen={showNotificationPanel}
          onClose={() => setShowNotificationPanel(false)}
          user={user}
          requests={requests}
        />

        <RentRequestModal
          equipment={requesting}
          rentStart={rentStart}
          rentEnd={rentEnd}
          onRentStartChange={setRentStart}
          onRentEndChange={setRentEnd}
          onSubmit={submitRequest}
          onClose={() => setRequesting(null)}
        />

        <DetailsModal
          equipment={selectedDetail}
          onClose={() => setSelectedDetail(null)}
          onRequestRent={handleRequestFromDetails}
        />
      </div>
    </div>
  )
}

