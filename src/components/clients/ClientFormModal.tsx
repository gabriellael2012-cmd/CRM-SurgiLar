import React, { useState } from 'react';
import { X, User, Phone, Calendar, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Client } from '../../types/crm';
import { formatPhoneDisplay } from '../../utils/whatsapp';

interface ClientFormModalProps {
  onClose: () => void;
  onSave: (clientData: Partial<Client>) => void;
  availableProducts?: string[];
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 11) {
      if (digits.length > 6) {
        setWhatsapp(`(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`);
      } else if (digits.length > 2) {
        setWhatsapp(`(${digits.slice(0, 2)}) ${digits.slice(2)}`);
      } else if (digits.length > 0) {
        setWhatsapp(`(${digits}`);
      } else {
        setWhatsapp('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome completo do cliente.');
      return;
    }
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      setError('Por favor, informe um número de WhatsApp válido.');
      return;
    }

    const clientId = `cli-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const newClient: Partial<Client> = {
      id: clientId,
      name: name.trim(),
      whatsapp: formatPhoneDisplay(whatsapp.trim()),
      birthDate: birthDate ? birthDate : undefined,
      createdAt: today,
      status: 'novo',
      notes: 'Cliente cadastrado no CRM Kely Alves.',
      productsOfInterest: [],
      budgets: [],
      contactHistory: [
        {
          id: `ct-${Date.now()}`,
          date: today,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          type: 'whatsapp',
          observation: 'Cadastro do cliente realizado com sucesso.'
        }
      ],
      purchaseHistory: [],
      reminders: [],
      totalSpent: 0
    };

    onSave(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e0e14] border border-pink-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Glow & Header */}
        <div className="h-1.5 bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-500" />
        
        <div className="p-6 border-b border-zinc-800/80 bg-gradient-to-r from-[#17141d] via-[#121217] to-[#0e0e14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display tracking-tight flex items-center gap-2">
                + Novo Cliente
              </h3>
              <p className="text-xs text-zinc-400">
                Cadastre o cliente de forma simples e rápida
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Campo 1: Nome completo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-pink-400" />
              Nome completo <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Mariana Costa"
              className="w-full bg-[#16161f] border border-zinc-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all shadow-inner"
              autoFocus
            />
          </div>

          {/* Campo 2: WhatsApp */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-pink-400" />
              Número de WhatsApp <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => {
                handlePhoneChange(e);
                if (error) setError('');
              }}
              placeholder="(41) 99999-9999"
              className="w-full bg-[#16161f] border border-zinc-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all font-mono shadow-inner"
            />
            <p className="text-[11px] text-zinc-400">
              DDD + 9 dígitos para envio automático de mensagens no WhatsApp.
            </p>
          </div>

          {/* Campo 3: Data de nascimento */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              Data de nascimento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-[#16161f] border border-zinc-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all [color-scheme:dark] shadow-inner"
            />
            <p className="text-[11px] text-zinc-400">
              O CRM avisará automaticamente quando o aniversário estiver próximo! 🎂
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium text-xs transition-colors text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Check className="w-4 h-4" />
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
