import { useState } from "react"
import { Page, UserAccount } from "../types"
import { CruzDelSurLogo, Icon } from "./Icons"

interface HeaderProps {
  currentPage: Page
  navigate: (p: Page) => void
  compact?: boolean
  currency?: "PEN" | "USD"
  onCurrencyToggle?: () => void
  currentUser?: UserAccount | null
  onLogout?: () => void
}

export function Header({
  currentPage,
  navigate,
  compact = false,
  currency = "PEN",
  onCurrencyToggle,
  currentUser,
  onLogout,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: { page: Page; label: string; icon?: string }[] = [
    { page: "home", label: "Inicio" },
    { page: "destinations", label: "Destinos" },
    { page: "services", label: "Servicios" },
    { page: "changes", label: "Cambios y Devoluciones" },
    { page: "agencies", label: "Agencias" },
    { page: "contact", label: "Contacto" },
  ]

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Barra superior de utilidad institucional */}
      {!compact && (
        <div className="bg-[#001c3d] text-gray-200 text-xs py-1.5 px-4 border-b border-[#0a2e5c] hidden sm:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a
                href="tel:013115050"
                className="flex items-center gap-1.5 hover:text-[#FFD100] transition-colors"
              >
                <Icon name="phone" size={13} className="text-[#FFD100]" />
                <span>Central Telefónica / Fonobus: <strong>(01) 311-5050</strong></span>
              </a>
              <a
                href="https://wa.me/51993555276"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-green-400 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <Icon name="whatsapp" size={13} className="text-green-400" />
                <span>WhatsApp Oficial: <strong>993 555 276</strong></span>
              </a>
            </div>

            <div className="flex items-center gap-5 text-[11px]">
              <button
                onClick={() => navigate("agencies")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Terminales y Agencias
              </button>
              <button
                onClick={() => navigate("changes")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer"
              >
                Comprobante Electrónico
              </button>
              <button
                onClick={() => navigate("club")}
                className="hover:text-[#FFD100] transition-colors cursor-pointer text-[#FFD100] font-semibold flex items-center gap-1"
              >
                <Icon name="star" size={11} className="text-[#FFD100]" />
                Club Cruz del Sur
              </button>
              {onCurrencyToggle && (
                <button
                  onClick={onCurrencyToggle}
                  className="bg-[#0a2e5c] px-2 py-0.5 rounded border border-[#1b4379] hover:bg-[#143d73] transition-colors font-bold text-white cursor-pointer"
                >
                  🇵🇪 {currency === "PEN" ? "S/ PEN" : "$ USD"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Barra principal de navegación */}
      <div className="bg-[#002855] text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo Oficial Cruz del Sur */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-3 text-left cursor-pointer focus:outline-none"
            aria-label="Cruz del Sur Inicio"
          >
            <CruzDelSurLogo size={compact ? 36 : 44} />
          </button>

          {/* Enlaces de escritorio */}
          {!compact ? (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {navItems.map((item) => {
                const isActive = currentPage === item.page
                return (
                  <button
                    key={item.page}
                    onClick={() => navigate(item.page)}
                    className={`relative py-2 transition-colors cursor-pointer ${isActive
                        ? "text-[#FFD100] font-bold"
                        : "text-gray-100 hover:text-[#FFD100]"
                      }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD100] rounded-full"></span>
                    )}
                  </button>
                )
              })}

              {/* Botón Pasajero Frecuente / Usuario Logueado */}
              {currentUser ? (
                <div className="flex items-center gap-2 ml-2">
                  <div className="bg-[#001c3d] text-[#FFD100] font-bold px-3 py-1.5 rounded-full border border-[#FFD100]/40 flex items-center gap-2 text-xs">
                    <Icon name="user" size={14} className="text-[#FFD100]" />
                    <span className="truncate max-w-[130px]">Hola, {currentUser.firstName.split(" ")[0]}</span>
                  </div>
                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      title="Cerrar sesión"
                      className="text-gray-300 hover:text-white text-xs underline cursor-pointer"
                    >
                      Salir
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("club")}
                  className="bg-[#001c3d] hover:bg-[#073366] text-[#FFD100] font-bold px-4 py-2 rounded-full border border-[#FFD100]/40 flex items-center gap-2 text-xs transition-all shadow-sm cursor-pointer ml-2 hover:scale-[1.02]"
                >
                  <Icon name="user" size={14} className="text-[#FFD100]" />
                  <span>Pasajero Frecuente</span>
                </button>
              )}
            </nav>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("home")}
                className="text-xs bg-[#001c3d] hover:bg-[#073366] text-white px-3 py-1.5 rounded-lg border border-[#0d417d] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="chevronLeft" size={14} />
                <span>Salir de la compra</span>
              </button>
            </div>
          )}

          {/* Botón Menú móvil */}
          {!compact && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-[#001c3d] focus:outline-none cursor-pointer"
              aria-label="Abrir menú"
            >
              <Icon name={mobileMenuOpen ? "close" : "menu"} size={26} />
            </button>
          )}
        </div>

        {/* Menú móvil desplegable */}
        {!compact && mobileMenuOpen && (
          <div className="lg:hidden bg-[#001c3d] border-t border-[#0a2e5c] px-4 pt-3 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  navigate(item.page)
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${currentPage === item.page
                    ? "bg-[#002855] text-[#FFD100] font-bold"
                    : "text-gray-100 hover:bg-[#002855]"
                  }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-[#0a2e5c] flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("club")
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-[#FFD100] text-[#002855] font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow cursor-pointer"
              >
                <Icon name="user" size={16} />
                <span>Club Cruz del Sur / Login</span>
              </button>
              <div className="flex items-center justify-between text-xs text-gray-300 px-2 pt-2">
                <span>Fonobus: (01) 311-5050</span>
                <span>WhatsApp: 993 555 276</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

