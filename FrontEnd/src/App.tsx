import './App.css'
import { Suspense, useEffect, useState } from 'react'
import Navbar from './components/layout/navbar'
import Footer from './components/layout/footer'
import GlobalLoader from './components/ui/globalLoader'
import Breadcrumbs from './components/ui/breadcrumbs'
import ErrorBoundary from './components/ui/errorBoundary'
import AppRoutes from './routes/app-routes'
import { AuthService } from './services/auth-service'
import { useLocation } from 'react-router-dom'

function App() {
  const [role, setRole] = useState<"admin" | "doctor" | "patient" | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Re-check role on route changes
    const currentRole = AuthService.getRole() as "admin" | "doctor" | "patient" | null;
    setRole(currentRole);
  }, [location.pathname]);

  const handleLogout = () => {
    AuthService.logout();
    setRole(null);
    window.location.href = "/auth";
  };

  return (
    <Suspense fallback={<GlobalLoader />}>
    <div className="flex flex-col min-h-svh bg-background text-text-base">
      <Navbar role={role} onLogout={handleLogout} />
      <Breadcrumbs />
      <main className="grow">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
    </Suspense>
  )
}

export default App
