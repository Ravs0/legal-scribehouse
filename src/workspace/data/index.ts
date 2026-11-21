import { demoRepo } from './demo';
import { supabaseRepo } from './supabase';
import type { Repo } from './repo';

/**
 * Which backend the workspace and the public blog use.
 *   VITE_WORKSPACE_BACKEND=supabase  the real database (apply supabase/migrations first)
 *   anything else / unset            the in-browser demo (seeded, nothing leaves the browser)
 */
export const BACKEND: Repo['mode'] = import.meta.env.VITE_WORKSPACE_BACKEND === 'supabase' ? 'supabase' : 'demo';
export const repo: Repo = BACKEND === 'supabase' ? supabaseRepo : demoRepo;
export type { Repo } from './repo';
export { AccessError } from './repo';
