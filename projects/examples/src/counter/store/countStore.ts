import { useState } from 'react'
import { create } from 'jagdai'

export const {
  Store: CountStore,
  useQuery: useCountQuery,
  useCommand: useCountCommand,
} = create(() => {
  const [count, setCount] = useState(0)

  const increase = () => {
    setCount(count + 1)
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
  }
})
