import { useState } from "react"
import { CruzDelSurLogo, Icon } from "../components/Icons"
import {
  BillingData,
  ContactData,
  Page,
  PassengerData,
  PaymentData,
  SelectedSeat,
  Trip,
} from "../types"

interface ConfirmationPageProps {
  trip: Trip
  selectedSeats: SelectedSeat[]
  tripReturn?: Trip | null
  selectedSeatsReturn?: SelectedSeat[]
  passengers: PassengerData[]
  passengersReturn?: PassengerData[]
  contact: ContactData
  billing: BillingData
  payment: PaymentData
  reservationCode: string
  totalAmount: number
  departDate: string
  returnDate?: string
  navigate: (p: Page) => void
  onNewBooking: () => void
}

export function ConfirmationPage({
  trip,
  selectedSeats,
  tripReturn,
  selectedSeatsReturn = [],
  passengers,
  passengersReturn = [],
  contact,
  billing,
  payment,
  reservationCode,
  totalAmount,
  departDate,
  returnDate,
  navigate,
  onNewBooking,
}: ConfirmationPageProps) {
  const [copied, setCopied] = useState(false)
  const [emailSentToast, setEmailSentToast] = useState(false)

  const isRoundTrip = !!tripReturn && selectedSeatsReturn.length > 0

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reservationCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleResendEmail = () => {
    setEmailSentToast(true)
    setTimeout(() => setEmailSentToast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Toast de reenviado */}
      {emailSentToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#002855] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#FFD100] text-xs font-bold flex items-center gap-2 animate-bounce">
          <Icon name="check" size={16} className="text-[#FFD100]" />
          <span>¡Boleto electrónico reenviado exitosamente a {contact.email}!</span>
        </div>
      )}

      {/* Mensaje de Confirmación Superior */}
      <div className="bg-[#002855] text-white py-12 px-4 text-center print:hidden">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
            <Icon name="check" size={34} />
          </div>

          <div className="inline-block bg-[#FFD100] text-[#002855] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            ¡Pago Aprobado y Asientos Confirmados!
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            ¡Tu viaje con Cruz del Sur está listo!
          </h1>

          <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto">
            Hemos emitido tus boletos electrónicos oficiales y los enviamos a{" "}
            <strong className="text-[#FFD100] underline">{contact.email}</strong>.
          </p>

          {/* Código de Reserva PNR */}
          <div className="inline-flex items-center gap-4 bg-white/10 border-2 border-[#FFD100] px-6 py-3 rounded-2xl shadow-inner">
            <div className="text-left">
              <span className="block text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                Código de Reserva (PNR)
              </span>
              <strong className="text-2xl font-black tracking-widest text-[#FFD100]">
                {reservationCode}
              </strong>
            </div>

            <button
              onClick={handleCopyCode}
              className="bg-[#FFD100] hover:bg-[#e6be00] text-[#002855] font-black text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow"
            >
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Acciones Rápidas (Imprimir, Reenviar, Nuevo Viaje) */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 flex flex-wrap items-center justify-between gap-3 mb-8 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#002855] hover:bg-[#073366] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Icon name="printer" size={16} />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={handleResendEmail}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Icon name="mail" size={16} />
              <span>Reenviar a mi correo</span>
            </button>
          </div>

          <button
            onClick={onNewBooking}
            className="text-xs font-bold text-blue-700 hover:text-[#002855] underline cursor-pointer"
          >
            Realizar otra compra de pasaje ➔
          </button>
        </div>

        {/* ============================================================== */}
        {/* BOLETO 1: VIAJE DE IDA                                         */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border-2 border-gray-300 shadow-2xl overflow-hidden mb-8 print:shadow-none print:border-black print:rounded-none">
          {/* Membrete Oficial */}
          <div className="bg-[#002855] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-[#FFD100]">
            <div>
              <CruzDelSurLogo size={46} />
              <div className="text-[10px] text-gray-300 mt-2 space-y-0.5">
                <p>TRANSPORTES CRUZ DEL SUR S.A.C. · RUC: 20100188974</p>
                <p>Av. Javier Prado Este 1109, La Victoria - Lima, Perú</p>
                <p>Central Telefónica: (01) 311-5050 · www.cruzdelsur.com.pe</p>
              </div>
            </div>

            <div className="bg-white text-[#002855] p-4 rounded-2xl border-2 border-[#FFD100] text-center min-w-[200px] shadow-sm">
              <span className="block text-[10px] font-black uppercase tracking-wider text-gray-500">
                BOLETO ELECTRÓNICO (IDA)
              </span>
              <strong className="block text-lg font-black text-[#002855]">
                B001 - 00384912
              </strong>
              <span className="block text-[10px] text-emerald-700 font-bold mt-0.5">
                AUTORIZADO POR SUNAT
              </span>
            </div>
          </div>

          {/* Bloque de Ruta */}
          <div className="p-6 sm:p-8 border-b border-gray-200 bg-gray-50/70">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  ORIGEN DE EMBARQUE
                </span>
                <strong className="text-xl sm:text-2xl font-black text-[#002855] block">
                  {trip.originCity}
                </strong>
                <span className="text-xs text-gray-600 font-medium block">
                  {trip.originTerminal}
                </span>
              </div>

              <div className="md:col-span-4 text-center">
                <div className="inline-block bg-[#002855] text-[#FFD100] font-black text-xs px-3 py-1 rounded-full uppercase mb-1">
                  {trip.service}
                </div>
                <div className="flex items-center justify-center gap-2 text-[#002855]">
                  <div className="h-0.5 w-12 bg-gray-300"></div>
                  <Icon name="bus" size={20} />
                  <div className="h-0.5 w-12 bg-gray-300"></div>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold block mt-1">
                  Duración aprox: {trip.duration}
                </span>
              </div>

              <div className="md:col-span-4 text-left md:text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  DESTINO DE LLEGADA
                </span>
                <strong className="text-xl sm:text-2xl font-black text-[#002855] block">
                  {trip.destCity}
                </strong>
                <span className="text-xs text-gray-600 font-medium block">
                  {trip.destTerminal}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Fecha de Salida</span>
                <strong className="text-gray-900 font-bold block">{departDate}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Hora de Salida</span>
                <strong className="text-[#002855] font-black text-sm block">{trip.departTime}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Hora de Llegada Estimada</span>
                <strong className="text-gray-900 font-bold block">{trip.arriveTime}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Asientos de Ida</span>
                <strong className="text-[#002855] font-black text-sm block">
                  {selectedSeats.map((s) => `#${s.number} (P${s.floor})`).join(", ")}
                </strong>
              </div>
            </div>
          </div>

          {/* Lista de Pasajeros de Ida */}
          <div className="p-6 sm:p-8">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-4">
              Pasajeros Registrados para Ida ({passengers.length})
            </h4>
            <div className="space-y-3">
              {passengers.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#002855] text-white font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <strong className="text-gray-900 font-bold">
                        {p.firstName} {p.lastName}
                      </strong>
                      <span className="block text-[11px] text-gray-500">
                        {p.docType}: {p.docNumber} · {p.nationality}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#002855] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      Asiento #{selectedSeats[idx]?.number || p.seatNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOLETO 2: VIAJE DE REGRESO (SI ES IDA Y VUELTA)                */}
        {/* ============================================================== */}
        {isRoundTrip && tripReturn && (
          <div className="bg-white rounded-3xl border-2 border-gray-300 shadow-2xl overflow-hidden mb-8 print:shadow-none print:border-black print:rounded-none">
            {/* Membrete Oficial */}
            <div className="bg-[#002855] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-[#FFD100]">
              <div>
                <CruzDelSurLogo size={46} />
                <div className="text-[10px] text-gray-300 mt-2 space-y-0.5">
                  <p>TRANSPORTES CRUZ DEL SUR S.A.C. · RUC: 20100188974</p>
                  <p>Av. Javier Prado Este 1109, La Victoria - Lima, Perú</p>
                </div>
              </div>

              <div className="bg-white text-[#002855] p-4 rounded-2xl border-2 border-[#FFD100] text-center min-w-[200px] shadow-sm">
                <span className="block text-[10px] font-black uppercase tracking-wider text-gray-500">
                  BOLETO ELECTRÓNICO (REGRESO)
                </span>
                <strong className="block text-lg font-black text-[#002855]">
                  B001 - 00384913
                </strong>
                <span className="block text-[10px] text-emerald-700 font-bold mt-0.5">
                  AUTORIZADO POR SUNAT
                </span>
              </div>
            </div>

            {/* Bloque de Ruta de Regreso */}
            <div className="p-6 sm:p-8 border-b border-gray-200 bg-amber-50/30">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                    ORIGEN (REGRESO)
                  </span>
                  <strong className="text-xl sm:text-2xl font-black text-[#002855] block">
                    {tripReturn.originCity}
                  </strong>
                  <span className="text-xs text-gray-600 font-medium block">
                    {tripReturn.originTerminal}
                  </span>
                </div>

                <div className="md:col-span-4 text-center">
                  <div className="inline-block bg-[#FFD100] text-[#002855] font-black text-xs px-3 py-1 rounded-full uppercase mb-1">
                    {tripReturn.service}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[#002855]">
                    <div className="h-0.5 w-12 bg-gray-300"></div>
                    <Icon name="bus" size={20} />
                    <div className="h-0.5 w-12 bg-gray-300"></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold block mt-1">
                    Duración aprox: {tripReturn.duration}
                  </span>
                </div>

                <div className="md:col-span-4 text-left md:text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                    DESTINO (REGRESO)
                  </span>
                  <strong className="text-xl sm:text-2xl font-black text-[#002855] block">
                    {tripReturn.destCity}
                  </strong>
                  <span className="text-xs text-gray-600 font-medium block">
                    {tripReturn.destTerminal}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Fecha de Regreso</span>
                  <strong className="text-gray-900 font-bold block">{returnDate}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Hora de Salida</span>
                  <strong className="text-[#002855] font-black text-sm block">{tripReturn.departTime}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Hora de Llegada Estimada</span>
                  <strong className="text-gray-900 font-bold block">{tripReturn.arriveTime}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Asientos de Regreso</span>
                  <strong className="text-amber-900 font-black text-sm block">
                    {selectedSeatsReturn.map((s) => `#${s.number} (P${s.floor})`).join(", ")}
                  </strong>
                </div>
              </div>
            </div>

            {/* Lista de Pasajeros de Regreso */}
            <div className="p-6 sm:p-8">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-4">
                Pasajeros Registrados para Regreso ({passengersReturn.length})
              </h4>
              <div className="space-y-3">
                {passengersReturn.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between text-xs gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-[#FFD100] text-[#002855] font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-gray-900 font-bold">
                          {p.firstName} {p.lastName}
                        </strong>
                        <span className="block text-[11px] text-gray-500">
                          {p.docType}: {p.docNumber} · {p.nationality}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        Asiento #{selectedSeatsReturn[idx]?.number || p.seatNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resumen Final de Pago y Facturación */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Comprobante Emitido:</span>
            <strong className="text-gray-900">{billing.type}</strong>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Método de Pago:</span>
            <span className="font-bold text-gray-900 uppercase">{payment.method}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Total Pagado:</span>
            <strong className="text-lg font-black text-[#002855]">S/ {totalAmount.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
