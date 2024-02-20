import { useRef } from 'react'
import type { StoreEvent, Listener } from './jagdai'
import { useEarliestEffect } from './useEarliestEffect'
import { useCreation } from './useCreation'

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

  useEarliestEffect(() => {
    listenerRef.current = listener
  })

  return useCreation<StoreEvent<Arg>>(() => {
    const event$ = new EventEmitter<Arg>()

    const dispatcher = (arg: Arg) => {
      listenerRef.current?.(arg)
      event$.emit(arg)
    }

    return Object.assign(dispatcher, {
      getEventSubscriber: () => event$.subscribe,
    })
  })
}
