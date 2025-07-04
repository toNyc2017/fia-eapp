import { supabase } from './supabase';
import { logInfo, logError } from './logger';

export interface ApplicationData {
  session_id: string;
  agent_name: string;
  agent_email: string;
  status?: string;
  applicant_first_name?: string;
  applicant_last_name?: string;
  applicant_email?: string;
  applicant_phone?: string;
  applicant_date_of_birth?: string;
  applicant_ssn?: string;
  applicant_address?: string;
  applicant_city?: string;
  applicant_state?: string;
  applicant_zip?: string;
  product_id?: string;
  product_name?: string;
  premium_amount?: number;
  term_length?: number;
  ownership_type?: string;
  plan_type?: string;
  account_designation?: string;
  owner_info?: Record<string, any>;
  joint_owner_info?: Record<string, any>;
  form_version?: string;
}

export class ApplicationService {
  /**
   * Create or update an application in Supabase
   */
  static async saveApplication(data: ApplicationData): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      // Check if application already exists
      const { data: existingApp, error: fetchError } = await supabase
        .from('applications')
        .select('id')
        .eq('session_id', data.session_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        logError('api', 'Error fetching existing application', { error: fetchError.message }, data.session_id);
        return { success: false, error: fetchError.message };
      }

      let result;
      if (existingApp) {
        // Update existing application
        const { data: updatedApp, error: updateError } = await supabase
          .from('applications')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', data.session_id)
          .select()
          .single();

        if (updateError) {
          logError('api', 'Error updating application', { error: updateError.message }, data.session_id);
          return { success: false, error: updateError.message };
        }

        result = updatedApp;
        logInfo('api', 'Application updated successfully', { sessionId: data.session_id }, data.session_id);
      } else {
        // Create new application
        const { data: newApp, error: insertError } = await supabase
          .from('applications')
          .insert({
            ...data,
            status: data.status || 'draft',
            form_version: data.form_version || '1.0'
          })
          .select()
          .single();

        if (insertError) {
          logError('api', 'Error creating application', { error: insertError.message }, data.session_id);
          return { success: false, error: insertError.message };
        }

        result = newApp;
        logInfo('api', 'Application created successfully', { sessionId: data.session_id }, data.session_id);
      }

      return { success: true, id: result.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError('api', 'Unexpected error saving application', { error: errorMessage }, data.session_id);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Load an application by session ID
   */
  static async loadApplication(sessionId: string): Promise<{ success: boolean; data?: ApplicationData; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No application found - this is normal for new sessions
          return { success: true, data: undefined };
        }
        logError('api', 'Error loading application', { error: error.message }, sessionId);
        return { success: false, error: error.message };
      }

      logInfo('api', 'Application loaded successfully', { sessionId }, sessionId);
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError('api', 'Unexpected error loading application', { error: errorMessage }, sessionId);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Get all applications for an agent
   */
  static async getApplicationsByAgent(agentEmail: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('agent_email', agentEmail)
        .order('created_at', { ascending: false });

      if (error) {
        logError('api', 'Error loading applications for agent', { error: error.message, agentEmail });
        return { success: false, error: error.message };
      }

      logInfo('api', 'Applications loaded for agent', { count: data?.length, agentEmail });
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError('api', 'Unexpected error loading applications', { error: errorMessage, agentEmail });
      return { success: false, error: errorMessage };
    }
  }
} 