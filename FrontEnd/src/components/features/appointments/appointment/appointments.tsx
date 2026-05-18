import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppointmentsService } from "../../../../services/appointment-service";
import { DoctorsService } from "../../../../services/users-service"
import type { IAppointment } from "../../../../interfaces/IAppointment";
import type { IDoctor } from "../../../../interfaces/IUser";
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
  TiEye 
} from "react-icons/ti";
import { PiNewspaperClippingThin } from "react-icons/pi";

export default function ViewAppointmentsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);

  useEffect(() => {
    const loadSessionRecords = async () => {
      try {
        const [appsData, docsData] = await Promise.all([
          AppointmentsService.getAllAppointments(),
          DoctorsService.getAllDoctors()
        ]);
        setAppointments(appsData);
        setDoctors(docsData);
      } catch (error) {
        console.error("Error fetching appointment entries:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSessionRecords();
  }, []);

  const getAppointmentModalProps = (app: IAppointment) => {
    const targetDoc = doctors.find((d) => d.doctor_id === app.doctor_id);
    const doctorName = targetDoc ? `Dr. ${targetDoc.first_name} ${targetDoc.last_name}` : `${t("Provider")} #${app.doctor_id}`;

    const infoFields = [
      { icon: <TiInfoLarge />, label: t("Appointment ID"), value: app.appointment_id },
      { icon: <TiUser />, label: t("Medical Specialist"), value: doctorName },
      { icon: <TiCalendar />, label: t("Scheduled Date"), value: app.appointment_date },
      { icon: <TiTime />, label: t("Time Window"), value: app.appointment_time },
      { icon: <TiInfoOutline />, label: t("Current Status"), value: app.status.toUpperCase() },
      { icon: <TiNotes />, label: t("Consultation Reason"), value: app.reason }
    ];

    const sections = [
      {
        heading: t("Reservation Details"),
        fields: infoFields
      }
    ];

    // Conditionally include connected professional clinical blueprints
    if (app.medical_record) {
      sections.push({
        heading: t("Assigned Medical Diagnostics"),
        fields: [
          { icon: <TiHeartOutline />, label: t("Clinical Diagnosis"), value: app.medical_record.diagnosis },
          { icon: <PiNewspaperClippingThin />, label: t("Treatment Summary"), value: app.medical_record.treatment }
        ]
      });
    }

    return {
      title: t("Appointment Log Record"),
      subtitle: doctorName,
      icon: <TiCalendar />,
      badge: {
        label: app.status.toUpperCase(),
        variant: (app.status.toLowerCase() === "scheduled" ? "info" : "default") as "info" | "default"
      },
      sections,
      actions: [
        {
          label: t("Close Entry"),
          onClick: () => setSelectedAppointment(null)
        }
      ]
    };
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-6 max-w-5xl mx-auto text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("Your Consultations")}</h1>
        <p className="text-sm text-slate mt-1">
          {t("Review past records, view real-time entry status metrics, or open diagnostic prescriptions.")}
        </p>
      </header>

      {appointments.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-slate/20 text-slate text-sm">
          {t("No appointment checkup histories are linked to this profile context.")}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((app) => {
            const associatedDoctor = doctors.find((d) => d.doctor_id === app.doctor_id);
            const practitionerLabel = associatedDoctor 
              ? `Dr. ${associatedDoctor.first_name} ${associatedDoctor.last_name}` 
              : `${t("Practitioner")} #${app.doctor_id}`;

            return (
              <div
                key={app.appointment_id}
                onClick={() => setSelectedAppointment(app)}
                className="p-4 rounded-xl border border-slate/15 bg-background shadow-xs hover:border-slate/30 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate/10 flex items-center justify-center text-primary shrink-0">
                    <TiCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{practitionerLabel}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-slate">
                      <span className="flex items-center gap-1">
                        <TiCalendar className="shrink-0" /> {app.appointment_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <TiTime className="shrink-0" /> {app.appointment_time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4" onClick={(e) => e.stopPropagation()}>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                    app.status.toLowerCase() === "scheduled"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate/10 text-slate"
                  }`}>
                    {t(app.status)}
                  </span>
                  
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setSelectedAppointment(app)}
                    icon={<TiEye className="w-4 h-4" />}
                  >
                    {t("View Sheet")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedAppointment && (
        <DetailModal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          {...getAppointmentModalProps(selectedAppointment)}
        />
      )}
    </div>
  );
}