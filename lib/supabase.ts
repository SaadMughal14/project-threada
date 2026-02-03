
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Your live Supabase credentials
const SUPABASE_URL = "https://ogztqrexnzmknmosgazb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nenRxcmV4bnpta25tb3NnYXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTIxMDksImV4cCI6MjA4NTY2ODEwOX0.NdT_Ze7nT-ueujEPhBBnyJnsu4CdNj-nyH7kaBUppBI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Helper to handle profile fetching/creation
 * Profiles link to the auth.users table and store the 'role' (admin/customer)
 */
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  return { data, error };
};
