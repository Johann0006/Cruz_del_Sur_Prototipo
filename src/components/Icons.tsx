import { ReactNode } from "react"

interface IconProps {
  name: string
  size?: number
  className?: string
}

export function CruzDelSurLogo({
  variant = "full",
  className = "",
  size = 40,
}: {
  variant?: "full" | "icon" | "white" | "dark"
  className?: string
  size?: number
}) {
  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      style={{ height: size }}
    >
      {/* Icono de la constelación Cruz del Sur */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm"
      >
        <circle cx="50" cy="50" r="48" fill="#002855" stroke="#FFD100" strokeWidth="2.5" />
        {/* Cruz del Sur - 4 estrellas principales en forma de cruz */}
        {/* Estrella Superior (Gacrux) */}
        <polygon
          points="50,14 53,24 63,27 53,30 50,40 47,30 37,27 47,24"
          fill="#FFD100"
        />
        <circle cx="50" cy="27" r="2.5" fill="#FFFFFF" />

        {/* Estrella Inferior (Acrux) - la más brillante */}
        <polygon
          points="50,56 54,69 67,73 54,77 50,90 46,77 33,73 46,69"
          fill="#FFD100"
        />
        <circle cx="50" cy="73" r="3.5" fill="#FFFFFF" />

        {/* Estrella Izquierda (Mimosa) */}
        <polygon
          points="24,37 27,45 35,48 27,51 24,59 21,51 13,48 21,45"
          fill="#FFD100"
        />
        <circle cx="24" cy="48" r="2.5" fill="#FFFFFF" />

        {/* Estrella Derecha (Delta Crucis) */}
        <polygon
          points="76,37 79,45 87,48 79,51 76,59 73,51 65,48 73,45"
          fill="#FFD100"
        />
        <circle cx="76" cy="48" r="2.5" fill="#FFFFFF" />

        {/* 5ta Estrella Menor (Epsilon Crucis) - característica real de la Cruz del Sur */}
        <polygon
          points="62,55 64,59 68,61 64,63 62,67 60,63 56,61 60,59"
          fill="#FFFFFF"
        />

        {/* Sutiles líneas de conexión celeste que forman la cruz */}
        <line x1="50" y1="27" x2="50" y2="73" stroke="rgba(255,209,0,0.3)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="24" y1="48" x2="76" y2="48" stroke="rgba(255,209,0,0.3)" strokeWidth="1" strokeDasharray="2 2" />
      </svg>

      {variant !== "icon" && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-black tracking-wider text-lg md:text-xl font-sans ${
              variant === "dark" ? "text-[#002855]" : "text-white"
            }`}
          >
            CRUZ DEL SUR
          </span>
          <span
            className="text-[9px] md:text-[10px] tracking-widest font-semibold text-[#FFD100] uppercase mt-0.5"
          >
            TRANSPORTE Y TURISMO
          </span>
        </div>
      )}
    </div>
  )
}

export function LibroReclamacionesLogo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3b5998]/40 bg-[#0d2244] hover:bg-[#132c56] transition-colors cursor-pointer ${className}`}
    >
      <div className="w-7 h-8 bg-[#0055b8] border-2 border-white rounded-sm shadow-sm flex flex-col justify-between p-0.5 relative overflow-hidden">
        <div className="w-full h-1 bg-yellow-400"></div>
        <div className="text-[6px] font-black text-white text-center leading-tight">
          LIBRO
        </div>
        <div className="w-full flex justify-center gap-0.5">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="text-left text-white leading-tight">
        <span className="block text-[9px] text-gray-300">Libro de</span>
        <strong className="block text-[11px] font-bold text-yellow-400">
          Reclamaciones
        </strong>
      </div>
    </div>
  )
}

export function Icon({ name, size = 20, className = "" }: IconProps) {
  const icons: Record<string, ReactNode> = {
    bus: (
      <>
        <rect x="4" y="3" width="16" height="16" rx="3" />
        <path d="M7 19v2M17 19v2M4 13h16M8 7h8" />
        <circle cx="8" cy="16" r="1" />
        <circle cx="16" cy="16" r="1" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    swap: (
      <>
        <path d="M7 16V4M7 4L3 8M7 4L11 8" />
        <path d="M17 8V20M17 20L21 16M17 20L13 16" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
    seat: (
      <>
        <path d="M7 4v9a3 3 0 0 0 3 3h7M5 12H3v7h16v-5M18 7a2 2 0 0 0-2 2v5" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    chevronUp: <polyline points="18 15 12 9 6 15" />,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    arrowRight: (
      <>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
    mail: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    card: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
    printer: (
      <>
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </>
    ),
    wifi: (
      <>
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </>
    ),
    tv: (
      <>
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </>
    ),
    coffee: (
      <>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </>
    ),
    luggage: (
      <>
        <rect x="6" y="7" width="12" height="14" rx="2" />
        <path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    ),
    alert: (
      <>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    star: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
    whatsapp: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    ),
    menu: (
      <>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
    filter: (
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    ),
    tag: (
      <>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </>
    ),
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {icons[name] || icons.info}
    </svg>
  )
}

