import { useEffect, useState } from "react"
import { Icon } from "../components/Icons"
import { SearchWidget } from "../components/SearchWidget"
import { CITIES, FLEET_SERVICES } from "../data/mockData"
import { Page, SearchParams } from "../types"

interface HomePageProps {
  navigate: (p: Page) => void
  onStartSearch: (params: SearchParams) => void
}

const HERO_BANNERS = [
  {
    id: "huacho",
    image: "/banners/banner-1-huacho.png",
    alt: "Descubre nuestra nueva ruta Huacho al Norte - Chimbote, Trujillo, Chepén, Chiclayo, Pacasmayo, Piura",
    tag: "NUEVA RUTA OFICIAL",
    title: "Huacho al Norte",
    route: "Chimbote · Trujillo · Chepén · Chiclayo · Pacasmayo · Piura",
  },
  {
    id: "marcona",
    image: "/banners/banner-2-marcona.png",
    alt: "Descubre nuestra nueva ruta Arequipa - Marcona",
    tag: "NUEVA RUTA OFICIAL",
    title: "Arequipa ⇄ Marcona",
    route: "Conexión directa en unidades Cruzero Evolution con el mejor confort",
  },
  {
    id: "cuotas",
    image: "/banners/banner-3-cuotas.png",
    alt: "¡Compra hoy y viaja! 3 Cuotas sin intereses con Mercado Pago",
    tag: "PROMOCIÓN EXCLUSIVA",
    title: "3 Cuotas Sin Intereses",
    route: "Paga fácil y viaja más a tus destinos favoritos con Mercado Pago",
  },
  {
    id: "ruta-magica",
    image: "/banners/banner-4-ruta-magica.jpg",
    alt: "Atrévete a descubrir la Ruta Mágica del Sur",
    tag: "CIRCUITO TURÍSTICO",
    title: "Ruta Mágica del Sur",
    route: "Paracas · Ica · Nazca · Arequipa · Cusco · Puno",
  },
  {
    id: "confort-suite",
    image: "/banners/banner-5-confort-suite.png",
    alt: "Nueva Experiencia Confort Suite G8 - 160°, 180°, TV 14'' Touchless",
    tag: "NUEVA FLOTA MARCOPOLO G8",
    title: "Confort Suite de Nueva Generación",
    route: "Asientos 180° Cama · Pantallas individuales 14'' Touchless",
  },
  {
    id: "bus-tracker",
    image: "/banners/banner-6-bus-tracker.png",
    alt: "Nueva Función Bus Tracker - Sigue tu bus en tiempo real",
    tag: "TECNOLOGÍA Y SEGURIDAD",
    title: "Bus Tracker en Tiempo Real",
    route: "Monitorea la ubicación y llegada exacta de tu bus desde el celular",
  },
]

