import * as ReactDOMClient from 'react-dom/client'

const container = document.getElementById('root')

if (container) {
  const root = ReactDOMClient.createRoot(container)

  root.render(
    <ul>
      <li>
        <a href={`${import.meta.env.BASE_URL}counter/index.html`}>counter</a>
      </li>
      <li>
        <a href={`${import.meta.env.BASE_URL}todo/index.html`}>todo</a>
      </li>
    </ul>,
  )
}
