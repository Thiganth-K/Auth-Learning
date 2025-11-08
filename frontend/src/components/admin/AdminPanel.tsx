import { useState } from 'react'
import { FaUserShield, FaSignOutAlt, FaChartBar, FaTools, FaCalendarCheck, FaTimes } from 'react-icons/fa'
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'equipment' | 'requests'>('dashboard')

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
    setActiveTab('dashboard')
  }

  // Calculate dashboard stats
  const totalEquipment = equipments.length
  const totalRequests = requests.length
  const pendingRequests = requests.filter(r => r.status === 'pending').length
  const approvedRequests = requests.filter(r => r.status === 'approved').length
  const disapprovedRequests = requests.filter(r => r.status === 'disapproved').length

  const StatCard = ({ icon, title, value, color, subtitle }: {
    icon: React.ReactNode
    title: string
    value: number
    color: string
    subtitle?: string
  }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</div>
          {subtitle && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</div>}
        </div>
        <div className={`text-3xl opacity-20`}>
          {icon}
        </div>
      </div>
    </div>
  )

  if (!adminLoggedIn) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserShield className="text-blue-600 dark:text-blue-400 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Enter your credentials to access the admin panel</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
              <input 
                value={adminUser} 
                onChange={(e) => setAdminUser(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input 
                value={adminPass} 
                onChange={(e) => setAdminPass(e.target.value)} 
                type="password" 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button 
              onClick={handleLogin} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaUserShield />
              Login
            </button>
            <button 
              onClick={onClose} 
              className="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Demo Credentials:</strong><br />
              Username: {ADMIN_USER}<br />
              Password: {ADMIN_PASS}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-7xl mx-4 my-4 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-t-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaUserShield className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-blue-100 text-sm">Equipment & Lab Rental Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                Logout
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaTimes />
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
              { id: 'equipment', label: 'Equipment', icon: <FaTools /> },
              { id: 'requests', label: 'Requests', icon: <FaCalendarCheck /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === 'requests' && pendingRequests > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {pendingRequests}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={<FaTools />}
                  title="Total Equipment"
                  value={totalEquipment}
                  color="border-blue-500"
                />
                <StatCard
                  icon={<FaCalendarCheck />}
                  title="Total Requests"
                  value={totalRequests}
                  color="border-purple-500"
                />
                <StatCard
                  icon={<FaCalendarCheck />}
                  title="Pending Requests"
                  value={pendingRequests}
                  color="border-yellow-500"
                  subtitle="Needs attention"
                />
                <StatCard
                  icon={<FaCalendarCheck />}
                  title="Approved Today"
                  value={approvedRequests}
                  color="border-green-500"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Requests</h3>
                <div className="space-y-3">
                  {requests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{request.equipmentTitle}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{request.userName}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
                  {requests.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No requests yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <EquipmentManagement equipments={equipments} onAddEquipment={onAddEquipment} />
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <RequestManagement requests={requests} onUpdateStatus={onUpdateRequestStatus} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}