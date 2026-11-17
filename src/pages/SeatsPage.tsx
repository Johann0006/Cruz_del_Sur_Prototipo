import { useState } from "react"
import { BusSeatMap } from "../components/BusSeatMap"
import { Icon } from "../components/Icons"
import { ReservationTimerCard } from "../components/ReservationTimerCard"
import { Page, SearchParams, SelectedSeat, Trip } from "../types"

interface SeatsPageProps {
  trip: Trip
  searchParams: SearchParams
  selectedSeats: SelectedSeat[]
  onToggleSeat: (seat: SelectedSeat) => void
  onContinue: () => void
  navigate: (p: Page) => void
  mode: "ida" | "regreso"
  // Para modo ida: datos del viaje de regreso (si aplica, para mostrar en resumen)
  selectedTripReturn?: Trip | null
  selectedSeatsReturn?: SelectedSeat[]
  // Para modo regreso: datos del viaje de ida confirmado
  selectedTrip?: Trip | null
  selectedSeatsIda?: SelectedSeat[]
  reservationSecondsLeft?: number
}

export function SeatsPage({
  trip,
  searchParams,
  selectedSeats,
  onToggleSeat,
  onContinue,
  navigate,
  mode = "ida",
  selectedTripReturn,
  selectedSeatsReturn = [],
  selectedTrip: selectedTripIda,
  selectedSeatsIda = [],
  reservationSecondsLeft = 15 * 60,
}: SeatsPageProps) {
  const [validationWarning, setValidationWarning] = useState<string | null>(null)

  const handleContinueClick = () => {
    if (selectedSeats.length < 1) {
      setValidationWarning("Debes seleccionar al menos 1 asiento para continuar.")
      return
    }
    setValidationWarning(null)
    onContinue()
  }

  const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0)

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Barra de progreso de compra */}
      <div className="bg-white border-b border-gray-200 py-3 sm:py-4 px-4 sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 text-xs overflow-x-auto py-1">
            <div className="flex items-center gap-2 text-emerald-600 font-bold shrink-0">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
              <span className="hidden sm:inline">1. Horario {mode === "regreso" ? "Regreso" : "Ida"}</span>
            </div>
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-[#002855] font-black shrink-0">
              <span className="w-6 h-6 rounded-full bg-[#002855] text-white flex items-center justify-center text-xs">2</span>
              <span>2. Asientos {mode === "regreso" ? "Regreso" : "Ida"}</span>
            </div>
            <span className="text-gray-300">———</span>
            {searchParams.tripType === "ida-vuelta" && mode === "ida" ? (
              <>
                <div className="flex items-center gap-2 text-gray-400 font-medium shrink-0">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">3</span>
                  <span className="hidden sm:inline">3. Horario Regreso</span>
                </div>
                <span className="text-gray-300">———</span>
                <div className="flex items-center gap-2 text-gray-400 font-medium shrink-0">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">4</span>
                  <span className="hidden sm:inline">4. Asientos Regreso</span>
                </div>
                <span className="text-gray-300">———</span>
                <div className="flex items-center gap-2 text-gray-400 font-medium shrink-0">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">5</span>
                  <span className="hidden sm:inline">5. Pasajeros</span>
                </div>
              </>
            ) : mode === "regreso" ? (
              <>
                <div className="flex items-center gap-2 text-emerald-600 font-bold shrink-0">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
                  <span className="hidden sm:inline">3. Horario Regreso</span>
                </div>
                <span className="text-gray-300">———</span>
                <div className="flex items-center gap-2 text-gray-400 font-medium shrink-0">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">5</span>
                  <span className="hidden sm:inline">5. Pasajeros</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 font-medium shrink-0">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">3</span>
                <span className="hidden sm:inline">3. Pasajeros</span>
              </div>
            )}
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-gray-400 font-medium shrink-0">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                {searchParams.tripType === "ida-vuelta" ? "6" : "4"}
              </span>
              <span className="hidden sm:inline">Pago</span>
            </div>
          </div>

          {/* Card de Tiempo de Reserva Oficial */}
          <ReservationTimerCard secondsLeft={reservationSecondsLeft} compact />
        </div>
      </div>

      {/* Banner de ida confirmada (modo regreso) */}
      {mode === "regreso" && selectedTripIda && (
        <div className="bg-emerald-50 border-b border-emerald-200 py-2 px-4 text-xs text-emerald-800 text-center font-semibold">
          ✓ Viaje de ida: {selectedTripIda.originCity} → {selectedTripIda.destCity} · {selectedTripIda.departTime} · {selectedSeatsIda.length} {selectedSeatsIda.length === 1 ? "asiento" : "asientos"} · S/ {selectedSeatsIda.reduce((a, s) => a + s.price, 0).toFixed(2)}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* Encabezado */}
        <div className="mb-6">
          <button
            onClick={() => navigate(mode === "regreso" ? "results-return" : "results")}
            className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-[#002855] font-bold mb-2 cursor-pointer"
          >
            <Icon name="chevronLeft" size={16} />
            <span>Volver a horarios {mode === "regreso" ? "de regreso" : "disponibles"}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002855]">
            Selecciona tus asientos {mode === "regreso" ? "de regreso" : "de ida"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {trip.originCity} ({trip.departTime}) ➜ {trip.destCity} ({trip.arriveTime}) · {trip.service}
          </p>
        </div>

        {validationWarning && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-3">
            <Icon name="alert" size={20} className="text-red-500 shrink-0" />
            <span className="font-semibold">{validationWarning}</span>
          </div>
        )}

        {/* Layout: Mapa del Bus + Resumen Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Plano Interactivo del Bus */}
          <div className="lg:col-span-8">
            <BusSeatMap
              trip={trip}
              maxSeats={20}
              selectedSeats={selectedSeats}
              onToggleSeat={(seat) => {
                setValidationWarning(null)
                onToggleSeat(seat)
              }}
            />
          </div>

          {/* Resumen Lateral de Asientos y Costo */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-36">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md space-y-5">
              <h3 className="font-extrabold text-base text-[#002855] border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>Resumen de tu Viaje</span>
                <span className="text-xs bg-blue-50 text-[#002855] px-2.5 py-1 rounded-full font-bold">
                  {trip.service}
                </span>
              </h3>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ruta:</span>
                  <strong className="text-gray-900">
                    {trip.originCity} ➔ {trip.destCity}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Salida:</span>
                  <span className="text-gray-900 font-semibold">
                    {(mode === "regreso" ? searchParams.returnDate : searchParams.departDate) || searchParams.departDate} · {trip.departTime}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Terminal de Embarque:</span>
                  <span className="text-gray-900 text-right font-medium max-w-[200px] truncate">
                    {trip.originTerminal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Asientos seleccionados:</span>
                  <strong className="text-[#002855] font-bold">
                    {selectedSeats.length} {selectedSeats.length === 1 ? "asiento" : "asientos"}
                  </strong>
                </div>
              </div>

              {/* Asientos Seleccionados */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2.5">
                  Asientos Elegidos
                </h4>

                {selectedSeats.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-400">
                    <Icon name="seat" size={24} className="mx-auto mb-1 text-gray-300" />
                    <span>Aún no has seleccionado ningún asiento en el bus</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedSeats.map((seat) => (
                      <div
                        key={seat.number}
                        className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-[#002855] text-white font-black flex items-center justify-center text-xs">
                            {seat.number}
                          </span>
                          <div>
                            <strong className="text-[#002855]">
                              Asiento {seat.number} (Piso {seat.floor})
                            </strong>
                            <span className="block text-[10px] text-gray-500">
                              {seat.recline}
                            </span>
                          </div>
                        </div>
                        <strong className="text-[#002855] font-black">
                          S/ {seat.price}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total y Botón Continuar */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="block text-xs font-bold text-gray-500">Total Pasajes</span>
                    <span className="text-[10px] text-gray-400">IGV y tasas incluidas</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#002855]">
                      S/ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinueClick}
                  disabled={selectedSeats.length < 1}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${selectedSeats.length >= 1
                    ? "bg-[#FFD100] hover:bg-[#e6be00] text-[#002855] active:scale-98"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    }`}
                >
                  <span>
                    {mode === "regreso"
                      ? "Continuar con Datos de Pasajeros"
                      : searchParams.tripType === "ida-vuelta"
                        ? "Continuar a Horarios de Regreso"
                        : "Continuar con Datos de Pasajeros"}
                  </span>
                  <Icon name="arrowRight" size={16} />
                </button>

                <p className="text-[11px] text-gray-400 text-center leading-tight">
                  Tus asientos se reservarán durante el proceso de compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

