import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

// ===================== TYPES =====================
type Role = "patient" | "doctor" | "admin"
type PatientTab = "info" | "appointments" | "history"
type DoctorTab = "info" | "schedule" | "patients"
type AdminTab = "overview" | "users" | "doctors" | "billing" | "logs"

// ===================== MOCK DATA =====================
const userData = {
  patient: {
    name: "Ahmed Hassan",
    initials: "AH",
    id: "#00142",
    email: "ahmed.hassan@email.com",
    phone: "+20 10 1234 5678",
    dob: "12 March 1990",
    address: "Cairo, Egypt",
    blood: "A+",
    allergies: "Penicillin",
    stats: { visits: 6, upcoming: 2, reports: 1 },
    appointments: [
      { doctor: "Dr. Sara Mohamed", dept: "Cardiology", date: "May 22, 2026", time: "10:00 AM", status: "Confirmed" },
      { doctor: "Dr. Omar Khaled", dept: "Neurology", date: "May 28, 2026", time: "2:00 PM", status: "Pending" },
    ],
    history: [
      { diagnosis: "Hypertension", doctor: "Dr. Sara Mohamed", date: "April 10, 2026", notes: "Prescribed Amlodipine 5mg" },
      { diagnosis: "Migraine", doctor: "Dr. Omar Khaled", date: "Feb 20, 2026", notes: "Advised rest and hydration" },
    ],
  },
  
  doctor: {
    name: "Dr. Sara Mohamed",
    initials: "SM",
    dept: "Cardiology",
    experience: "8 yrs",
    license: "EG-MED-20341",
    email: "s.mohamed@hospital.eg",
    phone: "+20 11 9876 5432",
    hours: "Sun–Thu, 9am–4pm",
    rating: 4.9,
    stats: { today: 4, total: 128, rating: 4.9 },
    schedule: [
      { patient: "Ahmed Hassan", type: "Checkup", time: "9:00 AM", status: "Confirmed" },
      { patient: "Nour Ali", type: "Follow-up", time: "11:00 AM", status: "Pending" },
      { patient: "Karim Samir", type: "Consultation", time: "1:00 PM", status: "Confirmed" },
      { patient: "Laila Mostafa", type: "Checkup", time: "3:00 PM", status: "Confirmed" },
    ],
    patients: [
      { name: "Ahmed Hassan", age: 36, lastVisit: "May 15, 2026", condition: "Hypertension" },
      { name: "Nour Ali", age: 29, lastVisit: "May 10, 2026", condition: "Arrhythmia" },
      { name: "Karim Samir", age: 45, lastVisit: "April 28, 2026", condition: "Heart failure" },
    ],
  },
  admin: {
    name: "Karim Samir",
    initials: "KS",
    role: "Super Admin",
    doctors: [
    {
      name: "Dr. Sara Mohamed",
      specialization: "Cardiology",
      email: "s.mohamed@hospital.eg",
      status: "Active",
    },
    {
      name: "Dr. Omar Khaled",
      specialization: "Neurology",
      email: "o.khaled@hospital.eg",
      status: "Active",
    },
    ],
    email: "k.samir@hospital.eg",
    phone: "+20 12 5555 0000",
    lastLogin: "Today, 8:42 AM",
    stats: { patients: 248, doctors: 32, revenue: "$12,400", departments: 5, pendingBills: 18, appointments: 310 },
    recentUsers: [
      { name: "Ahmed Hassan", role: "Patient", joined: "May 18, 2026", status: "Active" },
      { name: "Dr. Nour Ali", role: "Doctor", joined: "May 16, 2026", status: "Active" },
      { name: "Laila Mostafa", role: "Patient", joined: "May 14, 2026", status: "Inactive" },
    ],
    billing: [
      { patient: "Ahmed Hassan", amount: "$50", date: "May 15, 2026", status: "Paid" },
      { patient: "Sara Mohamed", amount: "$75", date: "May 14, 2026", status: "Pending" },
      { patient: "Omar Khaled", amount: "$50", date: "May 13, 2026", status: "Paid" },
    ],
    logs: [
      { action: "Patient record updated", user: "Dr. Sara Mohamed", time: "Today, 9:14 AM" },
      { action: "New appointment booked", user: "Ahmed Hassan", time: "Today, 8:55 AM" },
      { action: "Invoice generated", user: "System", time: "Today, 8:00 AM" },
      { action: "Doctor schedule updated", user: "Dr. Omar Khaled", time: "Yesterday, 5:30 PM" },
    ],
  },
}

// ===================== HELPERS =====================
const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border border-amber-200",
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Inactive: "bg-gray-100 text-gray-500 border border-gray-200",
    Paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  }
  return map[status] ?? "bg-gray-100 text-gray-500 border border-gray-200"
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
})

