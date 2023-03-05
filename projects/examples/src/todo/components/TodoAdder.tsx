import React, { useState } from 'react'
import { useTodoCommand } from '../store'

export const TodoAdder: React.FC = () => {
  const { addTodo } = useTodoCommand()
  const [input, setInput] = useState('')

  function handleAddTodo() {
    addTodo(input)
    setInput('')
  }

  return (
    <div>
      <input onChange={(e) => setInput(e.target.value)} value={input} />
      <button className="add-todo" onClick={handleAddTodo}>
        Add Todo
      </button>
    </div>
  )
}
