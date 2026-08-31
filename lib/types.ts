export type Formula = { label: string; title: string; text: string };
export type Faq = { q: string; a: string };

export const asFormulas = (v: unknown): Formula[] => (Array.isArray(v) ? (v as Formula[]) : []);
export const asFaqs = (v: unknown): Faq[] => (Array.isArray(v) ? (v as Faq[]) : []);
