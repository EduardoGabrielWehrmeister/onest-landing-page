/**
 * API Route para envio de emails
 * Usa NodeMailer para enviar emails via SMTP (Gmail)
 * 
 * Endpoint: POST /api/send-email
 */

import nodemailer from 'nodemailer';

/**
 * Tipo para os dados do agendamento
 */
interface AgendamentoData {
  id: string;
  codigo_agendamento: string;
  titular_nome_completo: string;
  titular_email: string;
  titular_senha: string;
  titular_cor_olhos: string;
  titular_altura_cm: number;
  titular_endereco: string;
  titular_estado_civil: string;
  titular_qtde_filhos: number;
  assessor_nome_completo: string | null;
  assessor_email: string | null;
  assessor_telefone: string | null;
  anotacoes: string | null;
  email_otp: string | null;
  senha_email_otp: string | null;
  data_alvo: string | null;
  data_inicio_restricao: string | null;
  data_fim_restricao: string | null;
  criado_em: string;
}

// Configurar transportador SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Gera arquivo TXT formatado com dados do agendamento
 */
function gerarTxt(agendamento: AgendamentoData): string {
  let txt = `AGENDAMENTO #${agendamento.codigo_agendamento}\n`;
  txt += `${'='.repeat(30)}\n\n`;
  
  txt += `DADOS DO CLIENTE\n`;
  txt += `${'-'.repeat(20)}\n`;
  txt += `Nome Completo: ${agendamento.titular_nome_completo}\n`;
  txt += `Email: ${agendamento.titular_email}\n`;
  txt += `Senha Prenotami: ${agendamento.titular_senha}\n`;
  txt += `Cor dos Olhos: ${agendamento.titular_cor_olhos}\n`;
  txt += `Altura: ${agendamento.titular_altura_cm} cm\n`;
  txt += `Endereço: ${agendamento.titular_endereco}\n`;
  txt += `Estado Civil: ${agendamento.titular_estado_civil}\n`;
  txt += `Qtd. Filhos: ${agendamento.titular_qtde_filhos}\n\n`;
  
  if (agendamento.assessor_nome_completo) {
    txt += `DADOS DO ASSESSOR\n`;
    txt += `${'-'.repeat(20)}\n`;
    txt += `Nome: ${agendamento.assessor_nome_completo}\n`;
    txt += `Email: ${agendamento.assessor_email}\n`;
    txt += `Telefone: ${agendamento.assessor_telefone}\n\n`;
  }
  
  txt += `INFORMAÇÕES ADICIONAIS\n`;
  txt += `${'-'.repeat(30)}\n`;
  txt += `Observações: ${agendamento.anotacoes || 'Nenhuma'}\n`;
  txt += `Email OTP: ${agendamento.email_otp || 'Não informado'}\n`;
  txt += `Senha Email OTP: ${agendamento.senha_email_otp || 'Não informado'}\n`;
  txt += `Data Alvo: ${agendamento.data_alvo || 'Não informada'}\n`;
  txt += `Período de Restrição: ${agendamento.data_inicio_restricao || 'N/A'} a ${agendamento.data_fim_restricao || 'N/A'}\n\n`;
  
  txt += `DATA DE CRIAÇÃO\n`;
  txt += `${'-'.repeat(20)}\n`;
  txt += `${agendamento.criado_em}\n\n`;
  
  txt += `Gerado automaticamente pelo sistema Onesta`;
  
  return txt;
}

/**
 * Baixa arquivo de uma URL (CSV do Supabase Storage)
 */
async function baixarArquivo(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao baixar arquivo: ${response.statusText}`);
  }
  return await response.text();
}

/**
 * Gera corpo do email
 */
function gerarCorpoEmail(agendamento: AgendamentoData): string {
  return `Olá!

Um novo agendamento foi criado no sistema.

Código do Agendamento: ${agendamento.codigo_agendamento}
Nome do Cliente: ${agendamento.titular_nome_completo}
Data do Agendamento: ${new Date(agendamento.criado_em).toLocaleString('pt-BR')}

Em anexo seguem:
- Arquivo TXT com informações detalhadas do cliente e assessor
- Arquivo CSV com todos os dados do formulário

Atenciosamente,
Equipe Onesta`;
}

/**
 * Handler principal da API
 */
export default async function handler(request: Request) {
  try {
    // Verificar método HTTP
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Método não permitido. Use POST.' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parsear body
    const body = await request.json();
    const { agendamento, csvUrl } = body;

    // Validar dados
    if (!agendamento || !agendamento.codigo_agendamento) {
      return new Response(
        JSON.stringify({ success: false, error: 'Dados do agendamento inválidos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!csvUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL do CSV não fornecida' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Gerar arquivo TXT
    const txtContent = gerarTxt(agendamento);

    // 2. Baixar CSV do Storage
    const csvContent = await baixarArquivo(csvUrl);

    // 3. Preparar nome do titular para uso no nome do arquivo
    const nomeTitularFormatado = agendamento.titular_nome_completo
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');

    console.log('Enviando email para:', process.env.EMAIL_DESTINO);
    console.log('De:', process.env.EMAIL_FROM);

    // 4. Enviar email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_DESTINO,
      subject: `Novo Agendamento - ${agendamento.titular_nome_completo} - ${agendamento.codigo_agendamento}`,
      text: gerarCorpoEmail(agendamento),
      attachments: [
        {
          filename: `agendamento_${agendamento.codigo_agendamento}_${nomeTitularFormatado}.txt`,
          content: txtContent,
        },
        {
          filename: `agendamento_${agendamento.codigo_agendamento}_${nomeTitularFormatado}.csv`,
          content: csvContent,
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email enviado com sucesso:', info.messageId);
    console.log('Resposta do servidor:', info.response);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: info.messageId,
        response: info.response 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}