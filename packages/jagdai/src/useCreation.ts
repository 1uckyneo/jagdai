import { useRef } from 'react'

export const useCreation = <T>(factory: () => T) => {
  const ref = useRef<T>()

  if (!ref.current) {
    ref.current = factory()
  }

  return ref.current
}
