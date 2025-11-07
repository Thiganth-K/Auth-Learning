import { FaTools, FaBell, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import type { User, RentalRequest } from '../../types'

type HeaderProps = {
  user: User | null
  requests: RentalRequest[]
  onSignOut: () => void
  onAdminToggle: () => void
  onNotificationToggle: () => void
}

export default function Header({ user, requests, onSignOut, onAdminToggle, onNotificationToggle }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userRequests = user ? requests.filter((r) => r.userEmail === user.email) : []
  const pendingCount = userRequests.filter((r) => r.status === 'pending').length

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown])
  
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <img src="/vite.svg" alt="logo" className="h-8" />
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Equipments Rental <FaBell className="text-gray-400" />
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* Notification Icon */}
            <div className="relative">
              <button 
                onClick={onNotificationToggle}
                className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
                title="My Rental Requests"
              >
                <FaBell className="text-gray-600 text-lg" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {user.picture ? (
                  <img src={user.picture} alt="Profile" className="h-8 w-8 rounded-full" />
                ) : (
                  <FaUser className="text-gray-600 text-lg" />
                )}
                <FaChevronDown className="text-gray-400 text-sm" />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      {user.picture && (
                        <img src={user.picture} alt="Profile" className="h-12 w-12 rounded-full flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-sm text-gray-600 break-all">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false)
                        onSignOut()
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2 text-red-600"
                    >
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Toggle */}
            <button
              onClick={onAdminToggle}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded flex items-center gap-2 transition-colors"
              title="Open admin panel"
            >
              <FaTools /> Admin
            </button>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <div id="g_id_signin" />
            {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <div className="text-xs text-red-600">VITE_GOOGLE_CLIENT_ID not set. Add .env</div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}