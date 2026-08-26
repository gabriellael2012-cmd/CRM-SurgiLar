import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Award,
  Users,
  DollarSign,
  FileSpreadsheet,
  PieChart as PieChartIcon,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Client, SaleRecord } from '../../types/crm';
import { formatCurrency } from '../../utils/formatters';

interface ReportsViewProps {
  clients: Client[];
  sales: SaleRecord[];
  onExportData: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  clients,
  sales,
  onExportData
}) => {
  // Funnel counts
  const totalClients = clients.length;
  const inNegotiation = clients.filter((c) => c.status === 'negociacao').length;
  const budgetSent = clients.filter((c) => c.status === 'orcamento_enviado').length;
  const waitingResponse = clients.filter((c) => c.status === 'aguardando_resposta').length;
  const closedSales = clients.filter((c) => c.status === 'venda_realizada').length;
  const lostClients = clients.filter((c) => c.status === 'cliente_perdido').length;

  const conversionRate = totalClients > 0 ? (closedSales / totalClients) * 100 : 0;
  const totalRevenue = sales.reduce((acc, s) => acc + s.value, 0);

  // Budgets total vs approved
  const allBudgets = useMemo(() => {
    return clients.flatMap((c) => c.budgets || []);
  }, [clients]);

  const totalBudgetValue = allBudgets.reduce((sum, b) => sum + b.value, 0);
  const approvedBudgetValue = allBudgets
    .filter((b) => b.status === 'aprovado' || b.status === 'venda_realizada')
    .reduce((sum, b) => sum + b.value, 0);

  // Products frequency
  const productDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    clients.forEach((c) => {
      c.productsOfInterest?.forEach((p) => {
        counts[p] = (counts[p] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [clients]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-display">
              Relatórios & Análise de Desempenho
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              SurgiLar
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Métricas de conversão de funil, produtos mais procurados e faturamento de Kely Alves
          </p>
        </div>

        <button
          type="button"
          onClick={onExportData}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold border border-zinc-700 flex items-center gap-2 transition-all shadow-md"
        >
          <Download className="w-4 h-4 text-rose-400" />
          <span>Exportar Relatório Geral (JSON)</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5">
          <span className="text-[11px] font-bold uppercase text-zinc-400">Taxa de Conversão</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-display mt-2">
            {conversionRate.toFixed(1)}%
          </div>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            {closedSales} fechamentos de {totalClients} clientes
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <span className="text-[11px] font-bold uppercase text-zinc-400">Total em Propostas</span>
          <div className="text-2xl font-extrabold text-amber-300 font-display mt-2 truncate">
            {formatCurrency(totalBudgetValue)}
          </div>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            {allBudgets.length} propostas enviadas
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <span className="text-[11px] font-bold uppercase text-zinc-400">Faturamento Fechado</span>
          <div className="text-2xl font-extrabold text-white font-display mt-2 truncate">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[10px] text-rose-400 mt-0.5 font-semibold">
            {sales.length} vendas concretizadas
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <span className="text-[11px] font-bold uppercase text-zinc-400">Ticket Médio</span>
          <div className="text-2xl font-extrabold text-cyan-300 font-display mt-2 truncate">
            {formatCurrency(sales.length > 0 ? totalRevenue / sales.length : 0)}
          </div>
          <p className="text-[10px] text-zinc-400 mt-0.5">Média por pedido</p>
        </div>
      </div>

      {/* Commercial Funnel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Progress */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            Funil Comercial de Clientes
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-zinc-300 font-semibold mb-1">
                <span>🆕 Novos Contatos</span>
                <span>{clients.filter((c) => c.status === 'novo').length}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-zinc-400 h-2 rounded-full"
                  style={{ width: `${(clients.filter((c) => c.status === 'novo').length / (totalClients || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-cyan-300 font-semibold mb-1">
                <span>💬 Em Negociação</span>
                <span>{inNegotiation}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-cyan-500 h-2 rounded-full"
                  style={{ width: `${(inNegotiation / (totalClients || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-amber-300 font-semibold mb-1">
                <span>💰 Orçamentos Enviados</span>
                <span>{budgetSent}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${(budgetSent / (totalClients || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-rose-300 font-semibold mb-1">
                <span>⏳ Aguardando Resposta / Follow-up</span>
                <span>{waitingResponse + clients.filter((c) => c.status === 'followup_necessario').length}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-rose-500 h-2 rounded-full"
                  style={{ width: `${((waitingResponse + clients.filter((c) => c.status === 'followup_necessario').length) / (totalClients || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-emerald-300 font-bold mb-1">
                <span>📦 Vendas Realizadas</span>
                <span>{closedSales}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${(closedSales / (totalClients || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Demand Ranking */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
            <PieChartIcon className="w-4 h-4 text-rose-400" />
            Produtos Mais Desejados (Catálogo SurgiLar)
          </h3>

          <div className="space-y-3 text-xs">
            {productDistribution.slice(0, 6).map(([prod, count]) => (
              <div
                key={prod}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <span>🛋️</span>
                  <span className="font-semibold text-zinc-200">{prod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-300 font-mono">
                    {count} {count === 1 ? 'cliente' : 'clientes'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
