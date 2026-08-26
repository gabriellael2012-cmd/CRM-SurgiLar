import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  ArrowUpDown,
  LayoutGrid,
  List,
  Sparkles,
  Phone,
  Calendar,
  Clock,
  ShoppingBag,
  Bell,
  X,
  Cake,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Client, ClientStatus, SaleRecord } from '../../types/crm';
import { STATUS_CONFIG, formatCurrency, formatDate } from '../../utils/formatters';
import { calculateDaysWithoutPurchase, calculateBirthdayInfo } from '../../utils/crmCalculations';
import { WhatsAppButton } from '../common/WhatsAppButton';

interface ClientsViewProps {
  clients: Client[];
  sales?: SaleRecord[];
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
  onDeleteClient?: (clientId: string) => void;
  onUpdateClientStatus: (clientId: string, status: ClientStatus) => void;
  onAddReminderForClient?: (client: Client) => void;
  availableProducts: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  sales = [],
  onSelectClient,
  onAddClient,
  onDeleteClient,
  onUpdateClientStatus,
  onAddReminderForClient,
  availableProducts,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'inactiveDays' | 'birthday'>('recent');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Filter and Sort Logic
  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          client.name.toLowerCase().includes(query) ||
          client.whatsapp.toLowerCase().includes(query) ||
          client.city?.toLowerCase().includes(query) ||
          client.productsOfInterest?.some((p) => p.toLowerCase().includes(query));

