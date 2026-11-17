import { useState } from "react"
import { Icon } from "../components/Icons"
import { Page } from "../types"

interface ChangesPageProps {
  navigate: (p: Page) => void
}

export function ChangesPage({ navigate }: ChangesPageProps) {
  const [code, setCode] = useState("")
  const [dni, setDni] = useState("")
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !dni.trim()) {
      setError("Por favor completa el código de reserva y el número de documento.")
      return
    }
    setError(null)
    setSearched(true)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Hero */}
      <div className="bg-[#001733] text-white py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#FFD100] uppercase tracking-widest block">
            GESTIÓN DE VIAJES
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Cambios y Devoluciones
          </h1>
          <p className="text-xs sm:text-base text-gray-200">
            Consulta el estado de tu boleto electrónico, reprograma tu fecha de viaje o gestiona tu devolución según tu tarifa.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-8">
        {/* Formulario de Consulta */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
          <h2 className="text-lg font-black text-[#002855] border-b border-gray-100 pb-3 flex items-center gap-2">
            <Icon name="search" size={18} className="text-[#002855]" />
            <span>Busca tu Boleto Electrónico</span>
          </h2>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
              <Icon name="alert" size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Código de Reserva (PNR) *
              </label>
              <input
                type="text"
                value={code}
                placeholder="Ej. CDS-7842-PE"
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  setError(null)
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 tracking-wider uppercase focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Número de Documento (DNI/CE/Pasaporte) *
              </label>
              <input
                type="text"
                value={dni}
                placeholder="Documento del pasajero titular"
                onChange={(e) => {
                  setDni(e.target.value)
                  setError(null)
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#FFD100] hover:bg-[#e6be00] text-[#002855] font-black text-xs uppercase px-8 py-3.5 rounded-xl shadow cursor-pointer transition-all"
              >
                Buscar Boleto
              </button>
            </div>
          </form>

          {searched && (
            <div className="mt-6 p-5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#002855] text-sm">
                  Boleto Encontrado: {code || "CDS-7842-PE"}
                </span>
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                  Vigente / Habilitado para cambio
                </span>
              </div>
              <p className="text-gray-700">
                Ruta: <strong>Lima (Javier Prado) ➔ Arequipa</strong> · Tarifa Regular · Pasajero titular: DNI {dni || "72845136"}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => alert("Tu solicitud de reprogramación fue iniciada. Un asesor de Cruz del Sur te contactará en breve.")}
                  className="bg-[#002855] text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-[#073366]"
                >
                  Reprogramar fecha de viaje
                </button>
                <button
                  onClick={() => alert("Solicitud de devolución registrada conforme a políticas de Tarifa Regular.")}
                  className="bg-white border border-gray-300 text-gray-700 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  Solicitar Devolución
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Políticas Oficiales de Cambios y Devoluciones */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
          <h3 className="text-base font-black text-[#002855] uppercase tracking-wider">
            Términos y Plazos Oficiales Cruz del Sur
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <strong className="text-sm font-black text-[#002855] block">
                Tarifa Regular
              </strong>
              <p className="text-gray-600 leading-relaxed">
                • <strong>Cambios de fecha o ruta:</strong> Se pueden realizar hasta con <strong>6 horas de anticipación</strong> a la salida del bus sin costo adicional.<br />
                • <strong>Devoluciones:</strong> Se pueden gestionar hasta con <strong>12 horas de anticipación</strong> aplicando una retención administrativa reglamentaria.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <strong className="text-sm font-black text-[#002855] block">
                Tarifas Promocionales / Ocasión
              </strong>
              <p className="text-gray-600 leading-relaxed">
                • <strong>Cambios:</strong> Sujeto a penalidad del 20% y pago de diferencia tarifaria con 24 horas de antelación.<br />
                • <strong>Devoluciones:</strong> Las tarifas no reembolsables de promoción no aplican para devolución en efectivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

