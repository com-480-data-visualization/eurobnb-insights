import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout'
import Paris from './pages/paris'
import Amsterdam from './pages/Amsterdam'

const router = createBrowserRouter([
  {
    path: '/eurobnb-insight-app',
    element: <Layout />,
  },
  {
    path: '/paris',
    element: <Paris />,
  },
  {
    path: "/amsterdam",
    element: <Amsterdam />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)