import { SITE } from '@/config/site';

export interface Enquiry {
  name: string;
  email: string;
  company?: string;
  origin?: string;
  markets: string[];
  category?: string;
  stage?: string;
  message: string;
}

import { BACKEND, repo } from '@/workspace/data';

export const IS_PREVIEW = Boolean(import.meta.env.VITE_ARTIFACT);
/** Demo backend: the enquiry lands in this browser's workspace inbox (try /workspace/enquiries). */
export const IS_DEMO_INBOX = BACKEND === 'demo';

/**
 * Sends a consultation enquiry to the enquiries table (Supabase), or to the demo inbox in this browser.
 * If the database call fails, falls back to opening a prefilled email so the enquiry is never lost.
 */
export async function submitEnquiry(e: Enquiry): Promise<'stored' | 'email'> {
  try {
    await repo.submitEnquiry({
      name: e.name, email: e.email, company: e.company || undefined, origin: e.origin || undefined, markets: e.markets ?? [],
      category: e.category || undefined, stage: e.stage || undefined, message: e.message,
    });
    return 'stored';
  } catch {
    if (IS_PREVIEW) return 'stored';
    openMail(e);
    return 'email';
  }
}

function openMail(e: Enquiry) {
  const subject = `Consult request: ${e.company || e.name}`;
  const body = [
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    e.company && `Company: ${e.company}`,
    e.origin && `Exporting from: ${e.origin}`,
    e.markets.length > 0 && `Target markets: ${e.markets.join(', ')}`,
    e.category && `Product category: ${e.category}`,
    e.stage && `Stage: ${e.stage}`,
    '',
    e.message,
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n');

  window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
