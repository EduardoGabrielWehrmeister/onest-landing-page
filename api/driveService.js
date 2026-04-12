import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const DRIVE_FOLDER_ID = '1daDXqLzdDQLlegaA2esrx8Eo0da0e3M4'; // ID da pasta "Teste Arquivos"

// Carregar credenciais do Service Account
const credentialsPath = join(process.cwd(), 'api', 'onesta-testes-4851879804d5.json');

// ======================================================
// AUTENTICAÇÃO
// ======================================================

function getAuth() {
  try {
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
    
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
    
    return auth;
  } catch (error) {
    console.error('❌ Erro ao carregar credenciais do Google Drive:', error);
    throw new Error('Não foi possível autenticar com Google Drive');
  }
}

// ======================================================
// FUNÇÕES DO DRIVE
// ======================================================

/**
 * Cria uma subpasta dentro da pasta "Teste Arquivos"
 * @param {string} folderName - Nome da pasta (ex: "agendamento_12345")
 * @returns {Promise<string>} ID da pasta criada
 */
async function createSubFolder(folderName) {
  try {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });
    
    const folderMetadata = {
      name: folderName,
      parents: [DRIVE_FOLDER_ID],
      mimeType: 'application/vnd.google-apps.folder'
    };
    
    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });
    
    console.log(`✅ Pasta criada no Drive: ${folderName} (ID: ${folder.data.id})`);
    return folder.data.id;
  } catch (error) {
    console.error('❌ Erro ao criar pasta no Drive:', error);
    throw error;
  }
}

/**
 * Faz upload de um arquivo para uma pasta específica no Drive
 * @param {string} fileName - Nome do arquivo
 * @param {string|Buffer} fileContent - Conteúdo do arquivo (string ou buffer)
 * @param {string} mimeType - MIME type do arquivo
 * @param {string} folderId - ID da pasta onde será salvo
 * @returns {Promise<string>} ID do arquivo criado
 */
async function uploadFile(fileName, fileContent, mimeType, folderId) {
  try {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });
    
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };
    
    const media = {
      mimeType: mimeType,
      body: Readable.from(Buffer.from(fileContent))
    };
    
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
    
    console.log(`✅ Arquivo enviado para Drive: ${fileName} (ID: ${file.data.id})`);
    return file.data.id;
  } catch (error) {
    console.error(`❌ Erro ao enviar arquivo ${fileName} para Drive:`, error);
    throw error;
  }
}

/**
 * Processa o upload completo de agendamento para o Drive
 * Cria uma subpasta e envia os arquivos
 * @param {string} agendamentoId - ID do agendamento
 * @param {string} txtContent - Conteúdo do arquivo TXT
 * @param {string} csvContent - Conteúdo do arquivo CSV
 * @returns {Promise<{folderId: string, txtId: string, csvId: string}>}
 */
async function uploadAgendamentoToDrive(agendamentoId, txtContent, csvContent) {
  try {
    const folderName = `agendamento_${agendamentoId}`;
    
    // Criar subpasta
    const folderId = await createSubFolder(folderName);
    
    // Upload do arquivo TXT
    const txtId = await uploadFile(
      `agendamento_${agendamentoId}.txt`,
      txtContent,
      'text/plain',
      folderId
    );
    
    // Upload do arquivo CSV
    const csvId = await uploadFile(
      `agendamento_${agendamentoId}.csv`,
      csvContent,
      'text/csv',
      folderId
    );
    
    console.log(`✅ Upload completo para Drive (Agendamento #${agendamentoId})`);
    
    return {
      folderId,
      txtId,
      csvId
    };
  } catch (error) {
    console.error('❌ Erro no upload completo para Drive:', error);
    throw error;
  }
}

/**
 * Faz upload de um único arquivo para uma subpasta de agendamento
 * @param {string} agendamentoId - ID do agendamento
 * @param {string} fileName - Nome do arquivo
 * @param {Buffer|string} fileContent - Conteúdo do arquivo
 * @param {string} mimeType - MIME type do arquivo
 * @returns {Promise<{folderId: string, fileId: string}>}
 */
async function uploadSingleFileToDrive(agendamentoId, fileName, fileContent, mimeType) {
  try {
    const folderName = `agendamento_${agendamentoId}`;
    
    // Criar subpasta
    const folderId = await createSubFolder(folderName);
    
    // Upload do arquivo
    const fileId = await uploadFile(fileName, fileContent, mimeType, folderId);
    
    console.log(`✅ Upload completo para Drive (Agendamento #${agendamentoId}, Arquivo: ${fileName})`);
    
    return {
      folderId,
      fileId
    };
  } catch (error) {
    console.error('❌ Erro no upload de arquivo para Drive:', error);
    throw error;
  }
}

// ======================================================
// EXPORT
// ======================================================

export {
  createSubFolder,
  uploadFile,
  uploadAgendamentoToDrive,
  uploadSingleFileToDrive
};