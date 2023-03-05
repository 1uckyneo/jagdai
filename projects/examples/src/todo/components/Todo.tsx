import React from 'react'
import { useTodoCommand, Todo as TodoType } from '../store'

export const Todo: React.FC<{ todo: TodoType }> = ({ todo }) => {
  const toggleTodo = useTodoCommand((command) => command.toggleTodo)

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
