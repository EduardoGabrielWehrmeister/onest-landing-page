/**
 * Serviço Base para Supabase
 * @description Fornece métodos reutilizáveis para operações com o banco de dados
 */

import { supabase } from '@/lib/supabase/client';
import type { ServicesDone, StatsFilters, ApiResponse } from '@/lib/supabase/types';

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

export default statsService;