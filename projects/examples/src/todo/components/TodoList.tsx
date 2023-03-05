import React from 'react'
import { useTodoQuery } from '../store'
import { Todo } from './Todo'

export const TodoList: React.FC = () => {
  const todos = useTodoQuery((query) => query.todos)

  return (
    <ul className="todo-list">
      {todos && todos.length
        ? todos.map((todo, index) => {
            return <Todo key={`todo-${todo.id}`} todo={todo} />
          })
        : 'No todos, yay!'}
    </ul>
  )
}
