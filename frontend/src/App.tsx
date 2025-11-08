import { useEffect, useState } from 'react'
import './index.css'
import type { User, Equipment, RentalRequest } from './types'
import { decodeJwt } from './types/utils'
import Header from './components/shared/Header'
import EquipmentGrid from './components/client/EquipmentGrid'
import SearchAndFilter from './components/client/SearchAndFilter'
import NotificationPanel from './components/client/NotificationPanel'
import DetailsModal from './components/client/DetailsModal'
import RentRequestModal from './components/client/RentRequestModal'
import AdminPanel from './components/admin/AdminPanel'

const SAMPLE_EQUIPMENTS: Equipment[] = [
  { 
    id: 'e1', 
    title: 'Advanced Microscopy System', 
    description: 'High-resolution digital microscope with 4K imaging capabilities, perfect for biological research and material analysis.', 
    pricePerDay: 75.0, 
    image: 'https://images.unsplash.com/photo-1581092918484-8313ead0b31f?w=400&h=250&fit=crop', 
    category: 'equipment' 
  },
  { 
    id: 'e2', 
    title: 'Chemistry Research Lab', 
    description: 'Fully equipped chemistry laboratory with fume hoods, analytical instruments, and all safety equipment for advanced research.', 
    pricePerDay: 120.0, 
    image: 'https://images.unsplash.com/photo-1582719471384-1c4576f6d99c?w=400&h=250&fit=crop', 
    category: 'lab' 
  },
  { 
    id: 'e3', 
    title: 'Professional 3D Printer', 
    description: 'Industrial-grade 3D printer with multiple material support, ideal for rapid prototyping and custom manufacturing.', 
    pricePerDay: 45.0, 
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=250&fit=crop', 
    category: 'equipment' 
  },
  { 
    id: 'e4', 
    title: 'Computer Science Lab', 
    description: 'Modern computer laboratory with 30 high-performance workstations, specialized software, and networking equipment.', 
    pricePerDay: 85.0, 
    image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&h=250&fit=crop', 
    category: 'lab' 
  },
  { 
    id: 'e5', 
    title: 'Precision Analytical Balance', 
    description: 'Ultra-precise analytical balance with 0.0001g accuracy, essential for accurate measurements in research and quality control.', 
    pricePerDay: 35.0, 
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop', 
    category: 'equipment' 
  },
  { 
    id: 'e6', 
    title: 'Physics Research Laboratory', 
    description: 'Advanced physics lab with laser systems, particle detection equipment, and quantum measurement tools for cutting-edge research.', 
    pricePerDay: 150.0, 
    image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=400&h=250&fit=crop', 
    category: 'lab' 
  },
  { 
    id: 'e7', 
    title: 'UV-Vis Spectrophotometer', 
    description: 'Professional UV-Visible spectrophotometer for analytical chemistry, material science, and quality control applications.', 
    pricePerDay: 55.0, 
    image: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=400&h=250&fit=crop', 
    category: 'equipment' 
  },
  { 
    id: 'e8', 
    title: 'Biology Research Suite', 
    description: 'Complete biological research facility with cell culture rooms, incubators, and molecular biology equipment.', 
    pricePerDay: 110.0, 
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop', 
    category: 'lab' 
  },
  { 
    id: 'e9', 
    title: 'High-Performance Laser Cutter', 
    description: 'Industrial CO2 laser cutting system with precision controls, perfect for manufacturing, prototyping, and artistic projects.', 
    pricePerDay: 95.0, 
    image: 'https://images.unsplash.com/photo-1581093458791-9d42e3a117d4?w=400&h=250&fit=crop', 
    category: 'equipment' 
  },
  { 
    id: 'e10', 
    title: 'Materials Testing Laboratory', 
    description: 'Comprehensive materials science lab with tensile testing machines, hardness testers, and metallographic equipment for materials analysis.', 
    pricePerDay: 135.0, 
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=250&fit=crop', 
    category: 'lab' 
  }
]

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [requests, setRequests] = useState<RentalRequest[]>([])

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'equipment' | 'lab'>('equipment')
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false)

  // request UI
  const [requesting, setRequesting] = useState<Equipment | null>(null)
  const [rentStart, setRentStart] = useState('')
  const [rentEnd, setRentEnd] = useState('')
  const [rentStartTime, setRentStartTime] = useState('')
  const [rentEndTime, setRentEndTime] = useState('')
  // details popup
  const [selectedDetail, setSelectedDetail] = useState<Equipment | null>(null)

  // admin UI
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  
  // notification UI
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)

  // Dark mode effect
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

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
    setRentStartTime('')
    setRentEndTime('')
  }

  const openRequest = (eq: Equipment) => {
    setRequesting(eq)
    setRentStart('')
    setRentEnd('')
    setRentStartTime('')
    setRentEndTime('')
  }

  const openDetails = (eq: Equipment) => {
    setSelectedDetail(eq)
  }

  const submitRequest = () => {
    if (!user || !requesting) return
    if (!rentStart || !rentEnd) return alert('Please select start and end dates')
    if (!rentStartTime || !rentEndTime) return alert('Please select start and end times')
    
    // Create DateTime objects for comparison
    const startDateTime = new Date(`${rentStart}T${rentStartTime}`)
    const endDateTime = new Date(`${rentEnd}T${rentEndTime}`)
    
    if (endDateTime <= startDateTime) return alert('End date and time must be after start date and time')
    
    const req: RentalRequest = {
      id: `req_${Date.now()}`,
      equipmentId: requesting.id,
      equipmentTitle: requesting.title,
      userEmail: user.email,
      userName: user.name,
      startDate: rentStart,
      endDate: rentEnd,
      startTime: rentStartTime,
      endTime: rentEndTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    const updated = [req, ...requests]
    setRequests(updated)
    localStorage.setItem('rental_requests', JSON.stringify(updated))
    setRequesting(null)
    setRentStart('')
    setRentEnd('')
    setRentStartTime('')
    setRentEndTime('')
    alert('Rental request submitted — admin will review it')
  }

  const saveEquipments = (next: Equipment[]) => {
    setEquipments(next)
    localStorage.setItem('equipments', JSON.stringify(next))
  }

  const addEquipment = (title: string) => {
    const next: Equipment = { 
      id: `e_${Date.now()}`, 
      title, 
      description: '', 
      pricePerDay: 0, 
      image: '',
      category: 'equipment' // Default to equipment
    }
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

  // Filter and search logic
  const filteredEquipments = equipments.filter((equipment) => {
    const matchesSearch = equipment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (equipment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesCategory = equipment.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={user} 
        onSignOut={signOut}
        onAdminToggle={() => setAdminPanelOpen(!adminPanelOpen)}
        requests={requests}
        onNotificationToggle={() => setShowNotificationPanel(!showNotificationPanel)}
        darkMode={darkMode}
        onDarkModeToggle={toggleDarkMode}
      />

      {adminPanelOpen ? (
        <div className="max-w-7xl mx-auto px-6">
          <AdminPanel
            equipments={equipments}
            requests={requests}
            onAddEquipment={addEquipment}
            onUpdateRequestStatus={updateRequestStatus}
            onClose={() => setAdminPanelOpen(false)}
          />
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-6 pb-12">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            darkMode={darkMode}
          />
          <EquipmentGrid 
            equipments={filteredEquipments} 
            onEquipmentClick={openDetails}
            darkMode={darkMode}
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
        rentStartTime={rentStartTime}
        rentEndTime={rentEndTime}
        onRentStartChange={setRentStart}
        onRentEndChange={setRentEnd}
        onRentStartTimeChange={setRentStartTime}
        onRentEndTimeChange={setRentEndTime}
        onSubmit={submitRequest}
        onClose={() => setRequesting(null)}
      />

      <DetailsModal
        equipment={selectedDetail}
        onClose={() => setSelectedDetail(null)}
        onRequestRent={handleRequestFromDetails}
      />
    </div>
  )
}

