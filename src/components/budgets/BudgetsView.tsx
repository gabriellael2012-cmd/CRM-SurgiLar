import React, { useState, useMemo } from 'react';
import {
  BadgePercent,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Client, BudgetRecord, BudgetStatus } from '../../types/crm';
import { formatCurrency, formatDate, BUDGET_STATUS_CONFIG } from '../../utils/formatters';
import { WhatsAppButton } from '../common/WhatsAppButton';

interface BudgetsViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onUpdateBudgetStatus: (clientId: string, budgetId: string, newStatus: BudgetStatus) => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  clients,
  onSelectClient,
  onUpdateBudgetStatus
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all budgets with client reference
  const allBudgets = useMemo(() => {
    const list: { client: Client; budget: BudgetRecord }[] = [];
    clients.forEach((client) => {
      client.budgets?.forEach((budget) => {
        list.push({ client, budget });
      });
    });
    return list;
  }, [clients]);

  // Filtered Budgets
  const filtered = useMemo(() => {
    return allBudgets.filter(({ client, budget }) => {
      const matchesStatus = statusFilter === 'todos' || budget.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        client.name.toLowerCase().includes(term) ||
        budget.product.toLowerCase().includes(term) ||
        budget.notes?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [allBudgets, statusFilter, searchTerm]);

  // Overall metrics
  const totalBudgetsCount = allBudgets.length;
  const totalValue = allBudgets.reduce((acc, { budget }) => acc + budget.value, 0);
  const approvedValue = allBudgets
    .filter(({ budget }) => budget.status === 'aprovado' || budget.status === 'venda_realizada')
    .reduce((acc, { budget }) => acc + budget.value, 0);
  const approvedCount = allBudgets.filter(
    ({ budget }) => budget.status === 'aprovado' || budget.status === 'venda_realizada'
  ).length;

  const statuses: { key: string; label: string }[] = [
    { key: 'todos', label: 'Todos os Orçamentos' },
    { key: 'enviado', label: 'Enviados' },
    { key: 'aguardando_resposta', label: 'Aguardando Resposta' },
    { key: 'aprovado', label: 'Aprovados' },
    { key: 'venda_realizada', label: 'Venda Realizada' },
    { key: 'rascunho', label: 'Rascunhos' },
    { key: 'recusado', label: 'Recusados' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-display">
              Controle de Orçamentos Enviados
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {totalBudgetsCount} propostas
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Acompanhe cada proposta comercial, prazos de validade e taxas de aprovação da SurgiLar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-right">
            <span className="text-[10px] text-zinc-400 uppercase block">Total em Propostas</span>
            <span className="text-base font-extrabold text-amber-400 font-mono">
              {formatCurrency(totalValue)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-right">
            <span className="text-[10px] text-rose-300 uppercase block">Aprovados</span>
            <span className="text-base font-extrabold text-white font-mono">
              {formatCurrency(approvedValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setStatusFilter(st.key)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                statusFilter === st.key
                  ? 'bg-amber-500 text-black font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Filtrar proposta ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Budgets List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-dashed border-zinc-800">
          <BadgePercent className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">Nenhum orçamento encontrado</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Abra um cliente para registrar um novo orçamento da SurgiLar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(({ client, budget }) => {
            const statusCfg = BUDGET_STATUS_CONFIG[budget.status];
            return (
              <div
                key={budget.id}
                onClick={() => onSelectClient(client)}
                className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                        Cliente:
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                        {client.name}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusCfg?.badgeClass}`}>
                      {statusCfg?.label}
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">Produto Ofertado</span>
                    <p className="text-xs font-bold text-zinc-100">{budget.product}</p>
                    {budget.notes && (
                      <p className="text-[11px] text-zinc-400 italic mt-1">
                        "{budget.notes}"
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      Data: <strong className="text-zinc-200">{formatDate(budget.date)}</strong>
                    </span>
                    <span className="text-base font-extrabold text-amber-400 font-mono">
                      {formatCurrency(budget.value)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <select
                      value={budget.status}
                      onChange={(e) => onUpdateBudgetStatus(client.id, budget.id, e.target.value as BudgetStatus)}
                      className="bg-black border border-zinc-700 text-[11px] rounded-lg px-2 py-1 text-zinc-300 hover:border-amber-400 focus:outline-none"
                    >
                      <option value="rascunho">Rascunho</option>
                      <option value="enviado">Enviado</option>
                      <option value="aguardando_resposta">Aguardando resposta</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="recusado">Recusado</option>
                      <option value="venda_realizada">Venda realizada</option>
                    </select>
                  </div>

                  <WhatsAppButton
                    phone={client.whatsapp}
                    clientName={client.name}
                    productName={budget.product}
                    size="sm"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
