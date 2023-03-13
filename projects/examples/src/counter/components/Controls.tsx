import { useCounterCommand, useCounterEvent } from '../store/index'

export const Controls = () => {
  /**
   * useCountCommand(useCommand) hook will never cause re-render
   * but functions returns from it will remain latest
   */
  const { increase, decrease, reset } = useCounterCommand()

  useCounterEvent('even', (count) => {
    console.log(`The count ${count} is even now`)
  })

  useCounterEvent('resetUseless', (msg) => {
    console.log(`${msg}. The event subscribed from <Controls />`)
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
