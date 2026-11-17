import { useState } from "react"
import { Icon } from "../components/Icons"
import { Page } from "../types"

interface ClubPageProps {
  navigate: (p: Page) => void
}

export function ClubPage({ navigate }: ClubPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login")

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Register state
  const [regData, setRegData] = useState({
    dni: "",
    name: "",
    last: "",
    email: "",
    phone: "",
    password: "",
  })
  const [regSuccess, setRegSuccess] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Por favor ingresa tu correo y contraseña.")
      return
    }
    setLoginError(null)
    setLoginSuccess(true)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(regData).some((v) => !v.trim())) {
      setRegError("Todos los campos marcados con asterisco son obligatorios.")
      return
    }
    if (!/^\d{8}$/.test(regData.dni.trim())) {
      setRegError("El DNI debe tener 8 dígitos numéricos.")
      return
    }
    setRegError(null)
    setRegSuccess(true)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Hero */}
      <div className="bg-[#001733] text-white py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#FFD100] uppercase tracking-widest block">
            PASAJERO FRECUENTE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Club Cruz del Sur
          </h1>
          <p className="text-xs sm:text-base text-gray-200">
            Únete a nuestro programa de fidelidad, acumula kilómetros en cada viaje y canjéalos por pasajes gratis y beneficios exclusivos.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulario de Login / Registro */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
            <div className="flex bg-gray-100 p-1.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("login")
                  setLoginError(null)
                  setRegError(null)
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-[#002855] text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register")
                  setLoginError(null)
                  setRegError(null)
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                  mode === "register"
                    ? "bg-[#002855] text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Registrarme Gratis
              </button>
            </div>

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h3 className="font-black text-lg text-[#002855]">
                  Bienvenido de vuelta
                </h3>

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                    {loginError}
                  </div>
                )}

                {loginSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs space-y-2">
                    <strong className="text-sm font-bold block">
                      ¡Sesión iniciada con éxito!
                    </strong>
                    <p>Tienes <strong>2,480 Kilómetros acumulados</strong> en el Club Cruz del Sur.</p>
                    <button
                      onClick={() => navigate("results")}
                      className="mt-2 bg-[#002855] text-[#FFD100] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Comprar pasaje con descuento Club
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        placeholder="ejemplo@correo.com"
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        value={loginPassword}
                        placeholder="••••••••"
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-[#002855]" defaultChecked />
                        <span className="text-gray-600">Recordar mi cuenta</span>
                      </label>
                      <a href="#recuperar" className="text-blue-700 hover:underline">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FFD100] hover:bg-[#e6be00] text-[#002855] font-black text-xs uppercase py-3.5 rounded-xl shadow cursor-pointer transition-all"
                    >
                      Ingresar al Club
                    </button>
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <h3 className="font-black text-lg text-[#002855]">
                  Únete al Club Cruz del Sur
                </h3>

                {regError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                    {regError}
                  </div>
                )}

                {regSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs space-y-2">
                    <strong className="text-sm font-bold block">
                      ¡Bienvenido al Club Cruz del Sur!
                    </strong>
                    <p>
                      Tu cuenta ha sido creada y te acreditamos <strong>500 Kilómetros de bienvenida</strong> para tu próximo viaje.
                    </p>
                    <button
                      onClick={() => navigate("results")}
                      className="mt-2 bg-[#002855] text-[#FFD100] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Comenzar a viajar
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          DNI (8 dígitos) *
                        </label>
                        <input
                          type="text"
                          maxLength={8}
                          value={regData.dni}
                          placeholder="72845136"
                          onChange={(e) => setRegData({ ...regData, dni: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Celular *
                        </label>
                        <input
                          type="tel"
                          maxLength={9}
                          value={regData.phone}
                          placeholder="993555276"
                          onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Nombres *
                        </label>
                        <input
                          type="text"
                          value={regData.name}
                          placeholder="Nombres"
                          onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Apellidos *
                        </label>
                        <input
                          type="text"
                          value={regData.last}
                          placeholder="Apellidos"
                          onChange={(e) => setRegData({ ...regData, last: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        value={regData.email}
                        placeholder="tu@correo.com"
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Crea tu Contraseña *
                      </label>
                      <input
                        type="password"
                        value={regData.password}
                        placeholder="Mínimo 6 caracteres"
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FFD100] hover:bg-[#e6be00] text-[#002855] font-black text-xs uppercase py-3.5 rounded-xl shadow cursor-pointer transition-all"
                    >
                      Registrarme y Obtener 500 Puntos
                    </button>
                  </>
                )}
              </form>
            )}
          </div>

          {/* Beneficios del Programa */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-5">
              <h3 className="font-black text-lg text-[#002855]">
                Beneficios por Categoría
              </h3>

              <div className="space-y-4">
                {[
                  {
                    tier: "Clásico",
                    color: "border-gray-300 bg-gray-50",
                    badge: "Nivel Inicial",
                    benefits: "Acumula 1 km por cada sol en pasajes terrestres y carga.",
                  },
                  {
                    tier: "Plata",
                    color: "border-blue-200 bg-blue-50/50",
                    badge: "Desde 5,000 km",
                    benefits: "10% de bono en acumulación y prioridad de abordaje en terminales.",
                  },
                  {
                    tier: "Platino",
                    color: "border-amber-300 bg-amber-50/50",
                    badge: "Desde 12,000 km",
                    benefits: "Acceso libre a Salas VIP en Lima y Arequipa, 5 kg extra de equipaje.",
                  },
                  {
                    tier: "Diamante",
                    color: "border-purple-300 bg-purple-50/50",
                    badge: "Nivel Elite",
                    benefits: "Canje preferencial, upgrade a Cruzero Suite y atención personalizada.",
                  },
                ].map((item) => (
                  <div
                    key={item.tier}
                    className={`p-4 rounded-2xl border ${item.color} space-y-1`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-black text-[#002855]">
                        Club {item.tier}
                      </strong>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.benefits}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

