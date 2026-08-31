/** Coordonnées et constantes du site. Surchargeables par la table Setting. */
export const SITE = {
  name: "Regiis Security",
  legalName: "Regiis Security",
  phone: "+33652920387",
  phoneDisplay: "06 52 92 03 87",
  whatsapp: "33652920387",
  whatsappMessage:
    "Bonjour, je souhaite obtenir un devis pour une prestation de sécurité (gardiennage / rondes / alarme).",
  email: "contact@regiis-security.com",
  address: { street: "6-8 avenue de Creil", zip: "60300", city: "Senlis", country: "FR" },
  areas: ["Oise", "Hauts-de-France", "Île-de-France"],
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://regiis-security.com",
} as const;

export const waLink = (msg = SITE.whatsappMessage) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
