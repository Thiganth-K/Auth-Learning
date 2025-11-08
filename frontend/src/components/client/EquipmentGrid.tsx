import type { Equipment } from '../../types'
import EquipmentCard from './EquipmentCard'
import { FaSearch } from 'react-icons/fa'

type EquipmentGridProps = {
  equipments: Equipment[]
  onEquipmentClick: (equipment: Equipment) => void
  darkMode: boolean
}

export default function EquipmentGrid({ equipments, onEquipmentClick, darkMode }: EquipmentGridProps) {
  const totalCount = equipments.length

  return (
    <section>
      {/* Results Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              {totalCount} {totalCount === 1 ? 'Item' : 'Items'} Available
            </h2>
            <p className="text-gray-600">
              Professional equipment and laboratory spaces for rent
            </p>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <select className="form-input text-sm w-auto">
              <option>Sort by Price</option>
              <option>Sort by Rating</option>
              <option>Sort by Availability</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="equipment-grid">
        {equipments.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any equipment or lab spaces matching your criteria.
              </p>
              <button className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          equipments.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              onClick={onEquipmentClick}
              darkMode={darkMode}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {equipments.length > 0 && (
        <div className="text-center mt-12">
          <button className="btn btn-secondary px-8">
            Load More Items
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Showing {equipments.length} of {equipments.length} items
          </p>
        </div>
      )}
    </section>
  )
}