// ===================== SHARED COMPONENTS =====================
const StatCard = ({ label, value, delay = 0 }: { label: string; value: string | number; delay?: number }) => (
  <motion.div {...fadeUp(delay)} className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-1">
    <span className="text-2xl font-bold text-slate-800">{value}</span>
    <span className="text-xs text-slate-500">{label}</span>
  </motion.div>
)

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500 flex items-center gap-2">
      <span className="text-base">{icon}</span>{label}
    </span>
    <span className="text-sm font-medium text-slate-800">{value}</span>
  </div>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-slate-700 mb-3 mt-5 first:mt-0">{children}</h3>
)

// ===================== PATIENT TABS =====================
const PatientInfo = () => {
  const d = userData.patient
  return (
    <motion.div {...fadeUp(0.05)}>
      <SectionTitle>Personal information</SectionTitle>
      <InfoRow icon="✉️" label="Email" value={d.email} />
      <InfoRow icon="📞" label="Phone" value={d.phone} />
      <InfoRow icon="🎂" label="Date of birth" value={d.dob} />
      <InfoRow icon="📍" label="Address" value={d.address} />
      <SectionTitle>Medical information</SectionTitle>
      <InfoRow icon="🩸" label="Blood type" value={d.blood} />
      <InfoRow icon="⚠️" label="Allergies" value={d.allergies} />
    </motion.div>
  )
}

