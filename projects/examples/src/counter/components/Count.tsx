import { useCounterQuery, useCounterEvent } from '../store/index'

export const Count = () => {
  // only re-render when count change
  const count = useCounterQuery((query) => query.count)

  useCounterEvent('resetFail', (msg) => {
    console.log(`${msg}. Subscribed from <Count />`)
  })

  return (
    <div
      style={{
        textAlign: 'center',
      }}>
      {count}
    </div>
  )
}
