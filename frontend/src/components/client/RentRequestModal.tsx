import type { Equipment } from '../../types'
import { currency } from '../../types/utils'
import { FaCalendarAlt, FaClock, FaInfoCircle, FaTimes, FaCheckCircle } from 'react-icons/fa'

type RentRequestModalProps = {
  equipment: Equipment | null
  rentStart: string
  rentEnd: string
  rentStartTime: string
  rentEndTime: string
  onRentStartChange: (value: string) => void
  onRentEndChange: (value: string) => void
  onRentStartTimeChange: (value: string) => void
  onRentEndTimeChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function RentRequestModal({ 
  equipment, 
  rentStart, 
  rentEnd, 
  rentStartTime,
  rentEndTime,
  onRentStartChange, 
  onRentEndChange, 
  onRentStartTimeChange,
  onRentEndTimeChange,
  onSubmit, 
  onClose 
}: RentRequestModalProps) {
  if (!equipment) return null

  // Calculate duration and total cost
  const calculateDuration = () => {
    if (rentStart && rentEnd) {
      const start = new Date(rentStart)
      const end = new Date(rentEnd)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 1
  }

  const duration = calculateDuration()
  const totalCost = duration * equipment.pricePerDay

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="modal-close"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="modal-header">
          <h2 className="text-2xl font-semibold text-gray-900">
            Book {equipment.title}
          </h2>
          <p className="text-gray-600 mt-1">
            Complete your booking request below
          </p>
        </div>

        <div className="modal-body space-y-6">
          {/* Equipment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <img 
                src={equipment.image || `https://images.unsplash.com/photo-${equipment.category === 'lab' ? '1582719471384-1c4576f6d99c' : '1581092918484-8313ead0b31f'}?w=100&h=100&fit=crop`}
                alt={equipment.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{equipment.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {equipment.description}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {currency(equipment.pricePerDay)} / day
                </p>
              </div>
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaCalendarAlt className="w-5 h-5 mr-2 text-blue-600" />
              Select Rental Period
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date & Time */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input 
                  type="date" 
                  value={rentStart} 
                  onChange={(e) => onRentStartChange(e.target.value)} 
                  className="form-input"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="time" 
                    value={rentStartTime} 
                    onChange={(e) => onRentStartTimeChange(e.target.value)} 
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input 
                  type="date" 
                  value={rentEnd} 
                  onChange={(e) => onRentEndChange(e.target.value)} 
                  className="form-input"
                  required
                  min={rentStart || new Date().toISOString().split('T')[0]}
                />
                
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="time" 
                    value={rentEndTime} 
                    onChange={(e) => onRentEndTimeChange(e.target.value)} 
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FaCheckCircle className="w-5 h-5 mr-2 text-blue-600" />
              Booking Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{duration} {duration === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily rate:</span>
                <span className="font-medium">{currency(equipment.pricePerDay)}</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="font-semibold text-gray-900">Total cost:</span>
                <span className="font-bold text-lg text-blue-600">{currency(totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-start">
              <FaInfoCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-2">Important Information:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Booking requests are subject to approval</li>
                  <li>Equipment must be returned in original condition</li>
                  <li>Training may be required for certain equipment</li>
                  <li>Cancellation policy: 24 hours notice required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            onClick={onClose} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            onClick={onSubmit} 
            className="btn btn-primary"
            disabled={!rentStart || !rentEnd || !rentStartTime || !rentEndTime}
          >
            Submit Booking Request
          </button>
        </div>
      </div>
    </div>
  )
}