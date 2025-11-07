import type { Equipment } from '../../types'
import { currency } from '../../types/utils'

type EquipmentCardProps = {
  equipment: Equipment
  onClick: (equipment: Equipment) => void
}

export default function EquipmentCard({ equipment, onClick }: EquipmentCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(equipment)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(equipment) }}
      className="card card-hover cursor-pointer"
    >
      <div className="w-full">
        <img 
          src={equipment.image || 'https://via.placeholder.com/320?text=Equipment'} 
          alt={equipment.title} 
          className="h-48 w-full object-cover rounded-md mb-4" 
        />
      </div>
      <div className="px-2 pb-2">
        <div className="text-xl text-brand-blue-700 font-semibold mb-2">{equipment.title}</div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-800">{currency(equipment.pricePerDay)}</div>
          <div className="text-sm text-gray-500">/ day</div>
        </div>
      </div>
    </div>
  )
}