import { useEffect, useRef, useState } from "react"
import { CITIES } from "../data/mockData"
import { SearchParams } from "../types"
import { Icon } from "./Icons"

interface SearchWidgetProps {
  onSearch: (params: SearchParams) => void
  initialParams?: Partial<SearchParams>
  className?: string
}

export function SearchWidget({
  onSearch,
  initialParams,
  className = "",
}: SearchWidgetProps) {
  // Obtener fecha exacta local del computador (evita desfase de zona horaria UTC)
  const formatLocalISO = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const getTodayISO = () => formatLocalISO(new Date())

  const getTomorrowISO = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return formatLocalISO(d)
  }

  const today = getTodayISO()
  const tomorrow = getTomorrowISO()

  const [origin, setOrigin] = useState(initialParams?.origin || "Lima")
  const [destination, setDestination] = useState(
    initialParams?.destination || "Arequipa",
  )
  const [departDate, setDepartDate] = useState(
    initialParams?.departDate || today,
  )
  const [returnDate, setReturnDate] = useState<string | undefined>(
    initialParams?.returnDate || undefined,
  )

  // Modo de visualización:
  // "pills" = Muestra "¿Cuándo viajas? [Hoy] [Mañana] [Elegir]"
  // "detailed" = Muestra "Ida (fecha) | Regreso (Opcional o fecha) ⓧ"
  const [viewMode, setViewMode] = useState<"pills" | "detailed">(
    initialParams?.returnDate ? "detailed" : "pills",
  )

  const [tripType, setTripType] = useState<"sencillo" | "redondo">(
    initialParams?.returnDate || initialParams?.tripType === "ida-vuelta"
      ? "redondo"
      : "sencillo",
  )

  // Estados de apertura de dropdowns flotantes
  const [activeDropdown, setActiveDropdown] = useState<
    "origin" | "dest" | "calendar" | null
  >(null)

  // Si el calendario fue abierto desde "Ida" o "Regreso"
  const [calendarTarget, setCalendarTarget] = useState<"ida" | "regreso">("ida")

  // Mes visible en el calendario (año, mes base 0)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const base = new Date((initialParams?.departDate || today) + "T12:00:00")
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const [validationError, setValidationError] = useState<string | null>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  // Cierre al hacer clic fuera del widget
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Formato para mostrar: ej. "16-Nov-26"
  const formatDateDisplay = (isoStr?: string) => {
    if (!isoStr) return ""
    const parts = isoStr.split("-").map(Number)
    if (parts.length !== 3) return isoStr
    const [y, m, d] = parts
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Oct",
      "Nov",
      "Dic",
    ]
    const shortYear = String(y).slice(-2)
    return `${d}-${months[m - 1]}-${shortYear}`
  }

  const handleSwap = (e: React.MouseEvent) => {
    e.stopPropagation()
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
    setValidationError(null)
  }

  const handleSelectOrigin = (cityName: string) => {
    setOrigin(cityName)
    setActiveDropdown(null)
    setValidationError(null)
  }

  const handleSelectDest = (cityName: string) => {
    setDestination(cityName)
    setActiveDropdown(null)
    setValidationError(null)
  }

  // Clic en la pastilla [ Hoy ]
  const handlePillHoy = () => {
    setDepartDate(today)
    setViewMode("detailed")
    setActiveDropdown(null)
  }

  // Clic en la pastilla [ Mañana ]
  const handlePillManana = () => {
    setDepartDate(tomorrow)
    setViewMode("detailed")
    setActiveDropdown(null)
  }

  // Clic en la pastilla [ 📅 Elegir ]
  const handlePillElegir = () => {
    setCalendarTarget("ida")
    setActiveDropdown("calendar")
  }

  // Clic en el botón ⓧ
  const handleClearReturnOrReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (returnDate) {
      setReturnDate(undefined)
      setTripType("sencillo")
    } else {
      // Si ya está en Opcional, regresa al estado inicial de pastillas
      setViewMode("pills")
      setActiveDropdown(null)
    }
  }

  // Lógica de navegación del calendario
  const currentMonthName = calendarMonth.toLocaleDateString("es-PE", {
    month: "long",
  })
  const currentYear = calendarMonth.getFullYear()
  const capitalizedMonth =
    currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)

  const handlePrevMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
    )
  }

  const handleNextMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
    )
  }

  const handleTodayClick = () => {
    setDepartDate(today)
    setViewMode("detailed")
    if (tripType === "redondo" && returnDate && returnDate < today) {
      setReturnDate(undefined)
    }
    const todayDate = new Date(today + "T12:00:00")
    setCalendarMonth(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1))
  }

  // Clic en un día del calendario
  const handleDayClick = (dayISO: string) => {
    if (dayISO < today) return

    if (calendarTarget === "regreso") {
      // El usuario abrió el calendario desde la sección "Regreso"
      if (dayISO < departDate) {
        // Si elige una fecha anterior a la ida, la asignamos como nueva fecha de ida
        setDepartDate(dayISO)
        setReturnDate(undefined)
        setViewMode("detailed")
      } else {
        // Asignar como fecha de regreso y activar modo redondo automáticamente
        setReturnDate(dayISO)
        if (tripType === "sencillo") {
          setTripType("redondo")
        }
        setViewMode("detailed")
        setActiveDropdown(null)
      }
    } else {
      // calendarTarget === "ida"
      if (tripType === "sencillo") {
        setDepartDate(dayISO)
        setViewMode("detailed")
        setActiveDropdown(null)
      } else {
        // Modo Redondo
        if (!departDate || (departDate && returnDate)) {
          setDepartDate(dayISO)
          setReturnDate(undefined)
          setViewMode("detailed")
        } else if (departDate && !returnDate) {
          if (dayISO < departDate) {
            setDepartDate(dayISO)
            setViewMode("detailed")
          } else {
            setReturnDate(dayISO)
            setViewMode("detailed")
            setActiveDropdown(null)
          }
        }
      }
    }
  }

  // Generación de días para el calendario
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const generateCalendarDays = () => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const totalDays = getDaysInMonth(year, month)

    // Día de la semana del 1er día del mes (0 = domingo, 1 = lunes, ..., 6 = sábado)
    const firstDayIndex = new Date(year, month, 1).getDay()
    // Convertir para que semana empiece en Lunes (Lunes = 0, Domingo = 6)
    const leadingEmptySlots = firstDayIndex === 0 ? 6 : firstDayIndex - 1

    const days: Array<{
      dayNum: number
      iso: string
      isPast: boolean
      isToday: boolean
      isDepart: boolean
      isReturn: boolean
      isInRange: boolean
    }> = []

    for (let i = 1; i <= totalDays; i++) {
      const monthStr = String(month + 1).padStart(2, "0")
      const dayStr = String(i).padStart(2, "0")
      const iso = `${year}-${monthStr}-${dayStr}`
      const isPast = iso < today
      const isToday = iso === today
      const isDepart = iso === departDate
      const isReturn = !!returnDate && iso === returnDate
      const isInRange =
        tripType === "redondo" &&
        !!departDate &&
        !!returnDate &&
        iso > departDate &&
        iso < returnDate

      days.push({
        dayNum: i,
        iso,
        isPast,
        isToday,
        isDepart,
        isReturn,
        isInRange,
      })
    }

    return { leadingEmptySlots, days }
  }

  const { leadingEmptySlots, days } = generateCalendarDays()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (origin === destination) {
      setValidationError("El origen y el destino no pueden ser iguales.")
      return
    }
    setValidationError(null)
    onSearch({
      tripType: tripType === "redondo" && returnDate ? "ida-vuelta" : "ida",
      origin,
      destination,
      departDate,
      returnDate: tripType === "redondo" ? returnDate : undefined,
      passengerCount: 1, // Se define dinámicamente al seleccionar asientos
    })
  }

  return (
    <div ref={widgetRef} className={`w-full relative ${className}`}>
      {validationError && (
        <div className="mb-3 max-w-2xl mx-auto p-2.5 bg-red-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-xl text-center shadow-lg border border-red-400">
          {validationError}
        </div>
      )}

      {/* Barra de Búsqueda Horizontal Idéntica a la Imagen de Referencia */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl sm:rounded-full p-2 sm:p-2.5 shadow-2xl border border-gray-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 text-gray-800 relative z-30"
      >
        {/* ========================================================= */}
        {/* BLOQUE DE RUTA: ORIGEN + SWAP + DESTINO                   */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {/* Campo Origen */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() =>
                setActiveDropdown(activeDropdown === "origin" ? null : "origin")
              }
              className="w-full text-left px-4 py-2 hover:bg-gray-50/80 rounded-2xl sm:rounded-l-full sm:rounded-r-none transition-colors cursor-pointer"
            >
              <span className="block text-[11px] font-bold text-gray-600 tracking-tight leading-none mb-1">
                Origen
              </span>
              <div className="flex items-center gap-2">
                <Icon name="pin" size={15} className="text-gray-400 shrink-0" />
                <span className="font-bold text-sm text-gray-900 truncate">
                  {origin ? origin : "Buscar Origen"}
                </span>
              </div>
            </button>

            {/* Dropdown flotante personalizado para Origen */}
            {activeDropdown === "origin" && (
              <div className="absolute top-full mt-2 left-0 w-72 sm:w-80 bg-white rounded-3xl p-3 shadow-2xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="max-h-72 overflow-y-auto pr-1 space-y-1">
                  {CITIES.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => handleSelectOrigin(c.name)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left text-xs font-semibold ${origin === c.name
                        ? "bg-blue-50 text-[#002855] font-bold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-black"
                        }`}
                    >
                      <Icon
                        name="pin"
                        size={15}
                        className={
                          origin === c.name
                            ? "text-[#002855]"
                            : "text-gray-400"
                        }
                      />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botón de Intercambio (Swap) */}
          <div className="flex items-center justify-center p-1 sm:p-1.5 self-center">
            <button
              type="button"
              onClick={handleSwap}
              title="Intercambiar origen y destino"
              className="w-9 h-9 rounded-xl border border-gray-300 text-blue-900 hover:text-black hover:border-gray-400 bg-white hover:bg-gray-100 transition-all flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
            >
              <Icon name="swap" size={17} />
            </button>
          </div>

          {/* Campo Destino */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() =>
                setActiveDropdown(activeDropdown === "dest" ? null : "dest")
              }
              className="w-full text-left px-4 py-2 hover:bg-gray-50/80 rounded-2xl sm:rounded-none transition-colors cursor-pointer"
            >
              <span className="block text-[11px] font-bold text-gray-600 tracking-tight leading-none mb-1">
                Destino
              </span>
              <div className="flex items-center gap-2">
                <Icon name="pin" size={15} className="text-gray-400 shrink-0" />
                <span className="font-bold text-sm text-gray-900 truncate">
                  {destination ? destination : "Buscar Destino"}
                </span>
              </div>
            </button>

            {/* Dropdown flotante personalizado para Destino */}
            {activeDropdown === "dest" && (
              <div className="absolute top-full mt-2 left-0 w-72 sm:w-80 bg-white rounded-3xl p-3 shadow-2xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="max-h-72 overflow-y-auto pr-1 space-y-1">
                  {CITIES.filter((c) => c.name !== origin).map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => handleSelectDest(c.name)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left text-xs font-semibold ${destination === c.name
                        ? "bg-blue-50 text-[#002855] font-bold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-black"
                        }`}
                    >
                      <Icon
                        name="pin"
                        size={15}
                        className={
                          destination === c.name
                            ? "text-[#002855]"
                            : "text-gray-400"
                        }
                      />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BLOQUE DE FECHAS: INTERACCIÓN EN DOS FASES                */}
        {/* ========================================================= */}
        <div className="relative px-4 py-1.5 border-t lg:border-t-0 lg:border-l border-gray-200">
          {viewMode === "pills" ? (
            /* FASE 1: ¿Cuándo viajas? [ Hoy ] [ Mañana ] [ 📅 Elegir ] */
            <div>
              <span className="block text-[11px] font-bold text-gray-700 tracking-tight leading-none mb-1.5">
                ¿Cuándo viajas?
              </span>
              <div className="flex items-center gap-1.5">
                {/* Pastilla Hoy */}
                <button
                  type="button"
                  onClick={handlePillHoy}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer shadow-xs"
                >
                  Hoy
                </button>

                {/* Pastilla Mañana */}
                <button
                  type="button"
                  onClick={handlePillManana}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer shadow-xs"
                >
                  Mañana
                </button>

                {/* Pastilla Elegir */}
                <button
                  type="button"
                  onClick={handlePillElegir}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Icon name="calendar" size={13} className="text-gray-600" />
                  <span>Elegir</span>
                </button>
              </div>
            </div>
          ) : (
            /* FASE 2: Vista Detallada: Ida | Regreso (Opcional) ⓧ */
            <div className="flex items-center gap-4 text-left p-1 rounded-2xl">
              {/* Columna Ida */}
              <button
                type="button"
                onClick={() => {
                  setCalendarTarget("ida")
                  setActiveDropdown(
                    activeDropdown === "calendar" ? null : "calendar",
                  )
                }}
                className="text-left cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className="block text-[11px] font-bold text-gray-600 tracking-tight leading-none mb-1">
                  Ida
                </span>
                <strong className="text-sm font-extrabold text-gray-900 block whitespace-nowrap">
                  {formatDateDisplay(departDate)}
                </strong>
              </button>

              {/* Separador vertical sutil */}
              <div className="w-[1px] h-7 bg-gray-200" />

              {/* Columna Regreso */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarTarget("regreso")
                    setActiveDropdown(
                      activeDropdown === "calendar" ? null : "calendar",
                    )
                  }}
                  className="text-left cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <span className="block text-[11px] font-bold text-gray-600 tracking-tight leading-none mb-1">
                    Regreso
                  </span>
                  <span
                    className={`text-sm block whitespace-nowrap ${returnDate
                      ? "font-extrabold text-gray-900"
                      : "text-gray-400 font-medium"
                      }`}
                  >
                    {returnDate ? formatDateDisplay(returnDate) : "Opcional"}
                  </span>
                </button>

                {/* Botón circular ⓧ */}
                <button
                  type="button"
                  onClick={handleClearReturnOrReset}
                  title={
                    returnDate
                      ? "Quitar fecha de regreso"
                      : "Volver a ¿Cuándo viajas?"
                  }
                  className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-[10px] font-bold ml-1 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* POPOVER DEL CALENDARIO PERSONALIZADO (Imágenes 2 y 3)      */}
          {/* ========================================================= */}
          {activeDropdown === "calendar" && (
            <div className="absolute top-full mt-2 right-0 sm:right-auto lg:left-0 w-80 sm:w-88 bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Pestañas Sencillo / Redondo */}
              <div className="flex border border-gray-200 rounded-full p-1 mb-4 bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => {
                    setTripType("sencillo")
                    setReturnDate(undefined)
                  }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${tripType === "sencillo"
                    ? "bg-white text-[#002855] border border-[#002855] shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  Sencillo
                </button>
                <button
                  type="button"
                  onClick={() => setTripType("redondo")}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${tripType === "redondo"
                    ? "bg-white text-[#002855] border border-[#002855] shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  Redondo
                </button>
              </div>

              {/* Cabecera de Mes y Flechas de Navegación */}
              <div className="flex items-center justify-between mb-4 px-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Icon name="chevronLeft" size={16} />
                </button>
                <strong className="text-sm font-extrabold text-gray-900">
                  {capitalizedMonth} {currentYear}
                </strong>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Icon name="chevronRight" size={16} />
                </button>
              </div>

              {/* Días de la Semana: LUN MAR MIÉ JUE VIE SÁB DOM */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 mb-2">
                <span>LUN</span>
                <span>MAR</span>
                <span>MIÉ</span>
                <span>JUE</span>
                <span>VIE</span>
                <span>SÁB</span>
                <span>DOM</span>
              </div>

              {/* Cuadrícula de Días */}
              <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs">
                {/* Espacios vacíos antes del primer día del mes */}
                {Array.from({ length: leadingEmptySlots }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-8 h-8 mx-auto" />
                ))}

                {/* Días del mes */}
                {days.map((d) => {
                  return (
                    <div
                      key={d.iso}
                      className={`relative w-8 h-8 mx-auto flex items-center justify-center ${d.isInRange ? "bg-blue-50 rounded-full" : ""
                        }`}
                    >
                      <button
                        type="button"
                        disabled={d.isPast}
                        onClick={() => handleDayClick(d.iso)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all relative ${d.isDepart || d.isReturn
                          ? "bg-[#002855] text-white font-black shadow-xs cursor-pointer"
                          : d.isPast
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-blue-50 hover:text-[#002855] font-semibold cursor-pointer"
                          }`}
                      >
                        {d.dayNum}

                        {/* Indicador de "Hoy" en la esquina superior derecha */}
                        {d.isToday && !d.isDepart && !d.isReturn && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Barra inferior: Botón "Hoy" y "Cerrar" */}
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleTodayClick}
                  className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>▾</span>
                  <span>Hoy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDropdown(null)}
                  className="px-3.5 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* BOTÓN BUSCAR AMARILLO REDONDEADO                          */}
        {/* ========================================================= */}
        <div className="p-1">
          <button
            type="submit"
            className="w-full lg:w-auto h-12 lg:h-12 px-6 sm:px-8 bg-[#FFD100] hover:bg-[#e6be00] active:scale-98 text-[#002855] font-black text-sm rounded-2xl sm:rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md border border-[#f0c200]"
          >
            <Icon name="search" size={17} className="stroke-[2.5]" />
            <span>Buscar</span>
          </button>
        </div>
      </form>
    </div>
  )
}
