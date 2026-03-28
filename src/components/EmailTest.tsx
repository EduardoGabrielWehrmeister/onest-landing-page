/**
 * Componente de Teste de Envio de Email
 * @description Use este componente para testar se o envio de emails está funcionando
 */

import { useState } from 'react';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const EmailTest = () => {
  const [message, setMessage] = useState('Teste de envio de email pelo sistema Onesta!');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    messageId?: string;
    error?: string;
  }>({});

  const handleSendTestEmail = async () => {
    setLoading(true);
    setResult({});

    try {
      // Determinar a URL base da API
      const apiBaseUrl = import.meta.env.MODE === 'production' 
        ? '/api' 
        : 'http://localhost:5173/api';

        console.log("Esse é o valor de 'apiBaseUrl':", apiBaseUrl)

      // Dados simulados de um agendamento para teste
      const testAgendamento = {
        id: 'test-id-' + Date.now(),
        codigo_agendamento: 'TESTE',
        titular_nome_completo: 'Cliente de Teste',
        titular_email: 'teste@exemplo.com',
        titular_senha: 'senha-teste',
        titular_cor_olhos: 'Castanho',
        titular_altura_cm: 175,
        titular_endereco: 'Rua de Teste, 123 - São Paulo - SP',
        titular_estado_civil: 'Solteiro',
        titular_qtde_filhos: 0,
        assessor_nome_completo: null,
        assessor_email: null,
        assessor_telefone: null,
        anotacoes: message,
        email_otp: null,
        senha_email_otp: null,
        data_alvo: null,
        data_inicio_restricao: null,
        data_fim_restricao: null,
        criado_em: new Date().toISOString()
      };

      // Simular URL de CSV (não precisa ser real para teste de email)
      const testCsvUrl = 'https://example.com/test.csv';

      const response = await fetch(`${apiBaseUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agendamento: testAgendamento,
          csvUrl: testCsvUrl
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          messageId: data.messageId
        });
      } else {
        setResult({
          success: false,
          error: data.error || 'Erro desconhecido ao enviar email'
        });
      }
    } catch (error) {
      console.error('Erro ao enviar email de teste:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão com a API'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Teste de Envio de Email
        </CardTitle>
        <CardDescription>
          Teste se o sistema de envio de emails está funcionando corretamente.
          Não depende do banco de dados, apenas testa a API de email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo de Mensagem de Teste */}
        <div className="space-y-2">
          <Label htmlFor="test-message">Mensagem de Teste</Label>
          <Input
            id="test-message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite uma mensagem para o email de teste..."
            disabled={loading}
          />
        </div>

        {/* Botão de Enviar */}
        <Button
          onClick={handleSendTestEmail}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Email de Teste
            </>
          )}
        </Button>

        {/* Resultado */}
        {result.success === true && (
          <div className="flex items-start gap-3 p-4 rounded-md bg-green-50 border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-900">✅ Email enviado com sucesso!</p>
              <p className="text-sm text-green-700 mt-1">
                Verifique a caixa de entrada de <code className="bg-green-100 px-1 rounded">
                  contatocolorirdivertido@gmail.com
                </code>
              </p>
              {result.messageId && (
                <p className="text-xs text-green-600 mt-2">
                  ID da Mensagem: {result.messageId}
                </p>
              )}
            </div>
          </div>
        )}

        {result.success === false && result.error && (
          <div className="flex items-start gap-3 p-4 rounded-md bg-red-50 border border-red-200">
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">❌ Erro ao enviar email</p>
              <p className="text-sm text-red-700 mt-1">{result.error}</p>
              <div className="mt-3 p-3 bg-red-100 rounded text-xs text-red-800">
                <p className="font-semibold mb-1">Possíveis causas:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Variáveis de ambiente não configuradas</li>
                  <li>App Password do Gmail incorreta</li>
                  <li>Autenticação de 2 fatores não ativada</li>
                  <li>Problema de conexão com o servidor SMTP</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">💡 Informações:</p>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Este teste envia um email real para o destino configurado</li>
            <li>O email contém dados simulados de um agendamento</li>
            <li>Não são salvos dados no banco de dados</li>
            <li>Útil para verificar se as credenciais do Gmail estão corretas</li>
          </ul>
        </div>

        {/* Aviso sobre Desenvolvimento */}
        <div className="p-4 bg-orange-50 rounded-md border border-orange-200">
          <h4 className="font-semibold text-orange-900 mb-2">⚠️ Atenção: Desenvolvimento Local</h4>
          <p className="text-sm text-orange-800 mb-2">
            Em desenvolvimento local com Vite, a API de email não funciona diretamente.
          </p>
          <p className="text-xs text-orange-700 font-semibold mb-2">
            Para testar o envio de email localmente, você deve:
          </p>
          <ol className="text-xs text-orange-800 space-y-1 list-decimal list-inside">
            <li>Instalar o Vercel CLI: <code className="bg-orange-100 px-1 rounded">npm i -g vercel</code></li>
            <li>Executar com: <code className="bg-orange-100 px-1 rounded">vercel dev</code></li>
            <li>Em produção no Vercel, funciona automaticamente</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTest;