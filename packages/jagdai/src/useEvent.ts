import type { JagdaiEvent, Listener } from './jagdai'
import { INTERNAL_JAGDAI_EVENT_SUBSCRIBE } from './jagdai'
import { useLazyRef } from './useLazyRef'
import { useRef, useLayoutEffect } from 'react'

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
  const eventRef = useLazyRef<JagdaiEvent<Arg>>(() => {
    const event$ = new EventEmitter<Arg>()

    return Object.assign(event$.emit, {
      [INTERNAL_JAGDAI_EVENT_SUBSCRIBE]: event$.subscribe,
    })
  })

  const unsubscribeRef = useLazyRef(
    () =>
      listener && eventRef.current[INTERNAL_JAGDAI_EVENT_SUBSCRIBE](listener),
  )

  const listenerRef = useRef(listener)

  useLayoutEffect(() => {
    listenerRef.current = listener
  })

  useLayoutEffect(() => {
    unsubscribeRef.current?.()
    unsubscribeRef.current = undefined

    const subscription: Listener<Arg> = (arg) => {
      listenerRef.current?.(arg)
    }

    const unsubscribe =
      eventRef.current[INTERNAL_JAGDAI_EVENT_SUBSCRIBE](subscription)

    return () => {
      unsubscribe()
    }
  }, [])

  return eventRef.current
}
