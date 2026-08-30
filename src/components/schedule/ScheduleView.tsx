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
  AlertCircle,
  X,
  Bell,
  Calendar,
  Check
} from 'lucide-react';
import { ReminderRecord, Client, ReminderReason } from '../../types/crm';
import { formatDate, formatCurrency, STATUS_CONFIG } from '../../utils/formatters';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { playNotificationChime, triggerHapticVibration } from '../../utils/notifications';

interface ScheduleViewProps {
  reminders: ReminderRecord[];
  clients: Client[];
  onAddReminder: (reminder: ReminderRecord) => void;
  onToggleReminder?: (reminderId: string) => void;
  onDeleteReminder?: (reminderId: string) => void;
  onSelectClient: (client: Client) => void;
}

const ALERT_OPTIONS = [
  { id: 'immediate', label: 'No momento do cadastro' },
  { id: '5min', label: '5 minutos antes' },
  { id: '10min', label: '10 minutos antes' },
  { id: '15min', label: '15 minutos antes' },
  { id: '30min', label: '30 minutos antes' },
  { id: '1h', label: '1 hora antes' },
  { id: '2h', label: '2 horas antes' },
  { id: '1day', label: '1 dia antes' }
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  reminders,
  clients,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  onSelectClient
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ReminderRecord | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Event Form State
  const [formClientId, setFormClientId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formReason, setFormReason] = useState<ReminderReason>('entrar_em_contato');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState('14:30');
  const [formObservation, setFormObservation] = useState('');
  const [formAlerts, setFormAlerts] = useState<string[]>(['immediate', '30min']);

  // Selected event client details
  const eventClient = useMemo(() => {
    if (!selectedEvent) return null;
    return clients.find((c) => c.id === selectedEvent.clientId) || null;
  }, [selectedEvent, clients]);

  // Calendar calculations
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrev = () => {
    if (viewMode === 'monthly') {
      setSelectedDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'weekly') {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 7);
      setSelectedDate(d);
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 1);
      setSelectedDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'monthly') {
      setSelectedDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'weekly') {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 7);
      setSelectedDate(d);
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 1);
      setSelectedDate(d);
    }
  };

  const handleGoToday = () => {
    setSelectedDate(new Date());
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

  // Weekly days
  const weekDays = useMemo(() => {
    const curr = new Date(selectedDate);
    const first = curr.getDate() - curr.getDay();
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(curr.getFullYear(), curr.getMonth(), first + i);
      days.push(nextDay);
    }
    return days;
  }, [selectedDate]);

  // Open modal prefilled with specific date/time slot
  const handleOpenSlot = (dateStr: string, timeStr: string) => {
    setFormDate(dateStr);
    setFormTime(timeStr);
    if (clients.length > 0 && !formClientId) {
      setFormClientId(clients[0].id);
    }
    setShowEventModal(true);
  };

  const handleToggleAlert = (alertId: string) => {
    setFormAlerts((prev) =>
      prev.includes(alertId) ? prev.filter((a) => a !== alertId) : [...prev, alertId]
    );
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formClientId);
    if (!client && clients.length > 0) {
      alert('Por favor, selecione um cliente para o compromisso.');
      return;
    }

    const clientName = client ? client.name : 'Cliente Geral';
    const clientPhone = client ? client.whatsapp : '';
    const observation = formObservation.trim() || formTitle.trim() || 'Compromisso agendado na agenda Kely Alves';

    const newReminder: ReminderRecord = {
      id: `rem-${Date.now()}`,
      clientId: client?.id || `client-${Date.now()}`,
      clientName,
      clientPhone,
      reason: formReason,
      title: formTitle.trim() || formReason.replace(/_/g, ' '),
      date: formDate,
      time: formTime,
      observation,
      completed: false,
      productOfInterest: client?.productsOfInterest?.[0],
      alertMoments: formAlerts
    };

    onAddReminder(newReminder);
    setShowEventModal(false);
    playNotificationChime();
    triggerHapticVibration([80, 40, 80]);

    // Show Confirmation Toast
    setToastMessage('✅ Evento adicionado à agenda com sucesso!');
    setTimeout(() => setToastMessage(null), 3500);

    // Reset form fields
    setFormTitle('');
    setFormObservation('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-zinc-900 border border-emerald-500/50 shadow-2xl text-white text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-emerald-300 font-bold">{toastMessage}</p>
            <p className="text-[10px] text-zinc-400 font-normal">
              Notificações e lembretes inteligentes configurados.
            </p>
          </div>
        </div>
      )}

      {/* Top Banner & View Switcher */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-display">
              📅 Agenda Inteligente
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
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Diário
            </button>
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                viewMode === 'weekly'
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
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
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormDate(new Date().toISOString().split('T')[0]);
              setFormTime('14:30');
              if (clients.length > 0 && !formClientId) {
                setFormClientId(clients[0].id);
              }
              setShowEventModal(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 border border-rose-400/30 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Navigation Header for Current Mode */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-bold text-white font-display">
            {viewMode === 'monthly' && `${monthNames[month]} de ${year}`}
            {viewMode === 'daily' && `Compromissos de ${formatDate(selectedDateStr)}`}
            {viewMode === 'weekly' && `Semana de ${formatDate(weekDays[0].toISOString().split('T')[0])} a ${formatDate(weekDays[6].toISOString().split('T')[0])}`}
          </h3>
          <button
            type="button"
            onClick={handleGoToday}
            className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            Hoje
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="Próximo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. MONTHLY VIEW */}
      {viewMode === 'monthly' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-bold uppercase tracking-wider text-zinc-400 py-1"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[85px] bg-zinc-900/20 rounded-xl border border-zinc-850/40 p-1.5 opacity-30" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);
              const dateStr = dateObj.toISOString().split('T')[0];
              const dayEvents = remindersByDate[dateStr] || [];
              const isToday = dateStr === new Date().toISOString().split('T')[0];
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
                        className={`text-[10px] p-1 rounded font-medium border truncate transition-colors ${
                          ev.completed
                            ? 'bg-zinc-900 text-zinc-400 border-zinc-800 line-through'
                            : 'bg-zinc-800/90 hover:bg-rose-600 hover:text-white text-zinc-200 border-zinc-700/60'
                        }`}
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

      {/* 2. WEEKLY VIEW */}
      {viewMode === 'weekly' && (
        <div className="glass-panel rounded-2xl p-5 overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[700px]">
            {weekDays.map((dayDate) => {
              const dayStr = dayDate.toISOString().split('T')[0];
              const events = remindersByDate[dayStr] || [];
              const isToday = dayStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={dayStr}
                  className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[300px] ${
                    isToday
                      ? 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/30'
                      : 'bg-zinc-900/60 border-zinc-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
                      <div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase">
                          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dayDate.getDay()]}
                        </p>
                        <p className={`text-sm font-bold font-mono ${isToday ? 'text-rose-400' : 'text-white'}`}>
                          {dayDate.getDate()} {monthNames[dayDate.getMonth()].slice(0, 3)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenSlot(dayStr, '14:30')}
                        className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-rose-600 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                        title="Adicionar evento neste dia"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {events.length === 0 ? (
                        <p className="text-[11px] text-zinc-400 text-center py-6">
                          Sem eventos
                        </p>
                      ) : (
                        events.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/40 cursor-pointer transition-all text-xs space-y-1 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-rose-400">
                                {ev.time}
                              </span>
                              {ev.completed && (
                                <span className="text-[9px] text-emerald-400 font-bold">✓ Concluído</span>
                              )}
                            </div>
                            <p className="font-bold text-zinc-200 truncate group-hover:text-rose-300">
                              {ev.clientName}
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate">
                              "{ev.observation}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenSlot(dayStr, '10:00')}
                    className="w-full mt-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-[11px] text-zinc-400 hover:text-rose-300 border border-zinc-800 text-center transition-colors font-medium"
                  >
                    + Horário
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. DAILY TIMELINE VIEW */}
      {viewMode === 'daily' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              Linha do Tempo Horária ({formatDate(selectedDateStr)})
            </h3>
            <span className="text-xs text-rose-400 font-bold">
              {dayReminders.length} compromissos agendados
            </span>
          </div>

          <div className="space-y-2">
            {TIME_SLOTS.map((slot) => {
              const eventsInSlot = dayReminders.filter((r) => r.time === slot || r.time.startsWith(slot.slice(0, 3)));

              return (
                <div
                  key={slot}
                  className="flex items-start gap-4 p-2.5 rounded-xl hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition-colors group"
                >
                  <div className="w-16 font-mono font-bold text-xs text-zinc-400 group-hover:text-rose-400 pt-1">
                    {slot}
                  </div>

                  <div className="flex-1">
                    {eventsInSlot.length > 0 ? (
                      <div className="space-y-2">
                        {eventsInSlot.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className="p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-rose-500/40 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5" />
                              <div>
                                <h4 className="text-xs font-bold text-white">
                                  {ev.clientName}
                                </h4>
                                <p className="text-xs text-zinc-300 mt-0.5">
                                  "{ev.observation}"
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <WhatsAppButton
                                phone={ev.clientPhone}
                                clientName={ev.clientName}
                                productName={ev.productOfInterest}
                                size="sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenSlot(selectedDateStr, slot)}
                        className="text-xs text-zinc-400 hover:text-rose-300 py-1 px-2 rounded-lg hover:bg-zinc-900 transition-colors flex items-center gap-1.5 font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Clique para agendar às {slot}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECTED DAY SUMMARY (when in monthly view) */}
      {viewMode === 'monthly' && (
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
              Nenhum compromisso agendado para este dia.{' '}
              <button
                type="button"
                onClick={() => handleOpenSlot(selectedDateStr, '14:30')}
                className="text-rose-400 hover:underline font-bold ml-1"
              >
                Criar evento agora
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {dayReminders.map((rem) => (
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: CREATE EVENT / SCHEDULE REMINDER */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121216] border border-rose-500/40 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Adicionar Evento à Agenda
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Defina o compromisso e os lembretes inteligentes
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              {/* Client Selection */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Cliente do Compromisso *
                </label>
                {clients.length > 0 ? (
                  <select
                    value={formClientId}
                    onChange={(e) => setFormClientId(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.whatsapp}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400">
                    Nenhum cliente cadastrado ainda. O evento será registrado como compromisso geral.
                  </div>
                )}
              </div>

              {/* Title / Objective */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Objetivo / Título do Evento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Entrar em contato com João, Enviar orçamento para Maria..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Tipo de Ação
                </label>
                <select
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value as ReminderReason)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="entrar_em_contato">📞 Entrar em Contato</option>
                  <option value="fazer_followup">💬 Fazer Follow-up</option>
                  <option value="enviar_orcamento">💰 Enviar Orçamento</option>
                  <option value="perguntar_orcamento">❓ Perguntar sobre Orçamento</option>
                  <option value="pos_venda">⭐ Pós-Venda</option>
                  <option value="retomar_negociacao">🤝 Retomar Negociação</option>
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">
                    Data do Evento
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Multiple Reminder Notification Alerts */}
              <div>
                <label className="block text-zinc-300 font-bold mb-2 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-rose-400" />
                  Quando deseja receber a notificação? (Multi-seleção)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALERT_OPTIONS.map((opt) => {
                    const isChecked = formAlerts.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleAlert(opt.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                            isChecked ? 'bg-rose-600 text-white' : 'border border-zinc-700'
                          }`}
                        >
                          {isChecked ? '✓' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Observation */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Observações & Detalhes
                </label>
                <textarea
                  rows={2}
                  value={formObservation}
                  onChange={(e) => setFormObservation(e.target.value)}
                  placeholder="Detalhes adicionais do compromisso..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Salvar e Agendar
                </button>
              </div>
            </form>
          </div>
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

            {/* Quick Information Cards */}
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
