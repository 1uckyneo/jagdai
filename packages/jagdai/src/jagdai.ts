/**
 * @inner This is inner a key of StoreEvent
 */
export const INTERNAL_STORE_EVENT_SUBSCRIBE: unique symbol = Symbol(
  'internal-store-event-subscribe',
)

export type Listener<Arg> = (arg: Arg) => void
export type Unsubscribe = () => void

export type StoreEvent<Arg> = ((arg: Arg) => void) & {
  [INTERNAL_STORE_EVENT_SUBSCRIBE]: (listener: Listener<Arg>) => Unsubscribe
}

export type StoreDefinition<Arg = any> = {
  query?: {
    [key: string]: unknown
  }
  command?: {
    [key: string]: (...args: any[]) => any
  }
  event?: {
    [key: string]: StoreEvent<Arg>
  }
}

export type ValidStoreOutput<T> = Required<{
  [key in keyof T]: key extends keyof StoreDefinition ? T[key] : never
}>

export type Selector<Snapshot, Selection> = (query: Snapshot) => Selection

type UpperChar =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'

export type Capitalize<T extends string = string> = `${UpperChar}${T}`
