import { useState } from 'react';
import { CloudUpload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DriveTest() {
  const [agendamentoId, setAgendamentoId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: { folderId: string; fileId: string } } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!agendamentoId || !file) {
      alert('Por favor, preencha o número do agendamento e selecione um arquivo.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Ler o arquivo como base64
      const fileContent = await fileToBase64(file);
      
      const response = await fetch('/api/test-drive-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agendamentoId,
          fileName: file.name,
          fileContent: fileContent.split(',')[1], // Remover o prefixo data:base64,
          mimeType: file.type || 'application/octet-stream'
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        console.log('✅ Upload realizado com sucesso:', data.data);
        setFile(null);
        setAgendamentoId('');
      }
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      setResult({
        success: false,
        message: 'Erro ao enviar arquivo para o Google Drive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudUpload className="h-5 w-5" />
          Teste de Upload para Google Drive
        </CardTitle>
        <CardDescription>
          Teste o envio de arquivos para o Google Drive antes de usar em produção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo Número do Agendamento */}
        <div className="space-y-2">
          <Label htmlFor="agendamento-id">Número do Agendamento</Label>
          <Input
            id="agendamento-id"
            type="text"
            placeholder="Ex: 12345"
            value={agendamentoId}
            onChange={(e) => setAgendamentoId(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            O sistema criará uma pasta chamada "agendamento_12345" dentro da pasta "Teste Arquivos"
          </p>
        </div>

        {/* Seleção de Arquivo */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Arquivo para Upload</Label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
          {file && (
            <p className="text-sm text-gray-600">
              Arquivo selecionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Botão de Upload */}
        <Button 
          onClick={handleUpload} 
          disabled={loading || !agendamentoId || !file}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando para Google Drive...
            </>
          ) : (
            <>
              <CloudUpload className="mr-2 h-4 w-4" />
              Enviar para Google Drive
            </>
          )}
        </Button>

        {/* Resultado */}
        {result && (
          <div className={`mt-4 p-4 rounded-md border ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.success ? '✅ Sucesso!' : '❌ Erro'}
                </p>
                <p className={`text-sm ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </p>
                {result.data && (
                  <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border">
                    <p><strong>Pasta ID:</strong> {result.data.folderId}</p>
                    <p><strong>Arquivo ID:</strong> {result.data.fileId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">💡 Como funciona</h4>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>O arquivo será enviado para a pasta "Teste Arquivos" no seu Google Drive</li>
            <li>Uma subpasta será criada com o nome "agendamento_[número]"</li>
            <li>O arquivo será salvo dentro dessa subpasta</li>
            <li>Verifique o console do navegador e do servidor para detalhes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}