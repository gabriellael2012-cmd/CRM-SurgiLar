import React, { useState } from 'react';
import { MessageCircle, ExternalLink, ChevronDown, Sparkles, Cake } from 'lucide-react';
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
  const [showTemplates, setShowTemplates] = useState(false);

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
    setShowTemplates(false);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs font-medium gap-2',
    lg: 'px-5 py-2.5 text-sm font-semibold gap-2.5'
  };

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

        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleOpenWhatsApp(e)}
            className={`flex items-center bg-gradient-to-r from-emerald-600 via-emerald-500 to-pink-600 hover:from-emerald-500 hover:to-pink-500 text-white rounded-lg shadow-md shadow-emerald-950/40 transition-all duration-200 transform group-hover:scale-105 active:scale-95 ${sizeClasses[size]}`}
            title={`Abrir conversa no WhatsApp com ${clientName}`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-white" />
            <span className="font-medium tracking-wide">WhatsApp</span>
            <ExternalLink className="w-3 h-3 text-emerald-100 opacity-80" />
          </button>
        </div>
      </div>
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
            setShowTemplates(!showTemplates);
          }}
          className="px-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-r-lg transition-colors border-l border-white/15"
          title="Escolher mensagem pronta"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {showTemplates && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setShowTemplates(false);
            }}
          />
          <div className="absolute right-0 top-full mt-2 w-72 z-50 bg-[#121218] border border-pink-500/40 rounded-xl shadow-2xl p-2 text-xs space-y-1 backdrop-blur-xl animate-in fade-in duration-200 max-h-80 overflow-y-auto">
            <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5 border-b border-zinc-800 pb-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>Scripts Prontos WhatsApp</span>
            </div>

            {WHATSAPP_SCRIPTS.map((script) => (
              <button
                key={script.id}
                type="button"
                onClick={(e) => handleOpenWhatsApp(e, script.id)}
                className="w-full text-left px-2.5 py-2 rounded-lg text-zinc-200 hover:bg-pink-500/10 hover:text-pink-200 border border-transparent hover:border-pink-500/30 transition-colors flex flex-col group/item"
              >
                <span className="font-bold text-zinc-100 group-hover/item:text-pink-300 flex items-center justify-between">
                  {script.title}
                </span>
                <span className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                  {script.description}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
