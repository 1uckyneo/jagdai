export type Subscriber<Arg> = (arg: Arg) => void

export type Unsubscriber = () => void

export type Event<Arg> = (subscriber: Subscriber<Arg>) => Unsubscriber

export type StoreShape<Arg = unknown> = {
  query: {
    [key: string]: any
  }
  command?: {
    [key: string]: (...args: any[]) => any
  }
  event?: {
    [key: string]: Event<Arg>
  }
}

type IllegalKeys<T> = Exclude<keyof T, keyof StoreShape>

export type ValidStore<T> = T & Record<IllegalKeys<T>, never>

export type Query<Snapshot, Selection> = (query: Snapshot) => Selection

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
