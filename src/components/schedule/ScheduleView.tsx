import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Phone,
  DollarSign,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { ReminderRecord, Client } from '../../types/crm';
import { formatDate, formatCurrency, STATUS_CONFIG } from '../../utils/formatters';
import { WhatsAppButton } from '../common/WhatsAppButton';

interface ScheduleViewProps {
  reminders: ReminderRecord[];
  clients: Client[];
  onAddReminder: () => void;
  onSelectClient: (client: Client) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  reminders,
  clients,
  onAddReminder,
  onSelectClient
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 7, 26)); // Default 26/08/2026
  const [selectedEvent, setSelectedEvent] = useState<ReminderRecord | null>(null);

  // Selected event client
  const eventClient = useMemo(() => {
    if (!selectedEvent) return null;
    return clients.find((c) => c.id === selectedEvent.clientId) || null;
  }, [selectedEvent, clients]);

  // Generate calendar days for current month view
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(year, month + 1, 1));
  };

  // Map reminders to date strings
  const remindersByDate = useMemo(() => {
    const map: Record<string, ReminderRecord[]> = {};
    reminders.forEach((r) => {
      if (!map[r.date]) {
        map[r.date] = [];
      }
      map[r.date].push(r);
    });
    return map;
  }, [reminders]);

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayReminders = remindersByDate[selectedDateStr] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-display">
              Agenda Inteligente & Calendário
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              SurgiLar
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Visualize seus compromissos, ligações e follow-ups por dia, semana ou mês
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                viewMode === 'daily'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Diária
            </button>
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                viewMode === 'weekly'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Semanal
            </button>
            <button
              type="button"
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                viewMode === 'monthly'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
          </div>

          <button
            type="button"
            onClick={onAddReminder}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 border border-rose-400/30 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Lembrete</span>
          </button>
        </div>
      </div>

      {/* MONTHLY VIEW */}
      {viewMode === 'monthly' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white font-display">
                {monthNames[month]} {year}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDate(new Date(2026, 7, 26))}
                className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20"
              >
                Hoje (26 Ago)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-bold uppercase tracking-wider text-zinc-400 py-1"
              >
                {day}
              </div>
            ))}

            {/* Empty slots for previous month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[85px] bg-zinc-900/20 rounded-xl border border-zinc-850/40 p-1.5 opacity-30" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);
              const dateStr = dateObj.toISOString().split('T')[0];
              const dayEvents = remindersByDate[dateStr] || [];
              const isToday = dateStr === '2026-08-26';
              const isSelected = dateStr === selectedDateStr;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(dateObj)}
                  className={`min-h-[90px] rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-950/30 border-rose-500 shadow-md'
                      : isToday
                      ? 'bg-zinc-900/90 border-rose-500/40 ring-1 ring-rose-500/30'
                      : 'bg-zinc-900/60 border-zinc-850 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center'
                          : isSelected
                          ? 'text-rose-300'
                          : 'text-zinc-400'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                        }}
                        className="text-[10px] p-1 rounded bg-zinc-800/90 hover:bg-rose-600 hover:text-white text-zinc-200 truncate transition-colors font-medium border border-zinc-700/60"
                        title={`${ev.time} — ${ev.clientName}: ${ev.observation}`}
                      >
                        <span className="text-rose-400 font-bold mr-1">{ev.time}</span>
                        {ev.clientName}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-zinc-400 font-mono block pl-1">
                        +{dayEvents.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAILY / AGENDA DETAIL VIEW */}
      {(viewMode === 'daily' || viewMode === 'weekly' || dayReminders.length > 0) && (
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <CalendarDays className="w-4 h-4 text-rose-400" />
              Compromissos para {formatDate(selectedDateStr)}
            </h3>
            <span className="text-xs text-rose-400 font-semibold">
              {dayReminders.length} agendados
            </span>
          </div>

          {dayReminders.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-xs">
              Nenhum compromisso agendado para este dia.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {dayReminders.map((rem) => {
                const client = clients.find((c) => c.id === rem.clientId);
                return (
                  <div
                    key={rem.id}
                    onClick={() => setSelectedEvent(rem)}
                    className="p-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-rose-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 font-mono font-bold text-xs border border-rose-500/20">
                        {rem.time}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                          {rem.clientName}
                        </h4>
                        <p className="text-xs text-zinc-300 mt-0.5">
                          "{rem.observation}"
                        </p>
                        {rem.productOfInterest && (
                          <p className="text-[11px] text-zinc-400 mt-1">
                            Interesse: 🛋️ {rem.productOfInterest}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                      <WhatsAppButton
                        phone={rem.clientPhone}
                        clientName={rem.clientName}
                        productName={rem.productOfInterest}
                        size="sm"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: EVENT DETAILS & QUICK CLIENT INFO */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121216] border border-rose-500/40 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {selectedEvent.time} — {selectedEvent.clientName}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Compromisso em {formatDate(selectedEvent.date)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Information Cards Requested */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Observação</span>
                <p className="text-xs text-zinc-100 font-medium mt-1">"{selectedEvent.observation}"</p>
              </div>

              {eventClient && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">WhatsApp</span>
                    <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                      {eventClient.whatsapp}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Status Atual</span>
                    <p className="text-xs font-bold text-rose-400 mt-0.5">
                      {STATUS_CONFIG[eventClient.status]?.label}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Produtos de Interesse</span>
                    <p className="text-xs text-zinc-200 mt-0.5">
                      {eventClient.productsOfInterest?.join(', ') || 'Nenhum'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Orçamento em Andamento</span>
                    <p className="text-xs font-bold text-amber-400 font-mono mt-0.5">
                      {eventClient.budgets?.[0]
                        ? formatCurrency(eventClient.budgets[0].value)
                        : 'Sem orçamento'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
              {eventClient && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectClient(eventClient);
                    setSelectedEvent(null);
                  }}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl"
                >
                  Abrir Perfil Completo
                </button>
              )}

              <WhatsAppButton
                phone={selectedEvent.clientPhone}
                clientName={selectedEvent.clientName}
                productName={selectedEvent.productOfInterest}
                size="md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
