import { Store } from './store'
import type { StoreDefinition, QueryType } from './jagdai'
import useSyncExternalStoreWithSelectorExport from 'use-sync-external-store/shim/with-selector'
import { shallow } from './shallow'

const { useSyncExternalStoreWithSelector } =
  useSyncExternalStoreWithSelectorExport

export const useQuerySelector = <T extends StoreDefinition, QuerySlice>(
  store: Store<T>,
  selector: (query: QueryType<T>) => QuerySlice,
  isEqual?: (prev: QuerySlice, next: QuerySlice) => boolean,
) => {
  return useSyncExternalStoreWithSelector(
    (onStoreChange) => {
      store.queryListeners.add(onStoreChange)

      return () => {
        store.queryListeners.delete(onStoreChange)
      }
    },
    () => store.getState() as QueryType<T>,
    null, // TODO: getServerSnapshot
    selector,
    isEqual ?? shallow,
  )
}
