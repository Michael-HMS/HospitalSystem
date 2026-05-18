import { useTranslation } from "react-i18next";

export default function Home() {
    const { t } = useTranslation();
    return (
        <div>
            <h1>{t("home.home.title")}</h1>
            <p>{t("home.home.description")}</p>
        </div>
    );
}