import type { Equipment } from '../../types'

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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Request rental for {equipment.title}
        </h3>
        <div className="mt-3 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Start date</label>
              <input 
                type="date" 
                value={rentStart} 
                onChange={(e) => onRentStartChange(e.target.value)} 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Start time</label>
              <input 
                type="time" 
                value={rentStartTime} 
                onChange={(e) => onRentStartTimeChange(e.target.value)} 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">End date</label>
              <input 
                type="date" 
                value={rentEnd} 
                onChange={(e) => onRentEndChange(e.target.value)} 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">End time</label>
              <input 
                type="time" 
                value={rentEndTime} 
                onChange={(e) => onRentEndTimeChange(e.target.value)} 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                required
              />
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <strong>Note:</strong> Please select both date and time for start and end of your rental period.
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSubmit} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Submit request
          </button>
        </div>
      </div>
    </div>
  )
}