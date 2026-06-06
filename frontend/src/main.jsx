import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { queryClient } from '@/lib/queryClient'

import './index.css'

import { routeTree } from './routeTree.gen'

const router = createRouter({ 
  routeTree,
  context: {
    queryClient,
  }
})

const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

