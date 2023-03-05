import * as ReactDOMClient from 'react-dom/client'

const manager = document.getElementById('root')

if (manager) {
  const root = ReactDOMClient.createRoot(manager)

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
