import { useRef } from 'react'

export function useCreation<T>(factory: () => T) {
  const { current } = useRef({
    entity: undefined as undefined | T,
    initialized: false,
  })

  if (current.initialized === false) {
    current.entity = factory()
    current.initialized = true
  }

  return current.entity as T
}
