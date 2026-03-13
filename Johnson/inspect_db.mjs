
import { createClient } from '@supabase/supabase-client';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

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
      console.log('First project sample:', projects[0]);
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
      console.log('First case study sample:', caseStudies[0]);
    }
  }
}

inspectData();
