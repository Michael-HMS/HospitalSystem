import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PatientsService } from "../../../../services/users-service"; 
import { AppointmentsService } from "../../../../services/appointment-service";
import { AuthService } from "../../../../services/auth-service";
import DetailModal from "../../../ui/modal";
import { TiUser, TiMail, TiPhone, TiCalendar, TiClipboard, TiNotes, TiHeartOutline } from "react-icons/ti";
import type { IAppointment } from "../../../../interfaces/IAppointment";
import type { IPatient } from "../../../../interfaces/IUser";

interface IPatientSummary {
  patient: IPatient;
  total_appointments: number;
  last_visited: string;
  medical_history: IAppointment[];
}

export default function DoctorPatientsPage() {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<IPatientSummary[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<IPatientSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Session ID — Link this to your genuine Auth Provider Context
  const loggedInDoctorId = Number(AuthService.getId()) || 0;

  useEffect(() => {
    const fetchDoctorPatientsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Fetch live datasets concurrently
        const [allPatientsData, appointmentsData] = await Promise.all([
          PatientsService.getAllPatients(), 
          AppointmentsService.getAllAppointments()
        ]);

        const totalPatients: IPatient[] = allPatientsData || [];
        const totalAppointments: IAppointment[] = appointmentsData || [];

        // 2. Filter down all global appointments handled by this specific logged-in physician
        const doctorAppointments = totalAppointments.filter(
          (app) => app.doctor_id === loggedInDoctorId
        );

        // 3. Map metrics (visit counts, complete history trees) specifically for this doctor's caseload
        const compiledSummaries: IPatientSummary[] = totalPatients.map((pat) => {
          // Normalizing potential identifier mismatch bugs (.user_id vs .id)
          const targetId = pat.user_id || (pat as any).id;

          // Isolate appointments linked directly to this patient instance
          const patientHistory = doctorAppointments
            .filter((app) => app.patient_id === targetId)
            .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());

          return {
            patient: pat, 
            total_appointments: patientHistory.length,
            last_visited: patientHistory[0]?.appointment_date || t("N/A"),
            medical_history: patientHistory
          };
        });

        // Only list patients who have a recorded history with this practitioner
        const assignedPatientsOnly = compiledSummaries.filter(summary => summary.total_appointments > 0);

        setPatients(assignedPatientsOnly);
      } catch (err) {
        console.error("Critical failure pulling service layer registries:", err);
        setError(t("Failed to load your patients caseload. Please try again."));
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorPatientsData();
  }, [t]);

  const filteredPatients = patients.filter((p) => {
    const firstName = p.patient.first_name || "";
    const lastName = p.patient.last_name || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const targetId = (p.patient.user_id || (p.patient as any).id || "").toString();
    const query = search.toLowerCase();
    
    return fullName.includes(query) || targetId.includes(query);
  });

  const getPatientModalProps = (summary: IPatientSummary) => {
    const { patient, medical_history, total_appointments, last_visited } = summary;
    const targetId = patient.user_id || (patient as any).id;

    const historyFields = medical_history.slice(0, 3).map((app) => ({
      icon: <TiCalendar />,
      label: `${app.appointment_date} — ${app.status.toUpperCase()}`,
      value: app.medical_record?.diagnosis || app.reason || t("General Consultation Check")
    }));

    return {
      title: `${patient.first_name || t("Patient")} ${patient.last_name || ""}`,
      subtitle: `${t("Patient ID Reference")}: #${targetId}`,
      icon: <TiUser />,
      badge: {
        label: `${total_appointments} ${t("Visits Done")}`,
        variant: "info" as const
      },
      sections: [
        {
          heading: t("Account Contact Metadata (IUser Inheritance)"),
          fields: [
            { icon: <TiMail />, label: t("Primary Email Address"), value: patient.email || t("N/A") },
            { icon: <TiPhone />, label: t("Phone Number Line"), value: patient.phone || (patient as any).phone_number || t("N/A") }
          ]
        },
        {
          heading: t("Caseload Metrics"),
          fields: [
            { icon: <TiClipboard />, label: t("Total Complete Consultations"), value: total_appointments },
            { icon: <TiCalendar />, label: t("Most Recent Visit Date"), value: last_visited }
          ]
        },
        {
          heading: t("Recent Case Diagnoses Records (Max 3)"),
          fields: historyFields.length > 0 ? historyFields : [
            { icon: <TiNotes />, label: t("Logs Summary"), value: t("No diagnostic notes compiled on record.") }
          ]
        }
      ],
      actions: [{ label: t("Dismiss Profile"), onClick: () => setSelectedPatient(null) }]
    };
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate font-medium tracking-wide">{t("Loading patients register...")}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <header>
        <h2 className="text-xl font-bold tracking-tight">{t("My Patients Caseload")}</h2>
        <p className="text-xs text-slate mt-0.5">
          {t("Inspect unique data matrices powered by your real patient and appointment services.")}
        </p>
      </header>

      <input
        type="text"
        placeholder={t("Search caseloads by patient name or digital ID token...")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2.5 rounded-xl border border-slate/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-base"
      />

      {error ? (
        <div className="text-center py-12 text-sm text-red-500">{error}</div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate">{t("No matching assigned patient entries found.")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPatients.map((summary) => {
            const targetId = summary.patient.user_id || (summary.patient as any).id;
            return (
              <div
                key={targetId}
                onClick={() => setSelectedPatient(summary)}
                className="p-5 rounded-2xl border border-slate/15 bg-background hover:border-slate/30 cursor-pointer shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                    <TiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-base">
                      {summary.patient.first_name} {summary.patient.last_name}
                    </h4>
                    <p className="text-xs text-slate mt-0.5">
                      {t("Patient ID")}: <span className="font-mono font-medium">#{targetId}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate/10 flex items-center justify-between text-[11px] text-slate">
                  <span className="inline-flex items-center gap-1">
                    <TiHeartOutline className="text-emerald-500" />
                    <strong>{summary.total_appointments}</strong> {t("visits")}
                  </span>
                  <span>
                    {t("Last Visit")}: <strong>{summary.last_visited}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPatient && (
        <DetailModal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          {...getPatientModalProps(selectedPatient)}
        />
      )}
    </div>
  );
}