import React, { useState } from 'react';
import {
  Settings,
  Shield,
  User,
  Building,
  Hash,
  Database,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  Save,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { AccountSettings } from '../../types/crm';

interface SettingsViewProps {
  settings: AccountSettings;
  onUpdateSettings: (newSettings: Partial<AccountSettings>) => void;
  availableProducts: string[];
  onAddProduct: (prod: string) => void;
  onRemoveProduct: (prod: string) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  availableProducts,
  onAddProduct,
  onRemoveProduct,
  onResetData
}) => {
  const [accountNumber, setAccountNumber] = useState(settings.accountNumber);
  const [managerName, setManagerName] = useState(settings.managerName);
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState(
    settings.whatsappDefaultMessage
  );
  const [newProdName, setNewProdName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      accountNumber,
      managerName,
      companyName,
      whatsappDefaultMessage
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProdName.trim() && !availableProducts.includes(newProdName.trim())) {
      onAddProduct(newProdName.trim());
      setNewProdName('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-display">
              Configurações do Sistema & Conta Gerencial
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              SurgiLar
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie o número da Conta Gerencial, dados da empresa, catálogo e preferências do CRM
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Account & Branding Form */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display pb-3 border-b border-zinc-800">
            <Shield className="w-4 h-4 text-rose-400" />
            Identidade & Conta Gerencial
          </h3>

          <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Número da Conta Gerencial
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                    placeholder="000000"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Exibido de forma elegante no topo direito do sistema.
                </p>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Usuária Principal
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-semibold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-bold mb-1">
                  Nome da Empresa
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-semibold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-bold mb-1">
                  Mensagem Padrão de Saudação no WhatsApp
                </label>
                <textarea
                  rows={3}
                  value={whatsappDefaultMessage}
                  onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4" /> Alterações salvas com sucesso!
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 text-xs"
              >
                <Save className="w-4 h-4" />
                Salvar Configurações
              </button>
            </div>
          </form>
        </div>

        {/* Catalog & Data Maintenance */}
        <div className="space-y-6">
          {/* Catalog Management */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display pb-3 border-b border-zinc-800">
              <span>🛋️</span>
              Catálogo de Produtos (SurgiLar)
            </h3>

            <form onSubmit={handleAddNewProduct} className="flex gap-2">
              <input
                type="text"
                placeholder="Novo produto..."
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl"
                title="Adicionar produto"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {availableProducts.map((prod) => (
                <div
                  key={prod}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300"
                >
                  <span className="truncate pr-2">{prod}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveProduct(prod)}
                    className="text-zinc-400 hover:text-rose-400"
                    title="Remover do catálogo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reset / Backup */}
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display pb-2 border-b border-zinc-800">
              <Database className="w-4 h-4 text-zinc-400" />
              Banco de Dados & Memória
            </h3>
            <p className="text-xs text-zinc-400">
              Os dados são sincronizados e salvos com persistência local e proteção no navegador.
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Deseja restaurar o banco de dados com os clientes e modelos de demonstração?')) {
                  onResetData();
                }
              }}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              Restaurar Dados Padrão de Demonstração
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
