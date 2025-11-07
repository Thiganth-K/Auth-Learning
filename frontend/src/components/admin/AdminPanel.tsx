import { useState } from 'react'
import type { Equipment, RentalRequest } from '../../types'
import EquipmentManagement from './EquipmentManagement'
import RequestManagement from './RequestManagement'

type AdminPanelProps = {
  equipments: Equipment[]
  requests: RentalRequest[]
  onAddEquipment: (title: string) => void
  onUpdateRequestStatus: (id: string, status: RentalRequest['status'], note?: string) => void
  onClose: () => void
}

export default function AdminPanel({ 
  equipments, 
  requests, 
  onAddEquipment, 
  onUpdateRequestStatus, 
  onClose 
}: AdminPanelProps) {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')

  // Admin credentials from environment variables
  const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'thiganth'
  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'thiganth'

  const handleLogin = () => {
    if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
      setAdminLoggedIn(true)
    } else {
      alert('Invalid admin credentials')
    }
  }

  const handleLogout = () => {
    setAdminLoggedIn(false)
    setAdminUser('')
    setAdminPass('')
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold">Admin Panel</h2>
      {!adminLoggedIn ? (
        <div className="mt-4 max-w-sm">
          <label className="block text-sm">Username</label>
          <input 
            value={adminUser} 
            onChange={(e) => setAdminUser(e.target.value)} 
            className="w-full border p-2 rounded" 
          />
          <label className="block text-sm mt-2">Password</label>
          <input 
            value={adminPass} 
            onChange={(e) => setAdminPass(e.target.value)} 
            type="password" 
            className="w-full border p-2 rounded" 
          />
          <div className="mt-3 flex space-x-2">
            <button onClick={handleLogin} className="px-3 py-1 bg-blue-600 text-white rounded">
              Login
            </button>
            <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
              Close
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Admin credentials are configured via <code>.env</code> (VITE_ADMIN_USER / VITE_ADMIN_PASS)
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <EquipmentManagement equipments={equipments} onAddEquipment={onAddEquipment} />
          <RequestManagement requests={requests} onUpdateStatus={onUpdateRequestStatus} />
          <div className="md:col-span-2 flex justify-end">
            <div>
              <button onClick={handleLogout} className="px-3 py-1 bg-gray-200 rounded">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}