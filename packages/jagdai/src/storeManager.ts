import type { StoreShape } from './types'

type Listener = () => void

export class StoreManager<Store extends StoreShape> {
  private state: Store['query']
  listeners = new Set<Listener>()
  private commands: Store['command'] = undefined
  private memoizedCommands: Store['command'] = undefined
  private events: Store['event'] = undefined

  constructor(store: Store) {
    this.state = store.query
    this.events = store.event

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
    this.state = store.query
    this.events = store.event

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

  getState() {
    return this.state
  }

  getCommands() {
    return this.memoizedCommands
  }

  getEvents() {
    return this.events
  }
}
