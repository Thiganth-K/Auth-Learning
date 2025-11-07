import type { RentalRequest, User } from '../../types'

type RentalRequestsSidebarProps = {
  user: User | null
  requests: RentalRequest[]
}

export default function RentalRequestsSidebar({ user, requests }: RentalRequestsSidebarProps) {
  return (
    <aside className="bg-white rounded shadow p-4">
      <h3 className="font-semibold">My rental requests</h3>
      {user ? (
        <div className="mt-3 space-y-3">
          {requests.filter((r) => r.userEmail === user.email).length === 0 ? (
            <div className="text-sm text-gray-500">No rental requests yet</div>
          ) : (
            requests.filter((r) => r.userEmail === user.email).map((r) => (
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
                <div className="text-xs text-gray-600">{r.startDate} → {r.endDate}</div>
                {r.adminNote && <div className="text-xs text-red-600 mt-1">Admin: {r.adminNote}</div>}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500 mt-2">Sign in to make requests</div>
      )}
    </aside>
  )
}