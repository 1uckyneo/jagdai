import { useRef } from 'react'

export function useCreation<T>(factory: () => T) {
  const { current } = useRef({
    obj: undefined as undefined | T,
    initialized: false,
  })

  if (current.initialized === false) {
    current.obj = factory()
    current.initialized = true
  }

  return current.obj as T
}
