import { useState, useEffect } from 'react'
import { create, useStoreEvent } from 'jagdai'

function isEven(num: number): boolean {
  return num % 2 === 0
}

export const {
  Store: CountStore,
  useQuery: useCounterQuery,
  useCommand: useCounterCommand,
  useEvent: useCounterEvent,
} = create(() => {
  const [count, setCount] = useState(0)

  const resetUseless = useStoreEvent<string>()

  const even = useStoreEvent<number>()

  const increase = () => {
    setCount(count + 1)
  }

  useEffect(() => {
    if (isEven(count)) {
      even(count)
    }
  }, [count])

  const decrease = () => {
    setCount(count - 1)
  }

  const reset = () => {
    setCount(0)

    if (count === 0) {
      resetUseless('The count is already 0')
    }
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
      even,
      resetUseless,
    },
  }
})
