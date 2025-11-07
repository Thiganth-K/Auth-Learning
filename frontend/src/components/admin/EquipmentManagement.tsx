import type { Equipment } from '../../types'
import { currency } from '../../types/utils'
import AddEquipmentForm from './AddEquipmentForm'

type EquipmentManagementProps = {
  equipments: Equipment[]
  onAddEquipment: (title: string) => void
}

export default function EquipmentManagement({ equipments, onAddEquipment }: EquipmentManagementProps) {
  return (
    <div>
      <h3 className="font-semibold">Manage Equipments</h3>
      <AddEquipmentForm onAdd={onAddEquipment} />
      <div className="mt-3 space-y-2">
        {equipments.map((e) => (
          <div key={e.id} className="border rounded p-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-gray-500">{e.description}</div>
            </div>
            <div className="text-right">
              <div className="text-sm">{currency(e.pricePerDay)} / day</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}