        const matchesStatus =
          selectedStatus === 'todos' || client.status === selectedStatus;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'inactiveDays') {
          const daysA = calculateDaysWithoutPurchase(a, sales).days ?? -1;
          const daysB = calculateDaysWithoutPurchase(b, sales).days ?? -1;
          return daysB - daysA;
        }
        if (sortBy === 'birthday') {
          const bdayA = calculateBirthdayInfo(a.birthDate)?.daysUntil ?? 999;
          const bdayB = calculateBirthdayInfo(b.birthDate)?.daysUntil ?? 999;
          return bdayA - bdayB;
        }
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [clients, sales, searchQuery, selectedStatus, sortBy]);

  const allStatuses: { key: string; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos os Clientes', count: clients.length },
    { key: 'novo', label: '🆕 Novo', count: clients.filter((c) => c.status === 'novo').length },
    { key: 'negociacao', label: '💬 Negociação', count: clients.filter((c) => c.status === 'negociacao').length },
    { key: 'orcamento_enviado', label: '💰 Orçamento', count: clients.filter((c) => c.status === 'orcamento_enviado').length },
    { key: 'followup_necessario', label: '🔔 Follow-up', count: clients.filter((c) => c.status === 'followup_necessario').length },
    { key: 'venda_realizada', label: '📦 Venda Realizada', count: clients.filter((c) => c.status === 'venda_realizada').length }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl p-5 border border-zinc-800/80 bg-gradient-to-r from-[#14121a] via-[#100e14] to-[#0c0a10]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Gestão de Clientes
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
              {filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clientes'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Visualização simples com WhatsApp direto, dias sem comprar e lembretes automáticos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View mode toggle */}
          <div className="bg-[#16161f] border border-zinc-800 rounded-xl p-1 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'cards'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Visualização em Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onAddClient}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-600/30 border border-pink-400/30 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 space-y-3 border border-zinc-800/80 bg-[#100e15]">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {allStatuses.map((st) => {
            const isSelected = selectedStatus === st.key;
            return (
              <button
                key={st.key}
                type="button"
                onClick={() => setSelectedStatus(st.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-950/40 border border-pink-400/40'
                    : 'bg-[#16161f] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {st.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-xs">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-zinc-400">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#16161f] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-pink-500"
            >
              <option value="recent">Mais Recentes</option>
              <option value="name">Nome (A-Z)</option>
              <option value="inactiveDays">Mais dias sem comprar</option>
              <option value="birthday">Aniversários Próximos</option>
            </select>
          </div>

          {(selectedStatus !== 'todos' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('todos');
                setSearchQuery('');
              }}
              className="text-xs text-pink-400 hover:text-pink-300 font-medium"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Main Clients List / Cards */}
      {filteredClients.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-dashed border-zinc-800 bg-[#0f0f15]">
          <Users className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">Nenhum cliente encontrado</h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Não encontramos nenhum cliente com esses filtros. Clique no botão abaixo para adicionar.
          </p>
          <button
            type="button"
            onClick={onAddClient}
            className="mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/30"
          >
            + Novo Cliente
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredClients.map((client) => {
              const statusConfig = STATUS_CONFIG[client.status];
              const inactiveInfo = calculateDaysWithoutPurchase(client, sales);
              const bdayInfo = calculateBirthdayInfo(client.birthDate);

              return (
                <motion.div
                  key={client.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, y: -12 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onSelectClient(client)}
                  className="bg-[#121219] hover:bg-[#161622] border border-zinc-800 hover:border-pink-500/50 rounded-2xl p-5 cursor-pointer flex flex-col justify-between group relative overflow-hidden transition-all duration-200 shadow-lg hover:shadow-pink-950/20"
                >
                  {/* Top highlight bar */}
                  {bdayInfo?.isToday ? (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 animate-pulse" />
                  ) : inactiveInfo.isAlert ? (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500" />
                  ) : null}

                  <div className="space-y-3.5">
                    {/* Header: Name, Status & Delete button */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="pr-1 flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors font-display truncate">
                          {client.name}
                        </h3>
                        {client.city && (
                          <p className="text-[11px] text-zinc-400 truncate">{client.city}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig?.badgeClass || 'bg-zinc-800 text-zinc-300'}`}
                        >
                          {statusConfig?.emoji} {statusConfig?.label}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setClientToDelete(client);
                          }}
                          className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-500 transition-all flex items-center justify-center"
                          title="Excluir cliente"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Information Grid: WhatsApp, Birthday, Last Purchase & Inactive Days */}
                    <div className="space-y-2 text-xs bg-[#0b0b10] border border-zinc-800/80 rounded-xl p-3">
                      {/* WhatsApp */}
                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-pink-400" /> WhatsApp
                        </span>
                        <span className="font-mono font-semibold text-white">
                          {client.whatsapp}
                        </span>
                      </div>

                      {/* Data de Nascimento */}
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                          <Cake className="w-3 h-3 text-pink-400" /> Aniversário
                        </span>
                        {bdayInfo ? (
                          <span
                            className={`font-semibold text-xs flex items-center gap-1 ${
                              bdayInfo.isToday
                                ? 'text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-md border border-pink-500/30'
                                : bdayInfo.isTomorrow
                                ? 'text-amber-300'
                                : 'text-zinc-200'
                            }`}
                          >
                            {bdayInfo.formattedBirthDate}
                            {bdayInfo.isToday && ' 🎉 (Hoje!)'}
                            {bdayInfo.isTomorrow && ' (Amanhã)'}
                          </span>
                        ) : (
                          <span className="text-zinc-400 italic text-[11px]">Não informado</span>
                        )}
                      </div>

                      {/* Última Compra */}
                      <div className="pt-1.5 border-t border-zinc-800/60 flex items-center justify-between">
                        <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                          <ShoppingBag className="w-3 h-3 text-pink-400" /> Última compra
                        </span>
                        {inactiveInfo.hasPurchased ? (
                          <span className="font-medium text-white truncate max-w-[170px] text-right" title={inactiveInfo.sublabel}>
                            {formatDate(inactiveInfo.lastPurchaseDate)} {inactiveInfo.lastPurchaseProduct ? `• ${inactiveInfo.lastPurchaseProduct}` : ''}
                          </span>
                        ) : (
                          <span className="text-zinc-400 italic text-[11px]">Nenhuma compra</span>
                        )}
                      </div>

                      {/* ⏱️ Cliente há X dias sem comprar */}
                      <div className="pt-1.5 border-t border-zinc-800/60 flex items-center justify-between">
                        <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-pink-400" /> Status de compra
                        </span>
                        <span
                          className={`font-bold text-[11px] ${
                            !inactiveInfo.hasPurchased
                              ? 'text-zinc-400'
                              : inactiveInfo.days !== null && inactiveInfo.days >= 60
                              ? 'text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20'
                              : 'text-pink-300'
                          }`}
                        >
                          {inactiveInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bottom Bar: Botão WhatsApp + Botão Lembrete */}
                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <WhatsAppButton
                        phone={client.whatsapp}
                        clientName={client.name}
                        productName={client.productsOfInterest?.[0] || inactiveInfo.lastPurchaseProduct}
                        size="sm"
                        isBirthday={bdayInfo?.isToday}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAddReminderForClient) {
                          onAddReminderForClient(client);
                        } else {
                          onSelectClient(client);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-pink-950/40 text-pink-300 hover:text-pink-200 border border-zinc-800 hover:border-pink-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                      title="Ver ou adicionar lembrete para este cliente"
                    >
                      <Bell className="w-3.5 h-3.5 text-pink-400" />
                      <span>Lembrete</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-800/80 bg-[#100e15]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171520] text-zinc-400 uppercase tracking-wider font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">WhatsApp</th>
                  <th className="p-4">Aniversário</th>
                  <th className="p-4">Última Compra</th>
                  <th className="p-4">Dias sem comprar</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredClients.map((client) => {
                  const statusConfig = STATUS_CONFIG[client.status];
                  const inactiveInfo = calculateDaysWithoutPurchase(client, sales);
                  const bdayInfo = calculateBirthdayInfo(client.birthDate);

                  return (
                    <tr
                      key={client.id}
                      onClick={() => onSelectClient(client)}
                      className="hover:bg-[#181622] cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold text-white font-display text-sm">
                          {client.name}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${statusConfig?.badgeClass}`}>
                          {statusConfig?.label}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-zinc-300">
                        {client.whatsapp}
                      </td>
                      <td className="p-4 text-zinc-300">
                        {bdayInfo ? (
                          <span className={bdayInfo.isToday ? 'text-pink-300 font-bold' : ''}>
                            {bdayInfo.formattedBirthDate}
                            {bdayInfo.isToday && ' 🎉 Hoje!'}
                          </span>
                        ) : (
                          <span className="text-zinc-400 italic">—</span>
                        )}
                      </td>
                      <td className="p-4 text-zinc-300">
                        {inactiveInfo.hasPurchased ? (
                          <span>{formatDate(inactiveInfo.lastPurchaseDate)}</span>
                        ) : (
                          <span className="text-zinc-400 italic">Sem compras</span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-pink-300">
                        {inactiveInfo.label}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <WhatsAppButton
                            phone={client.whatsapp}
                            clientName={client.name}
                            productName={client.productsOfInterest?.[0]}
                            size="sm"
                          />
                          <button
                            type="button"
                            onClick={() => onSelectClient(client)}
                            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#121218] border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Excluir Cliente</h3>
                <p className="text-xs text-zinc-400">Ação irreversível no CRM</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300">
              Tem certeza que deseja excluir o cliente <strong className="text-white">{clientToDelete.name}</strong>? Todos os dados vinculados serão removidos.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setClientToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl border border-zinc-700 hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteClient) onDeleteClient(clientToDelete.id);
                  setClientToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
