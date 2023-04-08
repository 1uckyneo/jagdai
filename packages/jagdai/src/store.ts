import type { StoreDefinition } from './jagdai'

export class Store<T extends StoreDefinition> {
  private query: T['query']
  private queryListeners = new Set<() => void>()
  private command: T['command'] = undefined
  private memoizedCommand: T['command'] = undefined
  private event: T['event'] = undefined

  constructor(snapshot: T) {
    this.query = snapshot.query
    this.event = snapshot.event

    if (snapshot.command) {
      this.memoizedCommand = {} as NonNullable<T['command']>
      this.command = snapshot.command

      for (const key in this.command) {
        this.memoizedCommand[key] = (...arg) => {
          return this.command![key](...arg)
        }
      }
    }
  }

  update(snapshot: T) {
    this.query = snapshot.query
    this.command = snapshot.command
    this.event = snapshot.event
  }

  notifyQuery() {
    for (const listener of this.queryListeners) {
      listener()
    }
  }

  subscribeQuery = (triggerUpdate: () => void) => {
    this.queryListeners.add(triggerUpdate)

    return () => {
      this.queryListeners.delete(triggerUpdate)
    }
  }

  getQuery = () => {
    return this.query
  }

  getCommand() {
    return this.memoizedCommand
  }

  getEvent() {
    return this.event
  }
}
