import { StoreManager } from './storeManager'
import type { Query, StoreShape } from './types'

export function useCommandSelector<Store extends StoreShape, Selection>(
  manager: StoreManager<Store>,
  query?: Query<Store['command'], Selection>,
) {
  const commands = manager.getCommands()

  if (query) {
    return query(commands)
  }

  return commands
}
