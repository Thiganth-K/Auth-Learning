import type { Equipment } from '../../types'
import { currency } from '../../types/utils'
import { FaFlask, FaTools, FaStar, FaMapMarkerAlt } from 'react-icons/fa'

type EquipmentCardProps = {
  equipment: Equipment
  onClick: (equipment: Equipment) => void
  darkMode: boolean
}

export default function EquipmentCard({ equipment, onClick }: EquipmentCardProps) {
  // Generate consistent rating for demo
  const rating = (4.2 + (equipment.id.length * 0.1)).toFixed(1)
  const reviewCount = Math.floor(Math.random() * 150) + 10

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(equipment)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(equipment) }}
      className="equipment-card cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={equipment.image || `https://images.unsplash.com/photo-${equipment.category === 'lab' ? '1582719471384-1c4576f6d99c' : '1581092918484-8313ead0b31f'}?w=400&h=250&fit=crop&crop=center`}
          alt={equipment.title} 
          className="card-image group-hover:scale-105 transition-transform duration-300" 
        />
        
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 ${
          equipment.category === 'lab' ? 'badge badge-lab' : 'badge badge-equipment'
        }`}>
          {equipment.category === 'lab' ? <FaFlask className="w-3 h-3" /> : <FaTools className="w-3 h-3" />}
          {equipment.category === 'lab' ? 'Lab Space' : 'Equipment'}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></div>
          <span className="text-xs font-medium text-gray-700">Available</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <FaMapMarkerAlt className="w-3 h-3 mr-1" />
          <span>Campus, Research Center</span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {equipment.title}
        </h3>
        
        {/* Description */}
        {equipment.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {equipment.description}
          </p>
        )}
        
        {/* Rating and Reviews */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-1">({reviewCount} reviews)</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="price-display">{currency(equipment.pricePerDay)}</span>
            <span className="price-unit"> / day</span>
          </div>
          
          {/* Quick Action Button */}
          <button className="btn btn-primary px-3 py-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}