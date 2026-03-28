/**
 * Serviço de Agendamento
 * Responsável por transformar dados do formulário e salvar no Supabase
 */

import { supabase } from '@/lib/supabase/client';
import type { AgendamentoInsert, RequerenteAdicionalInsert } from '@/lib/supabase/types';
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
 * Transforma dados do formulário para formato do banco de dados (nova estrutura)
 * @param formData - Dados do formulário
 * @returns Dados formatados para inserção na tabela agendamentos
 */
const transformarParaAgendamento = (formData: FormData): AgendamentoInsert => {
  // Processar datas de restrição
  const dataInicio = formData.datasRestricao[0] ? formatarData(formData.datasRestricao[0]) : null;
  const dataFim = formData.datasRestricao[1] ? formatarData(formData.datasRestricao[1]) : null;
  const dataAlvo = formData.data_alvo ? formatarData(formData.data_alvo) : null;

  // Verifica se há assessor (pelo menos um campo preenchido)
  const possuiAssessor = !!(
    formData.assessorNome || 
    formData.assessorEmail || 
    formData.assessorTelefone
  );

  return {
    // Dados do Titular (com prefixo titular_)
    titular_nome_completo: formData.clienteNome || '',
    titular_email: formData.prenotamiEmail || '',
    titular_senha: formData.prenotamiSenha || '',
    titular_cor_olhos: formData.prenotamiCorOlhos || '',
    titular_altura_cm: parseInt(formData.prenotamiAltura) || 0,
    titular_endereco: formatarEndereco(formData),
    titular_estado_civil: formData.titularEstadoCivil || '',
    titular_qtde_filhos: formData.qtde_filhos || 0,
    
    // Dados do Assessor (opcionais)
    assessor_nome_completo: formData.assessorNome || null,
    assessor_email: formData.assessorEmail || null,
    assessor_telefone: formData.assessorTelefone || null,
    
    // Observações e campos do bot
    anotacoes: formData.observacoes || null,
    email_otp: formData.email_otp || null,
    senha_email_otp: formData.senha_email_otp || null,
    data_inicio_restricao: dataInicio,
    data_fim_restricao: dataFim,
    data_alvo: dataAlvo,
    
    // Campo automático - não enviar para que o banco use o DEFAULT  
    };
};

/**
 * Cria array de requerentes adicionais para inserção no banco
 * @param formData - Dados do formulário
 * @param agendamentoId - ID do agendamento pai
 * @returns Array de requerentes adicionais para inserção
 */
