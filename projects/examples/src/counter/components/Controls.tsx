import { CounterStore } from '../store'

export const Controls = () => {
  /**
   * useCountCommand(useStoreCommand) hook will never cause re-render
   * but functions returns from it will remain latest
   */
  const { increase, decrease, reset } = CounterStore.useCommand()

  CounterStore.useEvent('onOdd', (value) => {
    console.log(`The count ${value} is odd now, subscribed from <Controls />`)
  })

  CounterStore.useEvent('onResetFail', (msg) => {
    alert(msg)
  })

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '8px',
      }}>
      <button onClick={increase}>+</button>
      <button onClick={decrease} style={{ marginLeft: 12 }}>
        -
      </button>
      <button onClick={reset} style={{ marginLeft: 12 }}>
        reset
      </button>
    </div>
  )
}
