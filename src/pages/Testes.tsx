/**
 * Página de Testes
 * @description Use esta página para testar as funcionalidades do sistema
 */

import { TestTube } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SupabaseTest } from '@/components/SupabaseTest';
import { EmailTest } from '@/components/EmailTest';

export default function Testes() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TestTube className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Página de Testes
              </h1>
              <p className="text-gray-600 mt-1">
                Teste as funcionalidades do sistema sem precisar preencher formulários completos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Teste de Conexão Supabase */}
          <div className="col-span-1">
            <SupabaseTest />
          </div>

          {/* Teste de Envio de Email */}
          <div className="col-span-1">
            <EmailTest />
          </div>

          {/* Informações Adicionais */}
          <div className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>📝 Informações Úteis</CardTitle>
                <CardDescription>
                  Dicas para usar esta página de testes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Como usar esta página</h4>
                  <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                    <li>
                      <strong>Teste de Conexão Supabase:</strong> Verifica se você consegue se conectar ao banco de dados. Útil para diagnosticar problemas de configuração do <code className="bg-blue-100 px-1 rounded">.env.local</code>.
                    </li>
                    <li>
                      <strong>Teste de Envio de Email:</strong> Envia um email real de teste para o destino configurado. Útil para verificar se as credenciais do Gmail estão corretas antes de usar o sistema em produção.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Importante</h4>
                  <ul className="text-sm text-yellow-800 space-y-2 list-disc list-inside">
                    <li>Esta página deve ser usada apenas para testes e debugging</li>
                    <li>Os emails de teste são enviados para o mesmo destino configurado em produção</li>
                    <li>Verifique a caixa de entrada e spam ao testar emails</li>
                    <li>Não compartilhe esta página com usuários finais</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-md border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Checklist antes de usar em produção</h4>
                  <ul className="text-sm text-green-800 space-y-2 list-disc list-inside">
                    <li>✓ Conexão com Supabase funcionando</li>
                    <li>✓ Envio de email funcionando</li>
                    <li>✓ Variáveis de ambiente configuradas no Vercel</li>
                    <li>✓ App Password do Gmail gerada e configurada</li>
                    <li>✓ Tabelas do banco de dados criadas</li>
                    <li>✓ Storage do Supabase configurado</li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🔗 Links Rápidos</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div>
                      <strong>📧 Documentação de Email:</strong>{' '}
                      <a href="/EMAIL_SETUP.md" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        EMAIL_SETUP.md
                      </a>
                    </div>
                    <div>
                      <strong>🖥️ Desenvolvimento Local:</strong>{' '}
                      <a href="/LOCAL_DEV.md" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        LOCAL_DEV.md (Como testar emails localmente)
                      </a>
                    </div>
                    <div>
                      <strong>🗄️ Dashboard Supabase:</strong>{' '}
                      <a href="https://supabase.com/dashboard" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        https://supabase.com/dashboard
                      </a>
                    </div>
                    <div>
                      <strong>⚙️ Vercel Environment Variables:</strong>{' '}
                      <a href="https://vercel.com/docs/projects/environment-variables" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        Documentação Oficial
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}