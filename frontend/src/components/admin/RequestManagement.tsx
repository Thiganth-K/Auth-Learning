import { useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import type { RentalRequest } from '../../types'

type RequestManagementProps = {
  requests: RentalRequest[]
  onUpdateStatus: (id: string, status: RentalRequest['status'], note?: string) => void
}

export default function RequestManagement({ requests, onUpdateStatus }: RequestManagementProps) {
  const [adminNote, setAdminNote] = useState('')

  const handleApprove = (id: string) => {
    onUpdateStatus(id, 'approved', adminNote)
    setAdminNote('')
  }

  const handleDisapprove = (id: string) => {
    onUpdateStatus(id, 'disapproved', adminNote)
    setAdminNote('')
  }

  return (
    <div>
      <h3 className="font-semibold">Rental Requests</h3>
      <div className="mt-2 space-y-3">
        {requests.length === 0 ? (
          <div className="text-sm text-gray-500">No requests yet</div>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-center justify-between">
                <div className="font-medium text-brand-blue-700">{r.equipmentTitle}</div>
                <div>
                  <span className={
                    r.status === 'pending' 
                      ? 'badge-yellow' 
                      : r.status === 'approved' 
                      ? 'inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs' 
                      : 'inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs'
                  }>
                    {r.status}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-1">{r.userName} — {r.userEmail}</div>
              <div className="text-xs text-gray-600">{r.startDate} → {r.endDate}</div>
              <div className="mt-2">
                <textarea 
                  placeholder="Admin note (optional)" 
                  value={adminNote} 
                  onChange={(e) => setAdminNote(e.target.value)} 
                  className="w-full border rounded p-1 text-sm" 
                />
                <div className="mt-2 flex space-x-2">
                  <button 
                    onClick={() => handleApprove(r.id)} 
                    className="px-2 py-1 bg-green-600 text-white rounded text-sm flex items-center gap-2"
                  >
                    <FaCheck />Approve
                  </button>
                  <button 
                    onClick={() => handleDisapprove(r.id)} 
                    className="px-2 py-1 bg-red-600 text-white rounded text-sm flex items-center gap-2"
                  >
                    <FaTimes />Disapprove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}