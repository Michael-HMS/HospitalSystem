import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MedicationsService } from "../../../services/medical-service"; // Direct Service
import type { IMedication } from "../../../interfaces/IAppointment"; // Core Interface
import DetailModal from "../../ui/modal";
import { TiDocumentText, TiInfoLarge, TiNotes, TiCalendar, TiTag } from "react-icons/ti";

export default function AdminMedicationsPage() {
  const { t } = useTranslation();
  const [medications, setMedications] = useState<IMedication[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMed, setSelectedMed] = useState<IMedication | null>(null);
  const [loading, setLoading] = useState(true);
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        setLoading(true);
        const data = await MedicationsService.getAllMedications(); // Straight from your API
        setMedications(data || []);
      } catch (error) {
        console.error("Failed to load catalog lines:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, []);

  const filteredMeds = medications.filter((m) => {
    const matchesSearch = m.medication_name.toLowerCase().includes(search.toLowerCase());
    
    if (stockFilter === "low") {
      return matchesSearch && m.stock_quantity <= 10;
    }
    if (stockFilter === "normal") {
      return matchesSearch && m.stock_quantity > 10;
    }
    return matchesSearch;
  });

  const getMedModalProps = (med: IMedication) => {
    const isLowStock = med.stock_quantity <= 10;
    return {
      title: med.medication_name,
      subtitle: `${t("SKU Reference ID")}: #${med.medication_id}`,
      icon: <TiDocumentText />,
      badge: {
        label: isLowStock ? t("LOW STOCK") : t("IN STOCK"),
        variant: (isLowStock ? "danger" : "success") as any
      },
      sections: [
        {
          heading: t("Stock & Financial Metrics"),
          fields: [
            { icon: <TiInfoLarge />, label: t("Current Inventory"), value: `${med.stock_quantity} Units` },
            { icon: <TiTag />, label: t("Unit Retail Price"), value: `$${med.price?.toFixed(2) || "0.00"}` },
            { icon: <TiCalendar />, label: t("Expiration Date"), value: med.expiry_date || t("N/A") }
          ]
        },
        {
          heading: t("Pharmaceutical Description"),
          fields: [
            { icon: <TiNotes />, label: t("Overview"), value: med.description || t("No description available.") }
          ]
        }
      ],
      actions: [{ label: t("Dismiss"), onClick: () => setSelectedMed(null) }]
    };
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold tracking-tight">{t("System Medications Catalog")}</h2>
        <p className="text-xs text-slate mt-0.5">{t("Monitor retail pharmaceutical lines, inventory constraints, and expiration limits.")}</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
        <input
          type="text"
          placeholder={t("Search by formula or compound name...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-xl border border-slate/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-base"
        >
          <option value="all">{t("All Medications")}</option>
          <option value="normal">{t("In Stock")}</option>
          <option value="low">{t("Low Stock")}</option>
        </select>
      </div>

      <div className="border border-slate/15 rounded-2xl overflow-hidden bg-background">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate/5 border-b border-slate/15 text-slate uppercase tracking-wider font-semibold">
              <th className="p-4">ID</th>
              <th className="p-4">{t("Name")}</th>
              <th className="p-4">{t("Stock Level")}</th>
              <th className="p-4">{t("Price")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate/10">
            {filteredMeds.map((med) => (
              <tr
                key={med.medication_id}
                onClick={() => setSelectedMed(med)}
                className="hover:bg-slate/5 cursor-pointer transition-colors"
              >
                <td className="p-4 font-mono">#{med.medication_id}</td>
                <td className="p-4 font-semibold">{med.medication_name}</td>
                <td className="p-4">
                  <span className={`font-medium ${med.stock_quantity <= 10 ? "text-red-500 font-bold" : "text-text-base"}`}>
                    {med.stock_quantity}
                  </span>
                </td>
                <td className="p-4 font-medium">${med.price?.toFixed(2) || "0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMed && (
        <DetailModal isOpen={!!selectedMed} onClose={() => setSelectedMed(null)} {...getMedModalProps(selectedMed)} />
      )}
    </div>
  );
}