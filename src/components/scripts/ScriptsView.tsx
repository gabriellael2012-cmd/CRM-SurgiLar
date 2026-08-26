import React, { useState } from 'react';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  ExternalLink,
  Sparkles,
  Users,
  Search,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { Client, WhatsAppScript } from '../../types/crm';
import { WHATSAPP_SCRIPTS, fillScriptTemplate } from '../../data/scriptsData';
import { getWhatsAppUrl } from '../../utils/whatsapp';

interface ScriptsViewProps {
  clients: Client[];
  onSelectClient?: (client: Client) => void;
}

export const ScriptsView: React.FC<ScriptsViewProps> = ({
  clients,
  onSelectClient
}) => {
  const [selectedClientIdByScript, setSelectedClientIdByScript] = useState<Record<string, string>>({});
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  const categories = [
    { key: 'todos', label: 'Todos os Scripts' },
    { key: 'aniversario', label: '🎂 Aniversário' },
    { key: 'saudacao', label: '👋 Saudação / Entrada' },
    { key: 'orcamento', label: '💰 Orçamento' },
    { key: 'followup', label: '⏳ Follow-up' },
    { key: 'pos_venda', label: '🌟 Pós-Venda' },
    { key: 'reativacao', label: '⏱️ Reativação' },
    { key: 'showroom', label: '🛋️ Showroom' },
    { key: 'oferta', label: '💎 Oferta' }
  ];

  const filteredScripts = WHATSAPP_SCRIPTS.filter(
    (s) => categoryFilter === 'todos' || s.category === categoryFilter
  );

  const handleCopyText = (script: WhatsAppScript, clientName?: string) => {
    const textToCopy = clientName
      ? fillScriptTemplate(script.template, clientName)
      : script.template;

    navigator.clipboard.writeText(textToCopy);
    setCopiedScriptId(script.id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  const handleSendToClient = (script: WhatsAppScript) => {
    const clientId = selectedClientIdByScript[script.id] || (clients[0]?.id ?? '');
    const client = clients.find((c) => c.id === clientId) || clients[0];

    if (!client) {
      alert('Selecione ou cadastre um cliente primeiro para enviar a mensagem.');
      return;
    }

    const text = fillScriptTemplate(
      script.template,
      client.name,
      client.productsOfInterest?.[0] || 'móveis SurgiLar'
    );
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
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                  💬 Scripts de WhatsApp Kely Alves
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Mensagens prontas e testadas para cada momento de atendimento com envio em 1 clique
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3.5 py-2 rounded-xl">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>{WHATSAPP_SCRIPTS.length} scripts oficiais disponíveis</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 pt-6 mt-4 border-t border-zinc-800/80 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat.key
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40 border border-pink-400/40'
                  : 'bg-[#161622] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Script Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredScripts.map((script) => {
          const selectedClientId = selectedClientIdByScript[script.id] || (clients[0]?.id ?? '');
          const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];
          const previewText = currentClient
            ? fillScriptTemplate(script.template, currentClient.name, currentClient.productsOfInterest?.[0])
            : script.template;

          return (
            <motion.div
              key={script.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#12111a] border border-zinc-800 hover:border-pink-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all"
            >
              <div className="space-y-3">
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      {script.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {script.description}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${script.badgeColor || 'bg-pink-500/20 text-pink-300 border-pink-500/30'} shrink-0`}>
                    {script.tag}
                  </span>
                </div>

                {/* Script Template Preview Box */}
                <div className="bg-[#0a0a0f] border border-zinc-800 rounded-xl p-4 relative group/copy">
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-pink-500">
                    "{previewText}"
                  </p>
                </div>
              </div>

              {/* Bottom Interactive Area: Client Selector & Actions */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                {/* Client Selector Dropdown */}
                {clients.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400 whitespace-nowrap">
                      Enviar para:
                    </span>
                    <select
                      value={selectedClientId}
                      onChange={(e) =>
                        setSelectedClientIdByScript((prev) => ({
                          ...prev,
                          [script.id]: e.target.value
                        }))
                      }
                      className="w-full bg-[#171622] border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500 font-medium"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.whatsapp}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleCopyText(script, currentClient?.name)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    {copiedScriptId === script.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copiar texto</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendToClient(script)}
                    className="flex-[2] py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-pink-600 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar pelo WhatsApp</span>
                    <ExternalLink className="w-3 h-3 text-pink-100 opacity-80" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
