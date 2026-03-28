/**
 * Prenotami Bot Queue Service
 *
 * This service handles operations for the prenotami_bot_queue table.
 * It maps dynamic form data to the flat structure needed by the bot.
 */

import { supabase } from '@/lib/supabase/client';
import type { ApiResponse, PrenotamiBotQueue } from '@/lib/supabase/formTypes';

/**
 * Prenotami Bot Queue Service
 */
export const prenotamiBotQueueService = {
  /**
   * Insert a new record into the bot queue
   */
  async insertQueue(
    data: Partial<PrenotamiBotQueue>
  ): Promise<ApiResponse<PrenotamiBotQueue>> {
    const { data: record, error } = await supabase()
      .from('prenotami_bot_queue')
      .insert(data)
      .select()
      .single();

    return { data: record, error };
  },

  /**
   * Get pending records for bot processing
   */
  async getPendingRecords(limit = 10): Promise<ApiResponse<PrenotamiBotQueue[]>> {
    const { data, error } = await supabase()
      .from('prenotami_bot_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);

    return { data, error };
  },

  /**
   * Update record status
   */
  async updateStatus(
    id: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    botResponse?: Record<string, any>,
    errorMessage?: string
  ): Promise<ApiResponse<PrenotamiBotQueue>> {
    const updateData: any = {
      status,
      processed_at: new Date().toISOString(),
    };

    if (botResponse) {
      updateData.bot_response = botResponse;
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { data: record, error } = await supabase()
      .from('prenotami_bot_queue')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    return { data: record, error };
  },

  /**
   * Get record by ID
   */
  async getById(id: string): Promise<ApiResponse<PrenotamiBotQueue>> {
    const { data, error } = await supabase()
      .from('prenotami_bot_queue')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },
};

/**
 * Helper function to map dynamic form data to bot queue structure
 * This converts the form's dynamic structure to the flat structure needed by the bot
 */
export const mapFormToBotQueue = (
  formData: Record<string, any>,
  requerentesAdicionais: any[] = []
): Partial<PrenotamiBotQueue> => {
  // Extract address fields and concatenate
  const enderecoParts = [];
  if (formData.titularLogradouro) enderecoParts.push(formData.titularLogradouro);
  if (formData.titularNumero) enderecoParts.push(formData.titularNumero);
  if (formData.titularComplemento) enderecoParts.push(formData.titularComplemento);
  if (formData.titularBairro) enderecoParts.push(formData.titularBairro);
  if (formData.titularCidade) enderecoParts.push(formData.titularCidade);
  if (formData.titularEstado) enderecoParts.push(formData.titularEstado);
  
  const endereco = enderecoParts.join(' ') || undefined;

  // Map additional applicants (requerentes adicionais)
  const adic1 = requerentesAdicionais[0] || {};
  const adic2 = requerentesAdicionais[1] || {};
  const adic3 = requerentesAdicionais[2] || {};

  // Convert altura from string to number if needed
  const altura_cm = formData.prenotamiAltura 
    ? parseInt(String(formData.prenotamiAltura), 10) 
    : undefined;

  // Parse dates from calendar_multiple field
  let data_inicio_restricao: string | undefined;
  let data_fim_restricao: string | undefined;
  let data_alvo: string | undefined;

  if (formData.datasRestricao && Array.isArray(formData.datasRestricao)) {
    // If we have an array of dates, the first one could be start, last one could be end
    if (formData.datasRestricao.length > 0) {
      data_inicio_restricao = formData.datasRestricao[0];
      if (formData.datasRestricao.length > 1) {
        data_fim_restricao = formData.datasRestricao[formData.datasRestricao.length - 1];
      }
    }
  } else if (typeof formData.datasRestricao === 'string') {
    // If it's a single date string
    data_inicio_restricao = formData.datasRestricao;
  }

  // Map the data to the bot queue structure
  const botQueueData: Partial<PrenotamiBotQueue> = {
    // Titular fields
    email: formData.prenotamiEmail || undefined,
    senha: formData.prenotamiSenha || undefined,
    cor_olhos: formData.prenotamiCorOlhos || undefined,
    altura_cm: altura_cm || undefined,
    endereco: endereco,
    estado_civil: formData.titularEstadoCivil || undefined,
    qtde_filhos: formData.titularQtdeFilhos ? parseInt(formData.titularQtdeFilhos, 10) : 0,
    tipo_reserva: formData.tipoReserva || undefined,
    
    // Additional applicants count
    qtde_requerentes_adicionais: requerentesAdicionais.length,
    
    // Additional applicant 1
    adic_1_sobrenome: adic1.sobrenome || undefined,
    adic_1_nome: adic1.nome || undefined,
    adic_1_nascimento: adic1.dataNascimento || undefined,
    adic_1_altura_cm: adic1.altura ? parseInt(adic1.altura, 10) : undefined,
    adic_1_cor_olhos: adic1.corOlhos || undefined,
    
    // Additional applicant 2
    adic_2_sobrenome: adic2.sobrenome || undefined,
    adic_2_nome: adic2.nome || undefined,
    adic_2_nascimento: adic2.dataNascimento || undefined,
    adic_2_altura_cm: adic2.altura ? parseInt(adic2.altura, 10) : undefined,
    adic_2_cor_olhos: adic2.corOlhos || undefined,
    
    // Additional applicant 3
    adic_3_sobrenome: adic3.sobrenome || undefined,
    adic_3_nome: adic3.nome || undefined,
    adic_3_nascimento: adic3.dataNascimento || undefined,
    adic_3_altura_cm: adic3.altura ? parseInt(adic3.altura, 10) : undefined,
    adic_3_cor_olhos: adic3.corOlhos || undefined,
    
    // Notes and OTP
    anotacoes: formData.observacoes || undefined,
    email_otp: formData.emailOtp || undefined,
    senha_email_otp: formData.senhaEmailOtp || undefined,
    
    // Dates
    data_inicio_restricao: data_inicio_restricao,
    data_fim_restricao: data_fim_restricao,
    data_alvo: data_alvo,
    
    // Initial status
    status: 'pending',
  };

  return botQueueData;
};