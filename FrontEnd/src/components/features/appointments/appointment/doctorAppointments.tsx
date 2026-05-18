import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AppointmentsService } from "../../../../services/appointment-service";
import { PatientsService } from "../../../../services/users-service"; 
import { AuthService } from "../../../../services/auth-service";
import DetailModal from "../../../ui/modal";
import Button from "../../../ui/button";
import { 
  TiCalendar, 
  TiTime, 
  TiUser, 
  TiInfoLarge, 
  TiInfoOutline, 
  TiNotes, 
  TiEye,
  TiDocumentAdd
} from "react-icons/ti";

interface ILocalAppointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  medical_record?: { diagnosis: string; treatment: string };
  prescription?: any;
}

export default function DoctorAppointmentsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<ILocalAppointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<ILocalAppointment | null>(null);

  const loggedInDoctorId = Number(AuthService.getId()) || 0;

  useEffect(() => {
    const loadDoctorDashboard = async () => {
      try {
        setLoading(true);
        const [appsData, patientsData] = await Promise.all([
          AppointmentsService.getAllAppointments(),
          PatientsService.getAllPatients()
        ]);

        const allApps: ILocalAppointment[] = (appsData as any) || [];
        const doctorApps = allApps.filter(app => Number(app.doctor_id) === loggedInDoctorId);

        setAppointments(doctorApps);
        setPatients(patientsData || []);
      } catch (error) {
        console.error("Error loading doctor caseload dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDoctorDashboard();
  }, []);

  const getModalProps = (app: ILocalAppointment): any => {
    const targetPatient = patients.find((p) => Number(p.user_id || p.id) === Number(app.patient_id));
    const patientLabel = targetPatient ? `${targetPatient.first_name} ${targetPatient.last_name}` : `${t("Patient")} #${app.patient_id}`;

    const sections = [
      {
        heading: t("Reservation Details"),
        fields: [
          { icon: <TiInfoLarge />, label: t("Appointment ID"), value: app.appointment_id },
          { icon: <TiUser />, label: t("Patient Name"), value: patientLabel },
          { icon: <TiCalendar />, label: t("Scheduled Date"), value: app.appointment_date },
          { icon: <TiTime />, label: t("Time Window"), value: app.appointment_time },
          { icon: <TiInfoOutline />, label: t("Current Status"), value: (app.status || "").toUpperCase() },
          { icon: <TiNotes />, label: t("Consultation Reason"), value: app.reason }
        ]
      }
    ];

    return {
      title: t("Appointment Log Record"),
      subtitle: patientLabel,
      icon: <TiCalendar />,
      badge: { label: (app.status || "").toUpperCase(), variant: "default" },
      sections,
      actions: [
        {
          label: t("Write Prescription"),
          onClick: () => {
            setSelectedAppointment(null);
            navigate(`/prescriptions/new/${app.appointment_id}`);
          }
        },
        { label: t("Close Entry"), onClick: () => setSelectedAppointment(null) }
      ]
    };
  };

  if (loading) return <div className="text-center py-12">{t("Loading clinician dashboard data...")}</div>;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-5xl mx-auto text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("Doctor Caseload Dashboard")}</h1>
        <p className="text-sm text-slate mt-1">{t("Review scheduled patient intakes and submit clinical scripts.")}</p>
      </header>

      {appointments.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate/20 rounded-2xl text-slate text-sm">
          {t("No patient entries are currently scheduled.")}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((app) => {
            const targetPatient = patients.find((p) => Number(p.user_id || p.id) === Number(app.patient_id));
            const patientLabel = targetPatient ? `${targetPatient.first_name} ${targetPatient.last_name}` : `${t("Patient")} #${app.patient_id}`;
            const hasRx = !!app.prescription;

            return (
              <div
                key={app.appointment_id}
                onClick={() => setSelectedAppointment(app)}
                className="p-4 rounded-xl border border-slate/15 bg-background hover:border-slate/30 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate/10 flex items-center justify-center text-primary shrink-0">
                    <TiCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{patientLabel}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-slate">
                      <span>{app.appointment_date}</span>
                      <span>{app.appointment_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    hasRx ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {hasRx ? t("Prescribed") : t(app.status)}
                  </span>

                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => navigate(`/prescription/${app.appointment_id}`)}
                    icon={<TiDocumentAdd />}
                  >
                    {t("Prescribe")}
                  </Button>

                  <Button variant="secondary" size="small" onClick={() => setSelectedAppointment(app)} icon={<TiEye />}>
                    {t("View Sheet")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedAppointment && (
        <DetailModal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} {...(getModalProps(selectedAppointment) as any)} />
      )}
    </div>
  );
}