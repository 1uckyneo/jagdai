import { useRef } from 'react'

export function useCreation<T>(factory: () => T) {
  const ref = useRef({
    creation: undefined as undefined | T,
    done: false,
  })

  if (!ref.current.done) {
    ref.current.creation = factory()
    ref.current.done = true
  }

  return ref.current.creation as T
}
