import { Icon } from "../components/Icons"
import { FLEET_SERVICES } from "../data/mockData"
import { Page } from "../types"

interface ServicesPageProps {
  navigate: (p: Page) => void
}

export function ServicesPage({ navigate }: ServicesPageProps) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24">
      {/* Hero */}
      <div className="bg-[#001733] text-white py-14 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1800&q=80')`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#FFD100] uppercase tracking-widest block">
            FLOTA Y COMODIDAD
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Nuestros Servicios a Bordo
          </h1>
          <p className="text-xs sm:text-base text-gray-200">
            Conoce en detalle cada categoría de viaje de Cruz del Sur y elige la experiencia ideal para tu próximo trayecto.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 space-y-8">
        {FLEET_SERVICES.map((serv, idx) => (
          <div
            key={serv.name}
            className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10"
          >
            <div className={`lg:col-span-7 space-y-4 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="inline-block bg-[#002855] text-[#FFD100] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {serv.badge}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#002855]">
                {serv.name}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {serv.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">
                    Grado de Reclinación
                  </span>
                  <strong className="text-xs text-[#002855] font-black">{serv.recline}</strong>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">
                    Configuración de Niveles
                  </span>
                  <strong className="text-xs text-[#002855] font-black">{serv.floors}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                  Equipamiento y Amenidades:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  {serv.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Icon name="check" size={10} />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate("results")}
                  className="bg-[#FFD100] hover:bg-[#e6be00] text-[#002855] font-black text-xs uppercase px-6 py-3 rounded-xl shadow cursor-pointer transition-all inline-flex items-center gap-2"
                >
                  <span>Buscar salidas en {serv.name}</span>
                  <Icon name="arrowRight" size={14} />
                </button>
              </div>
            </div>

            <div className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
              <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-white relative aspect-4/3">
                <img
                  src={serv.image}
                  alt={serv.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold text-[#FFD100] uppercase block">
                    Confort Certificado
                  </span>
                  <strong className="text-base font-black">{serv.recline}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

