import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

// ==================== HERO ====================
const HeroSection = () => {
  return (
    <section className="w-full px-8 py-10 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gray-50 rounded-3xl px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-10"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col gap-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Empowering <br /> Lives Through <br />
            <span className="text-green-500">Health</span>
            {/*{t("home.hero.title")}*/}
          </h1>
          <p className="text-gray-500 text-base max-w-sm">
            Navigating Health Together. Your Trusted Medical Resource.
            {/*{("home.hero.description")}*/}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex justify-center items-center"
        >
          <div className="w-72 h-72 bg-green-100 rounded-full flex items-center justify-center text-8xl">
            🏥
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ==================== STATS ====================
const StatsSection = () => {
  return (
    <section className="w-full px-8 py-16 bg-white flex flex-col md:flex-row items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Your Bridge to Better Health <br /> Start Your Journey Today
          {/*{("home.stats.title")}*/}
        </h2>
        <p className="text-gray-500">Navigating Health Together. Your Trusted Medical Resource.</p>
        {/*{("home.stats.description")}*/}
        <div className="flex items-center gap-4">
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3"
      >
        <div className="flex -space-x-2">
          <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-white text-sm">A</div>
          <div className="w-10 h-10 rounded-full bg-green-400 border-2 border-white flex items-center justify-center text-white text-sm">B</div>
          <div className="w-10 h-10 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-white text-sm">C</div>
        </div>
        <p className="text-gray-500 text-sm">Our Clients</p>
        <h3 className="text-3xl font-bold text-green-500">12K+</h3>
        <p className="text-gray-400 text-sm">Happy Clients</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center gap-3"
      >
        <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
          <span className="text-2xl font-bold text-green-500">84%</span>
        </div>
        <p className="text-gray-600 font-medium">Healing Success</p>
      </motion.div>
    </section>
  )
}


// ==================== SERVICES ====================
type Service = { icon: string; title: string; description: string }
const services: Service[] = [
  { icon: "❤️", title: "Cardiology", description: "Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology." },
  { icon: "🦷", title: "Dentistry", description: "Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology." },
  { icon: "🧠", title: "Neurology", description: "Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology." },
  { icon: "🦴", title: "Orthopedics", description: "Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology." },
  { icon: "👁️", title: "Ophthalmology", description: "Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology." },
]

const ServicesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const visibleServices = [
    services[currentIndex % services.length],
    services[(currentIndex + 1) % services.length],
    services[(currentIndex + 2) % services.length],
  ]
  return (
    <section className="w-full px-8 py-16 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-green-500 font-medium mb-2">Our Services</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Comprehensive Medical Solutions</h2>
        {/*{("home.services.title")}*/}
      </motion.div>
      <div className="flex gap-6 justify-center items-stretch">
        <AnimatePresence mode="wait">
          {visibleServices.map((service, index) => (
            <motion.div
              key={currentIndex + index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex-1 rounded-2xl p-6 flex flex-col gap-3 ${index === 1 ? "bg-green-500 text-white shadow-lg scale-105" : "bg-white text-gray-800 shadow-md"}`}
            >
              <span className="text-4xl">{service.icon}</span>
              <h3 className={`text-xl font-bold ${index === 1 ? "text-white" : "text-gray-800"}`}>{service.title}</h3>
              <p className={`text-sm ${index === 1 ? "text-green-50" : "text-gray-500"}`}>{service.description}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-center items-center gap-4 mt-10">
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + services.length) % services.length)}
          className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors">←</button>
        <div className="flex gap-2">
          {services.map((_, index) => (
            <button key={index} onClick={() => setCurrentIndex(index)}
              className={`rounded-full transition-all duration-300 ${currentIndex === index ? "w-6 h-3 bg-green-500" : "w-3 h-3 bg-gray-300"}`} />
          ))}
        </div>
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % services.length)}
          className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors">→</button>
      </div>
    </section>
  )
}

// ==================== STEPS ====================
type Step = { icon: string; title: string; description: string }
const steps: Step[] = [
  { icon: "👨‍⚕️", title: "Check Doctor Profile", description: "Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology." },
  { icon: "📋", title: "Request Consultation", description: "Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology." },
  { icon: "📅", title: "Schedule Meeting", description: "Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology." },
  { icon: "🤝", title: "Get Your Solution", description: "Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology." },
]

const StepsSection = () => {
  return (
    <section className="w-full px-8 py-16 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">4 Easy Steps And Get Your Solution</h2>
        {/*{("home.steps.title")}*/}
        <p className="text-gray-500 max-w-xl mx-auto">Navigating Health Together. Your Trusted Medical Resource. Medicine Meets Technology.</p>
        {/*{("home.stats.description")}*/}
      </motion.div>
      <div className="w-full bg-gray-50 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-stretch">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
            className={`flex-1 rounded-2xl p-6 flex flex-col gap-4 ${index === 0 ? "bg-green-100" : "bg-white border border-gray-100"}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">{step.icon}</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${index === 0 ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                0{index + 1}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
            <p className="text-sm text-gray-500">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ==================== DOCTORS ====================
type Doctor = { name: string; specialty: string; icon: string }
const doctors: Doctor[] = [
  { name: "Dr. Ahmed Hassan", specialty: "Cardiologist", icon: "👨‍⚕️" },
  { name: "Dr. Sara Mohamed", specialty: "Dentist", icon: "👩‍⚕️" },
  { name: "Dr. Omar Khaled", specialty: "Neurologist", icon: "👨‍⚕️" },
  { name: "Dr. Nour Ali", specialty: "Orthopedic", icon: "👩‍⚕️" },
  { name: "Dr. Karim Samir", specialty: "Ophthalmologist", icon: "👨‍⚕️" },
]

const DoctorsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const visibleDoctors = [
    doctors[currentIndex % doctors.length],
    doctors[(currentIndex + 1) % doctors.length],
    doctors[(currentIndex + 2) % doctors.length],
  ]
  return (
    <section className="w-full px-8 py-16 bg-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-green-500 font-medium mb-2">Meet Our Doctors</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">We're Dedicated To <br /> Your Well-Being</h2>
          {/*{("home.doctors.title")}*/}
        </motion.div>
        <div className="flex items-center gap-3 mt-6 md:mt-0">
          <button onClick={() => setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length)}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors">←</button>
          <div className="flex gap-2">
            {doctors.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-300 ${currentIndex === index ? "w-6 h-3 bg-green-500" : "w-3 h-3 bg-gray-300"}`} />
            ))}
          </div>
          <button onClick={() => setCurrentIndex((prev) => (prev + 1) % doctors.length)}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors">→</button>
        </div>
      </div>
      <div className="flex gap-6 justify-center items-stretch">
        <AnimatePresence mode="wait">
          {visibleDoctors.map((doctor, index) => (
            <motion.div
              key={currentIndex + index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-1 bg-gray-50 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-5xl border-4 border-green-100">
                {doctor.icon}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                <p className="text-green-500 font-medium text-sm">{doctor.specialty}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ==================== HOME PAGE ====================
const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <StepsSection />
      <DoctorsSection />
    </div>
  )
}

export default HomePage