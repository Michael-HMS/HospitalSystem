import { createContext, useEffect, useState } from "react";
import i18n from "../i18n";

type Language = "en" | "ar";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem("lang") as Language) || "en";
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("lang", lang);
        i18n.changeLanguage(lang)
    };
    useEffect(() => {
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }, [language]);
    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}