const PatientAppointments = () => {
  const d = userData.patient
  return (
    <motion.div {...fadeUp(0.05)} className="flex flex-col gap-3">
      {d.appointments.map((a, i) => (
        <motion.div key={i} {...fadeUp(i * 0.07)}
          className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">🩺</div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{a.doctor}</p>
              <p className="text-xs text-slate-500">{a.dept}</p>
              <p className="text-xs text-slate-400 mt-0.5">📅 {a.date} · {a.time}</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(a.status)}`}>{a.status}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

const PatientHistory = () => {
  const d = userData.patient
  return (
    <motion.div {...fadeUp(0.05)} className="flex flex-col gap-3">
      {d.history.map((h, i) => (
        <motion.div key={i} {...fadeUp(i * 0.07)}
          className="bg-slate-50 rounded-2xl p-4 border-l-4 border-blue-400">
          <p className="text-sm font-semibold text-slate-800">{h.diagnosis}</p>
          <p className="text-xs text-slate-500">{h.doctor} · {h.date}</p>
          <p className="text-xs text-slate-400 mt-1.5 italic">"{h.notes}"</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ===================== DOCTOR TABS =====================
const DoctorInfo = () => {
  const d = userData.doctor
  return (
    <motion.div {...fadeUp(0.05)}>
      <SectionTitle>Contact</SectionTitle>
      <InfoRow icon="✉️" label="Email" value={d.email} />
      <InfoRow icon="📞" label="Phone" value={d.phone} />
      <SectionTitle>Professional</SectionTitle>
      <InfoRow icon="🏥" label="Department" value={d.dept} />
      <InfoRow icon="🕐" label="Working hours" value={d.hours} />
      <InfoRow icon="🪪" label="License no." value={d.license} />
      <InfoRow icon="⭐" label="Rating" value={`${d.rating} / 5`} />
    </motion.div>
  )
}

const DoctorSchedule = () => {
  const d = userData.doctor
  return (
    <motion.div {...fadeUp(0.05)} className="flex flex-col gap-3">
      {d.schedule.map((s, i) => (
        <motion.div key={i} {...fadeUp(i * 0.07)}
          className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
              {s.patient.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{s.patient}</p>
              <p className="text-xs text-slate-500">{s.type} · 🕐 {s.time}</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(s.status)}`}>{s.status}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

const DoctorPatients = () => {
  const d = userData.doctor
  return (
    <motion.div {...fadeUp(0.05)} className="flex flex-col gap-3">
      {d.patients.map((p, i) => (
        <motion.div key={i} {...fadeUp(i * 0.07)}
          className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700">
              {p.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{p.name}</p>
              <p className="text-xs text-slate-500">Age {p.age} · {p.condition}</p>
              <p className="text-xs text-slate-400">Last visit: {p.lastVisit}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ===================== ADMIN TABS =====================
const AdminOverview = () => {
  const s = userData.admin.stats
  return (
    <motion.div {...fadeUp(0.05)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total patients" value={s.patients} delay={0.05} />
        <StatCard label="Active doctors" value={s.doctors} delay={0.1} />
        <StatCard label="Revenue" value={s.revenue} delay={0.15} />
        <StatCard label="Departments" value={s.departments} delay={0.2} />
        <StatCard label="Pending bills" value={s.pendingBills} delay={0.25} />
        <StatCard label="Appointments" value={s.appointments} delay={0.3} />
      </div>
      <SectionTitle>Admin info</SectionTitle>
      <InfoRow icon="✉️" label="Email" value={userData.admin.email} />
      <InfoRow icon="📞" label="Phone" value={userData.admin.phone} />
      <InfoRow icon="🔐" label="Role" value={userData.admin.role} />
      <InfoRow icon="🕐" label="Last login" value={userData.admin.lastLogin} />
    </motion.div>
  )
}

const AdminUsers = () => {
  const d = userData.admin
  return (
    <motion.div {...fadeUp(0.05)} className="flex flex-col gap-3">
      {d.recentUsers.map((u, i) => (
        <motion.div key={i} {...fadeUp(i * 0.07)}
          className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-700">
              {u.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{u.name}</p>
              <p className="text-xs text-slate-500">{u.role} · Joined {u.joined}</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(u.status)}`}>{u.status}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

const AdminBilling = () => {
  const d = userData.admin
  return (
    <motion.div {...fadeUp(0.05)} className="flex flex-col gap-3">
      {d.billing.map((b, i) => (
        <motion.div key={i} {...fadeUp(i * 0.07)}
          className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">{b.patient}</p>
            <p className="text-xs text-slate-400">{b.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800">{b.amount}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(b.status)}`}>{b.status}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState(userData.admin.doctors)

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    email: "",
  })

  const [errors, setErrors] = useState({
  name: "",
  specialization: "",
  email: "",
  })

  const validateEmail = (email: string) => {
  if (!email) return "Email is required"

  if (
    !/\S+@\S+\.\S+/.test(email) ||
    /[A-Z]/.test(email) ||
    /^[0-9]/.test(email) ||
    /^[^a-zA-Z_]/.test(email)
  ) {
    return "Enter a valid email"
  }

  return ""
}

const validateText = (value: string, field: string) => {
  if (!value) {
    return `${field} is required`
  }

  if (!/^[A-Za-z\s]+$/.test(value)) {
    return `${field} must contain letters only`
  }

  if (value.length < 3) {
    return `Enter valid ${field.toLowerCase()}`
  }

  return ""
  }

  const addDoctor = () => {
    const newErrors = {
      name: validateText(newDoctor.name, "Name"),
      specialization: validateText(
        newDoctor.specialization,
        "Specialization"
      ),
      email: validateEmail(newDoctor.email),
    }
  
    setErrors(newErrors)
  
    if (
      newErrors.name ||
      newErrors.specialization ||
      newErrors.email
    ) {
      return
    }
  
    setDoctors([
      ...doctors,
      {
        ...newDoctor,
        status: "Active",
      },
    ])
  
    setNewDoctor({
      name: "",
      specialization: "",
      email: "",
    })
  
    setErrors({
      name: "",
      specialization: "",
      email: "",
    })
  }

  return (
    <motion.div {...fadeUp(0.05)} className="space-y-6">
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Add New Doctor
        </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Name */}
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Doctor Name"
          value={newDoctor.name}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, name: e.target.value })
          }
          className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 ${
            errors.name
              ? "border-red-400 focus:ring-red-300"
              : "border-slate-200 focus:ring-blue-400"
          }`}
        />

        {errors.name && (
          <span className="text-red-500 text-xs mt-1 ml-1">
            {errors.name}
          </span>
        )}
      </div>
      
      {/* Specialization */}
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Specialization"
          value={newDoctor.specialization}
          onChange={(e) =>
            setNewDoctor({
              ...newDoctor,
              specialization: e.target.value,
            })
          }
          className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 ${
            errors.specialization
              ? "border-red-400 focus:ring-red-300"
              : "border-slate-200 focus:ring-blue-400"
          }`}
        />

        {errors.specialization && (
          <span className="text-red-500 text-xs mt-1 ml-1">
            {errors.specialization}
          </span>
        )}
      </div>
      
      {/* Email */}
      <div className="flex flex-col">
        <input
          type="email"
          placeholder="Email"
          value={newDoctor.email}
          onChange={(e) =>
            setNewDoctor({
              ...newDoctor,
              email: e.target.value,
            })
          }
          className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 ${
            errors.email
              ? "border-red-400 focus:ring-red-300"
              : "border-slate-200 focus:ring-blue-400"
          }`}
        />

        {errors.email && (
          <span className="text-red-500 text-xs mt-1 ml-1">
            {errors.email}
          </span>
        )}
      </div>
      
    </div>

        <button
          onClick={addDoctor}
          className="mt-4 bg-violet-500 hover:bg-violet-600 text-white px-5 py-3 rounded-xl font-medium transition-all"
        >
          Add Doctor
        </button>
      </div>

      <div className="space-y-3">
        {doctors.map((d, i) => (
          <motion.div
            key={i}
            {...fadeUp(i * 0.07)}
            className="flex items-center justify-between bg-slate-50 rounded-2xl p-4"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {d.name}
              </p>

              <p className="text-xs text-slate-500">
                {d.specialization}
              </p>

              <p className="text-xs text-slate-400">
                {d.email}
              </p>
            </div>

            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(
                d.status
              )}`}
            >
              {d.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const AdminLogs = () => {
  const d = userData.admin
  return (
    <motion.div {...fadeUp(0.05)} className="flex flex-col gap-2">
      {d.logs.map((l, i) => (
        <motion.div key={i} {...fadeUp(i * 0.07)}
          className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
          <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-slate-800">{l.action}</p>
            <p className="text-xs text-slate-400">{l.user} · {l.time}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ===================== TAB BAR =====================
function TabBar<T extends string>({
  tabs, active, onChange,
}: { tabs: { key: T; label: string }[]; active: T; onChange: (t: T) => void }) {
  return (
    <div className="flex overflow-x-auto border-b border-slate-100 mb-5 gap-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
            active === t.key
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ===================== ROLE PANELS =====================
const PatientPanel = () => {
  const [tab, setTab] = useState<PatientTab>("info")
  const d = userData.patient
  const tabs = [
    { key: "info" as PatientTab, label: "Info" },
    { key: "appointments" as PatientTab, label: "Appointments" },
    { key: "history" as PatientTab, label: "Medical history" },
  ]
  return (
    <>
      <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {d.initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{d.name}</h1>
          <p className="text-slate-500 text-sm">Patient · {d.id}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full font-medium">✓ Active</span>
            <span className="bg-red-50 text-red-600 border border-red-200 text-xs px-3 py-1 rounded-full font-medium">🩸 {d.blood}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total visits" value={d.stats.visits} delay={0.05} />
        <StatCard label="Upcoming" value={d.stats.upcoming} delay={0.1} />
        <StatCard label="Reports" value={d.stats.reports} delay={0.15} />
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {tab === "info" && <PatientInfo />}
          {tab === "appointments" && <PatientAppointments />}
          {tab === "history" && <PatientHistory />}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

const DoctorPanel = () => {
  const [tab, setTab] = useState<DoctorTab>("info")
  const d = userData.doctor
  const tabs = [
    { key: "info" as DoctorTab, label: "Info" },
    { key: "schedule" as DoctorTab, label: "Today's schedule" },
    { key: "patients" as DoctorTab, label: "My patients" },
  ]
  return (
    <>
      <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {d.initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{d.name}</h1>
          <p className="text-slate-500 text-sm">{d.dept} · {d.experience} experience</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full font-medium">✓ On duty</span>
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-3 py-1 rounded-full font-medium">⭐ {d.rating}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Today's patients" value={d.stats.today} delay={0.05} />
        <StatCard label="Total consultations" value={d.stats.total} delay={0.1} />
        <StatCard label="Rating" value={d.stats.rating} delay={0.15} />
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {tab === "info" && <DoctorInfo />}
          {tab === "schedule" && <DoctorSchedule />}
          {tab === "patients" && <DoctorPatients />}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

const AdminPanel = () => {
  const [tab, setTab] = useState<AdminTab>("overview")
  const tabs = [
    { key: "overview" as AdminTab, label: "Overview" },
    { key: "users" as AdminTab, label: "Recent users" },
    { key: "billing" as AdminTab, label: "Billing" },
    { key: "logs" as AdminTab, label: "Activity log" },
    { key: "doctors" as AdminTab, label: "Doctors" },
  ]
  return (
    <>
      <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {userData.admin.initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{userData.admin.name}</h1>
          <p className="text-slate-500 text-sm">System administrator</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-violet-50 text-violet-700 border border-violet-200 text-xs px-3 py-1 rounded-full font-medium">🔐 Full access</span>
          </div>
        </div>
      </motion.div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {tab === "overview" && <AdminOverview />}
          {tab === "users" && <AdminUsers />}
          {tab === "billing" && <AdminBilling />}
          {tab === "logs" && <AdminLogs />}
          {tab === "doctors" && <AdminDoctors />}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

// ===================== MAIN PAGE =====================
export default function ProfilePage() {
  const [role, setRole] = useState<Role>("patient")

  const roleConfig: Record<Role, { color: string }> = {
    patient: { color: "bg-emerald-500" },
    doctor: { color: "bg-blue-500" },
    admin: { color: "bg-violet-500" },
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span className="font-bold text-slate-900 text-lg">
            <span className="text-blue-500">HMS</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:block">Demo role:</span>
          {(["patient", "doctor", "admin"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                role === r
                  ? `${roleConfig[r].color} text-white`
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-10 min-h-[85vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {role === "patient" && <PatientPanel />}
              {role === "doctor" && <DoctorPanel />}
              {role === "admin" && <AdminPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}