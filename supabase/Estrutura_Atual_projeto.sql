CREATE TABLE public.conditional_fields (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  target_field_id uuid NOT NULL,
  trigger_field_id uuid NOT NULL,
  operator character varying NOT NULL CHECK (operator::text IN ('equals', 'not_equals', 'contains', 'not_contains', 'in', 'not_in', 'greater_than', 'less_than', 'is_empty', 'is_not_empty')),
  trigger_value character varying,
  logical_operator character varying DEFAULT 'AND'::character varying CHECK (logical_operator::text IN ('AND', 'OR')),
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT conditional_fields_pkey PRIMARY KEY (id),
  CONSTRAINT conditional_fields_target_field_id_fkey FOREIGN KEY (target_field_id) REFERENCES public.form_fields(id),
  CONSTRAINT conditional_fields_trigger_field_id_fkey FOREIGN KEY (trigger_field_id) REFERENCES public.form_fields(id)
);
CREATE TABLE public.field_options (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  field_id uuid NOT NULL,
  value character varying NOT NULL,
  label character varying NOT NULL,
  sort_order integer DEFAULT 0,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT field_options_pkey PRIMARY KEY (id),
  CONSTRAINT field_options_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.form_fields(id)
);
CREATE TABLE public.field_validations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  field_id uuid NOT NULL,
  validation_type character varying NOT NULL CHECK (validation_type::text IN ('pattern', 'min_length', 'max_length', 'email', 'phone', 'cep', 'custom')),
  validation_value text,
  error_message character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT field_validations_pkey PRIMARY KEY (id),
  CONSTRAINT field_validations_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.form_fields(id)
);
CREATE TABLE public.form_configurations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  state_id uuid NOT NULL,
  service_type_id uuid NOT NULL,
  name character varying NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  allow_assessor boolean DEFAULT true,
  max_requerentes_adicionais integer DEFAULT 3 CHECK (max_requerentes_adicionais >= 0 AND max_requerentes_adicionais <= 10),
  allow_date_restrictions boolean DEFAULT true,
  observations_max_length integer DEFAULT 100 CHECK (observations_max_length >= 0 AND observations_max_length <= 1000),
  user_type character varying CHECK (user_type::text IN ('cliente', 'assessor', 'ambos')),
  version integer DEFAULT 1,
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT form_configurations_pkey PRIMARY KEY (id),
  CONSTRAINT form_configurations_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id),
  CONSTRAINT form_configurations_service_type_id_fkey FOREIGN KEY (service_type_id) REFERENCES public.service_types(id)
);

-- Index for form configuration lookups
CREATE INDEX idx_form_configurations_lookup ON public.form_configurations(state_id, service_type_id, user_type, is_active);
CREATE TABLE public.form_fields (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL,
  field_key character varying NOT NULL,
  field_type character varying NOT NULL CHECK (field_type::text IN ('text', 'email', 'password', 'phone', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date', 'file', 'address_autocomplete', 'calendar_multiple')),
  label character varying NOT NULL,
  placeholder character varying,
  help_text text,
  tooltip_text text,
  is_required boolean DEFAULT false,
  is_conditional boolean DEFAULT false,
  sort_order integer NOT NULL CHECK (sort_order >= 0),
  grid_columns integer DEFAULT 1 CHECK (grid_columns >= 1 AND grid_columns <= 12),
  grid_md_columns integer,
  max_length integer,
  min_value numeric,
  max_value numeric,
  input_mask character varying,
  is_uppercase boolean DEFAULT false,
  show_toggle_visibility boolean DEFAULT false,
  file_types text[],
  max_file_size_mb integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT form_fields_pkey PRIMARY KEY (id),
  CONSTRAINT form_fields_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.form_sections(id)
);
CREATE TABLE public.form_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  form_configuration_id uuid NOT NULL,
  slug character varying NOT NULL,
  title character varying NOT NULL,
  description text,
  icon_name character varying,
  sort_order integer NOT NULL CHECK (sort_order >= 0),
  is_conditional boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT form_sections_pkey PRIMARY KEY (id),
  CONSTRAINT form_sections_form_configuration_id_fkey FOREIGN KEY (form_configuration_id) REFERENCES public.form_configurations(id)
);
CREATE TABLE public.form_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  form_configuration_id uuid NOT NULL,
  submission_id character varying NOT NULL UNIQUE,
  user_type character varying NOT NULL CHECK (user_type::text IN ('cliente', 'assessor')),
  assessor_nome character varying,
  assessor_email character varying,
  assessor_telefone character varying,
  titular_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  requerentes_adicionais jsonb DEFAULT '[]'::jsonb,
  datas_restricao ARRAY DEFAULT '{}'::timestamp with time zone[],
  observacoes text,
  status character varying DEFAULT 'draft'::character varying CHECK (status::text IN ('draft', 'submitted', 'processing', 'completed', 'cancelled')),
  prenotami_submission_id character varying,
  prenotami_status character varying,
  prenotami_response jsonb,
  ip_address inet,
  user_agent text,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT form_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT form_submissions_form_configuration_id_fkey FOREIGN KEY (form_configuration_id) REFERENCES public.form_configurations(id)
);
CREATE TABLE public.service_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  requires_assessor_option boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.states (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE CHECK (char_length(code::text) = 2),
  name character varying NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT states_pkey PRIMARY KEY (id)
);

