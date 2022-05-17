import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
    "https://ipcjulpltlmdeeqrzlqc.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTE4MzczNywiZXhwIjoxOTQwNzU5NzM3fQ.qCRTB_hneCY4v-neO7mKo6y5U42jC-b9gft3wyWrwgc"
    ,{
        autoRefreshToken: true,
        persistSession: true
    }
) 

export { supabase };