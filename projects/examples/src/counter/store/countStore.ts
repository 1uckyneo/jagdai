import { useState } from 'react'
import { create, useJagdaiEvent } from 'jagdai'

export const {
  Store: CountStore,
  useQuery: useCountQuery,
  useCommand: useCountCommand,
  useEvent: useCountEvent,
} = create(() => {
  const [count, setCount] = useState(0)

  const [increaseEvent, emitIncreaseEvent] = useJagdaiEvent<string>()

  const increase = () => {
    const nextCount = count + 1
    setCount(nextCount)
    emitIncreaseEvent(`count state increased from ${count} to ${nextCount}`)
  }

  const decrease = () => {
    setCount(count - 1)
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
      increaseEvent
    }
  }
})
