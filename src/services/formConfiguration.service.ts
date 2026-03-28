/**
 * Form Configuration Service
 *
 * This service handles all database operations for dynamic forms.
 * It follows the existing service layer pattern from base.service.ts
 */

import { supabase } from '@/lib/supabase/client';
import type {
  ApiResponse,
  State,
  ServiceType,
  FormConfigurationComplete,
  FormSubmissionData,
  FormConfiguration,
  FormSectionComplete,
  FormFieldComplete,
  FormField,
  FieldOption,
  FieldValidation,
} from '@/lib/supabase/formTypes';

/**
 * Form Configuration Service
 */
export const formConfigurationService = {
  /**
   * Get all active states
   */
  async getStates(): Promise<ApiResponse<State[]>> {
    const { data, error } = await supabase()
      .from('states')
      .select('*')
      .eq('is_active', true)
      .order('name');

    return { data, error };
  },

  /**
   * Get all active service types
   * Optional: filter by state (if needed in future)
   */
  async getServiceTypes(): Promise<ApiResponse<ServiceType[]>> {
    const { data, error } = await supabase()
      .from('service_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    return { data, error };
  },

  /**
   * Get complete form configuration by state + service type + user type
   *
   * Returns the configuration with all sections, fields, options, and validations
   */
  async getFormConfiguration(params: {
    stateId: string;
    serviceTypeId: string;
    userType: 'cliente' | 'assessor';
  }): Promise<ApiResponse<FormConfigurationComplete>> {
    // Step 1: Get configuration with sections
    const { data: config, error } = await supabase()
      .from('form_configurations')
      .select(`
        *,
        sections:form_sections(*)
      `)
      .eq('state_id', params.stateId)
      .eq('service_type_id', params.serviceTypeId)
      .or(`user_type.eq.${params.userType},user_type.eq.ambos`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !config) {
      console.error('Error fetching form configuration:', error);
      return { data: null, error };
    }

    // Step 2: Get all fields for all sections
    const sectionIds = config.sections.map((s: any) => s.id);
    const { data: fields } = await supabase()
      .from('form_fields')
      .select('*')
      .in('section_id', sectionIds)
      .order('sort_order');

    if (!fields) {
      return {
        data: {
          configuration: config,
          sections: config.sections.map((section: any) => ({
            section,
            fields: [],
          })),
        },
        error: null,
      };
    }

    // Step 3: Get options and validations in parallel
    const fieldIds = fields.map((f: any) => f.id);
    const [optionsResult, validationsResult] = await Promise.all([
      supabase()
        .from('field_options')
        .select('*')
        .in('field_id', fieldIds)
        .order('sort_order'),
      supabase()
        .from('field_validations')
        .select('*')
        .in('field_id', fieldIds),
    ]);

    // Step 4: Build complete structure
    const completeConfig: FormConfigurationComplete = {
      configuration: config,
      sections: config.sections
        .map((section: any) => ({
          section,
          fields: fields
            .filter((f: any) => f.section_id === section.id)
            .map((field: any) => ({
              field,
              options: optionsResult.data?.filter(
                (o: FieldOption) => o.field_id === field.id
              ),
              validations: validationsResult.data?.filter(
                (v: FieldValidation) => v.field_id === field.id
              ),
            })),
        }))
        .sort((a, b) => a.section.sort_order - b.section.sort_order),
    };

    return { data: completeConfig, error: null };
  },

  /**
   * Submit form data to database
   */
  async submitForm(
    data: FormSubmissionData
  ): Promise<ApiResponse<FormConfiguration>> {
    console.log('💾 formConfigurationService: Iniciando submitForm...');
    console.log('📦 Dados a serem inseridos:', {
      form_configuration_id: data.form_configuration_id,
      submission_id: data.submission_id,
      user_type: data.user_type,
      status: data.status,
      submitted_at: new Date().toISOString(),
    });
    console.log('👤 Dados do titular:', data.titular_data);
    console.log('👥 Requerentes adicionais:', data.requerentes_adicionais);
    console.log('📝 Observações:', data.observacoes);

    const { data: submission, error } = await supabase()
      .from('form_submissions')
      .insert({
        ...data,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    console.log('📥 Resultado da operação Supabase:', {
      success: !error,
      error: error,
      submission: submission,
    });

    if (error) {
      console.error('❌ Erro do Supabase:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
    } else {
      console.log('✅ Inserção bem-sucedida:', {
        id: submission?.id,
        submission_id: submission?.submission_id,
        created_at: submission?.created_at,
      });
    }

    return { data: submission, error };
  },

  /**
   * Get existing form submission by ID (for editing/viewing)
   */
  async getSubmission(
    submissionId: string
  ): Promise<ApiResponse<FormConfiguration>> {
    const { data, error } = await supabase()
      .from('form_submissions')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    return { data, error };
  },
};

/**
 * Helper function to generate a unique submission ID
 */
export const generateSubmissionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `SUB-${timestamp}-${random}`.toUpperCase();
};

/**
 * Helper function to extract titual data from form values based on field configuration
 */
export const extractTitularData = (
  formValues: Record<string, any>,
  section: FormSectionComplete
): Record<string, any> => {
  const titularData: Record<string, any> = {};

  section.fields.forEach(({ field }) => {
    // Map field_key to titular_data
    // For now, we'll keep the same field_key structure
    if (formValues[field.field_key] !== undefined) {
      titularData[field.field_key] = formValues[field.field_key];
    }
  });

  return titularData;
};
