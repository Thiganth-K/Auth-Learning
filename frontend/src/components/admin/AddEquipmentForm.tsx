import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'

type AddEquipmentFormProps = {
  onAdd: (title: string) => void
}

export default function AddEquipmentForm({ onAdd }: AddEquipmentFormProps) {
  const [title, setTitle] = useState('')
  
  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim())
      setTitle('')
    }
  }

  return (
    <div className="mt-2">
      <input 
        placeholder="Equipment title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="w-full border p-2 rounded" 
      />
      <div className="mt-2 flex justify-end">
        <button 
          onClick={handleSubmit} 
          className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-2"
        >
          <FaPlus /> Add
        </button>
      </div>
    </div>
  )
}