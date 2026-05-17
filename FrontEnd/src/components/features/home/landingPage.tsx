import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa"
import Button from "../../ui/button"
import { useNavigate } from "react-router-dom"

// ==================== NAVBAR ====================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <nav className="w-full bg-white shadow-sm px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-green-500 text-2xl">🏥</span>
        <span className="font-bold text-gray-800 text-xl">HMS</span>
      </div>
      <ul className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
        <li className="hover:text-green-500 cursor-pointer">Home</li>
        <li className="hover:text-green-500 cursor-pointer">About</li>
        <li className="hover:text-green-500 cursor-pointer">Doctors</li>
        <li className="hover:text-green-500 cursor-pointer">Contact</li>
      </ul>
      <div className="hidden md:flex">
        <Button variant="primary" size="medium" onClick={() => navigate("/auth")}>
          🔒 Log In
        </Button>
      </div>
      <button className="md:hidden text-gray-700 text-2xl" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 md:hidden z-50"
        >
          <span className="text-gray-600 hover:text-green-500 cursor-pointer">Home</span>
          <span className="text-gray-600 hover:text-green-500 cursor-pointer">About</span>
          <span className="text-gray-600 hover:text-green-500 cursor-pointer">Doctors</span>
          <span className="text-gray-600 hover:text-green-500 cursor-pointer">Contact</span>
          <Button variant="primary" size="medium" onClick={() => navigate("/auth")}>Log In</Button>
        </motion.div>
      )}
    </nav>
  )
}

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
          <Button variant="primary" size="medium">
            📞 Book an Appointment
            {/*{("home.hero.cta")}*/}
          </Button>
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
    <section className="w-full px-8 py-16 flex flex-col md:flex-row items-center gap-6">
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
          <Button variant="primary" size="medium">Our Working Process</Button>
          {/*{("home.stats.cta")}*/}
          <Button variant="secondary" size="small">▶</Button>
          {/*{("home.stats.cta")}*/}
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
        <button className="text-green-500 text-sm font-medium">View Testimonial →</button>
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
              <Button variant="secondary" size="small">Book Appointment</Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ==================== FOOTER ====================
const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gray-800 text-white px-8 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="flex flex-col gap-4 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-2xl">🏥</span>
            <span className="font-bold text-xl">HMS</span>
          </div>
          <p className="text-gray-400 text-sm">Navigating Health Together. Your Trusted Medical Resource.</p>
          <div className="flex gap-3">
            <button className="w-9 h-9 rounded-full bg-gray-700 hover:bg-blue-600 transition-colors flex items-center justify-center">
              <FaFacebookF size={14} />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-700 hover:bg-pink-500 transition-colors flex items-center justify-center">
              <FaInstagram size={14} />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-700 hover:bg-sky-500 transition-colors flex items-center justify-center">
              <FaTwitter size={14} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-gray-400 text-sm">
            <li className="hover:text-green-400 cursor-pointer">Home</li>
            <li className="hover:text-green-400 cursor-pointer">About</li>
            <li className="hover:text-green-400 cursor-pointer">Doctors</li>
            <li className="hover:text-green-400 cursor-pointer">Contact</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg">Services</h3>
          <ul className="flex flex-col gap-2 text-gray-400 text-sm">
            <li className="hover:text-green-400 cursor-pointer">Cardiology</li>
            <li className="hover:text-green-400 cursor-pointer">Dentistry</li>
            <li className="hover:text-green-400 cursor-pointer">Neurology</li>
            <li className="hover:text-green-400 cursor-pointer">Orthopedics</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg">Contact Us</h3>
          <ul className="flex flex-col gap-2 text-gray-400 text-sm">
            <li>📍 Cairo, Egypt</li>
            <li>📞 +20 123 456 7890</li>
            <li>✉️ info@HMS.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © 2026 HMS. All rights reserved.
      </div>
    </motion.footer>
  )
}

// ==================== HOME PAGE ====================
const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <StepsSection />
      <DoctorsSection />
      <Footer />
    </div>
  )
}

export default HomePage