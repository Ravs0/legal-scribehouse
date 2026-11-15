/** Export readiness check: six questions, each answer scores 0, 1 or 2 (options listed in that order). */
export interface ReadinessQuestion {
  id: string;
  question: string;
  options: [string, string, string];
  /** Short "fix first" line shown when this question scores low. */
  fix: string;
  /** Service card this gap maps to (see src/data/services.ts). */
  service: string;
}

export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  {
    id: 'hs',
    question: "Do you know your product's HS code for the target country?",
    options: ['No', 'We have our home-country code', 'Confirmed for the destination'],
    fix: 'Confirm the destination HS classification',
    service: 'Customs, HS codes & FTAs',
  },
  {
    id: 'registration',
    question: 'Have you checked whether your product needs registration or a licence there?',
    options: ['Not yet', 'We think so', 'Yes, and we know who will hold it'],
    fix: 'Map registration requirements and who holds them',
    service: 'Product registration & licensing',
  },
  {
    id: 'trademark',
    question: 'Is your trademark filed in the target country?',
    options: ['No', 'Home country only', 'Filed or registered there'],
    fix: 'File your trademark before you ship',
    service: 'Trademark & IP protection',
  },
  {
    id: 'contract',
    question: 'Do you have a written contract with your buyer or distributor?',
    options: ['No, or emails only', 'Their template', 'Negotiated, with governing law and a dispute clause'],
    fix: 'Put a negotiated contract in place',
    service: 'Export contracts & Incoterms',
  },
  {
    id: 'fta',
    question: 'Do you know whether your goods qualify for FTA preferential duty?',
    options: ['Never checked', 'Probably', 'Origin analysis done'],
    fix: 'Check origin before relying on an FTA rate',
    service: 'Customs, HS codes & FTAs',
  },
  {
    id: 'payment',
    question: 'How will you get paid?',
    options: ['Open account, new buyer', 'Part deposit', 'LC, insured or secured terms'],
    fix: 'Secure your payment terms',
    service: 'Disputes & payment risk',
  },
];

export const MAX_SCORE = READINESS_QUESTIONS.length * 2;

export interface ReadinessVerdict {
  stamp: 'HOLD' | 'INSPECT' | 'CLEARED';
  title: string;
  copy: string;
}

export function verdictFor(score: number): ReadinessVerdict {
  if (score <= 4)
    return {
      stamp: 'HOLD',
      title: 'Hold at port.',
      copy: 'A few fundamentals are missing. All fixable, and best fixed before you ship.',
    };
  if (score <= 8)
    return {
      stamp: 'INSPECT',
      title: 'Nearly cleared.',
      copy: 'You have the basics; the gaps are where disputes and delays usually start.',
    };
  return { stamp: 'CLEARED', title: 'Ready to sail.', copy: 'A quick review to confirm, then go.' };
}
