/**
 * Hook para gerenciar configuração dinâmica de formulários
 * @description Busca e gerencia configurações de formulário do banco de dados
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { formConfigService } from '@/services/base.service';
import type {
  FormConfigurationWithSections,
  FormFieldWithOptions,
  FormFieldValue,
  ConditionalOperator,
} from '@/lib/supabase/types';

export type UserType = 'cliente' | 'assessor';

export interface UseFormConfigOptions {
  /** Se deve usar cache (default: true) */
  useCache?: boolean;
  /** Callback executado quando ocorre erro */
  onError?: (error: Error) => void;
}

export interface UseFormConfigReturn {
  /** Configuração completa do formulário */
  config: FormConfigurationWithSections | null;
  /** Se está carregando */
  loading: boolean;
  /** Erro ocorrido */
  error: Error | null;
  /** Recarrega a configuração */
  refetch: () => Promise<void>;
  /** Verifica se um campo deve ser visível baseado nos valores atuais */
  isFieldVisible: (field: FormFieldWithOptions, currentValues: Record<string, FormFieldValue>) => boolean;
  /** Verifica se uma seção deve ser visível */
  isSectionVisible: (sectionIndex: number, currentValues: Record<string, FormFieldValue>) => boolean;
  /** Valida um campo baseado nas regras do banco */
  validateField: (field: FormFieldWithOptions, value: FormFieldValue) => { valid: boolean; error?: string };
  /** Valida todos os campos de uma seção */
  validateSection: (sectionIndex: number, values: Record<string, FormFieldValue>) => { valid: boolean; errors: Record<string, string> };
  /** Lista de todas as seções visíveis */
  visibleSections: FormConfigurationWithSections['sections'];
}

/**
 * Hook principal para gerenciar configuração de formulários dinâmicos
 */
