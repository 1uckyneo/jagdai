import { useState, useEffect } from 'react'
import { create, useStoreEvent } from 'jagdai'

function isEven(num: number): boolean {
  return num % 2 === 0
}

export const {
  Store: CounterStore,
  useQuery: useCounterQuery,
  useCommand: useCounterCommand,
  useEvent: useCounterEvent,
} = create(() => {
  const [count, setCount] = useState(0)

  const increase = () => {
    setCount(count + 1)
  }

  const decrease = () => {
    setCount(count - 1)
  }

  const resetFail = useStoreEvent<string>()

  const reset = () => {
    setCount(0)

    if (count === 0) {
      resetFail('The count is already 0')
    }
  }

  const even = useStoreEvent<number>()

  useEffect(() => {
    if (isEven(count)) {
      even(count)
    }
  }, [count])

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
      resetFail,
    },
  }
})
