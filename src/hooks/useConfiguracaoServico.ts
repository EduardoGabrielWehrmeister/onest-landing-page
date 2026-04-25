/**
 * Hook para gerenciar configurações de campos dinâmicos de serviços
 * Carrega configurações do banco e fornece funções auxiliares
 */

import { useState, useEffect, useCallback } from 'react';
import { getConfiguracoesCompletas } from '@/services/servicos.service';
import type { Servico, ConfiguracaoServico, ConfiguracaoCampo } from '@/types/servicos';

interface UseConfiguracaoServicoState {
  configuracoes: ConfiguracaoServico[];
  servicos: Servico[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook para gerenciar configurações de campos dinâmicos
 * @returns Estado com configurações e funções auxiliares
 * 
 * @example
 * ```tsx
 * const { servicos, shouldShowField, isRequiredField } = useConfiguracaoServico();
 * 
 * // Buscar serviços disponíveis
 * <Select>
 *   {servicos.map(servico => (
 *     <SelectItem key={servico.id} value={servico.codigo}>
 *       {servico.nome}
 *     </SelectItem>
 *   ))}
 * </Select>
 * 
 * // Verificar se campo deve ser exibido
 * {shouldShowField('sp-primeiro-passaporte', 'titular', 'estadoCivil') && (
 *   <CampoEstadoCivil />
 * )}
 * ```
 */
export const useConfiguracaoServico = () => {
  const [state, setState] = useState<UseConfiguracaoServicoState>({
    configuracoes: [],
    servicos: [],
    loading: true,
    error: null,
  });

  // Carregar configurações ao montar
  useEffect(() => {
    const loadConfiguracoes = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        
        const { data, error } = await getConfiguracoesCompletas();

        if (error || !data) {
          throw new Error(error || 'Erro ao carregar configurações');
        }

        const servicos = data.map((c) => c.servico);

        setState({
          configuracoes: data,
          servicos,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar configurações';
        console.error('Erro no useConfiguracaoServico:', errorMessage);
        
        setState({
          configuracoes: [],
          servicos: [],
          loading: false,
          error: errorMessage,
        });
      }
    };

    loadConfiguracoes();
  }, []);

  /**
   * Busca configurações de um serviço pelo código
   */
  const getConfiguracaoByCodigo = useCallback((codigo: string): ConfiguracaoServico | null => {
    return state.configuracoes.find((c) => c.servico.codigo === codigo) || null;
  }, [state.configuracoes]);

  /**
   * Verifica se um campo deve ser exibido
   * @param codigo - Código do serviço
   * @param entidade - 'titular' ou 'requerente'
   * @param campo - Nome do campo
   * @returns true se o campo deve ser exibido, false caso contrário
   */
  const shouldShowField = useCallback((
    codigo: string,
    entidade: 'titular' | 'requerente',
    campo: string
  ): boolean => {
    const configuracao = getConfiguracaoByCodigo(codigo);
    if (!configuracao) return true; // Padrão: mostrar se não configurado

    const campos = entidade === 'titular' 
      ? configuracao.camposTitular 
      : configuracao.camposRequerente;

    const campoConfig = campos.find((c) => c.campo === campo);
    
    // Se não tiver configuração específica, mostra o campo (comportamento padrão)
    if (!campoConfig) return true;

    return campoConfig.exibir;
  }, [getConfiguracaoByCodigo]);

  /**
   * Verifica se um campo é obrigatório
   * @param codigo - Código do serviço
   * @param entidade - 'titular' ou 'requerente'
   * @param campo - Nome do campo
   * @returns true se o campo é obrigatório, false caso contrário
   */
  const isRequiredField = useCallback((
    codigo: string,
    entidade: 'titular' | 'requerente',
    campo: string
  ): boolean => {
    const configuracao = getConfiguracaoByCodigo(codigo);
    if (!configuracao) return false; // Padrão: não obrigatório se não configurado

    const campos = entidade === 'titular' 
      ? configuracao.camposTitular 
      : configuracao.camposRequerente;

    const campoConfig = campos.find((c) => c.campo === campo);
    
    // Se não tiver configuração específica, não é obrigatório (comportamento padrão)
    if (!campoConfig) return false;

    return campoConfig.obrigatorio;
  }, [getConfiguracaoByCodigo]);

  /**
   * Busca todos os campos de uma entidade para um serviço
   * @param codigo - Código do serviço
   * @param entidade - 'titular' ou 'requerente'
   * @returns Lista de configurações de campos
   */
  const getFieldsByEntidade = useCallback((
    codigo: string,
    entidade: 'titular' | 'requerente'
  ): ConfiguracaoCampo[] => {
    const configuracao = getConfiguracaoByCodigo(codigo);
    if (!configuracao) return [];

    return entidade === 'titular' 
      ? configuracao.camposTitular 
      : configuracao.camposRequerente;
  }, [getConfiguracaoByCodigo]);

  /**
   * Busca campos visíveis de uma entidade para um serviço
   * @param codigo - Código do serviço
   * @param entidade - 'titular' ou 'requerente'
   * @returns Lista de campos que devem ser exibidos
   */
  const getVisibleFields = useCallback((
    codigo: string,
    entidade: 'titular' | 'requerente'
  ): ConfiguracaoCampo[] => {
    return getFieldsByEntidade(codigo, entidade)
      .filter((c) => c.exibir)
      .sort((a, b) => a.ordem - b.ordem);
  }, [getFieldsByEntidade]);

  /**
   * Busca campos obrigatórios de uma entidade para um serviço
   * @param codigo - Código do serviço
   * @param entidade - 'titular' ou 'requerente'
   * @returns Lista de campos que são obrigatórios
   */
  const getRequiredFields = useCallback((
    codigo: string,
    entidade: 'titular' | 'requerente'
  ): ConfiguracaoCampo[] => {
    return getFieldsByEntidade(codigo, entidade)
      .filter((c) => c.exibir && c.obrigatorio)
      .sort((a, b) => a.ordem - b.ordem);
  }, [getFieldsByEntidade]);

  return {
    configuracoes: state.configuracoes,
    servicos: state.servicos,
    loading: state.loading,
    error: state.error,
    
    // Funções auxiliares
    getConfiguracaoByCodigo,
    shouldShowField,
    isRequiredField,
    getFieldsByEntidade,
    getVisibleFields,
    getRequiredFields,
  };
};

export default useConfiguracaoServico;