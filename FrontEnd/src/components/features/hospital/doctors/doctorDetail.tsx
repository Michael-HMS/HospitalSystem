import { type IDoctor } from "../../../../interfaces/IUser";
import { type DetailModalProps, type BadgeVariant } from "../../../../components/ui/modal";
import { TiDocumentText, TiBriefcase, TiMail, TiPhone, TiUser } from "react-icons/ti";
import { IoAccessibility } from "react-icons/io5";
import { BiCake } from "react-icons/bi";

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

export const mapDoctorToModalProps = (
  doctor: IDoctor,
  onClose: () => void,
  extraActions?: DetailModalProps["actions"]
): Omit<DetailModalProps, "isOpen"> => {
  const statusVariant: Record<string, BadgeVariant> = {
    "available": "success",
    "on-leave": "warning",
    "busy": "danger"
  };

  return {
    onClose,
    title: `Dr. ${doctor.first_name} ${doctor.last_name}`,
    subtitle: doctor.specialization,
    icon: <IoAccessibility />,
    badge: {
      label: doctor.availability_status.toUpperCase(),
      variant: statusVariant[doctor.availability_status.toLowerCase()] || "default"
    },
    sections: [
      {
        heading: "Professional Info",
        fields: [
          { icon: <TiDocumentText />, label: "License No.", value: doctor.license_number },
          { icon: <TiBriefcase />, label: "Experience", value: `${doctor.years_of_experience} Years` },
          { icon: <TiMail />, label: "Email", value: doctor.email },
          { icon: <TiPhone />, label: "Phone", value: doctor.phone },
        ]
      },
      {
        heading: "Personal Details",
        fields: [
          { icon: <TiUser />, label: "Gender", value: doctor.gender },
          { icon: <BiCake />, label: "Birth Date", value: formatDate(doctor.date_of_birth) },
        ]
      }
    ],
    actions: extraActions
  };
};