import { useState } from "react"
import { Icon, LibroReclamacionesLogo } from "../components/Icons"
import { Page } from "../types"

interface ContactPageProps {
  navigate: (p: Page) => void
}

export function ContactPage({ navigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Consulta de Pasajes",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Por favor completa los campos obligatorios (*).")
      return
    }
    setError(null)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Hero */}
      <div className="bg-[#001733] text-white py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#FFD100] uppercase tracking-widest block">
            ATENCIÓN AL CLIENTE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Estamos para ayudarte
          </h1>
          <p className="text-xs sm:text-base text-gray-200">
            Comunícate con nuestra central telefónica, visítanos en nuestros terminales o envíanos un mensaje en línea.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulario de Mensaje */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-[#002855] border-b border-gray-100 pb-3">
              Envíanos una consulta
            </h2>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <Icon name="check" size={24} />
                </div>
                <strong className="text-base font-black block">
                  ¡Mensaje enviado con éxito!
                </strong>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Hemos recibido tu consulta. Un asesor de atención al cliente de Cruz del Sur te responderá al correo <strong>{formData.email}</strong> en un plazo máximo de 24 horas.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#002855] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Nombres y Apellidos *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      placeholder="Juan Pérez"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      placeholder="juan@correo.com"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Teléfono Móvil
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      placeholder="993555276"
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Motivo de Contacto
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white cursor-pointer"
                    >
                      <option value="Consulta de Pasajes">Consulta de Pasajes</option>
                      <option value="Cambios y Reprogramaciones">Cambios y Reprogramaciones</option>
                      <option value="Cargo y Encomiendas">Cargo y Encomiendas</option>
                      <option value="Club Pasajero Frecuente">Club Pasajero Frecuente</option>
                      <option value="Servicios Corporativos">Servicios Corporativos</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Mensaje o Consulta *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    placeholder="Describe en qué podemos ayudarte..."
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white resize-y"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-[#FFD100] hover:bg-[#e6be00] text-[#002855] font-black text-xs uppercase px-8 py-3.5 rounded-xl shadow cursor-pointer transition-all"
                >
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>

          {/* Información Institucional de Contacto */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#002855] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="font-black text-lg text-[#FFD100]">
                Canales de Atención Directa
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FFD100] shrink-0">
                    <Icon name="phone" size={18} />
                  </div>
                  <div>
                    <strong className="block text-sm text-white">Fonobus (Central Telefónica)</strong>
                    <span className="text-[#FFD100] font-bold text-base block">(01) 311-5050</span>
                    <span className="text-gray-300 text-[11px]">Lunes a Domingo: 06:00 a 23:00</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Icon name="whatsapp" size={18} />
                  </div>
                  <div>
                    <strong className="block text-sm text-white">WhatsApp de Consultas</strong>
                    <span className="text-emerald-400 font-bold text-base block">+51 993 555 276</span>
                    <span className="text-gray-300 text-[11px]">Atención de dudas y cotizaciones rápidas</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FFD100] shrink-0">
                    <Icon name="pin" size={18} />
                  </div>
                  <div>
                    <strong className="block text-sm text-white">Sede Central Lima</strong>
                    <span className="text-gray-200 block">Av. Javier Prado Este 1109, La Victoria - Lima</span>
                    <span className="text-gray-300 text-[11px]">Embarque, boletería y atención al cliente las 24 horas</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <LibroReclamacionesLogo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

