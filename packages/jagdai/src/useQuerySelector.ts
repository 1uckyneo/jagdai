import { StoreManager } from './storeManager'
import type { Selector, StoreShape } from './types'
import useSyncExternalStoreWithSelectorExport from 'use-sync-external-store/shim/with-selector'
import { compare } from './compare'

const { useSyncExternalStoreWithSelector } =
  useSyncExternalStoreWithSelectorExport

export const useQuerySelector = <Store extends StoreShape, Selection>(
  manager: StoreManager<Store>,
  selector: Selector<Store['query'], Selection>,
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
    selector,
    isEqual ?? compare,
  )

  return selection
}
