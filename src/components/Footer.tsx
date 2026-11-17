import { Page } from "../types"
import { CruzDelSurLogo, Icon, LibroReclamacionesLogo } from "./Icons"

export function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer className="bg-[#001733] text-gray-300 text-sm border-t-4 border-[#FFD100]">
      {/* Tira de Métodos de Pago y Certificación de Seguridad */}
      <div className="bg-[#001229] py-6 px-4 border-b border-[#0a264a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <Icon name="shield" size={20} className="text-emerald-400 shrink-0" />
            <span>
              <strong>Compra 100% Segura</strong> · Certificado SSL de 256 bits y monitoreo permanente de transacciones.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-gray-400 font-medium mr-1">Medios de pago autorizados:</span>
            <span className="bg-white text-[#002855] font-black px-2.5 py-1 rounded text-xs shadow-sm">VISA</span>
            <span className="bg-white text-[#eb001b] font-black px-2.5 py-1 rounded text-xs shadow-sm">Mastercard</span>
            <span className="bg-[#0070d2] text-white font-bold px-2.5 py-1 rounded text-xs shadow-sm">AMEX</span>
            <span className="bg-[#002f6c] text-white font-bold px-2.5 py-1 rounded text-xs shadow-sm">Diners</span>
            <span className="bg-[#6b21a8] text-white font-bold px-2.5 py-1 rounded text-xs shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00ffc4]"></span> Yape
            </span>
            <span className="bg-[#00d2c4] text-[#002855] font-black px-2.5 py-1 rounded text-xs shadow-sm">Plin</span>
            <span className="bg-[#ffb700] text-[#001f3f] font-bold px-2.5 py-1 rounded text-xs shadow-sm">PagoEfectivo</span>
          </div>
        </div>
      </div>

      {/* Grid Principal de Enlaces y Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Columna 1: Identidad Corporativa */}
        <div className="lg:col-span-2 space-y-4">
          <CruzDelSurLogo size={44} />
          <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
            Empresa peruana líder en transporte terrestre interprovincial de pasajeros y carga con más de 63 años conectando los principales destinos del Perú con los más altos estándares de seguridad y confort.
          </p>

          <div className="space-y-2 text-xs text-gray-300 pt-2">
            <div className="flex items-center gap-2">
              <Icon name="phone" size={15} className="text-[#FFD100]" />
              <span>Central Telefónica (Fonobus): <strong>(01) 311-5050</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="whatsapp" size={15} className="text-emerald-400" />
              <span>WhatsApp de Atención: <strong>+51 993 555 276</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="pin" size={15} className="text-[#FFD100] mt-0.5" />
              <span>Terminal Principal: Av. Javier Prado Este 1109, La Victoria - Lima, Perú</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[11px] text-gray-400">RUC: 20100188974 · Transportes Cruz del Sur S.A.C.</p>
          </div>
        </div>

        {/* Columna 2: Rutas Populares */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-[#FFD100] pl-2 uppercase tracking-wide">
            Rutas Principales
          </h4>
          <ul className="space-y-2 text-xs">
            {[
              "Lima – Arequipa",
              "Lima – Cusco",
              "Lima – Ica",
              "Lima – Huancayo",
              "Lima – Piura",
              "Lima – Trujillo",
              "Lima – Paracas",
              "Lima – Oxapampa",
            ].map((route) => (
              <li key={route}>
                <button
                  onClick={() => navigate("results")}
                  className="hover:text-[#FFD100] transition-colors cursor-pointer text-left"
                >
                  {route}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3: Servicios e Información */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-[#FFD100] pl-2 uppercase tracking-wide">
            Nuestros Servicios
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => navigate("services")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Cruzero Suite (180° Cama)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("services")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Cruzero Evolution (160°/140°)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("services")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Confort Suite
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("services")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Ica Line Express
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("club")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer text-[#FFD100] font-semibold"
              >
                Club Pasajero Frecuente
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("agencies")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Red de Agencias Nacionales
              </button>
            </li>
          </ul>
        </div>

        {/* Columna 4: Atención y Libro de Reclamaciones */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-[#FFD100] pl-2 uppercase tracking-wide">
            Atención al Usuario
          </h4>
          <ul className="space-y-2 text-xs mb-5">
            <li>
              <button
                onClick={() => navigate("changes")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Cambios y Devoluciones
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("contact")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Preguntas Frecuentes
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("changes")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Consultar Boleto / Factura
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("contact")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Contacto y Reclamos
              </button>
            </li>
          </ul>

          {/* Libro de Reclamaciones Indecopi */}
          <div className="pt-2">
            <LibroReclamacionesLogo />
            <p className="text-[10px] text-gray-400 mt-2">
              Conforme a lo establecido en el Código de Protección y Defensa del Consumidor (Ley N° 29571).
            </p>
          </div>
        </div>
      </div>

      {/* Copyright y Políticas Legales */}
      <div className="bg-[#000e21] py-4 px-4 text-xs text-gray-400 border-t border-[#0a2342]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 Transportes Cruz del Sur S.A.C. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-4 text-[11px]">
            <a href="#terminos" className="hover:text-white transition-colors">Términos y Condiciones</a>
            <span>•</span>
            <a href="#privacidad" className="hover:text-white transition-colors">Política de Privacidad</a>
            <span>•</span>
            <a href="#seguridad" className="hover:text-white transition-colors">Protocolos de Seguridad</a>
            <span>•</span>
            <a href="#cookies" className="hover:text-white transition-colors">Política de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

