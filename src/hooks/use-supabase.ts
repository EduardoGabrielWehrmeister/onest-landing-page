/**
 * Hook personalizado para operações com Supabase
 * @description Gerencia estados de loading, data e error para queries do Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { statsService, connectionService } from '@/services/base.service';
import type { ServicesDone, StatsFilters } from '@/lib/supabase/types';

/**
 * Estado do hook useSupabase para dados de estatísticas
 */
interface UseSupabaseState {
  data: ServicesDone | ServicesDone[] | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

/**
 * Estado do hook useSupabase para valores numéricos (totais acumulados)
 */
interface UseNumberState {
  data: number | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

/**
 * Hook para buscar estatísticas do Supabase
 * @param fetchFunction - Função de fetch a ser executada
 * @param deps - Dependências para re-executar a busca
 * @returns Estado com data, loading, error e isConnected
 * 
 * @example
 * ```tsx
 * // Buscar estatísticas mais recentes
 * const { data, loading, error, isConnected } = useSupabase(
 *   () => statsService.getLatest()
 * );
 * 
 * // Buscar por ano específico
 * const { data, loading, error } = useSupabase(
 *   () => statsService.getByYear(2025)
 * );
 * ```
 */
export const useSupabase = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchFunction?: () => Promise<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] = []
): UseSupabaseState => {
  const [state, setState] = useState<UseSupabaseState>({
    data: null,
    loading: !!fetchFunction,
    error: null,
    isConnected: connectionService.isConfigured(),
  });

  const fetchData = useCallback(async () => {
    if (!fetchFunction || !state.isConnected) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      
      const response = await fetchFunction();
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      setState({
        data: response.data,
        loading: false,
        error: null,
        isConnected: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar dados';
      console.error('Erro no useSupabase:', errorMessage);
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        isConnected: state.isConnected,
      });
    }
  }, [fetchFunction, state.isConnected]);

  useEffect(() => {
    fetchData();
  }, [...deps]);

  return state;
};

/**
 * Hook específico para estatísticas mais recentes
 * @returns Estado com data, loading, error e isConnected
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useLatestStats();
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * if (!data) return null;
 * 
 * return <StatsDisplay data={data} />;
 * ```
 */
export const useLatestStats = (): UseSupabaseState => {
  return useSupabase(() => statsService.getLatest());
};

/**
 * Hook para buscar estatísticas por ano
 * @param year - Ano para filtrar
 * @returns Estado com data, loading, error e isConnected
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useStatsByYear(2025);
 * ```
 */
export const useStatsByYear = (year: number): UseSupabaseState => {
  return useSupabase(
    () => statsService.getByYear(year),
    [year]
  );
};

/**
 * Hook para buscar todas as estatísticas
 * @returns Estado com data (array), loading, error e isConnected
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useAllStats();
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * 
 * return (
 *   <ul>
 *     {data?.map((stat) => (
 *       <li key={stat.year}>{stat.year}: {stat.total}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export const useAllStats = (): UseSupabaseState => {
  return useSupabase(() => statsService.getAll());
};

/**
 * Hook para buscar estatísticas com filtros personalizados
 * @param filters - Filtros para aplicar na busca
 * @returns Estado com data (array), loading, error e isConnected
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useStatsWithFilters({
 *   year: 2025,
 *   limit: 10
 * });
 * ```
 */
export const useStatsWithFilters = (filters: StatsFilters = {}): UseSupabaseState => {
  return useSupabase(
    () => statsService.getWithFilters(filters),
    [filters.year, filters.limit]
  );
};

/**
 * Hook genérico para buscar valores numéricos do Supabase
 * @param fetchFunction - Função de fetch que retorna Promise<ApiResponse<number>>
 * @returns Estado com data (número), loading, error e isConnected
 */
const useSupabaseNumber = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchFunction: () => Promise<{ data: number | null; error: any }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] = []
): UseNumberState => {
  const [state, setState] = useState<UseNumberState>({
    data: null,
    loading: true,
    error: null,
    isConnected: connectionService.isConfigured(),
  });

  const fetchData = useCallback(async () => {
    if (!state.isConnected) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      
      const response = await fetchFunction();
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      setState({
        data: response.data,
        loading: false,
        error: null,
        isConnected: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar dados';
      console.error('Erro no useSupabaseNumber:', errorMessage);
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        isConnected: state.isConnected,
      });
    }
  }, [fetchFunction, state.isConnected]);

  useEffect(() => {
    fetchData();
  }, [...deps]);

  return state;
};

/**
 * Hook para buscar o total acumulado de clientes atendidos
 * @returns Estado com data (número total), loading e error
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useTotalAccumulated();
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * 
 * return <p>Total: {data}+ Clientes Atendidos</p>;
 * ```
 */
export const useTotalAccumulated = (): UseNumberState => {
  return useSupabaseNumber(() => statsService.getTotalAccumulated());
};

/**
 * Hook para buscar o total acumulado de agendamentos no Prenotami
 * @returns Estado com data (número total), loading e error
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = usePrenotamiAccumulated();
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * 
 * return <p>Agendamentos: {data}+ Prenotami</p>;
 * ```
 */
export const usePrenotamiAccumulated = (): UseNumberState => {
  return useSupabaseNumber(() => statsService.getPrenotamiAccumulated());
};

/**
 * Hook para testar conexão com Supabase
 * @returns Estado com isConnected, loading e error
 * 
 * @example
 * ```tsx
 * const { isConnected, loading, error } = useConnectionTest();
 * 
 * if (loading) return <p>Testando conexão...</p>;
 * if (!isConnected) return <p>Erro: {error}</p>;
 * if (isConnected) return <p>✅ Conectado ao Supabase</p>;
 * ```
 */
export const useConnectionTest = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true);
        const result = await connectionService.test();
        setIsConnected(result);
        setError(null);
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return { isConnected, loading, error };
};

/**
 * Hook para testar permissão de escrita da chave pública
 * @returns Estado com testResult, loading e error
 * 
 * @example
 * ```tsx
 * const { testResult, loading, runTest } = useWritePermissionTest();
 * 
 * return (
 *   <button onClick={runTest} disabled={loading}>
 *     Testar Permissão
 *   </button>
 *   {testResult && <p>{testResult.message}</p>}
 * );
 * ```
 */
export const useWritePermissionTest = () => {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runTest = async () => {
    try {
      setLoading(true);
      const result = await connectionService.testWritePermission();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Erro ao testar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return { testResult, loading, runTest };
};

export default useSupabase;
