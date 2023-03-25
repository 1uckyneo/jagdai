import { useState, useEffect } from 'react'
import { create, useEvent } from 'jagdai'

function isEven(num: number): boolean {
  return num % 2 === 0
}

export const {
  Store: CounterStore,
  useStoreQuery: useCounterQuery,
  useStoreCommand: useCounterCommand,
  useStoreEvent: useCounterEvent,
} = create(() => {
  const [count, setCount] = useState(0)

  const increase = () => {
    setCount(count + 1)
  }

  const decrease = () => {
    setCount(count - 1)
  }

  const resetFail = useEvent<string>()

  const reset = () => {
    setCount(0)

    if (count === 0) {
      resetFail('The count is already 0')
    }
  }

  const even = useEvent<number>()

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
