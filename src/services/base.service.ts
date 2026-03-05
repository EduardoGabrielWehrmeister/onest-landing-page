/**
 * Serviço Base para Supabase
 * @description Fornece métodos reutilizáveis para operações com o banco de dados
 */

import { supabase } from '@/lib/supabase/client';
import type {
  ServicesDone,
  StatsFilters,
  ApiResponse,
  State,
  ServiceType,
  FormConfigurationWithSections,
  FormConfiguration,
  FormSubmission,
  FormSubmissionInsert,
  FormSubmissionUpdate
} from '@/lib/supabase/types';

/**
 * Trata erros do Supabase e retorna um formato padronizado
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (error: any): ApiResponse<null> => {
  console.error('Erro na operação do Supabase:', error);
  
  return {
    data: null,
    error: {
      message: error.message || 'Erro desconhecido',
      details: error.details,
      hint: error.hint,
      code: error.code,
    },
  };
};

/**
 * Serviço de Estatísticas
 * @description Operações relacionadas à tabela services_done
 */
export const statsService = {
  /**
   * Busca todos os registros de serviços
   * @returns Promise com array de ServicesDone ou erro
   */
  async getAll(): Promise<ApiResponse<ServicesDone[]>> {
    try {
      const { data, error } = await supabase()
        .from('services_done')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        return handleError(error);
      }

      return {
        data: data || [],
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Busca estatísticas de um ano específico
   * @param year - Ano para filtrar
   * @returns Promise com ServicesDone ou erro
   */
  async getByYear(year: number): Promise<ApiResponse<ServicesDone | null>> {
    try {
      const { data, error } = await supabase()
        .from('services_done')
        .select('*')
        .eq('year', year)
        .single();

      if (error) {
        return handleError(error);
      }

      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Busca estatísticas mais recentes (ano atual ou mais recente)
   * @returns Promise com ServicesDone ou erro
   */
  async getLatest(): Promise<ApiResponse<ServicesDone | null>> {
    try {
      const { data, error } = await supabase()
        .from('services_done')
        .select('*')
        .order('year', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        return handleError(error);
      }

      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Busca estatísticas com filtros personalizados
   * @param filters - Filtros para aplicar na busca
   * @returns Promise com array de ServicesDone ou erro
   */
  async getWithFilters(filters: StatsFilters): Promise<ApiResponse<ServicesDone[]>> {
    try {
      let query = supabase()
        .from('services_done')
        .select('*');

      if (filters.year) {
        query = query.eq('year', filters.year);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      query = query.order('year', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return handleError(error);
      }

      return {
        data: data || [],
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Busca o total acumulado de serviços (soma de todos os anos)
   * @returns Promise com número total ou erro
   */
  async getTotalAccumulated(): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase()
        .from('services_done')
        .select('total');

      if (error) {
        return handleError(error);
      }

      const total = data?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;

      return {
        data: total,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Busca o total acumulado de agendamentos no Prenotami (soma de todos os anos)
   * @returns Promise com número total ou erro
   */
  async getPrenotamiAccumulated(): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase()
        .from('services_done')
        .select('total_prenotami');

      if (error) {
        return handleError(error);
      }

      const total = data?.reduce((sum, item) => sum + (item.total_prenotami || 0), 0) || 0;

      return {
        data: total,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },
};

/**
 * Serviço de Teste de Conexão
 * @description Métodos para verificar a conexão com o Supabase
 */
export const connectionService = {
  /**
   * Testa se a conexão com o Supabase está funcionando
   * @returns Promise<boolean> - true se conectou com sucesso
   */
  async test(): Promise<boolean> {
    try {
      const { error } = await supabase()
        .from('services_done')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Erro ao testar conexão:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return false;
    }
  },

  /**
   * Testa se a chave pública tem permissão de escrita (INSERT)
   * @returns Promise<{ success: boolean; message: string }> - resultado do teste
   */
  async testWritePermission(): Promise<{ success: boolean; message: string }> {
    try {
      // Tenta inserir um registro fictício
      const testData = {
        year: 9999,
        passaporte: 0,
        cidadania_fila: 0,
        identidade: 0,
        cidadania_menores: 0,
        outros: 0,
        comments: 'TESTE DE SEGURANÇA - DEVE SER REMOVIDO',
      };

      const { error } = await supabase()
        .from('services_done')
        .insert(testData);

      if (error) {
        // Se houver erro, isso é bom - significa que não tem permissão de escrita
console.log(error.message)

        if (error.code === '42501' || error.code === '23503' || error.code === '42P01') {
          return {
            success: false,
            message: '✅ Segura: A chave pública NÃO tem permissão de escrita (correto)',
          };
        }
        
        return {
          success: false,
          message: `⚠️ Erro inesperado: ${error.message}`,
        };
      }

      // Se não houver erro, isso é RUIM - significa que tem permissão de escrita
      // Tenta remover o registro de teste
      try {
        await supabase()
          .from('services_done')
          .delete()
          .eq('year', 9999)
          .eq('comments', 'TESTE DE SEGURANÇA - DEVE SER REMOVIDO');
      } catch (deleteError) {
        console.error('Erro ao limpar teste:', deleteError);
      }

      return {
        success: true,
        message: '⚠️ ATENÇÃO: A chave pública TEM permissão de escrita! Verifique as políticas RLS.',
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao testar permissão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
  },

  /**
   * Verifica se as variáveis de ambiente estão configuradas
   * @returns boolean - true se configurado
   */
  isConfigured(): boolean {
    return !!(
      import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  },
};

// ============================================================================
// DYNAMIC FORMS SERVICES
// ============================================================================

/**
 * Cache para configurações de formulário
 */
interface CacheEntry {
  data: FormConfigurationWithSections;
  timestamp: number;
}

const formConfigCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Serviço de Estados
 * @description Operações relacionadas à tabela states
 */
export const statesService = {
  /**
   * Busca todos os estados ativos
   * @returns Promise com array de State ou erro
   */
  async getAll(): Promise<ApiResponse<State[]>> {
    try {
      const { data, error } = await supabase()
        .from('states')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        return handleError(error);
      }

      return {
        data: data || [],
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Busca estado por código (UF)
   * @param code - Código do estado (ex: 'SP', 'RJ')
   * @returns Promise com State ou erro
   */
  async getByCode(code: string): Promise<ApiResponse<State | null>> {
    try {
      const { data, error } = await supabase()
        .from('states')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) {
        return handleError(error);
      }

      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },
};

/**
 * Serviço de Tipos de Serviço
 * @description Operações relacionadas à tabela service_types
 */
export const serviceTypesService = {
  /**
   * Busca todos os tipos de serviço ativos
   * @returns Promise com array de ServiceType ou erro
   */
  async getAll(): Promise<ApiResponse<ServiceType[]>> {
    try {
      const { data, error } = await supabase()
        .from('service_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        return handleError(error);
      }

      return {
        data: data || [],
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Busca tipo de serviço por slug
   * @param slug - Slug do serviço (ex: 'renovacao-passaporte')
   * @returns Promise com ServiceType ou erro
   */
  async getBySlug(slug: string): Promise<ApiResponse<ServiceType | null>> {
    try {
      const { data, error } = await supabase()
        .from('service_types')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        return handleError(error);
      }

      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },
};

/**
 * Serviço de Configurações de Formulário
 * @description Operações relacionadas à configuração dinâmica de formulários
 */
export const formConfigService = {
  /**
   * Busca configuração completa de formulário por estado e tipo de serviço
   * @param stateCode - Código do estado (ex: 'SP')
   * @param serviceSlug - Slug do serviço (ex: 'renovacao-passaporte')
   * @param useCache - Se deve usar cache (default: true)
   * @returns Promise com FormConfigurationWithSections ou erro
   */
  async getFormConfig(
    stateCode: string,
    serviceSlug: string,
    useCache: boolean = false
  ): Promise<ApiResponse<FormConfigurationWithSections | null>> {
    try {
      // Verificar cache
      const cacheKey = `${stateCode}:${serviceSlug}`;
      if (useCache && formConfigCache.has(cacheKey)) {
        const cached = formConfigCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          return {
            data: cached.data,
            error: null,
          };
        } else {
          formConfigCache.delete(cacheKey);
        }
      }

      // Buscar estado e tipo de serviço
      const [stateResult, serviceResult] = await Promise.all([
        statesService.getByCode(stateCode),
        serviceTypesService.getBySlug(serviceSlug),
      ]);

      if (stateResult.error || !stateResult.data) {
        return {
          data: null,
          error: stateResult.error || { message: 'Estado não encontrado' },
        };
      }

      if (serviceResult.error || !serviceResult.data) {
        return {
          data: null,
          error: serviceResult.error || { message: 'Tipo de serviço não encontrado' },
        };
      }

      // Buscar configuração do formulário
      const { data: config, error: configError } = await supabase()
        .from('form_configurations')
        .select('*')
        .eq('state_id', stateResult.data.id)
        .eq('service_type_id', serviceResult.data.id)
        .eq('is_active', true)
        .or('valid_until.is.null,valid_until.gt.now()')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (configError) {
        return handleError(configError);
      }

      if (!config) {
        return {
          data: null,
          error: { message: 'Configuração de formulário não encontrada' },
        };
      }

      // Buscar seções com campos
      const { data: sections, error: sectionsError } = await supabase()
        .from('form_sections')
        .select(`
          *,
          form_fields!form_fields_section_id_fkey (
            *,
            field_options (*),
            field_validations (*)
          )
        `)
        .eq('form_configuration_id', config.id)
        .order('sort_order');

      if (sectionsError) {
        return handleError(sectionsError);
      }

      // Montar objeto completo
      const completeConfig: FormConfigurationWithSections = {
        ...config,
        state: stateResult.data,
        service_type: serviceResult.data,
        sections: (sections || []).map(section => ({
          ...section,
          fields: (section.form_fields || [])
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((field: any) => ({
              ...field,
              // Mapear nomes do Supabase para os tipos TypeScript
              options: field.field_options || [],
              validations: field.field_validations || [],
            })),
        })),
      };

      // Salvar no cache
      if (useCache) {
        formConfigCache.set(cacheKey, {
          data: completeConfig,
          timestamp: Date.now(),
        });
      }

      return {
        data: completeConfig,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Busca configuração por ID
   * @param configId - ID da configuração
   * @returns Promise com FormConfiguration ou erro
   */
  async getById(configId: string): Promise<ApiResponse<FormConfiguration | null>> {
    try {
      const { data, error } = await supabase()
        .from('form_configurations')
        .select('*')
        .eq('id', configId)
        .single();

      if (error) {
        return handleError(error);
      }

      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Limpa o cache de configurações
   */
  clearCache(): void {
    formConfigCache.clear();
  },

  /**
   * Remove uma configuração específica do cache
   * @param stateCode - Código do estado
   * @param serviceSlug - Slug do serviço
   */
  removeFromCache(stateCode: string, serviceSlug: string): void {
    const cacheKey = `${stateCode}:${serviceSlug}`;
    formConfigCache.delete(cacheKey);
  },
};

/**
 * Serviço de Submissão de Formulário
 * @description Operações relacionadas à submissão de formulários
 */
export const formSubmissionService = {
  /**
   * Cria uma nova submissão de formulário
   * @param data - Dados da submissão
   * @returns Promise com FormSubmission ou erro
   */
  async create(data: FormSubmissionInsert): Promise<ApiResponse<FormSubmission>> {
    try {
      // Gerar submission_id único se não fornecido
      const submissionData = {
        ...data,
        submission_id: data.submission_id || `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      };

      const { data: result, error } = await supabase()
        .from('form_submissions')
        .insert(submissionData)
        .select()
        .single();

      if (error) {
        return handleError(error);
      }

      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Atualiza uma submissão existente
   * @param id - ID da submissão
   * @param data - Dados para atualizar
   * @returns Promise com FormSubmission ou erro
   */
  async update(id: string, data: FormSubmissionUpdate): Promise<ApiResponse<FormSubmission | null>> {
    try {
      const { data: result, error } = await supabase()
        .from('form_submissions')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return handleError(error);
      }

      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Busca submissão por submission_id
   * @param submissionId - ID público da submissão
   * @returns Promise com FormSubmission ou erro
   */
  async getBySubmissionId(submissionId: string): Promise<ApiResponse<FormSubmission | null>> {
    try {
      const { data, error } = await supabase()
        .from('form_submissions')
        .select('*')
        .eq('submission_id', submissionId)
        .single();

      if (error) {
        return handleError(error);
      }

      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Atualiza o status de uma submissão
   * @param id - ID da submissão
   * @param status - Novo status
   * @returns Promise com FormSubmission ou erro
   */
  async updateStatus(
    id: string,
    status: FormSubmission['status']
  ): Promise<ApiResponse<FormSubmission | null>> {
    return this.update(id, { status });
  },
};

export default statsService;