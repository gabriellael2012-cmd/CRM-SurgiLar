import React, { useMemo } from 'react';
import {
  Users,
  Cake,
  Clock,
  BellRing,
  Sparkles,
  ChevronRight,
  MessageCircle,
  PartyPopper,
  Calendar,
  Gift,
  AlertCircle,
  Plus,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MessageSquareHeart,
  TrendingUp,
  PackageCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Client, SaleRecord, ReminderRecord } from '../../types/crm';
import { getBirthdayInfo, getDaysSinceLastPurchase, formatDate, formatCurrency, STATUS_CONFIG } from '../../utils/formatters';
import { ALL_WHATSAPP_SCRIPTS, prepareScriptMessage, getWhatsAppUrl } from '../../utils/whatsapp';

interface DashboardViewProps {
  clients: Client[];
  sales: SaleRecord[];
  reminders: ReminderRecord[];
  onSelectClient: (client: Client) => void;
  onNavigateToClients: () => void;
  onNavigateToReminders: () => void;
  onNavigateToSales: () => void;
  onNavigateToBirthdays?: () => void;
  onNavigateToScripts?: () => void;
  onAddClient: () => void;
  onToggleReminder?: (reminderId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clients,
  sales,
  reminders,
  onSelectClient,
  onNavigateToClients,
  onNavigateToReminders,
  onNavigateToSales,
  onNavigateToBirthdays,
  onNavigateToScripts,
  onAddClient,
  onToggleReminder
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Birthday processing
  const birthdayClients = useMemo(() => {
    return clients
      .filter((c) => !!c.birthDate)
      .map((c) => {
        const info = getBirthdayInfo(c.birthDate);
        return {
          ...c,
          birthdayInfo: info
        };
      })
      .filter(
        (c) =>
          c.birthdayInfo.isToday ||
          c.birthdayInfo.isTomorrow ||
          (c.birthdayInfo.daysUntil !== null && c.birthdayInfo.daysUntil >= 0 && c.birthdayInfo.daysUntil <= 7)
      )
      .sort((a, b) => (a.birthdayInfo.daysUntil ?? 999) - (b.birthdayInfo.daysUntil ?? 999));
  }, [clients]);

  const birthdaysTodayCount = useMemo(() => {
    return clients.filter((c) => c.birthDate && getBirthdayInfo(c.birthDate).isToday).length;
  }, [clients]);

  // 2. Clients without purchases or inactive (> 30 days)
  const inactiveClients = useMemo(() => {
    return clients
      .map((c) => {
        const days = getDaysSinceLastPurchase(c);
        return {
          client: c,
          daysSince: days
        };
      })
      .filter((item) => item.daysSince !== null && item.daysSince >= 30)
      .sort((a, b) => (b.daysSince ?? 0) - (a.daysSince ?? 0));
  }, [clients]);

  // 3. Reminders for today & pending
  const todayReminders = useMemo(() => {
    return reminders.filter((r) => !r.completed && r.date <= todayStr);
  }, [reminders, todayStr]);

  // Birthday script
  const birthdayScript =
    ALL_WHATSAPP_SCRIPTS.find((s) => s.type === 'birthday')?.template ||
    'Olá, [NOME]! 🎉 Passando para desejar um feliz aniversário! Que seu novo ciclo seja repleto de coisas boas, saúde e muitos momentos especiais. Um grande abraço da Kely e da SurgiLar! 💗';

  // Reactivation script
  const reactivationScript =
    ALL_WHATSAPP_SCRIPTS.find((s) => s.type === 'reactivation')?.template ||
    'Olá, [NOME]! Como você está? Lembrei de você hoje e passei para saber se está precisando de algo novo para seu espaço ou manutenção dos seus móveis SurgiLar! 🌸';

  const handleSendWhatsApp = (phone: string, clientName: string, template: string) => {
    const message = prepareScriptMessage(template, clientName);
    const url = getWhatsAppUrl(phone, message);
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#17111a] via-[#1c121d] to-[#121217] border border-pink-500/40 p-6 lg:p-8 shadow-xl shadow-black/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CRM Kely Alves • SurgiLar Alto Padrão</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2.5">
              Olá, Kely! 💗
            </h2>
            <p className="text-zinc-300 text-sm mt-1 max-w-xl font-medium">
              Aqui está o resumo dos seus clientes, aniversários e lembretes para facilitar seu dia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onAddClient}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 hover:from-pink-500 hover:to-rose-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/30 border border-pink-400/40 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Cliente</span>
            </button>

            {onNavigateToBirthdays && (
              <button
                type="button"
                onClick={onNavigateToBirthdays}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-pink-300 text-xs font-bold rounded-xl border border-pink-500/30 hover:border-pink-500/60 transition-all flex items-center gap-2"
              >
                <Cake className="w-4 h-4 text-pink-400" />
                <span>Aniversários ({birthdayClients.length})</span>
              </button>
            )}

            {onNavigateToScripts && (
              <button
                type="button"
                onClick={onNavigateToScripts}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 hover:border-pink-500/30 transition-all flex items-center gap-2"
              >
                <MessageSquareHeart className="w-4 h-4 text-rose-400" />
                <span>Scripts WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Cards de Métricas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4">
        {/* 1. 👥 Clientes */}
        <div
          onClick={onNavigateToClients}
          className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between border border-zinc-800/80 hover:border-pink-500/40 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              👥 Clientes
            </span>
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-display">
              {clients.length}
            </div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1 group-hover:text-pink-300 transition-colors">
              <span>Cadastrados no CRM</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* 2. 🎂 Aniversários */}
        <div
          onClick={onNavigateToBirthdays || onNavigateToClients}
          className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between border border-pink-500/30 bg-gradient-to-b from-[#1b101c] to-[#121217] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
              🎂 Aniversários
            </span>
            <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-300 group-hover:scale-110 transition-transform">
              <Cake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-pink-400 font-display flex items-center gap-2">
              {birthdayClients.length}
              {birthdaysTodayCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500 text-white animate-pulse">
                  {birthdaysTodayCount} HOJE!
                </span>
              )}
            </div>
            <p className="text-xs text-pink-300/80 mt-1 flex items-center gap-1">
              <span>Próximos 7 dias</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* 3. ⏱️ Clientes sem comprar */}
        <div
          onClick={onNavigateToClients}
          className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between border border-zinc-800/80 hover:border-amber-500/40 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              ⏱️ Sem Comprar
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-display">
              {inactiveClients.length}
            </div>
            <p className="text-xs text-amber-400/80 mt-1 flex items-center gap-1 group-hover:text-amber-300 transition-colors">
              <span>Há 30+ dias sem comprar</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* 4. 🔔 Lembretes */}
        <div
          onClick={onNavigateToReminders}
          className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between border border-zinc-800/80 hover:border-rose-500/40 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
              🔔 Lembretes
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
              <BellRing className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-display">
              {todayReminders.length}
            </div>
            <p className="text-xs text-rose-300/80 mt-1 flex items-center gap-1 group-hover:text-rose-300 transition-colors">
              <span>Para hoje ou pendentes</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 2 Colunas (Aniversariantes & Clientes sem comprar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloco 1: 🎂 Aniversariantes de Hoje / Próximos 7 Dias */}
        <div className="glass-panel rounded-2xl p-5 border border-pink-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
                  <Cake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    🎂 Aniversários (Hoje e Próximos)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Envie os parabéns no WhatsApp com 1 clique
                  </p>
                </div>
              </div>