const criarRequerentesAdicionais = (formData: FormData, agendamentoId: string): RequerenteAdicionalInsert[] => {
  const requerentes: RequerenteAdicionalInsert[] = [];
  
  formData.requerentes.forEach((requerente, index) => {
    if (index >= 3) return; // Limite de 3 requerentes
    
    const { sobrenome, nome } = separarNome(requerente.nomeCompleto);
    
    requerentes.push({
      agendamento_id: agendamentoId,
      sobrenome: sobrenome || '',
      nome: nome || '',
      nascimento: requerente.dataNascimento ? formatarData(requerente.dataNascimento) : '',
      altura_cm: requerente.altura ? parseInt(requerente.altura) : null,
      cor_olhos: requerente.corOlhos || null,
      ordem: index + 1,
    });
  });
  
  return requerentes;
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

  // Processar requerentes para CSV
  const req1 = formData.requerentes[0] ? separarNome(formData.requerentes[0].nomeCompleto) : { sobrenome: '', nome: '' };
  const req2 = formData.requerentes[1] ? separarNome(formData.requerentes[1].nomeCompleto) : { sobrenome: '', nome: '' };
  const req3 = formData.requerentes[2] ? separarNome(formData.requerentes[2].nomeCompleto) : { sobrenome: '', nome: '' };

  // Data de nascimento dos requerentes
  const req1Nascimento = formData.requerentes[0]?.dataNascimento ? formatarData(formData.requerentes[0].dataNascimento) : '';
  const req2Nascimento = formData.requerentes[1]?.dataNascimento ? formatarData(formData.requerentes[1].dataNascimento) : '';
  const req3Nascimento = formData.requerentes[2]?.dataNascimento ? formatarData(formData.requerentes[2].dataNascimento) : '';

  // Processar datas de restrição
  const dataInicio = formData.datasRestricao[0] ? formatarData(formData.datasRestricao[0]) : '';
  const dataFim = formData.datasRestricao[1] ? formatarData(formData.datasRestricao[1]) : '';
  const dataAlvo = formData.data_alvo ? formatarData(formData.data_alvo) : '';

  // Linha de dados
  const row = [
    formData.prenotamiEmail || '',
    formData.prenotamiSenha || '',
    formData.prenotamiCorOlhos || '',
    parseInt(formData.prenotamiAltura) || '',
    formatarEndereco(formData),
    formData.titularEstadoCivil || '',
    formData.qtde_filhos || '',
    '', // tipo_reserva vazio
    formData.requerentes.length || '',
    req1.sobrenome || '', req1.nome || '', req1Nascimento, formData.requerentes[0]?.altura || '', formData.requerentes[0]?.corOlhos || '',
    req2.sobrenome || '', req2.nome || '', req2Nascimento, formData.requerentes[1]?.altura || '', formData.requerentes[1]?.corOlhos || '',
    req3.sobrenome || '', req3.nome || '', req3Nascimento, formData.requerentes[2]?.altura || '', formData.requerentes[2]?.corOlhos || '',
    formData.observacoes || '',
    formData.email_otp || '',
    formData.senha_email_otp || '',
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
 * @param codigoAgendamento - Código do agendamento (5 dígitos)
 * @param nomeTitular - Nome completo do titular
 * @returns Promise com URL pública do arquivo
 */
const uploadCSV = async (csvContent: string, codigoAgendamento: string, nomeTitular: string): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Gerar nome do arquivo com timestamp, código e nome do titular
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_');
    const nomeFormatado = nomeTitular.replace(/\s+/g, '_'); // Substituir espaços por underscore
    const fileName = `agendamento_${codigoAgendamento}_${nomeFormatado}_${timestamp}.csv`;
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
 * Envia email com anexos após o agendamento
 * @param agendamento - Dados do agendamento salvo
 * @param csvUrl - URL pública do CSV no Supabase Storage
 * @returns Promise com o resultado do envio
 */
const enviarEmailAgendamento = async (agendamento: AgendamentoInsert & { codigo_agendamento: string; criado_em: string }, csvUrl: string) => {
  try {
    // Determinar a URL base da API (funciona tanto em dev quanto em produção)
    const apiBaseUrl = import.meta.env.MODE === 'production' 
      ? '/api' 
      : 'http://localhost:5173/api';
    
    const response = await fetch(`${apiBaseUrl}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agendamento,
        csvUrl
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Email enviado com sucesso:', result.messageId);
      return {
        success: true,
        messageId: result.messageId
      };
    } else {
      console.error('Erro ao enviar email:', result.error);
      return {
        success: false,
        error: result.error
      };
    }
  } catch (error) {
    console.error('Erro ao enviar email (catch):', error);
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
    
    // Inserir agendamento no Supabase
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
    
    // Inserir requerentes adicionais se houver
    if (formData.requerentes.length > 0) {
      const requerentesParaInserir = criarRequerentesAdicionais(formData, data.id);
      
      if (requerentesParaInserir.length > 0) {
        const { error: errorRequerentes } = await supabase()
          .from('requerentes_adicionais')
          .insert(requerentesParaInserir);
        
        if (errorRequerentes) {
          console.error('Erro ao salvar requerentes adicionais:', errorRequerentes);
          // Não falhar completamente se os requerentes não salvarem, mas registrar o erro
          return {
            success: true,
            data: data,
            requerentesError: errorRequerentes.message,
            csvUrl: undefined,
            csvError: null,
            error: null,
            emailResult: null
          };
        }
        
        console.log('Requerentes adicionais salvos com sucesso:', requerentesParaInserir.length);
      }
    }
    
    // Gerar CSV e fazer upload
    const csvContent = gerarCSV(formData);
    const uploadResult = await uploadCSV(csvContent, data.codigo_agendamento, formData.clienteNome);
    
    // Enviar email se o CSV foi salvo com sucesso
    let emailResult = null;
    if (uploadResult.success && uploadResult.url) {
      console.log('Enviando email de notificação...');
      emailResult = await enviarEmailAgendamento(data, uploadResult.url);
    } else if (uploadResult.error) {
      console.warn('CSV não foi salvo, email não será enviado:', uploadResult.error);
    }
    
    return {
      success: true,
      data: data,
      csvUrl: uploadResult.success ? uploadResult.url : undefined,
      csvError: uploadResult.error,
      error: null,
      emailResult: emailResult
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
      .order('criado_em', { ascending: false });
    
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