import './App.css'
import { Suspense } from 'react'
import Navbar from './components/layout/navbar'
import Footer from './components/layout/footer'
import GlobalLoader from './components/ui/globalLoader'
import AppRoutes from './routes/app-routes'

function App() {
  return (
    <Suspense fallback={<GlobalLoader />}>
    <div className="flex flex-col min-h-svh bg-background text-text-base">
      <Navbar />
      <main className="grow">
        <AppRoutes />
      </main>
      <Footer />
    </div>
    </Suspense>
  )
}

export default App
