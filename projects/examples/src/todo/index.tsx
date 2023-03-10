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

const container = document.getElementById('root')

if (container) {
  const root = ReactDOMClient.createRoot(container)

  root.render(
    <StrictMode>
      <Root />
    </StrictMode>,
  )
}
