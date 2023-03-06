import { useCountCommand, useCountEvent } from '../store/index'

export const Controls = () => {
  /**
   * useCountCommand(useCommand) hook will never cause re-render
   * but functions returns from it will remain latest
   */
  const { increase, decrease, reset } = useCountCommand()

  useCountEvent((event) => event.increaseEvent((arg) => {
    console.log(arg)
  }))

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
