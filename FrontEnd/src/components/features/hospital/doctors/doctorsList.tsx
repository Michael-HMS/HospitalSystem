import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DoctorsService } from "../../../../services/users-service";
import { DepartmentsService } from "../../../../services/department-service";
import type { IDoctor } from "../../../../interfaces/IUser";  
import type { IDepartment } from "../../../../interfaces/IDepartment";
import DetailModal from "../../../ui/modal";
import Button from "../../../ui/button";
import { TiChevronRight, TiChevronLeft, TiCalendar } from "react-icons/ti";
import { mapDoctorToModalProps } from "./doctorDetail";

export default function DoctorsPage() {
  const ITEMS_PER_PAGE = 12;
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlDeptId = searchParams.get("deptId") || "";

  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [docsData, deptsData] = await Promise.all([
          DoctorsService.getAllDoctors(),
          DepartmentsService.getAllDepartments()
        ]);
        setDoctors(docsData);
        setDepartments(deptsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDeptFilterChange = (idValue: string) => {
    if (idValue) {
      setSearchParams({ deptId: idValue });
    } else {
      searchParams.delete("deptId");
      setSearchParams(searchParams);
    }
    setCurrentPage(1);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase();
    const specialty = (doc.specialization || "").toLowerCase();
    const query = search.toLowerCase();
    
    const matchesSearch = fullName.includes(query) || specialty.includes(query);
    const matchesDept = !urlDeptId || doc.department_id === Number(urlDeptId);
    const matchesStatus = !selectedStatus || doc.availability_status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-6 max-w-7xl mx-auto text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("Medical Practitioners")}</h1>
        <p className="text-sm text-slate mt-1">{t("Click any specialist card to read verified records or execute bookings.")}</p>
      </header>

      {/* Filter Inputs Stack */}
      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder={t("Search by practitioner name or specialty...")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate/20 bg-background text-text-base text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={urlDeptId}
            onChange={(e) => handleDeptFilterChange(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate/20 bg-background text-text-base text-sm focus:outline-none"
          >
            <option value="">{t("All Departments")}</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="w-full p-2.5 rounded-xl border border-slate/20 bg-background text-text-base text-sm focus:outline-none"
          >
            <option value="">{t("All Statuses")}</option>
            <option value="available">{t("Available")}</option>
            <option value="busy">{t("Busy")}</option>
            <option value="on-leave">{t("On Leave")}</option>
          </select>
        </div>
      </div>

      {paginatedDoctors.length === 0 ? (
        <div className="text-center py-12 text-slate text-sm">{t("No medical specialists found matching these filtered conditions.")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedDoctors.map((doc) => (
            <div 
              key={doc.doctor_id} 
              onClick={() => setSelectedDoctor(doc)}
              className="p-4 rounded-2xl border border-slate/15 bg-background shadow-sm flex flex-col justify-between gap-4 hover:border-slate/30 cursor-pointer transition-all"
            >
              <div className="flex gap-3 items-start">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 flex items-center justify-center">
                  {doc.first_name[0].toUpperCase()}{doc.last_name[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-semibold truncate">Dr. {doc.first_name} {doc.last_name}</h3>
                  <p className="text-xs text-slate mb-2 truncate">{doc.specialization || t("General Practitioner")}</p>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    doc.availability_status?.toLowerCase() === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {t(doc.availability_status)}
                  </span>
                </div>
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="primary"
                  size="small"
                  link={`/book-appointment?doctorId=${doc.doctor_id}`}
                  className="w-full"
                  icon={<TiCalendar className="w-4 h-4" />}
                >
                  {t("Book Appointment")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDoctor && (
        <DetailModal
          isOpen={!!selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          {...mapDoctorToModalProps(
            selectedDoctor, 
            () => setSelectedDoctor(null),
            [
              {
                label: t("Schedule Appointment"),
                icon: <TiCalendar />,
                onClick: () => {
                  setSelectedDoctor(null);
                  navigate(`/book-appointment?doctorId=${selectedDoctor.doctor_id}`);
                }
              }
            ]
          )}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate/15">
          <Button variant="secondary" size="small" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            {isRtl ? <TiChevronRight className="w-4 h-4" /> : <TiChevronLeft className="w-4 h-4" />}
          </Button>
          <span className="text-xs text-slate font-medium">{t("Page")} {currentPage} {t("of")} {totalPages}</span>
          <Button variant="secondary" size="small" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            {isRtl ? <TiChevronLeft className="w-4 h-4" /> : <TiChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}