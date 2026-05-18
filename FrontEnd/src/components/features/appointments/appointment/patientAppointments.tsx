import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppointmentsService } from "../../../../services/appointment-service";
import { DoctorsService } from "../../../../services/users-service"; 
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
  TiHeartOutline, 
  TiEye,
  TiClipboard
} from "react-icons/ti";
import { PiNewspaperClippingThin } from "react-icons/pi";

interface ILocalMedication {
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface ILocalAppointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  medical_record?: { diagnosis: string; treatment: string };
  prescription?: { additional_instructions?: string; medications?: ILocalMedication[] };
}

export default function PatientAppointmentsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [appointments, setAppointments] = useState<ILocalAppointment[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<ILocalAppointment | null>(null);

  // Replace this placeholder integer with your global Auth Context/Session ID variable directly if needed
  const loggedInPatientId = Number(AuthService.getId()) || 0;

  useEffect(() => {
    const loadPatientDashboard = async () => {
      try {
        setLoading(true);
        const [appsData, docsData] = await Promise.all([
          AppointmentsService.getAllAppointments(),
          DoctorsService.getAllDoctors()
        ]);

        const allApps: ILocalAppointment[] = (appsData as any) || [];
        const patientApps = allApps.filter(app => Number(app.patient_id) === loggedInPatientId);

        setAppointments(patientApps);
        setDoctors(docsData || []);
      } catch (error) {
        console.error("Error loading patient records:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPatientDashboard();
  }, []);

  const getModalProps = (app: ILocalAppointment): any => {
    const targetDoc = doctors.find((d) => Number(d.doctor_id) === Number(app.doctor_id));
    const doctorLabel = targetDoc ? `Dr. ${targetDoc.first_name} ${targetDoc.last_name}` : `${t("Practitioner")} #${app.doctor_id}`;

    const sections: any[] = [
      {
        heading: t("Reservation Details"),
        fields: [
          { icon: <TiInfoLarge />, label: t("Appointment ID"), value: app.appointment_id },
          { icon: <TiUser />, label: t("Medical Specialist"), value: doctorLabel },
          { icon: <TiCalendar />, label: t("Scheduled Date"), value: app.appointment_date },
          { icon: <TiTime />, label: t("Time Window"), value: app.appointment_time },
          { icon: <TiInfoOutline />, label: t("Current Status"), value: (app.status || "").toUpperCase() },
          { icon: <TiNotes />, label: t("Consultation Reason"), value: app.reason }
        ]
      }
    ];

    if (app.medical_record) {
      sections.push({
        heading: t("Assigned Medical Diagnostics"),
        fields: [
          { icon: <TiHeartOutline />, label: t("Clinical Diagnosis"), value: app.medical_record.diagnosis },
          { icon: <PiNewspaperClippingThin />, label: t("Treatment Summary"), value: app.medical_record.treatment }
        ]
      });
    }

    // Displays the prescription block seamlessly inside the sheet modal views
    if (app.prescription) {
      const medicationFields = app.prescription.medications?.map((med) => ({
        icon: <TiClipboard />,
        label: med.medication_name || t("Medication"),
        value: `${med.dosage} — ${med.frequency} (${med.duration} ${t("Days")})`
      })) || [];

      sections.push({
        heading: t("Active Issued Prescription Script"),
        fields: [
          ...medicationFields,
          { 
            icon: <TiNotes />, 
            label: t("Special Instructions"), 
            value: app.prescription.additional_instructions || t("Take exactly as prescribed.") 
          }
        ]
      });
    }

    let badgeVariant = "default";
    if (app.prescription) badgeVariant = "success";
    else if ((app.status || "").toLowerCase() === "scheduled") badgeVariant = "info";

    return {
      title: t("Appointment Log Record"),
      subtitle: doctorLabel,
      icon: <TiCalendar />,
      badge: {
        label: app.prescription ? t("PRESCRIPTION ISSUED") : (app.status || "").toUpperCase(),
        variant: badgeVariant
      },
      sections,
      actions: [{ label: t("Close Entry"), onClick: () => setSelectedAppointment(null) }]
    };
  };

  if (loading) return <div className="text-center py-12">{t("Loading your medical chart...")}</div>;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-5xl mx-auto text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("Your Consultations")}</h1>
        <p className="text-sm text-slate mt-1">{t("Review past medical records or check dynamic status metrics.")}</p>
      </header>

      {appointments.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate/20 rounded-2xl text-slate text-sm">
          {t("No appointment history linked to this account context.")}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((app) => {
            const targetDoc = doctors.find((d) => Number(d.doctor_id) === Number(app.doctor_id));
            const doctorLabel = targetDoc ? `Dr. ${targetDoc.first_name} ${targetDoc.last_name}` : `${t("Practitioner")} #${app.doctor_id}`;
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
                    <h3 className="text-sm font-semibold">{doctorLabel}</h3>
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