import { Store } from './store'
import type { StoreDefinition, QueryType } from './jagdai'
import useSyncExternalStoreWithSelectorExport from 'use-sync-external-store/shim/with-selector'

const { useSyncExternalStoreWithSelector } =
  useSyncExternalStoreWithSelectorExport

const compare = <Selected>(
  prev: Selected,
  next: Selected,
  isEqual?: (prev: Selected, next: Selected) => boolean,
) => {
  if (isEqual) {
    return isEqual(prev, next)
  }

  return Object.is(prev, next)
}

export const useQuerySelector = <T extends StoreDefinition, Selected>(
  store: Store<T>,
  selector: (query: QueryType<T>) => Selected,
  isEqual?: (prev: Selected, next: Selected) => boolean,
) => {
  return useSyncExternalStoreWithSelector(
    store.subscribeQuery,
    store.getQuery as () => QueryType<T>,
    store.getQuery as () => QueryType<T>,
    selector,
    (prev, next) => compare(prev, next, isEqual),
  )
}
