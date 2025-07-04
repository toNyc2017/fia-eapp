import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const supabaseUrl = 'https://sqgagbmqjlpylmqmmrbm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZ2FnYm1xamxweWxtcW1tcmJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTU2Mzc2NCwiZXhwIjoyMDY3MTM5NzY0fQ.tfHcKKnMMuOk0neFf2XaGhmQXtiOLGVwZxgggGHSkck';

const supabase = createClient(supabaseUrl, supabaseKey);

async function queryDatabase() {
  try {
    console.log('Querying applications table...\n');
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('Error querying database:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log(`Found ${data.length} application(s):\n`);
      data.forEach((app, index) => {
        console.log(`--- Application ${index + 1} ---`);
        console.log(`ID: ${app.id}`);
        console.log(`Session ID: ${app.session_id}`);
        console.log(`Agent: ${app.agent_name} (${app.agent_email})`);
        console.log(`Status: ${app.status}`);
        console.log(`Created: ${app.created_at}`);
        console.log(`Updated: ${app.updated_at}`);
        
        if (app.applicant_first_name) {
          console.log(`Applicant: ${app.applicant_first_name} ${app.applicant_last_name}`);
        }
        
        if (app.product_name) {
          console.log(`Product: ${app.product_name}`);
        }
        
        if (app.owner_info && Object.keys(app.owner_info).length > 0) {
          console.log(`Owner Info: ${Object.keys(app.owner_info).length} fields`);
        }
        
        if (app.joint_owner_info && Object.keys(app.joint_owner_info).length > 0) {
          console.log(`Joint Owner Info: ${Object.keys(app.joint_owner_info).length} fields`);
        }
        
        console.log('');
      });
    } else {
      console.log('No applications found in the database.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

queryDatabase(); 