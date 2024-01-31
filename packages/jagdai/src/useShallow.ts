import { useRef } from 'react'
import { shallow } from './shallow'

export const useShallow = <Query, Selected>(
  selector: (query: Query) => Selected,
): ((query: Query) => Selected) => {
  const prev = useRef<Selected>()

  return (query) => {
    const next = selector(query)

    if (shallow(prev.current, next)) {
      return prev.current as Selected
    }

    return (prev.current = next)
  }
}
