import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Supabase Auth is email-based; this app's login UX is username-based.
// Usernames are mapped to a fake, non-routable email domain so Supabase
// Auth (sessions, JWT verification, etc.) can be used unchanged underneath.
const USERNAME_EMAIL_DOMAIN = 'mykitchen.local';

export const usernameToEmail = (username) =>
  `${username.trim().toLowerCase()}@${USERNAME_EMAIL_DOMAIN}`;
