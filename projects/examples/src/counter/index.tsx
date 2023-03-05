import React, { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { CounterApp } from './Counter'

const Root = () => {
  return (
    <div>
      <CounterApp />
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
