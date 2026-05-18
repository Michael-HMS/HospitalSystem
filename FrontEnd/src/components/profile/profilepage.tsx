import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AuthService } from "../../services/auth-service";
import { TiUser, TiMail, TiLockClosed, TiHome } from "react-icons/ti";
import Button from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();

  const [profile, setProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    const firstName = AuthService.getFirstName() || "Unknown";
    const lastName = AuthService.getLastName() || "User";
    const email = AuthService.getEmail() || "No email provided";
    const role = AuthService.getRole() || "Guest";
    const id = AuthService.getId() || "0";

    setProfile({ firstName, lastName, email, role, id });
  }, []);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background px-4 py-8 max-w-4xl mx-auto text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t("My Profile")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("Manage your account settings and preferences.")}</p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Profile Header Block */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl font-bold backdrop-blur-sm border-2 border-white/30">
            {profile.firstName[0]?.toUpperCase()}{profile.lastName[0]?.toUpperCase()}
          </div>
          <div className="text-center md:text-left text-white">
            <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
            <p className="text-white/80 mt-1 capitalize tracking-wide">{profile.role} Account • ID #{profile.id}</p>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="p-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
            {t("Account Information")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0">
                <TiUser className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t("Full Name")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{profile.firstName} {profile.lastName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <TiMail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t("Email Address")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center shrink-0">
                <TiLockClosed className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t("Access Level")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 capitalize">{profile.role}</p>
              </div>
            </div>

          </div>

          <div className="mt-10 flex gap-4">
            <Button variant="primary" onClick={() => navigate("/home")} icon={<TiHome className="w-5 h-5"/>}>
              {t("Return to Dashboard")}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}