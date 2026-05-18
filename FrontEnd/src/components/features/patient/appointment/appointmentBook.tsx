import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DoctorsService } from "../../../../services/users-service";
import Button from "../../../ui/button";
import { TiCalendar, TiTime, TiUser, TiNotes, TiChevronRight } from "react-icons/ti";

export default function BookAppointmentPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar";

  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const loggedInPatientId = 1; // Connected to auth context ID

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await DoctorsService.getAllDoctors();
        setDoctors(data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patient_id: loggedInPatientId,
      doctor_id: Number(doctorId),
      appointment_date: date,
      appointment_time: time,
      reason: reason,
      status: "scheduled"
    };

    try {
      console.log("Transmitting reservation payload:", payload);
      // Calls your real endpoint dispatch method
      // await AppointmentsService.createAppointment(payload);
      navigate("/appointments");
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  if (loading) return null;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="border-b border-slate/10 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("Schedule Consultation Slot")}</h1>
        <p className="text-xs text-slate mt-1">{t("Select an available practitioner and specify appointment reasons.")}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 bg-background border border-slate/15 p-6 rounded-2xl shadow-sm">
        {/* Doctor Selection */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate uppercase flex items-center gap-1">
            <TiUser className="w-4 h-4 text-primary" /> {t("Medical Specialist")}
          </label>
          <select
            required
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate/20 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="">{t("Choose a Doctor...")}</option>
            {doctors.map((doc) => (
              <option key={doc.doctor_id} value={doc.doctor_id}>
                Dr. {doc.first_name} {doc.last_name} ({doc.specialization || t("General Practice")})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate uppercase flex items-center gap-1">
              <TiCalendar className="w-4 h-4 text-primary" /> {t("Preferred Date")}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate/20 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate uppercase flex items-center gap-1">
              <TiTime className="w-4 h-4 text-primary" /> {t("Time Window")}
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate/20 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Reason field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate uppercase flex items-center gap-1">
            <TiNotes className="w-4 h-4 text-primary" /> {t("Consultation Reason")}
          </label>
          <textarea
            rows={4}
            required
            placeholder={t("Briefly summarize any current symptoms, diagnostic targets, or general follow-ups...")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate/10">
          <Button variant="secondary" size="medium" type="button" onClick={() => navigate(-1)}>
            {t("Cancel")}
          </Button>
          <Button variant="primary" size="medium" type="submit" icon={<TiChevronRight className="w-4 h-4" />}>
            {t("Confirm Booking")}
          </Button>
        </div>
      </form>
    </div>
  );
}