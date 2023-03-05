import { CountStore } from './store'
import { Count, Controls } from './components'

export const CounterApp = () => {
  return (
    <div
      style={{
        width: 400,
        border: '1px solid #eaeaea',
        boxSizing: 'border-box',
        padding: 30,
        margin: 30,
      }}>
      <h2>Counter</h2>
      <CountStore>
        <Count />
        <Controls />
      </CountStore>
    </div>
  )
}
