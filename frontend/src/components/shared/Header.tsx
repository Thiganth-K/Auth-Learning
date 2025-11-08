import { FaTools, FaBell, FaUser, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import type { User, RentalRequest } from '../../types'

type HeaderProps = {
  user: User | null
  requests: RentalRequest[]
  onSignOut: () => void
  onAdminToggle: () => void
  onNotificationToggle: () => void
  darkMode: boolean
  onDarkModeToggle: () => void
}

export default function Header({ user, requests, onSignOut, onAdminToggle, onNotificationToggle, darkMode, onDarkModeToggle }: HeaderProps) {
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
    <header className="header-container mb-8">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ER</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  EquipRent Pro
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Professional Equipment Rental</p>
              </div>
            </div>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={onDarkModeToggle}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <FaSun className="text-yellow-500 w-5 h-5" />
              ) : (
                <FaMoon className="text-gray-600 w-5 h-5" />
              )}
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={onNotificationToggle}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                    title="My Rental Requests"
                  >
                    <FaBell className="w-5 h-5 text-gray-600" />
                    {pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Admin Access */}
                <button
                  onClick={onAdminToggle}
                  className="btn btn-secondary text-sm"
                  title="Open admin panel"
                >
                  <FaTools className="w-4 h-4" />
                  Admin Panel
                </button>

                {/* Profile Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {user.picture ? (
                      <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">Member</p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="modal-content absolute right-0 mt-2 w-72 z-50">
                      <div className="modal-header">
                        <div className="flex items-center space-x-3">
                          {user.picture ? (
                            <img src={user.picture} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                              <FaUser className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="modal-footer">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false)
                            onSignOut()
                          }}
                          className="btn btn-secondary w-full justify-center text-red-600"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="bg-white border border-gray-300 rounded-lg p-2">
                  <div id="g_id_signin" />
                  {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                    <div className="text-xs text-red-600">VITE_GOOGLE_CLIENT_ID not set</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}