const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// supabase storage
const storage = supabase.storage;

module.exports = { supabase, storage };
