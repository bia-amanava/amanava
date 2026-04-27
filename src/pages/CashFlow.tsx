import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Download, Calendar, ArrowRightLeft, CalendarDays, TrendingDown, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getCurrentUser } from '../services/authService';
import { Link } from 'react-router-dom';

export function CashFlow() {
  const user = getCurrentUser();
  const isMocked = user ? user.useMock : true;

  const [analysisType, setAnalysisType] = useState<'mensal' | 'semanal' | 'projecao'>('projecao');
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [selectedWeek, setSelectedWeek] = useState('1');
  
  // Parâmetros de Simulação
  const [projectionDays, setProjectionDays] = useState(90);
  const [defaultRate, setDefaultRate] = useState(5); // % de inadimplência

  const { data: projectedData, totalInflows, totalOutflows, finalBalance } = useMemo(() => {
    if (!isMocked) {
      return { data: [], totalInflows: 0, totalOutflows: 0, finalBalance: 0 };
    }
    
    let currentBal = 340500;
    let tIn = 0;
    let tOut = 0;
    const pts = [];
    
    // Determina os passos de acordo com o tipo de análise selecionado
    // Se for 'semanal', mostramos de 7 dias (ex: dia a dia). Se for 'mensal', 30 dias (de 5 em 5). Se projecao, X dias.
    let steps = 6; // 30 dias = 6 passos de 5 dias
    let stepDays = 5;
    let labelPrefix = 'Dia ';
    
    if (analysisType === 'semanal') {
      steps = 7;
      stepDays = 1;
      labelPrefix = 'Semana Dia ';
    } else if (analysisType === 'mensal') {
      steps = 6;
      stepDays = 5;
    } else {
      steps = projectionDays / 5;
      stepDays = 5;
    }

    for (let i = 1; i <= steps; i++) {
      // Mock base numbers, psuedo-random sequence based on 'i' so it looks realistic
      const baseInflow = 40000 + (Math.sin(i * 1.5) * 20000) + (i * 2000); 
      const outflow = 35000 + (Math.cos(i * 2) * 15000) + (i * 1000);   
      
      const adjustedInflow = baseInflow * (1 - (defaultRate / 100));

      currentBal += (adjustedInflow - outflow);
      tIn += adjustedInflow;
      tOut += outflow;

      pts.push({
          day: `${labelPrefix}${i * stepDays}`,
          inflows: Math.round(adjustedInflow),
          outflows: -Math.round(outflow),
          balance: Math.round(currentBal)
      });
    }

    return { 
      data: pts, 
      totalInflows: Math.round(tIn), 
      totalOutflows: Math.round(tOut),
      finalBalance: Math.round(currentBal)
    };
  }, [projectionDays, defaultRate, analysisType, isMocked]);

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amanava-black">Fluxo de Caixa Projetado</h1>
          <p className="text-gray-500 mt-1">Análise temporal de entradas e saídas e simulação de inadimplência.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="gap-2">
             <Download className="w-4 h-4" /> Exportar Relatório
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
                <h3 className="text-lg font-bold text-amanava-black">Caixa Zerado</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Não existem movimentações para projetar o fluxo de caixa. Realize a importação dos arquivos base.
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

      <Card className="bg-gray-50/50 border-dashed border-gray-200">
        <CardContent className="p-4 flex flex-col lg:flex-row gap-6 items-end">
          <div className="flex flex-col sm:flex-row gap-4 w-full flex-wrap">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo de Análise</label>
              <div className="relative">
                <ArrowRightLeft className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value as any)}
                  className="pl-9 pr-8 py-2 border border-solid border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amanava-green w-full bg-white appearance-none"
                >
                  <option value="mensal">Mensal</option>
                  <option value="semanal">Semanal</option>
                  <option value="projecao">Cenário Futuro (Projeção)</option>
                </select>
              </div>
            </div>
            
            {(analysisType === 'mensal' || analysisType === 'semanal') && (
              <div className="space-y-1.5 flex-1 min-w-[200px] animate-in fade-in duration-200">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mês Base
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-solid border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amanava-green w-full bg-white"
                  />
                </div>
              </div>
            )}

            {analysisType === 'semanal' && (
              <div className="space-y-1.5 flex-1 min-w-[200px] animate-in fade-in slide-in-from-left-2 duration-200">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Semana do Mês
                </label>
                <div className="relative">
                  <CalendarDays className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-solid border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amanava-green w-full bg-white appearance-none"
                  >
                    <option value="1">Semana 1 (Dias 1 a 7)</option>
                    <option value="2">Semana 2 (Dias 8 a 14)</option>
                    <option value="3">Semana 3 (Dias 15 a 21)</option>
                    <option value="4">Semana 4 (Dias 22 a 28)</option>
                    <option value="5">Semana 5 (Dias 29 em diante)</option>
                  </select>
                </div>
              </div>
            )}

            {analysisType === 'projecao' && (
              <>
                <div className="space-y-1.5 flex-1 min-w-[200px] animate-in fade-in duration-200">
                  <label className="text-xs font-semibold text-amanava-green uppercase tracking-wider">
                    Horizonte da Projeção
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-amanava-green absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={projectionDays}
                      onChange={(e) => setProjectionDays(Number(e.target.value))}
                      className="pl-9 pr-8 py-2 border border-solid border-amanava-green/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amanava-green w-full bg-amanava-green/5 appearance-none"
                    >
                      <option value={30}>Até 30 dias</option>
                      <option value={60}>Até 60 dias</option>
                      <option value={90}>Até 90 dias</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 min-w-[200px] animate-in fade-in duration-200">
                  <label className="text-xs font-semibold flex justify-between uppercase tracking-wider">
                    <span className="text-amanava-coral">Inadimplência Projetada</span>
                    <span className="text-amanava-coral font-bold">{defaultRate}%</span>
                  </label>
                  <div className="flex items-center h-[38px] gap-3">
                    <TrendingDown className="w-4 h-4 text-amanava-coral shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={defaultRate}
                      onChange={(e) => setDefaultRate(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amanava-coral"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

       <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saldo Atual (Caixa)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{isMocked ? 'R$ 340.500' : 'R$ 0'}</div>
            <p className="text-xs text-gray-500 mt-1">Status na conta real</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amanava-green">{formatBRL(totalInflows)}</div>
            <p className="text-xs text-gray-500 mt-1">Previsto no período ({analysisType === 'projecao' ? `${projectionDays} dias` : analysisType})</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Saídas</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-amanava-coral">{formatBRL(totalOutflows)}</div>
             <p className="text-xs text-gray-500 mt-1">Despesas programadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Ponto de Equilíbrio</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-gray-900">{formatBRL(Math.abs(totalOutflows))}</div>
             <p className="text-xs text-gray-500 mt-1">Receita mínima necessária</p>
          </CardContent>
        </Card>
        <Card className="bg-amanava-black text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Saldo Projetado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatBRL(finalBalance)}</div>
            <p className="text-xs text-amanava-gold mt-1">Perspectiva final do período</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Evolução e Tendência do Caixa ({analysisType === 'projecao' ? `Próximos ${projectionDays} dias` : analysisType})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={projectedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(value) => `R$${value/1000}k`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatBRL(value)}
                />
                <Legend iconType="circle" />
                <ReferenceLine y={0} yAxisId="left" stroke="#000" />
                
                <Bar yAxisId="left" dataKey="inflows" name="Entradas" fill="#2C7464" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar yAxisId="left" dataKey="outflows" name="Saídas" fill="#FEA5A4" radius={[4, 4, 0, 0]} barSize={20} />
                
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="balance" 
                  name="Linha de Tendência (Caixa)" 
                  stroke="#1e3a8a" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 6 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
