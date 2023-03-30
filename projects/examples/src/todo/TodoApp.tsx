import { TodoStore } from './store'
import { TodoAdder, TodoList, Filter } from './components'

import './index.css'

export const TodoApp = () => {
  return (
    <div>
      <h2>Todo</h2>
      <TodoStore.Provider>
        <TodoAdder />
        <TodoList />
        <Filter />
      </TodoStore.Provider>
    </div>
  )
}
