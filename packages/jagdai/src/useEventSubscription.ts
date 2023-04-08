import { useRef } from 'react'
import { useEarliestEffect } from './useEarliestEffect'
import { Store } from './store'
import type { StoreDefinition } from './jagdai'

export type EventListener<
  T extends StoreDefinition,
  Name extends keyof T['event'],
> = Parameters<
  ReturnType<NonNullable<T['event']>[Name]['getEventSubscriber']>
>[0]

export const useEventSubscription = <
  T extends StoreDefinition,
  Name extends keyof T['event'],
>(
  store: Store<T>,
  name: Name,
  listener: EventListener<T, Name>,
) => {
  const listenerRef = useRef(listener)

  useEarliestEffect(() => {
    listenerRef.current = listener
  })

  useEarliestEffect(() => {
    const events = store.getEvent()

    if (!events) {
      throw Error("You didn't define any event for this store")
    }

    const event = events![name]

    if (event === undefined) {
      throw Error(`No such event called ${String(name)} in this store`)
    }

    const subscription: EventListener<T, Name> = (arg) => {
      listenerRef.current(arg)
    }

    const unsubscribe = event.getEventSubscriber()(subscription)

    return () => {
      unsubscribe()
    }
  }, [name, store])
}
