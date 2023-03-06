import { StoreManager } from './storeManager'
import type { Query, StoreShape } from './types'
import useSyncExternalStoreWithSelectorExport from 'use-sync-external-store/shim/with-selector'
import { compare } from './compare'

const { useSyncExternalStoreWithSelector } =
  useSyncExternalStoreWithSelectorExport

export const useQuerySelector = <Store extends StoreShape, Selection>(
  manager: StoreManager<Store>,
  queryFn: Query<Store['query'], Selection>,
  isEqual?: (prev: Selection, next: Selection) => boolean,
) => {
  const selection = useSyncExternalStoreWithSelector(
    (onStoreChange) => {
      manager.listeners.add(onStoreChange)

      return () => {
        manager.listeners.delete(onStoreChange)
      }
    },
    () => manager.getState(),
    null, // TODO: getServerSnapshot
    queryFn,
    isEqual ?? compare,
  )

  return selection
}
