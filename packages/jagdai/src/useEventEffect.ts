import { useEffect } from 'react'
import { StoreManager } from './storeManager'
import type { StoreShape, Unsubscriber, Query } from './types'

export const useEventEffect = <Store extends StoreShape>(
  manager: StoreManager<Store>,
  query: Query<Store['event'], Unsubscriber>,
) => {
  useEffect(() => {
    const unsubscribe = query(manager.getEvents())

    return () => {
      unsubscribe()
    }
  })
}
