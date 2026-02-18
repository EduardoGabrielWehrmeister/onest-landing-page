/**
 * Componente de Teste de Conexão com Supabase
 * @description Use este componente para verificar se a conexão está funcionando e testar permissões
 */

import { useConnectionTest, useLatestStats, useWritePermissionTest } from '@/hooks/use-supabase';

export const SupabaseTest = () => {
  const { isConnected, loading: connLoading, error: connError } = useConnectionTest();
  const { data: statsData, loading: statsLoading, error: statsError } = useLatestStats();
  const { testResult: permResult, loading: permLoading, runTest } = useWritePermissionTest();

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
        <div className="mb-6">
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

      {/* Teste de Permissão de Escrita */}
      {isConnected && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🔒 Teste de Segurança (Permissão de Escrita)</h3>
          <div className="p-4 rounded-md border bg-yellow-50 border-yellow-200">
            <p className="text-sm text-gray-700 mb-3">
              Este teste tenta inserir um registro no banco para verificar se a chave pública tem permissão de escrita.
              Se funcionar, significa que o RLS não está configurado corretamente.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={runTest}
                disabled={permLoading}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {permLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Testando...
                  </span>
                ) : (
                  '🧪 Testar Permissão de Escrita'
                )}
              </button>
              {permResult && (
                <div className={`text-sm font-medium ${
                  permResult.success ? 'text-red-600' : 'text-green-600'
                }`}>
                  {permResult.message}
                </div>
              )}
            </div>
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
          <li><strong>IMPORTANTE:</strong> Use o botão de teste acima para validar a segurança</li>
        </ol>
        <p className="mt-3 text-xs text-blue-700">
          Consulte o arquivo <code className="bg-blue-100 px-1 rounded">SUPABASE_SETUP.md</code> para mais detalhes.
        </p>
      </div>
    </div>
  );
};

export default SupabaseTest;