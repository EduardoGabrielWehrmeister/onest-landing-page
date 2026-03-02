-- ============================================================================
-- Migration: Update Conditional Sections for User Type Filter
-- Description: Atualiza seções condicionais para trabalhar com o novo fluxo
--              onde o tipo de usuário é selecionado na tela inicial
-- Autor: Claude Code
-- Data: 2026-03-02
-- ============================================================================

-- ============================================================================
-- ATUALIZAR SEÇÃO DE ASSESSOR PARA SER CONDICIONAL
-- ============================================================================

-- Primeiro, precisamos encontrar o ID do campo tipoUsuario para poder
-- configurar a dependência corretamente
DO $$
DECLARE
  v_tipo_usuario_field_id UUID;
  v_assessor_section_id UUID;
BEGIN
  -- Buscar o campo tipoUsuario (se existir)
  SELECT id INTO v_tipo_usuario_field_id
  FROM form_fields
  WHERE field_key = 'tipoUsuario'
  LIMIT 1;

  -- Se o campo não existe, não podemos configurar a seção como condicional
  IF v_tipo_usuario_field_id IS NULL THEN
    RAISE NOTICE 'Campo tipoUsuario não encontrado. Seção assessor não será marcada como condicional.';
    RETURN;
  END IF;

  -- Buscar seção assessor
  SELECT id INTO v_assessor_section_id
  FROM form_sections
  WHERE slug = 'assessor'
  LIMIT 1;

  -- Atualizar seção assessor para ser condicional
  IF v_assessor_section_id IS NOT NULL THEN
    UPDATE form_sections
    SET
      is_conditional = true,
      depends_on_field_id = v_tipo_usuario_field_id,
      depends_on_value = 'assessor'
    WHERE id = v_assessor_section_id;

    RAISE NOTICE 'Seção assessor atualizada para ser condicional ao tipoUsuario = assessor';
  END IF;

END $$;

-- ============================================================================
-- MARCAR SEÇÃO tipo-usuario COMO OCULTA/INATIVA
-- ============================================================================
-- A seleção de tipo de usuário agora acontece na tela inicial (StepSelecaoServico)
-- então a seção de tipo-usuario no formulário dinâmico não é mais necessária

-- Atualizar sort_order da seção tipo-usuario para que ela apareça por último
-- e marque-a como não-exibida (usamos sort_order alto para escondê-la)
UPDATE form_sections
SET sort_order = 999
WHERE slug = 'tipo-usuario';

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================

-- Mostrar seções condicionais configuradas
SELECT
  fs.slug,
  fs.title,
  fs.is_conditional,
  fs.depends_on_value,
  ff.field_key as depends_on_field
FROM form_sections fs
LEFT JOIN form_fields ff ON fs.depends_on_field_id = ff.id
WHERE fs.is_conditional = true
ORDER BY fs.slug;

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================
