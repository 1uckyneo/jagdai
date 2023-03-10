import type { StoreDefinition } from './jagdai'

type Listener = () => void

export class Store<T extends StoreDefinition> {
  private state: T['query']
  queryListeners = new Set<Listener>()
  private commands: T['command'] = undefined
  private memoizedCommands: T['command'] = undefined
  private events: T['event'] = undefined

  constructor(snapshot: T) {
    this.state = snapshot.query
    this.events = snapshot.event

    if (snapshot.command) {
      this.memoizedCommands = {} as NonNullable<T['command']>
      this.commands = snapshot.command

      for (const key in this.commands) {
        this.memoizedCommands[key] = (...arg) => {
          return this.commands![key](...arg)
        }
      }
    }
  }

  update(snapshot: T) {
    this.state = snapshot.query
    this.commands = snapshot.command
    this.events = snapshot.event
  }

  notifyQuery() {
    for (const listener of this.queryListeners) {
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
