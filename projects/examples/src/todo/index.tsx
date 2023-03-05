import React, { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { TodoApp } from './TodoApp'

const Root = () => {
  return (
    <div>
      <TodoApp />
    </div>
  )
}

const manager = document.getElementById('root')

if (manager) {
  const root = ReactDOMClient.createRoot(manager)

  root.render(
    <StrictMode>
      <Root />
    </StrictMode>,
  )
}
