import { Store } from './store'
import type { StoreDefinition, QueryType } from './jagdai'
import useSyncExternalStoreWithSelectorExport from 'use-sync-external-store/shim/with-selector'

const { useSyncExternalStoreWithSelector } =
  useSyncExternalStoreWithSelectorExport

const compare = <Select>(
  prev: Select,
  next: Select,
  equalityFn?: (prev: Select, next: Select) => boolean,
) => {
  if (equalityFn) {
    return equalityFn(prev, next)
  }

  return Object.is(prev, next)
}

export const useQuerySelector = <T extends StoreDefinition, Select>(
  store: Store<T>,
  selector: (query: QueryType<T>) => Select,
  equalityFn?: (prev: Select, next: Select) => boolean,
) => {
  return useSyncExternalStoreWithSelector(
    store.subscribeQuery,
    store.getQuery as () => QueryType<T>,
    store.getQuery as () => QueryType<T>,
    selector,
    (prev, next) => compare(prev, next, equalityFn),
  )
}
