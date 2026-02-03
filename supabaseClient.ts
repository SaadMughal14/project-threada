import { createClient } from '@supabase/supabase-js';

const storedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('sb_url') : null;
const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('sb_key') : null;

const supabaseUrl = storedUrl || 'https://ogztqrexnzmknmosgazb.supabase.co';
const supabaseAnonKey = storedKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nenRxcmV4bnpta25tb3NnYXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTIxMDksImV4cCI6MjA4NTY2ODEwOX0.NdT_Ze7nT-ueujEPhBBnyJnsu4CdNj-nyH7kaBUppBI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for Supabase data
export interface SupabaseProduct {
    id: string;
    name: string;
    tagline: string | null;
    description: string | null;
    category: string;
    category_id: string | null;
    color: string;
    image_url: string | null;
    ingredients: string[];
    size_options: { name: string; price: string }[];
    is_featured: boolean;
    is_visible: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface SupabaseCategory {
    id: string;
    name: string;
    icon: string | null;
    icon_type: 'emoji' | 'image';
    display_order: number;
    created_at: string;
}
