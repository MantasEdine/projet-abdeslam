import "server-only";

/**
 * Notification e-mail d'une nouvelle demande de devis.
 * Optionnelle : si RESEND_API_KEY n'est pas défini, la demande est simplement
 * enregistrée en base et consultable dans /admin/devis — aucune erreur n'est levée.
 */
export async function notifyNewLead(lead: {
  id: string; name: string; company?: string | null; email: string;
  phone: string; service: string; city: string; message?: string | null;
  utmSource?: string | null; utmCampaign?: string | null;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM;
  if (!key || !to || !from) return { sent: false, reason: "non configuré" };

  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const row = (k: string, v?: string | null) =>
    v ? `<tr><td style="padding:6px 14px 6px 0;color:#777">${k}</td><td style="padding:6px 0"><b>${v}</b></td></tr>` : "";

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px">Nouvelle demande de devis</h2>
      <p style="color:#666;margin:0 0 18px">${lead.service} — ${lead.city}</p>
      <table style="border-collapse:collapse;font-size:14px">
        ${row("Nom", lead.name)}${row("Société", lead.company)}
        ${row("E-mail", lead.email)}${row("Téléphone", lead.phone)}
        ${row("Service", lead.service)}${row("Commune", lead.city)}
        ${row("Source", lead.utmSource)}${row("Campagne", lead.utmCampaign)}
      </table>
      ${lead.message ? `<p style="margin:18px 0 6px;color:#777">Message</p><p style="white-space:pre-wrap;margin:0">${lead.message}</p>` : ""}
      <p style="margin:24px 0 0"><a href="${base}/admin/devis" style="background:#E9B44C;color:#0A0B0D;padding:11px 20px;border-radius:100px;text-decoration:none;font-weight:700">Ouvrir dans l'admin</a></p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: to.split(",").map((s) => s.trim()),
        reply_to: lead.email,
        subject: `Devis — ${lead.name} (${lead.service})`,
        html,
      }),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false, reason: "erreur réseau" };
  }
}
