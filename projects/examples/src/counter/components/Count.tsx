import { useCountQuery, useCountEvent } from '../store/index'

export const Count = () => {
  // only re-render when count change
  const count = useCountQuery((query) => query.count)

  return (
    <div
      style={{
        textAlign: 'center',
      }}>
      {count}
    </div>
  )
}
