import { useCreation } from './useCreation'
import type { Subscriber, Event } from './types'

class EventManager<Arg> {
  private subscribers = new Set<Subscriber<Arg>>()

  readonly emit = (arg: Arg) => {
    for (const subscriber of this.subscribers) {
      subscriber(arg)
    }
  }

  readonly event: Event<Arg> = (subscriber) => {
    this.subscribers.add(subscriber)
    return () => {
      this.subscribers.delete(subscriber)
    }
  }
}

export const useJagdaiEvent = <Arg>() => {
  const manager = useCreation(() => new EventManager<Arg>())

  return [manager.event, manager.emit] as const
}
