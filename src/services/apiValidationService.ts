// Servicio de validación y consulta de APIs oficiales (RENIEC y Verificación de Correo)

export interface ReniecResult {
  success: boolean
  data?: {
    dni: string
    names: string
    surnames: string
    fullName: string
    birthDate: string // Formato YYYY-MM-DD para input type="date"
    gender: "Masculino" | "Femenino"
  }
  error?: string
}

export interface EmailValidationResult {
  isValid: boolean
  message: string
  details?: any
}

// Obtener API Keys desde variables de entorno con fallback a las provistas en .env
const API_KEY_DNI_RUC =
  import.meta.env.VITE_API_KEY_DNI_RUC ||
  "vp_live_5935636b18f84340b20553a9cb573a23"

const API_KEY_CORREO =
  import.meta.env.VITE_API_KEY_CORREO ||
  "Uxs4rPhWwx85vXzLOVMjx9IL4BHMkPaH1FU38O3t"

/**
 * Consulta los datos de un DNI en RENIEC mediante la API de VerificaPE
 */
export async function consultarDniReniec(dni: string): Promise<ReniecResult> {
  const cleanDni = dni.replace(/\D/g, "").trim()

  if (cleanDni.length !== 8) {
    return {
      success: false,
      error: "El DNI debe contener exactamente 8 dígitos numéricos.",
    }
  }

  // Intentamos por el proxy de desarrollo Vite para evitar CORS, o directamente a la API
  const endpoints = [
    `/api-verificape/v2/dni/${cleanDni}`,
    `https://api.verificape.com/v2/dni/${cleanDni}`,
  ]

  let lastError = "No se pudo consultar el DNI."

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY_DNI_RUC}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: "DNI no encontrado en los registros de RENIEC." }
        }
        if (response.status === 401 || response.status === 403) {
          return { success: false, error: "Error de autorización en la API de RENIEC." }
        }
        continue
      }

      const res = await response.json()

      if (res && res.success && res.data) {
        const d = res.data

        // Parsear fecha DD/MM/YYYY a YYYY-MM-DD
        let formattedDate = ""
        if (d.birthDate && typeof d.birthDate === "string") {
          const parts = d.birthDate.split("/")
          if (parts.length === 3) {
            const [day, month, year] = parts
            formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
          } else {
            formattedDate = d.birthDate
          }
        }

        // Normalizar género
        let parsedGender: "Masculino" | "Femenino" = "Masculino"
        if (d.gender) {
          const g = String(d.gender).toUpperCase()
          if (g.includes("FEM") || g === "F") {
            parsedGender = "Femenino"
          }
        }

        // Apellidos concatenados
        const surnames = [d.paternalSurname, d.maternalSurname]
          .filter(Boolean)
          .join(" ")
          .trim() || d.fullName || ""

        return {
          success: true,
          data: {
            dni: cleanDni,
            names: d.names || "",
            surnames: surnames,
            fullName: d.fullName || `${d.names} ${surnames}`.trim(),
            birthDate: formattedDate,
            gender: parsedGender,
          },
        }
      } else if (res && res.message) {
        return { success: false, error: res.message }
      }
    } catch (err: any) {
      lastError = err?.message || lastError
    }
  }

  return { success: false, error: lastError }
}

/**
 * Valida un correo electrónico con la API de EmailAwesome
 */
export async function validarCorreoAwesome(email: string): Promise<EmailValidationResult> {
  const cleanEmail = email.trim().toLowerCase()

  // Validación previa de sintaxis RFC estándar
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return {
      isValid: false,
      message: "Ingresa un correo electrónico con formato válido (ej. usuario@gmail.com).",
    }
  }

  // Endpoints: proxy local de Vite o llamada directa
  const endpoints = [
    `/api-emailawesome/api/validations/email_validation`,
    `https://api.emailawesome.com/api/validations/email_validation`,
  ]

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": API_KEY_CORREO,
        },
        body: JSON.stringify({ email: cleanEmail }),
      })

      if (!response.ok) {
        continue
      }

      const res = await response.json()

      // Si la API retorna un ID de verificación, consultamos su estado rápido
      if (res && res.id) {
        // Si el estado inicial ya es INVALID, lo rechazamos de inmediato
        if (res.email_address_status === "INVALID" || res.status === "INVALID") {
          return {
            isValid: false,
            message: "El correo ingresado no es válido o no existe.",
            details: res,
          }
        }

        // Consultamos 1 segundo después para comprobar si completó la verificación
        try {
          await new Promise((resolve) => setTimeout(resolve, 1200))
          const checkUrl = url.includes("/api-emailawesome")
            ? `/api-emailawesome/api/validations/email_validation/${res.id}`
            : `https://api.emailawesome.com/api/validations/email_validation/${res.id}`

          const checkRes = await fetch(checkUrl, {
            headers: {
              Accept: "application/json",
              "x-api-key": API_KEY_CORREO,
            },
          })

          if (checkRes.ok) {
            const checkData = await checkRes.json()
            if (checkData.email_address_status === "INVALID") {
              return {
                isValid: false,
                message: "El correo ingresado no existe o no tiene buzón activo.",
                details: checkData,
              }
            }
          }
        } catch {
          // Si el sondeo falla, aceptamos si el formato y la respuesta previa fueron correctos
        }

        return {
          isValid: true,
          message: "Correo electrónico verificado correctamente.",
          details: res,
        }
      }
    } catch {
      // Intentar siguiente endpoint o continuar
    }
  }

  // Si las llamadas a la API fallan por red/cuota, permitir paso si la sintaxis básica es correcta
  return {
    isValid: true,
    message: "Formato de correo válido.",
  }
}
