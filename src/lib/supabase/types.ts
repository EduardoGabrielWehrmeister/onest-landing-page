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
export type DatabaseTable = 'services_done' | 'agendamentos';

/**
 * Estrutura da tabela agendamentos
 * @description Armazena agendamentos para integração com bot de processamento
 */
export interface Agendamento {
  id: string;
  // Dados do Titular (Prenotami)
  email: string;
  senha: string;
  cor_olhos: string;
  altura_cm: number;
  endereco: string;
  estado_civil: string;
  qtde_filhos: number;
  tipo_reserva: string;
  // Quantidade de requerentes adicionais
  qtde_requerentes_adicionais: number;
  // Requerente Adicional 1
  adic_1_sobrenome: string | null;
  adic_1_nome: string | null;
  adic_1_nascimento: string | null;
  adic_1_altura_cm: number | null;
  adic_1_cor_olhos: string | null;
  // Requerente Adicional 2
  adic_2_sobrenome: string | null;
  adic_2_nome: string | null;
  adic_2_nascimento: string | null;
  adic_2_altura_cm: number | null;
  adic_2_cor_olhos: string | null;
  // Requerente Adicional 3
  adic_3_sobrenome: string | null;
  adic_3_nome: string | null;
  adic_3_nascimento: string | null;
  adic_3_altura_cm: number | null;
  adic_3_cor_olhos: string | null;
  // Observações
  anotacoes: string | null;
  // Campos do Bot
  email_otp: string | null;
  senha_email_otp: string | null;
  data_inicio_restricao: string | null;
  data_fim_restricao: string | null;
  data_alvo: string | null;
  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Estrutura para inserir novos agendamentos
 * @description Campos necessários para criar um novo agendamento
 */
export type AgendamentoInsert = Omit<Agendamento, 'id' | 'created_at' | 'updated_at'>;

/**
 * Operações de consulta
 */
export type QueryOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in';