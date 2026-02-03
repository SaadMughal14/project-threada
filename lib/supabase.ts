
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Replace these with your actual Supabase credentials found in Project Settings > API
const SUPABASE_URL = "https://your-project-url.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to handle profile fetching/creation
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  return { data, error };
};
