-- ============================================================================
-- Migration: Update Tooltips for Form Fields
-- Description: Move help_text to tooltip_text for better UX
-- Matches StepDadosTitular.tsx tooltips for consistency
-- Autor: Claude Code
-- Data: 2026-03-02
-- ============================================================================

-- Update assessor fields
UPDATE form_fields
SET
  tooltip_text = help_text,
  help_text = NULL
WHERE field_key IN (
  'assessorNome',
  'assessorEmail'
);

-- Update titular fields (from StepDadosTitular.tsx)
UPDATE form_fields
SET
  tooltip_text = help_text,
  help_text = NULL
WHERE field_key IN (
  'clienteNome',                    -- "Informe o nome completo do titular da conta Prenotami"
  'prenotamiEmail',                 -- "Informe o email do titular da conta Prenotami"
  'prenotamiSenha',                 -- "Informe a senha do titular da conta Prenotami"
  'titularCep',                     -- "Apenas números (8 dígitos)"
  'titularEstadoCivil',             -- "Selecione o estado civil"
  'prenotamiAltura',                -- "Informe apenas números em centímetros (ex: 185 para 1,85m)"
  'prenotamiCorOlhos',              -- "Somente estas cores são fornecidas pelo sistema. Escolha a cor que melhor se adapta à sua."
  'titularDocumentoIdentidade',     -- "Frente e verso da Identidade do Titular em formato PDF"
  'clientePdfFile'                  -- "Conta de luz, água ou telefone dos últimos 3 meses"
);

-- Fix typo in document tooltip
UPDATE form_fields
SET tooltip_text = 'Frente e verso da Identidade do Titular em formato PDF'
WHERE field_key = 'titularDocumentoIdentidade';

-- Update observacoes fields
UPDATE form_fields
SET
  tooltip_text = help_text,
  help_text = NULL
WHERE field_key IN (
  'observacoes',                    -- "Use apenas letras e números. Não utilize vírgulas ou acentos. Você pode usar hífen para separar informações."
  'datasRestricao'                  -- "Selecione as datas em que você NÃO pode comparecer"
);

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
