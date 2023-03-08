import { useEffect } from 'react'
import { StoreManager } from './storeManager'
import type { StoreShape, Unsubscriber, Selector } from './types'

export const useEventEffect = <
  Store extends StoreShape,
  Name extends keyof Store['event'],
>(
  manager: StoreManager<Store>,
  arg1: Selector<Store['event'], Unsubscriber> | Name,
  arg2?: Parameters<NonNullable<Store['event']>[Name]>[0],
) => {
  useEffect(() => {
    const events = manager.getEvents()

    if (typeof arg1 === 'function') {
      const unsubscribe = arg1(events)

      return () => {
        unsubscribe()
      }
    }

    if (typeof arg1 === 'string' && arg2) {
      if (!events) {
        throw Error("You didn't defined any event")
      }

      const event = events[arg1]
      const unsubscribe = event(arg2)

      return () => {
        unsubscribe()
      }
    }
  })
}
