import { create } from 'jagdai'
import { useRef, useState, useMemo } from 'react'

export type Todo = {
  id: number
  content: string
  completed: boolean
}

type Filter = 'all' | 'incomplete' | 'completed'

export const {
  Store: TodoStore,
  useQuery: useTodoQuery,
  useCommand: useTodoCommand,
} = create(() => {
  const nextTodoIdRef = useRef(0)
  const [todos, setTodos] = useState<Todo[]>([])

  function addTodo(content: string) {
    setTodos(
      todos.concat([
        {
          id: nextTodoIdRef.current,
          content,
          completed: false,
        },
      ]),
    )
    nextTodoIdRef.current++
  }

  function toggleTodo(id: number) {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          }
        }

        return todo
      }),
    )
  }

  const [filter, setFilter] = useState<Filter>('all')

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'all':
        return todos
      case 'completed':
        return todos.filter((todo) => todo.completed)
      case 'incomplete':
        return todos.filter((todo) => !todo.completed)
    }
  }, [todos, filter])

  const updateFilter = (filter: Filter) => {
    setFilter(filter)
  }

  return {
    query: {
      todos: filteredTodos,
      filter,
    },
    command: {
      addTodo,
      toggleTodo,
      updateFilter,
    },
  }
})
