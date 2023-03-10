import { useState } from 'react'
import { create, useStoreEvent } from 'jagdai'

export const {
  Store: CountStore,
  useQuery: useCountQuery,
  useCommand: useCountCommand,
  useEvent: useCountEvent,
} = create(() => {
  const [count, setCount] = useState(0)

  const increaseEvent = useStoreEvent<string>()
  const decreaseEvent = useStoreEvent<number>()

  const increase = () => {
    const nextCount = count + 1
    setCount(nextCount)
    increaseEvent(`count state increased from ${count} to ${nextCount}`)
  }

  const decrease = () => {
    const nextCount = count - 1
    setCount(nextCount)
  }

  const reset = () => {
    setCount(0)
  }

  return {
    query: {
      count,
    },
    command: {
      increase,
      decrease,
      reset,
    },
    event: {
      increaseEvent,
      decreaseEvent,
    },
  }
})
