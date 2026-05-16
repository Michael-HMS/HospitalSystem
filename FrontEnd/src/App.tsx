import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/app-routes'
import Navbar from './components/layout/navbar'
import Footer from './components/layout/footer'

function App() {
  return (
    <div className="flex flex-col min-h-svh bg-background text-text-base">
      <Navbar />
      <main className="grow">
        <RouterProvider router={router} />
      </main>
      <Footer />
    </div>
  )
}

export default App
