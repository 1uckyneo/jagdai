import { useCounterQuery, useCounterEvent } from '../store/index'

export const Count = () => {
  // only re-render when count change
  const count = useCounterQuery((query) => query.count)

  useCounterEvent('onResetFail', (msg) => {
    console.log(`${msg}, subscribed from <Count />`)
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
