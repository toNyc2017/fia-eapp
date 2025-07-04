import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const supabaseUrl = 'https://sqgagbmqjlpylmqmmrbm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZ2FnYm1xamxweWxtcW1tcmJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTU2Mzc2NCwiZXhwIjoyMDY3MTM5NzY0fQ.tfHcKKnMMuOk0neFf2XaGhmQXtiOLGVwZxgggGHSkck';

const supabase = createClient(supabaseUrl, supabaseKey);

async function queryDetailedData() {
  try {
    console.log('Querying detailed application data...\n');
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('Error querying database:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log(`Found ${data.length} application(s):\n`);
      data.forEach((app, index) => {
        console.log(`=== APPLICATION ${index + 1} ===`);
        console.log(`UUID: ${app.id}`);
        console.log(`Session ID: ${app.session_id}`);
        console.log(`Agent: ${app.agent_name} (${app.agent_email})`);
        console.log(`Status: ${app.status}`);
        console.log(`Created: ${app.created_at}`);
        console.log(`Updated: ${app.updated_at}`);
        console.log(`Form Version: ${app.form_version || '1.0'}`);
        
        // Applicant Info (Step 1)
        if (app.applicant_first_name) {
          console.log('\n--- APPLICANT INFO (Step 1) ---');
          console.log(`Name: ${app.applicant_first_name} ${app.applicant_last_name}`);
          console.log(`Email: ${app.applicant_email}`);
          console.log(`Phone: ${app.applicant_phone}`);
          console.log(`DOB: ${app.applicant_date_of_birth}`);
          console.log(`SSN: ${app.applicant_ssn ? '***-**-' + app.applicant_ssn.slice(-4) : 'Not provided'}`);
          console.log(`Address: ${app.applicant_address}, ${app.applicant_city}, ${app.applicant_state} ${app.applicant_zip}`);
        }
        
        // Product Selection (Step 2)
        if (app.product_name) {
          console.log('\n--- PRODUCT SELECTION (Step 2) ---');
          console.log(`Product: ${app.product_name}`);
          console.log(`Ownership Type: ${app.ownership_type}`);
          console.log(`Plan Type: ${app.plan_type}`);
          console.log(`Account Designation: ${app.account_designation}`);
        }
        
        // Owner Info (Step 3) - JSONB data
        if (app.owner_info && Object.keys(app.owner_info).length > 0) {
          console.log('\n--- OWNER INFO (Step 3) ---');
          console.log(`Fields collected: ${Object.keys(app.owner_info).length}`);
          Object.entries(app.owner_info).forEach(([key, value]) => {
            // Mask sensitive data
            if (key === 'ssn' && value) {
              console.log(`${key}: ***-**-${value.slice(-4)}`);
            } else {
              console.log(`${key}: ${value}`);
            }
          });
        }
        
        // Joint Owner Info (Step 4) - JSONB data
        if (app.joint_owner_info && Object.keys(app.joint_owner_info).length > 0) {
          console.log('\n--- JOINT OWNER INFO (Step 4) ---');
          console.log(`Fields collected: ${Object.keys(app.joint_owner_info).length}`);
          Object.entries(app.joint_owner_info).forEach(([key, value]) => {
            if (key === 'ssn' && value) {
              console.log(`${key}: ***-**-${value.slice(-4)}`);
            } else {
              console.log(`${key}: ${value}`);
            }
          });
        }
        
        console.log('\n' + '='.repeat(50) + '\n');
      });
    } else {
      console.log('No applications found in the database.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

queryDetailedData(); 