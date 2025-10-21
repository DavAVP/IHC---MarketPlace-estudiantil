import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yopgmcwszkpldhupivth.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvcGdtY3dzemtwbGRodXBpdnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTI1MjUsImV4cCI6MjA3NTk2ODUyNX0.SVIbDPxbv9CcPzC8Rt-x_1BE42-ajfpcC_m05-EsocM'

export const supabase = createClient(supabaseUrl, supabaseKey);