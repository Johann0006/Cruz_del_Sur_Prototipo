import { useState } from "react"
import { Icon } from "../components/Icons"
import { CITIES } from "../data/mockData"
import { Page, SearchParams } from "../types"

interface DestinationsPageProps {
  navigate: (p: Page) => void
  onSelectDestination: (params: SearchParams) => void
}

export function DestinationsPage({
  navigate,
  onSelectDestination,
}: DestinationsPageProps) {
  const [regionFilter, setRegionFilter] = useState<"todas" | "costa" | "sierra" | "selva">("todas")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCities = CITIES.filter((city) => {
    const matchesRegion = regionFilter === "todas" || city.region === regionFilter
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRegion && matchesSearch
  })

  const handleBuy = (destName: string) => {
    const today = new Date().toISOString().split("T")[0]
    onSelectDestination({
      tripType: "ida",
      origin: "Lima",
      destination: destName,
      departDate: today,
      passengerCount: 1,
    })
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Hero de Destinos */}
      <div className="bg-[#001733] text-white py-14 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1800&q=80')`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#FFD100] uppercase tracking-widest block">
            CONECTANDO EL PERÚ
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Destinos que te esperan
          </h1>
          <p className="text-xs sm:text-base text-gray-200">
            Descubre las maravillas de la Costa, Sierra y Selva peruana con la flota más segura y confortable.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Tabs por Región */}
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
            {[
              { id: "todas", label: "Todos los destinos" },
              { id: "costa", label: "Costa" },
              { id: "sierra", label: "Sierra" },
              { id: "selva", label: "Selva" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRegionFilter(tab.id as any)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  regionFilter === tab.id
                    ? "bg-[#002855] text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Campo de Búsqueda Rápida */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ciudad o región..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Icon name="search" size={14} />
            </div>
          </div>
        </div>

        {/* Grilla de Destinos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/90 via-[#002855]/30 to-transparent" />

                <span className="absolute top-3 left-3 bg-[#002855]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/20">
                  {city.region.toUpperCase()} · {city.department}
                </span>

                <span className="absolute bottom-3 left-3 bg-[#FFD100] text-[#002855] font-black text-xs px-3 py-1 rounded-full shadow">
                  Desde S/ {city.startingPrice}
                </span>

                <span className="absolute bottom-3 right-3 text-white text-xs font-semibold bg-black/40 px-2 py-0.5 rounded">
                  {city.durationHours > 0 ? `~${city.durationHours} hrs` : "Diario"}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#002855]">
                    {city.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {city.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-500">
                    <Icon name="pin" size={13} className="text-[#002855]" />
                    <span className="truncate">{city.terminal}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Saliendo desde <strong>Lima</strong>
                  </span>
                  <button
                    onClick={() => handleBuy(city.name)}
                    className="bg-[#002855] hover:bg-[#073366] text-[#FFD100] text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Comprar pasaje</span>
                    <Icon name="arrowRight" size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

