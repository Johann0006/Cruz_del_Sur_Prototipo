export type Page =
  | "home"
  | "results"
  | "seats"
  | "results-return"
  | "seats-return"
  | "auth"
  | "passengers"
  | "payment"
  | "confirmation"
  | "destinations"
  | "services"
  | "changes"
  | "agencies"
  | "club"
  | "contact"

export interface UserAccount {
  id: string
  dni: string
  firstName: string
  lastName: string
  birthDate: string
  gender: "Masculino" | "Femenino"
  nationality: string
  phone: string
  email: string
  password: string
  createdAt: string
}

export interface CityOption {
  id: string
  name: string
  department: string
  terminal: string
  popular?: boolean
  startingPrice: number
  image: string
  region: "costa" | "sierra" | "selva"
  description: string
  durationHours: number
}

export type TripServiceType = "Cruzero Suite" | "Cruzero Evolution" | "Confort Suite" | "Ica Line Express"

export interface Trip {
  id: string
  service: TripServiceType
  reclineFloor1: string
  reclineFloor2?: string
  floors: 1 | 2
  departTime: string
  arriveTime: string
  duration: string
  originCity: string
  originTerminal: string
  destCity: string
  destTerminal: string
  fareType: "Ocasión" | "Regular" | "Insuperable" | "Promocional"
  priceFloor1: number
  priceFloor2?: number
  availableSeats: number
  amenities: string[]
  direct: boolean
  busCode: string
}

export interface SelectedSeat {
  number: number
  floor: 1 | 2
  price: number
  recline: string
}

export interface PassengerData {
  seatNumber: number
  floor: 1 | 2
  docType: "DNI" | "Carné de Extranjería" | "Pasaporte"
  docNumber: string
  firstName: string
  lastName: string
  birthDate: string
  gender: "Masculino" | "Femenino"
  nationality: string
}

export interface ContactData {
  email: string
  confirmEmail: string
  phone: string
}

export interface BillingData {
  type: "Boleta" | "Factura"
  ruc: string
  businessName: string
  fiscalAddress: string
}

export interface PaymentData {
  method: "card" | "yape" | "agency"
  cardNumber: string
  cardHolder: string
  cardExpiry: string
  cardCvv: string
  cardType?: "visa" | "mastercard" | "amex" | "other"
  yapeCode: string
}

export interface SearchParams {
  tripType: "ida" | "ida-vuelta"
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  passengerCount: number
}

export interface BookingState {
  search: SearchParams
  selectedTrip: Trip | null
  selectedSeats: SelectedSeat[]
  passengers: PassengerData[]
  contact: ContactData
  billing: BillingData
  payment: PaymentData
  reservationCode: string
  transactionDate: string
}

