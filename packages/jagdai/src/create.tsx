import { FC, PropsWithChildren, useEffect } from 'react'
import type {
  StoreDefinition,
  ValidStoreOutput,
  QueryType,
  CommandType,
} from './jagdai'
import type { EventListener } from './useEventSubscription'

import { createContext, useContext } from 'react'
import { useEarliestEffect } from './useEarliestEffect'
import { useCreation } from './useCreation'
import { Store } from './store'
import { useQuerySelector } from './useQuerySelector'
import { useEventSubscription } from './useEventSubscription'

import { IsolatorProvider, IsolatorConsumer } from './isolator'

type EmptyProps = {}

export const create = <T extends StoreDefinition, P extends EmptyProps>(
  hook: (props: PropsWithChildren<P>) => ValidStoreOutput<T>,
) => {
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

    useEarliestEffect(() => {
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

  const Provider: FC<PropsWithChildren<P>> = (props) => {
    return (
      <IsolatorProvider>
        <StoreExecutor {...props}>
          <IsolatorConsumer>{props.children}</IsolatorConsumer>
        </StoreExecutor>
      </IsolatorProvider>
    )
  }

  const useQuery = <Select,>(
    selector: (query: QueryType<T>) => Select,
    equalityFn?: (prev: Select, next: Select) => boolean,
  ) => {
    return useQuerySelector(useStore(), selector, equalityFn)
  }

  const useCommand = () => {
    return useStore().getCommand() as CommandType<T>
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
