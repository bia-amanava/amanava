import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockTransactions } from '../data/mockData';
import { AlertTriangle, CheckCircle, Search, Filter, X, ArrowRight, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '../services/authService';
import { Link } from 'react-router-dom';

export function CurationControl() {
  const user = getCurrentUser();
  const isMocked = user ? user.useMock : true;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState('id');
  const [appliedSearch, setAppliedSearch] = useState('');

  const baseTransactions = isMocked ? mockTransactions : [];
  const pendingTransactions = baseTransactions.filter(tx => {
    if (tx.status !== 'pending') return false;
    if (!appliedSearch) return true;

    const term = appliedSearch.toLowerCase();
    switch (filterColumn) {
      case 'id': 
        return tx.id.toLowerCase().includes(term);
      case 'data_competencia': 
        return new Date(tx.data_competencia).toLocaleDateString('pt-BR').includes(term);
      case 'data_pendencia': 
        return tx.data_pendencia ? new Date(tx.data_pendencia).toLocaleDateString('pt-BR').includes(term) : false;
      case 'valor': {
        const formatted = tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).toLowerCase();
        const rawString = tx.valor.toString();
        return formatted.includes(term) || rawString.includes(term);
      }
      case 'categoria_pendencia': 
        return (tx.categoria_pendencia || tx.categoria).toLowerCase().includes(term);
      case 'criticidade': 
        return (tx.criticidade || 'Médio').toLowerCase().includes(term);
      case 'audit_log': 
        return (tx.audit_log || '').toLowerCase().includes(term);
      default: 
        return true;
    }
  });

  const handleFilter = () => {
    setAppliedSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    setAppliedSearch('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amanava-black">Curation Control (HITL)</h1>
          <p className="text-gray-500 mt-1">Auditoria assistida por IA. Resolva anomalias para liberar o fechamento.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-200 rounded-md px-4 py-2 flex items-center shadow-sm">
             <span className="text-sm font-medium text-gray-500 mr-2">Data Quality Score:</span>
             <span className="text-lg font-bold text-amanava-green">92%</span>
          </div>
        </div>
      </div>

      {!isMocked && (
        <Card className="border-amanava-coral/20 bg-amanava-coral/5 mb-6">
          <CardContent className="flex items-start md:items-center justify-between p-6 flex-col md:flex-row gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amanava-coral/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amanava-coral" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amanava-black">Nenhum dado para curadoria</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Você precisa realizar a ingestão de dados para listar anomalias ou revisar a classificação da IA.
                </p>
              </div>
            </div>
            <Link to="/setup" className="shrink-0">
              <button className="bg-amanava-coral hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                Ir para o Setup Center
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Pendências de Classificação ({pendingTransactions.length})</CardTitle>
          <div className="flex items-center gap-2">
             <div className="flex rounded-md shadow-sm">
                <select
                  className="px-3 py-2 border border-gray-200 rounded-l-md text-sm text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amanava-green focus:border-transparent z-10"
                  value={filterColumn}
                  onChange={(e) => setFilterColumn(e.target.value)}
                >
                  <option value="id">ID da Pendência</option>
                  <option value="data_competencia">Data da Transação</option>
                  <option value="data_pendencia">Data da Pendência</option>
                  <option value="valor">Valor</option>
                  <option value="categoria_pendencia">Categoria da Pendência</option>
                  <option value="criticidade">Criticidade</option>
                  <option value="audit_log">Alerta/Auditoria</option>
                </select>
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                  <input 
                    type="text" 
                    placeholder="Termo de busca..." 
                    className="pl-9 pr-4 py-2 border-y border-r border-gray-200 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amanava-green w-64 -ml-px z-0 relative"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                  />
                </div>
             </div>
             <Button variant="default" size="sm" className="gap-2" onClick={handleFilter}>
               <Filter className="w-4 h-4" /> Filtrar
             </Button>
             <Button variant="outline" size="sm" className="gap-2" onClick={handleClear}>
               <X className="w-4 h-4" /> Limpar
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">ID da Pendência</th>
                  <th className="px-6 py-4">Data da Transação</th>
                  <th className="px-6 py-4">Data da Pendência</th>
                  <th className="px-6 py-4">Valor (R$)</th>
                  <th className="px-6 py-4">Categoria da Pendência</th>
                  <th className="px-6 py-4">Criticidade</th>
                  <th className="px-6 py-4">Alerta da IA / Auditoria</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {tx.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-amanava-black whitespace-nowrap">
                      {new Date(tx.data_competencia).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {tx.data_pendencia ? new Date(tx.data_pendencia).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={tx.valor >= 0 ? "text-amanava-green font-medium" : "text-amanava-coral font-medium"}>
                        {tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap font-medium">
                      {tx.categoria_pendencia || tx.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.criticidade === 'Alto' ? 'bg-red-100 text-red-800' :
                        tx.criticidade === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {tx.criticidade || 'Médio'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-md">
                        <span className="flex items-start text-xs text-amanava-gold bg-amanava-gold/10 p-2 rounded-md">
                          <AlertTriangle className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" />
                          {tx.audit_log}
                        </span>
                        {tx.categoria === "Desconhecido" && (
                          <span className="text-xs text-gray-500 ml-5">
                            Sugestão IA: Classificar como 'Software/SaaS'
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm">Resolver</Button>
                    </td>
                  </tr>
                ))}
                {pendingTransactions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      <CheckCircle className="w-8 h-8 text-amanava-green mx-auto mb-2" />
                      {isMocked ? 'Nenhuma pendência encontrada. Dados 100% confiáveis.' : 'Sem dados processados na base.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
