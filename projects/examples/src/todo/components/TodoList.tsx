import React from 'react'
import { TodoStore } from '../store'
import { Todo } from './Todo'

export const TodoList: React.FC = () => {
  const todos = TodoStore.useQuery((query) => query.todos)

  return (
    <ul className="todo-list">
      {todos && todos.length
        ? todos.map((todo) => {
            return <Todo key={`todo-${todo.id}`} todo={todo} />
          })
        : 'No todos, yay!'}
    </ul>
  )
}
