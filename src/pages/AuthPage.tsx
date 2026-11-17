import { useState } from "react"
import { Icon } from "../components/Icons"
import { ReservationTimerCard } from "../components/ReservationTimerCard"
import { loginUser, saveNewUser } from "../services/authService"
import { consultarDniReniec, validarCorreoAwesome } from "../services/apiValidationService"
import { Page, UserAccount } from "../types"

interface AuthPageProps {
  onAuthSuccess: (user: UserAccount) => void
  navigate: (p: Page) => void
  returnTo?: Page
  reservationSecondsLeft?: number
}

export function AuthPage({
  onAuthSuccess,
  navigate,
  returnTo = "seats",
  reservationSecondsLeft = 15 * 60,
}: AuthPageProps) {
  const [tab, setTab] = useState<"login" | "register">("login")

  // Estado de Login
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

  // Estado de Registro
  const [registerData, setRegisterData] = useState({
    dni: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "Masculino" as "Masculino" | "Femenino",
    nationality: "Peruana",
    phone: "",
    email: "",
    password: "",
  })

  // Estados de consulta y validación por API
  const [isSearchingDni, setIsSearchingDni] = useState(false)
  const [dniFeedback, setDniFeedback] = useState<string | null>(null)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Consulta de DNI en RENIEC al presionar Enter o botón de consulta
  const handleDniLookup = async () => {
    const cleanDni = registerData.dni.replace(/\D/g, "").trim()
    if (cleanDni.length !== 8) {
      setErrorMessage("Por favor ingresa los 8 dígitos del DNI para consultar en RENIEC.")
      return
    }

    setErrorMessage(null)
    setIsSearchingDni(true)
    setDniFeedback("Consultando RENIEC...")

    const res = await consultarDniReniec(cleanDni)
    setIsSearchingDni(false)

    if (res.success && res.data) {
      setRegisterData((prev) => ({
        ...prev,
        firstName: res.data!.names,
        lastName: res.data!.surnames,
        birthDate: res.data!.birthDate,
        gender: res.data!.gender,
      }))
      setDniFeedback("✓ Datos obtenidos de RENIEC exitosamente")
      setTimeout(() => setDniFeedback(null), 4000)
    } else {
      setDniFeedback(null)
      setErrorMessage(res.error || "No se encontró información para el DNI ingresado.")
    }
  }

  // Validación de correo con EmailAwesome al salir del campo
  const handleEmailValidation = async () => {
    const email = registerData.email.trim()
    if (!email) return

    setIsCheckingEmail(true)
    setEmailFeedback("Validando correo...")
    const res = await validarCorreoAwesome(email)
    setIsCheckingEmail(false)

    if (!res.isValid) {
      setEmailFeedback(null)
      setErrorMessage(res.message)
    } else {
      setEmailFeedback("✓ Correo verificado")
      setTimeout(() => setEmailFeedback(null), 3000)
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage("Por favor ingresa tu correo electrónico y contraseña.")
      return
    }

    const res = loginUser(loginEmail, loginPassword)
    if (!res.success || !res.user) {
      setErrorMessage(res.error || "Credenciales incorrectas.")
      return
    }

    onAuthSuccess(res.user)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Validaciones de campos
    if (!registerData.dni.trim() || !/^\d{8}$/.test(registerData.dni.trim())) {
      setErrorMessage("El DNI debe tener exactamente 8 dígitos numéricos.")
      return
    }
    if (!registerData.firstName.trim() || registerData.firstName.trim().length < 2) {
      setErrorMessage("Por favor ingresa tus nombres completos (o presiona Enter en el DNI).")
      return
    }
    if (!registerData.lastName.trim() || registerData.lastName.trim().length < 2) {
      setErrorMessage("Por favor ingresa tus apellidos completos.")
      return
    }
    if (!registerData.birthDate) {
      setErrorMessage("Por favor ingresa tu fecha de nacimiento.")
      return
    }
    if (!registerData.phone.trim() || !/^9\d{8}$/.test(registerData.phone.trim())) {
      setErrorMessage("El celular debe tener 9 dígitos y comenzar con 9.")
      return
    }
    if (
      !registerData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email.trim())
    ) {
      setErrorMessage("Ingresa un correo electrónico con formato válido.")
      return
    }
    if (!registerData.password || registerData.password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    // Validación oficial de correo mediante EmailAwesome
    setIsCheckingEmail(true)
    const emailRes = await validarCorreoAwesome(registerData.email)
    setIsCheckingEmail(false)

    if (!emailRes.isValid) {
      setErrorMessage(emailRes.message)
      return
    }

    const res = saveNewUser(registerData)
    if (!res.success || !res.user) {
      setErrorMessage(res.error || "Error al registrar la cuenta.")
      return
    }

    setSuccessMessage("¡Cuenta creada exitosamente! Iniciando sesión...")
    setTimeout(() => {
      onAuthSuccess(res.user!)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Barra de progreso de compra */}
      <div className="bg-white border-b border-gray-200 py-3 sm:py-4 px-4 sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 text-xs overflow-x-auto py-1">
            <div className="flex items-center gap-2 text-emerald-600 font-bold shrink-0">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                ✓
              </span>
              <span className="hidden sm:inline">1. Horario</span>
            </div>
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-emerald-600 font-bold shrink-0">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                ✓
              </span>
              <span className="hidden sm:inline">2. Asientos</span>
            </div>
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-[#002855] font-black shrink-0">
              <span className="w-6 h-6 rounded-full bg-[#002855] text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>3. Identificación</span>
            </div>
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-gray-400 font-medium shrink-0">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                4
              </span>
              <span className="hidden sm:inline">4. Pasajeros</span>
            </div>
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-gray-400 font-medium shrink-0">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                5
              </span>
              <span className="hidden sm:inline">5. Pago</span>
            </div>
          </div>

          {/* Card de Tiempo de Reserva Oficial */}
          <ReservationTimerCard secondsLeft={reservationSecondsLeft} compact />
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-6">
        <button
          type="button"
          onClick={() => navigate(returnTo)}
          className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-[#002855] font-bold mb-4 cursor-pointer"
        >
          <Icon name="chevronLeft" size={16} />
          <span>Volver a asientos</span>
        </button>

        {/* Tarjeta de Autenticación Idéntica a la Imagen de Referencia */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100">
          {/* Tabs: Iniciar Sesión / Registrarme Gratis */}
          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setTab("login")
                setErrorMessage(null)
              }}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${tab === "login"
                ? "bg-[#002855] text-white shadow-md"
                : "text-gray-700 hover:text-black"
                }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("register")
                setErrorMessage(null)
              }}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${tab === "register"
                ? "bg-[#002855] text-white shadow-md"
                : "text-gray-700 hover:text-black"
                }`}
            >
              Registrarme Gratis
            </button>
          </div>

          {/* Alertas de error y éxito */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2.5">
              <Icon name="alert" size={18} className="text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2.5">
              <Icon name="check" size={18} className="text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* FORMULARIO DE INICIAR SESIÓN                              */}
          {/* ========================================================= */}
          {tab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#002855] tracking-tight">
                Bienvenido de vuelta
              </h2>
              <p className="text-xs text-gray-500">
                Inicia sesión con tu cuenta para continuar con tu compra de pasajes.
              </p>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  CORREO ELECTRÓNICO *
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  CONTRASEÑA *
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                />
              </div>

              {/* Opciones adicionales: Recordar y Olvidé contraseña */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#002855] focus:ring-[#002855] w-4 h-4 cursor-pointer"
                  />
                  <span>Recordar mi cuenta</span>
                </label>

                <a
                  href="#olvide-contrasena"
                  onClick={(e) => {
                    e.preventDefault()
                    alert("Se ha enviado un enlace de recuperación a tu correo electrónico.")
                  }}
                  className="text-blue-700 hover:text-[#002855] font-semibold hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón INGRESAR Amarillo Idéntico a la Imagen */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 bg-[#FFD100] hover:bg-[#e6be00] active:scale-98 text-[#002855] font-black text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#f0c200]"
                >
                  <span>INGRESAR</span>
                </button>
              </div>

              {/* Nota de ayuda para prueba rápida */}
              <div className="p-3 bg-blue-50/60 rounded-xl text-[11px] text-[#002855] border border-blue-100 flex items-center justify-between">
                <span>¿Cuenta demo rápida? Usa:</span>
                <span className="font-mono font-bold text-xs">juan.perez@gmail.com / password123</span>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* FORMULARIO DE REGISTRARME GRATIS                          */}
          {/* ========================================================= */}
          {tab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#002855] tracking-tight">
                Crea tu cuenta Cruz del Sur
              </h2>
              <p className="text-xs text-gray-500">
                Regístrate con tus datos oficiales. Esta información se usará para el titular de la compra.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* DNI con consulta RENIEC automática */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      DNI (RENIEC) *
                    </label>
                    <span className="text-[10px] text-blue-600 font-semibold">
                      Presiona Enter ↵
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={8}
                      value={registerData.dni}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleDniLookup()
                        }
                      }}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          dni: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="8 dígitos (ej. 70123456)"
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-3.5 pr-20 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleDniLookup}
                      disabled={isSearchingDni || registerData.dni.length !== 8}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-[#002855] hover:bg-[#073366] disabled:bg-gray-300 text-[#FFD100] disabled:text-gray-500 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSearchingDni ? (
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <span>Buscar</span>
                      )}
                    </button>
                  </div>
                  {dniFeedback && (
                    <span className="block text-[10px] font-bold text-emerald-600 mt-1">
                      {dniFeedback}
                    </span>
                  )}
                </div>

                {/* Celular */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    CELULAR *
                  </label>
                  <input
                    type="tel"
                    maxLength={9}
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        phone: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="9 dígitos"
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                  />
                </div>

                {/* Nombres */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    NOMBRES *
                  </label>
                  <input
                    type="text"
                    value={registerData.firstName}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="Ej. Juan Alberto"
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                  />
                </div>

                {/* Apellidos */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    APELLIDOS *
                  </label>
                  <input
                    type="text"
                    value={registerData.lastName}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Ej. Pérez Álvarez"
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                  />
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    FECHA DE NACIMIENTO *
                  </label>
                  <input
                    type="date"
                    value={registerData.birthDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        birthDate: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                  />
                </div>

                {/* Género */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    GÉNERO *
                  </label>
                  <select
                    value={registerData.gender}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        gender: e.target.value as any,
                      })
                    }
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>

                {/* Nacionalidad */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    NACIONALIDAD *
                  </label>
                  <select
                    value={registerData.nationality}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        nationality: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Peruana">Peruana</option>
                    <option value="Extranjera">Extranjera</option>
                  </select>
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    CONTRASEÑA *
                  </label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Correo Electrónico con validación EmailAwesome */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    CORREO ELECTRÓNICO *
                  </label>
                  {isCheckingEmail && (
                    <span className="text-[10px] text-blue-600 font-medium animate-pulse">
                      Validando correo...
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  value={registerData.email}
                  onBlur={handleEmailValidation}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                />
                {emailFeedback && (
                  <span className="block text-[10px] font-bold text-emerald-600 mt-1">
                    {emailFeedback}
                  </span>
                )}
              </div>

              {/* Botón REGISTRARME */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 bg-[#FFD100] hover:bg-[#e6be00] active:scale-98 text-[#002855] font-black text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#f0c200]"
                >
                  <span>REGISTRARME</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
