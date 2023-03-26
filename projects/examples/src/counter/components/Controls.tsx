import { useCounterCommand, useCounterEvent } from '../store/index'

export const Controls = () => {
  /**
   * useCountCommand(useStoreCommand) hook will never cause re-render
   * but functions returns from it will remain latest
   */
  const { increase, decrease, reset } = useCounterCommand()

  useCounterEvent('onEven', (count) => {
    console.log(`The count ${count} is onEven now`)
  })

  useCounterEvent('onResetFail', (msg) => {
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
