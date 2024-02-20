import { useRef } from 'react'
import { shallow } from './shallow'

export const useShallow = <Query, Select>(
  selector: (query: Query) => Select,
): ((query: Query) => Select) => {
  const prev = useRef<Select>()

  return (query) => {
    const next = selector(query)

    if (shallow(prev.current, next)) {
      return prev.current as Select
    }

    return (prev.current = next)
  }
}
