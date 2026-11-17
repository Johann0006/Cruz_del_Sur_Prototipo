import { useEffect, useState } from "react"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { getTripsForRoute, SAMPLE_TRIPS } from "./data/mockData"
import { getCurrentUserSession, logoutUserSession } from "./services/authService"
import { AgenciesPage } from "./pages/AgenciesPage"
import { AuthPage } from "./pages/AuthPage"
import { ChangesPage } from "./pages/ChangesPage"
import { ClubPage } from "./pages/ClubPage"
import { ConfirmationPage } from "./pages/ConfirmationPage"
import { ContactPage } from "./pages/ContactPage"
import { DestinationsPage } from "./pages/DestinationsPage"
import { HomePage } from "./pages/HomePage"
import { PassengersPage } from "./pages/PassengersPage"
import { PaymentPage } from "./pages/PaymentPage"
import { ResultsPage } from "./pages/ResultsPage"
import { SeatsPage } from "./pages/SeatsPage"
import { ServicesPage } from "./pages/ServicesPage"
import {
  BillingData,
  ContactData,
  Page,
  PassengerData,
  PaymentData,
  SearchParams,
  SelectedSeat,
  Trip,
  UserAccount,
} from "./types"

// Helper: fecha local del computador sin desfase UTC
const getLocalDateISO = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [currency, setCurrency] = useState<"PEN" | "USD">("PEN")

  const today = getLocalDateISO(0)
  const tomorrow = getLocalDateISO(1)

  // ─── Estado del flujo de reserva ──────────────────────────────────────────
  const [searchParams, setSearchParams] = useState<SearchParams>({
    tripType: "ida",
    origin: "Lima",
    destination: "Arequipa",
    departDate: today,
    returnDate: undefined,
    passengerCount: 1,
  })

  // ─── Viaje y asientos de IDA ──────────────────────────────────────────────
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(() => getTripsForRoute("Lima", "Arequipa")[0])
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([])

  // ─── Viaje y asientos de REGRESO (solo aplica en ida-vuelta) ─────────────
  const [selectedTripReturn, setSelectedTripReturn] = useState<Trip | null>(null)
  const [selectedSeatsReturn, setSelectedSeatsReturn] = useState<SelectedSeat[]>([])

  // ─── Pasajeros de IDA ─────────────────────────────────────────────────────
  const [passengers, setPassengers] = useState<PassengerData[]>([])

  // ─── Pasajeros de REGRESO (uno por asiento de regreso) ───────────────────
  const [passengersReturn, setPassengersReturn] = useState<PassengerData[]>([])

  const [contact, setContact] = useState<ContactData>({
    email: "",
    confirmEmail: "",
    phone: "",
  })

  const [billing, setBilling] = useState<BillingData>({
    type: "Boleta",
    ruc: "",
    businessName: "",
    fiscalAddress: "",
  })

  const [payment, setPayment] = useState<PaymentData>({
    method: "card",
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
    cardType: "visa",
    yapeCode: "",
  })

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUserSession())

  const [reservationCode, setReservationCode] = useState<string>("CDS-7842-PE")

  // ─── Temporizador Global de Reserva (15 minutos continuos entre vistas) ───
  const [reservationDeadline, setReservationDeadline] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Intervalo global de cuenta regresiva por segundo
  useEffect(() => {
    if (!reservationDeadline) return
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [reservationDeadline])

  // Iniciar automáticamente los 15 minutos al ingresar a la selección de asientos
  useEffect(() => {
    const reservationSteps: Page[] = [
      "seats",
      "results-return",
      "seats-return",
      "auth",
      "passengers",
      "payment",
    ]
    if (reservationSteps.includes(currentPage) && !reservationDeadline) {
      setReservationDeadline(Date.now() + 15 * 60 * 1000)
    }
  }, [currentPage, reservationDeadline])

  // Cálculo en segundos restantes continuo
  const reservationSecondsLeft = reservationDeadline
    ? Math.max(0, Math.floor((reservationDeadline - currentTime) / 1000))
    : 15 * 60

  // Si expira el tiempo de reserva durante el proceso de compra
  useEffect(() => {
    const reservationSteps: Page[] = [
      "seats",
      "results-return",
      "seats-return",
      "auth",
      "passengers",
      "payment",
    ]
    if (reservationDeadline && reservationSecondsLeft <= 0 && reservationSteps.includes(currentPage)) {
      alert("Tu tiempo de reserva ha expirado. Por favor selecciona nuevamente tus asientos para continuar.")
      setReservationDeadline(null)
      setSelectedSeats([])
      setSelectedSeatsReturn([])
      navigate("results")
    }
  }, [reservationDeadline, reservationSecondsLeft, currentPage])

  // ─── Navegación ───────────────────────────────────────────────────────────
  const navigate = (page: Page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ─── Iniciar búsqueda ─────────────────────────────────────────────────────
  const handleStartSearch = (params: SearchParams) => {
    setSearchParams(params)
    const available = getTripsForRoute(params.origin, params.destination)
    setSelectedTrip(available[0] || null)
    setSelectedSeats([])
    setSelectedTripReturn(null)
    setSelectedSeatsReturn([])
    setPassengersReturn([])
    setReservationDeadline(null)
    navigate("results")
  }

  // ─── Seleccionar viaje de IDA ─────────────────────────────────────────────
  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip)
    setSelectedSeats([])
    setReservationDeadline(Date.now() + 15 * 60 * 1000)
    navigate("seats")
  }

  // ─── Toggle asiento de IDA ────────────────────────────────────────────────
  const handleToggleSeat = (seat: SelectedSeat) => {
    const exists = selectedSeats.some((s) => s.number === seat.number)
    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.number !== seat.number))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  // Helper: auto-completar datos del usuario autenticado en el Pasajero 1 y contacto
  const applyUserToFirstPassenger = (user: UserAccount, targetPassengers: PassengerData[]) => {
    let updated = targetPassengers.length > 0 ? [...targetPassengers] : []
    if (updated.length === 0 && selectedSeats.length > 0) {
      updated = selectedSeats.map((s) => ({
        seatNumber: s.number,
        floor: s.floor,
        docType: "DNI" as const,
        docNumber: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "Masculino" as const,
        nationality: "Peruana",
      }))
    }

    if (updated.length > 0) {
      updated[0] = {
        ...updated[0],
        docType: "DNI",
        docNumber: user.dni,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate || updated[0].birthDate || "",
        gender: (user.gender as "Masculino" | "Femenino") || updated[0].gender || "Masculino",
        nationality: user.nationality || updated[0].nationality || "Peruana",
      }
    }
    setPassengers(updated)
    setContact((prev) => ({
      ...prev,
      email: user.email,
      confirmEmail: user.email,
      phone: user.phone || prev.phone,
    }))
  }

  // ─── Confirmar asientos de IDA ────────────────────────────────────────────
  const handleSeatsConfirmed = () => {
    // Derivar passengerCount de los asientos elegidos
    setSearchParams((prev) => ({ ...prev, passengerCount: selectedSeats.length }))

    // Inicializar pasajeros de ida limpios
    const updatedPassengers = selectedSeats.map((seat, idx) => {
      const existing = passengers[idx]
      return {
        seatNumber: seat.number,
        floor: seat.floor,
        docType: existing?.docNumber ? existing.docType : ("DNI" as const),
        docNumber: existing?.docNumber || "",
        firstName: existing?.firstName || "",
        lastName: existing?.lastName || "",
        birthDate: existing?.birthDate || "",
        gender: existing?.gender || ("Masculino" as const),
        nationality: existing?.nationality || "Peruana",
      }
    })
    setPassengers(updatedPassengers)

    // Si es ida-vuelta, ir a elegir horario de regreso
    if (searchParams.tripType === "ida-vuelta" && searchParams.returnDate) {
      setSelectedSeatsReturn([])
      navigate("results-return")
    } else {
      // Requerir inicio de sesión / registro antes de registrar pasajeros
      if (!currentUser) {
        navigate("auth")
      } else {
        applyUserToFirstPassenger(currentUser, updatedPassengers)
        navigate("passengers")
      }
    }
  }

  // ─── Seleccionar viaje de REGRESO ─────────────────────────────────────────
  const handleSelectTripReturn = (trip: Trip) => {
    setSelectedTripReturn(trip)
    setSelectedSeatsReturn([])
    navigate("seats-return")
  }

  // ─── Toggle asiento de REGRESO ────────────────────────────────────────────
  const handleToggleSeatReturn = (seat: SelectedSeat) => {
    const exists = selectedSeatsReturn.some((s) => s.number === seat.number)
    if (exists) {
      setSelectedSeatsReturn(selectedSeatsReturn.filter((s) => s.number !== seat.number))
    } else {
      setSelectedSeatsReturn([...selectedSeatsReturn, seat])
    }
  }

  // ─── Confirmar asientos de REGRESO ────────────────────────────────────────
  const handleSeatsReturnConfirmed = () => {
    // Inicializar pasajeros de regreso limpios (uno por asiento de regreso)
    const updatedPassengersReturn = selectedSeatsReturn.map((seat, idx) => {
      const existing = passengersReturn[idx]
      return {
        seatNumber: seat.number,
        floor: seat.floor,
        docType: existing?.docNumber ? existing.docType : ("DNI" as const),
        docNumber: existing?.docNumber || "",
        firstName: existing?.firstName || "",
        lastName: existing?.lastName || "",
        birthDate: existing?.birthDate || "",
        gender: existing?.gender || ("Masculino" as const),
        nationality: existing?.nationality || "Peruana",
      }
    })
    setPassengersReturn(updatedPassengersReturn)

    // Requerir inicio de sesión / registro antes de registrar pasajeros
    if (!currentUser) {
      navigate("auth")
    } else {
      applyUserToFirstPassenger(currentUser, passengers)
      navigate("passengers")
    }
  }

  // ─── Manejo de login o registro exitoso ──────────────────────────────────
  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user)
    applyUserToFirstPassenger(user, passengers)
    navigate("passengers")
  }

  const handleLogout = () => {
    logoutUserSession()
    setCurrentUser(null)
  }

  // ─── Guardar pasajeros y continuar a pago ─────────────────────────────────
  const handlePassengersSaved = (
    savedPassengers: PassengerData[],
    savedPassengersReturn: PassengerData[],
    savedContact: ContactData,
  ) => {
    setPassengers(savedPassengers)
    setPassengersReturn(savedPassengersReturn)
    setContact(savedContact)
    navigate("payment")
  }

  // ─── Pago exitoso ─────────────────────────────────────────────────────────
  const handlePaymentSuccess = (
    savedBilling: BillingData,
    savedPayment: PaymentData,
    code: string,
  ) => {
    setBilling(savedBilling)
    setPayment(savedPayment)
    setReservationCode(code)
    setReservationDeadline(null)
    navigate("confirmation")
  }

  const handleNewBooking = () => {
    setSelectedSeats([])
    setSelectedTripReturn(null)
    setSelectedSeatsReturn([])
    setPassengers([])
    setPassengersReturn([])
    setContact({ email: "", confirmEmail: "", phone: "" })
    setReservationDeadline(null)
    navigate("home")
  }

  const isCheckoutStep = [
    "results",
    "seats",
    "results-return",
    "seats-return",
    "auth",
    "passengers",
    "payment",
    "confirmation",
  ].includes(currentPage)

  const totalAmountIda = selectedSeats.reduce((acc, s) => acc + s.price, 0)
  const totalAmountReturn = selectedSeatsReturn.reduce((acc, s) => acc + s.price, 0)
  const totalAmount = totalAmountIda + totalAmountReturn

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#F4F6F9] selection:bg-[#FFD100] selection:text-[#002855]">
      {/* Header oficial Cruz del Sur */}
      <Header
        currentPage={currentPage}
        navigate={navigate}
        compact={isCheckoutStep && currentPage !== "results" && currentPage !== "results-return"}
        currency={currency}
        onCurrencyToggle={() =>
          setCurrency((prev) => (prev === "PEN" ? "USD" : "PEN"))
        }
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Contenido Principal de la Página */}
      <main className="flex-1">
        {currentPage === "home" && (
          <HomePage navigate={navigate} onStartSearch={handleStartSearch} />
        )}

        {/* ─── RESULTADOS IDA ─────────────────────────────────────── */}
        {currentPage === "results" && (
          <ResultsPage
            searchParams={searchParams}
            onUpdateSearch={setSearchParams}
            onSelectTrip={handleSelectTrip}
            navigate={navigate}
            mode="ida"
          />
        )}

        {/* ─── ASIENTOS IDA ───────────────────────────────────────── */}
        {currentPage === "seats" && selectedTrip && (
          <SeatsPage
            trip={selectedTrip}
            searchParams={searchParams}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            onContinue={handleSeatsConfirmed}
            navigate={navigate}
            mode="ida"
            selectedTripReturn={selectedTripReturn}
            selectedSeatsReturn={selectedSeatsReturn}
            reservationSecondsLeft={reservationSecondsLeft}
          />
        )}

        {/* ─── RESULTADOS REGRESO ─────────────────────────────────── */}
        {currentPage === "results-return" && (
          <ResultsPage
            searchParams={searchParams}
            onUpdateSearch={setSearchParams}
            onSelectTrip={handleSelectTripReturn}
            navigate={navigate}
            mode="regreso"
            selectedTrip={selectedTrip}
            selectedSeats={selectedSeats}
            reservationSecondsLeft={reservationSecondsLeft}
          />
        )}

        {/* ─── ASIENTOS REGRESO ───────────────────────────────────── */}
        {currentPage === "seats-return" && selectedTripReturn && (
          <SeatsPage
            trip={selectedTripReturn}
            searchParams={searchParams}
            selectedSeats={selectedSeatsReturn}
            onToggleSeat={handleToggleSeatReturn}
            onContinue={handleSeatsReturnConfirmed}
            navigate={navigate}
            mode="regreso"
            selectedTrip={selectedTrip}
            selectedSeatsIda={selectedSeats}
            reservationSecondsLeft={reservationSecondsLeft}
          />
        )}

        {/* ─── AUTENTICACIÓN (LOGIN / REGISTRO OBLIGATORIO) ──────── */}
        {currentPage === "auth" && (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
            navigate={navigate}
            returnTo={searchParams.tripType === "ida-vuelta" && searchParams.returnDate ? "seats-return" : "seats"}
            reservationSecondsLeft={reservationSecondsLeft}
          />
        )}

        {/* ─── PASAJEROS ──────────────────────────────────────────── */}
        {currentPage === "passengers" && selectedTrip && (
          <PassengersPage
            trip={selectedTrip}
            selectedSeats={selectedSeats}
            tripReturn={selectedTripReturn}
            selectedSeatsReturn={selectedSeatsReturn}
            initialPassengers={passengers}
            initialPassengersReturn={passengersReturn}
            initialContact={contact}
            onSaveAndContinue={handlePassengersSaved}
            navigate={navigate}
            reservationSecondsLeft={reservationSecondsLeft}
          />
        )}

        {/* ─── PAGO ───────────────────────────────────────────────── */}
        {currentPage === "payment" && selectedTrip && (
          <PaymentPage
            trip={selectedTrip}
            selectedSeats={selectedSeats}
            tripReturn={selectedTripReturn}
            selectedSeatsReturn={selectedSeatsReturn}
            passengers={passengers}
            passengersReturn={passengersReturn}
            totalAmount={totalAmount}
            onPaymentSuccess={handlePaymentSuccess}
            navigate={navigate}
            reservationSecondsLeft={reservationSecondsLeft}
          />
        )}

        {/* ─── CONFIRMACIÓN ───────────────────────────────────────── */}
        {currentPage === "confirmation" && selectedTrip && (
          <ConfirmationPage
            trip={selectedTrip}
            selectedSeats={selectedSeats}
            tripReturn={selectedTripReturn}
            selectedSeatsReturn={selectedSeatsReturn}
            passengers={passengers}
            passengersReturn={passengersReturn}
            contact={contact}
            billing={billing}
            payment={payment}
            reservationCode={reservationCode}
            totalAmount={totalAmount}
            departDate={searchParams.departDate}
            returnDate={searchParams.returnDate}
            navigate={navigate}
            onNewBooking={handleNewBooking}
          />
        )}

        {currentPage === "destinations" && (
          <DestinationsPage
            navigate={navigate}
            onSelectDestination={handleStartSearch}
          />
        )}

        {currentPage === "services" && <ServicesPage navigate={navigate} />}
        {currentPage === "changes" && <ChangesPage navigate={navigate} />}
        {currentPage === "agencies" && <AgenciesPage navigate={navigate} />}
        {currentPage === "club" && <ClubPage navigate={navigate} />}
        {currentPage === "contact" && <ContactPage navigate={navigate} />}
      </main>

      {/* Footer oficial Cruz del Sur */}
      <Footer navigate={navigate} />
    </div>
  )
}