---

insert into
  "public"."field_options" (
    "id",
    "field_id",
    "value",
    "label",
    "sort_order",
    "is_default",
    "created_at"
  )
values
  (
    '05156c20-da2b-4f1f-8759-a807ba9a0c5d',
    '138c29fd-bd60-456d-8cdc-8c2a286b9515',
    '18',
    'Em união estável',
    '6',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    '344d7f0f-a367-43f2-8daf-5ad62579d565',
    '138c29fd-bd60-456d-8cdc-8c2a286b9515',
    '21',
    'Viúvo(a) de companheiro(a)',
    '9',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    '390e2bba-b89d-4a79-9f07-b7e88292507c',
    '138c29fd-bd60-456d-8cdc-8c2a286b9515',
    '15',
    'Viúvo(a)',
    '4',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    '56c117a3-88aa-4f20-a865-413d85bd4e6a',
    '138c29fd-bd60-456d-8cdc-8c2a286b9515',
    '20',
    'Dissolvido(a) de união estável',
    '8',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    '848700a2-f802-4653-bfa1-06ca364c8271',
    '739ca796-0dcf-4395-b32f-3ef764427205',
    'azul',
    'Azul',
    '1',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    '89d1ee76-c602-4716-9fe7-7498d1f4b0b9',
    '739ca796-0dcf-4395-b32f-3ef764427205',
    'castanho',
    'Castanho',
    '2',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    '8ad15171-6e71-4c39-b4a6-9616fadb58ea',
    '138c29fd-bd60-456d-8cdc-8c2a286b9515',
    '16',
    'Solteiro(a)',
    '1',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    '91c234ee-cee3-4d40-8cd5-784edb854c76',
    '739ca796-0dcf-4395-b32f-3ef764427205',
    'preto',
    'Preto',
    '4',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    '9450a5fe-2f7e-40ef-944f-8401074f6c9e',
    '739ca796-0dcf-4395-b32f-3ef764427205',
    'cinza',
    'Cinza',
    '3',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    'b0bb16a9-9ab6-4410-8b4f-07ddf2536faa',
    '739ca796-0dcf-4395-b32f-3ef764427205',
    'verde',
    'Verde',
    '5',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    'c9aff942-d525-4849-ac40-59e0d4d67dc6',
    '138c29fd-bd60-456d-8cdc-8c2a286b9515',
    '14',
    'Divorciado(a)',
    '3',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    'ca73e7d6-96e3-4fff-81ee-e03081f8121d',
    '138c29fd-bd60-456d-8cdc-8c2a286b9515',
    '17',
    'Separado(a)',
    '5',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    'dd3862ec-a025-4fa8-998f-51fa82563f8f',
    '138c29fd-bd60-456d-8cdc-8c2a286b9515',
    '19',
    'Separado(a) de união estável',
    '7',
    'false',
    '2026-03-03 01:52:28.798681+00'
  ),
  (
    'f8044bd4-2999-42a0-91d0-2dab0073f131',
    '138c29fd-bd60-456d-8cdc-8c2a286b9515',
    '13',
    'Casado(a)',
    '2',
    'false',
    '2026-03-03 01:52:28.798681+00'
  );

  INSERT INTO "public"."states" ("id", "code", "name", "is_active", "created_at", "updated_at") VALUES ('23cbd41b-a604-454a-bfbe-bd6a0e54d84e', 'SP', 'São Paulo', 'true', '2026-03-03 01:52:18.535687+00', '2026-03-03 01:52:18.535687+00');

  insert into
  "public"."states" (
    "id",
    "code",
    "name",
    "is_active",
    "created_at",
    "updated_at"
  )
