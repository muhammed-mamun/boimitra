import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layouts/Layout'
import Categories from './components/Categories'
import Hero from './components/Hero'
import PopularBooks from './components/Popularbooks'
import BooksPage from './pages/BooksPage'
import ErrorPage from './pages/ErrorPage'

function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <PopularBooks />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'books', element: <BooksPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
