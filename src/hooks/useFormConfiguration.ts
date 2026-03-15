/**
 * useDynamicForm Hook
 *
 * React hook for managing dynamic form configuration
 * Handles loading states, errors, and data fetching
 */

import { useState, useCallback } from 'react';
import {
  formConfigurationService,
  generateSubmissionId,
  extractTitularData,
} from '@/services/formConfiguration.service';
import type {
  ApiResponse,
  State,
  ServiceType,
  FormConfigurationComplete,
  FormSubmissionData,
  FormSectionComplete,
} from '@/lib/supabase/formTypes';

/**
 * Hook for form configuration operations
 */
export const useFormConfiguration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  /**
   * Get all available states
   */
  const getStates = useCallback(async (): Promise<State[] | null> => {
    setLoading(true);
    setError(null);
    const result = await formConfigurationService.getStates();
    setError(result.error);
    setLoading(false);
    return result.data;
  }, []);

  /**
   * Get all available service types
   */
  const getServiceTypes = useCallback(
    async (): Promise<ServiceType[] | null> => {
      setLoading(true);
      setError(null);
      const result = await formConfigurationService.getServiceTypes();
      setError(result.error);
      setLoading(false);
      return result.data;
    },
    []
  );

  /**
   * Get form configuration for a specific state + service + user type
   */
  const getFormConfiguration = useCallback(
    async (params: {
      stateId: string;
      serviceTypeId: string;
      userType: 'cliente' | 'assessor';
    }): Promise<FormConfigurationComplete | null> => {
      setLoading(true);
      setError(null);
      const result = await formConfigurationService.getFormConfiguration(params);
      setError(result.error);
      setLoading(false);
      return result.data;
    },
    []
  );

  /**
   * Submit form data
   */
  const submitForm = useCallback(
    async (
      formData: Record<string, any>,
      config: FormConfigurationComplete,
      userType: 'cliente' | 'assessor',
      assessorData?: {
        nome?: string;
        email?: string;
        telefone?: string;
      }
    ): Promise<any> => {
      setLoading(true);
      setError(null);

      try {
        // Extract titual data from the titular section
        const titularSection = config.sections.find(
          (s) => s.section.slug === 'titular'
        );

        const titularData = titularSection
          ? extractTitularData(formData, titularSection)
          : {};

        // Build submission data
        const submissionData: FormSubmissionData = {
          form_configuration_id: config.configuration.id,
          submission_id: generateSubmissionId(),
          user_type: userType,
          titular_data: titularData,
          requerentes_adicionais: formData.requerentes || [],
          datas_restricao: formData.datasRestricao || [],
          observacoes: formData.observacoes,
          status: 'submitted',
        };

        // Add assessor data if applicable
        if (userType === 'assessor' && assessorData) {
          submissionData.assessor_nome = assessorData.nome;
          submissionData.assessor_email = assessorData.email;
          submissionData.assessor_telefone = assessorData.telefone;
        }

        const result = await formConfigurationService.submitForm(submissionData);
        setError(result.error);
        setLoading(false);

        return result.data;
      } catch (err) {
        console.error('Submit error:', err);
        setError(err);
        setLoading(false);
        return null;
      }
    },
    []
  );

  return {
    getStates,
    getServiceTypes,
    getFormConfiguration,
    submitForm,
    loading,
    error,
  };
};
