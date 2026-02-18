/**
 * Componente de Teste de Conexão com Supabase
 * @description Use este componente para verificar se a conexão está funcionando
 */

import { useConnectionTest, useLatestStats } from '@/hooks/use-supabase';

export const SupabaseTest = () => {
  const { isConnected, loading: connLoading, error: connError } = useConnectionTest();
  const { data: statsData, loading: statsLoading, error: statsError } = useLatestStats();

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🔌 Teste de Conexão Supabase
      </h2>

      {/* Status da Conexão */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Status da Conexão</h3>
        <div className="p-4 rounded-md border">
          {connLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
              <span>Testando conexão...</span>
            </div>
          )}
          {!connLoading && isConnected && (
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-2xl">✅</span>
              <span className="font-medium">Conectado ao Supabase com sucesso!</span>
            </div>
          )}
          {!connLoading && !isConnected && (
            <div className="flex items-start gap-2 text-red-600">
              <span className="text-2xl">❌</span>
              <div>
                <span className="font-medium">Erro de conexão</span>
                <p className="text-sm mt-1">{connError || 'Erro desconhecido'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dados de Teste */}
      {isConnected && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Dados de Estatísticas</h3>
          <div className="p-4 rounded-md border bg-gray-50">
            {statsLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                <span>Buscando dados...</span>
              </div>
            )}
            {!statsLoading && statsError && (
              <div className="text-red-600">
                <span className="font-medium">Erro ao buscar dados:</span>
                <p className="text-sm mt-1">{statsError}</p>
              </div>
            )}
            {!statsLoading && !statsError && statsData && !Array.isArray(statsData) && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Ano:</span>
                    <p className="font-bold text-lg">{statsData.year}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Total:</span>
                    <p className="font-bold text-lg text-primary">{statsData.total?.toLocaleString('pt-BR')}+</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Passaporte:</span>
                    <p className="font-semibold">{statsData.passaporte?.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Cidadania Fila:</span>
                    <p className="font-semibold">{statsData.cidadania_fila?.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Identidade:</span>
                    <p className="font-semibold">{statsData.identidade?.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Cidadania Menores:</span>
                    <p className="font-semibold">{statsData.cidadania_menores?.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Outros:</span>
                    <p className="font-semibold">{statsData.outros?.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Total Prenotami:</span>
                    <p className="font-semibold">{statsData.total_prenotami?.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                {statsData.comments && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-600">Comentários:</span>
                    <p className="text-sm italic text-gray-700">{statsData.comments}</p>
                  </div>
                )}
              </div>
            )}
            {!statsLoading && !statsError && statsData && Array.isArray(statsData) && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-2">Encontrados {statsData.length} registro(s):</p>
                {statsData.map((item) => (
                  <div key={item.id} className="p-3 border rounded bg-white">
                    <p className="font-semibold">Ano: {item.year}</p>
                    <p className="text-sm">Total: {item.total?.toLocaleString('pt-BR')}+</p>
                  </div>
                ))}
              </div>
            )}
            {!statsLoading && !statsError && !statsData && (
              <p className="text-gray-600">Nenhum dado encontrado. Insira dados na tabela `services_done`.</p>
            )}
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Instruções</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Configure as variáveis de ambiente no arquivo <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
          <li>Crie a tabela <code className="bg-blue-100 px-1 rounded">services_done</code> no Supabase</li>
          <li>Habilite o Row Level Security (RLS)</li>
          <li>Crie uma política de leitura pública</li>
          <li>Insira dados de teste na tabela</li>
        </ol>
        <p className="mt-3 text-xs text-blue-700">
          Consulte o arquivo <code className="bg-blue-100 px-1 rounded">SUPABASE_SETUP.md</code> para mais detalhes.
        </p>
      </div>
    </div>
  );
};

export default SupabaseTest;