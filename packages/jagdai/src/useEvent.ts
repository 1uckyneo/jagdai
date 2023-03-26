import type { JagdaiEvent, Listener } from './jagdai'
import { INTERNAL_JAGDAI_EVENT_SUBSCRIBE } from './jagdai'
import { useCreation } from './useCreation'
import { useLazyRef } from './useLazyRef'
import { useEffect } from 'react'

class EventEmitter<Arg> {
  private listeners = new Set<Listener<Arg>>()

  readonly emit = (arg: Arg) => {
    for (const listener of this.listeners) {
      listener(arg)
    }
  }

  readonly subscribe = (listener: Listener<Arg>) => {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }
}

export const useEvent = <Arg = void>(listener?: Listener<Arg>) => {
  const event = useCreation<JagdaiEvent<Arg>>(() => {
    const event$ = new EventEmitter<Arg>()

    return Object.assign(event$.emit, {
      [INTERNAL_JAGDAI_EVENT_SUBSCRIBE]: event$.subscribe,
    })
  })

  const unsubscribeRef = useLazyRef(
    () => listener && event[INTERNAL_JAGDAI_EVENT_SUBSCRIBE](listener),
  )

  useEffect(() => {
    unsubscribeRef.current =
      listener && event[INTERNAL_JAGDAI_EVENT_SUBSCRIBE](listener)

    return () => {
      unsubscribeRef.current?.()
    }
  })

  return event
}
