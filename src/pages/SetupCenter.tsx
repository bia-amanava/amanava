import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Database, FileSpreadsheet, Key, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { uploadFile } from '../services/uploadService';

export function SetupCenter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus('idle');
      setUploadResult(null);
      setErrorMessage('');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadStatus('idle');
      setUploadResult(null);
      setErrorMessage('');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImportClick = async () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');
    
    try {
      const userStr = localStorage.getItem("amanava_user");
      let tenantId = 'tenant-demo';
      let userEmail = 'ricardo@amanava.com';
      
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj.email) userEmail = userObj.email;
          if (userObj.tenant_id) tenantId = userObj.tenant_id;
        } catch (e) {
          // ignore
        }
      }

      const result = await uploadFile(selectedFile, tenantId, userEmail);
      setUploadResult(result);
      setUploadStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao fazer upload');
      setUploadStatus('error');
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-amanava-black">Setup Center</h1>
        <p className="text-gray-500 mt-1">Gerencie a ingestão de dados e fontes de integração.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Protheus Integration */}
        <Card className="border-amanava-green/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <CheckCircle2 className="w-5 h-5 text-amanava-green" />
          </div>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-amanava-green/10 flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-amanava-green" />
            </div>
            <CardTitle>ERP Protheus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Conexão ativa via API REST. Sincronização automática D+1 configurada.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Última sync</span>
                <span className="font-medium text-amanava-black">Hoje, 02:00 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-amanava-green text-xs bg-amanava-green/10 px-2 py-0.5 rounded-full">Ativo</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">Configurar</Button>
          </CardContent>
        </Card>

        {/* Excel / CSV */}
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6 text-gray-600" />
            </div>
            <CardTitle>Planilhas (Excel/CSV)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Importação manual de dados complementares ou correções em lote.
            </p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".xlsx, .xls, .csv" 
              className="hidden" 
            />

            {uploadStatus === 'success' && uploadResult ? (
              <div className="bg-amanava-green/10 border border-amanava-green/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-amanava-green" />
                  <span className="font-medium text-amanava-green">{uploadResult.message}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1 mt-2">
                  <p><strong>Arquivo:</strong> {uploadResult.file_name}</p>
                  <p><strong>Upload ID:</strong> {uploadResult.upload_id}</p>
                  {uploadResult.detected_sheets && uploadResult.detected_sheets.length > 0 && (
                    <p><strong>Abas detectadas:</strong> {uploadResult.detected_sheets.join(', ')}</p>
                  )}
                  {uploadResult.inserted_counts && Object.keys(uploadResult.inserted_counts).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-amanava-green/20">
                      <strong>Registros inseridos:</strong>
                      <ul className="grid grid-cols-2 gap-1 mt-1">
                        {Object.entries(uploadResult.inserted_counts).map(([table, count]) => (
                          <li key={table} className="text-gray-600">• {table}: {count as number}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadStatus('idle');
                    setUploadResult(null);
                  }}
                >
                  Fazer novo upload
                </Button>
              </div>
            ) : (
              <>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    uploadStatus === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className={`w-6 h-6 mb-2 ${uploadStatus === 'error' ? 'text-red-400' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-amanava-black">
                    {selectedFile ? selectedFile.name : 'Arraste arquivos ou clique'}
                  </p>
                  {!selectedFile && <p className="text-xs text-gray-500 mt-1">.xlsx, .xls, .csv até 10MB</p>}
                </div>

                {uploadStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={handleImportClick}
                  disabled={uploadStatus === 'uploading'}
                >
                  {uploadStatus === 'uploading' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : selectedFile ? (
                    'Confirmar Importação'
                  ) : (
                    'Importar Arquivo'
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Custom API */}
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
              <Key className="w-6 h-6 text-gray-600" />
            </div>
            <CardTitle>API Customizada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Integração via webhook ou chamadas REST customizadas.
            </p>
            <div className="space-y-2">
               <div className="p-3 bg-gray-50 border border-gray-100 rounded-md text-xs font-mono text-gray-600 truncate">
                 https://api.amanava.com.br/v1/ingest/tenant-xx
               </div>
            </div>
            <Button variant="outline" className="w-full mt-auto">Gerar Token</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
