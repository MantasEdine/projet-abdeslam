type P = { size?: number; className?: string };
const s = (n = 16) => ({ width: n, height: n, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" as const });

export const Check = ({ size = 15 }: P) => (
  <svg {...s(size)} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
);
export const Arrow = ({ size = 15 }: P) => (
  <svg {...s(size)} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Phone = ({ size = 16 }: P) => (
  <svg {...s(size)} strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
);
export const Mail = ({ size = 20 }: P) => (
  <svg {...s(size)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
);
export const Pin = ({ size = 20 }: P) => (
  <svg {...s(size)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
export const Clock = ({ size = 20 }: P) => (
  <svg {...s(size)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
);
export const Shield = ({ size = 22 }: P) => (
  <svg {...s(size)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
export const Home = ({ size = 22 }: P) => (
  <svg {...s(size)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
);
export const Doc = ({ size = 22 }: P) => (
  <svg {...s(size)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 15h6M9 11h3" /></svg>
);
export const Star = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.8z" /></svg>
);
export const WhatsApp = ({ size = 26 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" /><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.2 3.9z" /></svg>
);
export const Logo = ({ id = "lg", className = "logo__mark" }: { id?: string; className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" aria-hidden>
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F7D68C" /><stop offset="1" stopColor="#E9B44C" /></linearGradient></defs>
    <path d="M32 6 55 14v17c0 14.5-9.6 24.2-23 28.6C18.6 55.2 9 45.5 9 31V14z" fill="none" stroke={`url(#${id})`} strokeWidth="3.4" strokeLinejoin="round" />
    <path d="M24 42V22h10a6 6 0 0 1 0 12h-10m10 0 7 8" fill="none" stroke={`url(#${id})`} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
