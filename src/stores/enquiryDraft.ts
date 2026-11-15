import { create } from 'zustand';

/** Lets the readiness check hand a prefilled message to the contact form. */
interface EnquiryDraft {
  message: string;
  nonce: number;
  prefill: (message: string) => void;
}

export const useEnquiryDraft = create<EnquiryDraft>((set) => ({
  message: '',
  nonce: 0,
  prefill: (message) => set((s) => ({ message, nonce: s.nonce + 1 })),
}));
