import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button";
import { TiLockClosedOutline } from "react-icons/ti";

export default function Forbidden() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
      <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6">
        <TiLockClosedOutline className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-base mb-2">403</h1>
      <h2 className="text-xl font-bold text-slate mb-6">{t("Access Denied")}</h2>
      <p className="text-sm text-slate/80 mb-8 max-w-md">
        {t("You do not have the required permissions or role to view this page. If you believe this is an error, please contact the administrator.")}
      </p>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          {t("Go Back")}
        </Button>
        <Button variant="primary" onClick={() => navigate("/home")}>
          {t("Go to Dashboard")}
        </Button>
      </div>
    </div>
  );
}
