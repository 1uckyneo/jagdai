import React from 'react'
import { useTodoQuery, useTodoCommand } from '../store'

export const Filter: React.FC = () => {
  const filter = useTodoQuery((query) => query.filter)
  const { updateFilter } = useTodoCommand()

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
