import type {
  StoreShape,
  ValidStore,
  Selector,
  Unsubscriber,
  Capitalize,
} from './types'
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
} from 'react'
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

export function create<Store extends StoreShape, Props extends EmptyProps>(
  useStoreSnapshot: (
    props: React.PropsWithChildren<Props>,
  ) => ValidStore<Store>,
  options?: Options<Props>,
) {
  const StoreContext = createContext<StoreManager<Store> | typeof Empty>(Empty)
  const useStoreManager = () => {
    const manager = useContext(StoreContext)

    if (manager === Empty) {
      throw new Error(
        'You may forget to add related snapshot provider component',
      )
    }

    return manager
  }
  const StoreExecutor: React.FC<React.PropsWithChildren<Props>> = (props) => {
    const snapshot = useStoreSnapshot(props)
    const manager = useCreation(() => new StoreManager<Store>(snapshot))

    useLayoutEffect(() => {
      manager.update(snapshot)
    })

    useEffect(() => {
      manager.notify()
    })

    return (
      <StoreContext.Provider value={manager}>
        {props.children}
      </StoreContext.Provider>
    )
  }

  const IsolatorContext = createContext({})
  const IsolatorProvider: React.FC<React.PropsWithChildren<unknown>> = (
    props,
  ) => {
    return (
      <IsolatorContext.Provider value={{}}>
        {props.children}
      </IsolatorContext.Provider>
    )
  }
  const IsolatorConsumer: React.FC<React.PropsWithChildren<unknown>> = (
    props,
  ) => {
    useContext(IsolatorContext)
    return <>{props.children}</>
  }

  const StoreProvider: React.FC<React.PropsWithChildren<Props>> = (props) => {
    return (
      <IsolatorProvider>
        <StoreExecutor {...props}>
          <IsolatorConsumer>{props.children}</IsolatorConsumer>
        </StoreExecutor>
      </IsolatorProvider>
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

  function useQuery<Selection>(
    selector: Selector<Store['query'], Selection>,
    isEqual?: (prev: Selection, next: Selection) => boolean,
  ) {
    return useQuerySelector(useStoreManager(), selector, isEqual)
  }

  function useCommand<Selection = Store['command']>(
    selector?: Selector<Store['command'], Selection>,
  ) {
    return useCommandSelector(useStoreManager(), selector)
  }

  function useEvent(selector: Selector<Store['event'], Unsubscriber>): void
  function useEvent<Name extends keyof Store['event']>(
    name: Name,
    subscriber: Parameters<NonNullable<Store['event']>[Name]>[0],
  ): void
  function useEvent<Name extends keyof Store['event']>(
    arg1: Name | Selector<Store['event'], Unsubscriber>,
    arg2?: Parameters<NonNullable<Store['event']>[Name]>[0],
  ) {
    useEventEffect(useStoreManager(), arg1, arg2)
  }

  return {
    Store,
    useQuery,
    useCommand,
    useEvent,
  }
}
