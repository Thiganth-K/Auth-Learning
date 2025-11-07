import { FaTimes, FaCalendar, FaUser } from 'react-icons/fa'
import type { RentalRequest, User } from '../../types'

type NotificationPanelProps = {
  user: User | null
  requests: RentalRequest[]
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPanel({ user, requests, isOpen, onClose }: NotificationPanelProps) {
  const userRequests = user ? requests.filter((r) => r.userEmail === user.email) : []

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40" 
          onClick={onClose}
        />
      )}
      
      {/* Slide Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-brand-blue-700">My Rental Requests</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <FaUser className="text-2xl mb-2" />
                <p className="text-sm">Please sign in to view your requests</p>
              </div>
            ) : userRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <FaCalendar className="text-2xl mb-2" />
                <p className="text-sm">No rental requests yet</p>
                <p className="text-xs mt-1">Click on equipment to make a request</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userRequests.map((request) => (
                  <div key={request.id} className="card">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-brand-blue-700 text-sm">
                        {request.equipmentTitle}
                      </h3>
                      <StatusBadge status={request.status} />
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <FaCalendar className="text-gray-400" />
                        <span>{request.startDate} → {request.endDate}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Requested: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {request.adminNote && (
                      <div className="mt-2 p-2 bg-yellow-50 border-l-2 border-yellow-300 rounded-r">
                        <div className="text-xs font-medium text-yellow-800">Admin Note:</div>
                        <div className="text-xs text-yellow-700">{request.adminNote}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500 text-center">
              {user && userRequests.length > 0 && (
                <span>{userRequests.length} total request{userRequests.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function StatusBadge({ status }: { status: RentalRequest['status'] }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    approved: 'bg-green-100 text-green-700 border-green-300',
    disapproved: 'bg-red-100 text-red-700 border-red-300'
  }

  return (
    <span className={`
      inline-block px-2 py-1 rounded-full text-xs border
      ${styles[status]}
    `}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}