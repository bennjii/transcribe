import { supabase } from '@root/client';

export default function handler(req, res) {
    supabase.auth.api.setAuthCookie(req, res)
}