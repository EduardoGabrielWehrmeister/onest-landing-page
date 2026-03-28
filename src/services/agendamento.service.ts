/**
 * Serviço de Agendamento
 * Responsável por transformar dados do formulário e salvar no Supabase
 */

import { supabase } from '@/lib/supabase/client';
import type { AgendamentoInsert } from '@/lib/supabase/types';
import type { FormData } from '@/hooks/useLocalStorageForm';

/**
 * Formata data de YYYY-MM-DD para DD/MM/YYYY
 * @param date - Data no formato YYYY-MM-DD
 * @returns Data no formato DD/MM/YYYY ou string vazia
 */
const formatarData = (date: string | null): string => {
  if (!date) return '';
  
  try {
    const [ano, mes, dia] = date.split('-');
    if (ano && mes && dia) {
      return `${dia}/${mes}/${ano}`;
    }
  } catch (error) {
    console.error('Erro ao formatar data:', error);
  }
  
  return date; // Retorna original se falhar
};

/**
 * Formata endereço completo a partir dos campos separados
 * @param formData - Dados do formulário
 * @returns Endereço formatado em uma string
 */
const formatarEndereco = (formData: FormData): string => {
  const partes: string[] = [];
  
  if (formData.titularLogradouro) {
    partes.push(formData.titularLogradouro);
  }
  
  if (formData.titularNumero) {
    partes.push(formData.titularNumero);
  }
  
  if (formData.titularBairro) {
    partes.push(formData.titularBairro);
  }
  
  if (formData.titularCidade) {
    partes.push(formData.titularCidade);
  }
  
  if (formData.titularEstado) {
    partes.push(formData.titularEstado);
  }
  
  if (formData.titularComplemento) {
    partes.push(`(${formData.titularComplemento})`);
  }
  
  return partes.join(' ');
};

/**
 * Extrai sobrenome e nome a partir do nome completo
 * @param nomeCompleto - Nome completo
 * @returns Objeto com sobrenome e nome separados
 */
const separarNome = (nomeCompleto: string): { sobrenome: string; nome: string } => {
  if (!nomeCompleto) {
    return { sobrenome: '', nome: '' };
  }
  
  const partes = nomeCompleto.trim().split(' ');
  
  // Se tiver só uma parte, é o nome
  if (partes.length === 1) {
    return { sobrenome: '', nome: partes[0] };
  }
  
  // A última parte é o nome, o resto é sobrenome
  const nome = partes.pop() || '';
  const sobrenome = partes.join(' ');
  
  return { sobrenome, nome };
};

/**
 * Transforma dados do formulário para formato do banco de dados
 * @param formData - Dados do formulário
 * @returns Dados formatados para inserção no Supabase
 */
