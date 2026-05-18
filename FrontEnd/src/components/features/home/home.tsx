import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TiHome, TiShield, TiStar, TiArrowRight } from "react-icons/ti";
import Button from "../../ui/button";

export default function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const registered = Boolean((location.state as { registered?: boolean } | null)?.registered);

    const quickActions = [
        {
            title: "Go to Home Page",
            description: "Return to the public landing page and explore the hospital system.",
            action: () => navigate("/"),
            icon: <TiHome className="w-5 h-5" />,
        },
        {
            title: "Browse Departments",
            description: "See the available departments and the specialists linked to them.",
            action: () => navigate("/departments"),
            icon: <TiArrowRight className="w-5 h-5" />,
        },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-10 text-slate-900">
            <div className="absolute inset-0 pointer-events-none opacity-60" style={{
                backgroundImage: "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent 95%)",
            }} />

            <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-center gap-8">
                <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
                    <div className="space-y-6 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                            <TiStar className="w-5 h-5" />
                            {registered ? "Registration successful" : "Account ready"}
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
                                {t("home.home.title")}
                            </p>
                            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                                Welcome to your new hospital account.
                            </h1>
                            <p className="max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                                Your registration is complete and your profile is ready. Use the buttons below to open the public home page, browse departments, or continue into the system.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                variant="primary"
                                size="large"
                                onClick={() => navigate("/")}
                                icon={<TiHome className="w-5 h-5" />}
                                className="w-full sm:w-auto"
                            >
                                Go to Home Page
                            </Button>
                            <Button
                                variant="secondary"
                                size="large"
                                onClick={() => navigate("/departments")}
                                icon={<TiArrowRight className="w-5 h-5" />}
                                iconPosition="end"
                                className="w-full sm:w-auto"
                            >
                                Browse Departments
                            </Button>
                        </div>
                    </div>

                    <aside className="grid gap-4">
                        <div className="rounded-[1.75rem] border border-sky-100 bg-sky-500 p-6 text-white shadow-[0_18px_40px_rgba(14,165,233,0.28)]">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                                        <TiShield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm/5 font-semibold uppercase tracking-[0.2em] text-white/80">Ready</p>
                                        <h2 className="text-xl font-bold">Secure access enabled</h2>
                                    </div>
                                </div>
                                <TiStar className="h-7 w-7 text-white/80" />
                            </div>

                            <div className="grid gap-3 text-sm text-white/90">
                                <div className="rounded-2xl bg-white/10 px-4 py-3">Create appointments and manage your profile in one place.</div>
                                <div className="rounded-2xl bg-white/10 px-4 py-3">Explore departments and specialists matched to your needs.</div>
                                <div className="rounded-2xl bg-white/10 px-4 py-3">Use the navigation menu anytime to return to your account dashboard.</div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                            {quickActions.map((item) => (
                                <button
                                    key={item.title}
                                    type="button"
                                    onClick={item.action}
                                    className="group rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                                >
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                                </button>
                            ))}
                        </div>
                    </aside>
                </section>
            </div>
        </div>
    );
}