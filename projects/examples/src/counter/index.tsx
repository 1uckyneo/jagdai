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

const container = document.getElementById('root')

if (container) {
  const root = ReactDOMClient.createRoot(container)

  root.render(
    <StrictMode>
      <Root />
    </StrictMode>,
  )
}
