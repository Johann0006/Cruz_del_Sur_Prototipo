import { useState } from "react"
import { Icon } from "../components/Icons"
import { ReservationTimerCard } from "../components/ReservationTimerCard"
import { SearchWidget } from "../components/SearchWidget"
import { getTripsForRoute } from "../data/mockData"
import { Page, SearchParams, SelectedSeat, Trip } from "../types"

interface ResultsPageProps {
  searchParams: SearchParams
  onUpdateSearch: (params: SearchParams) => void
  onSelectTrip: (trip: Trip) => void
  navigate: (p: Page) => void
  mode: "ida" | "regreso"
  // Para modo regreso: datos del viaje de ida ya confirmado
  selectedTrip?: Trip | null
  selectedSeats?: SelectedSeat[]
  reservationSecondsLeft?: number
}

export function ResultsPage({
  searchParams,
  onUpdateSearch,
  onSelectTrip,
  navigate,
  mode = "ida",
  selectedTrip: selectedTripIda,
  selectedSeats: selectedSeatsIda = [],
  reservationSecondsLeft = 15 * 60,
}: ResultsPageProps) {
  const [showModifySearch, setShowModifySearch] = useState(false)
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>("all")
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"time" | "price">("time")

  // Origen y Destino según el modo (Ida o Regreso)
  const currentOrigin = mode === "regreso" ? searchParams.destination : searchParams.origin
  const currentDest = mode === "regreso" ? searchParams.origin : searchParams.destination

  // La fecha a usar depende del modo
  const activeDate = mode === "regreso" ? (searchParams.returnDate || searchParams.departDate) : searchParams.departDate

  // Generar viajes dinámicos garantizados para esta ruta exacta
  const routeTrips = getTripsForRoute(currentOrigin, currentDest)

  // Generar tira de 5 fechas alrededor de la fecha seleccionada
  const baseDate = new Date(activeDate + "T12:00:00")
  const dateStrip = [-2, -1, 0, 1, 2].map((offset) => {
    const d = new Date(baseDate)
    d.setDate(baseDate.getDate() + offset)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const iso = `${y}-${m}-${day}`
    return {
      iso,
      dayName: d.toLocaleDateString("es-PE", { weekday: "short" }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString("es-PE", { month: "short" }),
      price: 79 + Math.abs(offset) * 10,
    }
  })

  // Filtrar viajes de la ruta
  let filteredTrips = routeTrips.filter((trip) => {
    if (selectedServiceFilter !== "all" && trip.service !== selectedServiceFilter) {
      return false
    }

    const hour = parseInt(trip.departTime.split(":")[0], 10)
    if (selectedTimeFilter === "morning" && (hour < 5 || hour >= 12)) return false
    if (selectedTimeFilter === "afternoon" && (hour < 12 || hour >= 18)) return false
    if (selectedTimeFilter === "night" && (hour < 18 && hour >= 5)) return false

    return true
  })

  // Ordenar
  filteredTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "price") {
      const pA = a.priceFloor2 || a.priceFloor1
      const pB = b.priceFloor2 || b.priceFloor1
      return pA - pB
    }
    return a.departTime.localeCompare(b.departTime)
  })

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-20">
      {/* Banner azul indicando modo de selección */}
      {mode === "regreso" && selectedTripIda && (
        <div className="bg-emerald-700 text-white py-2 px-4 text-xs font-semibold text-center">
          ✓ Viaje de ida confirmado: {selectedTripIda.originCity} → {selectedTripIda.destCity} · {selectedTripIda.departTime} · {selectedSeatsIda.length} {selectedSeatsIda.length === 1 ? "asiento" : "asientos"}
        </div>
      )}

      {/* Barra resumen de la ruta y fecha */}
      <div className="bg-[#002855] text-white py-4 px-4 shadow-md sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(mode === "regreso" ? "seats" : "home")}
              className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title={mode === "regreso" ? "Volver a asientos de ida" : "Volver al inicio"}
            >
              <Icon name="chevronLeft" size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 font-black text-base sm:text-lg">
                {mode === "regreso" ? (
                  <>
                    <span>{searchParams.destination}</span>
                    <Icon name="arrowRight" size={16} className="text-[#FFD100]" />
                    <span>{searchParams.origin}</span>
                    <span className="ml-2 text-xs bg-[#FFD100] text-[#002855] px-2 py-0.5 rounded-full font-black">REGRESO</span>
                  </>
                ) : (
                  <>
                    <span>{searchParams.origin}</span>
                    <Icon name="arrowRight" size={16} className="text-[#FFD100]" />
                    <span>{searchParams.destination}</span>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-300 flex items-center gap-2 mt-0.5">
                <span>
                  {new Date(activeDate + "T12:00:00").toLocaleDateString("es-PE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span className="text-[#FFD100] font-semibold">
                  {mode === "regreso" ? "Elige tu viaje de regreso" : (searchParams.tripType === "ida-vuelta" ? "Ida y Vuelta" : "Solo Ida")}
                </span>
              </div>
            </div>
          </div>

          {mode === "ida" && (
            <button
              onClick={() => setShowModifySearch(!showModifySearch)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Icon name="search" size={14} />
              <span>{showModifySearch ? "Cerrar buscador" : "Modificar búsqueda"}</span>
            </button>
          )}

          {mode === "regreso" && (
            <div className="flex items-center gap-3">
              <ReservationTimerCard secondsLeft={reservationSecondsLeft} compact />
            </div>
          )}
        </div>

        {/* Buscador desplegable para modificar parámetros (solo modo ida) */}
        {showModifySearch && mode === "ida" && (
          <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-white/10">
            <SearchWidget
              initialParams={searchParams}
              onSearch={(p) => {
                onUpdateSearch(p)
                setShowModifySearch(false)
              }}
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* Tira interactiva de 5 fechas */}
        <div className="bg-white rounded-2xl p-2 sm:p-3 border border-gray-200 shadow-sm mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-[620px]">
            {dateStrip.map((item) => {
              const isSelected = item.iso === activeDate
              return (
                <button
                  key={item.iso}
                  onClick={() => {
                    if (mode === "regreso") {
                      onUpdateSearch({ ...searchParams, returnDate: item.iso })
                    } else {
                      onUpdateSearch({ ...searchParams, departDate: item.iso })
                    }
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl border transition-all text-center cursor-pointer ${isSelected
                    ? "bg-[#002855] text-white border-[#002855] shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                >
                  <span className="block text-[11px] font-bold uppercase tracking-wider opacity-80">
                    {item.dayName} {item.dayNumber} {item.monthName}
                  </span>
                  <span
                    className={`block text-xs font-extrabold mt-0.5 ${isSelected ? "text-[#FFD100]" : "text-emerald-700"
                      }`}
                  >
                    desde S/ {item.price}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Layout Principal: Filtros laterales y Lista de viajes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Panel Lateral de Filtros */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Icon name="filter" size={16} className="text-[#002855]" />
                  <h3 className="font-extrabold text-sm text-[#002855]">
                    Filtrar Resultados
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedServiceFilter("all")
                    setSelectedTimeFilter("all")
                  }}
                  className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>

              {/* Filtro por Servicio */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2.5">
                  Tipo de Servicio
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: "all", label: "Todos los servicios" },
                    { id: "Cruzero Suite", label: "Cruzero Suite (180° Cama)" },
                    { id: "Cruzero Evolution", label: "Cruzero Evolution (160°/140°)" },
                    { id: "Confort Suite", label: "Confort Suite (160°)" },
                    { id: "Ica Line Express", label: "Ica Line Express (Directo)" },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="serviceFilter"
                        checked={selectedServiceFilter === s.id}
                        onChange={() => setSelectedServiceFilter(s.id)}
                        className="text-[#002855] focus:ring-[#002855]"
                      />
                      <span className="text-gray-700 font-medium">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro por Horario de Salida */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2.5">
                  Horario de Partida
                </label>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {[
                    { id: "all", label: "Cualquier horario", time: "24 hrs" },
                    { id: "morning", label: "Mañana", time: "05:00 - 12:00" },
                    { id: "afternoon", label: "Tarde", time: "12:00 - 18:00" },
                    { id: "night", label: "Noche", time: "18:00 - 23:59" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTimeFilter(t.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${selectedTimeFilter === t.id
                        ? "bg-[#002855] text-white border-[#002855] shadow-xs"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                    >
                      <div className="font-bold">{t.label}</div>
                      <div className="text-[10px] opacity-80">{t.time}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Aviso de seguridad */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Icon name="shield" size={15} className="text-emerald-700" />
                <span>Viaje 100% Garantizado</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Todas las salidas cuentan con choferes certificados, monitoreo GPS y cambio de boleto disponible.
              </p>
            </div>
          </div>

          {/* Lista de Viajes e Itinerarios */}
          <div className="lg:col-span-9 space-y-4">
            {/* Barra superior de ordenamiento */}
            <div className="bg-white rounded-2xl px-5 py-3 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold text-gray-700">
                Se encontraron <strong>{filteredTrips.length}</strong> salidas disponibles
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">Ordenar por:</span>
                <button
                  onClick={() => setSortBy("time")}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${sortBy === "time"
                    ? "bg-[#002855] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Horario de salida
                </button>
                <button
                  onClick={() => setSortBy("price")}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${sortBy === "price"
                    ? "bg-[#002855] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Menor precio
                </button>
              </div>
            </div>

            {/* Tarjetas de Viaje */}
            {filteredTrips.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#002855] flex items-center justify-center mx-auto">
                  <Icon name="bus" size={32} />
                </div>
                <h3 className="font-black text-lg text-[#002855]">
                  No encontramos horarios con los filtros seleccionados
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Prueba restableciendo los filtros o seleccionando otra fecha en la tira superior.
                </p>
                <button
                  onClick={() => {
                    setSelectedServiceFilter("all")
                    setSelectedTimeFilter("all")
                  }}
                  className="bg-[#002855] text-[#FFD100] font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              filteredTrips.map((trip) => {
                const startingPrice = trip.priceFloor2 || trip.priceFloor1
                return (
                  <article
                    key={trip.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-5 sm:p-6 space-y-4"
                  >
                    {/* Fila superior: Servicio, reclinación y asientos */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-black text-xs px-3 py-1 rounded-full text-white ${trip.service === "Cruzero Suite"
                            ? "bg-gradient-to-r from-[#002855] to-[#1c3d6e]"
                            : trip.service === "Cruzero Evolution"
                              ? "bg-[#005a9c]"
                              : "bg-[#002855]"
                            }`}
                        >
                          {trip.service}
                        </span>
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                          {trip.reclineFloor1}
                          {trip.reclineFloor2 ? ` / ${trip.reclineFloor2}` : ""}
                        </span>
                        {trip.direct && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            DIRECTO
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{trip.availableSeats} asientos disponibles</span>
                      </div>
                    </div>

                    {/* Fila central: Horarios, ruta y precio */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Salida */}
                      <div className="md:col-span-3 text-left">
                        <span className="text-2xl sm:text-3xl font-black text-[#002855] tracking-tight block">
                          {trip.departTime}
                        </span>
                        <strong className="text-xs font-bold text-gray-800 block mt-0.5">
                          {trip.originCity}
                        </strong>
                        <span className="text-[11px] text-gray-500 leading-tight block truncate">
                          {trip.originTerminal}
                        </span>
                      </div>

                      {/* Duración y línea gráfica */}
                      <div className="md:col-span-3 text-center flex flex-col items-center">
                        <span className="text-[11px] font-bold text-gray-500 mb-1">
                          {trip.duration}
                        </span>
                        <div className="w-full flex items-center gap-2 text-gray-300">
                          <span className="w-2.5 h-2.5 rounded-full border-2 border-[#002855] bg-white"></span>
                          <div className="flex-1 h-0.5 bg-gray-300 relative">
                            <div className="absolute left-1/2 -top-2.5 transform -translate-x-1/2 bg-white px-1 text-[#002855]">
                              <Icon name="bus" size={16} />
                            </div>
                          </div>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#002855]"></span>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">Servicio Monitoreado GPS</span>
                      </div>

                      {/* Llegada */}
                      <div className="md:col-span-3 text-left md:text-right">
                        <span className="text-2xl sm:text-3xl font-black text-[#002855] tracking-tight block">
                          {trip.arriveTime}
                        </span>
                        <strong className="text-xs font-bold text-gray-800 block mt-0.5">
                          {trip.destCity}
                        </strong>
                        <span className="text-[11px] text-gray-500 leading-tight block truncate">
                          {trip.destTerminal}
                        </span>
                      </div>

                      {/* Precio y Acción */}
                      <div className="md:col-span-3 text-right bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl flex md:flex-col items-center md:items-end justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">
                            Tarifa por pasajero
                          </span>
                          <div className="text-xl sm:text-2xl font-black text-[#002855]">
                            <span className="text-xs font-bold text-gray-500 mr-1">Desde</span>
                            S/ {startingPrice}
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectTrip(trip)}
                          className="mt-2 bg-[#FFD100] hover:bg-[#e6be00] active:scale-95 text-[#002855] font-black text-xs uppercase px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#f0c200]"
                        >
                          <span>Elegir Asientos</span>
                          <Icon name="arrowRight" size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Fila inferior: Amenidades incluidas */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                      <span className="font-bold text-gray-700">Incluye:</span>
                      {trip.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-200"
                        >
                          <Icon name="check" size={11} className="text-emerald-600" />
                          <span>{amenity}</span>
                        </span>
                      ))}
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

