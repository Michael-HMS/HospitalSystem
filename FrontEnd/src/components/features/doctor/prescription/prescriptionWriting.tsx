import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { AppointmentsService } from "../../../../services/appointment-service";
import { PatientsService, DoctorsService } from "../../../../services/users-service";
import { MedicationsService } from "../../../../services/medical-service"; 
import Button from "../../../ui/button";
import { 
  TiDocumentAdd, 
  TiTrash, 
  TiPlus, 
  TiNotes, 
  TiUser, 
  TiFolderOpen,
  TiArrowDown
} from "react-icons/ti";
import type { IAppointment } from "../../../../interfaces/IAppointment";
import type { IPatient, IDoctor } from "../../../../interfaces/IUser";
import type { IMedication } from "../../../../interfaces/IAppointment";

interface IPrescriptionItem {
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function CreatePrescriptionPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<IAppointment | null>(null);
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [systemMedications, setSystemMedications] = useState<IMedication[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Fields State
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<IPrescriptionItem[]>([
    { medication_name: "", dosage: "", frequency: "", duration: "" }
  ]);

  // Dropdown tracking
  const [, setActiveDropdownIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadPrescriptionContext = async () => {
      if (!appointmentId) return;
      try {
        setLoading(true);
        
        const [appsData, patientsData, doctorsData, medsData] = await Promise.all([
          AppointmentsService.getAllAppointments(),
          PatientsService.getAllPatients(),
          DoctorsService.getAllDoctors(),
          MedicationsService.getAllMedications() 
        ]);

        setSystemMedications(medsData || []);

        const foundApp = appsData.find((app) => app.appointment_id === Number(appointmentId));
        if (foundApp) {
          setAppointment(foundApp);
          
          const foundPatient = patientsData.find((p) => (p.user_id || (p as any).id) === foundApp.patient_id);
          const foundDoctor = doctorsData.find((d) => d.doctor_id === foundApp.doctor_id);

          if (foundPatient) setPatient(foundPatient);
          if (foundDoctor) setDoctor(foundDoctor);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptionContext();
  }, [appointmentId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddItem = () => {
    setItems([...items, { medication_name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: keyof IPrescriptionItem, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formalPayload = {
      appointment_id: Number(appointmentId),
      patient_id: appointment?.patient_id,
      doctor_id: appointment?.doctor_id,
      issued_date: new Date().toISOString().split('T')[0],
      medications: items,
      additional_instructions: notes
    };

    console.log("Submitting directly to backend:", formalPayload);
    navigate("/appointments");
  };

  if (loading) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="border-b border-slate/10 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("Formulate Electronic Prescription")}</h1>
      </header>

      {/* Case Header Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate/5 p-5 rounded-2xl border border-slate/15 text-xs">
        <div className="space-y-2">
          <h3 className="font-semibold uppercase text-slate">{t("Target Clinical Subject")}</h3>
          <p className="flex items-center gap-2 font-medium text-sm">
            <TiUser className="text-primary w-4 h-4" /> 
            {patient ? `${patient.first_name} ${patient.last_name}` : `${t("Patient")} #${appointment?.patient_id}`}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold uppercase text-slate">{t("Authorizing Practitioner")}</h3>
          <p className="flex items-center gap-2 font-medium text-sm">
            <TiFolderOpen className="text-emerald-500 w-4 h-4" /> 
            {doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : `${t("Medical Staff")} #${appointment?.doctor_id}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-slate">{t("Pharmaceutical Lines Matrix")}</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
            >
              <TiPlus /> {t("Add Medication")}
            </button>
          </div>

          <div className="space-y-3" ref={dropdownRef}>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl border border-slate/15 bg-background items-end relative">
                
                {/* Clean Dropdown Selection mapped strictly from your IMedication service array */}
                <div className="sm:col-span-4 space-y-1 relative">
                  <label className="text-[11px] font-bold text-slate uppercase">{t("Medication Name")}</label>
                  <div className="relative">
                    <select
                      required
                      value={item.medication_name}
                      onChange={(e) => handleItemChange(index, "medication_name", e.target.value)}
                      className="w-full px-3 py-2 pr-8 rounded-lg border border-slate/20 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary appearance-none layout-select"
                    >
                      <option value="">{t("Select Medication...")}</option>
                      {systemMedications.map((med) => (
                        <option key={med.medication_id || med.medication_name} value={med.medication_name}>
                          {med.medication_name}
                        </option>
                      ))}
                    </select>
                    <TiArrowDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate pointer-events-none w-4 h-4" />
                  </div>
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] font-bold text-slate uppercase">{t("Dosage Rule")}</label>
                  <input
                    type="text"
                    required
                    value={item.dosage}
                    onChange={(e) => handleItemChange(index, "dosage", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 bg-background text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] font-bold text-slate uppercase">{t("Frequency")}</label>
                  <input
                    type="text"
                    required
                    value={item.frequency}
                    onChange={(e) => handleItemChange(index, "frequency", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 bg-background text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-slate uppercase">{t("Days")}</label>
                  <input
                    type="text"
                    required
                    value={item.duration}
                    onChange={(e) => handleItemChange(index, "duration", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 bg-background text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-center sm:justify-end">
                  <button
                    type="button"
                    disabled={items.length === 1}
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"
                  >
                    <TiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate uppercase flex items-center gap-1">
            <TiNotes /> {t("Instructions")}
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate/20 bg-background focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate/10">
          <Button variant="secondary" size="medium" type="button" onClick={() => navigate(-1)}>
            {t("Discard")}
          </Button>
          <Button variant="primary" size="medium" type="submit" icon={<TiDocumentAdd className="w-4 h-4" />}>
            {t("Transmit")}
          </Button>
        </div>
      </form>
    </div>
  );
}