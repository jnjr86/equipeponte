// Optional Vercel endpoint. Delivery is disabled until both secrets are configured.
// No client data is written to logs. Recipient is fixed, never supplied by a visitor.
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!String(req.headers["content-type"] || "").includes("application/json")) {
    return res.status(415).json({ error: "JSON required" });
  }
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host)
        return res.status(403).json({ error: "Invalid origin" });
    } catch {
      return res.status(403).json({ error: "Invalid origin" });
    }
  }
  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  if (!data || Array.isArray(data) || typeof data !== "object")
    return res.status(400).json({ error: "Invalid data" });
  if (JSON.stringify(data).length > 12000)
    return res.status(413).json({ error: "Message too large" });
  if (data.company)
    return res.status(400).json({ error: "Invalid submission" });
  const { name, email, message } = data;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 100 ||
    /[\r\n]/.test(name) ||
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== "string" ||
    message.trim().length < 10 ||
    message.length > 5000
  ) {
    return res.status(400).json({ error: "Check the form fields" });
  }
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM)
    return res.status(503).json({ error: "Delivery not configured" });
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM,
        to: ["equipeponte@gmail.com"],
        reply_to: email,
        subject: "Contato pelo site da Equipe Ponte",
        text: `Nome: ${name.trim()}\nE-mail: ${email}\n\n${message.trim()}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      return res.status(502).json({ error: "Delivery unavailable" });
    const result = await response.json();
    if (!result.id)
      return res.status(502).json({ error: "Delivery not confirmed" });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Delivery unavailable" });
  }
};
