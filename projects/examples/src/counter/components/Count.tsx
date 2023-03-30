import { CounterStore } from '../store/index'

export const Count = () => {
  // only re-render when count change
  const count = CounterStore.useQuery((query) => query.count)

  CounterStore.useEvent('onResetFail', (msg) => {
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
