import { useState } from "react"
import { Icon } from "../components/Icons"
import { AGENCIES_LIST } from "../data/mockData"
import { Page } from "../types"

interface AgenciesPageProps {
  navigate: (p: Page) => void
}

export function AgenciesPage({ navigate }: AgenciesPageProps) {
  const [selectedCity, setSelectedCity] = useState("all")

  const cities = ["all", ...new Set(AGENCIES_LIST.map((a) => a.city))]

  const filtered = selectedCity === "all"
    ? AGENCIES_LIST
    : AGENCIES_LIST.filter((a) => a.city === selectedCity)

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Hero */}
      <div className="bg-[#001733] text-white py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#FFD100] uppercase tracking-widest block">
            RED NACIONAL
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Nuestros Terminales y Agencias
          </h1>
          <p className="text-xs sm:text-base text-gray-200">
            Encuentra la agencia o terrapuerto más cercano a ti para compras presenciales, embarque y servicio de encomiendas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        {/* Selector de Ciudad */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-bold text-gray-500 mr-2">Filtrar por ciudad:</span>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCity === c
                  ? "bg-[#002855] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c === "all" ? "Todas las agencias" : c}
            </button>
          ))}
        </div>

        {/* Lista de Terminales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agency, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#002855] text-[#FFD100] text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase">
                    {agency.city}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Abierto
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#002855]">
                  {agency.name}
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <Icon name="pin" size={14} className="text-[#002855] mt-0.5 shrink-0" />
                    <span>{agency.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon name="phone" size={14} className="text-[#002855] shrink-0" />
                    <span className="font-semibold text-gray-800">{agency.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon name="clock" size={14} className="text-[#002855] shrink-0" />
                    <span>{agency.hours}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Servicios disponibles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agency.services.map((s) => (
                      <span
                        key={s}
                        className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate("results")}
                  className="w-full bg-gray-50 hover:bg-[#002855] hover:text-[#FFD100] text-[#002855] font-bold text-xs py-2.5 rounded-xl border border-gray-200 transition-all cursor-pointer text-center"
                >
                  Buscar salidas desde este terminal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

