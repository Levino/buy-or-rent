import * as React from 'react'
import { render } from 'react-dom'

import App from './App'

export const renderApp = () => render(<App />, document.getElementById('root'))

renderApp()
