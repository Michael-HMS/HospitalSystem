import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DepartmentsService } from "../../../../services/department-service";
import type { IDepartment } from "../../../../interfaces/IDepartment";
import DetailModal from "../../../ui/modal";
import Button from "../../../ui/button";
import { IoIosSearch } from "react-icons/io";
import { TiHome, TiChevronRight, TiChevronLeft, TiNotes, TiAnchor } from "react-icons/ti";

export default function DepartmentsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal State Manager
  const [selectedDept, setSelectedDept] = useState<IDepartment | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await DepartmentsService.getAllDepartments();
        setDepartments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filteredDepts = departments.filter((dept) =>
    dept.department_name.toLowerCase().includes(search.toLowerCase()) ||
    dept.description.toLowerCase().includes(search.toLowerCase())
  );

  // Structural mapper to pass department properties straight to DetailModal
  const getDeptModalProps = (dept: IDepartment) => {
    return {
      title: dept.department_name,
      subtitle: t("Department Record"),
      icon: <TiHome className="w-5 h-5" />,
      sections: [
        {
          heading: t("Department Identification"),
          fields: [
            { icon: <TiAnchor className="w-5 h-5" />, label: t("Department ID"), value: dept.department_id }
          ]
        },
        {
          heading: t("Overview Description"),
          fields: [
            { icon: <TiNotes className="w-5 h-5" />, label: t("Summary"), value: dept.description }
          ]
        },
        {
          heading: t("Assigned Medical Staff"),
          list: dept.doctors?.map(doc => `Dr. ${doc.first_name} ${doc.last_name}`) || []
        }
      ],
      actions: [
        {
          label: t("Dismiss"),
          onClick: () => setSelectedDept(null)
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 max-w-7xl mx-auto text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("Medical Departments")}</h1>
        <p className="text-sm text-slate mt-1">{t("Select a specialty card to explore profile blueprints or browse specialists.")}</p>
      </header>

      {/* Input Search Field */}
      <div className="mb-6 relative">
        <span className={`absolute inset-y-0 flex items-center text-slate ${isRtl ? "right-3" : "left-3"}`}>
          <IoIosSearch className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder={t("Search departments...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full py-2.5 rounded-xl border border-slate/20 bg-background text-text-base placeholder-slate/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"}`}
        />
      </div>

      {filteredDepts.length === 0 ? (
        <div className="text-center py-12 text-slate text-sm">{t("No departments found matching your criteria.")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepts.map((dept) => (
            <div
              key={dept.department_id}
              onClick={() => setSelectedDept(dept)}
              className="p-5 rounded-2xl border border-slate/15 bg-background shadow-sm flex flex-col justify-between gap-5 hover:border-slate/40 cursor-pointer transition-all group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-slate/10 flex items-center justify-center text-primary dark:text-text-base">
                    <TiHome className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-semibold">{dept.department_name}</h2>
                </div>
                <p className="text-xs text-slate leading-relaxed line-clamp-3">{dept.description}</p>
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="secondary"
                  size="small"
                  link={`/doctors?deptId=${dept.department_id}`}
                  iconPosition="end"
                  icon={isRtl ? <TiChevronLeft className="w-4 h-4" /> : <TiChevronRight className="w-4 h-4" />}
                  className="w-full justify-between"
                >
                  {t("View Specialists")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Dynamic Department Details Modal */}
      {selectedDept && (
        <DetailModal
          isOpen={!!selectedDept}
          onClose={() => setSelectedDept(null)}
          {...getDeptModalProps(selectedDept)}
        />
      )}
    </div>
  );
}