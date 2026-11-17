import { UserAccount } from "../types"
import defaultUsers from "../data/users.json"

const USERS_STORAGE_KEY = "CDS_REGISTERED_USERS_DB"
const CURRENT_USER_KEY = "CDS_CURRENT_USER_SESSION"

export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers))
      return defaultUsers as UserAccount[]
    }
    return JSON.parse(raw) as UserAccount[]
  } catch {
    return defaultUsers as UserAccount[]
  }
}

export function saveNewUser(userData: Omit<UserAccount, "id" | "createdAt">): {
  success: boolean
  user?: UserAccount
  error?: string
} {
  const users = getStoredUsers()

  // Validar si el correo ya existe
  const emailExists = users.some(
    (u) => u.email.trim().toLowerCase() === userData.email.trim().toLowerCase(),
  )
  if (emailExists) {
    return {
      success: false,
      error: "Ya existe una cuenta registrada con este correo electrónico.",
    }
  }

  // Validar si el DNI ya existe
  const dniExists = users.some((u) => u.dni.trim() === userData.dni.trim())
  if (dniExists) {
    return {
      success: false,
      error: "Ya existe una cuenta registrada con este número de DNI.",
    }
  }

  const newUser: UserAccount = {
    ...userData,
    id: `usr-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const updated = [...users, newUser]
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated))
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
  } catch (err) {
    console.error("Error guardando usuario en localStorage:", err)
  }

  return { success: true, user: newUser }
}

export function loginUser(
  email: string,
  password: string,
): { success: boolean; user?: UserAccount; error?: string } {
  const users = getStoredUsers()
  const found = users.find(
    (u) =>
      u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      u.password === password,
  )

  if (!found) {
    return {
      success: false,
      error: "Correo electrónico o contraseña incorrectos. Por favor verifica tus datos.",
    }
  }

  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found))
  } catch (err) {
    console.error("Error guardando sesión:", err)
  }

  return { success: true, user: found }
}

export function getCurrentUserSession(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserAccount
  } catch {
    return null
  }
}

export function logoutUserSession(): void {
  try {
    localStorage.removeItem(CURRENT_USER_KEY)
  } catch (err) {
    console.error("Error cerrando sesión:", err)
  }
}
