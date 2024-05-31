import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from "./routes"

const router = createBrowserRouter(routes as RouteObject[]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
