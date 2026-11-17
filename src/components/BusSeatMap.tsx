import { useState } from "react"
import { SelectedSeat, Trip } from "../types"
import { Icon } from "./Icons"

interface BusSeatMapProps {
  trip: Trip
  maxSeats: number
  selectedSeats: SelectedSeat[]
  onToggleSeat: (seat: SelectedSeat) => void
}

export function BusSeatMap({
  trip,
  maxSeats,
  selectedSeats,
  onToggleSeat,
}: BusSeatMapProps) {
  const [currentFloor, setCurrentFloor] = useState<1 | 2>(1)

  // Asientos predefinidos ocupados para simular demanda real
  const occupiedFloor1 = [2, 5, 9, 12]
  const occupiedFloor2 = [3, 4, 7, 11, 15, 18, 22, 25, 31, 35]

  // Configuración de asientos por piso
  const floor1Seats = Array.from({ length: 16 }, (_, i) => i + 1)
  const floor2Seats = Array.from({ length: 36 }, (_, i) => i + 17)

  const isOccupied = (seatNum: number, floor: 1 | 2) => {
    return floor === 1
      ? occupiedFloor1.includes(seatNum)
      : occupiedFloor2.includes(seatNum)
  }

  const isSelected = (seatNum: number) => {
    return selectedSeats.some((s) => s.number === seatNum)
  }

  const handleSeatClick = (seatNum: number, floor: 1 | 2) => {
    if (isOccupied(seatNum, floor)) return

    const price =
      floor === 1 ? trip.priceFloor1 : trip.priceFloor2 || trip.priceFloor1
    const recline =
      floor === 1
        ? trip.reclineFloor1
        : trip.reclineFloor2 || trip.reclineFloor1

    onToggleSeat({
      number: seatNum,
      floor,
      price,
      recline,
    })
  }

  const seatsToRender = currentFloor === 1 ? floor1Seats : floor2Seats
  const floorRecline =
    currentFloor === 1
      ? trip.reclineFloor1
      : trip.reclineFloor2 || trip.reclineFloor1
  const floorPrice =
    currentFloor === 1 ? trip.priceFloor1 : trip.priceFloor2 || trip.priceFloor1

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      {/* Selector de Piso si el bus tiene 2 niveles */}
      {trip.floors === 2 ? (
        <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setCurrentFloor(1)}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all flex flex-col items-center justify-center cursor-pointer ${
              currentFloor === 1
                ? "bg-[#002855] text-white shadow-md"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <span>Piso 1 · Asientos Cama</span>
            <span
              className={`text-[10px] mt-0.5 ${
                currentFloor === 1 ? "text-[#FFD100]" : "text-gray-500"
              }`}
            >
              {trip.reclineFloor1} · Desde S/ {trip.priceFloor1}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentFloor(2)}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all flex flex-col items-center justify-center cursor-pointer ${
              currentFloor === 2
                ? "bg-[#002855] text-white shadow-md"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <span>Piso 2 · Panorámico</span>
            <span
              className={`text-[10px] mt-0.5 ${
                currentFloor === 2 ? "text-[#FFD100]" : "text-gray-500"
              }`}
            >
              {trip.reclineFloor2} · Desde S/ {trip.priceFloor2}
            </span>
          </button>
        </div>
      ) : (
        <div className="bg-[#002855]/5 border border-[#002855]/20 rounded-xl p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <strong className="text-xs text-[#002855]">
              {trip.service} · Nivel Único Exclusivo
            </strong>
          </div>
          <span className="text-xs font-bold text-[#002855]">
            {trip.reclineFloor1} · S/ {trip.priceFloor1}
          </span>
        </div>
      )}

      {/* Contenedor del Bus */}
      <div className="max-w-md mx-auto bg-gray-50 rounded-3xl p-5 border-2 border-gray-300 relative shadow-inner">
        {/* Parte frontal del Bus (Parabrisas y Volante del Conductor) */}
        <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-6 flex items-center justify-between text-xs text-gray-500 font-semibold px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-400 flex items-center justify-center text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18" />
              </svg>
            </div>
            <span>Conductor</span>
          </div>

          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-wider text-gray-400">
              Frente del Bus
            </span>
            <span className="text-xs text-gray-700 font-bold">
              {trip.busCode}
            </span>
          </div>
        </div>

        {/* Amenidades de Cabina (Escalera y Baño si corresponde) */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-200/60 rounded-xl mb-6 text-[11px] text-gray-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-700">WC</span>
            <span>Baño Químico</span>
          </div>
          {trip.floors === 2 && (
            <div className="flex items-center gap-1.5">
              <span>🪜 Escaleras de acceso</span>
            </div>
          )}
        </div>

        {/* Distribución de Asientos */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-3 justify-items-center px-2">
          {seatsToRender.map((seatNum, index) => {
            const occupied = isOccupied(seatNum, currentFloor)
            const selected = isSelected(seatNum)
            // Agrupar con pasillo central: asientos 1 y 2 en izquierda, pasillo, asientos 3 y 4 en derecha
            const isLeftAisle = index % 4 === 1

            return (
              <div
                key={seatNum}
                className={`relative flex items-center justify-center ${
                  isLeftAisle ? "mr-4" : ""
                }`}
              >
                <button
                  type="button"
                  disabled={occupied}
                  onClick={() => handleSeatClick(seatNum, currentFloor)}
                  className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border-2 relative ${
                    occupied
                      ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                      : selected
                      ? "bg-[#002855] border-[#FFD100] text-white shadow-lg scale-105 z-10"
                      : "bg-white border-blue-200 text-[#002855] hover:border-[#002855] hover:bg-blue-50 shadow-sm"
                  }`}
                >
                  {/* Apoyacabezas gráfico de asiento */}
                  <div
                    className={`w-8 h-2 rounded-t-sm mb-1 ${
                      occupied
                        ? "bg-gray-300"
                        : selected
                        ? "bg-[#FFD100]"
                        : "bg-blue-100"
                    }`}
                  />
                  <span className="font-black text-xs leading-none">
                    {seatNum}
                  </span>
                  <span className="text-[8px] font-semibold mt-0.5 opacity-80">
                    {occupied ? "Ocup." : selected ? "✓" : `S/${floorPrice}`}
                  </span>
                </button>
              </div>
            )
          })}
        </div>

        {/* Parte trasera del Bus */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-6 text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          Parte Posterior del Bus
        </div>
      </div>

      {/* Leyenda de Asientos */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-white border-2 border-blue-200"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#002855] border-2 border-[#FFD100]"></div>
          <span className="font-bold text-[#002855]">Tu Selección</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-200 border-2 border-gray-300"></div>
          <span className="text-gray-400">Ocupado</span>
        </div>
      </div>

      {/* Alerta de cantidad de asientos seleccionados */}
      <div className="mt-4 p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs flex items-center justify-between">
        <div>
          <span>Debes seleccionar: <strong>{maxSeats} {maxSeats > 1 ? "asientos" : "asiento"}</strong></span>
          <span className="mx-2">•</span>
          <span>Seleccionados: <strong className="text-[#002855] font-black">{selectedSeats.length}</strong></span>
        </div>
        {selectedSeats.length === maxSeats ? (
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <Icon name="check" size={14} /> Completo
          </span>
        ) : (
          <span className="text-amber-700 font-medium">
            Falta elegir {maxSeats - selectedSeats.length}
          </span>
        )}
      </div>
    </div>
  )
}

