import { WhatsApp } from "./icons";

export function WhatsAppBubble({ phone, message }: { phone: string; message: string }) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (
    <a
      className="wa"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      data-evt="whatsapp"
    >
      <WhatsApp />
      <span>Écrire sur WhatsApp</span>
    </a>
  );
}
