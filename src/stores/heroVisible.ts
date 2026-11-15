import { create } from 'zustand';

/** Whether the home hero is ≥40% on screen; drives the aurora veil. */
export const useHeroVisible = create<{ visible: boolean; set: (v: boolean) => void }>((set) => ({
  visible: false,
  set: (visible) => set({ visible }),
}));
