import { useState } from 'react'
import { FaCheck, FaTimes, FaEnvelope, FaClock, FaUser } from 'react-icons/fa'
import type { RentalRequest } from '../../types'
import emailService from '../../services/emailService'

type RequestManagementProps = {
  requests: RentalRequest[]
  onUpdateStatus: (id: string, status: RentalRequest['status'], note?: string) => void
}

export default function RequestManagement({ requests, onUpdateStatus }: RequestManagementProps) {
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})
  const [processingEmails, setProcessingEmails] = useState<Record<string, boolean>>({})

  const handleApprove = async (request: RentalRequest) => {
    const note = adminNotes[request.id] || ''
    
    // Update status first
    onUpdateStatus(request.id, 'approved', note)
    
    // Send email notification
    setProcessingEmails(prev => ({ ...prev, [request.id]: true }))
    
    try {
      await emailService.sendApprovalEmail({
        to: request.userEmail,
        userName: request.userName,
        equipmentTitle: request.equipmentTitle,
        startDate: request.startDate,
        endDate: request.endDate,
        startTime: request.startTime,
        endTime: request.endTime,
        adminNote: note
      })
    } catch (error) {
      console.error('Failed to send approval email:', error)
    } finally {
      setProcessingEmails(prev => ({ ...prev, [request.id]: false }))
      setAdminNotes(prev => ({ ...prev, [request.id]: '' }))
    }
  }

  const handleDisapprove = async (request: RentalRequest) => {
    const note = adminNotes[request.id] || ''
    
    // Update status first
    onUpdateStatus(request.id, 'disapproved', note)
    
    // Send email notification
    setProcessingEmails(prev => ({ ...prev, [request.id]: true }))
    
    try {
      await emailService.sendDisapprovalEmail({
        to: request.userEmail,
        userName: request.userName,
        equipmentTitle: request.equipmentTitle,
        startDate: request.startDate,
        endDate: request.endDate,
        startTime: request.startTime,
        endTime: request.endTime,
        adminNote: note
      })
    } catch (error) {
      console.error('Failed to send disapproval email:', error)
    } finally {
      setProcessingEmails(prev => ({ ...prev, [request.id]: false }))
      setAdminNotes(prev => ({ ...prev, [request.id]: '' }))
    }
  }

  const updateAdminNote = (requestId: string, note: string) => {
    setAdminNotes(prev => ({ ...prev, [requestId]: note }))
  }

  // Group requests by status
  const pendingRequests = requests.filter(r => r.status === 'pending')
  const processedRequests = requests.filter(r => r.status !== 'pending')

  const RequestCard = ({ request }: { request: RentalRequest }) => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{request.equipmentTitle}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {request.status.toUpperCase()}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaUser className="text-gray-400" />
              <span>{request.userName}</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-600 dark:text-blue-400">{request.userEmail}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaClock className="text-gray-400" />
              <span>
                {request.startDate} {request.startTime || '(no time)'} → {request.endDate} {request.endTime || '(no time)'}
              </span>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Requested: {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
            </div>
          </div>

          {request.adminNote && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Admin Note:</div>
              <div className="text-sm text-blue-700 dark:text-blue-400">{request.adminNote}</div>
            </div>
          )}
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Admin Note (optional)
            </label>
            <textarea 
              placeholder="Add admin note (optional)" 
              value={adminNotes[request.id] || ''} 
              onChange={(e) => updateAdminNote(request.id, e.target.value)} 
              className="form-input"
              rows={3}
              maxLength={500}
            />
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => handleApprove(request)} 
              disabled={processingEmails[request.id]}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {processingEmails[request.id] ? (
                <>
                  <FaEnvelope className="animate-pulse" />
                  Sending Email...
                </>
              ) : (
                <>
                  <FaCheck />
                  Approve & Email
                </>
              )}
            </button>
            
            <button 
              onClick={() => handleDisapprove(request)} 
              disabled={processingEmails[request.id]}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {processingEmails[request.id] ? (
                <>
                  <FaEnvelope className="animate-pulse" />
                  Sending Email...
                </>
              ) : (
                <>
                  <FaTimes />
                  Disapprove & Email
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Pending Requests Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pending Requests
          </h3>
          {pendingRequests.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
              {pendingRequests.length} pending
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FaCheck className="mx-auto text-4xl mb-2 opacity-50" />
              <p>No pending requests</p>
              <p className="text-sm">All requests have been processed</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </div>
      </div>

      {/* Processed Requests Section */}
      {processedRequests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Processed Requests
            </h3>
            <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
              {processedRequests.length} processed
            </span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {processedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}