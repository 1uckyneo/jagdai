import { TodoStore } from './store'
import { TodoAdder, TodoList, Filter } from './components'

import './index.css'

export const TodoApp = () => {
  return (
    <div>
      <h2>Todo</h2>
      <TodoStore>
        <TodoAdder />
        <TodoList />
        <Filter />
      </TodoStore>
    </div>
  )
}
