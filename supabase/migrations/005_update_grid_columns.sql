-- ============================================================================
-- Migration: Update Grid Columns for Dynamic Form Layout
-- Description: Atualiza grid_columns dos campos para corresponder ao layout
--              original do StepDadosTitular.tsx
--
-- Layout do StepDadosTitular.tsx:
-- - Grid geral: grid-cols-1 (sem grid explícito, campos ficam full width)
-- - Seção Endereço: grid-cols-1 md:grid-cols-2 (base 12 colunas)
--
-- Mapeamento para grid de 12 colunas:
-- - Full width (campo sozinho na linha): 12 colunas
-- - Meia largura (1 coluna do grid md:grid-cols-2): 6 colunas
-- - Logradouro (md:col-span-2): 12 colunas (ocupa ambas as colunas do grid md)
--
-- Autor: Claude Code
-- Data: 2026-03-02
-- ============================================================================

-- ============================================================================
-- UPDATE: Campos FULL WIDTH (12 colunas)
-- Estes campos ocupam toda a largura disponível
-- ============================================================================
UPDATE form_fields
SET grid_columns = 12
WHERE field_key IN (
  -- Campos que aparecem sozinhos na linha (full width)
  'clienteNome',              -- Linha 115-138: campo único
  'prenotamiEmail',           -- Linha 140-163: campo único
  'prenotamiSenha',           -- Linha 165-197: campo único
  'titularCep',               -- Linha 199-234: campo único
  'titularEstadoCivil',       -- Linha 334-354: campo único
  'prenotamiAltura',          -- Linha 356-380: campo único (não está em grid com outro campo)
  'prenotamiCorOlhos',        -- Linha 382-409: campo único (não está em grid com outro campo)
  'titularDocumentoIdentidade', -- Linha 411-418: campo único
  'clientePdfFile',           -- Linha 420-427: campo único
  -- Campo de endereço com md:col-span-2 (ocupa ambas as colunas do grid md)
  'titularLogradouro'         -- Linha 239: md:col-span-2 = 12 colunas
);

-- ============================================================================
-- UPDATE: Campos MEIA LARGURA (6 colunas)
-- Estes campos ocupam 1 coluna do grid md:grid-cols-2
-- ============================================================================
UPDATE form_fields
SET grid_columns = 6
WHERE field_key IN (
  -- Campos que ficam no grid de endereço (linha 237: md:grid-cols-2)
  -- Cada um ocupa 1 das 2 colunas do grid md = 6 colunas (base 12)
  'titularNumero',            -- Linha 253-268: 1 coluna do grid md
  'titularComplemento',       -- Linha 270-285: 1 coluna do grid md
  'titularBairro',            -- Linha 287-300: 1 coluna do grid md
  'titularCidade',            -- Linha 302-315: 1 coluna do grid md
  'titularEstado'             -- Linha 317-331: 1 coluna do grid md
);

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================

-- Mostrar configuração de grid dos campos da seção titular
SELECT
  ff.field_key,
  ff.label,
  ff.grid_columns,
  ff.sort_order,
  CASE ff.grid_columns
    WHEN 12 THEN 'Full width (campo sozinho ou md:col-span-2)'
    WHEN 6 THEN 'Meia largura (1 coluna do md:grid-cols-2)'
    ELSE 'Outro'
  END as layout_descricao
FROM form_fields ff
JOIN form_sections fs ON ff.section_id = fs.id
WHERE fs.slug = 'titular'
ORDER BY ff.sort_order;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
