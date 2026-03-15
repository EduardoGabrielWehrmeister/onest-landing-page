-- ============================================================================
-- Migration: Adicionar user_type para form_configurations
-- Descrição: Esta migração adiciona suporte para diferentes configurações
--              de formulário baseadas no tipo de usuário (cliente/assessor)
--
-- COMO EXECUTAR:
-- 1. Vá ao Dashboard do Supabase: https://supabase.com/dashboard
-- 2. Selecione o seu projeto
-- 3. Vá em "SQL Editor"
-- 4. Copie e cole este script SQL
-- 5. Clique em "Run" para executar
-- ============================================================================

-- Passo 1: Adicionar coluna user_type
ALTER TABLE public.form_configurations
ADD COLUMN user_type character varying CHECK (user_type::text = ANY (ARRAY['cliente'::character varying, 'assessor'::character varying, 'ambos'::character varying]::text[]));

-- Passo 2: Criar índice para performance das consultas
CREATE INDEX IF NOT EXISTS idx_form_configurations_lookup
ON public.form_configurations(state_id, service_type_id, user_type, is_active);

-- Passo 3: Migração - Atualizar registros existentes
-- Se allow_assessor for true, set user_type para 'ambos' (ambos os tipos)
-- Se allow_assessor for false, set user_type para 'cliente' (apenas cliente)
UPDATE public.form_configurations
SET user_type = CASE
  WHEN allow_assessor = true THEN 'ambos'
  ELSE 'cliente'
END
WHERE user_type IS NULL;

-- Passo 4: Verificar a migração
SELECT
  id,
  name,
  allow_assessor,
  user_type,
  is_active
FROM public.form_configurations;
