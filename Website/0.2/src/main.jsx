import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout'
import Paris from './pages/paris'
import Amsterdam from './pages/Amsterdam'
import Athens from './pages/Athens'
import Barcelona from './pages/Barcelona'
import Berlin from './pages/Berlin'
import Budapest from './pages/Budapest'


const router = createBrowserRouter([
  {
    path: '/eurobnb-insights',
    element: <Layout />,
  },
  {
    path: '/paris',
    element: <Paris />,
  },
  {
    path: "/eurobnb-insights/amsterdam",
    element: <Amsterdam />,
  },
  {
    path: "/eurobnb-insights/athens",
    element: <Athens />,
  },
  {
    path: "/eurobnb-insights/barcelona",
    element: <Barcelona />,
  },
  {
    path: "/eurobnb-insights/berlin",
    element: <Berlin />,
  },
  {
    path: "/eurobnb-insights/budapest",
    element: <Budapest />,
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)