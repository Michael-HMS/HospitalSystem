import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminMedicationsPage from "./adminMedicationPage";
import AdminUsersPage from "./adminUsersPage";
import AdminOverviewPage from "./adminOverviewPage";
import { TiDocumentText, TiGroup, TiFolder, TiHome } from "react-icons/ti";

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [activeTab, setActiveTab] = useState<"overview" | "medications" | "users">("overview");

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      {/* Admin Sidebar Panel */}
      <aside className="w-full md:w-64 bg-background border-b md:border-b-0 md:border-r border-slate/15 p-5 flex flex-col gap-6 shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight flex items-center gap-2 text-primary">
            <TiFolder className="w-5 h-5" />
            {t("Admin Console")}
          </h1>
          <p className="text-xs text-slate mt-0.5">{t("System Management Control")}</p>
        </div>

        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTab === "overview"
                ? "bg-primary/10 text-primary"
                : "text-slate hover:bg-slate/5"
            }`}
          >
            <TiHome className="w-4 h-4" />
            {t("Overview")}
          </button>

          <button
            onClick={() => setActiveTab("medications")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTab === "medications"
                ? "bg-primary/10 text-primary"
                : "text-slate hover:bg-slate/5"
            }`}
          >
            <TiDocumentText className="w-4 h-4" />
            {t("Medications Inventory")}
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTab === "users"
                ? "bg-primary/10 text-primary"
                : "text-slate hover:bg-slate/5"
            }`}
          >
            <TiGroup className="w-4 h-4" />
            {t("User Management")}
          </button>
        </nav>
      </aside>

      {/* Main Viewport Workspace */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {activeTab === "overview" && <AdminOverviewPage />}
        {activeTab === "medications" && <AdminMedicationsPage />}
        {activeTab === "users" && <AdminUsersPage />}
      </main>
    </div>
  );
}