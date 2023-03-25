import { useEffect, useLayoutEffect, useRef } from 'react'
import { Store } from './store'
import type { StoreDefinition } from './jagdai'
import { INTERNAL_JAGDAI_EVENT_SUBSCRIBE } from './jagdai'

export const useEventSubscription = <
  T extends StoreDefinition,
  Name extends keyof T['event'],
>(
  store: Store<T>,
  name: Name,
  listener: Parameters<
    NonNullable<T['event']>[Name][typeof INTERNAL_JAGDAI_EVENT_SUBSCRIBE]
  >[0],
) => {
  const listenerRef = useRef(listener)

  useLayoutEffect(() => {
    listenerRef.current = listener
  })

  useEffect(() => {
    const events = store.getEvents()

    if (!events) {
      throw Error("You didn't define any event for this store")
    }

    const event = events![name]

    const unsubscribe = event[INTERNAL_JAGDAI_EVENT_SUBSCRIBE](
      listenerRef.current,
    )

    return () => {
      unsubscribe()
    }
  }, [store, name])
}
