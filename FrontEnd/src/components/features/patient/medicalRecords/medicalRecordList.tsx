import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MedicalRecordsService } from "../../../../services/medical-service";
import { AuthService } from "../../../../services/auth-service";
import { TiHeartOutline, TiDocumentText, TiCalendar, TiUser } from "react-icons/ti";

export default function MedicalHistoryPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [records, setRecords] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loggedInPatientId = 1;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const patientId = Number(AuthService.getProfileId());
        if (!patientId) return;

        const historicalData = await MedicalRecordsService.getMedicalRecordsByPatient(patientId);

        setRecords(historicalData);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="border-b border-slate/10 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("Your Medical Records Chart")}</h1>
        <p className="text-xs text-slate mt-1">{t("Timeline view of verified provider diagnostics, treatments, and clinical chart histories.")}</p>
      </header>

      {records.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate/20 rounded-2xl text-slate text-xs">
          {t("No official diagnostics summaries or treatments recorded on file yet.")}
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => {
            return (
              <div key={rec.record_id} className="bg-background border border-slate/15 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm">
                
                {/* Meta Timeline Info */}
                <div className="space-y-1.5 md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-slate/10 pb-3 md:pb-0 md:pr-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate font-medium">
                    <TiCalendar className="text-primary w-4 h-4" />
                    <span>{new Date(rec.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-base">
                    <TiUser className="text-emerald-500 w-4 h-4" />
                    <span>{rec.doctorName || `Staff #${rec.doctor_id}`}</span>
                  </div>
                </div>

                {/* Diagnostics & Content Results */}
                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <h3 className="text-[10px] uppercase tracking-wider text-slate font-bold flex items-center gap-1">
                      <TiHeartOutline className="text-red-500 w-3.5 h-3.5" /> {t("Clinical Diagnosis")}
                    </h3>
                    <p className="text-xs font-semibold mt-0.5 text-text-base bg-red-500/5 px-2.5 py-1.5 rounded-lg border border-red-500/10">
                      {rec.diagnosis}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[10px] uppercase tracking-wider text-slate font-bold flex items-center gap-1">
                      <TiDocumentText className="text-primary w-3.5 h-3.5" /> {t("Prescribed Plan & Treatment Summary")}
                    </h3>
                    <p className="text-xs text-slate mt-1 leading-relaxed pl-1">
                      {rec.treatment}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}