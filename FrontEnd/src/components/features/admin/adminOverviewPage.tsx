import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UsersService } from "../../../services/users-service";
import { TiGroup, TiHeartOutline, TiCalendar } from "react-icons/ti";

export default function AdminOverviewPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  
  const [stats, setStats] = useState({ totalPatients: 0, totalDoctors: 0, totalAppointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await UsersService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      <header className="border-b border-slate/10 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-text-base">{t("Platform Overview")}</h2>
        <p className="text-xs text-slate mt-1">{t("High level metrics and hospital performance stats.")}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background border border-slate/15 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <TiGroup className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate font-medium uppercase tracking-wider">{t("Total Patients")}</p>
            <p className="text-2xl font-bold text-text-base mt-1">{stats.totalPatients}</p>
          </div>
        </div>

        <div className="bg-background border border-slate/15 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <TiHeartOutline className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate font-medium uppercase tracking-wider">{t("Total Doctors")}</p>
            <p className="text-2xl font-bold text-text-base mt-1">{stats.totalDoctors}</p>
          </div>
        </div>

        <div className="bg-background border border-slate/15 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <TiCalendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate font-medium uppercase tracking-wider">{t("Total Appointments")}</p>
            <p className="text-2xl font-bold text-text-base mt-1">{stats.totalAppointments}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
