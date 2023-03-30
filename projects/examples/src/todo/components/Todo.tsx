import React from 'react'
import { TodoStore, Todo as TodoType } from '../store'

export const Todo: React.FC<{ todo: TodoType }> = ({ todo }) => {
  const { toggleTodo } = TodoStore.useCommand()

  const handleClick = () => toggleTodo(todo.id)

  return (
    <li className="todo-item" onClick={handleClick}>
      {todo && todo.completed ? '👌' : '👋'}{' '}
      <span
        className={`todo-item__text ${
          todo && todo.completed && 'todo-item__text--completed'
        }`}>
        {todo.content}
      </span>
    </li>
  )
}
