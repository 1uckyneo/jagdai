import { Store } from './store'
import type { Selector, StoreDefinition } from './jagdai'
import useSyncExternalStoreWithSelectorExport from 'use-sync-external-store/shim/with-selector'
import { shallow } from './shallow'

const { useSyncExternalStoreWithSelector } =
  useSyncExternalStoreWithSelectorExport

export const useQuerySelector = <T extends StoreDefinition, Selection>(
  store: Store<T>,
  selector: Selector<T['query'], Selection>,
  isEqual?: (prev: Selection, next: Selection) => boolean,
) => {
  const selection = useSyncExternalStoreWithSelector(
    (onStoreChange) => {
      store.queryListeners.add(onStoreChange)

      return () => {
        store.queryListeners.delete(onStoreChange)
      }
    },
    () => store.getState(),
    null, // TODO: getServerSnapshot
    selector,
    isEqual ?? shallow,
  )

  return selection
}
