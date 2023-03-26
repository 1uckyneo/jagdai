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

    const onUpdate = useEvent<number>()

    const update = (value: number) => {
      setCount(value)

      if (count !== value) {
        onUpdate(value)
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
        onUpdate,
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
    const onUpdateListener = jest.fn()

    const Count: FC = () => {
      const count = useCounterQuery((query) => query.count)
      return <div>count: {count}</div>
    }

    const Controls: FC = () => {
      useCounterEvent('onUpdate', onUpdateListener)

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

    expect(onUpdateListener).toHaveBeenCalledTimes(1)
    expect(onUpdateListener).toHaveBeenCalledWith(1)

    fireEvent.click(updateToOneBtn)

    expect(onUpdateListener).not.toHaveBeenCalledTimes(2)

    fireEvent.click(increaseBtn)

    expect(onUpdateListener).toHaveBeenCalledTimes(2)
    expect(onUpdateListener).toHaveBeenCalledWith(2)
  })

  it('event can subscribed by many', async () => {
    const onUpdateListener1 = jest.fn()
    const onUpdateListener2 = jest.fn()

    const Count: FC = () => {
      const count = useCounterQuery((query) => query.count)

      useCounterEvent('onUpdate', onUpdateListener1)

      return <div>count: {count}</div>
    }

    const Controls: FC = () => {
      const { increase } = useCounterCommand()

      useCounterEvent('onUpdate', onUpdateListener2)

      return <button onClick={increase}>increase</button>
    }

    const { getByText } = render(
      <CounterStore>
        <Count />
        <Controls />
      </CounterStore>,
    )

    fireEvent.click(getByText('increase'))

    expect(onUpdateListener1).toHaveBeenCalledTimes(1)
    expect(onUpdateListener1).toHaveBeenCalledWith(1)
    expect(onUpdateListener2).toHaveBeenCalledWith(1)
    expect(onUpdateListener2).toHaveBeenCalledWith(1)
  })

  it('event can subscribed within store', async () => {
    const onIncreasedListener1 = jest.fn<void, number[]>()
    const onIncreasedListener2 = jest.fn()

    const {
      Store: CounterStore,
      useStoreCommand: useCounterCommand,
      useStoreEvent: useCounterEvent,
    } = create(() => {
      const [count, setCount] = useState(0)

      const onIncreased = useEvent(onIncreasedListener1)

      const increase = () => {
        setCount(count + 1)
        onIncreased(count + 1)
      }

      return {
        command: {
          increase,
        },
        event: {
          onIncreased,
        },
      }
    })

    const Controls: FC = () => {
      const { increase } = useCounterCommand()

      useCounterEvent('onIncreased', onIncreasedListener2)

      return <button onClick={increase}>increase</button>
    }

    const { getByText } = render(
      <CounterStore>
        <Controls />
      </CounterStore>,
    )

    fireEvent.click(getByText('increase'))
    fireEvent.click(getByText('increase'))
    fireEvent.click(getByText('increase'))

    expect(onIncreasedListener1).toHaveBeenCalledTimes(3)
    expect(onIncreasedListener1).toHaveBeenCalledWith(3)
    expect(onIncreasedListener2).toHaveBeenCalledWith(3)
    expect(onIncreasedListener2).toHaveBeenCalledWith(3)
  })
})
