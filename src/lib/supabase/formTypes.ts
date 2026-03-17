/**
 * Dynamic Form System Type Definitions
 *
 * These types define the structure for database-driven forms.
 * Forms are loaded from the database based on state + service type + user type.
 */

// ============================================================================
// Complete Form Configuration
// ============================================================================

export interface FormConfigurationComplete {
  configuration: FormConfiguration;
  sections: FormSectionComplete[];
}

export interface FormSectionComplete {
  section: FormSection;
  fields: FormFieldComplete[];
}

export interface FormFieldComplete {
  field: FormField;
  options?: FieldOption[];
  validations?: FieldValidation[];
}

// ============================================================================
// Core Form Tables
// ============================================================================

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
  user_type: 'cliente' | 'assessor' | 'ambos';
  version: number;
  valid_from: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSection {
  id: string;
  form_configuration_id: string;
  slug: string;
  title: string;
  description?: string;
  icon_name?: string;
  sort_order: number;
  is_conditional: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormField {
  id: string;
  section_id: string;
  field_key: string;
  field_type: FieldType;
  label: string;
  placeholder?: string;
  help_text?: string;
  tooltip_text?: string;
  is_required: boolean;
  is_conditional: boolean;
  sort_order: number;
  grid_columns: number;
  grid_md_columns?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  input_mask?: string;
  is_uppercase: boolean;
  show_toggle_visibility: boolean;
  file_types?: string[];
  max_file_size_mb?: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Field Types
// ============================================================================

export interface RequerenteData {
  nomeCompleto: string;
  dataNascimento: string;
  altura: string;
  corOlhos: "azul" | "castanho" | "cinza" | "preto" | "verde" | "";
  documentoIdentidade: File | null;
}

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
  | 'calendar_multiple'
  | 'requerentes_adicionais';

// ============================================================================
// Field Options (for select/radio/checkbox)
// ============================================================================

export interface FieldOption {
  id: string;
  field_id: string;
  value: string;
  label: string;
  sort_order: number;
  is_default: boolean;
  created_at: string;
}

// ============================================================================
// Field Validations
// ============================================================================

export interface FieldValidation {
  id: string;
  field_id: string;
  validation_type: ValidationType;
  validation_value?: string;
  error_message: string;
  created_at: string;
}

export type ValidationType =
  | 'pattern'
  | 'min_length'
  | 'max_length'
  | 'email'
  | 'phone'
  | 'cep'
  | 'custom';

// ============================================================================
// Form Submission
// ============================================================================

export interface FormSubmissionData {
  form_configuration_id: string;
  submission_id: string;
  user_type: 'cliente' | 'assessor';
  assessor_nome?: string;
  assessor_email?: string;
  assessor_telefone?: string;
  titular_data: Record<string, any>;
  requerentes_adicionais: Record<string, any>[];
  datas_restricao: string[];
  observacoes?: string;
  status: 'draft' | 'submitted' | 'processing' | 'completed' | 'cancelled';
  prenotami_submission_id?: string;
  prenotami_status?: string;
  prenotami_response?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  submitted_at?: string;
}

// ============================================================================
// Reference Data (States and Service Types)
// ============================================================================

export interface State {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceType {
  id: string;
  slug: string;
  name: string;
  description?: string;
  requires_assessor_option: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: any;
}

// ============================================================================
// Form Field Props (for React components)
// ============================================================================

export interface FormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  options?: FieldOption[];
  disabled?: boolean;
}
