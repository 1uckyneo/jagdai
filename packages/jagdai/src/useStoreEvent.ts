import { useCreation } from './useCreation'
import type { StoreEvent, Listener } from './jagdai'
import { INTERNAL_STORE_EVENT_SUBSCRIBE } from './jagdai'

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

export const useStoreEvent = <Arg = void>() => {
  return useCreation<StoreEvent<Arg>>(() => {
    const event$ = new EventEmitter<Arg>()

    return Object.assign(event$.emit, {
      [INTERNAL_STORE_EVENT_SUBSCRIBE]: event$.subscribe,
    })
  })
}
