import { useState } from 'react'
import { FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa'
import type { Equipment } from '../../types'
import { currency } from '../../types/utils'
import AddEquipmentForm from './AddEquipmentForm'

type EquipmentManagementProps = {
  equipments: Equipment[]
  onAddEquipment: (title: string) => void
}

export default function EquipmentManagement({ equipments, onAddEquipment }: EquipmentManagementProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Equipment>>({})

  const startEditing = (equipment: Equipment) => {
    setEditingId(equipment.id)
    setEditData({
      title: equipment.title,
      description: equipment.description,
      pricePerDay: equipment.pricePerDay,
      category: equipment.category
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditData({})
  }

  const saveEditing = () => {
    // Here you would typically call a function to update the equipment
    // For now, we'll just cancel editing since there's no update function in props
    console.log('Would save:', editData)
    alert('Equipment updated successfully! (This is a demo - changes are not persisted)')
    cancelEditing()
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Manage Equipment</h3>
      <AddEquipmentForm onAdd={onAddEquipment} />
      
      <div className="mt-6 space-y-4">
        {equipments.map((equipment) => (
          <div key={equipment.id} className="card">
            {editingId === equipment.id ? (
              // Edit mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Equipment Title
                  </label>
                  <input
                    type="text"
                    value={editData.title || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="form-input"
                    placeholder="Enter equipment title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    className="form-input"
                    rows={3}
                    placeholder="Enter equipment description"
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
                      value={editData.pricePerDay || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, pricePerDay: parseFloat(e.target.value) || 0 }))}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={editData.category || 'equipment'}
                      onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value as 'equipment' | 'lab' }))}
                      className="form-input"
                    >
                      <option value="equipment">Equipment</option>
                      <option value="lab">Lab</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelEditing}
                    className="btn btn-secondary"
                  >
                    <FaTimes className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={saveEditing}
                    className="btn btn-success"
                  >
                    <FaSave className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{equipment.title}</h4>
                    <span className={`badge ${equipment.category === 'equipment' ? 'badge-equipment' : 'badge-lab'}`}>
                      {equipment.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {equipment.description || 'No description available'}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="price-display">{currency(equipment.pricePerDay)}</span>
                    <span className="price-unit">per day</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => startEditing(equipment)}
                    className="btn btn-secondary text-sm"
                    title="Edit equipment"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this equipment?')) {
                        alert('Delete functionality would be implemented here')
                      }
                    }}
                    className="btn btn-warning text-sm"
                    title="Delete equipment"
                  >
                    <FaTrash className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {equipments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FaEdit className="mx-auto text-4xl mb-2 opacity-50" />
            <p>No equipment added yet</p>
            <p className="text-sm">Add your first equipment using the form above</p>
          </div>
        )}
      </div>
    </div>
  )
}