import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../../services/auth-service";
import Button from "../../../ui/button";
import { TiCalendar, TiClipboard, TiDocumentText, TiHeartOutline, TiNotes, TiUser } from "react-icons/ti";

type IntakeSubmission = {
    id: string;
    patientId: number;
    patientName: string;
    email: string;
    visitDate: string;
    concern: string;
    symptoms: string;
    allergies: string;
    medications: string;
    history: string;
    notes: string;
    createdAt: string;
};

const STORAGE_KEY = "patient-medical-record-intakes";

function readSubmissions(): IntakeSubmission[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw) as IntakeSubmission[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export default function MedicalRecordEntryPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isRtl = i18n.language === "ar";

    const patientId = Number(AuthService.getProfileId() || AuthService.getId() || 0);
    const patientName = `${AuthService.getFirstName() || ""} ${AuthService.getLastName() || ""}`.trim() || "Patient";
    const patientEmail = AuthService.getEmail() || "";

    const [visitDate, setVisitDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [concern, setConcern] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [allergies, setAllergies] = useState("");
    const [medications, setMedications] = useState("");
    const [history, setHistory] = useState("");
    const [notes, setNotes] = useState("");
    const [submitMessage, setSubmitMessage] = useState("");
    const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);

    useEffect(() => {
        setSubmissions(readSubmissions());
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const submission: IntakeSubmission = {
            id: crypto.randomUUID(),
            patientId,
            patientName,
            email: patientEmail,
            visitDate,
            concern,
            symptoms,
            allergies,
            medications,
            history,
            notes,
            createdAt: new Date().toISOString(),
        };

        const nextSubmissions = [submission, ...submissions].slice(0, 6);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSubmissions));
        setSubmissions(nextSubmissions);
        setSubmitMessage(t("Your intake details have been saved for review."));
        setConcern("");
        setSymptoms("");
        setAllergies("");
        setMedications("");
        setHistory("");
        setNotes("");
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-8 text-slate-900" dir={isRtl ? "rtl" : "ltr"}>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-start">
                <section className="w-full rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8 lg:max-w-3xl">
                    <header className="space-y-3 border-b border-slate/10 pb-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700">
                            <TiDocumentText className="h-4 w-4" />
                            {t("Patient Intake Form")}
                        </div>
                        <h1 className="text-3xl font-black tracking-tight md:text-4xl">{t("Enter your medical record details")}</h1>
                        <p className="max-w-2xl text-sm leading-7 text-slate-600">
                            {t("This page lets patients capture symptoms, history, and current concerns before the care team reviews the information.")}
                        </p>
                    </header>

                    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                    <TiUser className="h-4 w-4 text-sky-600" /> {t("Patient Name")}
                                </label>
                                <input
                                    type="text"
                                    value={patientName}
                                    readOnly
                                    className="w-full rounded-xl border border-slate/20 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                    <TiDocumentText className="h-4 w-4 text-sky-600" /> {t("Patient ID")}
                                </label>
                                <input
                                    type="text"
                                    value={patientId || "—"}
                                    readOnly
                                    className="w-full rounded-xl border border-slate/20 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                    <TiCalendar className="h-4 w-4 text-sky-600" /> {t("Visit Date")}
                                </label>
                                <input
                                    type="date"
                                    value={visitDate}
                                    onChange={(event) => setVisitDate(event.target.value)}
                                    className="w-full rounded-xl border border-slate/20 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                    <TiUser className="h-4 w-4 text-sky-600" /> {t("Email")}
                                </label>
                                <input
                                    type="email"
                                    value={patientEmail}
                                    readOnly
                                    className="w-full rounded-xl border border-slate/20 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                <TiHeartOutline className="h-4 w-4 text-rose-500" /> {t("Main Concern")}
                            </label>
                            <input
                                type="text"
                                required
                                value={concern}
                                onChange={(event) => setConcern(event.target.value)}
                                placeholder={t("Reason for the visit or the issue you want the doctor to review")}
                                className="w-full rounded-xl border border-slate/20 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                <TiNotes className="h-4 w-4 text-sky-600" /> {t("Current Symptoms")}
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={symptoms}
                                onChange={(event) => setSymptoms(event.target.value)}
                                placeholder={t("Describe what you are feeling, when it started, and how severe it is")}
                                className="w-full rounded-xl border border-slate/20 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 resize-none"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                    <TiClipboard className="h-4 w-4 text-sky-600" /> {t("Allergies")}
                                </label>
                                <textarea
                                    rows={3}
                                    value={allergies}
                                    onChange={(event) => setAllergies(event.target.value)}
                                    placeholder={t("List known allergies or enter none")}
                                    className="w-full rounded-xl border border-slate/20 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 resize-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                    <TiClipboard className="h-4 w-4 text-sky-600" /> {t("Current Medications")}
                                </label>
                                <textarea
                                    rows={3}
                                    value={medications}
                                    onChange={(event) => setMedications(event.target.value)}
                                    placeholder={t("Enter any medicine, supplements, or treatments you are using")}
                                    className="w-full rounded-xl border border-slate/20 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                <TiDocumentText className="h-4 w-4 text-sky-600" /> {t("Past Medical History")}
                            </label>
                            <textarea
                                rows={4}
                                value={history}
                                onChange={(event) => setHistory(event.target.value)}
                                placeholder={t("Share any ongoing conditions, recent procedures, or important background")}
                                className="w-full rounded-xl border border-slate/20 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 resize-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 flex items-center gap-1.5">
                                <TiNotes className="h-4 w-4 text-sky-600" /> {t("Additional Notes")}
                            </label>
                            <textarea
                                rows={4}
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder={t("Anything else your doctor should know before the consultation")}
                                className="w-full rounded-xl border border-slate/20 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-6 text-slate-500">
                                {t("Official clinical records are created by the care team. This form collects your intake details for review.")}
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button variant="secondary" size="medium" type="button" onClick={() => navigate(-1)}>
                                    {t("Cancel")}
                                </Button>
                                <Button variant="primary" size="medium" type="submit">
                                    {t("Save Intake")}
                                </Button>
                            </div>
                        </div>

                        {submitMessage && (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                {submitMessage}
                            </div>
                        )}
                    </form>
                </section>

                <aside className="w-full space-y-4 lg:sticky lg:top-6 lg:max-w-sm">
                    <div className="rounded-[1.75rem] border border-sky-100 bg-sky-500 p-6 text-white shadow-[0_18px_40px_rgba(14,165,233,0.28)]">
                        <h2 className="text-xl font-bold">{t("What to include")}</h2>
                        <div className="mt-4 space-y-3 text-sm text-white/90">
                            <div className="rounded-2xl bg-white/10 px-4 py-3">{t("Symptoms, onset, and severity")}</div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3">{t("Allergies, medications, and long-term conditions")}</div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3">{t("Anything that helps the doctor review your case faster")}</div>
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate/15 bg-white/90 p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                                <TiDocumentText className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">{t("Recent submissions")}</h3>
                                <p className="text-xs text-slate-500">{t("Stored locally in this browser session")}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {submissions.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate/20 px-4 py-6 text-center text-xs text-slate-500">
                                    {t("No intake records have been saved yet.")}
                                </div>
                            ) : (
                                submissions.map((entry) => (
                                    <div key={entry.id} className="rounded-2xl border border-slate/15 bg-slate-50 px-4 py-3">
                                        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-600">
                                            <span>{new Date(entry.createdAt).toLocaleString()}</span>
                                            <span>{entry.visitDate}</span>
                                        </div>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{entry.concern}</p>
                                        <p className="mt-1 text-xs leading-6 text-slate-600">{entry.symptoms}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