export function HomePage({ navigate, onStartSearch }: HomePageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [selectedFleetTab, setSelectedFleetTab] = useState(0)

  // Estado del Carrusel de Banners Oficiales
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Temporizador para cambio automático cada 5 segundos
  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isHovered])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)
  }

  const faqs = [
    {
      q: "¿Cómo puedo comprar pasajes en la web de Cruz del Sur?",
      a: "El proceso es 100% digital y seguro: 1) Elige tu ciudad de origen, destino y fecha. 2) Selecciona el horario e itinerario deseado. 3) Escoge tus asientos en el plano interactivo del bus. 4) Ingresa los datos de los pasajeros (DNI o pasaporte). 5) Paga con tarjeta de crédito/débito, Yape, Plin o PagoEfectivo. Recibirás tu boleto electrónico al instante en tu correo.",
    },
    {
      q: "¿Cuánto equipaje puedo llevar en mi viaje?",
      a: "Todos los pasajeros tienen derecho a transportar hasta 20 kg de equipaje en bodega debidamente rotulado con ticket de custodia, además de un bolso de mano o mochila de hasta 6 kg que no exceda las dimensiones del compartimento superior.",
    },
    {
      q: "¿Cuáles son las condiciones para cambios o devoluciones?",
      a: "Para la Tarifa Regular puedes solicitar cambios de fecha o itinerario hasta con 6 horas de anticipación a la salida del bus, y devoluciones hasta con 12 horas de anticipación a través de nuestra web o en agencias físicas. Otras tarifas promocionales tienen condiciones específicas indicadas al momento de la compra.",
    },
    {
      q: "¿Qué documentos son obligatorios para abordar el bus?",
      a: "Para peruanos mayores de edad es obligatorio presentar el DNI físico original y vigente. Para extranjeros: Pasaporte o Carné de Extranjería. Para menores de edad que viajen solos o con solo uno de sus padres, se requiere autorización notarial de viaje según ley peruana vigente.",
    },
    {
      q: "¿Puedo viajar con mascotas en Cruz del Sur?",
      a: "Sí, previa coordinación y conforme al reglamento de transporte. Las mascotas pequeñas deben viajar en un canil rígido adecuado y contar con su certificado de vacunación al día. Consulta con nuestra central Fonobus (01) 311-5050 para rutas y unidades autorizadas.",
    },
    {
      q: "¿Cómo funciona el programa de Pasajero Frecuente (Club Cruz del Sur)?",
      a: "Al afiliarte gratuitamente al Club Cruz del Sur acumulas kilómetros por cada sol consumido en pasajes y servicios de carga. Puedes canjear tus kilómetros por pasajes gratis, acceder a salas VIP en los terminales de Lima y Arequipa, y disfrutar de promociones exclusivas.",
    },
  ]

  const handleCityCardClick = (cityName: string) => {
    const today = new Date().toISOString().split("T")[0]
    onStartSearch({
      tripType: "ida",
      origin: "Lima",
      destination: cityName,
      departDate: today,
      passengerCount: 1,
    })
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">

      {/* ========================================================================= */}
      {/* BARRA DEL BUSCADOR — separada del carrusel, fondo navy                   */}
      {/* ========================================================================= */}
      <div className="bg-[#001733] px-3 sm:px-6 py-4 sm:py-5 shadow-md">
        <div className="max-w-5xl mx-auto">
          <SearchWidget onSearch={onStartSearch} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARRUSEL DE BANNERS OFICIALES CRUZ DEL SUR                               */}
      {/* ========================================================================= */}
      <section
        className="relative bg-[#001733] overflow-hidden"
        style={{ height: "clamp(220px, 42vw, 500px)" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides de imágenes */}
        {HERO_BANNERS.map((banner, index) => {
          const isActive = currentSlide === index
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )
        })}

        {/* Flecha izquierda */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-lg hover:scale-105"
          aria-label="Banner anterior"
        >
          <Icon name="chevronLeft" size={20} />
        </button>

        {/* Flecha derecha */}
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-lg hover:scale-105"
          aria-label="Siguiente banner"
        >
          <Icon name="chevronRight" size={20} />
        </button>

        {/* Dots de navegación */}
        <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {HERO_BANNERS.map((banner, index) => {
            const isSelected = currentSlide === index
            return (
              <button
                key={banner.id}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer shadow-sm ${
                  isSelected
                    ? "w-8 h-2.5 bg-[#FFD100]"
                    : "w-2.5 h-2.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Ir al anuncio ${index + 1}: ${banner.title}`}
                title={banner.title}
              />
            )
          })}
        </div>
      </section>

      {/* Tira de Métodos de Pago y Seguridad */}
      <section className="max-w-6xl mx-auto px-4 mt-0 relative z-10 mb-10">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#002855] shrink-0">
              <Icon name="shield" size={26} className="text-[#002855]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#002855]">
                Diferentes opciones de pago seguras
              </h3>
              <p className="text-xs text-gray-500">
                Aceptamos todas las tarjetas, billeteras digitales peruanas y pago en agencias.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-black text-[#002855] bg-gray-50">
              VISA
            </span>
            <span className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-black text-[#e51937] bg-gray-50">
              Mastercard
            </span>
            <span className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-blue-600 bg-gray-50">
              AMEX
            </span>
            <span className="px-3 py-1.5 rounded-lg border border-purple-200 text-xs font-black text-purple-700 bg-purple-50 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00ffc4]"></span> Yape
            </span>
            <span className="px-3 py-1.5 rounded-lg border border-teal-200 text-xs font-black text-teal-700 bg-teal-50">
              Plin
            </span>
            <span className="px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-bold text-amber-800 bg-amber-50">
              PagoEfectivo
            </span>
          </div>
        </div>
      </section>

      {/* Sección: Destinos Populares con Tarifas Destacadas */}
      <section className="max-w-7xl mx-auto px-4 py-8 mb-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-[#002855] uppercase tracking-widest block mb-2">
            VIAJA CON NOSOTROS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#002855]">
            ¡Te llevamos a los mejores destinos del Perú!
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Tarifas promocionales con salida desde Lima y terminales principales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CITIES.filter((c) => c.popular).slice(0, 8).map((city) => (
            <div
              key={city.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/90 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-[#FFD100] text-[#002855] font-black text-xs px-2.5 py-1 rounded-full shadow">
                  Desde S/ {city.startingPrice}
                </span>
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                  {city.durationHours > 0 ? `~${city.durationHours} hrs de viaje` : "Salidas diarias"}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-[#002855]">
                    {city.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                    {city.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-600 font-semibold">
                    Saliendo de <strong>Lima</strong>
                  </span>
                  <button
                    onClick={() => handleCityCardClick(city.name)}
                    className="bg-[#002855] hover:bg-[#073366] text-[#FFD100] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    COMPRAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("destinations")}
            className="inline-flex items-center gap-2 bg-[#002855] hover:bg-[#073366] text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition-all text-xs tracking-wider uppercase cursor-pointer"
          >
            <span>Ver todos los destinos nacionales</span>
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </section>

      {/* Sección: Nuestra Flota y Servicios de Primera Clase */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-[#002855] uppercase tracking-widest block mb-2">
              EXPERIENCIAS CRUZ DEL SUR
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#002855]">
              Conoce nuestra moderna flota de buses
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Equipados con tecnología de última generación, asientos anatómicos y protocolos de bioseguridad.
            </p>
          </div>

          {/* Selector de Servicio */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {FLEET_SERVICES.map((serv, index) => (
              <button
                key={serv.name}
                onClick={() => setSelectedFleetTab(index)}
                className={`px-4 sm:px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer border ${
                  selectedFleetTab === index
                    ? "bg-[#002855] text-white border-[#002855] shadow-lg"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span>{serv.name}</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] text-[#FFD100]">
                  ({serv.badge})
                </span>
              </button>
            ))}
          </div>

          {/* Ficha del Servicio Seleccionado */}
          {(() => {
            const currentService = FLEET_SERVICES[selectedFleetTab]
            return (
              <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-block bg-[#002855] text-[#FFD100] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentService.badge}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#002855]">
                    {currentService.name}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {currentService.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {currentService.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs text-gray-800">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Icon name="check" size={12} />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4 items-center">
                    <button
                      onClick={() => navigate("results")}
                      className="bg-[#FFD100] hover:bg-[#e6be00] text-[#002855] font-black text-xs uppercase px-6 py-3 rounded-xl shadow cursor-pointer"
                    >
                      Buscar viajes en este servicio
                    </button>
                    <button
                      onClick={() => navigate("services")}
                      className="text-xs font-bold text-[#002855] hover:underline"
                    >
                      Ver comparativa de flota completa →
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-white relative aspect-4/3">
                    <img
                      src={currentService.image}
                      alt={currentService.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[11px] font-bold text-[#FFD100] uppercase block">
                        Reclinación garantizada
                      </span>
                      <strong className="text-lg font-black">{currentService.recline}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* Sección: ¿Por Qué Escogernos? (Garantías de Seguridad) */}
      <section className="bg-gradient-to-br from-[#001733] to-[#002855] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-[#FFD100] uppercase tracking-widest block mb-2">
              COMPROMISO CON EL PERÚ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              ¿Por qué elegir Cruz del Sur para tu viaje?
            </h2>
            <p className="text-sm text-gray-300 mt-2">
              Estándares certificados internacionalmente para brindarte máxima tranquilidad en cada kilómetro.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
            {[
              {
                icon: "shield",
                title: "Seguridad 24/7",
                desc: "Monitoreo GPS en tiempo real de velocidad y ruta.",
              },
              {
                icon: "user",
                title: "Pilotos Calificados",
                desc: "Relevo obligatorio cada 4 horas y alcotest previo.",
              },
              {
                icon: "check",
                title: "63 Años",
                desc: "De liderazgo y experiencia en el transporte nacional.",
              },
              {
                icon: "bus",
                title: "+25 Destinos",
                desc: "La red de cobertura interprovincial más completa.",
              },
              {
                icon: "tv",
                title: "Entretenimiento",
                desc: "Pantallas individuales táctiles con películas y música.",
              },
              {
                icon: "wifi",
                title: "Conexión a Bordo",
                desc: "Wifi satelital y tomas de carga USB en tu asiento.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/40 flex items-center justify-center text-[#FFD100] mb-3">
                  <Icon name={item.icon} size={28} />
                </div>
                <strong className="text-sm font-bold text-white mb-1">
                  {item.title}
                </strong>
                <p className="text-[11px] text-gray-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección: Club Cruz del Sur y App Móvil */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Banner Club Cruz del Sur */}
          <div className="bg-gradient-to-r from-[#002855] to-[#073366] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="text-xs font-black text-[#FFD100] uppercase tracking-wider block">
                PROGRAMA DE BENEFICIOS EXCLUSIVOS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Club Cruz del Sur
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                Cada viaje que realizas acumula kilómetros que puedes canjear por pasajes gratis, ascensos de clase y acceso a nuestras Salas VIP en terminales.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate("club")}
                  className="bg-[#FFD100] hover:bg-[#e6be00] text-[#002855] font-black text-xs uppercase px-5 py-2.5 rounded-xl shadow cursor-pointer transition-all"
                >
                  Afíliate gratis o inicia sesión
                </button>
              </div>
            </div>
          </div>

          {/* Banner App Móvil */}
          <div className="bg-white border border-gray-200 p-8 sm:p-10 rounded-3xl shadow-xl space-y-4">
            <span className="text-xs font-extrabold text-[#002855] uppercase tracking-wider block">
              DESCARGA NUESTRA APLICACIÓN OFICIAL
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#002855]">
              Compra más rápido en tu celular
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Lleva tus boletos en el móvil sin necesidad de imprimir, elige tus asientos favoritos y recibe alertas sobre el estado de tu bus en tiempo real.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm hover:opacity-90">
                <span className="text-[10px] block leading-tight">
                  Disponible en<br />
                  <strong className="text-xs font-bold">Google Play</strong>
                </span>
              </div>
              <div className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm hover:opacity-90">
                <span className="text-[10px] block leading-tight">
                  Consíguelo en el<br />
                  <strong className="text-xs font-bold">App Store</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: Preguntas Frecuentes (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold text-[#002855] uppercase tracking-widest block mb-2">
            RESOLVEMOS TUS DUDAS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#002855]">
            Preguntas Frecuentes
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Todo lo que necesitas saber antes de tu viaje con nosotros.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={faq.q}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#002855] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <Icon
                    name={isOpen ? "chevronUp" : "chevronDown"}
                    size={18}
                    className="text-gray-400 shrink-0"
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/51993555276"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white"
        aria-label="Contactar por WhatsApp Oficial"
      >
        <Icon name="whatsapp" size={32} />
      </a>
    </div>
  )
}
