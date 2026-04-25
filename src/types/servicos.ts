/**
 * Tipos para o sistema de serviços e configurações de campos dinâmicos
 */

export interface Servico {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  ordem: number;
  criado_em: string;
  atualizado_em: string;
}

export interface ConfiguracaoCampo {
  id: string;
  servico_id: string;
  entidade: 'titular' | 'requerente';
  campo: string;
  exibir: boolean;
  obrigatorio: boolean;
  ordem: number;
  criado_em: string;
}

/**
 * Lista de campos disponíveis para o titular
 */
export type CampoTitular = 
  | 'estadoCivil'
  | 'documentoIdentidade'
  | 'altura'
  | 'corOlhos'
  | 'comprovanteResidencia';

/**
 * Lista de campos disponíveis para o requerente
 */
export type CampoRequerente = 
  | 'dataNascimento'
  | 'altura'
  | 'corOlhos'
  | 'documentoIdentidade';

/**
 * Configuração completa de um serviço
 */
export interface ConfiguracaoServico {
  servico: Servico;
  camposTitular: ConfiguracaoCampo[];
  camposRequerente: ConfiguracaoCampo[];
}

/**
 * Mapeamento de campo para descrição amigável
 */
export const CAMPO_TITULAR_LABELS: Record<CampoTitular, string> = {
  estadoCivil: 'Estado Civil',
  documentoIdentidade: 'Documento de Identidade',
  altura: 'Altura',
  corOlhos: 'Cor dos Olhos',
  comprovanteResidencia: 'Comprovante de Residência',
};

export const CAMPO_REQUERENTE_LABELS: Record<CampoRequerente, string> = {
  dataNascimento: 'Data de Nascimento',
  altura: 'Altura',
  corOlhos: 'Cor dos Olhos',
  documentoIdentidade: 'Documento de Identidade',
};