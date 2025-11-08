import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaFilter } from 'react-icons/fa'

type SearchAndFilterProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: 'equipment' | 'lab'
  onCategoryChange: (category: 'equipment' | 'lab') => void
  darkMode: boolean
}

export default function SearchAndFilter({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange
}: SearchAndFilterProps) {
  return (
    <div className="search-container">
      {/* Main Search Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Find Professional Equipment & Lab Spaces
        </h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by equipment name, type, or keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input pl-12 text-base h-14"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => onCategoryChange('equipment')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === 'equipment'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Equipment
            </button>
            <button
              onClick={() => onCategoryChange('lab')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                selectedCategory === 'lab'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Lab Spaces
            </button>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select className="form-input pl-10 appearance-none bg-white">
              <option>All Locations</option>
              <option>Main Campus</option>
              <option>Research Center</option>
              <option>Engineering Building</option>
            </select>
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              className="form-input pl-10"
              placeholder="Select date"
            />
          </div>
        </div>

        {/* Capacity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
          <div className="relative">
            <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select className="form-input pl-10 appearance-none bg-white">
              <option>Any size</option>
              <option>1-5 people</option>
              <option>6-15 people</option>
              <option>16+ people</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <FaFilter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Quick filters:</span>
        </div>
        
        <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
          Available Now
        </button>
        <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
          High Rating (4.5+)
        </button>
        <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
          Budget Friendly
        </button>
        <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
          Latest Equipment
        </button>
      </div>

      {/* Search Results Summary */}
      {searchTerm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Searching for <span className="font-medium">"{searchTerm}"</span> in{' '}
            <span className="font-medium">
              {selectedCategory === 'equipment' ? 'Equipment' : 'Lab Spaces'}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}