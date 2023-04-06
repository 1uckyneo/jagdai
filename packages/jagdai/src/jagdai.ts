/**
 * @inner This is a inner key of JagdaiEvent
 */
export const INTERNAL_JAGDAI_EVENT_SUBSCRIBE: unique symbol = Symbol(
  'internal-jagdai-event-subscribe',
)

export type Listener<Arg> = (arg: Arg) => void

export type JagdaiEvent<Arg> = ((arg: Arg) => void) & {
  [INTERNAL_JAGDAI_EVENT_SUBSCRIBE]: (listener: Listener<Arg>) => () => void
}

type StoreOutput<Arg = any> = {
  query: {
    [key: string]: unknown
  }
  command: {
    [key: string]: (...args: any[]) => any
  }
  event: {
    [key: string]: JagdaiEvent<Arg>
  }
}

export type StoreDefinition<Arg = any> = Partial<StoreOutput<Arg>>

type AtLeastOneKey<T> = keyof T extends never ? never : T

export type ValidStoreOutput<T> = Required<{
  [key in keyof T]: key extends keyof StoreDefinition
    ? AtLeastOneKey<T[key]>
    : never
}>

export type QueryType<T extends StoreDefinition, U = undefined> = T extends {
  query: infer Q
}
  ? Q
  : U

export type CommandType<T extends StoreDefinition, U = undefined> = T extends {
  command: infer C
}
  ? C
  : U
