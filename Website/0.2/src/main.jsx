import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout'
import Paris from './pages/Paris'
import Amsterdam from './pages/Amsterdam'
import Athens from './pages/Athens'
import Barcelona from './pages/Barcelona'
import Berlin from './pages/Berlin'
import Budapest from './pages/Budapest'
import Lisbon from './pages/Lisbon'
import London from './pages/London'
import Rome from './pages/Rome'
import Vienna from './pages/Vienna'


const router = createBrowserRouter([
  {
    path: '/eurobnb-insights',
    element: <Layout />,
  },
  {
    path: '/eurobnb-insights/paris',
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
  {
    path: "/eurobnb-insights/lisbon",
    element: <Lisbon />,
  },
  {
    path: "/eurobnb-insights/london",
    element: <London />,
  },
  {
    path: "/eurobnb-insights/rome",
    element: <Rome />,
  },
  {
    path: "/eurobnb-insights/vienna",
    element: <Vienna />,
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)