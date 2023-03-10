import { Store } from './store'
import type { Selector, StoreDefinition } from './jagdai'

export function useCommandSelector<
  T extends StoreDefinition,
  Selection = T['command'],
>(store: Store<T>, selector?: Selector<T['command'], Selection>) {
  const commands = store.getCommands()

  if (selector) {
    return selector(commands)
  }

  return commands as Selection
}
