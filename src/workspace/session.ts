import { create } from 'zustand';
import { repo } from './data';
import type { Person } from './types';

interface Session {
  user: Person | null;
  ready: boolean;
  load: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<Person>;
  signInAs: (userId: string) => Promise<Person>;
  signOut: () => Promise<void>;
}

export const useSession = create<Session>((set) => ({
  user: null,
  ready: false,
  load: async () => {
    try {
      set({ user: await repo.currentUser(), ready: true });
    } catch {
      set({ user: null, ready: true });
    }
  },
  signIn: async (email, password) => {
    const user = await repo.signIn(email, password);
    set({ user });
    return user;
  },
  signInAs: async (userId) => {
    if (!repo.signInAs) throw new Error('Demo sign-in is not available.');
    const user = await repo.signInAs(userId);
    set({ user });
    return user;
  },
  signOut: async () => {
    await repo.signOut();
    set({ user: null });
  },
}));
