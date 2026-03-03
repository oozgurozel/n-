import { createClient } from '@supabase/supabase-js';

// Supabase panelinden (Project Settings -> API) aldığın bilgileri buraya yapıştıracaksın
const supabaseUrl = 'https://jzfnshvrbmzuvowzorpe.supabase.co';
const supabaseKey = 'sb_publishable_c5-DDFXlAAwJ5rAw-fYu0w_pUco6593';

export const supabase = createClient(supabaseUrl, supabaseKey);