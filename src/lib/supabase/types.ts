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
export type DatabaseTable = 'services_done' | 'states' | 'service_types' | 'form_configurations' | 'form_sections' | 'form_fields' | 'field_options' | 'field_validations' | 'conditional_fields' | 'form_submissions';

// ============================================================================
// DYNAMIC FORMS TYPES
// ============================================================================

/**
 * Estados brasileiros
 */
export interface State {
  id: string;
  code: string; // 'SP', 'RJ', 'MG', etc.
  name: string; // 'São Paulo', 'Rio de Janeiro', etc.
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Tipos de serviço disponíveis
 */
export interface ServiceType {
  id: string;
  slug: string; // URL-friendly identifier (ex: 'renovacao-passaporte')
  name: string; // Display name
  description?: string;
  requires_assessor_option: boolean; // If assessors can provide this service
  is_active: boolean;
  sort_order: number; // Display order
  created_at: string;
  updated_at: string;
}

/**
 * Configuração de formulário (Estado + Tipo de Serviço)
 */
export interface FormConfiguration {
  id: string;
  state_id: string;
  service_type_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  allow_assessor: boolean;
  max_requerentes_adicionais: number;
  allow_date_restrictions: boolean;
  observations_max_length: number;
  version: number;
  valid_from: string;
  valid_until?: string; // NULL = no expiration
  created_at: string;
  updated_at: string;
}

/**
 * Seções do formulário (steps/sections)
 */
export interface FormSection {
  id: string;
  form_configuration_id: string;
  slug: string; // URL-friendly section identifier
  title: string;
  description?: string;
  icon_name?: string; // Lucide icon name
  sort_order: number;
  is_conditional: boolean;
  depends_on_field_id?: string; // Field that controls visibility
  depends_on_value?: string; // Value that makes this section visible
  created_at: string;
  updated_at: string;
}

/**
 * Tipos de campos suportados
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'phone'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file'
  | 'address_autocomplete'
  | 'calendar_multiple';

/**
 * Campo individual do formulário
 */
export interface FormField {
  id: string;
  section_id: string;
  field_key: string; // Unique key within form (ex: 'clienteNome', 'prenotamiEmail')
  field_type: FieldType;
  label: string;
  placeholder?: string;
  help_text?: string;
  tooltip_text?: string;
  is_required: boolean;
  is_conditional: boolean;
  depends_on_field_id?: string; // Self-reference
  depends_on_value?: string;
  depends_on_operator: 'equals' | 'not_equals' | 'contains' | 'in';
  sort_order: number;
  grid_columns: number; // 1-12 (CSS grid)
  grid_md_columns?: number; // Medium breakpoint
  max_length?: number;
  min_value?: number;
  max_value?: number;
  input_mask?: string; // Format mask (ex: '(XX) XXXXX-XXXX')
  is_uppercase: boolean;
  show_toggle_visibility?: boolean; // For passwords
  file_types?: string[]; // MIME types
  max_file_size_mb?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Tipos de validação de campo
 */
export type ValidationType =
  | 'pattern'
  | 'min_length'
  | 'max_length'
  | 'email'
  | 'phone'
  | 'cep'
  | 'custom';

/**
 * Regra de validação para um campo
 */
export interface FieldValidation {
  id: string;
  field_id: string;
  validation_type: ValidationType;
  validation_value?: string; // Regex pattern, number, or custom function name
  error_message: string;
  created_at: string;
}

/**
 * Opção para campos select/radio
 */
export interface FieldOption {
  id: string;
  field_id: string;
  value: string; // Internal value
  label: string; // Display label
  sort_order: number;
  is_default: boolean;
  created_at: string;
}

/**
 * Operadores condicionais
 */
export type ConditionalOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'in'
  | 'not_in'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty';

/**
 * Lógica condicional para campos
 */
export interface ConditionalField {
  id: string;
  target_field_id: string; // Field to show/hide
  trigger_field_id: string; // Field that triggers the condition
  operator: ConditionalOperator;
  trigger_value?: string; // Value to compare against
  logical_operator: 'AND' | 'OR'; // For chaining multiple conditions
  sort_order: number;
  created_at: string;
}

/**
 * Status de submissão de formulário
 */
export type SubmissionStatus = 'draft' | 'submitted' | 'processing' | 'completed' | 'cancelled';

/**
 * Submissão de formulário
 */
export interface FormSubmission {
  id: string;
  form_configuration_id: string;
  submission_id: string;
  user_type: 'cliente' | 'assessor';
  assessor_nome?: string;
  assessor_email?: string;
  assessor_telefone?: string;
  titular_data: Record<string, any>; // JSONB com dados do titular
  requerentes_adicionais: Array<{
    nomeCompleto: string;
    dataNascimento: string;
    altura: string;
    corOlhos: string;
    documentoIdentidade: string;
  }>;
  datas_restricao: string[];
  observacoes?: string;
  status: SubmissionStatus;
  prenotami_submission_id?: string;
  prenotami_status?: string;
  prenotami_response?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// COMPOSITE TYPES (WITH RELATIONS)
// ============================================================================

/**
 * Campo com suas opções e validações
 */
export interface FormFieldWithOptions extends FormField {
  options?: FieldOption[];
  validations?: FieldValidation[];
  conditional_rules?: ConditionalField[];
}

/**
 * Seção com seus campos
 */
export interface FormSectionWithFields extends FormSection {
  fields: FormFieldWithOptions[];
}

/**
 * Configuração de formulário completa com seções
 */
export interface FormConfigurationWithSections extends FormConfiguration {
  state: State;
  service_type: ServiceType;
  sections: FormSectionWithFields[];
}

/**
 * Dados para criar nova configuração de formulário
 */
export type FormConfigurationInsert = Omit<FormConfiguration, 'id' | 'created_at' | 'updated_at'>;

/**
 * Dados para atualizar configuração de formulário
 */
export type FormConfigurationUpdate = Partial<Pick<FormConfiguration,
  'name' | 'description' | 'is_active' | 'allow_assessor' |
  'max_requerentes_adicionais' | 'allow_date_restrictions' |
  'observations_max_length' | 'version' | 'valid_from' | 'valid_until'
>>;

/**
 * Dados para criar nova submissão
 */
export type FormSubmissionInsert = Omit<FormSubmission, 'id' | 'created_at' | 'updated_at'>;

/**
 * Dados para atualizar submissão
 */
export type FormSubmissionUpdate = Partial<Pick<FormSubmission,
  'status' | 'prenotami_submission_id' | 'prenotami_status' |
  'prenotami_response' | 'submitted_at'
>>;

// ============================================================================
// FORM DATA TYPES (para uso no frontend)
// ============================================================================

/**
 * Valor de um campo do formulário (pode ser string, número, array, etc.)
 */
export type FormFieldValue = string | number | string[] | boolean | null | undefined;

/**
 * Objeto com valores dos campos do formulário
 */
export type FormFieldsData = Record<string, FormFieldValue>;

/**
 * Operações de consulta
 */
export type QueryOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in';