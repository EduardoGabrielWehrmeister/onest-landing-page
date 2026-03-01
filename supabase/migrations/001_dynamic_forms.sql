-- ============================================================================
-- Migration: Dynamic Forms System
-- Description: Schema para formulários dinâmicos configurados via banco
-- Autor: Claude Code
-- Data: 2026-03-01
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE: states
-- Tabela de estados brasileiros
-- ============================================================================
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constraints
ALTER TABLE states ADD CONSTRAINT chk_state_code_length CHECK (char_length(code) = 2);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_states_code ON states(code);
CREATE INDEX IF NOT EXISTS idx_states_active ON states(is_active);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_states_updated_at BEFORE UPDATE ON states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: service_types
-- Tabela de tipos de serviço (ex: Renovação Passaporte, Cidadania Italiana)
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  requires_assessor_option BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_types_slug ON service_types(slug);
CREATE INDEX IF NOT EXISTS idx_service_types_active ON service_types(is_active);
CREATE INDEX IF NOT EXISTS idx_service_types_sort ON service_types(sort_order);

-- Trigger for updated_at
CREATE TRIGGER update_service_types_updated_at BEFORE UPDATE ON service_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: form_configurations
-- Configuração principal de formulário (Estado + Tipo de Serviço)
-- ============================================================================
CREATE TABLE IF NOT EXISTS form_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  service_type_id UUID NOT NULL REFERENCES service_types(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  allow_assessor BOOLEAN DEFAULT true,
  max_requerentes_adicionais INTEGER DEFAULT 3,
  allow_date_restrictions BOOLEAN DEFAULT true,
  observations_max_length INTEGER DEFAULT 100,
  version INTEGER DEFAULT 1,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(state_id, service_type_id, valid_until)
);

-- Constraints
ALTER TABLE form_configurations ADD CONSTRAINT chk_valid_dates
  CHECK (valid_until IS NULL OR valid_until > valid_from);
ALTER TABLE form_configurations ADD CONSTRAINT chk_max_requerentes
  CHECK (max_requerentes_adicionais BETWEEN 0 AND 10);
ALTER TABLE form_configurations ADD CONSTRAINT chk_observations_length
  CHECK (observations_max_length BETWEEN 0 AND 1000);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_form_configs_state ON form_configurations(state_id);
