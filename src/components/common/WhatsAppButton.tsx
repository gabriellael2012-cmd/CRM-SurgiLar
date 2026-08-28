import React, { useState } from 'react';
import {
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Cake,
  X,
  Copy,
  Check,
  Search,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWhatsAppUrl, generateWhatsAppMessage, formatPhoneDisplay } from '../../utils/whatsapp';
import { WHATSAPP_SCRIPTS, fillScriptTemplate } from '../../data/scriptsData';

interface WhatsAppButtonProps {
  phone: string;
  clientName: string;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button-only' | 'with-number' | 'pill' | 'birthday-direct';
  customClass?: string;
  isBirthday?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone,
  clientName,
  productName,
  size = 'md',
  variant = 'button-only',
  customClass = '',
  isBirthday = false
}) => {
  const [showScriptsModal, setShowScriptsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [scriptSearch, setScriptSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleOpenWhatsApp = (
    e: React.MouseEvent,
    scriptId?: string
  ) => {
    e.stopPropagation();
    let text: string | undefined;

    if (scriptId) {
      const script = WHATSAPP_SCRIPTS.find((s) => s.id === scriptId);
      if (script) {
        text = fillScriptTemplate(script.template, clientName, productName);
      }
    } else if (isBirthday) {
      text = generateWhatsAppMessage(clientName, 'birthday', { productName });
    }

    const url = getWhatsAppUrl(phone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowScriptsModal(false);
  };

  const handleCopyScript = (e: React.MouseEvent, scriptId: string, template: string) => {
    e.stopPropagation();
    const text = fillScriptTemplate(template, clientName, productName);
    navigator.clipboard.writeText(text);
    setCopiedId(scriptId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs font-medium gap-2',
    lg: 'px-5 py-2.5 text-sm font-semibold gap-2.5'
  };

  // Filtered scripts
  const categories = [
    { id: 'todos', label: 'Todos os Scripts' },
    { id: 'aniversario', label: '🎂 Aniversário' },
    { id: 'saudacao', label: '👋 Boas-vindas' },
    { id: 'orcamento', label: '💰 Orçamento' },
    { id: 'followup', label: '⏳ Follow-up' },
    { id: 'pos_venda', label: '🌟 Pós-Venda' },
    { id: 'reativacao', label: '⏱️ Reativação' },
    { id: 'showroom', label: '🛋️ Showroom' },
    { id: 'oferta', label: '💎 Oferta Especial' }
  ];

  const filteredScripts = WHATSAPP_SCRIPTS.filter((script) => {
    const matchesCategory =
      selectedCategory === 'todos' || script.category === selectedCategory;
    const query = scriptSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      script.title.toLowerCase().includes(query) ||
      script.description.toLowerCase().includes(query) ||
      script.template.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Birthday Direct Button
  if (variant === 'birthday-direct' || isBirthday) {
    return (
      <div className={`relative inline-flex items-center ${customClass}`}>
        <button
          type="button"
          onClick={(e) => handleOpenWhatsApp(e, 'script-aniversario')}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-pink-600/30 border border-pink-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          title={`Enviar mensagem de aniversário para ${clientName}`}
        >
          <Cake className="w-4 h-4 animate-bounce" />
          <span>🎂 Enviar Parabéns no WhatsApp</span>
          <ExternalLink className="w-3 h-3 text-pink-100 opacity-90" />
        </button>
      </div>
    );
  }

  if (variant === 'with-number') {
    return (
      <div className="inline-flex items-center gap-2 bg-[#121218] border border-zinc-800 hover:border-pink-500/40 rounded-xl p-1.5 transition-all group">
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-300 font-mono">
          <span className="text-emerald-400 text-sm">📱</span>
          <span className="font-semibold text-zinc-200">{formatPhoneDisplay(phone) || phone}</span>
        </div>

        <div className="relative inline-flex items-center rounded-lg p-0.5 bg-gradient-to-r from-emerald-600/30 via-pink-600/30 to-rose-600/30 border border-emerald-500/40">
          <button
            type="button"
            onClick={(e) => handleOpenWhatsApp(e)}
            className={`flex items-center bg-gradient-to-r from-emerald-600 via-emerald-500 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white rounded-md shadow-md shadow-emerald-950/40 transition-all duration-200 transform group-hover:scale-105 active:scale-95 ${sizeClasses[size]}`}
            title={`Abrir conversa no WhatsApp com ${clientName}`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-white" />
            <span className="font-medium tracking-wide">WhatsApp</span>
            <ExternalLink className="w-3 h-3 text-emerald-100 opacity-80" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowScriptsModal(true);
            }}
            className="px-2 py-1.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-r-md transition-colors border-l border-white/15"
            title="Abrir Scripts Prontos"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          </button>
        </div>

        {/* Modal de Scripts no Celular / Desktop */}
        {renderScriptsModal()}
      </div>
    );
  }

  function renderScriptsModal() {
    return (
      <AnimatePresence>
        {showScriptsModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setShowScriptsModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#121217] border border-rose-500/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-zinc-100"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-800 bg-gradient-to-r from-[#181520] via-[#14121a] to-[#121217] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white font-display truncate">
                      Scripts Prontos WhatsApp
                    </h3>
                    <p className="text-xs text-rose-300 font-medium truncate">
                      Cliente: <strong className="text-white">{clientName}</strong> • {formatPhoneDisplay(phone)}
                      {productName ? ` • ${productName}` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowScriptsModal(false)}
                  className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors shrink-0 ml-2"
                  title="Fechar scripts"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filters & Search */}
              <div className="p-3 sm:p-4 border-b border-zinc-800/80 bg-zinc-900/60 space-y-2.5">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Filtrar scripts por palavra ou objetivo..."
                    value={scriptSearch}
                    onChange={(e) => setScriptSearch(e.target.value)}
                    className="w-full bg-[#121217] border border-zinc-700 focus:border-rose-500 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-400 focus:outline-none transition-colors"
                  />
                  {scriptSearch && (
                    <button
                      type="button"
                      onClick={() => setScriptSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Pills (horizontal scroll on mobile) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-400/50 shadow-md shadow-rose-950/40'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scripts List */}
              <div className="p-3 sm:p-5 overflow-y-auto space-y-3.5 flex-1 max-h-[60vh]">
                {filteredScripts.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400 text-xs sm:text-sm bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800">
                    Nenhum script encontrado para esta busca.
                  </div>
                ) : (
                  filteredScripts.map((script) => {
                    const renderedMessage = fillScriptTemplate(
                      script.template,
                      clientName,
                      productName
                    );
                    const isCopied = copiedId === script.id;

                    return (
                      <div
                        key={script.id}
                        className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-rose-500/40 rounded-2xl p-4 transition-all duration-200 shadow-md flex flex-col justify-between gap-3"
                      >
                        {/* Title & Tag */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-1.5 inline-block ${script.badgeColor}`}
                            >
                              {script.tag}
                            </span>
                            <h4 className="text-sm font-bold text-white font-display">
                              {script.title}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {script.description}
                            </p>
                          </div>
                        </div>

                        {/* Complete Message Preview Box */}
                        <div className="p-3.5 rounded-xl bg-[#0b141a]/90 border border-emerald-900/40 text-emerald-100 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans relative select-text">
                          <div className="text-[10px] uppercase font-bold text-emerald-400/80 mb-1 flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-emerald-400" />
                            <span>Mensagem Personalizada:</span>
                          </div>
                          {renderedMessage}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => handleCopyScript(e, script.id, script.template)}
                            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700 active:scale-95"
                            title="Copiar texto do script"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleOpenWhatsApp(e, script.id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition-all transform active:scale-95"
                            title={`Enviar este script para ${clientName}`}
                          >
                            <Send className="w-3.5 h-3.5 text-white" />
                            <span>Enviar no WhatsApp</span>
                            <ExternalLink className="w-3 h-3 text-emerald-100 opacity-80" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3.5 sm:p-4 border-t border-zinc-800 bg-[#0e0e13] flex justify-between items-center text-xs text-zinc-400">
                <span className="hidden sm:inline-block">
                  Dica: O nome de <strong className="text-zinc-200">{clientName}</strong> é inserido automaticamente.
                </span>
                <button
                  type="button"
                  onClick={() => setShowScriptsModal(false)}
                  className="w-full sm:w-auto px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold text-center"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className={`relative inline-flex items-center ${customClass}`}>
      <div className="inline-flex rounded-xl p-0.5 bg-gradient-to-r from-emerald-500/30 via-pink-500/30 to-rose-500/30 border border-emerald-500/40 hover:border-pink-500/70 shadow-lg shadow-black/40 transition-all duration-200">
        <button
          type="button"
          onClick={(e) => handleOpenWhatsApp(e)}
          className={`group flex items-center bg-gradient-to-r from-emerald-600 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white rounded-[10px] transition-all duration-200 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] ${sizeClasses[size]}`}
          title={`Abrir conversa direta com ${clientName}`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-100 transition-transform duration-200 group-hover:scale-110" />
          <span className="tracking-wide font-semibold">Conversar no WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/80 opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowScriptsModal(true);
          }}
          className="px-2.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-r-lg transition-colors border-l border-white/15 flex items-center gap-1"
          title="Ver todos os Scripts Prontos do WhatsApp"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          <ChevronDown className="w-3 h-3 text-zinc-300" />
        </button>
      </div>

      {/* Responsive Full-Screen / Modal Script Picker */}
      {renderScriptsModal()}
    </div>
  );
};
