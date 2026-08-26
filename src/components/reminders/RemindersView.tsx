import React, { useState, useMemo } from 'react';
import {
  BellRing,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Trash2,
  PhoneCall,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';
import { ReminderRecord, Client, ReminderReason } from '../../types/crm';
import {
  formatDate,
  formatDateTime,
  REMINDER_REASON_CONFIG
} from '../../utils/formatters';
import { WhatsAppButton } from '../common/WhatsAppButton';

interface RemindersViewProps {
  reminders: ReminderRecord[];
  clients: Client[];
  onToggleReminder: (reminderId: string) => void;
  onDeleteReminder: (reminderId: string) => void;
  onAddReminder: (reminder: ReminderRecord) => void;
  onSelectClient: (client: Client) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  clients,
  onToggleReminder,
  onDeleteReminder,
  onAddReminder,
  onSelectClient
}) => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'hoje' | 'amanha' | 'proximos' | 'atrasados'>('hoje');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [reason, setReason] = useState<ReminderReason>('fazer_followup');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:30');
  const [observation, setObservation] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Group reminders into categories
  const { hojeList, amanhaList, proximosList, atrasadosList } = useMemo(() => {
    const hoje: ReminderRecord[] = [];
    const amanha: ReminderRecord[] = [];
    const proximos: ReminderRecord[] = [];
    const atrasados: ReminderRecord[] = [];

    reminders.forEach((r) => {
      if (r.completed) return;

      if (r.date < todayStr) {
        atrasados.push(r);
      } else if (r.date === todayStr) {
        hoje.push(r);
      } else if (r.date === tomorrow) {
        amanha.push(r);
      } else {
        proximos.push(r);
      }
    });

    return {
      hojeList: hoje,
      amanhaList: amanha,
      proximosList: proximos,
      atrasadosList: atrasados
    };
  }, [reminders, todayStr, tomorrow]);

  const currentDisplayList = useMemo(() => {
    let list: ReminderRecord[] = [];
    if (activeCategory === 'hoje') list = hojeList;
    else if (activeCategory === 'amanha') list = amanhaList;
    else if (activeCategory === 'proximos') list = proximosList;
    else if (activeCategory === 'atrasados') list = atrasadosList;
    else list = reminders;

    if (!searchTerm) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (r) =>
        r.clientName.toLowerCase().includes(term) ||
        r.observation.toLowerCase().includes(term) ||
        r.clientPhone.includes(term)
    );
  }, [activeCategory, hojeList, amanhaList, proximosList, atrasadosList, reminders, searchTerm]);

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    if (!client) return;

    const newReminder: ReminderRecord = {
      id: `rem-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.whatsapp,
      reason,
      date,
      time,
      observation: observation.trim() || 'Entrar em contato com o cliente.',
      completed: false,
      productOfInterest: client.productsOfInterest?.[0]
    };

    onAddReminder(newReminder);
    setShowModal(false);
    setObservation('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-display">
              Central de Lembretes & Follow-ups
            </h2>
            {hojeList.length > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse shadow-md shadow-rose-500/40">
                {hojeList.length} para hoje
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Organize contatos de hoje, amanhã, próximos dias e pendências atrasadas da SurgiLar
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 border border-rose-400/30 flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Lembrete</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {/* HOJE */}
          <button
            type="button"
            onClick={() => setActiveCategory('hoje')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeCategory === 'hoje'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50 border border-rose-400/40 glow-rose-sm'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Hoje</span>
            <span className="px-1.5 py-0.2 bg-black/40 rounded-full text-[10px]">
              {hojeList.length}
            </span>
          </button>

          {/* AMANHÃ */}
          <button
            type="button"
            onClick={() => setActiveCategory('amanha')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeCategory === 'amanha'
                ? 'bg-rose-600 text-white shadow-md border border-rose-400/40'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Amanhã</span>
            <span className="px-1.5 py-0.2 bg-black/40 rounded-full text-[10px]">
              {amanhaList.length}
            </span>
          </button>

          {/* PRÓXIMOS DIAS */}
          <button
            type="button"
            onClick={() => setActiveCategory('proximos')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeCategory === 'proximos'
                ? 'bg-rose-600 text-white shadow-md border border-rose-400/40'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Próximos Dias</span>
            <span className="px-1.5 py-0.2 bg-black/40 rounded-full text-[10px]">
              {proximosList.length}
            </span>
          </button>

          {/* ATRASADOS */}
          <button
            type="button"
            onClick={() => setActiveCategory('atrasados')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeCategory === 'atrasados'
                ? 'bg-red-600 text-white shadow-md border border-red-400/40'
                : atrasadosList.length > 0
                ? 'bg-red-950/40 text-red-300 border border-red-800/50'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Atrasados</span>
            <span className="px-1.5 py-0.2 bg-black/40 rounded-full text-[10px]">
              {atrasadosList.length}
            </span>
          </button>

          {/* TODOS */}
          <button
            type="button"
            onClick={() => setActiveCategory('todos')}
            className={`px-3 py-2 rounded-xl font-medium transition-all ${
              activeCategory === 'todos'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Todos ({reminders.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar lembrete..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Reminders List */}
      {currentDisplayList.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-dashed border-zinc-800">
          <BellRing className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">
            Nenhum lembrete na categoria "{activeCategory.toUpperCase()}"
          </h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Tudo em dia com seus clientes! Agende novos follow-ups ou selecione outra categoria.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
          >
            + Agendar Novo Lembrete
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {currentDisplayList.map((rem) => {
            const reasonCfg = REMINDER_REASON_CONFIG[rem.reason];
            const isToday = rem.date === todayStr;
            const isLate = rem.date < todayStr && !rem.completed;
            const clientObj = clients.find((c) => c.id === rem.clientId);

            return (
              <div
                key={rem.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                  rem.completed
                    ? 'bg-zinc-900/40 border-zinc-800 opacity-60'
                    : isToday
                    ? 'bg-gradient-to-r from-[#1b1218] via-[#16121a] to-[#121216] border-rose-500/50 shadow-lg shadow-rose-950/30'
                    : isLate
                    ? 'bg-gradient-to-r from-red-950/30 via-zinc-900 to-zinc-900 border-red-500/40'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => onToggleReminder(rem.id)}
                    className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      rem.completed
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : 'border-zinc-700 hover:border-rose-500 bg-zinc-900'
                    }`}
                    title={rem.completed ? 'Desmarcar' : 'Concluir lembrete'}
                  >
                    {rem.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        onClick={() => clientObj && onSelectClient(clientObj)}
                        className={`text-sm font-bold cursor-pointer hover:text-rose-300 transition-colors ${
                          rem.completed ? 'line-through text-zinc-400' : 'text-white'
                        }`}
                      >
                        {rem.clientName}
                      </h4>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-850 ${reasonCfg?.color}`}
                      >
                        {reasonCfg?.label}
                      </span>

                      {isToday && !rem.completed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-sm animate-pulse">
                          🔥 HOJE às {rem.time}
                        </span>
                      )}

                      {isLate && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                          ⚠️ ATRASADO
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                      "{rem.observation}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        {formatDate(rem.date)} às {rem.time}
                      </span>
                      {rem.productOfInterest && (
                        <span>• Interesse: 🛋️ {rem.productOfInterest}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side WhatsApp + Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800">
                  <WhatsAppButton
                    phone={rem.clientPhone}
                    clientName={rem.clientName}
                    productName={rem.productOfInterest}
                    size="sm"
                  />

                  <button
                    type="button"
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Excluir lembrete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Novo Lembrete */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121216] border border-rose-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <BellRing className="w-4 h-4 text-rose-400" />
                Agendar Novo Lembrete / Follow-up
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Cliente SurgiLar</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.whatsapp})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Motivo do Contato</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReminderReason)}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
                >
                  <option value="fazer_followup">🔔 Fazer follow-up</option>
                  <option value="perguntar_orcamento">💰 Perguntar sobre orçamento</option>
                  <option value="enviar_orcamento">📄 Enviar orçamento</option>
                  <option value="retomar_negociacao">🔄 Retomar negociação</option>
                  <option value="pos_venda">🌟 Pós-venda e satisfação</option>
                  <option value="entrar_em_contato">📞 Entrar em contato</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Observação / Instrução</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Mandar mensagem no WhatsApp às 15:30 para verificar o orçamento..."
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold rounded-xl shadow-lg"
                >
                  Salvar Lembrete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
