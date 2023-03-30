import type { JagdaiEvent, Listener } from './jagdai'
import { INTERNAL_JAGDAI_EVENT_SUBSCRIBE } from './jagdai'
import { useCreation } from './useCreation'
import { useRef } from 'react'

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
  const listenerRef = useRef(listener)
  listenerRef.current = listener

  return useCreation<JagdaiEvent<Arg>>(() => {
    const event$ = new EventEmitter<Arg>()

    const emit = (arg: Arg) => {
      listenerRef.current?.(arg)
      event$.emit(arg)
    }

    return Object.assign(emit, {
      [INTERNAL_JAGDAI_EVENT_SUBSCRIBE]: event$.subscribe,
    })
  })
}