export function useFormConfig(
  stateCode: string | null,
  serviceSlug: string | null,
  userType?: UserType,
  options: UseFormConfigOptions = {}
): UseFormConfigReturn {
  const { useCache = true, onError } = options;

  const [config, setConfig] = useState<FormConfigurationWithSections | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Busca a configuração do formulário
   */
  const fetchConfig = useCallback(async () => {
    if (!stateCode || !serviceSlug) {
      setConfig(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await formConfigService.getFormConfig(stateCode, serviceSlug, useCache);

      if (result.error || !result.data) {
        const err = new Error(result.error?.message || 'Erro ao buscar configuração do formulário');
        setError(err);
        onError?.(err);
        setConfig(null);
      } else {
        setConfig(result.data);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(errorObj);
      onError?.(errorObj);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, [stateCode, serviceSlug, useCache, onError]);

  /**
   * Recarrega a configuração (limpando cache)
   */
  const refetch = useCallback(async () => {
    formConfigService.clearCache();
    await fetchConfig();
  }, [fetchConfig]);

  // Buscar config quando stateCode ou serviceSlug mudar
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  /**
   * Avalia uma condição condicional
   */
  const evaluateCondition = useCallback((
    operator: ConditionalOperator,
    triggerValue: FormFieldValue,
    expectedValue: string
  ): boolean => {
    const triggerStr = String(triggerValue || '').toLowerCase();
    const expectedStr = String(expectedValue || '').toLowerCase();

    switch (operator) {
      case 'equals':
        return triggerStr === expectedStr;
      case 'not_equals':
        return triggerStr !== expectedStr;
      case 'contains':
        return triggerStr.includes(expectedStr);
      case 'not_contains':
        return !triggerStr.includes(expectedStr);
      case 'in':
        return expectedStr.split(',').map(v => v.trim()).includes(triggerStr);
      case 'not_in':
        return !expectedStr.split(',').map(v => v.trim()).includes(triggerStr);
      case 'greater_than':
        return Number(triggerStr) > Number(expectedStr);
      case 'less_than':
        return Number(triggerStr) < Number(expectedStr);
      case 'is_empty':
        return !triggerStr || triggerStr.length === 0;
      case 'is_not_empty':
        return !!triggerStr && triggerStr.length > 0;
      default:
        return false;
    }
  }, []);

  /**
   * Verifica se um campo deve ser visível baseado nos valores atuais
   */
  const isFieldVisible = useCallback((
    field: FormFieldWithOptions,
    currentValues: Record<string, FormFieldValue>
  ): boolean => {
    // Se não for condicional, sempre visível
    if (!field.is_conditional || !field.depends_on_field_id || !field.depends_on_value) {
      return true;
    }

    // Buscar o campo que dispara a condição
    const triggerField = config?.sections
      .flatMap(s => s.fields)
      .find(f => f.id === field.depends_on_field_id);

    if (!triggerField) {
      return true;
    }

    const triggerValue = currentValues[triggerField.field_key];
    return evaluateCondition(
      field.depends_on_operator,
      triggerValue,
      field.depends_on_value
    );
  }, [config, evaluateCondition]);

  /**
   * Verifica se uma seção deve ser visível
   */
  const isSectionVisible = useCallback((
    sectionIndex: number,
    currentValues: Record<string, FormFieldValue>
  ): boolean => {
    const section = config?.sections[sectionIndex];
    if (!section) return false;

    // Se não for condicional, sempre visível
    if (!section.is_conditional || !section.depends_on_field_id || !section.depends_on_value) {
      return true;
    }

    // Buscar o campo que dispara a condição da seção
    const triggerField = config?.sections
      .flatMap(s => s.fields)
      .find(f => f.id === section.depends_on_field_id);

    if (!triggerField) {
      return true;
    }

    const triggerValue = currentValues[triggerField.field_key];
    // Para seções, usamos sempre 'equals' como operador padrão
    return String(triggerValue || '').toLowerCase() === String(section.depends_on_value).toLowerCase();
  }, [config]);

  /**
   * Valida um campo específico baseado nas regras do banco
   */
  const validateField = useCallback((
    field: FormFieldWithOptions,
    value: FormFieldValue
  ): { valid: boolean; error?: string } => {
    const valueStr = String(value || '').trim();

    // Validação de campo obrigatório
    if (field.is_required && !valueStr) {
      return {
        valid: false,
        error: `${field.label} é obrigatório`,
      };
    }

    // Se não tem valor e não é obrigatório, é válido
    if (!valueStr) {
      return { valid: true };
    }

    // Validações do banco
    if (field.validations && field.validations.length > 0) {
      for (const validation of field.validations) {
        const { validation_type, validation_value, error_message } = validation;

        switch (validation_type) {
          case 'pattern':
            if (validation_value) {
              const regex = new RegExp(validation_value);
              if (!regex.test(valueStr)) {
                return { valid: false, error: error_message };
              }
            }
            break;

          case 'min_length':
            if (validation_value && valueStr.length < Number(validation_value)) {
              return { valid: false, error: error_message };
            }
            break;

          case 'max_length':
            if (validation_value && valueStr.length > Number(validation_value)) {
              return { valid: false, error: error_message };
            }
            break;

          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valueStr)) {
              return { valid: false, error: error_message || 'Email inválido' };
            }
            break;

          case 'phone':
            const phoneNumbers = valueStr.replace(/\D/g, '');
            if (phoneNumbers.length !== 10 && phoneNumbers.length !== 11) {
              return { valid: false, error: error_message || 'Telefone inválido' };
            }
            break;

          case 'cep':
            const cepNumbers = valueStr.replace(/\D/g, '');
            if (cepNumbers.length !== 8) {
              return { valid: false, error: error_message || 'CEP inválido' };
            }
            break;

          case 'custom':
            // Validações customizadas devem ser tratadas externamente
            break;
        }
      }
    }

    // Validação de min/max para números
    if (field.field_type === 'number') {
      const numValue = Number(valueStr);
      if (field.min_value !== undefined && numValue < field.min_value) {
        return {
          valid: false,
          error: `${field.label} deve ser maior ou igual a ${field.min_value}`,
        };
      }
      if (field.max_value !== undefined && numValue > field.max_value) {
        return {
          valid: false,
          error: `${field.label} deve ser menor ou igual a ${field.max_value}`,
        };
      }
    }

    return { valid: true };
  }, []);

  /**
   * Valida todos os campos de uma seção
   */
  const validateSection = useCallback((
    sectionIndex: number,
    values: Record<string, FormFieldValue>
  ): { valid: boolean; errors: Record<string, string> } => {
    const section = config?.sections[sectionIndex];
    if (!section) {
      return { valid: true, errors: {} };
    }

    const errors: Record<string, string> = {};
    let valid = true;

    for (const field of section.fields) {
      const result = validateField(field, values[field.field_key]);
      if (!result.valid) {
        valid = false;
        errors[field.field_key] = result.error || `${field.label} inválido`;
      }
    }

    return { valid, errors };
  }, [config, validateField]);

  /**
   * Lista de seções visíveis baseadas nos valores atuais
   * (memoizada para performance)
   */
  const visibleSections = useMemo(() => {
    if (!config) return [];

    return config.sections.filter(section => {
      // Se a seção não é condicional, sempre visível
      if (!section.is_conditional) {
        return true;
      }

      // Caso 1: Seção tem depends_on_field_id definido
      // Isso indica uma lógica condicional baseada em valores de campos do formulário
      if (section.depends_on_field_id) {
        // Neste caso, a visibilidade é determinada dinamicamente pelo valor do campo
        // Por enquanto, retornamos true pois a avaliação real acontece em runtime
        // quando o usuário interage com o formulário
        return true;
      }

      // Caso 2: Seção NÃO tem depends_on_field_id mas tem depends_on_value
      // Este é um caso especial para seções que dependem do tipo de usuário
      // Exemplo: seção "assessor" que só aparece para assessores
      if (section.depends_on_value) {
        // Se userType foi fornecido, verificar se corresponde ao valor esperado
        if (userType) {
          return section.depends_on_value.toLowerCase() === userType.toLowerCase();
        }
        // Se não tem userType, a seção condicional fica oculta
        return false;
      }

      // Caso 3: Seção marcada como condicional mas sem dependências definidas
      // Por segurança, retornamos false
      return false;
    });
  }, [config, userType]);

  return {
    config,
    loading,
    error,
    refetch,
    isFieldVisible,
    isSectionVisible,
    validateField,
    validateSection,
    visibleSections,
  };
}

/**
 * Hook auxiliar para gerenciar valores de um formulário dinâmico
 */
export function useDynamicFormFields(
  config: FormConfigurationWithSections | null
) {
  const [values, setValues] = useState<Record<string, FormFieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Atualiza o valor de um campo
   */
  const updateValue = useCallback((fieldKey: string, value: FormFieldValue) => {
    setValues(prev => ({
      ...prev,
      [fieldKey]: value,
    }));
    // Limpar erro ao atualizar valor
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldKey];
      return newErrors;
    });
  }, []);

  /**
   * Atualiza múltiplos valores de uma vez
   */
  const updateValues = useCallback((newValues: Record<string, FormFieldValue>) => {
    setValues(prev => ({ ...prev, ...newValues }));
    // Limpar erros dos campos atualizados
    const keys = Object.keys(newValues);
    setErrors(prev => {
      const newErrors = { ...prev };
      keys.forEach(key => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  /**
   * Limpa todos os valores e erros
   */
  const reset = useCallback(() => {
    setValues({});
    setErrors({});
  }, []);

  /**
   * Valida um campo específico e armazena o erro
   */
  const validateField = useCallback((
    field: FormFieldWithOptions,
    value?: FormFieldValue
  ): boolean => {
    const fieldValue = value !== undefined ? value : values[field.field_key];
    // TODO: integrar com validação do useFormConfig
    return true;
  }, [values]);

  return {
    values,
    errors,
    setErrors,
    updateValue,
    updateValues,
    reset,
    validateField,
  };
}
