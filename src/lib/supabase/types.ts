/**
 * Tipos TypeScript para o Supabase
 * Baseados na tabela services_done
 */

/**
 * Estrutura da tabela services_done
 * @description Armazena estatísticas de serviços realizados por ano
 */
export interface ServicesDone {
  id: number;
  outros: number | null;
  passaporte: number | null;
  cidadania_fila: number | null;
  identidade: number | null;
  cidadania_menores: number | null;
  updated_at: string;
  total: number | null; // Coluna calculada
  comments: string | null;
  total_prenotami: number | null; // Coluna calculada
  year: number;
}

/**
 * Estrutura para inserir novos dados em services_done
 * @description Campos necessários para criar um novo registro
 */
export type ServicesDoneInsert = Omit<ServicesDone, 'id' | 'updated_at' | 'total' | 'total_prenotami'>;

/**
 * Estrutura para atualizar dados em services_done
 * @description Campos que podem ser atualizados
 */
export type ServicesDoneUpdate = Partial<Pick<ServicesDone, 
  'outros' | 
  'passaporte' | 
  'cidadania_fila' | 
  'identidade' | 
  'cidadania_menores' | 
  'comments'
>>;

/**
 * Filtros para busca de estatísticas
 */
export interface StatsFilters {
  year?: number;
  limit?: number;
}

/**
 * Estrutura para exibir estatísticas no componente Stats
 * @description Formato padronizado para exibir estatísticas na UI
 */
export interface StatDisplay {
  value: number;
  suffix?: string;
  label: string;
}

/**
 * Resposta de erro da API
 */
export interface ApiError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

/**
 * Tipo para resposta da API com tratamento de erro
 */
export type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

/**
 * Configurações do cliente Supabase
 */
export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Tabelas disponíveis no banco de dados
 */
export type DatabaseTable = 'services_done';

/**
 * Operações de consulta
 */
export type QueryOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in';