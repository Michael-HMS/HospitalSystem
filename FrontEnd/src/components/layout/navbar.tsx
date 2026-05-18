import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";
import Button from "../ui/button";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { 
  TiHome, 
  TiCalendar, 
  TiDocumentText, 
  TiGroup,
  TiFolderOpen
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
  const isRtl = i18n.language === "ar";

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
      visible: !role
    },
    {
      name: t("Doctors"),
      path: "/doctors",
      icon: <TiGroup className="w-4 h-4" />,
      visible: !role
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
      icon: <TiDocumentText className="w-4 h-4" />,
      visible: role === "patient"
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
        <div className="hidden md:flex items-center gap-1">
          {navigationRoutes
            .filter((route) => route.visible)
            .map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate dark:text-gray-300 hover:bg-slate/5 dark:hover:bg-gray-800 hover:text-primary transition-all"
              >
                {route.icon}
                <span>{route.name}</span>
              </Link>
            ))}
        </div>
      </div>
      
      {/* Utilities Action Controls */}
      <div className="flex items-center gap-3">
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
    </nav>
  );
}