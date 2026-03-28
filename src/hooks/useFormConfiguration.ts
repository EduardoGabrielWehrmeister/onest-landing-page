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
import {
  prenotamiBotQueueService,
  mapFormToBotQueue,
} from '@/services/prenotamiBotQueue.service';
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
      console.log('🔄 useFormConfiguration: Iniciando submitForm...');
      setLoading(true);
      setError(null);

      try {
        console.log('📋 Configuração recebida:', {
          configId: config.configuration.id,
          sections: config.sections.length
        });

        // Extract titual data from the titular section
        const titularSection = config.sections.find(
          (s) => s.section.slug === 'titular'
        );

        console.log('👤 Seção titular encontrada:', !!titularSection);

        const titularData = titularSection
          ? extractTitularData(formData, titularSection)
          : {};

        console.log('📝 Dados do titular extraídos:', titularData);

        // Build submission data
        const submissionData: FormSubmissionData = {
          form_configuration_id: config.configuration.id,
          submission_id: generateSubmissionId(),
          user_type: userType,
          titular_data: titularData,
          requerentes_adicionais: formData.requerentes || [],
          observacoes: formData.observacoes,
          status: 'submitted',
        };

        console.log('📦 Dados de submissão preparados:', {
          submission_id: submissionData.submission_id,
          form_configuration_id: submissionData.form_configuration_id,
          user_type: submissionData.user_type,
          requerentes_count: submissionData.requerentes_adicionais?.length,
        });

        // Add assessor data if applicable
        if (userType === 'assessor' && assessorData) {
          console.log('👨‍💼 Adicionando dados do assessor:', assessorData);
          submissionData.assessor_nome = assessorData.nome;
          submissionData.assessor_email = assessorData.email;
          submissionData.assessor_telefone = assessorData.telefone;
        }

        // Submit to form_submissions table
        console.log('📤 Enviando para form_submissions table...');
        const result = await formConfigurationService.submitForm(submissionData);
        
        console.log('📥 Resultado da inserção em form_submissions:', result);
        
        if (result.error) {
          console.error('❌ Erro ao inserir em form_submissions:', result.error);
          setError(result.error);
          setLoading(false);
          return null;
        }

        console.log('✅ Sucesso ao inserir em form_submissions');

        // Also save to prenotami_bot_queue table for bot processing
        console.log('🤖 Preparando dados para prenotami_bot_queue...');
        const botQueueData = mapFormToBotQueue(formData, formData.requerentes || []);
        console.log('🤖 Dados do bot queue:', botQueueData);
        
        console.log('📤 Inserindo em prenotami_bot_queue...');
        const botQueueResult = await prenotamiBotQueueService.insertQueue(botQueueData);
        
        console.log('📥 Resultado da inserção em prenotami_bot_queue:', botQueueResult);
        
        if (botQueueResult.error) {
          console.error('⚠️  Erro ao salvar em prenotami_bot_queue (não crítico):', botQueueResult.error);
          // Don't fail the entire submission if bot queue fails, just log it
        } else {
          console.log('✅ Sucesso ao inserir em prenotami_bot_queue');
        }

        console.log('✅ Processo de submissão concluído com sucesso');
        setLoading(false);
        return result.data;
      } catch (err) {
        console.error('❌ Exceção em submitForm:', err);
        console.error('Detalhes do erro:', {
          message: err instanceof Error ? err.message : 'N/A',
          stack: err instanceof Error ? err.stack : 'N/A',
          name: err instanceof Error ? err.name : 'N/A',
        });
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
