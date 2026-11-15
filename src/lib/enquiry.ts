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

/**
 * Sends a consultation enquiry.
 *
 * TODO(before launch): there is no enquiries backend yet. This opens the visitor's mail
 * client with a prefilled email to SITE.email. Swap the body of this function for a real
 * endpoint (form service, Supabase edge function, CRM webhook) when one exists.
 */
export async function submitEnquiry(e: Enquiry): Promise<void> {
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
