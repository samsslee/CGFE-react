// @ts-nocheck
import 'https://deno.land/x/xhr@0.2.1/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supUrl = Deno.env.get("SUPABASE_URL") as string
const supKey =  Deno.env.get("SUPABASE_ANON_KEY") as string
export const supabase = (req: any) => {
    const authHeader = req.headers?.get('Authorization') ?? ''; // Extract Authorization header or default to empty string
    return createClient(supUrl, supKey, {
      global: { headers: { Authorization: authHeader } }
    });
  };