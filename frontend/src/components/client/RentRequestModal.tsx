import type { Equipment } from '../../types'

type RentRequestModalProps = {
  equipment: Equipment | null
  rentStart: string
  rentEnd: string
  onRentStartChange: (value: string) => void
  onRentEndChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function RentRequestModal({ 
  equipment, 
  rentStart, 
  rentEnd, 
  onRentStartChange, 
  onRentEndChange, 
  onSubmit, 
  onClose 
}: RentRequestModalProps) {
  if (!equipment) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="font-semibold">Request rental for {equipment.title}</h3>
        <div className="mt-3">
          <label className="block text-sm">Start date</label>
          <input 
            type="date" 
            value={rentStart} 
            onChange={(e) => onRentStartChange(e.target.value)} 
            className="w-full border p-2 rounded" 
          />
          <label className="block text-sm mt-2">End date</label>
          <input 
            type="date" 
            value={rentEnd} 
            onChange={(e) => onRentEndChange(e.target.value)} 
            className="w-full border p-2 rounded" 
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button onClick={onSubmit} className="px-3 py-1 bg-blue-600 text-white rounded">Submit request</button>
        </div>
      </div>
    </div>
  )
}