import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, Filter, ChevronDown, ChevronRight, Calendar, ArrowRightLeft, LayoutList, CalendarRange, ArrowRight, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '../services/authService';
import { Link } from 'react-router-dom';

export function DRE() {
  const user = getCurrentUser();
  const isMocked = user ? user.useMock : true;

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'receita': true,
    'custos': true,
    'despesas': true
  });
  
  const [selectedDate, setSelectedDate] = useState('2026-04');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [comparisonMode, setComparisonMode] = useState<'mom' | 'yoy'>('mom');
  const [viewMode, setViewMode] = useState<'resumo' | 'detalhada'>('resumo');

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterDimension, setFilterDimension] = useState<'cliente' | 'contrato' | 'produto' | ''>('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    cliente: '',
    contrato: '',
    produto: ''
  });

  const dimOptions = {
    cliente: ["TechCorp S/A", "Global Logistics", "Acme Inc"],
    contrato: ["CT-2025-01", "CT-2025-02", "CT-2026-03"],
    produto: ["SaaS Enterprise", "Consultoria", "Suporte Tecnológico"]
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({...prev, [id]: !prev[id]}));
  };

  const getLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const [year, month] = dateStr.split('-');
    return `${months[parseInt(month)-1]}/${year.substring(2)}`;
  };

  const getComparativeLabel = () => {
    if (!selectedDate) return '';
    const [yearStr, monthStr] = selectedDate.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    if (comparisonMode === 'mom') {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const dateStr = `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
      return getLabel(dateStr);
    } else {
      const dateStr = `${year - 1}-${month.toString().padStart(2, '0')}`;
      return getLabel(dateStr);
    }
  };

  const getDetailedMonths = (yearStr: string) => {
    if (!yearStr) return [];
    
    // As per user request: if 2026, month by month until current month. if 2025 (or past), all 12 months.
    const year = parseInt(yearStr);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let numMonths = 12;
    if (year === currentYear) {
      numMonths = currentMonth;
    } else if (year > currentYear) {
       numMonths = 0;
    }

    const monthsNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return monthsNames.slice(0, numMonths).map(m => `${m}/${yearStr.substring(2)}`);
  };

  const currentMonthLabel = getLabel(selectedDate);
  const compMonthLabel = getComparativeLabel();
  const detailedMonths = getDetailedMonths(selectedYear);

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const generateDetailedValues = (ytd: number, mes: number, numMonths: number) => {
    if (numMonths <= 1) return [mes];
    const priorTotal = ytd - mes;
    const avgPrior = priorTotal / (numMonths - 1);
    const vals = [];
    for (let i = 0; i < numMonths - 1; i++) {
        vals.push(avgPrior);
    }
    vals.push(mes);
    return vals;
  };

  const dreData = [
    { id: '1',  type: 'header', parent: 'receita', title: '1. Receita Operacional Bruta', ytd: 1780000, mes: 510000, comp: 420000, ah: '+21,4%', color: 'default' },
    { id: '1.1', type: 'child', parent: 'receita', title: 'SaaS Enterprise', ytd: 1050000, mes: 300000, comp: 250000, ah: '+20,0%', color: 'default' },
    { id: '1.2', type: 'child', parent: 'receita', title: 'Consultoria', ytd: 730000, mes: 210000, comp: 170000, ah: '+23,5%', color: 'default' },
    
    { id: '2', type: 'deduction', title: '(-) Deduções e Impostos', ytd: -284800, mes: -82000, comp: -67200, ah: '+22,0%', color: 'coral' },
    
    { id: '3', type: 'total', title: '= Receita Operacional Líquida', ytd: 1495200, mes: 428000, comp: 352800, ah: '+21,3%', color: 'default' },
    
    { id: '4', type: 'header', parent: 'custos', title: '2. Custos Diretos (CSV)', ytd: -480000, mes: -128000, comp: -122800, ah: '+4,2%', color: 'coral' },
    { id: '4.1', type: 'child', parent: 'custos', title: 'Infraestrutura Cloud', ytd: -165000, mes: -45000, comp: -42000, ah: '+7,1%', color: 'coral' },
    { id: '4.2', type: 'child', parent: 'custos', title: 'Equipe Técnica (Horas)', ytd: -315000, mes: -83000, comp: -80800, ah: '+2,7%', color: 'coral' },
  
    { id: '5', type: 'margin', title: '= Margem de Contribuição', ytd: 1015200, mes: 300000, comp: 230000, ah: '+30,4%', color: 'green', ytdMargin: '57%', mesMargin: '58%', compMargin: '54%' },
    
    { id: '6', type: 'header', parent: 'despesas', title: '3. Despesas Operacionais', ytd: -520000, mes: -140000, comp: -130000, ah: '+7,7%', color: 'coral' },
    { id: '6.1', type: 'child', parent: 'despesas', title: 'Administrativas', ytd: -230000, mes: -60000, comp: -58000, ah: '+3,4%', color: 'coral' },
    { id: '6.2', type: 'child', parent: 'despesas', title: 'Comerciais / Marketing', ytd: -290000, mes: -80000, comp: -72000, ah: '+11,1%', color: 'coral' },
    
    { id: '7', type: 'ebitda', title: '= EBITDA', ytd: 495200, mes: 160000, comp: 100000, ah: '+60,0%', color: 'ebitda', ytdMargin: '27%', mesMargin: '31%', compMargin: '23%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amanava-black">DRE Granular</h1>
          <p className="text-gray-500 mt-1">Demonstração de Resultado do Exercício com filtro multidimensional.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200 mr-2">
             <button 
               onClick={() => setViewMode('resumo')}
               className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${viewMode === 'resumo' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
             >
               <LayoutList className="w-4 h-4" /> Resumo
             </button>
             <button 
               onClick={() => setViewMode('detalhada')}
               className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${viewMode === 'detalhada' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
             >
               <CalendarRange className="w-4 h-4" /> Mês a Mês
             </button>
           </div>
           
           <Button 
             variant={showAdvancedFilters ? "default" : "outline"}
             className="gap-2"
             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
           >
             <Filter className="w-4 h-4" /> Filtros Avançados
           </Button>
           <Button variant="outline" className="gap-2">
             <Download className="w-4 h-4" /> Exportar
           </Button>
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
                <h3 className="text-lg font-bold text-amanava-black">Nenhum dado estruturado</h3>
                <p className="text-sm text-gray-600 mt-1">
                  A DRE não pode ser montada porque não há dados no banco para este usuário. Por favor, importe planilhas no Setup Center.
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

      {/* Date and Comparison Filters */}
      <div className="space-y-4">
        <Card className="bg-gray-50/50 border-dashed border-gray-200">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-1.5 flex-1 max-w-[250px]">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {viewMode === 'resumo' ? 'Período de Análise' : 'Ano de Análise'}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {viewMode === 'resumo' ? (
                  <input
                    type="month"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-solid border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amanava-green w-full bg-white"
                  />
                ) : (
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-solid border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amanava-green w-full bg-white appearance-none"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                )}
              </div>
            </div>
            {viewMode === 'resumo' && (
              <div className="space-y-1.5 flex-1 max-w-[300px] animate-in fade-in duration-300">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Modo de Comparação</label>
                <div className="relative">
                  <ArrowRightLeft className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={comparisonMode}
                    onChange={(e) => setComparisonMode(e.target.value as 'mom' | 'yoy')}
                    className="pl-9 pr-8 py-2 border border-solid border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amanava-green w-full bg-white appearance-none"
                  >
                    <option value="mom">Mês Anterior (MoM)</option>
                    <option value="yoy">Ano Anterior (YoY)</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Card className="bg-white border border-amanava-green flex-1">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1.5 flex-1 max-w-[250px]">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dimensão</label>
                <select
                  value={filterDimension}
                  onChange={(e) => setFilterDimension(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amanava-green bg-white"
                >
                  <option value="">Selecione uma dimensão...</option>
                  <option value="cliente">Cliente</option>
                  <option value="contrato">Contrato</option>
                  <option value="produto">Produto</option>
                </select>
              </div>
              
              {filterDimension && (
                <div className="space-y-1.5 flex-1 max-w-[300px]">
                  <label className="text-xs font-semibold text-amanava-green uppercase tracking-wider">
                    Opções de {filterDimension.charAt(0).toUpperCase() + filterDimension.slice(1)}
                  </label>
                  <select
                    value={filterValues[filterDimension]}
                    onChange={(e) => setFilterValues(prev => ({ ...prev, [filterDimension]: e.target.value }))}
                    className="w-full px-3 py-2 border border-amanava-green/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amanava-green bg-amanava-green/5"
                  >
                    <option value="">Todos</option>
                    {dimOptions[filterDimension].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className={`w-full text-left ${viewMode === 'resumo' ? 'text-sm' : 'text-xs'}`}>
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                <tr>
                  <th className={`${viewMode === 'resumo' ? 'px-6 py-4' : 'px-3 py-3'} ${viewMode === 'resumo' ? 'w-1/3' : 'min-w-[200px]'}`}>Estrutura</th>
                  {viewMode === 'resumo' ? (
                    <>
                      <th className="px-6 py-4 text-right">YTD (Acumulado)</th>
                      <th className="px-6 py-4 text-right">Mês Selecionado ({currentMonthLabel})</th>
                      <th className="px-6 py-4 text-right">Comparativo ({compMonthLabel})</th>
                      <th className="px-6 py-4 text-right">AH (%)</th>
                    </>
                  ) : (
                    <>
                      {detailedMonths.map(m => (
                        <th key={m} className="px-2 py-3 text-right whitespace-nowrap">{m}</th>
                      ))}
                      <th className="px-3 py-3 text-right font-bold text-amanava-black bg-blue-50/50">YTD (Acumulado)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(isMocked ? dreData : []).map(row => {
                  if (row.type === 'child' && !expandedRows[row.parent!]) return null;

                  const isHeader = row.type === 'header';
                  const isChild = row.type === 'child';
                  const isDeduction = row.type === 'deduction';
                  const isTotal = row.type === 'total';
                  const isMargin = row.type === 'margin';
                  const isEbitda = row.type === 'ebitda';
                  
                  let trClass = "hover:bg-gray-50 transition-colors";
                  if (isHeader) trClass = "bg-gray-50/50 hover:bg-gray-100 cursor-pointer";
                  if (isTotal) trClass = "bg-gray-100/50";
                  if (isMargin) trClass = "bg-amanava-green/5 border-y-2 border-amanava-green/20";
                  if (isEbitda) trClass = "bg-gray-100 border-t-2 border-gray-300";

                  let textClass = "";
                  let valClass = "";
                  if (row.color === 'coral') valClass = "text-amanava-coral";
                  if (row.color === 'green') valClass = "text-amanava-green";
                  if (row.color === 'ebitda') valClass = "text-amanava-black text-base";
                  
                  if (isHeader) {
                    textClass = "font-semibold text-gray-900";
                    valClass += " font-semibold";
                  }
                  if (isChild || isDeduction) {
                    textClass = "text-gray-600";
                    valClass += " font-medium";
                  }
                  if (isTotal || isMargin || isEbitda) {
                    textClass = `font-bold ${isEbitda && viewMode === 'resumo' ? 'text-base text-gray-900' : 'text-gray-900'}`;
                    if (isTotal || isEbitda) valClass += " font-bold";
                    if (isMargin) valClass += " font-bold text-amanava-green";
                  }

                  const toggleProps = isHeader && row.parent ? { onClick: () => toggleRow(row.parent) } : {};
                  const ahColor = parseFloat(row.ah.replace('+','').replace(',','.')) >= 0 ? 'text-amanava-green' : 'text-amanava-coral';
                  
                  let titleContent = <>{row.title}</>;
                  if (isHeader) {
                    titleContent = (
                      <div className="flex items-center gap-2">
                        {expandedRows[row.parent!] ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        {row.title}
                      </div>
                    );
                  } else if (isChild) {
                    titleContent = <span className="pl-6 sm:pl-12 border-l-2 border-transparent">{row.title}</span>;
                  } else if (isDeduction) {
                    titleContent = <span className="pl-4 sm:pl-8 font-medium text-amanava-coral">{row.title}</span>;
                  }

                  const getMarginBadge = (m?: string) => m ? <span className={`${viewMode === 'resumo' ? 'text-xs' : 'text-[10px]'} font-normal ml-1 opacity-70`}>({m})</span> : null;
                  const detailedVals = generateDetailedValues(row.ytd, row.mes, detailedMonths.length);
                  const ytdBgClass = viewMode === 'resumo' ? "bg-blue-50/30" : "";
                  const cellPadding = viewMode === 'resumo' ? 'px-6 py-3' : 'px-2 py-2';

                  return (
                    <tr key={row.id} className={trClass} {...toggleProps}>
                      <td className={`${viewMode === 'resumo' ? 'px-6 py-3' : 'px-3 py-2'} ${textClass}`}>{titleContent}</td>
                      
                      {viewMode === 'resumo' ? (
                        <>
                          <td className={`${cellPadding} text-right font-bold ${row.color === 'default' && !isTotal && !isEbitda ? 'text-gray-900' : valClass} ${ytdBgClass}`}>
                             {formatBRL(row.ytd)}{getMarginBadge((row as any).ytdMargin)}
                          </td>
                          <td className={`${cellPadding} text-right ${valClass}`}>
                             {formatBRL(row.mes)}{getMarginBadge((row as any).mesMargin)}
                          </td>
                          <td className={`${cellPadding} text-right ${valClass} ${row.color === 'coral' ? 'text-amanava-coral' : ''}`}>
                             {formatBRL(row.comp)}{getMarginBadge((row as any).compMargin)}
                          </td>
                          <td className={`${cellPadding} text-right font-medium ${row.color === 'coral' ? 'text-gray-500' : ahColor}`}>
                             {row.ah}
                          </td>
                        </>
                      ) : (
                        <>
                          {detailedVals.map((v, idx) => (
                             <td key={idx} className={`${cellPadding} text-right ${valClass} ${idx === detailedVals.length - 1 ? 'bg-gray-50/50' : ''}`}>
                                {formatBRL(v)}
                             </td>
                          ))}
                          <td className={`px-3 py-2 text-right font-bold ${valClass} bg-blue-50/50`}>
                             {formatBRL(row.ytd)}{getMarginBadge((row as any).ytdMargin)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
                {!isMocked && (
                  <tr>
                    <td colSpan={viewMode === 'resumo' ? 5 : detailedMonths.length + 2} className="px-6 py-8 text-center text-gray-500">
                      Nenhum dado importado para processar a DRE.
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
