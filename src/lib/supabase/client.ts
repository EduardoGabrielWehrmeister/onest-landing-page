/**
 * Cliente Supabase Singleton
 * @description Instância única do cliente Supabase para evitar múltiplas conexões
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseConfig } from './types';

/**
 * Valida se as variáveis de ambiente estão configuradas
 */
const validateEnv = (): SupabaseConfig => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'VITE_SUPABASE_URL não está definido. Verifique seu arquivo .env.local'
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'VITE_SUPABASE_ANON_KEY não está definido. Verifique seu arquivo .env.local'
    );
  }

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  };
};

/**
 * Cria e retorna a instância do cliente Supabase
 * @returns Instância do cliente Supabase
 */
export const createSupabaseClient = () => {
  const config = validateEnv();

  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
};

/**
 * Instância singleton do cliente Supabase
 * @description Use esta instância em toda a aplicação
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseInstance: any = null;

/**
 * Obtém a instância singleton do cliente Supabase
 * @returns Instância do cliente Supabase
 * @example
 * ```ts
 * import { supabase } from '@/lib/supabase/client';
 * 
 * const { data, error } = await supabase
 *   .from('services_done')
 *   .select('*');
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = (): any => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }

  return supabaseInstance;
};

/**
 * Testa a conexão com o Supabase
 * @returns Promise<boolean> - true se a conexão for bem-sucedida
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = supabase();
    const { error } = await client
      .from('services_done')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Erro ao testar conexão com Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao testar conexão com Supabase:', error);
    return false;
  }
};

/**
 * Verifica se o cliente Supabase está configurado
 * @returns boolean - true se as variáveis de ambiente estão definidas
 */
export const isConfigured = (): boolean => {
  try {
    validateEnv();
    return true;
  } catch {
    return false;
  }
};

export default supabase;