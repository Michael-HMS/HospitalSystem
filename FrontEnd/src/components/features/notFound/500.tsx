import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button";
import { TiWarning } from "react-icons/ti";

export default function ServerError({ error, resetErrorBoundary }: { error?: Error; resetErrorBoundary?: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
      <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
        <TiWarning className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-base mb-2">500</h1>
      <h2 className="text-xl font-bold text-slate mb-6">{t("Internal System Error")}</h2>
      <p className="text-sm text-slate/80 mb-4 max-w-md">
        {t("The application encountered an unexpected error. Our engineering team has been notified. Please try refreshing or return to the dashboard.")}
      </p>

      {error && (
        <div className="bg-red-500/5 border border-red-500/20 text-red-600 text-xs text-left p-4 rounded-lg w-full max-w-lg mb-8 overflow-auto max-h-32 font-mono">
          {error.message}
        </div>
      )}

      <div className="flex gap-4">
        {resetErrorBoundary && (
          <Button variant="secondary" onClick={resetErrorBoundary}>
            {t("Try Again")}
          </Button>
        )}
        <Button variant="primary" onClick={() => navigate("/home")}>
          {t("Go to Dashboard")}
        </Button>
      </div>
    </div>
  );
}
