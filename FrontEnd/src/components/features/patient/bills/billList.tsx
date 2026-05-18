import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BillsService } from "../../../../services/payment-service";
import Button from "../../../ui/button";
import { TiCreditCard } from "react-icons/ti";

export default function BillingPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [invoices, setInvoices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loggedInPatientId = 1;
  const standardConsultationFee = 50.00; // Flat base fee mapping fallback

  useEffect(() => {
    const loadBillingData = async () => {
      try {
        const patientBills = await BillsService.getAllBills();
        setInvoices(patientBills);
      } catch (error) {
        console.error("Error loading invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBillingData();
  }, []);

  const handleProcessPayment = (invId: string) => {
    console.log(`Processing invoice gate transaction payload for: ${invId}`);
    alert(t("Redirecting secure transaction gateway processing lines safely..."));
  };

  if (loading) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 text-text-base" dir={isRtl ? "rtl" : "ltr"}>
      <header className="border-b border-slate/10 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("Accounts Statements & Invoices")}</h1>
        <p className="text-xs text-slate mt-1">{t("Track billing records, print standard checkout statements, or settle pending dues.")}</p>
      </header>

      {invoices.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate/20 rounded-2xl text-slate text-xs">
          {t("No statements or outstanding invoices generated for this ledger container.")}
        </div>
      ) : (
        <div className="border border-slate/15 rounded-2xl overflow-hidden bg-background shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate/5 border-b border-slate/15 text-slate uppercase tracking-wider font-semibold">
                <th className="p-4">{t("Invoice Reference")}</th>
                <th className="p-4">{t("Provider Details")}</th>
                <th className="p-4">{t("Date")}</th>
                <th className="p-4">{t("Amount Due")}</th>
                <th className="p-4">{t("Status")}</th>
                <th className="p-4 text-center">{t("Action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {invoices.map((inv) => {
                const doc = doctors.find((d) => Number(d.doctor_id) === Number(inv.doctor_id));
                const isPaid = inv.status === "paid";

                return (
                  <tr key={inv.invoice_id} className="hover:bg-slate/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate">{inv.invoice_id}</td>
                    <td className="p-4 font-semibold">
                      {inv.doctor_id}
                    </td>
                    <td className="p-4 text-slate">{inv.date}</td>
                    <td className="p-4 font-bold text-text-base">${inv.amount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {isPaid ? t("SETTLED") : t("PENDING")}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {!isPaid ? (
                        <Button 
                          variant="primary" 
                          size="small" 
                          onClick={() => handleProcessPayment(inv.invoice_id)}
                          icon={<TiCreditCard className="w-3.5 h-3.5" />}
                        >
                          {t("Settle Balance")}
                        </Button>
                      ) : (
                        <span className="text-xs font-semibold text-slate italic">{t("Completed")}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}