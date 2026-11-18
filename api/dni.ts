// Endpoint Serverless nativo para Vercel (Node.js)
// Actúa como proxy backend seguro hacia VerificaPE para eliminar bloqueos de CORS en producción

export default async function handler(req: any, res: any) {
  // Configuración de cabeceras CORS permisivas para permitir peticiones desde Vercel y clientes web
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  )

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  // Extraer el DNI del query string (?dni=70123456)
  const dniParam = req.query?.dni || (req.url ? new URL(req.url, "http://localhost").searchParams.get("dni") : null)
  const cleanDni = String(dniParam || "").replace(/\D/g, "").trim()

  if (cleanDni.length !== 8) {
    return res.status(400).json({
      success: false,
      error: "El DNI debe contener exactamente 8 dígitos numéricos.",
    })
  }

  const API_KEY =
    process.env.VITE_API_KEY_DNI_RUC ||
    process.env.API_KEY_DNI_RUC ||
    "vp_live_5935636b18f84340b20553a9cb573a23"

  try {
    const upstreamRes = await fetch(`https://api.verificape.com/v2/dni/${cleanDni}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    })

    const data = await upstreamRes.json()
    return res.status(upstreamRes.status).json(data)
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: "Error interno al consultar el servicio de RENIEC: " + (error?.message || String(error)),
    })
  }
}