const transformarParaAgendamento = (formData: FormData): AgendamentoInsert => {
  // Processar requerentes adicionais
  const req1 = formData.requerentes[0] ? separarNome(formData.requerentes[0].nomeCompleto) : { sobrenome: '', nome: '' };
  const req2 = formData.requerentes[1] ? separarNome(formData.requerentes[1].nomeCompleto) : { sobrenome: '', nome: '' };
  const req3 = formData.requerentes[2] ? separarNome(formData.requerentes[2].nomeCompleto) : { sobrenome: '', nome: '' };

  // Processar datas de restrição
  const dataInicio = formData.datasRestricao[0] ? formatarData(formData.datasRestricao[0]) : '';
  const dataFim = formData.datasRestricao[1] ? formatarData(formData.datasRestricao[1]) : '';
  const dataAlvo = formData.data_alvo ? formatarData(formData.data_alvo) : '';

  return {
    // Dados do Titular
    email: formData.prenotamiEmail || '',
    senha: formData.prenotamiSenha || '',
    cor_olhos: formData.prenotamiCorOlhos || '',
    altura_cm: parseInt(formData.prenotamiAltura) || 0,
    endereco: formatarEndereco(formData),
    estado_civil: formData.titularEstadoCivil || '',
    qtde_filhos: formData.qtde_filhos || 0,
    tipo_reserva: formData.tipo_reserva || '',
    qtde_requerentes_adicionais: formData.requerentes.length || 0,
    
    // Requerente 1
    adic_1_sobrenome: req1.sobrenome || null,
    adic_1_nome: req1.nome || null,
    adic_1_nascimento: formData.requerentes[0]?.dataNascimento ? formatarData(formData.requerentes[0].dataNascimento) : null,
    adic_1_altura_cm: formData.requerentes[0]?.altura ? parseInt(formData.requerentes[0].altura) : null,
    adic_1_cor_olhos: formData.requerentes[0]?.corOlhos || null,
    
    // Requerente 2
    adic_2_sobrenome: req2.sobrenome || null,
    adic_2_nome: req2.nome || null,
    adic_2_nascimento: formData.requerentes[1]?.dataNascimento ? formatarData(formData.requerentes[1].dataNascimento) : null,
    adic_2_altura_cm: formData.requerentes[1]?.altura ? parseInt(formData.requerentes[1].altura) : null,
    adic_2_cor_olhos: formData.requerentes[1]?.corOlhos || null,
    
    // Requerente 3
    adic_3_sobrenome: req3.sobrenome || null,
    adic_3_nome: req3.nome || null,
    adic_3_nascimento: formData.requerentes[2]?.dataNascimento ? formatarData(formData.requerentes[2].dataNascimento) : null,
    adic_3_altura_cm: formData.requerentes[2]?.altura ? parseInt(formData.requerentes[2].altura) : null,
    adic_3_cor_olhos: formData.requerentes[2]?.corOlhos || null,
    
    // Observações e campos do bot
    anotacoes: formData.observacoes || null,
    email_otp: formData.email_otp || null,
    senha_email_otp: formData.senha_email_otp || null,
    data_inicio_restricao: dataInicio || null,
    data_fim_restricao: dataFim || null,
    data_alvo: dataAlvo || null,
  };
};

/**
 * Gera string CSV a partir dos dados do formulário
 * @param formData - Dados do formulário
 * @returns String CSV formatada
 */
