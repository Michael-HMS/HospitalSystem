import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "react-router-dom"
import Button from "../../ui/button"
import { AuthService } from "../../../services/auth-service"
import { ApiError } from "../../../lib/api"

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  firstname: string
  lastname: string
  email: string
  password: string
  gender: string
  phone: string
  countryCode: string
}

type AuthMode = "login" | "register" | "forgot" | "code" | "reset"

const countryCodes = [
  { code: "+20",  flag: "🇪🇬", name: "Egypt" },
  { code: "+1",   flag: "🇺🇸", name: "USA" },
  { code: "+44",  flag: "🇬🇧", name: "UK" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
  { code: "+91",  flag: "🇮🇳", name: "India" },
]

const passwordRules = [
  { label: "At least 8 characters",  check: (p: string) => p.length >= 8 },
  { label: "One number",             check: (p: string) => /[0-9]/.test(p) },
  { label: "One special character",  check: (p: string) => /[^A-Za-z0-9]/.test(p) },
  { label: "One capital letter",     check: (p: string) => /[A-Z]/.test(p) },
]

const getPasswordStrength = (password: string) => {
  const metCount = passwordRules.filter((rule) => rule.check(password)).length
  if (metCount === 1) return { label: "Weak",     color: "bg-red-400",    text: "text-red-400",    width: "w-1/4" }
  if (metCount === 2) return { label: "Moderate",  color: "bg-orange-400", text: "text-orange-400", width: "w-2/4" }
  if (metCount === 3) return { label: "Good",      color: "bg-yellow-500", text: "text-yellow-500", width: "w-3/4" }
  if (metCount === 4) return { label: "Strong",    color: "bg-green-500",  text: "text-green-500",  width: "w-full" }
  return null
}

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const navigate = useNavigate()

  // ── Login state ──
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" })
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" })

  // ── Register state ──
  const [registerData, setRegisterData] = useState<RegisterData>({
    firstname: "", lastname:"" ,email: "", password: "", gender: "", phone: "", countryCode: "+20",
  })
  const [registerErrors, setRegisterErrors] = useState({
    firstname: "", lastname: "" ,email: "", password: "", gender: "", phone: "",
  })

  // ── Forgot password state ──
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotEmailError, setForgotEmailError] = useState("")

  // ── Code state ──
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""])
  const [codeError, setCodeError] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  // ── Reset password state ──
  const [resetPassword, setResetPassword] = useState("")
  const [resetConfirm, setResetConfirm] = useState("")
  const [resetErrors, setResetErrors] = useState({ password: "", confirm: "" })

  // ── API state ──
  const [apiError, setApiError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const strength = getPasswordStrength(resetPassword)
  const registerStrength = getPasswordStrength(registerData.password)

  // ── Resend timer countdown ──
  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  // ── Generate and send code ──
  const generateAndSendCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedCode(code)
    setResendTimer(60)
    // in real app this sends to email — for now we log it
    console.log("Generated code:", code)
    alert(`Your reset code is: ${code}`) // remove this in production
  }

  // ── Validators (same as login and register) ──
  const validateEmail = (email: string) => {
    if (!email) return "Email is required"
    if (!/\S+@\S+\.\S+/.test(email) || /[A-Z]/.test(email) || /^[0-9]/.test(email) || /^[^a-zA-Z_]/.test(email)) return "Enter a valid email"
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return "Password is required"
    const allRulesMet = passwordRules.every((rule) => rule.check(password))
    if (!allRulesMet) return "Password does not meet all requirements"
    return ""
  }

  const validateLogin = () => {
    const errs = {
      email: validateEmail(loginData.email),
      password: !loginData.password
        ? "Password is required"
        : loginData.password.length < 8
        ? "Password must be at least 8 characters"
        : "",
    }
    setLoginErrors(errs)
    return !errs.email && !errs.password
  }

  const validateRegister = () => {
    const errs = { firstname: "", lastname: "" ,email: "", password: "", gender: "", phone: "" }
    let valid = true

    if (!registerData.firstname) {
      errs.firstname = "first name is required"; valid = false
    } else if (!/^[A-Za-z\s]+$/.test(registerData.firstname)) {
      errs.firstname = "Name must contain letters only"; valid = false
    } else if (registerData.firstname.length < 3) {
      errs.firstname = "Enter your name correctly"; valid = false
    }

    if (!registerData.lastname) {
      errs.lastname = "Last name is required"; valid = false
    } else if (!/^[A-Za-z\s]+$/.test(registerData.lastname)) {
      errs.lastname = "Last name must contain letters only"; valid = false
    } else if (registerData.lastname.length < 3) {
      errs.lastname = "Enter your last name correctly"; valid = false
    }

    const emailErr = validateEmail(registerData.email)
    if (emailErr) { errs.email = emailErr; valid = false }

    const pwdErr = validatePassword(registerData.password)
    if (pwdErr) { errs.password = pwdErr; valid = false }

    if (!registerData.gender) { errs.gender = "Please select a gender"; valid = false }

    if (!registerData.phone.trim()) {
      errs.phone = "Phone number is required"; valid = false
    } else if (!/^\d{7,15}$/.test(registerData.phone)) {
      errs.phone = "Enter a valid phone number (digits only)"; valid = false
    }

    setRegisterErrors(errs)
    return valid
  }

  const validateForgotEmail = () => {
    const err = validateEmail(forgotEmail)
    setForgotEmailError(err)
    return !err
  }

  const validateCode = () => {
    const entered = codeDigits.join("")
    if (entered.length < 6) {
      setCodeError("Please enter the full 6-digit code")
      return false
    }
    if (entered !== generatedCode) {
      setCodeError("Incorrect code, please try again")
      return false
    }
    setCodeError("")
    return true
  }

  const validateReset = () => {
    const errs = {
      password: validatePassword(resetPassword),
      confirm: !resetConfirm
        ? "Please confirm your password"
        : resetPassword !== resetConfirm
        ? "Passwords do not match"
        : "",
    }
    setResetErrors(errs)
    return !errs.password && !errs.confirm
  }

  // ── Code input handlers ──
  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...codeDigits]
    newCode[index] = value
    setCodeDigits(newCode)
    setCodeError("")
    if (value && index < 5) document.getElementById(`code-${index + 1}`)?.focus()
  }

  const handleCodeKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0)
      document.getElementById(`code-${index - 1}`)?.focus()
  }

  // ── Left panel content ──
  const leftContent: Record<AuthMode, { icon: string; title: string; sub: string }> = {
    login: {
      icon: "🏥",
      title: "Hello Again!",
      sub: "Welcome back! Login to access your appointments, records, and more.",
    },
    register: {
      icon: "🏥",
      title: "Welcome!",
      sub: "Create your account and join thousands of patients getting better healthcare.",
    },
    forgot: {
      icon: "📧",
      title: "Forgot Password?",
      sub: "Enter your email and we'll send you a 6-digit reset code.",
    },
    code: {
      icon: "🔑",
      title: "Check Your Email",
      sub: `We sent a 6-digit code to ${forgotEmail}`,
    },
    reset: {
      icon: "🔒",
      title: "Reset Password",
      sub: "Create a new strong password that meets all requirements.",
    },
  }

  const panel = leftContent[authMode]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex"
        style={{ minHeight: "580px" }}
      >

        {/* ── LEFT: Branding Panel ── */}
        <div className="hidden md:flex w-5/12 bg-cyan-500 flex-col items-center justify-center p-10 gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div className="text-8xl">{panel.icon}</div>
              <h2 className="text-white text-3xl font-bold">{panel.title}</h2>
              <p className="text-cyan-100 text-sm leading-relaxed">{panel.sub}</p>

              {/* toggle button only for login/register */}
              {(authMode === "login" || authMode === "register") && (
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="mt-2 border-2 border-white text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-cyan-500 transition-colors"
                >
                  {authMode === "login" ? "New here? Register" : "Already have an account?"}
                </button>
              )}

              {/* step dots for forgot flow */}
              {(authMode === "forgot" || authMode === "code" || authMode === "reset") && (
                <div className="flex items-center gap-2 mt-2">
                  {(["forgot", "code", "reset"] as AuthMode[]).map((s, i) => (
                    <div
                      key={s}
                      className={`rounded-full transition-all duration-300 ${
                        s === authMode ? "w-6 h-3 bg-white"
                        : (authMode === "code" && i === 0) || (authMode === "reset" && i <= 1)
                        ? "w-3 h-3 bg-white opacity-70"
                        : "w-3 h-3 bg-white opacity-30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Form Panel ── */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
          <div className="w-full">
            <AnimatePresence mode="wait">

              {/* ══ LOGIN ══ */}
              {authMode === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-5"
                >
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-cyan-500 text-xl">🏥</span>
                      <span className="font-bold text-gray-800">HMS</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-400 text-sm mt-1">Login to your account</p>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }); setLoginErrors({ ...loginErrors, email: "" }) }}
                        className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${loginErrors.email ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"}`}
                      />
                    </div>
                    {loginErrors.email && <p className="text-red-500 text-xs mt-0.5">⚠ {loginErrors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }); setLoginErrors({ ...loginErrors, password: "" }) }}
                        className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${loginErrors.password ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"}`}
                      />
                    </div>
                    {loginErrors.password && <p className="text-red-500 text-xs mt-0.5">⚠ {loginErrors.password}</p>}
                    <p
                      onClick={() => setAuthMode("forgot")}
                      className="text-right text-xs text-cyan-500 cursor-pointer hover:underline"
                    >
                      Forgot password?
                    </p>
                  </div>

                  <Button variant="primary" size="large" className="w-full justify-center"
                    onClick={async () => {
                      if (!validateLogin()) return
                      setApiError("")
                      setIsSubmitting(true)
                      try {
                        const res = await AuthService.login(loginData.email, loginData.password)
                        AuthService.storeSession(res.token, res.role, res.user)
                        navigate("/home")
                      } catch (err) {
                        if (err instanceof ApiError) {
                          setApiError(err.message)
                        } else {
                          setApiError("Login failed. Please try again.")
                        }
                      } finally {
                        setIsSubmitting(false)
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login →"}
                  </Button>

                  {apiError && authMode === "login" && (
                    <p className="text-red-500 text-xs text-center">⚠ {apiError}</p>
                  )}

                  <p className="text-center text-gray-400 text-sm md:hidden">
                    Don't have an account?{" "}
                    <span onClick={() => setAuthMode("register")} className="text-cyan-500 font-medium cursor-pointer">Register</span>
                  </p>

                  <p onClick={() => navigate("/")} className="text-center text-gray-400 text-xs cursor-pointer hover:text-gray-600">
                    ← Return to the previous page
                  </p>
                </motion.div>
              )}

              {/* ══ REGISTER ══ */}
              {authMode === "register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-4"
                >
                  <div className="mb-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-cyan-500 text-xl">🏥</span>
                      <span className="font-bold text-gray-800">HMS</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-400 text-sm mt-1">Join us today — it's free</p>
                  </div>

                  {/* First Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">First Name</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                      <input type="text" placeholder="Enter your first name" value={registerData.firstname}
                        onChange={(e) => { setRegisterData({ ...registerData, firstname: e.target.value }); setRegisterErrors({ ...registerErrors, firstname: "" }) }}
                        className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${registerErrors.firstname ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"}`}
                      />
                    </div>
                    {registerErrors.firstname && <p className="text-red-500 text-xs mt-0.5">⚠ {registerErrors.firstname}</p>}
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">Last Name</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👴</span>
                      <input type="text" placeholder="Enter your last name" value={registerData.lastname}
                        onChange={(e) => { setRegisterData({ ...registerData, lastname: e.target.value }); setRegisterErrors({ ...registerErrors, lastname: "" }) }}
                        className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${registerErrors.lastname ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"}`}
                      />
                    </div>
                    {registerErrors.lastname && <p className="text-red-500 text-xs mt-0.5">⚠ {registerErrors.lastname}</p>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                      <input type="email" placeholder="Enter your email" value={registerData.email}
                        onChange={(e) => { setRegisterData({ ...registerData, email: e.target.value }); setRegisterErrors({ ...registerErrors, email: "" }) }}
                        className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${registerErrors.email ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"}`}
                      />
                    </div>
                    {registerErrors.email && <p className="text-red-500 text-xs mt-0.5">⚠ {registerErrors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                      <input type="password" placeholder="Create a password" value={registerData.password}
                        onChange={(e) => { setRegisterData({ ...registerData, password: e.target.value }); setRegisterErrors({ ...registerErrors, password: "" }) }}
                        className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${registerErrors.password ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"}`}
                      />
                    </div>

                    {/* Strength bar */}
                    {registerData.password.length > 0 && registerStrength && (
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${registerStrength.color} ${registerStrength.width}`} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {passwordRules.map((rule) => {
                            const met = rule.check(registerData.password)
                            return (
                              <p key={rule.label} className={`text-xs flex items-center gap-1 ${met ? "text-green-500" : "text-gray-400"}`}>
                                {met ? "✓" : "○"} {rule.label}
                              </p>
                            )
                          })}
                        </div>
                        <p className={`text-xs font-medium ${registerStrength.text}`}>
                          Strength: {registerStrength.label}
                        </p>
                      </div>
                    )}
                    {registerErrors.password && <p className="text-red-500 text-xs mt-0.5">⚠ {registerErrors.password}</p>}
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">Gender</label>
                    <div className="flex gap-3">
                      {["male", "female"].map((g) => (
                        <button type="button" key={g}
                          onClick={() => { setRegisterData({ ...registerData, gender: g }); setRegisterErrors({ ...registerErrors, gender: "" }) }}
                          className={`flex-1 py-3 rounded-2xl text-sm font-medium border-2 transition-all capitalize ${registerData.gender === g ? "border-cyan-500 bg-cyan-50 text-cyan-600" : registerErrors.gender ? "border-red-400 bg-gray-50 text-gray-500" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-cyan-300"}`}
                        >
                          {g === "male" ? "👨 Male" : "👩 Female"}
                        </button>
                      ))}
                    </div>
                    {registerErrors.gender && <p className="text-red-500 text-xs mt-0.5">⚠ {registerErrors.gender}</p>}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <select value={registerData.countryCode}
                          onChange={(e) => setRegisterData({ ...registerData, countryCode: e.target.value })}
                          className="h-full border border-gray-200 rounded-2xl pl-3 pr-8 py-3 text-sm outline-none focus:border-cyan-500 bg-gray-50 appearance-none cursor-pointer"
                        >
                          {countryCodes.map((c) => (
                            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                          ))}
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
                        <input type="tel" placeholder="Enter your phone number" value={registerData.phone}
                          onChange={(e) => { setRegisterData({ ...registerData, phone: e.target.value }); setRegisterErrors({ ...registerErrors, phone: "" }) }}
                          className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${registerErrors.phone ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"}`}
                        />
                      </div>
                    </div>
                    {registerErrors.phone && <p className="text-red-500 text-xs mt-0.5">⚠ {registerErrors.phone}</p>}
                  </div>

                  <Button variant="primary" size="large" className="w-full justify-center"
                    onClick={async () => {
                      if (!validateRegister()) return
                      setApiError("")
                      setIsSubmitting(true)
                      try {
                        await AuthService.register(registerData.name, registerData.email, registerData.password)
                        // Auto-login after successful registration
                        const res = await AuthService.login(registerData.email, registerData.password)
                        AuthService.storeSession(res.token, res.role, res.user)
                        navigate("/home")
                      } catch (err) {
                        if (err instanceof ApiError) {
                          setApiError(err.message)
                        } else {
                          setApiError("Registration failed. Please try again.")
                        }
                      } finally {
                        setIsSubmitting(false)
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating account..." : "Create Account →"}
                  </Button>

                  {apiError && authMode === "register" && (
                    <p className="text-red-500 text-xs text-center">⚠ {apiError}</p>
                  )}

                  <p className="text-center text-gray-400 text-sm md:hidden">
                    Already have an account?{" "}
                    <span onClick={() => setAuthMode("login")} className="text-cyan-500 font-medium cursor-pointer">Login</span>
                  </p>

                  <p onClick={() => navigate("/")} className="text-center text-gray-400 text-xs cursor-pointer hover:text-gray-600">
                    ← Return to the previous page
                  </p>
                </motion.div>
              )}

              {/* ══ FORGOT — Step 1: Email ══ */}
              {authMode === "forgot" && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-cyan-500 text-xl">🏥</span>
                      <span className="font-bold text-gray-800">HMS</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
                    <p className="text-gray-400 text-sm mt-1">Enter your email to receive a reset code</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={(e) => { setForgotEmail(e.target.value); setForgotEmailError("") }}
                        className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${forgotEmailError ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"}`}
                      />
                    </div>
                    {forgotEmailError && <p className="text-red-500 text-xs mt-0.5">⚠ {forgotEmailError}</p>}
                  </div>

                  <Button variant="primary" size="large" className="w-full justify-center"
                    onClick={() => {
                      if (validateForgotEmail()) {
                        generateAndSendCode()
                        setCodeDigits(["", "", "", "", "", ""])
                        setCodeError("")
                        setAuthMode("code")
                      }
                    }}>
                    Send Reset Code →
                  </Button>

                  <p onClick={() => setAuthMode("login")} className="text-center text-gray-400 text-xs cursor-pointer hover:text-gray-600">
                    ← Back to Login
                  </p>
                </motion.div>
              )}

              {/* ══ FORGOT — Step 2: Code ══ */}
              {authMode === "code" && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-cyan-500 text-xl">🏥</span>
                      <span className="font-bold text-gray-800">HMS</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Enter Code</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      We sent a 6-digit code to{" "}
                      <span className="text-cyan-500 font-medium">{forgotEmail}</span>
                    </p>
                  </div>

                  {/* 6 digit boxes */}
                  <div className="flex gap-3 justify-between">
                    {codeDigits.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(e.target.value, index)}
                        onKeyDown={(e) => handleCodeKeyDown(e, index)}
                        className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-2xl outline-none transition-all bg-gray-50 ${
                          digit ? "border-cyan-500 text-cyan-600"
                          : codeError ? "border-red-400"
                          : "border-gray-200 focus:border-cyan-500"
                        }`}
                      />
                    ))}
                  </div>
                  {codeError && <p className="text-red-500 text-xs">⚠ {codeError}</p>}

                  <Button variant="primary" size="large" className="w-full justify-center"
                    onClick={() => { if (validateCode()) { setResetPassword(""); setResetConfirm(""); setAuthMode("reset") } }}>
                    Verify Code →
                  </Button>

                  {/* Resend button with timer */}
                  <p className="text-center text-gray-400 text-sm">
                    Didn't receive it?{" "}
                    {resendTimer > 0 ? (
                      <span className="text-gray-400 font-medium">
                        Resend in {resendTimer}s
                      </span>
                    ) : (
                      <span
                        onClick={() => { generateAndSendCode(); setCodeDigits(["", "", "", "", "", ""]); setCodeError("") }}
                        className="text-cyan-500 font-medium cursor-pointer hover:underline"
                      >
                        Resend code
                      </span>
                    )}
                  </p>

                  <p onClick={() => setAuthMode("forgot")} className="text-center text-gray-400 text-xs cursor-pointer hover:text-gray-600">
                    ← Back
                  </p>
                </motion.div>
              )}

              {/* ══ FORGOT — Step 3: Reset Password ══ */}
              {authMode === "reset" && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-cyan-500 text-xl">🏥</span>
                      <span className="font-bold text-gray-800">HMS</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-400 text-sm mt-1">Create a strong new password</p>
                  </div>

                  {/* New Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">New Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={resetPassword}
                        onChange={(e) => { setResetPassword(e.target.value); setResetErrors({ ...resetErrors, password: "" }) }}
                        className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${resetErrors.password ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"}`}
                      />
                    </div>

                    {/* Strength bar — same as register */}
                    {resetPassword.length > 0 && strength && (
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {passwordRules.map((rule) => {
                            const met = rule.check(resetPassword)
                            return (
                              <p key={rule.label} className={`text-xs flex items-center gap-1 ${met ? "text-green-500" : "text-gray-400"}`}>
                                {met ? "✓" : "○"} {rule.label}
                              </p>
                            )
                          })}
                        </div>
                        <p className={`text-xs font-medium ${strength.text}`}>
                          Strength: {strength.label}
                        </p>
                      </div>
                    )}
                    {resetErrors.password && <p className="text-red-500 text-xs mt-0.5">⚠ {resetErrors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                      <input
                        type="password"
                        placeholder="Confirm your new password"
                        value={resetConfirm}
                        onChange={(e) => { setResetConfirm(e.target.value); setResetErrors({ ...resetErrors, confirm: "" }) }}
                        className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all bg-gray-50 ${
                          resetErrors.confirm ? "border-red-400 focus:ring-2 focus:ring-red-100"
                          : resetConfirm && resetConfirm === resetPassword ? "border-green-400 focus:ring-2 focus:ring-green-100"
                          : "border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        }`}
                      />
                    </div>

                    {/* Match indicator */}
                    {resetConfirm.length > 0 && (
                      <p className={`text-xs mt-0.5 ${resetConfirm === resetPassword ? "text-green-500" : "text-red-500"}`}>
                        {resetConfirm === resetPassword ? "✓ Passwords match" : "⚠ Passwords do not match"}
                      </p>
                    )}
                    {resetErrors.confirm && <p className="text-red-500 text-xs mt-0.5">⚠ {resetErrors.confirm}</p>}
                  </div>

                  <Button variant="primary" size="large" className="w-full justify-center"
                    onClick={() => {
                      if (validateReset()) {
                        console.log("Password reset done!")
                        setAuthMode("login")
                      }
                    }}>
                    Reset Password →
                  </Button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </motion.div>
    </div>
  )
}

export default AuthPage