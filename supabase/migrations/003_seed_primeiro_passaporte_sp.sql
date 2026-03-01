-- ============================================================================
-- Migration: Seed Data - Primeiro Passaporte Italiano - São Paulo
-- Description: Ficha para Assessores - Agendamento do Primeiro Passaporte Italiano SP
-- Autor: Claude Code
-- Data: 2026-03-01
-- ============================================================================

-- Inserir novo tipo de serviço se não existir
INSERT INTO service_types (slug, name, description, requires_assessor_option, sort_order)
VALUES
('primeiro-passaporte-italiano', 'Primeiro Passaporte Italiano', 'Ficha para Assessores - Agendamento do Primeiro Passaporte Italiano', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- CRIAR CONFIGURAÇÃO DE FORMULÁRIO
-- ============================================================================

WITH sp_state AS (
  SELECT id FROM states WHERE code = 'SP' LIMIT 1
),
passaporte_service AS (
  SELECT id FROM service_types WHERE slug = 'primeiro-passaporte-italiano' LIMIT 1
),
form_config AS (
  INSERT INTO form_configurations (
    state_id,
    service_type_id,
    name,
    description,
    is_active,
    allow_assessor,
    max_requerentes_adicionais,
    allow_date_restrictions,
    observations_max_length,
    version
  )
  SELECT
    sp_state.id,
    passaporte_service.id,
    'Primeiro Passaporte Italiano - São Paulo',
    'Ficha para Assessores - Agendamento do Primeiro Passaporte Italiano',
    true,
    true,
    3,
    true,
    100,
    1
  FROM sp_state, passaporte_service
  RETURNING *
),
-- ============================================================================
-- SEÇÃO 1: TIPO DE USUÁRIO
-- ============================================================================
section_tipo AS (
  INSERT INTO form_sections (form_configuration_id, slug, title, description, icon_name, sort_order)
  SELECT id, 'tipo-usuario', 'Tipo de Usuário', 'Selecione como deseja prosseguir', 'user', 1
  FROM form_config
  RETURNING *
),
field_tipo_usuario AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label,
    is_required, sort_order, grid_columns
  )
  SELECT id, 'tipoUsuario', 'radio', 'Tipo de Usuário', true, 1, 12
  FROM section_tipo
  RETURNING *
),
options_tipo_usuario AS (
  INSERT INTO field_options (field_id, value, label, sort_order, is_default)
  SELECT id, 'cliente', 'Cliente', 1, true FROM field_tipo_usuario
  UNION ALL
  SELECT id, 'assessor', 'Assessor', 2, false FROM field_tipo_usuario
),
-- ============================================================================
-- SEÇÃO 2: DADOS DO ASSESSOR (CONDICIONAL)
-- ============================================================================
section_assessor AS (
  INSERT INTO form_sections (
    form_configuration_id, slug, title, description, icon_name,
    sort_order, is_conditional, depends_on_value
  )
  SELECT
    fc.id,
    'assessor',
    'Dados do Assessor',
    'Informe seus dados de contato profissional',
    'briefcase',
    2,
    true,
    'assessor'
  FROM form_config fc
  RETURNING *
),
field_assessor_nome AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder, help_text,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'assessorNome',
    'text',
    'Nome / Empresa',
    'Ex: João Silva - Turismo Brasil',
    'Informe o nome completo ou nome da empresa',
    true,
    1,
    12
  FROM section_assessor
  RETURNING *
),
field_assessor_email AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder, help_text,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'assessorEmail',
    'email',
    'Email',
    'Ex: joao.silva@gmail.com',
    'Email para contato profissional',
    true,
    2,
    12
  FROM section_assessor
  RETURNING *
),
validation_assessor_email AS (
  INSERT INTO field_validations (field_id, validation_type, error_message)
  SELECT id, 'email', 'Email inválido. Insira um endereço válido.'
  FROM field_assessor_email
),
field_assessor_telefone AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder,
    is_required, sort_order, grid_columns, max_length, input_mask
  )
  SELECT
    id,
    'assessorTelefone',
    'phone',
    'Telefone',
    'Ex: (11) 98765-4321',
    true,
    3,
    12,
    15,
    '(XX) XXXXX-XXXX'
  FROM section_assessor
  RETURNING *
),
validation_assessor_telefone AS (
  INSERT INTO field_validations (field_id, validation_type, error_message)
  SELECT id, 'phone', 'Telefone inválido. Deve conter 10 ou 11 dígitos.'
  FROM field_assessor_telefone
),
-- ============================================================================
-- SEÇÃO 3: DADOS DO TITULAR
-- ============================================================================
section_titular AS (
  INSERT INTO form_sections (
    form_configuration_id, slug, title, description, icon_name, sort_order
  )
  SELECT id, 'titular', 'Dados do Titular', 'Informações pessoais e credenciais de acesso', 'user', 3
  FROM form_config
  RETURNING *
),
field_cliente_nome AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder, help_text,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'clienteNome',
    'text',
    'Nome completo',
    'Ex: Maria da Silva Santos',
    'Informe o nome completo do titular da conta Prenotami',
    true,
    1,
    12
  FROM section_titular
  RETURNING *
),
field_prenotami_email AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder, help_text,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'prenotamiEmail',
    'email',
    'Email Prenotami',
    'Ex: maria.santos@gmail.com',
    'Informe o email do titular da conta Prenotami',
    true,
    2,
    12
  FROM section_titular
  RETURNING *
),
validation_prenotami_email AS (
  INSERT INTO field_validations (field_id, validation_type, error_message)
  SELECT id, 'email', 'Email inválido. Insira um endereço de email válido.'
  FROM field_prenotami_email
),
field_prenotami_senha AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder, help_text,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'prenotamiSenha',
    'password',
    'Senha Prenotami',
    'Ex: SuaSenha123',
    'Informe a senha do titular da conta Prenotami',
    true,
    3,
    12
  FROM section_titular
  RETURNING *
),
field_titular_cep AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder, help_text,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'titularCep',
    'address_autocomplete',
    'CEP',
    'Ex: 05410001',
    'Apenas números (8 dígitos)',
    true,
    4,
    6
  FROM section_titular
  RETURNING *
),
validation_titular_cep AS (
  INSERT INTO field_validations (field_id, validation_type, error_message)
  SELECT id, 'cep', 'CEP inválido. Deve conter 8 dígitos.'
  FROM field_titular_cep
),
field_titular_logradouro AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder,
    is_required, sort_order, grid_columns, grid_md_columns
  )
  SELECT
    id,
    'titularLogradouro',
    'text',
    'Rua / Avenida',
    'Ex: Av. Paulista',
    true,
    5,
    12,
    8
  FROM section_titular
  RETURNING *
),
field_titular_numero AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder,
    is_required, sort_order, grid_columns, grid_md_columns
  )
  SELECT
    id,
    'titularNumero',
    'text',
    'Número',
    'Ex: 1000',
    false,
    6,
    6,
    4
  FROM section_titular
  RETURNING *
),
field_titular_complemento AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder,
    is_required, sort_order, grid_columns, grid_md_columns
  )
  SELECT
    id,
    'titularComplemento',
    'text',
    'Complemento',
    'Ex: Apto 101',
    false,
    7,
    6,
    4
  FROM section_titular
  RETURNING *
),
field_titular_bairro AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder,
    is_required, sort_order, grid_columns, grid_md_columns
  )
  SELECT
    id,
    'titularBairro',
    'text',
    'Bairro',
    'Ex: Bela Vista',
    true,
    8,
    6,
    4
  FROM section_titular
  RETURNING *
),
field_titular_cidade AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder,
    is_required, sort_order, grid_columns, grid_md_columns
  )
  SELECT
    id,
    'titularCidade',
    'text',
    'Cidade',
    'Ex: São Paulo',
    true,
    9,
    6,
    4
  FROM section_titular
  RETURNING *
),
field_titular_estado AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder,
    is_required, sort_order, grid_columns, grid_md_columns, max_length, is_uppercase
  )
  SELECT
    id,
    'titularEstado',
    'text',
    'Estado',
    'Ex: SP',
    true,
    10,
    6,
    4,
    2,
    true
  FROM section_titular
  RETURNING *
),
field_titular_estado_civil AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, help_text,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'titularEstadoCivil',
    'select',
    'Estado Civil',
    'Selecione o estado civil',
    true,
    11,
    6
  FROM section_titular
  RETURNING *
),
options_estado_civil AS (
  INSERT INTO field_options (field_id, value, label, sort_order)
  SELECT id, '16', 'Solteiro(a)', 1 FROM field_titular_estado_civil
  UNION ALL
  SELECT id, '13', 'Casado(a)', 2 FROM field_titular_estado_civil
  UNION ALL
  SELECT id, '14', 'Divorciado(a)', 3 FROM field_titular_estado_civil
  UNION ALL
  SELECT id, '15', 'Viúvo(a)', 4 FROM field_titular_estado_civil
  UNION ALL
  SELECT id, '17', 'Separado(a)', 5 FROM field_titular_estado_civil
  UNION ALL
  SELECT id, '18', 'Em união estável', 6 FROM field_titular_estado_civil
  UNION ALL
  SELECT id, '19', 'Separado(a) de união estável', 7 FROM field_titular_estado_civil
  UNION ALL
  SELECT id, '20', 'Dissolvido(a) de união estável', 8 FROM field_titular_estado_civil
  UNION ALL
  SELECT id, '21', 'Viúvo(a) de companheiro(a)', 9 FROM field_titular_estado_civil
),
field_prenotami_altura AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder, help_text,
    is_required, sort_order, grid_columns, max_length
  )
  SELECT
    id,
    'prenotamiAltura',
    'number',
    'Altura',
    '185',
    'Informe apenas números em centímetros (ex: 185 para 1,85m)',
    true,
    12,
    6,
    3
  FROM section_titular
  RETURNING *
),
validation_prenotami_altura_min AS (
  INSERT INTO field_validations (field_id, validation_type, validation_value, error_message)
  SELECT id, 'min_length', '3', 'Altura inválida. Mínimo de 3 dígitos.'
  FROM field_prenotami_altura
),
validation_prenotami_altura_max AS (
  INSERT INTO field_validations (field_id, validation_type, validation_value, error_message)
  SELECT id, 'max_length', '3', 'Altura inválida. Máximo de 3 dígitos.'
  FROM field_prenotami_altura
),
field_prenotami_cor_olhos AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, help_text,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'prenotamiCorOlhos',
    'select',
    'Cor dos olhos',
    'Somente estas cores são fornecidas pelo sistema. Escolha a cor que melhor se adapta à sua.',
    true,
    13,
    6
  FROM section_titular
  RETURNING *
),
options_cor_olhos AS (
  INSERT INTO field_options (field_id, value, label, sort_order)
  SELECT id, 'azul', 'Azul', 1 FROM field_prenotami_cor_olhos
  UNION ALL
  SELECT id, 'castanho', 'Castanho', 2 FROM field_prenotami_cor_olhos
  UNION ALL
  SELECT id, 'cinza', 'Cinza', 3 FROM field_prenotami_cor_olhos
  UNION ALL
  SELECT id, 'preto', 'Preto', 4 FROM field_prenotami_cor_olhos
  UNION ALL
  SELECT id, 'verde', 'Verde', 5 FROM field_prenotami_cor_olhos
),
field_titular_documento AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, help_text,
    is_required, sort_order, grid_columns, file_types, max_file_size_mb
  )
  SELECT
    id,
    'titularDocumentoIdentidade',
    'file',
    'Documento de Identidade (PDF)',
    'Frente e verso da Identidade do Titular em formato PDF',
    true,
    14,
    12,
    ARRAY['application/pdf'],
    10
  FROM section_titular
  RETURNING *
),
field_comprovante_residencia AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder, help_text,
    is_required, sort_order, grid_columns, file_types, max_file_size_mb
  )
  SELECT
    id,
    'clientePdfFile',
    'file',
    'Comprovante de Residência (PDF)',
    'Arraste seu arquivo PDF aqui ou clique para selecionar',
    'Conta de luz, água ou telefone dos últimos 3 meses',
    false,
    15,
    12,
    ARRAY['application/pdf'],
    10
  FROM section_titular
  RETURNING *
),
-- ============================================================================
-- SEÇÃO 4: REQUERENTES ADICIONAIS
-- ============================================================================
section_requerentes AS (
  INSERT INTO form_sections (
    form_configuration_id, slug, title, description, icon_name, sort_order
  )
  SELECT
    id,
    'requerentes',
    'Requerentes Adicionais',
    'Adicione outros requerentes à solicitação (máximo 3)',
    'users',
    4
  FROM form_config
  RETURNING *
),
-- ============================================================================
-- SEÇÃO 5: OBSERVAÇÕES E RESTRIÇÕES
-- ============================================================================
section_observacoes AS (
  INSERT INTO form_sections (
    form_configuration_id, slug, title, description, icon_name, sort_order
  )
  SELECT
    id,
    'observacoes',
    'Observações e Restrições',
    'Informações adicionais e datas de restrição',
    'sticky-note',
    5
  FROM form_config
  RETURNING *
),
field_observacoes AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, placeholder, help_text,
    is_required, sort_order, grid_columns, max_length
  )
  SELECT
    id,
    'observacoes',
    'textarea',
    'Observações',
    'Ex: Prefiro horarios pela manha ou: Necessidade de acessibilidade',
    'Use apenas letras e números. Não utilize vírgulas ou acentos. Você pode usar hífen para separar informações.',
    false,
    1,
    12,
    100
  FROM section_observacoes
  RETURNING *
),
field_datas_restricao AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label, help_text,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'datasRestricao',
    'calendar_multiple',
    'Datas de Restrição',
    'Selecione as datas em que você NÃO pode comparecer',
    false,
    2,
    12
  FROM section_observacoes
  RETURNING *
),
-- ============================================================================
-- SEÇÃO 6: REVISÃO E CONFIRMAÇÃO
-- ============================================================================
section_revisao AS (
  INSERT INTO form_sections (
    form_configuration_id, slug, title, description, icon_name, sort_order
  )
  SELECT
    id,
    'revisao',
    'Revisão e Confirmação',
    'Revise todas as informações antes de enviar',
    'check-circle',
    6
  FROM form_config
  RETURNING *
),
field_revisao_confirmado AS (
  INSERT INTO form_fields (
    section_id, field_key, field_type, label,
    is_required, sort_order, grid_columns
  )
  SELECT
    id,
    'revisaoConfirmado',
    'checkbox',
    'Confirmo que todas as informações estão corretas e desejo enviar a solicitação.',
    true,
    1,
    12
  FROM section_revisao
  RETURNING *
)

-- Selecionar resultado final
SELECT
  'Configuração criada com sucesso!' as status,
  fc.name as configuracao,
  s.name as estado,
  st.name as servico,
  (SELECT COUNT(*) FROM form_sections WHERE form_configuration_id = fc.id) as total_secoes,
  (SELECT COUNT(*) FROM form_fields ff
   JOIN form_sections fs ON ff.section_id = fs.id
   WHERE fs.form_configuration_id = fc.id) as total_campos
FROM form_config fc
JOIN states s ON fc.state_id = s.id
JOIN service_types st ON fc.service_type_id = st.id;