const gerarCSV = (formData: FormData): string => {
  // Header do CSV (mesma ordem do exemplo)
  const header = [
    'email', 'senha', 'cor_olhos', 'altura_cm', 'endereco', 'estado_civil',
    'qtde_filhos', 'tipo_reserva', 'qtde_requerentes_adicionais',
    'adic_1_sobrenome', 'adic_1_nome', 'adic_1_nascimento', 'adic_1_altura_cm', 'adic_1_cor_olhos',
    'adic_2_sobrenome', 'adic_2_nome', 'adic_2_nascimento', 'adic_2_altura_cm', 'adic_2_cor_olhos',
    'adic_3_sobrenome', 'adic_3_nome', 'adic_3_nascimento', 'adic_3_altura_cm', 'adic_3_cor_olhos',
    'anotacoes', 'email_otp', 'senha_email_otp', 'data_inicio_restricao', 'data_fim_restricao', 'data_alvo'
  ].join(',');

  // Dados processados
  const dados = transformarParaAgendamento(formData);

  // Processar requerentes para CSV
  const req1 = formData.requerentes[0] ? separarNome(formData.requerentes[0].nomeCompleto) : { sobrenome: '', nome: '' };
  const req2 = formData.requerentes[1] ? separarNome(formData.requerentes[1].nomeCompleto) : { sobrenome: '', nome: '' };
  const req3 = formData.requerentes[2] ? separarNome(formData.requerentes[2].nomeCompleto) : { sobrenome: '', nome: '' };

  // Datas de restrição
  const dataInicio = formData.datasRestricao[0] ? formatarData(formData.datasRestricao[0]) : '';
  const dataFim = formData.datasRestricao[1] ? formatarData(formData.datasRestricao[1]) : '';
  const dataAlvo = formData.data_alvo ? formatarData(formData.data_alvo) : '';

  // Data de nascimento dos requerentes
  const req1Nascimento = formData.requerentes[0]?.dataNascimento ? formatarData(formData.requerentes[0].dataNascimento) : '';
  const req2Nascimento = formData.requerentes[1]?.dataNascimento ? formatarData(formData.requerentes[1].dataNascimento) : '';
  const req3Nascimento = formData.requerentes[2]?.dataNascimento ? formatarData(formData.requerentes[2].dataNascimento) : '';

  // Linha de dados
  const row = [
    dados.email || '',
    dados.senha || '',
    dados.cor_olhos || '',
    dados.altura_cm || '',
    dados.endereco || '',
    dados.estado_civil || '',
    dados.qtde_filhos || '',
    dados.tipo_reserva || '',
    dados.qtde_requerentes_adicionais || '',
    req1.sobrenome || '', req1.nome || '', req1Nascimento, formData.requerentes[0]?.altura || '', formData.requerentes[0]?.corOlhos || '',
    req2.sobrenome || '', req2.nome || '', req2Nascimento, formData.requerentes[1]?.altura || '', formData.requerentes[1]?.corOlhos || '',
    req3.sobrenome || '', req3.nome || '', req3Nascimento, formData.requerentes[2]?.altura || '', formData.requerentes[2]?.corOlhos || '',
    dados.anotacoes || '',
    dados.email_otp || '',
    dados.senha_email_otp || '',
    dataInicio,
    dataFim,
    dataAlvo
  ].map(value => {
    // Converter para string e escapar vírgulas e aspas duplas
    const stringValue = String(value || '');
    if (stringValue && (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n'))) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }).join(',');

  return `${header}\n${row}`;
};

/**
 * Faz upload do arquivo CSV para o Storage
 * @param csvContent - Conteúdo do arquivo CSV
 * @param agendamentoId - ID do agendamento para nomear o arquivo
 * @returns Promise com URL pública do arquivo
 */
const uploadCSV = async (csvContent: string, agendamentoId: string): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_');
    const fileName = `agendamento_${agendamentoId}_${timestamp}.csv`;
    const filePath = `Primeiro Passaporte/${fileName}`;

    // Converter string para Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const file = new File([blob], fileName, { type: 'text/csv' });

    // Fazer upload
    const { data, error } = await supabase()
      .storage
      .from('documentos')
      .upload(filePath, file);

    if (error) {
      console.error('Erro ao fazer upload CSV:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase()
      .storage
      .from('documentos')
      .getPublicUrl(filePath);

    console.log('CSV salvo no Storage:', publicUrlData.publicUrl);

    return {
      success: true,
      url: publicUrlData.publicUrl
    };
  } catch (error) {
    console.error('Erro ao fazer upload CSV (catch):', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

/**
 * Salva um agendamento no banco de dados e gera CSV
 * @param formData - Dados do formulário
 * @returns Promise com o resultado da operação
 */
export const salvarAgendamento = async (formData: FormData) => {
  try {
    // Transformar dados para formato do banco
    const dadosAgendamento = transformarParaAgendamento(formData);
    
    // Inserir no Supabase
    const { data, error } = await supabase()
      .from('agendamentos')
      .insert(dadosAgendamento)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao salvar agendamento:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
    
    console.log('Agendamento salvo com sucesso:', data);
    
    // Gerar CSV e fazer upload
    const csvContent = gerarCSV(formData);
    const uploadResult = await uploadCSV(csvContent, data.id);
    
    return {
      success: true,
      data: data,
      csvUrl: uploadResult.success ? uploadResult.url : undefined,
      csvError: uploadResult.error,
      error: null
    };
  } catch (error) {
    console.error('Erro ao salvar agendamento (catch):', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: error
    };
  }
};

/**
 * Lista todos os agendamentos (opcional, para dashboard)
 * @returns Promise com lista de agendamentos
 */
export const listarAgendamentos = async () => {
  try {
    const { data, error } = await supabase()
      .from('agendamentos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao listar agendamentos:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
    
    return {
      success: true,
      data: data,
      error: null
    };
  } catch (error) {
    console.error('Erro ao listar agendamentos (catch):', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      data: null
    };
  }
};