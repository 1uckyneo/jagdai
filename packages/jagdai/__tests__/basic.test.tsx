import type { FC } from 'react'
import { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'

import { create, useEvent } from '../src'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore config react testing environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('basic', () => {
  const {
    Store: CounterStore,
    useStoreQuery: useCounterQuery,
    useStoreCommand: useCounterCommand,
    useStoreEvent: useCounterEvent,
  } = create(() => {
    const [count, setCount] = useState(0)

    const countChange = useEvent<number>()

    const update = (value: number) => {
      setCount(value)

      if (count !== value) {
        countChange(value)
      }
    }

    const increase = () => {
      update(count + 1)
    }

    return {
      query: {
        count,
      },
      command: {
        update,
        increase,
      },
      event: {
        countChange,
      },
    }
  })

  it('query and command should works', async () => {
    const Count: FC = () => {
      const count = useCounterQuery((query) => query.count)
      return <div data-testid={'count'}>count: {count}</div>
    }

    const Controls: FC = () => {
      const { increase } = useCounterCommand()

      return <button onClick={increase}>increase</button>
    }

    const { findByText, getByText } = render(
      <CounterStore>
        <Count />
        <Controls />
      </CounterStore>,
    )

    fireEvent.click(getByText('increase'))

    await findByText('count: 1')
  })

  it('useStoreCommand should not cause re-render but remain latest command', async () => {
    const controlsRenderSpy = jest.fn()
    const countRenderSpy = jest.fn()

    const Count: FC = () => {
      const count = useCounterQuery((query) => query.count)

      countRenderSpy()

      return <div>count: {count}</div>
    }

    const Controls: FC = () => {
      const { increase } = useCounterCommand()

      controlsRenderSpy()

      return <button onClick={increase}>increase</button>
    }

    const { findByText, getByText } = render(
      <CounterStore>
        <Count />
        <Controls />
      </CounterStore>,
    )

    fireEvent.click(getByText('increase'))
    fireEvent.click(getByText('increase'))

    expect(controlsRenderSpy).toHaveBeenCalledTimes(1)
    expect(countRenderSpy).toHaveBeenCalledTimes(3)
    await findByText('count: 2')
  })

  it('event listener should only called when event emitted', async () => {
    const countChangeEventListener = jest.fn()

    const Count: FC = () => {
      const count = useCounterQuery((query) => query.count)
      return <div>count: {count}</div>
    }

    const Controls: FC = () => {
      useCounterEvent('countChange', countChangeEventListener)

      const { increase, update } = useCounterCommand()

      return (
        <div>
          <button onClick={increase}>increase</button>
          <button onClick={() => update(1)}>update count to 1</button>
        </div>
      )
    }

    const { getByText } = render(
      <CounterStore>
        <Count />
        <Controls />
      </CounterStore>,
    )

    const updateToOneBtn = getByText('update count to 1')
    const increaseBtn = getByText('increase')

    fireEvent.click(updateToOneBtn)

    expect(countChangeEventListener).toHaveBeenCalledTimes(1)
    expect(countChangeEventListener).toHaveBeenCalledWith(1)

    fireEvent.click(updateToOneBtn)

    expect(countChangeEventListener).not.toHaveBeenCalledTimes(2)

    fireEvent.click(increaseBtn)

    expect(countChangeEventListener).toHaveBeenCalledTimes(2)
    expect(countChangeEventListener).toHaveBeenCalledWith(2)
  })

  it('event can subscribed by many', async () => {
    const countChangeEventListener1 = jest.fn()
    const countChangeEventListener2 = jest.fn()

    const Count: FC = () => {
      const count = useCounterQuery((query) => query.count)

      useCounterEvent('countChange', countChangeEventListener1)

      return <div>count: {count}</div>
    }

    const Controls: FC = () => {
      const { increase } = useCounterCommand()

      useCounterEvent('countChange', countChangeEventListener2)

      return <button onClick={increase}>increase</button>
    }

    const { getByText } = render(
      <CounterStore>
        <Count />
        <Controls />
      </CounterStore>,
    )

    fireEvent.click(getByText('increase'))

    expect(countChangeEventListener1).toHaveBeenCalledTimes(1)
    expect(countChangeEventListener1).toHaveBeenCalledWith(1)
    expect(countChangeEventListener2).toHaveBeenCalledWith(1)
    expect(countChangeEventListener2).toHaveBeenCalledWith(1)
  })
})
