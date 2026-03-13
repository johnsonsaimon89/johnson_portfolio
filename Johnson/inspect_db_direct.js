
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qkwjerktszhlccrdjmxg.supabase.co';
const supabaseKey = 'sb_publishable_D0zjPiQhaOHFU8lRbbdjJw_gFu3DzNQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectData() {
  console.log('--- Inspecting "projects" table ---');
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*');
  
  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
  } else {
    console.log(`Found ${projects.length} projects.`);
    if (projects.length > 0) {
      console.log('Projects:', projects.map(p => p.title || p.name));
    }
  }

  console.log('\n--- Inspecting "case_studies" table ---');
  const { data: caseStudies, error: caseStudiesError } = await supabase
    .from('case_studies')
    .select('*');
  
  if (caseStudiesError) {
    console.error('Error fetching case studies:', caseStudiesError);
  } else {
    console.log(`Found ${caseStudies.length} case studies.`);
    if (caseStudies.length > 0) {
      console.log('Case Studies:', caseStudies.map(cs => cs.organization_name || cs.title));
    }
  }
}

inspectData();