values
  (
    '23cbd41b-a604-454a-bfbe-bd6a0e54d84e',
    'SP',
    'São Paulo',
    'true',
    '2026-03-03 01:52:18.535687+00',
    '2026-03-03 01:52:18.535687+00'
  );

  INSERT INTO "public"."service_types" ("id", "slug", "name", "description", "requires_assessor_option", "is_active", "sort_order", "created_at", "updated_at") VALUES ('df4d02f1-6e58-4ddb-a54e-842b6035979d', 'primeiro-passaporte-italiano', 'Primeiro Passaporte Italiano', 'Ficha para Assessores - Agendamento do Primeiro Passaporte Italiano', 'true', 'true', '5', '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00');

  INSERT INTO "public"."form_sections" 
  ("id", "form_configuration_id", "slug", "title", "description", "icon_name", "sort_order", "is_conditional", "created_at", "updated_at") VALUES 
  ('64b93b51-3a53-417e-9caa-ae42a61739ad', 'bd51cdc3-f063-4d95-aaba-aeaac7d21747', 'observacoes', 'Observações e Restrições', 'Informações adicionais e datas de restrição', 'sticky-note', '5', 'false', '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), 
  ('9e68487a-13ea-4f4d-961c-cb301b935c2d', 'bd51cdc3-f063-4d95-aaba-aeaac7d21747', 'revisao', 'Revisão e Confirmação', 'Revise todas as informações antes de enviar', 'check-circle', '6', 'false', '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), 
  ('be56267a-007c-4030-b381-fae301fd9f32', 'bd51cdc3-f063-4d95-aaba-aeaac7d21747', 'titular', 'Dados do Titular', 'Informações pessoais e credenciais de acesso', 'user', '3', 'false', '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), 
  ('c6560838-714a-40eb-9fcd-d4c44b51fa3d', 'bd51cdc3-f063-4d95-aaba-aeaac7d21747', 'assessor', 'Dados do Assessor', 'Informe seus dados de contato profissional', 'briefcase', '2', 'false', '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), 
  ('dafff75d-9df1-415a-940c-7503fd2be98e', 'bd51cdc3-f063-4d95-aaba-aeaac7d21747', 'requerentes', 'Requerentes Adicionais', 'Adicione outros requerentes à solicitação (máximo 3)', 'users', '4', 'false', '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00');

  INSERT INTO "public"."form_fields" ("id", "section_id", "field_key", "field_type", "label", "placeholder", "help_text", "tooltip_text", "is_required", "is_conditional", "sort_order", "grid_columns", "grid_md_columns", "max_length", "min_value", "max_value", "input_mask", "is_uppercase", "show_toggle_visibility", "file_types", "max_file_size_mb", "created_at", "updated_at") VALUES ('0a58b858-ac7f-47bc-83c0-9cda75beffe3', '9e68487a-13ea-4f4d-961c-cb301b935c2d', 'revisaoConfirmado', 'checkbox', 'Confirmo que todas as informações estão corretas e desejo enviar a solicitação.', null, null, null, 'true', 'false', '1', '12', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), ('138c29fd-bd60-456d-8cdc-8c2a286b9515', 'be56267a-007c-4030-b381-fae301fd9f32', 'titularEstadoCivil', 'select', 'Estado Civil', null, null, 'Selecione o estado civil', 'true', 'false', '11', '6', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), 
  ('176b422d-a4b4-457e-aae1-5670e2bc4081', 'be56267a-007c-4030-b381-fae301fd9f32', 'titularEstado', 'text', 'Estado', 'Ex: SP', null, null, 'true', 'false', '10', '6', '4', '2', null, null, null, 'true', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), ('1fbdceb3-413f-4ee7-b072-512d5d6b2e5d', 'be56267a-007c-4030-b381-fae301fd9f32', 'titularComplemento', 'text', 'Complemento', 'Ex: Apto 101', null, null, 'false', 'false', '7', '6', '4', null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), ('26d86947-db72-489b-8a5f-08101a10ea44', '64b93b51-3a53-417e-9caa-ae42a61739ad', 'datasRestricao', 'calendar_multiple', 'Datas de Restrição', null, null, 'Selecione as datas em que você NÃO pode comparecer', 'false', 'false', '2', '12', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('5932250a-6b0d-47c3-af2d-42381970237e', 'be56267a-007c-4030-b381-fae301fd9f32', 'titularDocumentoIdentidade', 'file', 'Documento de Identidade (PDF)', null, null, 'Frente e verso da Identidade do Titular em formato PDF', 'true', 'false', '14', '12', null, null, null, null, null, null, 'false', 'false', ARRAY["application/pdf"], '10', '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('5beb1e4b-8038-4600-8d1a-960d553715ef', 'be56267a-007c-4030-b381-fae301fd9f32', 'titularCidade', 'text', 'Cidade', 'Ex: São Paulo', null, null, 'true', 'false', '9', '6', '4', null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), ('6011f2f7-af4e-4ba6-b205-91bf0dba9e4b', 'be56267a-007c-4030-b381-fae301fd9f32', 'prenotamiSenha', 'password', 'Senha Prenotami', 'Ex: SuaSenha123', null, 'Informe a senha do titular da conta Prenotami', 'true', 'false', '3', '12', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('69fc3694-b761-4ddb-bd7a-ce72906a7812', 'be56267a-007c-4030-b381-fae301fd9f32', 'prenotamiAltura', 'number', 'Altura', '185', null, 'Informe apenas números em centímetros (ex: 185 para 1,85m)', 'true', 'false', '12', '6', null, '3', null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('6feb32b2-0612-44fe-b9e4-ac9bfca36993', 'be56267a-007c-4030-b381-fae301fd9f32', 'clienteNome', 'text', 'Nome completo', 'Ex: Maria da Silva Santos', null, 'Informe o nome completo do titular da conta Prenotami', 'true', 'false', '1', '12', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('7276752c-f3fc-493b-9bc8-fb71e9960364', 'be56267a-007c-4030-b381-fae301fd9f32', 'titularLogradouro', 'text', 'Rua / Avenida', 'Ex: Av. Paulista', null, null, 'true', 'false', '5', '12', '8', null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), ('739ca796-0dcf-4395-b32f-3ef764427205', 'be56267a-007c-4030-b381-fae301fd9f32', 'prenotamiCorOlhos', 'select', 'Cor dos olhos', null, null, 'Somente estas cores são fornecidas pelo sistema. Escolha a cor que melhor se adapta à sua.', 'true', 'false', '13', '6', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('73aae7a9-319c-48dd-8584-fd1c5f7f1376', 'be56267a-007c-4030-b381-fae301fd9f32', 'titularNumero', 'text', 'Número', 'Ex: 1000', null, null, 'false', 'false', '6', '6', '4', null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), ('9b82a036-9c8e-46bc-84d2-645573cbb607', '64b93b51-3a53-417e-9caa-ae42a61739ad', 'observacoes', 'textarea', 'Observações', 'Ex: Prefiro horarios pela manha ou: Necessidade de acessibilidade', null, 'Use apenas letras e números. Não utilize vírgulas ou acentos. Você pode usar hífen para separar informações.', 'false', 'false', '1', '12', null, '100', null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('9cbb8492-8197-4627-9857-1377645704d3', 'be56267a-007c-4030-b381-fae301fd9f32', 'clientePdfFile', 'file', 'Comprovante de Residência (PDF)', 'Arraste seu arquivo PDF aqui ou clique para selecionar', null, 'Conta de luz, água ou telefone dos últimos 3 meses', 'false', 'false', '15', '12', null, null, null, null, null, null, 'false', 'false', ARRAY["application/pdf"], '10', '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('c4185c7b-46c8-47dd-b803-8ebc1a0a3f94', 'be56267a-007c-4030-b381-fae301fd9f32', 'titularCep', 'address_autocomplete', 'CEP', 'Ex: 05410001', null, 'Apenas números (8 dígitos)', 'true', 'false', '4', '6', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('cc6871ef-eeec-49b5-b550-c97152ebe023', 'be56267a-007c-4030-b381-fae301fd9f32', 'titularBairro', 'text', 'Bairro', 'Ex: Bela Vista', null, null, 'true', 'false', '8', '6', '4', null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), ('ceb1ab39-c4cb-42db-ac9f-631770f3eac5', 'c6560838-714a-40eb-9fcd-d4c44b51fa3d', 'assessorTelefone', 'phone', 'Telefone', 'Ex: (11) 98765-4321', null, null, 'true', 'false', '3', '12', null, '15', null, null, '(XX) XXXXX-XXXX', 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00'), ('d6e339ba-6c10-4862-a894-4949b58b0b9c', 'be56267a-007c-4030-b381-fae301fd9f32', 'prenotamiEmail', 'email', 'Email Prenotami', 'Ex: maria.santos@gmail.com', null, 'Informe o email do titular da conta Prenotami', 'true', 'false', '2', '12', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('dee16b61-7f13-4581-bc49-76ba91e64dc7', 'c6560838-714a-40eb-9fcd-d4c44b51fa3d', 'assessorNome', 'text', 'Nome / Empresa', 'Ex: João Silva - Turismo Brasil', null, 'Informe o nome completo ou nome da empresa', 'true', 'false', '1', '12', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00'), ('e4d173c6-da4b-4345-9285-22f692f158ab', 'c6560838-714a-40eb-9fcd-d4c44b51fa3d', 'assessorEmail', 'email', 'Email', 'Ex: joao.silva@gmail.com', null, 'Email para contato profissional', 'true', 'false', '2', '12', null, null, null, null, null, null, 'false', 'false', null, null, '2026-03-03 01:52:28.798681+00', '2026-03-04 22:58:29.949282+00');

  INSERT INTO "public"."form_configurations" ("id", "state_id", "service_type_id", "name", "description", "is_active", "allow_assessor", "max_requerentes_adicionais", "allow_date_restrictions", "observations_max_length", "user_type", "version", "valid_from", "valid_until", "created_at", "updated_at") VALUES ('bd51cdc3-f063-4d95-aaba-aeaac7d21747', '23cbd41b-a604-454a-bfbe-bd6a0e54d84e', 'df4d02f1-6e58-4ddb-a54e-842b6035979d', 'Primeiro Passaporte Italiano - São Paulo', 'Ficha para Assessores - Agendamento do Primeiro Passaporte Italiano', 'true', 'true', '3', 'true', '100', 'ambos', '1', '2026-03-03 01:52:28.798681+00', null, '2026-03-03 01:52:28.798681+00', '2026-03-03 01:52:28.798681+00');

  INSERT INTO "public"."field_validations" ("id", "field_id", "validation_type", "validation_value", "error_message", "created_at") VALUES ('17a4b70a-fb03-45e9-b0ca-1f1d110d3175', '69fc3694-b761-4ddb-bd7a-ce72906a7812', 'min_length', '3', 'Altura inválida. Mínimo de 3 dígitos.', '2026-03-03 01:52:28.798681+00'), ('31e793b8-1d5b-435b-816d-9f4a8f4ab7c2', 'e4d173c6-da4b-4345-9285-22f692f158ab', 'email', null, 'Email inválido. Insira um endereço válido.', '2026-03-03 01:52:28.798681+00'), ('8ea73300-37c0-4833-8ac2-c82a69aee484', '69fc3694-b761-4ddb-bd7a-ce72906a7812', 'max_length', '3', 'Altura inválida. Máximo de 3 dígitos.', '2026-03-03 01:52:28.798681+00'), ('c55cc7a0-b1e5-41af-bd49-8001203b51d8', 'c4185c7b-46c8-47dd-b803-8ebc1a0a3f94', 'cep', null, 'CEP inválido. Deve conter 8 dígitos.', '2026-03-03 01:52:28.798681+00'), ('ccdd0de2-b42c-4d59-b0a6-37e358fe85c3', 'ceb1ab39-c4cb-42db-ac9f-631770f3eac5', 'phone', null, 'Telefone inválido. Deve conter 10 ou 11 dígitos.', '2026-03-03 01:52:28.798681+00'), ('da6c6b37-f97d-4c32-b8b6-86b767d51191', 'd6e339ba-6c10-4862-a894-4949b58b0b9c', 'email', null, 'Email inválido. Insira um endereço de email válido.', '2026-03-03 01:52:28.798681+00');