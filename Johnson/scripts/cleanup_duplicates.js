
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qkwjerktszhlccrdjmxg.supabase.co';
const supabaseKey = 'sb_publishable_D0zjPiQhaOHFU8lRbbdjJw_gFu3DzNQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicates() {
  console.log('--- Cleaning up duplicate "case_studies" ---');
  const { data: caseStudies, error } = await supabase
    .from('case_studies')
    .select('*');
  
  if (error) {
    console.error('Error fetching case studies:', error);
    return;
  }

  const seen = new Set();
  const toDelete = [];

  // Group by name and type to find duplicates
  caseStudies.forEach(cs => {
    const identifier = `${cs.organization_name}-${cs.type}`;
    if (seen.has(identifier)) {
      toDelete.push(cs.id);
    } else {
      seen.add(identifier);
    }
  });

  console.log(`Found ${toDelete.length} duplicates to delete.`);

  for (const id of toDelete) {
    const { error: delError } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id);
    
    if (delError) {
      console.error(`Error deleting case study ${id}:`, delError);
    } else {
      console.log(`Deleted case study ${id}`);
    }
  }

  console.log('Cleanup complete.');
}

cleanupDuplicates();
