import { StoreManager } from './storeManager'
import type { Selector, StoreShape } from './types'

export function useCommandSelector<
  Store extends StoreShape,
  Selection = Store['command'],
>(
  manager: StoreManager<Store>,
  selector?: Selector<Store['command'], Selection>,
) {
  const commands = manager.getCommands()

  if (selector) {
    return selector(commands)
  }

  return commands as Selection
}
