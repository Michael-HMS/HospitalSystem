import { Link, useLocation } from "react-router-dom";
import { TiChevronRight, TiHome } from "react-icons/ti";
import { useTranslation } from "react-i18next";

export default function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation();
  
  // Don't show breadcrumbs on home/landing pages
  if (location.pathname === "/" || location.pathname === "/home") {
    return null;
  }

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="breadcrumb" className="py-3 px-4 md:px-8 border-b border-slate/10 bg-white/50 dark:bg-gray-900/50">
      <ol className="flex items-center space-x-2 text-xs font-medium text-slate dark:text-gray-400">
        <li>
          <Link to="/" className="flex items-center hover:text-primary transition-colors">
            <TiHome className="w-4 h-4" />
          </Link>
        </li>
        
        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          
          // Format the value to be more readable (e.g., 'book-appointment' -> 'Book Appointment')
          const formattedValue = value
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <li key={to} className="flex items-center">
              <TiChevronRight className="w-4 h-4 text-slate/40 mx-1" />
              {isLast ? (
                <span className="text-text-base font-semibold" aria-current="page">
                  {t(formattedValue)}
                </span>
              ) : (
                <Link to={to} className="hover:text-primary transition-colors">
                  {t(formattedValue)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
