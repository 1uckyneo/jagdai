import type {
  StoreShape,
  ValidStore,
  Query,
  Unsubscriber,
  Capitalize,
} from './types'
import React, { createContext, useContext, useLayoutEffect } from 'react'
import { useCreation } from './useCreation'
import { StoreManager } from './storeManager'
import { useQuerySelector } from './useQuerySelector'
import { useCommandSelector } from './useCommandSelector'
import { useEventEffect } from './useEventEffect'

type EmptyProps = {}

type Options<Props> = {
  /**
   * just like React.memo
   */
  memo?:
    | boolean
    | ((prevProps: Readonly<Props>, nextProps: Readonly<Props>) => boolean)
  /**
   * Reserved for devtools in the future
   */
  name?: Capitalize
}

const Empty: unique symbol = Symbol('Empty Context')

export function create<
  StoreType extends StoreShape,
  PropsType extends EmptyProps,
>(
  useCreateStore: (
    props: React.PropsWithChildren<PropsType>,
  ) => ValidStore<StoreType>,
  options?: Options<PropsType>,
) {
  type Store = ValidStore<StoreType>

  const StoreContext = createContext<StoreManager<Store> | typeof Empty>(Empty)

  const useStoreManager = () => {
    const manager = useContext(StoreContext)

    if (manager === Empty) {
      throw new Error('You may forget to add related store provider component')
    }

    return manager
  }

  const StoreExecutor: React.FC<React.PropsWithChildren<PropsType>> = (
    props,
  ) => {
    const store = useCreateStore(props)
    const manager = useCreation(() => new StoreManager<Store>(store))
    manager.update(store)

    useLayoutEffect(() => {
      manager.notify()
    })

    return (
      <StoreContext.Provider value={manager}>
        {props.children}
      </StoreContext.Provider>
    )
  }

  const IsolationContext = createContext({})
  const IsolationProvider: React.FC<React.PropsWithChildren<unknown>> = (
    props,
  ) => {
    return (
      <IsolationContext.Provider value={{}}>
        {props.children}
      </IsolationContext.Provider>
    )
  }
  const IsolationConsumer: React.FC<React.PropsWithChildren<unknown>> = (
    props,
  ) => {
    useContext(IsolationContext)
    return <>{props.children}</>
  }

  const StoreProvider: React.FC<React.PropsWithChildren<PropsType>> = (
    props,
  ) => {
    return (
      <IsolationProvider>
        <StoreExecutor {...props}>
          <IsolationConsumer>{props.children}</IsolationConsumer>
        </StoreExecutor>
      </IsolationProvider>
    )
  }

  const displayName = options?.name || 'JagdaiStore'

  StoreProvider.displayName = displayName

  const Store = options?.memo
    ? React.memo(
        StoreProvider,
        typeof options?.memo === 'function' ? options?.memo : undefined,
      )
    : StoreProvider

  return {
    Store,
    useQuery: <Selection,>(
      query: Query<Store['query'], Selection>,
      isEqual?: (prev: Selection, next: Selection) => boolean,
    ) => {
      const manager = useStoreManager()

      return useQuerySelector(manager, query, isEqual)
    },
    useCommand: <Selection = Store['command'],>(
      query?: Query<Store['command'], Selection>,
    ) => {
      const manager = useStoreManager()

      return useCommandSelector<Store, Selection>(manager, query) as Selection
    },
    useEvent: (query: Query<Store['event'], Unsubscriber>) => {
      const manager = useStoreManager()

      useEventEffect(manager, query)
    },
  }
}
