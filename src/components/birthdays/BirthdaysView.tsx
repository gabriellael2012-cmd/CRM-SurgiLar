import React, { useState, useMemo } from 'react';
import { Cake, Calendar, Sparkles, MessageCircle, ExternalLink, Phone, Heart, Users, Clock, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Client, SaleRecord } from '../../types/crm';
import { calculateBirthdayInfo, calculateDaysWithoutPurchase } from '../../utils/crmCalculations';
import { getWhatsAppUrl, generateWhatsAppMessage } from '../../utils/whatsapp';
import { formatDate } from '../../utils/formatters';

interface BirthdaysViewProps {
  clients: Client[];
  sales?: SaleRecord[];
  onSelectClient: (client: Client) => void;
}

export const BirthdaysView: React.FC<BirthdaysViewProps> = ({
  clients,
  sales = [],
  onSelectClient
}) => {
  const [activeTab, setActiveTab] = useState<'todos' | 'hoje' | 'amanha' | 'semana'>('todos');

  // Process all clients with birthday info
  const processedClients = useMemo(() => {
    const list = clients
      .map((c) => ({
        client: c,
        bday: calculateBirthdayInfo(c.birthDate),
        inactive: calculateDaysWithoutPurchase(c, sales)
      }))
      .filter((item) => item.bday !== null);

    // Sort by daysUntil ascending (nearest birthday first)
    list.sort((a, b) => (a.bday?.daysUntil ?? 999) - (b.bday?.daysUntil ?? 999));
    return list;
  }, [clients, sales]);

  const todayBirthdays = useMemo(
    () => processedClients.filter((item) => item.bday?.isToday),
    [processedClients]
  );

  const tomorrowBirthdays = useMemo(
    () => processedClients.filter((item) => item.bday?.isTomorrow),
    [processedClients]
  );

  const weekBirthdays = useMemo(
    () => processedClients.filter((item) => (item.bday?.daysUntil ?? 999) <= 7 && !item.bday?.isToday),
    [processedClients]
  );

  const displayedList = useMemo(() => {
    if (activeTab === 'hoje') return todayBirthdays;
    if (activeTab === 'amanha') return tomorrowBirthdays;
    if (activeTab === 'semana') return weekBirthdays;
    return processedClients;
  }, [activeTab, todayBirthdays, tomorrowBirthdays, weekBirthdays, processedClients]);

  const handleSendBirthdayMessage = (client: Client) => {
    const text = generateWhatsAppMessage(client.name, 'birthday');
    const url = getWhatsAppUrl(client.whatsapp, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-pink-500/30 bg-gradient-to-r from-[#17111e] via-[#120e17] to-[#0d0a12] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 flex items-center justify-center text-white shadow-xl shadow-pink-600/30">
                <Cake className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                  🎂 Aniversários dos Clientes
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Acompanhe e envie mensagens carinhosas de parabéns no WhatsApp com 1 clique
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-xl text-xs font-semibold text-pink-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>{todayBirthdays.length} {todayBirthdays.length === 1 ? 'aniversariante hoje' : 'aniversariantes hoje'}</span>
            </div>
          </div>
        </div>

        {/* Birthday Tabs */}
        <div className="flex items-center gap-2 pt-6 mt-4 border-t border-zinc-800/80 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'todos'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40 border border-pink-400/40'
                : 'bg-[#161622] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <span>Todos os Aniversariantes</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-pink-300 font-mono">
              {processedClients.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hoje')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'hoje'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-600/30 border border-pink-400/40 animate-pulse'
                : 'bg-[#161622] text-pink-300 hover:text-white border border-pink-500/30'
            }`}
          >
            <span>🎉 Aniversário Hoje</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-950/60 text-white font-mono">
              {todayBirthdays.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('amanha')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'amanha'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40 border border-pink-400/40'
                : 'bg-[#161622] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <span>🎂 Aniversário Amanhã</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-pink-300 font-mono">
              {tomorrowBirthdays.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('semana')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'semana'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40 border border-pink-400/40'
                : 'bg-[#161622] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <span>🗓️ Próximos 7 dias</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-pink-300 font-mono">
              {weekBirthdays.length}
            </span>
          </button>
        </div>
      </div>

      {/* Special Today Highlight Card if any */}
      {todayBirthdays.length > 0 && activeTab !== 'amanha' && activeTab !== 'semana' && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-950/60 via-rose-950/40 to-[#120f18] border-2 border-pink-500/50 shadow-2xl shadow-pink-950/40 space-y-4">
          <div className="flex items-center gap-2 text-pink-300 text-sm font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
            <span>🎉 Comemorações de Hoje — Parabéns especiais!</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayBirthdays.map(({ client, bday, inactive }) => (
              <div
                key={client.id}
                className="p-5 rounded-xl bg-[#14101b] border border-pink-500/40 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white font-display">
                        {client.name}
                      </h4>
                      <p className="text-xs text-pink-300 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {client.whatsapp}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs rounded-full shadow-md">
                      Hoje! 🎂
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-zinc-300 space-y-1 bg-[#0d0a12] p-2.5 rounded-lg border border-zinc-800">
                    <p className="text-[11px] text-zinc-400">
                      {inactive.hasPurchased
                        ? `Última compra: ${formatDate(inactive.lastPurchaseDate)} (${inactive.lastPurchaseProduct || 'Móvel'})`
                        : 'Cliente em potencial'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendBirthdayMessage(client)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-sm shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>💬 Enviar mensagem de aniversário no WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main List */}
      {displayedList.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-dashed border-zinc-800 bg-[#0f0e15]">
          <Cake className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">Nenhum aniversariante nesta categoria</h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Cadastre a data de nascimento dos clientes para receber alertas automáticos de aniversários.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {displayedList.map(({ client, bday, inactive }) => (
              <motion.div
                key={client.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="bg-[#12111a] hover:bg-[#161422] border border-zinc-800 hover:border-pink-500/50 rounded-2xl p-5 flex flex-col justify-between group transition-all duration-200 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        onClick={() => onSelectClient(client)}
                        className="text-base font-bold text-white group-hover:text-pink-300 transition-colors font-display cursor-pointer"
                      >
                        {client.name}
                      </h3>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-pink-400" /> {client.whatsapp}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        bday?.isToday
                          ? 'bg-pink-500 text-white animate-pulse'
                          : bday?.isTomorrow
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {bday?.statusText}
                    </span>
                  </div>

                  {/* Info Box */}
                  <div className="bg-[#0b0a11] rounded-xl p-3 border border-zinc-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-pink-400" /> Data de nascimento
                      </span>
                      <span className="font-semibold text-white">
                        {bday?.formattedBirthDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                        <ShoppingBag className="w-3 h-3 text-pink-400" /> Histórico
                      </span>
                      <span className="font-medium text-pink-300">
                        {inactive.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Send Birthday Message Button */}
                <div className="mt-4 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => handleSendBirthdayMessage(client)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-pink-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Enviar Mensagem de Aniversário</span>
                    <ExternalLink className="w-3 h-3 text-pink-100 opacity-80" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
