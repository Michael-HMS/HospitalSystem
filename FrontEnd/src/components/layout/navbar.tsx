import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";
import Button from "../ui/button";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  TiHome, 
  TiCalendar, 
  TiDocumentText, 
  TiGroup,
  TiFolderOpen,
  TiThMenu,
  TiUser
} from "react-icons/ti";

interface NavbarProps {
  role?: "admin" | "doctor" | "patient" | null; // El role elly gyalk mn el Auth context walla el session
  onLogout?: () => void;
}

export default function Navbar({ role = null, onLogout }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isRtl = i18n.language === "ar";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation array matches strictly your AppRoutes architecture
  const navigationRoutes = [
    // --- Public Routes (Htzhr low el user mesh 3aml login lsa) ---
    {
      name: t("Home"),
      path: "/home",
      icon: <TiHome className="w-4 h-4" />,
      visible: !role
    },
    {
      name: t("Departments"),
      path: "/departments",
      icon: <TiFolderOpen className="w-4 h-4" />,
      visible: !role || role === "patient"
    },
    {
      name: t("Doctors"),
      path: "/doctors",
      icon: <TiGroup className="w-4 h-4" />,
      visible: !role || role === "patient"
    },

    // --- Patient Routes ---
    {
      name: t("Dashboard"),
      path: "/home",
      icon: <TiHome className="w-4 h-4" />,
      visible: role === "patient"
    },
    {
      name: t("Book Appointment"),
      path: "/book-appointment",
      icon: <TiCalendar className="w-4 h-4" />,
      visible: role === "patient"
    },
    {
      name: t("My Appointments"),
      path: "/appointments",
      icon: <TiCalendar className="w-4 h-4" />,
      visible: role === "patient"
    },
    {
      name: t("Medical Records"),
      path: "/medical-records",
      icon: <TiDocumentText className="w-4 h-4" />,
      visible: role === "patient"
    },
    {
      name: t("Record Intake"),
      path: "/medical-record-entry",
      icon: <TiDocumentText className="w-4 h-4" />,
      visible: role === "patient"
    },
    {
      name: t("Bills"),
      path: "/bills",
      icon: <TiDocumentText className="w-4 h-4" />,
      visible: role === "patient"
    },
    {
      name: t("Profile"),
      path: "/profile",
      icon: <TiUser className="w-4 h-4" />,
      visible: role === "patient" || role === "doctor"
    },

    // --- Doctor Routes ---
    {
      name: t("Dashboard"),
      path: "/home",
      icon: <TiHome className="w-4 h-4" />,
      visible: role === "doctor"
    },
    {
      name: t("Doctor Appointments"),
      path: "/doctor-appointments",
      icon: <TiCalendar className="w-4 h-4" />,
      visible: role === "doctor"
    },
    {
      name: t("Patients List"),
      path: "/patients",
      icon: <TiGroup className="w-4 h-4" />,
      visible: role === "doctor"
    },
    {
      name: t("Departments"),
      path: "/departments",
      icon: <TiFolderOpen className="w-4 h-4" />,
      visible: role === "doctor"
    },
    {
      name: t("Doctors"),
      path: "/doctors",
      icon: <TiGroup className="w-4 h-4" />,
      visible: role === "doctor"
    },

    // --- Admin Routes (Nested paths match exactly /admin/path) ---
    {
      name: t("Admin Dashboard"),
      path: "/admin",
      icon: <TiHome className="w-4 h-4" />,
      visible: role === "admin"
    },
    {
      name: t("Manage Medications"),
      path: "/admin/medications",
      icon: <TiDocumentText className="w-4 h-4" />,
      visible: role === "admin"
    },
    {
      name: t("Manage Users"),
      path: "/admin/users",
      icon: <TiGroup className="w-4 h-4" />,
      visible: role === "admin"
    }
  ];

  return (
    <nav 
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-slate/10 dark:border-gray-800 transition-colors text-text-base"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:opacity-90">
          {t("hospitalName")}
        </Link>

        {/* Dynamic Navigation Links based on role guard filtering */}
        <div className="hidden lg:flex items-center gap-1">
          {navigationRoutes
            .filter((route) => route.visible)
            .map((route) => {
              const isActive = location.pathname.startsWith(route.path) && route.path !== "/";
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate dark:text-gray-300 hover:bg-slate/5 dark:hover:bg-gray-800 hover:text-primary"
                  }`}
                >
                  {route.icon}
                  <span>{route.name}</span>
                </Link>
              );
            })}
        </div>
      </div>
      
      {/* Utilities Action Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button 
          className="lg:hidden p-1.5 text-slate dark:text-gray-300 hover:bg-slate/5 dark:hover:bg-gray-800 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <TiThMenu className="w-5 h-5" />
        </button>
        {/* Language dropdown switcher */}
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as any)}
          className="p-1.5 text-xs font-semibold border border-slate/20 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none cursor-pointer"
        >
          <option value="en" className="dark:bg-gray-900">EN</option>
          <option value="ar" className="dark:bg-gray-900">AR</option>
        </select>

        {/* Theme button toggle */}
        <Button variant="secondary" size="small" onClick={toggleTheme}>
          {theme === "light" ? t("darkMode") : t("lightMode")}
        </Button>

        {/* Auth status trigger */}
        {role ? (
          <Button 
            variant="primary" 
            size="small" 
            onClick={onLogout ? onLogout : () => navigate("/auth")}
          >
            {t("Logout")}
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="small" 
            onClick={() => navigate("/auth")}
          >
            {t("Login")}
          </Button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-[73px] left-0 right-0 bg-white dark:bg-gray-900 border-b border-slate/10 dark:border-gray-800 shadow-lg p-4 flex flex-col gap-2 z-50 lg:hidden">
          {navigationRoutes
            .filter((route) => route.visible)
            .map((route) => {
              const isActive = location.pathname.startsWith(route.path);
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate dark:text-gray-300 hover:bg-slate/5 dark:hover:bg-gray-800"
                  }`}
                >
                  {route.icon}
                  <span>{route.name}</span>
                </Link>
              );
            })}
        </div>
      )}
    </nav>
  );
}