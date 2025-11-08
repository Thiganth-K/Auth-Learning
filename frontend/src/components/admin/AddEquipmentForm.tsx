import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'

type AddEquipmentFormProps = {
  onAdd: (title: string) => void
}

export default function AddEquipmentForm({ onAdd }: AddEquipmentFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    category: 'equipment' as 'equipment' | 'lab',
    image: ''
  })
  
  const handleSubmit = () => {
    if (formData.title.trim()) {
      // For now, we'll just use the title since the parent function only accepts title
      // In a real app, you'd want to pass the full equipment object
      onAdd(formData.title.trim())
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        pricePerDay: '',
        category: 'equipment',
        image: ''
      })
      setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      pricePerDay: '',
      category: 'equipment',
      image: ''
    })
    setIsExpanded(false)
  }

  return (
    <div className="card">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          <FaPlus className="w-5 h-5 mx-auto mb-2" />
          <span className="text-sm font-medium">Add New Equipment</span>
        </button>
      ) : (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Equipment
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Equipment Title *
            </label>
            <input 
              type="text"
              placeholder="Enter equipment title" 
              value={formData.title} 
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
              className="form-input"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter equipment description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="form-input"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price per Day (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.pricePerDay}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'equipment' | 'lab' }))}
                className="form-input"
              >
                <option value="equipment">Equipment</option>
                <option value="lab">Lab</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!formData.title.trim()}
              className="btn btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus className="w-4 h-4" />
              Add Equipment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}