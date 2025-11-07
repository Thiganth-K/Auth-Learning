import type { Equipment } from '../../types'
import EquipmentCard from './EquipmentCard'

type EquipmentGridProps = {
  equipments: Equipment[]
  onEquipmentClick: (equipment: Equipment) => void
}

export default function EquipmentGrid({ equipments, onEquipmentClick }: EquipmentGridProps) {
  return (
    <section className="md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Equipments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipments.map((equipment) => (
          <EquipmentCard
            key={equipment.id}
            equipment={equipment}
            onClick={onEquipmentClick}
          />
        ))}
      </div>
    </section>
  )
}