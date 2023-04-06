import type { FC, PropsWithChildren } from 'react'
import type {
  StoreDefinition,
  ValidStoreOutput,
  QueryType,
  CommandType,
} from './jagdai'
import type { EventListener } from './useEventSubscription'

import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  memo,
} from 'react'
import { useCreation } from './useCreation'
import { Store } from './store'
import { useQuerySelector } from './useQuerySelector'
import { useEventSubscription } from './useEventSubscription'

import { IsolatorProvider, IsolatorConsumer } from './isolator'

type EmptyProps = {}

type Options<Props> = {
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
  const StoreContext = createContext<Store<T> | undefined>(undefined)

  const useStore = () => {
    const store = useContext(StoreContext)

    if (!store) {
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

  const Provider = options?.memo
    ? memo(
        StoreProvider,
        typeof options?.memo === 'function' ? options?.memo : undefined,
      )
    : StoreProvider

  const useQuery = <QuerySlice,>(
    selector: (query: QueryType<T>) => QuerySlice,
    isEqual?: (prev: QuerySlice, next: QuerySlice) => boolean,
  ) => {
    return useQuerySelector(useStore(), selector, isEqual)
  }

  const useCommand = () => {
    return useStore().getCommands() as CommandType<T>
  }

  const useEvent = <Name extends keyof T['event']>(
    name: Name,
    listener: EventListener<T, Name>,
  ) => {
    useEventSubscription(useStore(), name, listener)
  }

  return {
    Provider,
    useQuery,
    useCommand,
    useEvent,
  }
}
