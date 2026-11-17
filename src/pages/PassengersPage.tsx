import React, { useState } from "react"
import { Icon } from "../components/Icons"
import { ReservationTimerCard } from "../components/ReservationTimerCard"
import { consultarDniReniec } from "../services/apiValidationService"
import { ContactData, Page, PassengerData, SelectedSeat, Trip } from "../types"

interface PassengersPageProps {
  trip: Trip
  selectedSeats: SelectedSeat[]
  tripReturn?: Trip | null
  selectedSeatsReturn?: SelectedSeat[]
  initialPassengers: PassengerData[]
  initialPassengersReturn?: PassengerData[]
  initialContact: ContactData
  onSaveAndContinue: (
    passengers: PassengerData[],
    passengersReturn: PassengerData[],
    contact: ContactData,
  ) => void
  navigate: (p: Page) => void
  reservationSecondsLeft?: number
}

interface ValidationErrors {
  [key: string]: string
}

export function PassengersPage({
  trip,
  selectedSeats,
  tripReturn,
  selectedSeatsReturn = [],
  initialPassengers,
  initialPassengersReturn = [],
  initialContact,
  onSaveAndContinue,
  navigate,
  reservationSecondsLeft = 15 * 60,
}: PassengersPageProps) {
  const isRoundTrip = !!tripReturn && selectedSeatsReturn.length > 0

  // Inicializar estado de pasajeros de IDA (vacío por defecto salvo que se pase initialPassengers)
  const [passengers, setPassengers] = useState<PassengerData[]>(() => {
    return selectedSeats.map((seat, index) => {
      const existing = initialPassengers[index]
      return {
        seatNumber: seat.number,
        floor: seat.floor,
        docType: existing?.docType || "DNI",
        docNumber: existing?.docNumber || "",
        firstName: existing?.firstName || "",
        lastName: existing?.lastName || "",
        birthDate: existing?.birthDate || "",
        gender: existing?.gender || "Masculino",
        nationality: existing?.nationality || "Peruana",
      }
    })
  })

  // Inicializar estado de pasajeros de REGRESO (completamente vacíos)
  const [passengersReturn, setPassengersReturn] = useState<PassengerData[]>(() => {
    return selectedSeatsReturn.map((seat, index) => {
      const existing = initialPassengersReturn[index]
      return {
        seatNumber: seat.number,
        floor: seat.floor,
        docType: existing?.docType || "DNI",
        docNumber: existing?.docNumber || "",
        firstName: existing?.firstName || "",
        lastName: existing?.lastName || "",
        birthDate: existing?.birthDate || "",
        gender: existing?.gender || "Masculino",
        nationality: existing?.nationality || "Peruana",
      }
    })
  })

  const [contact, setContact] = useState<ContactData>(() => ({
    email: initialContact?.email || "",
    confirmEmail: initialContact?.confirmEmail || "",
    phone: initialContact?.phone || "",
  }))

  const [termsAccepted, setTermsAccepted] = useState(true)
  const [promoAccepted, setPromoAccepted] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  // Estados de consulta RENIEC por acompañante
  const [loadingDniKey, setLoadingDniKey] = useState<string | null>(null)
  const [dniFeedback, setDniFeedback] = useState<{ [key: string]: string }>({})

  // Consulta RENIEC para pasajeros de IDA (acompañantes)
  const handleLookupDniIda = async (idx: number) => {
    const p = passengers[idx]
    if (p.docType !== "DNI") return
    const cleanDni = p.docNumber.replace(/\D/g, "").trim()
    const docKey = `p_${idx}_docNumber`

    if (cleanDni.length !== 8) {
      setErrors((prev) => ({
        ...prev,
        [docKey]: "El DNI debe tener 8 dígitos numéricos para consultar RENIEC.",
      }))
      return
    }

    setLoadingDniKey(`ida_${idx}`)
    setDniFeedback((prev) => ({ ...prev, [`ida_${idx}`]: "Consultando RENIEC..." }))

    const res = await consultarDniReniec(cleanDni)
    setLoadingDniKey(null)

    if (res.success && res.data) {
      const updated = [...passengers]
      updated[idx] = {
        ...updated[idx],
        docNumber: cleanDni,
        firstName: res.data.names,
        lastName: res.data.surnames,
        birthDate: res.data.birthDate,
        gender: res.data.gender,
      }
      setPassengers(updated)

      setErrors((prev) => {
        const next = { ...prev }
        delete next[`p_${idx}_docNumber`]
        delete next[`p_${idx}_firstName`]
        delete next[`p_${idx}_lastName`]
        delete next[`p_${idx}_birthDate`]
        return next
      })

      setDniFeedback((prev) => ({
        ...prev,
        [`ida_${idx}`]: "✓ RENIEC: Datos cargados",
      }))
      setTimeout(() => {
        setDniFeedback((prev) => {
          const next = { ...prev }
          delete next[`ida_${idx}`]
          return next
        })
      }, 3500)
    } else {
      setDniFeedback((prev) => {
        const next = { ...prev }
        delete next[`ida_${idx}`]
        return next
      })
      setErrors((prev) => ({
        ...prev,
        [docKey]: res.error || "DNI no encontrado en los registros de RENIEC.",
      }))
    }
  }

  // Consulta RENIEC para pasajeros de REGRESO
  const handleLookupDniReturn = async (idx: number) => {
    const p = passengersReturn[idx]
    if (p.docType !== "DNI") return
    const cleanDni = p.docNumber.replace(/\D/g, "").trim()
    const docKey = `pr_${idx}_docNumber`

    if (cleanDni.length !== 8) {
      setErrors((prev) => ({
        ...prev,
        [docKey]: "El DNI debe tener 8 dígitos numéricos para consultar RENIEC.",
      }))
      return
    }

    setLoadingDniKey(`ret_${idx}`)
    setDniFeedback((prev) => ({ ...prev, [`ret_${idx}`]: "Consultando RENIEC..." }))

    const res = await consultarDniReniec(cleanDni)
    setLoadingDniKey(null)

    if (res.success && res.data) {
      const updated = [...passengersReturn]
      updated[idx] = {
        ...updated[idx],
        docNumber: cleanDni,
        firstName: res.data.names,
        lastName: res.data.surnames,
        birthDate: res.data.birthDate,
        gender: res.data.gender,
      }
      setPassengersReturn(updated)

      setErrors((prev) => {
        const next = { ...prev }
        delete next[`pr_${idx}_docNumber`]
        delete next[`pr_${idx}_firstName`]
        delete next[`pr_${idx}_lastName`]
        delete next[`pr_${idx}_birthDate`]
        return next
      })

      setDniFeedback((prev) => ({
        ...prev,
        [`ret_${idx}`]: "✓ RENIEC: Datos cargados",
      }))
      setTimeout(() => {
        setDniFeedback((prev) => {
          const next = { ...prev }
          delete next[`ret_${idx}`]
          return next
        })
      }, 3500)
    } else {
      setDniFeedback((prev) => {
        const next = { ...prev }
        delete next[`ret_${idx}`]
        return next
      })
      setErrors((prev) => ({
        ...prev,
        [docKey]: res.error || "DNI no encontrado en los registros de RENIEC.",
      }))
    }
  }

  // Validaciones individuales
  const validateField = (name: string, value: string, extra?: any): string => {
    if (name.includes("docNumber")) {
      const docType = extra?.docType || "DNI"
      if (!value.trim()) return "El número de documento es obligatorio."
      if (docType === "DNI") {
        if (!/^\d{8}$/.test(value.trim())) {
          return "El DNI debe tener exactamente 8 dígitos numéricos."
        }
      } else if (docType === "Carné de Extranjería") {
        if (!/^[a-zA-Z0-9]{9,12}$/.test(value.trim())) {
          return "El CE debe tener entre 9 y 12 caracteres alfanuméricos."
        }
      } else if (docType === "Pasaporte") {
        if (!/^[a-zA-Z0-9]{6,12}$/.test(value.trim())) {
          return "El pasaporte debe tener entre 6 y 12 caracteres."
        }
      }
    }

    if (name.includes("firstName")) {
      if (!value.trim()) return "Los nombres son obligatorios."
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,40}$/.test(value.trim())) {
        return "Ingresa nombres válidos (solo letras, mínimo 2 caracteres)."
      }
    }

    if (name.includes("lastName")) {
      if (!value.trim()) return "Los apellidos son obligatorios."
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,40}$/.test(value.trim())) {
        return "Ingresa apellidos válidos (solo letras, mínimo 2 caracteres)."
      }
    }

    if (name.includes("birthDate")) {
      if (!value) return "La fecha de nacimiento es obligatoria."
      const date = new Date(value)
      const now = new Date()
      if (date >= now) return "La fecha de nacimiento no puede ser futura."
    }

    if (name === "contact_email") {
      if (!value.trim()) return "El correo electrónico es obligatorio."
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return "Ingresa un correo electrónico con formato válido (ej. usuario@dominio.com)."
      }
    }

    if (name === "contact_confirmEmail") {
      if (!value.trim()) return "Debes confirmar el correo electrónico."
      if (value.trim() !== extra?.email?.trim()) {
        return "Los correos electrónicos no coinciden."
      }
    }

    if (name === "contact_phone") {
      if (!value.trim()) return "El celular es obligatorio."
      if (!/^9\d{8}$/.test(value.trim())) {
        return "El celular debe tener 9 dígitos y comenzar con 9 (ej. 993555276)."
      }
    }

    return ""
  }

  const handlePassengerChange = (
    index: number,
    field: keyof PassengerData,
    value: string,
  ) => {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    setPassengers(updated)

    const key = `p_${index}_${field}`
    const errorMsg = validateField(key, value, {
      docType: updated[index].docType,
    })
    setErrors((prev) => ({ ...prev, [key]: errorMsg }))
  }

  const handlePassengerReturnChange = (
    index: number,
    field: keyof PassengerData,
    value: string,
  ) => {
    const updated = [...passengersReturn]
    updated[index] = { ...updated[index], [field]: value }
    setPassengersReturn(updated)

    const key = `pr_${index}_${field}`
    const errorMsg = validateField(key, value, {
      docType: updated[index].docType,
    })
    setErrors((prev) => ({ ...prev, [key]: errorMsg }))
  }

  // Copiar datos de ida al regreso para mayor comodidad
  const handleCopyFromIda = () => {
    const updated = passengersReturn.map((pr, idx) => {
      const source = passengers[idx] || passengers[0]
      if (!source) return pr
      return {
        ...pr,
        docType: source.docType,
        docNumber: source.docNumber,
        firstName: source.firstName,
        lastName: source.lastName,
        birthDate: source.birthDate,
        gender: source.gender,
        nationality: source.nationality,
      }
    })
    setPassengersReturn(updated)
    setErrors({})
  }

  const handleContactChange = (field: keyof ContactData, value: string) => {
    const updated = { ...contact, [field]: value }
    setContact(updated)

    const key = `contact_${field}`
    const errorMsg = validateField(key, value, {
      email: field === "confirmEmail" ? updated.email : undefined,
    })
    setErrors((prev) => ({ ...prev, [key]: errorMsg }))

    if (field === "email" && updated.confirmEmail) {
      const confirmErr = validateField("contact_confirmEmail", updated.confirmEmail, {
        email: value,
      })
      setErrors((prev) => ({ ...prev, contact_confirmEmail: confirmErr }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: ValidationErrors = {}

    // 1. Validar pasajeros de IDA
    passengers.forEach((p, index) => {
      const docErr = validateField(`p_${index}_docNumber`, p.docNumber, {
        docType: p.docType,
      })
      if (docErr) newErrors[`p_${index}_docNumber`] = docErr

      const fnErr = validateField(`p_${index}_firstName`, p.firstName)
      if (fnErr) newErrors[`p_${index}_firstName`] = fnErr

      const lnErr = validateField(`p_${index}_lastName`, p.lastName)
      if (lnErr) newErrors[`p_${index}_lastName`] = lnErr

      const bdErr = validateField(`p_${index}_birthDate`, p.birthDate)
      if (bdErr) newErrors[`p_${index}_birthDate`] = bdErr
    })

    // 2. Validar pasajeros de REGRESO si aplica
    if (isRoundTrip) {
      passengersReturn.forEach((p, index) => {
        const docErr = validateField(`pr_${index}_docNumber`, p.docNumber, {
          docType: p.docType,
        })
        if (docErr) newErrors[`pr_${index}_docNumber`] = docErr

        const fnErr = validateField(`pr_${index}_firstName`, p.firstName)
        if (fnErr) newErrors[`pr_${index}_firstName`] = fnErr

        const lnErr = validateField(`pr_${index}_lastName`, p.lastName)
        if (lnErr) newErrors[`pr_${index}_lastName`] = lnErr

        const bdErr = validateField(`pr_${index}_birthDate`, p.birthDate)
        if (bdErr) newErrors[`pr_${index}_birthDate`] = bdErr
      })
    }

    // 3. Validar contacto
    const emailErr = validateField("contact_email", contact.email)
    if (emailErr) newErrors["contact_email"] = emailErr

    const confirmEmailErr = validateField(
      "contact_confirmEmail",
      contact.confirmEmail,
      { email: contact.email },
    )
    if (confirmEmailErr) newErrors["contact_confirmEmail"] = confirmEmailErr

    const phoneErr = validateField("contact_phone", contact.phone)
    if (phoneErr) newErrors["contact_phone"] = phoneErr

    if (!termsAccepted) {
      newErrors["terms"] = "Debes aceptar los términos y condiciones de viaje para continuar."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSaveAndContinue(passengers, passengersReturn, contact)
    } else {
      window.scrollTo({ top: 150, behavior: "smooth" })
    }
  }

  const priceIda = selectedSeats.reduce((acc, s) => acc + s.price, 0)
  const priceReturn = selectedSeatsReturn.reduce((acc, s) => acc + s.price, 0)
  const totalPrice = priceIda + priceReturn
  const hasErrors = Object.keys(errors).some((k) => errors[k])

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
            <div className="flex items-center gap-2 text-[#002855] font-black shrink-0">
              <span className="w-6 h-6 rounded-full bg-[#002855] text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>3. Pasajeros</span>
            </div>
            <span className="text-gray-300">———</span>
            <div className="flex items-center gap-2 text-gray-400 font-medium shrink-0">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                4
              </span>
              <span className="hidden sm:inline">4. Pago</span>
            </div>
          </div>

          {/* Card de Tiempo de Reserva Oficial */}
          <ReservationTimerCard secondsLeft={reservationSecondsLeft} compact />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(isRoundTrip ? "seats-return" : "seats")}
            className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-[#002855] font-bold mb-3 cursor-pointer"
          >
            <Icon name="chevronLeft" size={16} />
            <span>Volver a selección de asientos</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-black text-[#002855]">
            ¿Quiénes viajan?
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Ingresa los datos exactos tal como figuran en el documento de identidad físico de cada pasajero.
          </p>
        </div>

        {hasErrors && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-3">
            <Icon name="alert" size={20} className="text-red-500 shrink-0" />
            <span className="font-bold">
              Por favor revisa los campos señalados en rojo para poder continuar con el pago.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Formulario de Pasajeros y Contacto */}
            <div className="lg:col-span-8 space-y-8">
              {/* ========================================================= */}
              {/* SECCIÓN 1: PASAJEROS VIAJE DE IDA                         */}
              {/* ========================================================= */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#002855] text-[#FFD100] text-xs font-black flex items-center justify-center">
                      IDA
                    </span>
                    <h2 className="text-lg font-black text-[#002855]">
                      Pasajeros del Viaje de Ida ({passengers.length} {passengers.length === 1 ? "asiento" : "asientos"})
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">
                    {trip.originCity} ➔ {trip.destCity}
                  </span>
                </div>

                {passengers.map((p, idx) => {
                  const seatInfo = selectedSeats[idx]
                  const docKey = `p_${idx}_docNumber`
                  const fnKey = `p_${idx}_firstName`
                  const lnKey = `p_${idx}_lastName`
                  const bdKey = `p_${idx}_birthDate`

                  return (
                    <div
                      key={`ida_${idx}`}
                      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-[#002855] text-white font-black text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h3 className="font-extrabold text-base text-[#002855]">
                            Pasajero {idx + 1} (Ida)
                          </h3>
                        </div>

                        <div className="bg-blue-50 text-[#002855] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                          Asiento <strong>{seatInfo?.number}</strong> · Piso {seatInfo?.floor} ({seatInfo?.recline})
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Tipo de Documento */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Tipo de Documento *
                          </label>
                          <select
                            value={p.docType}
                            onChange={(e) =>
                              handlePassengerChange(idx, "docType", e.target.value as any)
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all cursor-pointer"
                          >
                            <option value="DNI">DNI (Perú)</option>
                            <option value="Carné de Extranjería">Carné de Extranjería</option>
                            <option value="Pasaporte">Pasaporte</option>
                          </select>
                        </div>

                        {/* Número de Documento */}
                        <div className="sm:col-span-1 lg:col-span-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                              Número de Documento ({p.docType}) *
                            </label>
                            {idx > 0 && p.docType === "DNI" && (
                              <span className="text-[10px] text-blue-600 font-semibold">
                                Presiona Enter ↵ para autocompletar
                              </span>
                            )}
                            {idx === 0 && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                Titular Comprador
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              maxLength={p.docType === "DNI" ? 8 : 12}
                              value={p.docNumber}
                              placeholder={p.docType === "DNI" ? "8 dígitos (ej. 70123456)" : "Número de documento"}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && idx > 0 && p.docType === "DNI") {
                                  e.preventDefault()
                                  handleLookupDniIda(idx)
                                }
                              }}
                              onChange={(e) =>
                                handlePassengerChange(idx, "docNumber", e.target.value)
                              }
                              className={`w-full bg-gray-50 border rounded-xl ${idx > 0 && p.docType === "DNI" ? "pl-3 pr-20" : "px-3"
                                } py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors[docKey]
                                  ? "border-red-400 bg-red-50/30"
                                  : p.docNumber
                                    ? "border-emerald-500"
                                    : "border-gray-200 focus:border-[#002855]"
                                }`}
                            />
                            {idx > 0 && p.docType === "DNI" && (
                              <button
                                type="button"
                                onClick={() => handleLookupDniIda(idx)}
                                disabled={loadingDniKey === `ida_${idx}` || p.docNumber.length !== 8}
                                className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-[#002855] hover:bg-[#073366] disabled:bg-gray-300 text-[#FFD100] disabled:text-gray-500 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                                title="Consultar DNI en RENIEC"
                              >
                                {loadingDniKey === `ida_${idx}` ? (
                                  <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                  <span>Buscar</span>
                                )}
                              </button>
                            )}
                            {idx === 0 && p.docNumber && !errors[docKey] && (
                              <span className="absolute right-3 top-2.5 text-emerald-600 font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          {dniFeedback[`ida_${idx}`] && (
                            <span className="block text-[10px] font-bold text-emerald-600 mt-1">
                              {dniFeedback[`ida_${idx}`]}
                            </span>
                          )}
                          {errors[docKey] && (
                            <span className="block text-[11px] text-red-600 mt-1 font-medium">
                              {errors[docKey]}
                            </span>
                          )}
                        </div>

                        {/* Nombres */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Nombres *
                          </label>
                          <input
                            type="text"
                            value={p.firstName}
                            placeholder="Ej. Juan Alberto"
                            onChange={(e) =>
                              handlePassengerChange(idx, "firstName", e.target.value)
                            }
                            className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors[fnKey]
                              ? "border-red-400 bg-red-50/30"
                              : "border-gray-200 focus:border-[#002855]"
                              }`}
                          />
                          {errors[fnKey] && (
                            <span className="block text-[11px] text-red-600 mt-1 font-medium">
                              {errors[fnKey]}
                            </span>
                          )}
                        </div>

                        {/* Apellidos */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Apellidos *
                          </label>
                          <input
                            type="text"
                            value={p.lastName}
                            placeholder="Ej. Pérez Álvarez"
                            onChange={(e) =>
                              handlePassengerChange(idx, "lastName", e.target.value)
                            }
                            className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors[lnKey]
                              ? "border-red-400 bg-red-50/30"
                              : "border-gray-200 focus:border-[#002855]"
                              }`}
                          />
                          {errors[lnKey] && (
                            <span className="block text-[11px] text-red-600 mt-1 font-medium">
                              {errors[lnKey]}
                            </span>
                          )}
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Fecha de Nacimiento *
                          </label>
                          <input
                            type="date"
                            value={p.birthDate}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                              handlePassengerChange(idx, "birthDate", e.target.value)
                            }
                            className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors[bdKey]
                              ? "border-red-400 bg-red-50/30"
                              : "border-gray-200 focus:border-[#002855]"
                              }`}
                          />
                          {errors[bdKey] && (
                            <span className="block text-[11px] text-red-600 mt-1 font-medium">
                              {errors[bdKey]}
                            </span>
                          )}
                        </div>

                        {/* Género */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Género
                          </label>
                          <select
                            value={p.gender}
                            onChange={(e) =>
                              handlePassengerChange(idx, "gender", e.target.value as any)
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all cursor-pointer"
                          >
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                          </select>
                        </div>

                        {/* Nacionalidad */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Nacionalidad
                          </label>
                          <select
                            value={p.nationality}
                            onChange={(e) =>
                              handlePassengerChange(idx, "nationality", e.target.value)
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all cursor-pointer"
                          >
                            <option value="Peruana">Peruana</option>
                            <option value="Extranjera">Extranjera</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ========================================================= */}
              {/* SECCIÓN 2: PASAJEROS VIAJE DE REGRESO (SI ES IDA-VUELTA) */}
              {/* ========================================================= */}
              {isRoundTrip && tripReturn && (
                <div className="space-y-4 pt-4 border-t-2 border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#FFD100] text-[#002855] text-xs font-black flex items-center justify-center">
                        RET
                      </span>
                      <h2 className="text-lg font-black text-[#002855]">
                        Pasajeros del Viaje de Regreso ({passengersReturn.length} {passengersReturn.length === 1 ? "asiento" : "asientos"})
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyFromIda}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-[#002855] font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Icon name="user" size={13} />
                      <span>Copiar datos desde los pasajeros de Ida</span>
                    </button>
                  </div>

                  {passengersReturn.map((p, idx) => {
                    const seatInfo = selectedSeatsReturn[idx]
                    const docKey = `pr_${idx}_docNumber`
                    const fnKey = `pr_${idx}_firstName`
                    const lnKey = `pr_${idx}_lastName`
                    const bdKey = `pr_${idx}_birthDate`

                    return (
                      <div
                        key={`return_${idx}`}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5"
                      >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-[#FFD100] text-[#002855] font-black text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h3 className="font-extrabold text-base text-[#002855]">
                              Pasajero {idx + 1} (Regreso)
                            </h3>
                          </div>

                          <div className="bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                            Asiento <strong>{seatInfo?.number}</strong> · Piso {seatInfo?.floor} ({seatInfo?.recline})
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Tipo de Documento */}
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Tipo de Documento *
                            </label>
                            <select
                              value={p.docType}
                              onChange={(e) =>
                                handlePassengerReturnChange(idx, "docType", e.target.value as any)
                              }
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all cursor-pointer"
                            >
                              <option value="DNI">DNI (Perú)</option>
                              <option value="Carné de Extranjería">Carné de Extranjería</option>
                              <option value="Pasaporte">Pasaporte</option>
                            </select>
                          </div>

                          {/* Número de Documento */}
                          <div className="sm:col-span-1 lg:col-span-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Número de Documento ({p.docType}) *
                              </label>
                              {p.docType === "DNI" && (
                                <span className="text-[10px] text-blue-600 font-semibold">
                                  Presiona Enter ↵ para autocompletar
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                maxLength={p.docType === "DNI" ? 8 : 12}
                                value={p.docNumber}
                                placeholder={p.docType === "DNI" ? "8 dígitos (ej. 70123456)" : "Número de documento"}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && p.docType === "DNI") {
                                    e.preventDefault()
                                    handleLookupDniReturn(idx)
                                  }
                                }}
                                onChange={(e) =>
                                  handlePassengerReturnChange(idx, "docNumber", e.target.value)
                                }
                                className={`w-full bg-gray-50 border rounded-xl ${p.docType === "DNI" ? "pl-3 pr-20" : "px-3"
                                  } py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors[docKey]
                                    ? "border-red-400 bg-red-50/30"
                                    : p.docNumber
                                      ? "border-emerald-500"
                                      : "border-gray-200 focus:border-[#002855]"
                                  }`}
                              />
                              {p.docType === "DNI" && (
                                <button
                                  type="button"
                                  onClick={() => handleLookupDniReturn(idx)}
                                  disabled={loadingDniKey === `ret_${idx}` || p.docNumber.length !== 8}
                                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-[#002855] hover:bg-[#073366] disabled:bg-gray-300 text-[#FFD100] disabled:text-gray-500 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                                  title="Consultar DNI en RENIEC"
                                >
                                  {loadingDniKey === `ret_${idx}` ? (
                                    <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                                  ) : (
                                    <span>Buscar</span>
                                  )}
                                </button>
                              )}
                            </div>
                            {dniFeedback[`ret_${idx}`] && (
                              <span className="block text-[10px] font-bold text-emerald-600 mt-1">
                                {dniFeedback[`ret_${idx}`]}
                              </span>
                            )}
                            {errors[docKey] && (
                              <span className="block text-[11px] text-red-600 mt-1 font-medium">
                                {errors[docKey]}
                              </span>
                            )}
                          </div>

                          {/* Nombres */}
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Nombres *
                            </label>
                            <input
                              type="text"
                              value={p.firstName}
                              placeholder="Ej. Juan Alberto"
                              onChange={(e) =>
                                handlePassengerReturnChange(idx, "firstName", e.target.value)
                              }
                              className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors[fnKey]
                                ? "border-red-400 bg-red-50/30"
                                : "border-gray-200 focus:border-[#002855]"
                                }`}
                            />
                            {errors[fnKey] && (
                              <span className="block text-[11px] text-red-600 mt-1 font-medium">
                                {errors[fnKey]}
                              </span>
                            )}
                          </div>

                          {/* Apellidos */}
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Apellidos *
                            </label>
                            <input
                              type="text"
                              value={p.lastName}
                              placeholder="Ej. Pérez Álvarez"
                              onChange={(e) =>
                                handlePassengerReturnChange(idx, "lastName", e.target.value)
                              }
                              className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors[lnKey]
                                ? "border-red-400 bg-red-50/30"
                                : "border-gray-200 focus:border-[#002855]"
                                }`}
                            />
                            {errors[lnKey] && (
                              <span className="block text-[11px] text-red-600 mt-1 font-medium">
                                {errors[lnKey]}
                              </span>
                            )}
                          </div>

                          {/* Fecha de Nacimiento */}
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Fecha de Nacimiento *
                            </label>
                            <input
                              type="date"
                              value={p.birthDate}
                              max={new Date().toISOString().split("T")[0]}
                              onChange={(e) =>
                                handlePassengerReturnChange(idx, "birthDate", e.target.value)
                              }
                              className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors[bdKey]
                                ? "border-red-400 bg-red-50/30"
                                : "border-gray-200 focus:border-[#002855]"
                                }`}
                            />
                            {errors[bdKey] && (
                              <span className="block text-[11px] text-red-600 mt-1 font-medium">
                                {errors[bdKey]}
                              </span>
                            )}
                          </div>

                          {/* Género */}
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Género
                            </label>
                            <select
                              value={p.gender}
                              onChange={(e) =>
                                handlePassengerReturnChange(idx, "gender", e.target.value as any)
                              }
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all cursor-pointer"
                            >
                              <option value="Masculino">Masculino</option>
                              <option value="Femenino">Femenino</option>
                            </select>
                          </div>

                          {/* Nacionalidad */}
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Nacionalidad
                            </label>
                            <select
                              value={p.nationality}
                              onChange={(e) =>
                                handlePassengerReturnChange(idx, "nationality", e.target.value)
                              }
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#002855] focus:bg-white transition-all cursor-pointer"
                            >
                              <option value="Peruana">Peruana</option>
                              <option value="Extranjera">Extranjera</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ========================================================= */}
              {/* SECCIÓN 3: DATOS DE CONTACTO (EMAIL / CELULAR)             */}
              {/* ========================================================= */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-extrabold text-base text-[#002855]">
                    Datos de Contacto y Envío de Boletos
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    A este correo y celular enviaremos tus boletos electrónicos con código QR.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={contact.email}
                      placeholder="ejemplo@gmail.com"
                      onChange={(e) => handleContactChange("email", e.target.value)}
                      className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors["contact_email"]
                        ? "border-red-400 bg-red-50/30"
                        : "border-gray-200 focus:border-[#002855]"
                        }`}
                    />
                    {errors["contact_email"] && (
                      <span className="block text-[11px] text-red-600 mt-1 font-medium">
                        {errors["contact_email"]}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Confirmar Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={contact.confirmEmail}
                      placeholder="Repite tu correo"
                      onChange={(e) =>
                        handleContactChange("confirmEmail", e.target.value)
                      }
                      className={`w-full bg-gray-50 border rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors["contact_confirmEmail"]
                        ? "border-red-400 bg-red-50/30"
                        : "border-gray-200 focus:border-[#002855]"
                        }`}
                    />
                    {errors["contact_confirmEmail"] && (
                      <span className="block text-[11px] text-red-600 mt-1 font-medium">
                        {errors["contact_confirmEmail"]}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Celular de Contacto *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">
                        +51
                      </span>
                      <input
                        type="tel"
                        maxLength={9}
                        value={contact.phone}
                        placeholder="993555276"
                        onChange={(e) =>
                          handleContactChange(
                            "phone",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        className={`w-full bg-gray-50 border rounded-xl pl-11 pr-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white transition-all ${errors["contact_phone"]
                          ? "border-red-400 bg-red-50/30"
                          : "border-gray-200 focus:border-[#002855]"
                          }`}
                      />
                    </div>
                    {errors["contact_phone"] && (
                      <span className="block text-[11px] text-red-600 mt-1 font-medium">
                        {errors["contact_phone"]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Términos y Condiciones */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 text-xs text-gray-600">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#002855] focus:ring-[#002855] w-4 h-4"
                  />
                  <span>
                    He leído y acepto los{" "}
                    <strong className="text-blue-700 underline">
                      Términos y Condiciones del Servicio
                    </strong>
                    , las políticas de equipaje (máximo 20kg en bodega) y las condiciones de postergación o anulación de boletos.
                  </span>
                </label>
                {errors["terms"] && (
                  <span className="block text-[11px] text-red-600 font-bold">
                    {errors["terms"]}
                  </span>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promoAccepted}
                    onChange={(e) => setPromoAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#002855] focus:ring-[#002855] w-4 h-4"
                  />
                  <span>
                    Deseo recibir ofertas exclusivas, promociones de viajes y novedades de Cruz del Sur en mi correo.
                  </span>
                </label>
              </div>
            </div>

            {/* Panel Lateral: Resumen de Compra */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-36">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md space-y-4">
                <h3 className="font-extrabold text-base text-[#002855] border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>Resumen de Compra</span>
                  <span className="text-xs bg-blue-50 text-[#002855] px-2.5 py-1 rounded-full font-bold">
                    {isRoundTrip ? "Ida y Vuelta" : "Solo Ida"}
                  </span>
                </h3>

                {/* Resumen Viaje de Ida */}
                <div className="p-3 bg-blue-50/50 rounded-xl space-y-1.5 text-xs border border-blue-100">
                  <div className="flex items-center justify-between font-bold text-[#002855]">
                    <span>Ida: {trip.originCity} ➔ {trip.destCity}</span>
                    <span>S/ {priceIda.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {trip.departTime} · {trip.service}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    Asientos: <strong>{selectedSeats.map((s) => `#${s.number}`).join(", ")}</strong> ({selectedSeats.length})
                  </div>
                </div>

                {/* Resumen Viaje de Regreso si aplica */}
                {isRoundTrip && tripReturn && (
                  <div className="p-3 bg-amber-50/50 rounded-xl space-y-1.5 text-xs border border-amber-200">
                    <div className="flex items-center justify-between font-bold text-amber-950">
                      <span>Regreso: {tripReturn.originCity} ➔ {tripReturn.destCity}</span>
                      <span>S/ {priceReturn.toFixed(2)}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {tripReturn.departTime} · {tripReturn.service}
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Asientos: <strong>{selectedSeatsReturn.map((s) => `#${s.number}`).join(", ")}</strong> ({selectedSeatsReturn.length})
                    </div>
                  </div>
                )}

                {/* Desglose de Precios */}
                <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal Pasajes Ida ({selectedSeats.length}):</span>
                    <span>S/ {priceIda.toFixed(2)}</span>
                  </div>

                  {isRoundTrip && (
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal Pasajes Regreso ({selectedSeatsReturn.length}):</span>
                      <span>S/ {priceReturn.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>IGV (18% incluido):</span>
                    <span>S/ {(totalPrice * 0.18).toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-100 pt-3 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-gray-600">Total a Pagar</span>
                  <span className="text-2xl font-black text-[#002855]">
                    S/ {totalPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-4 bg-[#FFD100] hover:bg-[#e6be00] active:scale-98 text-[#002855] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#f0c200]"
                >
                  <span>Continuar con el Pago</span>
                  <Icon name="arrowRight" size={16} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