CREATE INDEX IF NOT EXISTS idx_form_configs_service ON form_configurations(service_type_id);
CREATE INDEX IF NOT EXISTS idx_form_configs_active ON form_configurations(is_active, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_form_configs_state_service ON form_configurations(state_id, service_type_id);

-- Trigger for updated_at
CREATE TRIGGER update_form_configurations_updated_at BEFORE UPDATE ON form_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: form_sections
-- Seções do formulário (steps: tipo-usuario, assessor, titular, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS form_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_configuration_id UUID NOT NULL REFERENCES form_configurations(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  sort_order INTEGER NOT NULL,
  is_conditional BOOLEAN DEFAULT false,
  depends_on_field_id UUID, -- Foreign key adicionada depois (form_fields ainda não existe)
  depends_on_value VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(form_configuration_id, slug, sort_order)
);

-- Constraints
ALTER TABLE form_sections ADD CONSTRAINT chk_sections_sort_order
  CHECK (sort_order >= 0);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_form_sections_config ON form_sections(form_configuration_id);
CREATE INDEX IF NOT EXISTS idx_form_sections_order ON form_sections(form_configuration_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_form_sections_conditional ON form_sections(is_conditional, depends_on_field_id);

-- Trigger for updated_at
CREATE TRIGGER update_form_sections_updated_at BEFORE UPDATE ON form_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: form_fields
-- Campos individuais do formulário
-- ============================================================================
CREATE TABLE IF NOT EXISTS form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES form_sections(id) ON DELETE CASCADE,
  field_key VARCHAR(100) NOT NULL,
  field_type VARCHAR(50) NOT NULL,
  label VARCHAR(200) NOT NULL,
  placeholder VARCHAR(200),
  help_text TEXT,
  tooltip_text TEXT,
  is_required BOOLEAN DEFAULT false,
  is_conditional BOOLEAN DEFAULT false,
  depends_on_field_id UUID REFERENCES form_fields(id),
  depends_on_value VARCHAR(255),
  depends_on_operator VARCHAR(20) DEFAULT 'equals',
  sort_order INTEGER NOT NULL,
  grid_columns INTEGER DEFAULT 1,
  grid_md_columns INTEGER,
  max_length INTEGER,
  min_value NUMERIC,
  max_value NUMERIC,
  input_mask VARCHAR(100),
  is_uppercase BOOLEAN DEFAULT false,
  show_toggle_visibility BOOLEAN DEFAULT false,
  file_types TEXT[],
  max_file_size_mb INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(section_id, field_key, sort_order)
);

-- Constraints
ALTER TABLE form_fields ADD CONSTRAINT chk_field_type
  CHECK (field_type IN ('text', 'email', 'password', 'phone', 'number',
                        'textarea', 'select', 'radio', 'checkbox',
                        'date', 'file', 'address_autocomplete', 'calendar_multiple'));
ALTER TABLE form_fields ADD CONSTRAINT chk_fields_sort_order
  CHECK (sort_order >= 0);
ALTER TABLE form_fields ADD CONSTRAINT chk_grid_columns
  CHECK (grid_columns BETWEEN 1 AND 12);
ALTER TABLE form_fields ADD CONSTRAINT chk_depends_operator
  CHECK (depends_on_operator IN ('equals', 'not_equals', 'contains', 'in'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_form_fields_section ON form_fields(section_id);
CREATE INDEX IF NOT EXISTS idx_form_fields_order ON form_fields(section_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_form_fields_conditional ON form_fields(is_conditional, depends_on_field_id);
CREATE INDEX IF NOT EXISTS idx_form_fields_type ON form_fields(field_type);

-- Trigger for updated_at
CREATE TRIGGER update_form_fields_updated_at BEFORE UPDATE ON form_fields
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: field_validations
-- Regras de validação para campos
-- ============================================================================
CREATE TABLE IF NOT EXISTS field_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
  validation_type VARCHAR(50) NOT NULL,
  validation_value TEXT,
  error_message VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(field_id, validation_type)
);

-- Constraints
ALTER TABLE field_validations ADD CONSTRAINT chk_validation_type
  CHECK (validation_type IN ('pattern', 'min_length', 'max_length',
                             'email', 'phone', 'cep', 'custom'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_field_validations_field ON field_validations(field_id);

-- ============================================================================
-- TABLE: field_options
-- Opções para campos select/radio/checkbox
-- ============================================================================
CREATE TABLE IF NOT EXISTS field_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
  value VARCHAR(255) NOT NULL,
  label VARCHAR(200) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(field_id, value)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_field_options_field ON field_options(field_id);
CREATE INDEX IF NOT EXISTS idx_field_options_order ON field_options(field_id, sort_order);

-- ============================================================================
-- TABLE: conditional_fields
-- Lógica condicional avançada para campos
-- ============================================================================
CREATE TABLE IF NOT EXISTS conditional_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_field_id UUID NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
  trigger_field_id UUID NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
  operator VARCHAR(20) NOT NULL,
  trigger_value VARCHAR(255),
  logical_operator VARCHAR(10) DEFAULT 'AND',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constraints
ALTER TABLE conditional_fields ADD CONSTRAINT chk_conditional_operator
  CHECK (operator IN ('equals', 'not_equals', 'contains', 'not_contains',
                      'in', 'not_in', 'greater_than', 'less_than',
                      'is_empty', 'is_not_empty'));
ALTER TABLE conditional_fields ADD CONSTRAINT chk_logical_operator
  CHECK (logical_operator IN ('AND', 'OR'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conditional_fields_target ON conditional_fields(target_field_id);
CREATE INDEX IF NOT EXISTS idx_conditional_fields_trigger ON conditional_fields(trigger_field_id);

-- ============================================================================
-- TABLE: form_submissions
-- Armazenamento de submissões de formulário
-- ============================================================================
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_configuration_id UUID NOT NULL REFERENCES form_configurations(id),
  submission_id VARCHAR(100) UNIQUE NOT NULL,

  -- User type
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('cliente', 'assessor')),

  -- Assessor data (if applicable)
  assessor_nome VARCHAR(255),
  assessor_email VARCHAR(255),
  assessor_telefone VARCHAR(20),

  -- Main applicant data (stored as JSONB for flexibility)
  titular_data JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Additional applicants
  requerentes_adicionais JSONB DEFAULT '[]'::jsonb,

  -- Restrictions and observations
  datas_restricao TIMESTAMPTZ[] DEFAULT '{}',
  observacoes TEXT,

  -- Status tracking
  status VARCHAR(30) DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'processing', 'completed', 'cancelled'
  )),

  -- External system integration
  prenotami_submission_id VARCHAR(100),
  prenotami_status VARCHAR(50),
  prenotami_response JSONB,

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_config ON form_submissions(form_configuration_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON form_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_submissions_user_type ON form_submissions(user_type);
CREATE INDEX IF NOT EXISTS idx_submissions_id ON form_submissions(submission_id);

-- Trigger for updated_at
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ADD DEFERRED FOREIGN KEYS (para resolver dependências circulares)
-- ============================================================================

-- Adicionar FK de form_sections.depends_on_field_id → form_fields.id
ALTER TABLE form_sections
  ADD CONSTRAINT fk_form_sections_depends_on_field
  FOREIGN KEY (depends_on_field_id)
  REFERENCES form_fields(id)
  ON DELETE SET NULL;

-- Adicionar FK de form_fields.depends_on_field_id → form_fields.id (self-reference)
ALTER TABLE form_fields
  ADD CONSTRAINT fk_form_fields_depends_on_field
  FOREIGN KEY (depends_on_field_id)
  REFERENCES form_fields(id)
  ON DELETE SET NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE form_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for active configurations
CREATE POLICY "Active configs are publicly readable"
  ON form_configurations FOR SELECT
  USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

-- Public read access for sections, fields, options, validations
CREATE POLICY "Sections are publicly readable"
  ON form_sections FOR SELECT
  USING (true);

CREATE POLICY "Fields are publicly readable"
  ON form_fields FOR SELECT
  USING (true);

CREATE POLICY "Options are publicly readable"
  ON field_options FOR SELECT
  USING (true);

CREATE POLICY "Validations are publicly readable"
  ON field_validations FOR SELECT
  USING (true);

-- Anonymous users can create submissions
CREATE POLICY "Anyone can create submission"
  ON form_submissions FOR INSERT
  WITH CHECK (true);

-- Users can read their own submissions
CREATE POLICY "Users can read own submissions"
  ON form_submissions FOR SELECT
  USING (true);

-- ============================================================================
-- SEED DATA: Estados brasileiros
-- ============================================================================
INSERT INTO states (code, name) VALUES
('SP', 'São Paulo'),
('RJ', 'Rio de Janeiro'),
('MG', 'Minas Gerais'),
('RS', 'Rio Grande do Sul'),
('PR', 'Paraná'),
('SC', 'Santa Catarina'),
('BA', 'Bahia'),
('PE', 'Pernambuco'),
('CE', 'Ceará'),
('GO', 'Goiás'),
('ES', 'Espírito Santo'),
('PB', 'Paraíba'),
('AM', 'Amazonas'),
('RN', 'Rio Grande do Norte'),
('AL', 'Alagoas'),
('MT', 'Mato Grosso'),
('MA', 'Maranhão'),
('PI', 'Piauí'),
('DF', 'Distrito Federal'),
('SE', 'Sergipe'),
('RO', 'Rondônia'),
('TO', 'Tocantins'),
('PA', 'Pará'),
('AP', 'Amapá'),
('AC', 'Acre'),
('RR', 'Roraima'),
('MS', 'Mato Grosso do Sul')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- SEED DATA: Tipos de serviço
-- ============================================================================
INSERT INTO service_types (slug, name, description, requires_assessor_option, sort_order) VALUES
('renovacao-passaporte', 'Renovação de Passaporte', 'Renovação de passaporte brasileiro', true, 1),
('cidadania-italiana', 'Cidadania Italiana', 'Reconhecimento de cidadania italiana', true, 2),
('identidade', 'Emissão de Identidade', 'Primeira emissão de RG', false, 3),
('cidadania-menores', 'Cidadania Italiana - Menores', 'Reconhecimento para menores de 18 anos', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- VIEWS: Para facilitar consultas
-- ============================================================================

-- View: Configurações completas com estado e serviço
CREATE OR REPLACE VIEW v_form_configurations_complete AS
SELECT
  fc.*,
  s.code as state_code,
  s.name as state_name,
  st.slug as service_type_slug,
  st.name as service_type_name
FROM form_configurations fc
JOIN states s ON fc.state_id = s.id
JOIN service_types st ON fc.service_type_id = st.id;

-- View: Campos com opções e validações
CREATE OR REPLACE VIEW v_form_fields_complete AS
SELECT
  f.*,
  fs.form_configuration_id,
  fs.slug as section_slug,
  fs.title as section_title,
  fs.sort_order as section_sort_order
FROM form_fields f
JOIN form_sections fs ON f.section_id = fs.id;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
