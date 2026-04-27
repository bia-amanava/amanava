import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { dreData, patrimonioData } from '../data/mockData';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, Wallet, ArrowRight, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '../services/authService';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const user = getCurrentUser();
  const isMocked = user ? user.useMock : true;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-amanava-black">Dashboard Resumo</h1>
        <p className="text-gray-500 mt-1">Visão geral executiva da saúde financeira da sua PME.</p>
      </div>

      {!isMocked && (
        <Card className="border-amanava-coral/20 bg-amanava-coral/5 mb-6">
          <CardContent className="flex items-start md:items-center justify-between p-6 flex-col md:flex-row gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amanava-coral/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amanava-coral" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amanava-black">Nenhum dado financeiro encontrado</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Você precisa realizar a ingestão de dados para popular os gráficos e relatórios deste ambiente.
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita YTD</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amanava-black">{isMocked ? 'R$ 1.780.000' : 'R$ 0,00'}</div>
            <p className="text-xs text-amanava-green flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {isMocked ? '+12% em relação ao ano anterior' : '0%'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EBITDA Mês Atual</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amanava-black">{isMocked ? 'R$ 160.000' : 'R$ 0,00'}</div>
            <p className="text-xs text-amanava-green flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {isMocked ? '+60% em relação ao mês anterior' : '0%'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio Líquido</CardTitle>
            <Wallet className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amanava-black">{isMocked ? 'R$ 750.000' : 'R$ 0,00'}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              Posição consolidada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality Score</CardTitle>
            <div className="h-4 w-4 rounded-full bg-amanava-gold flex items-center justify-center text-[10px] text-white font-bold">!</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amanava-gold">{isMocked ? '92%' : '0%'}</div>
            <p className="text-xs text-amanava-gold mt-1">
              {isMocked ? 'Ação necessária: 2 pendências HITL' : 'Sem dados para avaliar'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Evolução de Resultados (DRE)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={isMocked ? dreData : []}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2C7464" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2C7464" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FEA5A4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FEA5A4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(value) => `R$${value/1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Area type="monotone" dataKey="receita" name="Receita Bruta" stroke="#2C7464" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" />
                  <Area type="monotone" dataKey="custo" name="Custos" stroke="#FEA5A4" strokeWidth={2} fillOpacity={1} fill="url(#colorCusto)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Balanço Patrimonial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={isMocked ? patrimonioData : []}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(value) => `R$${value/1000}k`} />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#333' }} width={120} />
                  <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" name="Valor (R$)" fill="#101010" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
