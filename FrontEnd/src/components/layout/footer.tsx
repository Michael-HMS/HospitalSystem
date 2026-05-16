import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-100 text-center py-4 px-8 ">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-gray-500"> &copy; {new Date().getFullYear()} {t("hospitalName")}. {t("footer.rightsReserved")}</p>
            </div>
        </footer>
    );
}