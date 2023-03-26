import type { FC, PropsWithChildren } from 'react'
import type {
  StoreDefinition,
  ValidStoreOutput,
  QueryType,
  CommandType,
} from './jagdai'
import type { Capitalize } from './utility'
import type { EventListener } from './useEventSubscription'

import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  memo,
} from 'react'
import { None } from './utility'
import { useCreation } from './useCreation'
import { Store } from './store'
import { useQuerySelector } from './useQuerySelector'
import { useEventSubscription } from './useEventSubscription'

import { IsolatorProvider, IsolatorConsumer } from './isolator'

type EmptyProps = {}

type Options<Props> = {
  /**
   * Prepare for future devtools
   */
  name?: Capitalize
  /**
   * Similar to React.memo
   */
  memo?:
    | boolean
    | ((prevProps: Readonly<Props>, nextProps: Readonly<Props>) => boolean)
}

export function create<T extends StoreDefinition, P extends EmptyProps>(
  hook: (props: PropsWithChildren<P>) => ValidStoreOutput<T>,
  options?: Options<P>,
) {
  const StoreContext = createContext<Store<T> | typeof None>(None)
  const useStore = () => {
    const store = useContext(StoreContext)

    if (store === None) {
      throw new Error('You may forget to add related store provider component')
    }

    return store
  }
  const StoreExecutor: FC<PropsWithChildren<P>> = (props) => {
    const snapshot = hook(props)
    const store = useCreation(() => new Store(snapshot))

    useLayoutEffect(() => {
      store.update(snapshot)
    })

    useEffect(() => {
      store.notifyQuery()
    })

    return (
      <StoreContext.Provider value={store}>
        {props.children}
      </StoreContext.Provider>
    )
  }

  const StoreProvider: FC<PropsWithChildren<P>> = (props) => {
    return (
      <IsolatorProvider>
        <StoreExecutor {...props}>
          <IsolatorConsumer>{props.children}</IsolatorConsumer>
        </StoreExecutor>
      </IsolatorProvider>
    )
  }

  const FinalStoreProvider = options?.memo
    ? memo(
        StoreProvider,
        typeof options?.memo === 'function' ? options?.memo : undefined,
      )
    : StoreProvider

  const displayName = options?.name || 'JagdaiStore'
  FinalStoreProvider.displayName = displayName

  function useStoreQuery<QuerySlice>(
    selector: (query: QueryType<T>) => QuerySlice,
    isEqual?: (prev: QuerySlice, next: QuerySlice) => boolean,
  ) {
    return useQuerySelector(useStore(), selector, isEqual)
  }

  function useStoreCommand() {
    return useStore().getCommands() as CommandType<T>
  }

  function useStoreEvent<Name extends keyof T['event']>(
    name: Name,
    listener: EventListener<T, Name>,
  ) {
    useEventSubscription(useStore(), name, listener)
  }

  return {
    Store: FinalStoreProvider,
    useStoreQuery,
    useStoreCommand,
    useStoreEvent,
  }
}
