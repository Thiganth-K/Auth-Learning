import type { Equipment } from '../../types'
import { currency } from '../../types/utils'

type DetailsModalProps = {
  equipment: Equipment | null
  onClose: () => void
  onRequestRent: (equipment: Equipment) => void
}

export default function DetailsModal({ equipment, onClose, onRequestRent }: DetailsModalProps) {
  if (!equipment) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="detail-panel">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <img 
              src={equipment.image || 'https://via.placeholder.com/320?text=Equipment'} 
              alt={equipment.title} 
              className="detail-image" 
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-brand-blue-700">{equipment.title}</h3>
              <div className="text-right">
                <div className="text-xl font-bold">{currency(equipment.pricePerDay)}</div>
                <div className="text-xs text-gray-500">/ day</div>
              </div>
            </div>
            <p className="mt-3 text-gray-600">{equipment.description || 'No description available.'}</p>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={() => onRequestRent(equipment)} className="btn-primary">Request rent</button>
              <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}