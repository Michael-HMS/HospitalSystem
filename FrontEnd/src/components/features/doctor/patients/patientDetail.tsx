import { type IPatient } from "../../../../interfaces/IUser";
import { type DetailModalProps } from "../../../../components/ui/modal";

export const mapPatientToModalProps = (
  patient: IPatient,
  onClose: () => void,
  extraActions?: DetailModalProps["actions"]
): Omit<DetailModalProps, "isOpen"> => {
  return {
    onClose,
    title: `${patient.first_name} ${patient.last_name}`,
    subtitle: `Patient ID: #${patient.patient_id}`,
    icon: "ti-user",
    badge: {
      label: `Blood Type: ${patient.blood_type}`,
      variant: "info"
    },
    sections: [
      {
        heading: "Contact & Insurance",
        fields: [
          { icon: "ti-shield-check", label: "Insurance No.", value: patient.insurance_number },
          { icon: "ti-emergency-home", label: "Emergency Contact", value: patient.emergency_contact },
          { icon: "ti-mail", label: "Email", value: patient.email },
          { icon: "ti-phone", label: "Phone", value: patient.phone },
        ]
      },
      {
        heading: "Allergies",
        list: patient.allergies.length > 0 ? patient.allergies : ["None Reported"]
      },
      {
        heading: "Medical History Summary",
        list: patient.medical_history.length > 0 ? patient.medical_history : ["No historical conditions flagged"]
      }
    ],
    actions: extraActions
  };
};