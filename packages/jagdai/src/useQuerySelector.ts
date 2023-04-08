import { Store } from './store'
import type { StoreDefinition, QueryType } from './jagdai'
import useSyncExternalStoreWithSelectorExport from 'use-sync-external-store/shim/with-selector'
import { shallow } from './shallow'

const { useSyncExternalStoreWithSelector } =
  useSyncExternalStoreWithSelectorExport

const isObject = (value: unknown) => value !== null && typeof value === 'object'

const isQuerySlice = <T extends StoreDefinition, QuerySlice>(
  query: T['query'],
  slice: QuerySlice,
) => {
  if (query) {
    for (const key in query) {
      if (query[key] === slice) {
        return true
      }
    }
  }

  return false
}

const compare = <T extends StoreDefinition, QuerySlice>(
  prev: QuerySlice,
  next: QuerySlice,
  query: T['query'],
  isEqual?: (prev: QuerySlice, next: QuerySlice) => boolean,
) => {
  if (isEqual) {
    return isEqual(prev, next)
  }

  if (isObject(next) && isQuerySlice(query, next)) {
    return Object.is(prev, next)
  }

  return shallow(prev, next)
}

export const useQuerySelector = <T extends StoreDefinition, QuerySlice>(
  store: Store<T>,
  selector: (query: QueryType<T>) => QuerySlice,
  isEqual?: (prev: QuerySlice, next: QuerySlice) => boolean,
) => {
  return useSyncExternalStoreWithSelector(
    store.subscribeQuery,
    store.getQuery as () => QueryType<T>,
    store.getQuery as () => QueryType<T>,
    selector,
    (prev, next) => compare(prev, next, store.getQuery(), isEqual),
  )
}
