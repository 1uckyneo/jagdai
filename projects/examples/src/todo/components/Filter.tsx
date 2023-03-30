import React from 'react'
import { TodoStore } from '../store'

export const Filter: React.FC = () => {
  const filter = TodoStore.useQuery((query) => query.filter)
  const { updateFilter } = TodoStore.useCommand()

  return (
    <div className="visibility-filters">
      <span
        className={`filter ${filter === 'all' && 'filter--active'}`}
        onClick={() => {
          updateFilter('all')
        }}>
        {'all'}
      </span>
      <span
        className={`filter ${filter === 'completed' && 'filter--active'}`}
        onClick={() => {
          updateFilter('completed')
        }}>
        {'completed'}
      </span>
      <span
        className={`filter ${filter === 'incomplete' && 'filter--active'}`}
        onClick={() => {
          updateFilter('incomplete')
        }}>
        {'incomplete'}
      </span>
    </div>
  )
}
