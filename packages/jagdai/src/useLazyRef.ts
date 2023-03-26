import type React from 'react'
import { useRef } from 'react'
import { None } from './utility'

export function useLazyRef<T>(initialize: () => T) {
  const ref = useRef<T | typeof None>(None)

  if (ref.current === None) {
    ref.current = initialize()
  }

  return ref as React.MutableRefObject<T>
}
