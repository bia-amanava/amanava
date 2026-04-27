const db = require('../database/db');
const xlsx = require('xlsx');
const { processExcelWorkbook } = require('./excelImportService');

async function processUpload(file, tenantId, userEmail) {
  return new Promise((resolve, reject) => {
    const fileName = file.originalname;
    const fileType = file.mimetype;
    
    // Identifica se é um arquivo Excel pela extensão ou pelo mimetype
    const isExcel = fileType.includes('spreadsheetml') || fileType.includes('excel') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    
    // Registra o upload na tabela uploads
    const sql = `
      INSERT INTO uploads (tenant_id, user_email, file_name, file_type, upload_status)
      VALUES (?, ?, ?, ?, 'uploaded')
    `;
    
    db.run(sql, [tenantId, userEmail, fileName, fileType], async function(err) {
      if (err) {
        return reject(err);
      }
      
      const uploadId = this.lastID;
      let detectedSheets = [];
      
      if (isExcel) {
        try {
          // Lê o arquivo do buffer
          const workbook = xlsx.read(file.buffer, { type: 'buffer' });
          detectedSheets = workbook.SheetNames;
          
          // Ingestão real
          const insertedCounts = await processExcelWorkbook(workbook, tenantId, uploadId);

          // Atualizar o status para processed
          db.run("UPDATE uploads SET upload_status = 'processed' WHERE id = ?", [uploadId], (updateErr) => {
             if(updateErr) {
               console.error("Erro ao atualizar o status do upload:", updateErr);
             }
             
             resolve({
                upload_id: uploadId,
                file_name: fileName,
                detected_sheets: detectedSheets,
                inserted_counts: insertedCounts,
                message: "Upload processado e dados inseridos com sucesso"
             });
          });
          
        } catch (error) {
          console.error("Erro ao processar o arquivo Excel:", error);
          db.run("UPDATE uploads SET upload_status = 'failed' WHERE id = ?", [uploadId]);
          return reject(error);
        }
      } else {
        // Caso CSV, assume que o array de sheets está vazio
        db.run("UPDATE uploads SET upload_status = 'processed' WHERE id = ?", [uploadId], (updateErr) => {
           resolve({
            upload_id: uploadId,
            file_name: fileName,
            detected_sheets: [],
            inserted_counts: {},
            message: "Upload de CSV registrado com sucesso (Ingestão genérica simples)"
           });
        });
      }
    });
  });
}

module.exports = { processUpload };
