import type { Equipment } from '../../types'
import { currency } from '../../types/utils'
import { FaFlask, FaTools, FaStar, FaMapMarkerAlt, FaCheckCircle, FaClock, FaUsers, FaTimes } from 'react-icons/fa'

type DetailsModalProps = {
  equipment: Equipment | null
  onClose: () => void
  onRequestRent: (equipment: Equipment) => void
}

export default function DetailsModal({ equipment, onClose, onRequestRent }: DetailsModalProps) {
  if (!equipment) return null

  // Generate consistent data
  const rating = (4.2 + (equipment.id.length * 0.1)).toFixed(1)
  const reviewCount = Math.floor(Math.random() * 150) + 10
  const availableNow = Math.random() > 0.3

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="modal-close"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={equipment.image || `https://images.unsplash.com/photo-${equipment.category === 'lab' ? '1582719471384-1c4576f6d99c' : '1581092918484-8313ead0b31f'}?w=600&h=400&fit=crop`}
                alt={equipment.title} 
                className="w-full h-80 object-cover rounded-lg" 
              />
              
              {/* Category Badge */}
              <div className={`absolute top-4 left-4 ${
                equipment.category === 'lab' ? 'badge badge-lab' : 'badge badge-equipment'
              }`}>
                {equipment.category === 'lab' ? <FaFlask className="w-3 h-3" /> : <FaTools className="w-3 h-3" />}
                {equipment.category === 'lab' ? 'Lab Space' : 'Equipment'}
              </div>

              {/* Availability Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium ${
                availableNow 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                <div className={`w-2 h-2 rounded-full inline-block mr-2 ${
                  availableNow ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                {availableNow ? 'Available Now' : 'Booking Required'}
              </div>
            </div>

            {/* Additional Images Placeholder */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">View {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                  <span>Campus Research Center</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {equipment.title}
              </h2>
              
              <p className="text-gray-600 leading-relaxed">
                {equipment.description || 'Professional-grade equipment available for research and academic use. Fully maintained and regularly calibrated for optimal performance.'}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Features & Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Professional Grade</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Fully Maintained</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Safety Certified</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Technical Support</span>
                </div>
                {equipment.category === 'lab' && (
                  <>
                    <div className="flex items-center text-sm text-gray-700">
                      <FaUsers className="w-4 h-4 text-blue-500 mr-2" />
                      <span>Multi-user Access</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <FaClock className="w-4 h-4 text-blue-500 mr-2" />
                      <span>24/7 Availability</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {currency(equipment.pricePerDay)}
                  </span>
                  <span className="text-gray-600"> / day</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Weekly rate:</p>
                  <p className="font-semibold">{currency(equipment.pricePerDay * 6.5)}</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Minimum rental: 1 day</p>
                <p>• Weekly discounts available</p>
                <p>• Technical support included</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => onRequestRent(equipment)} 
                className="btn btn-primary flex-1"
              >
                Request Booking
              </button>
              <button 
                onClick={onClose} 
                className="btn btn-secondary px-6"
              >
                Close
              </button>
            </div>

            {/* Contact Info */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Questions? Contact our equipment specialists
              </p>
              <p className="text-sm font-medium text-blue-600">
                equipment@university.edu | (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}