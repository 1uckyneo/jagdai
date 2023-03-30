import { useRef } from 'react'
import { None } from './utility'

export function useCreation<T>(factory: () => T) {
  const ref = useRef<T | typeof None>(None)

  if (ref.current === None) {
    ref.current = factory()
  }

  return ref.current
}
