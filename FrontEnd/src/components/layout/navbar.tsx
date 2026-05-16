import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";
import Button from "../ui/button";
import { useTranslation } from "react-i18next";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const { t } = useTranslation();
    return (
        <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
                {t("hospitalName")}
            </span>
            
            <div className="flex items-center gap-4">
                {/* Language Switcher */}
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="p-1.5 border rounded bg-transparent text-gray-900 dark:text-white"
                >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                </select>

                {/* Theme Toggle Button using your Custom UI Button */}
                <Button variant="secondary" size="small" onClick={toggleTheme}>
                    {theme === "light" ? t("darkMode") : t("lightMode")}
                </Button>
            </div>
        </nav>
    );
}