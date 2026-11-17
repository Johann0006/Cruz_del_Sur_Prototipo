import React from "react"
import { Icon } from "./Icons"

interface ReservationTimerCardProps {
  secondsLeft: number
  className?: string
  compact?: boolean
}

export function ReservationTimerCard({
  secondsLeft,
  className = "",
  compact = false,
}: ReservationTimerCardProps) {
  const mins = Math.max(0, Math.floor(secondsLeft / 60))
  const secs = Math.max(0, secondsLeft % 60)
  const timeFormatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  const isUrgent = secondsLeft > 0 && secondsLeft <= 120

  return (
    <div
      className={`bg-[#FFF8E7] border ${
        isUrgent ? "border-amber-400 ring-2 ring-amber-400/30" : "border-[#FDE68A]"
      } ${
        compact ? "px-2.5 py-1 rounded-xl gap-2" : "px-3.5 py-1.5 sm:py-2 rounded-2xl gap-2.5 sm:gap-3"
      } flex items-center shadow-xs shrink-0 select-none transition-all ${className}`}
      title="Tiempo restante para completar tu compra"
    >
      {/* Icono de Reloj con Aro Naranja oficial */}
      <div
        className={`${
          compact ? "w-6 h-6 text-sm" : "w-7 h-7 sm:w-8 sm:h-8"
        } rounded-full border-2 border-[#D97706] flex items-center justify-center text-[#D97706] shrink-0 ${
          isUrgent ? "animate-pulse" : ""
        }`}
      >
        <Icon name="clock" size={compact ? 13 : 16} />
      </div>

      {/* Etiquetas de Tiempo de Reserva */}
      <div className="leading-tight">
        <span
          className={`block ${
            compact ? "text-[8px]" : "text-[9px] sm:text-[10px]"
          } font-black tracking-wider text-[#92400E] uppercase`}
        >
          TIEMPO DE RESERVA
        </span>
        <strong
          className={`${
            compact ? "text-sm" : "text-base sm:text-lg"
          } font-black font-mono text-[#451A03] tracking-tight`}
        >
          {timeFormatted}
        </strong>
      </div>
    </div>
  )
}
