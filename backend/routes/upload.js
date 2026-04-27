const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadService = require('../services/uploadService');

// Usamos o memory storage do multer para manter o arquivo na memória
// e passá-lo como buffer para o xlsx
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado no campo "file"' });
    }

    // Fallback temporário de tenant e user
    const tenantId = req.body.tenant_id || 'tenant-demo';
    const userEmail = req.body.user_email || 'ricardo@amanava.com';

    // Chama o serviço
    const result = await uploadService.processUpload(req.file, tenantId, userEmail);

    res.json(result);
  } catch (error) {
    console.error("Erro na rota de upload:", error);
    res.status(500).json({ error: "Erro interno ao processar o upload." });
  }
});

module.exports = router;
