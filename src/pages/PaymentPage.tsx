import React, { useState } from "react"
import { Icon } from "../components/Icons"
import { ReservationTimerCard } from "../components/ReservationTimerCard"
import { BillingData, Page, PassengerData, PaymentData, SelectedSeat, Trip } from "../types"

interface PaymentPageProps {
  trip: Trip
  selectedSeats: SelectedSeat[]
  tripReturn?: Trip | null
  selectedSeatsReturn?: SelectedSeat[]
  passengers: PassengerData[]
  passengersReturn?: PassengerData[]
  totalAmount: number
  onPaymentSuccess: (billing: BillingData, payment: PaymentData, reservationCode: string) => void
  navigate: (p: Page) => void
  reservationSecondsLeft?: number
}

export function PaymentPage({
  trip,
  selectedSeats,
  tripReturn,
  selectedSeatsReturn = [],
  passengers,
  passengersReturn = [],
  totalAmount,
  onPaymentSuccess,
  navigate,
  reservationSecondsLeft = 15 * 60,
}: PaymentPageProps) {
  const isRoundTrip = !!tripReturn && selectedSeatsReturn.length > 0
  const subtotalIda = selectedSeats.reduce((acc, s) => acc + s.price, 0)
  const subtotalReturn = selectedSeatsReturn.reduce((acc, s) => acc + s.price, 0)
  // Estado de facturación
  const [billingType, setBillingType] = useState<"Boleta" | "Factura">("Boleta")
  const [ruc, setRuc] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [fiscalAddress, setFiscalAddress] = useState("")

  // Estado de método de pago
  const [paymentMethod, setPaymentMethod] = useState<"card" | "yape" | "agency">("card")

  // Estado de tarjeta
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")

  // Estado de Yape
  const [yapeCode, setYapeCode] = useState("")

  // Estado de procesamiento y errores
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Detección de marca de tarjeta
  const detectCardType = (num: string): string => {
    const clean = num.replace(/\s+/g, "")
    if (/^4/.test(clean)) return "VISA"
    if (/^5[1-5]/.test(clean)) return "Mastercard"
    if (/^3[47]/.test(clean)) return "AMEX"
    if (/^6/.test(clean)) return "Diners"
    return "TARJETA"
  }

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 16)
    return clean.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4)
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2)}`
    }
    return clean
  }

  const validatePayment = (): boolean => {
    const errs: Record<string, string> = {}

    // Validar Factura
    if (billingType === "Factura") {
      if (!ruc.trim()) {
        errs["ruc"] = "El RUC es obligatorio para factura."
      } else if (!/^(10|20)\d{9}$/.test(ruc.trim())) {
        errs["ruc"] = "El RUC debe tener 11 dígitos numéricos y comenzar con 10 o 20."
      }

      if (!businessName.trim() || businessName.trim().length < 3) {
        errs["businessName"] = "Ingresa una Razón Social válida."
      }

      if (!fiscalAddress.trim() || fiscalAddress.trim().length < 5) {
        errs["fiscalAddress"] = "Ingresa una Dirección Fiscal válida."
      }
    }

    // Validar Método de Pago
    if (paymentMethod === "card") {
      const cleanNum = cardNumber.replace(/\s+/g, "")
      if (!cleanNum || cleanNum.length < 15) {
        errs["cardNumber"] = "Ingresa un número de tarjeta válido (16 dígitos)."
      }

      if (!cardHolder.trim() || cardHolder.trim().length < 3) {
        errs["cardHolder"] = "Ingresa el nombre del titular de la tarjeta."
      }

      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        errs["cardExpiry"] = "Ingresa la fecha de vencimiento (MM/AA)."
      } else {
        const [mm] = cardExpiry.split("/").map(Number)
        if (mm < 1 || mm > 12) {
          errs["cardExpiry"] = "Mes inválido (01 a 12)."
        }
      }

      if (!cardCvv || cardCvv.length < 3) {
        errs["cardCvv"] = "Código CVV inválido (3 o 4 dígitos)."
      }
    } else if (paymentMethod === "yape") {
      if (!yapeCode.trim() || !/^\d{6}$/.test(yapeCode.trim())) {
        errs["yapeCode"] = "Ingresa el código de aprobación de 6 dígitos generado en tu App Yape o Plin."
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePayment()) return

    setIsProcessing(true)

    // Simular pasarela de pago bancario seguro (Visa / Niubiz / Izipay)
    setTimeout(() => {
      setIsProcessing(false)
      const randomCode = `CDS-${Math.floor(1000 + Math.random() * 9000)}-PE`

      onPaymentSuccess(
        {
          type: billingType,
          ruc: billingType === "Factura" ? ruc : "",
          businessName: billingType === "Factura" ? businessName : "",
          fiscalAddress: billingType === "Factura" ? fiscalAddress : "",
        },
        {
          method: paymentMethod,
          cardNumber,
          cardHolder,
          cardExpiry,
          cardCvv,
          cardType: detectCardType(cardNumber).toLowerCase() as any,
          yapeCode,
        },
        randomCode,
      )
    }, 1400)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Barra de Progreso */}
      <div className="bg-white border-b border-gray-200 py-3 sm:py-4 px-4 sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 text-xs overflow-x-auto py-1">
            <div className="flex items-center gap-2 text-emerald-600 font-bold shrink-0">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                ✓
              </span>
              <span className="hidden sm:inline">1. Horario</span>
            </div>
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-emerald-600 font-bold shrink-0">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                ✓
              </span>
              <span className="hidden sm:inline">2. Asientos</span>
            </div>
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-emerald-600 font-bold shrink-0">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                ✓
              </span>
              <span className="hidden sm:inline">3. Pasajeros</span>
            </div>
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-[#002855] font-black shrink-0">
              <span className="w-6 h-6 rounded-full bg-[#002855] text-white flex items-center justify-center text-xs">
                4
              </span>
              <span>4. Pago y Facturación</span>
            </div>
          </div>

          {/* Card de Tiempo de Reserva Oficial */}
          <ReservationTimerCard secondsLeft={reservationSecondsLeft} compact />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("passengers")}
            className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-[#002855] font-bold mb-3 cursor-pointer"
          >
            <Icon name="chevronLeft" size={16} />
            <span>Volver a datos de pasajeros</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-black text-[#002855]">
            Finaliza tu compra segura
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Selecciona tu comprobante tributario y método de pago preferido.
          </p>
        </div>

        <form onSubmit={handlePay}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Formulario de Facturación y Pago */}
            <div className="lg:col-span-8 space-y-6">
              {/* Sección 1: Comprobante de Pago */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-extrabold text-base text-[#002855]">
                    1. Comprobante de Pago Electrónico
                  </h3>
                  <span className="text-xs text-gray-500">SUNAT Oficial</span>
                </div>

                {/* Tabs Boleta / Factura */}
                <div className="flex bg-gray-100 p-1.5 rounded-xl max-w-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setBillingType("Boleta")
                      setErrors({})
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${billingType === "Boleta"
                      ? "bg-[#002855] text-white shadow-sm"
                      : "text-gray-600 hover:text-black"
                      }`}
                  >
                    Boleta de Venta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBillingType("Factura")
                      setErrors({})
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${billingType === "Factura"
                      ? "bg-[#002855] text-white shadow-sm"
                      : "text-gray-600 hover:text-black"
                      }`}
                  >
                    Factura (con RUC)
                  </button>
                </div>

                {billingType === "Boleta" ? (
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                    <Icon name="check" size={16} className="text-blue-700 shrink-0" />
                    <span>
                      La boleta electrónica se emitirá a nombre del pasajero principal:{" "}
                      <strong>
                        {passengers[0]?.firstName} {passengers[0]?.lastName} (DNI: {passengers[0]?.docNumber})
                      </strong>.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* RUC */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          RUC (11 dígitos) *
                        </label>
                        <input
                          type="text"
                          maxLength={11}
                          value={ruc}
                          onChange={(e) => setRuc(e.target.value)}
                          placeholder="20XXXXXXXXX"
                          className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors["ruc"] ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#002855]"
                            }`}
                        />
                        {errors["ruc"] && (
                          <span className="block text-[11px] text-red-600 mt-1 font-medium">
                            {errors["ruc"]}
                          </span>
                        )}
                      </div>

                      {/* Razón Social */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Razón Social *
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Nombre o denominación de la empresa"
                          className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors["businessName"] ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#002855]"
                            }`}
                        />
                        {errors["businessName"] && (
                          <span className="block text-[11px] text-red-600 mt-1 font-medium">
                            {errors["businessName"]}
                          </span>
                        )}
                      </div>

                      {/* Dirección Fiscal */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Dirección Fiscal *
                        </label>
                        <input
                          type="text"
                          value={fiscalAddress}
                          onChange={(e) => setFiscalAddress(e.target.value)}
                          placeholder="Av. / Calle / Distrito / Ciudad"
                          className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors["fiscalAddress"] ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#002855]"
                            }`}
                        />
                        {errors["fiscalAddress"] && (
                          <span className="block text-[11px] text-red-600 mt-1 font-medium">
                            {errors["fiscalAddress"]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección 2: Método de Pago */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-extrabold text-base text-[#002855]">
                    2. Selecciona tu Forma de Pago
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <Icon name="shield" size={14} />
                    <span>Transacción 100% Segura</span>
                  </div>
                </div>

                {/* Métodos de Pago Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Tarjetas */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("card")
                      setErrors({})
                    }}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${paymentMethod === "card"
                      ? "bg-[#002855] text-white border-[#002855] shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                  >
                    <Icon name="card" size={24} className={paymentMethod === "card" ? "text-[#FFD100]" : "text-[#002855]"} />
                    <span className="font-extrabold text-xs">Tarjeta Crédito / Débito</span>
                    <span className="text-[10px] opacity-80">Visa, Mastercard, Amex</span>
                  </button>

                  {/* Yape / Plin */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("yape")
                      setErrors({})
                    }}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${paymentMethod === "yape"
                      ? "bg-[#002855] text-white border-[#002855] shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#6b21a8] text-white font-black flex items-center justify-center text-xs">
                      Y
                    </div>
                    <span className="font-extrabold text-xs">Yape / Plin</span>
                    <span className="text-[10px] opacity-80">Pago instantáneo con QR</span>
                  </button>

                  {/* Pago en Agencia / CIP */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("agency")
                      setErrors({})
                    }}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${paymentMethod === "agency"
                      ? "bg-[#002855] text-white border-[#002855] shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                  >
                    <Icon name="pin" size={24} className={paymentMethod === "agency" ? "text-[#FFD100]" : "text-[#002855]"} />
                    <span className="font-extrabold text-xs">Agencia / PagoEfectivo</span>
                    <span className="text-[10px] opacity-80">Reserva con código CIP</span>
                  </button>
                </div>

                {/* Subformulario según el método elegido */}
                {paymentMethod === "card" && (
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-200">
                      <span>Introduce los datos de tu tarjeta</span>
                      <span className="font-bold text-[#002855] px-2 py-0.5 bg-white rounded border border-gray-200">
                        {detectCardType(cardNumber)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Número de Tarjeta */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Número de Tarjeta *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            placeholder="4557 0000 0000 0000"
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 tracking-wider focus:outline-none transition-all ${errors["cardNumber"] ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#002855]"
                              }`}
                          />
                          <span className="absolute right-3 top-2.5 text-xs font-bold text-[#002855]">
                            {detectCardType(cardNumber)}
                          </span>
                        </div>
                        {errors["cardNumber"] && (
                          <span className="block text-[11px] text-red-600 mt-1 font-medium">
                            {errors["cardNumber"]}
                          </span>
                        )}
                      </div>

                      {/* Titular */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Nombre del Titular (tal como figura en la tarjeta) *
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          placeholder="NOMBRE Y APELLIDO"
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none transition-all ${errors["cardHolder"] ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#002855]"
                            }`}
                        />
                        {errors["cardHolder"] && (
                          <span className="block text-[11px] text-red-600 mt-1 font-medium">
                            {errors["cardHolder"]}
                          </span>
                        )}
                      </div>

                      {/* Vencimiento */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Vencimiento (MM/AA) *
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          placeholder="MM/AA"
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none transition-all ${errors["cardExpiry"] ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#002855]"
                            }`}
                        />
                        {errors["cardExpiry"] && (
                          <span className="block text-[11px] text-red-600 mt-1 font-medium">
                            {errors["cardExpiry"]}
                          </span>
                        )}
                      </div>

                      {/* CVV */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Código de Seguridad CVV *
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          placeholder="3 o 4 dígitos"
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none transition-all ${errors["cardCvv"] ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#002855]"
                            }`}
                        />
                        {errors["cardCvv"] && (
                          <span className="block text-[11px] text-red-600 mt-1 font-medium">
                            {errors["cardCvv"]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "yape" && (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center space-y-4">
                    <div className="max-w-xs mx-auto bg-white p-4 rounded-2xl border-2 border-[#6b21a8] shadow-md inline-block">
                      {/* Simulación del código QR oficial de Yape para Cruz del Sur */}
                      <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-gray-200 flex flex-col items-center justify-center relative">
                        <div className="grid grid-cols-8 gap-1 w-full h-full p-2 bg-gray-50">
                          {Array.from({ length: 64 }, (_, i) => (
                            <div
                              key={i}
                              className={`rounded-xs ${(i * 11) % 7 < 3 || i % 5 === 0 ? "bg-[#002855]" : "bg-transparent"
                                }`}
                            />
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-[#6b21a8] text-white font-black text-xs px-2 py-1 rounded shadow">
                            YAPE CDS
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-gray-700">
                        <span className="block font-bold text-[#6b21a8]">Cruz del Sur Oficial</span>
                        <strong className="text-sm font-black text-[#002855]">
                          S/ {totalAmount.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    <div className="max-w-md mx-auto text-left space-y-3">
                      <p className="text-xs text-gray-600">
                        1. Abre tu App Yape o Plin y escanea el código QR, o transfiere al número de atención oficial: <strong>993 555 276</strong>.<br />
                        2. Coloca el código de aprobación de 6 dígitos que aparece en tu comprobante de Yape para validar la emisión inmediata de tus boletos:
                      </p>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Código de Aprobación Yape (6 dígitos) *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={yapeCode}
                          placeholder="Ej. 748291"
                          onChange={(e) => setYapeCode(e.target.value.replace(/\D/g, ""))}
                          className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 tracking-widest text-center focus:outline-none transition-all ${errors["yapeCode"] ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#002855]"
                            }`}
                        />
                        {errors["yapeCode"] && (
                          <span className="block text-[11px] text-red-600 mt-1 font-medium text-center">
                            {errors["yapeCode"]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "agency" && (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                      <Icon name="clock" size={20} className="text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Reserva válida por 2 horas</strong>
                        <p className="mt-0.5 text-amber-800">
                          Se generará un código CIP. Puedes pagarlo en ventanilla, agentes o banca por internet de BCP, BBVA, Interbank, Scotiabank o en cualquier agencia Cruz del Sur.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-gray-200 text-center space-y-1">
                      <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                        Código CIP Asignado
                      </span>
                      <div className="text-2xl font-black text-[#002855] tracking-widest">
                        CIP 4892 1047
                      </div>
                      <span className="text-xs text-emerald-700 font-semibold">
                        Empresa: Transportes Cruz del Sur · Monto: S/ {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Panel Lateral: Resumen Final y Botón de Pago */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-36">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md space-y-4">
                <h3 className="font-extrabold text-base text-[#002855] border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>Resumen de tu Viaje</span>
                  <span className="text-xs bg-[#FFD100] text-[#002855] px-2 py-0.5 rounded font-black">
                    {isRoundTrip ? "Ida y Vuelta" : "Paso Final"}
                  </span>
                </h3>

                {/* Detalle Viaje de IDA */}
                <div className="p-3 bg-blue-50/50 rounded-xl space-y-1.5 text-xs border border-blue-100">
                  <div className="flex justify-between items-center font-bold text-[#002855]">
                    <span>Ida: {trip.originCity} ➔ {trip.destCity}</span>
                    <span>S/ {subtotalIda.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Servicio:</span>
                    <span className="font-semibold">{trip.service} ({trip.departTime})</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Asientos ({selectedSeats.length}):</span>
                    <span className="font-black text-[#002855]">
                      {selectedSeats.map((s) => `#${s.number}`).join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Pasajeros:</span>
                    <span>{passengers.length}</span>
                  </div>
                </div>

                {/* Detalle Viaje de REGRESO si aplica */}
                {isRoundTrip && tripReturn && (
                  <div className="p-3 bg-amber-50/50 rounded-xl space-y-1.5 text-xs border border-amber-200">
                    <div className="flex justify-between items-center font-bold text-amber-950">
                      <span>Regreso: {tripReturn.originCity} ➔ {tripReturn.destCity}</span>
                      <span>S/ {subtotalReturn.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Servicio:</span>
                      <span className="font-semibold">{tripReturn.service} ({tripReturn.departTime})</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Asientos ({selectedSeatsReturn.length}):</span>
                      <span className="font-black text-amber-900">
                        {selectedSeatsReturn.map((s) => `#${s.number}`).join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Pasajeros:</span>
                      <span>{passengersReturn.length}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Comprobante:</span>
                    <span className="text-gray-900 font-bold">{billingType}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal Pasajes Ida ({selectedSeats.length}):</span>
                    <span>S/ {subtotalIda.toFixed(2)}</span>
                  </div>

                  {isRoundTrip && (
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal Pasajes Regreso ({selectedSeatsReturn.length}):</span>
                      <span>S/ {subtotalReturn.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>IGV (18% incluido):</span>
                    <span>S/ {(totalAmount * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tasa de embarque:</span>
                    <span className="text-emerald-700 font-bold">S/ 0.00</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="block text-xs font-bold text-gray-600">Total a Pagar</span>
                    <span className="text-[10px] text-gray-400">~${(totalAmount / 3.75).toFixed(2)} USD</span>
                  </div>
                  <span className="text-2xl font-black text-[#002855]">
                    S/ {totalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-4 bg-[#FFD100] hover:bg-[#e6be00] active:scale-98 text-[#002855] font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#f0c200] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#002855] border-t-transparent rounded-full animate-spin"></div>
                      <span>Procesando pago seguro...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="shield" size={16} />
                      <span>Pagar S/ {totalAmount.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <Icon name="shield" size={14} className="text-emerald-700" />
                    <span>Pago con encriptación de 256 bits</span>
                  </div>
                  <p className="text-[10px] text-emerald-700">
                    Tus credenciales financieras viajan de forma segura y nunca son almacenadas en nuestros servidores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

