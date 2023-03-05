import type { StoreShape } from './types'

type Listener = () => void

export class StoreManager<Store extends StoreShape> {
  querySnapshot: Store['query']
  listeners = new Set<Listener>()
  commands: Store['command'] = undefined
  memoizedCommands: Store['command'] = undefined

  constructor(store: Store) {
    this.querySnapshot = store.query

    if (store.command) {
      this.memoizedCommands = {} as NonNullable<Store['command']>
      this.commands = store.command

      for (const key in this.commands) {
        this.memoizedCommands[key] = (...arg) => {
          return this.commands![key](...arg)
        }
      }
    }
  }

  update(store: Store) {
    this.querySnapshot = store.query

    if (store.command) {
      for (const key in this.commands) {
        this.commands[key] = store.command[key]
      }
    }
  }

  notify() {
    for (const listener of this.listeners) {
      listener()
    }
  }

  getQuerySnapshot() {
    return this.querySnapshot
  }

  getCommands() {
    return this.memoizedCommands
  }
}
