import { useState, useEffect } from 'react'
import { create, useEvent } from 'jagdai'

function isOdd(num: number): boolean {
  return num % 2 !== 0
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

  const onResetFail = useEvent<string>()

  const reset = () => {
    setCount(0)

    if (count === 0) {
      onResetFail('The count is already 0')
    }
  }

  const onOdd = useEvent((value: number) => {
    console.log(`The count ${value} is odd now, subscribed within CounterStore`)
  })

  useEffect(() => {
    if (isOdd(count)) {
      onOdd(count)
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
      onOdd,
      onResetFail,
    },
  }
})