              {onNavigateToBirthdays && (
                <button
                  type="button"
                  onClick={onNavigateToBirthdays}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List */}
            <div className="mt-4 space-y-3">
              {birthdayClients.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  Nenhum aniversário nos próximos 7 dias.
                </div>
              ) : (
                birthdayClients.slice(0, 4).map((c) => {
                  const info = c.birthdayInfo;
                  const isToday = info.isToday;
                  const isTomorrow = info.isTomorrow;

                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectClient(c)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isToday
                          ? 'bg-gradient-to-r from-pink-950/40 to-black/40 border-pink-500/60 shadow-md shadow-pink-950/30'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-pink-500/30'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate">
                            {c.name}
                          </span>
                          {isToday ? (
                            <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white font-extrabold text-[9px] animate-bounce">
                              HOJE! 🎉
                            </span>
                          ) : isTomorrow ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold">
                              Amanhã
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                              Em {info.daysUntil} dias
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                          <span>🎂 {info.formattedBirthDate}</span>
                          <span>📱 {c.whatsapp}</span>
                        </div>
                      </div>

                      {/* Quick WhatsApp Birthday Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendWhatsApp(c.whatsapp, c.name, birthdayScript);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 ${
                          isToday
                            ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-md shadow-pink-600/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                        title="Enviar mensagem de aniversário"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Parabéns</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Bloco 2: ⏱️ Clientes sem Comprar (Reativação) */}
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    ⏱️ Clientes sem Comprar
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Oportunidades de reativação e pós-venda
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToClients}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Ver clientes
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List */}
            <div className="mt-4 space-y-3">
              {inactiveClients.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  Nenhum cliente inativo há mais de 30 dias.
                </div>
              ) : (
                inactiveClients.slice(0, 4).map(({ client: c, daysSince }) => {
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectClient(c)}
                      className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate">
                            {c.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            ⏱️ {daysSince} dias sem comprar
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                          <span>📱 {c.whatsapp}</span>
                          {c.productsOfInterest?.[0] && (
                            <span className="truncate">Interesse: {c.productsOfInterest[0]}</span>
                          )}
                        </div>
                      </div>

                      {/* Quick WhatsApp Reactivation Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendWhatsApp(c.whatsapp, c.name, reactivationScript);
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
                        title="Enviar mensagem de reativação"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Reativar</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Lembretes de Hoje & Scripts Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloco 3: 🔔 Lembretes de Hoje */}
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800/80">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  🔔 Lembretes de Hoje
                </h3>
                <p className="text-xs text-zinc-400">
                  Compromissos e retornos agendados
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToReminders}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              Ver agenda
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todayReminders.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-400">
                🎉 Nenhum lembrete pendente para hoje. Parabéns!
              </div>
            ) : (
              todayReminders.slice(0, 4).map((rem) => {
                const client = clients.find((c) => c.id === rem.clientId);
                return (
                  <div
                    key={rem.id}
                    className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {onToggleReminder && (
                        <button
                          type="button"
                          onClick={() => onToggleReminder(rem.id)}
                          className="w-5 h-5 rounded-md border border-zinc-600 hover:border-pink-500 flex items-center justify-center text-transparent hover:text-pink-400 transition-colors shrink-0"
                          title="Marcar como concluído"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-white block truncate">
                          {rem.clientName}
                        </span>
                        <p className="text-xs text-zinc-400 truncate">
                          {rem.observation || 'Follow-up agendado'}
                        </p>
                      </div>
                    </div>

                    {client && (
                      <button
                        type="button"
                        onClick={() => {
                          const msg = `Olá, ${client.name}! Aqui é a Kely Alves da SurgiLar. Como posso te ajudar hoje?`;
                          const url = getWhatsAppUrl(client.whatsapp, msg);
                          if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
                        title="Conversar no WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bloco 4: 💬 Acesso Rápido aos Scripts */}
        <div className="glass-panel rounded-2xl p-5 border border-pink-500/30">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  💬 Scripts Prontos de WhatsApp
                </h3>
                <p className="text-xs text-zinc-400">
                  Modelos de mensagens prontos para enviar
                </p>
              </div>
            </div>

            {onNavigateToScripts && (
              <button
                type="button"
                onClick={onNavigateToScripts}
                className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
              >
                Abrir todos
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {ALL_WHATSAPP_SCRIPTS.slice(0, 4).map((script) => (
              <div
                key={script.id}
                onClick={onNavigateToScripts}
                className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-pink-500/40 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xl mb-1">{script.emoji}</div>
                  <h4 className="font-bold text-xs text-white group-hover:text-pink-300 transition-colors">
                    {script.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">
                    {script.description}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center text-[10px] font-bold text-pink-400">
                  <span>Usar script</span>
                  <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
