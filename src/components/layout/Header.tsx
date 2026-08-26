import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Check,
  Building2,
  Calendar,
  X,
  Menu,
  ShieldCheck,
  Edit2,
  ExternalLink,
  Globe,
  Sparkles
} from 'lucide-react';
import { AppNotification } from '../../types/crm';

interface HeaderProps {
  accountNumber?: string;
  onUpdateAccountNumber: (newAccount: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddClient: () => void;
  onAddReminder?: () => void;
  notifications?: AppNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onClearAllNotifications?: () => void;
  onSelectClientFromNotification?: (clientId: string) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  accountNumber = '004829',
  onUpdateAccountNumber,
  searchQuery,
  setSearchQuery,
  onAddClient,
  onAddReminder,
  notifications = [],
  onMarkNotificationAsRead,
  onClearAllNotifications,
  onSelectClientFromNotification,
  onToggleMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [tempAccount, setTempAccount] = useState(accountNumber);

  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempAccount.trim()) {
      onUpdateAccountNumber(tempAccount.trim());
      setIsEditingAccount(false);
    }
  };

  return (
    <div className="sticky top-0 z-30 flex flex-col bg-[#09090c]/95 backdrop-blur-xl border-b border-zinc-800/80">
      {/* Top Banner / Bar above Main Navigation - Official SurgiLar Site Link */}
      <div className="bg-gradient-to-r from-[#0d0d12] via-[#14121a] to-[#0d0d12] border-b border-rose-500/20 px-4 lg:px-8 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          <span className="text-[11px] font-semibold text-zinc-300 hidden sm:inline-block">
            Portal Oficial SurgiLar Móveis & Decoração
          </span>
          <span className="text-[11px] font-semibold text-zinc-300 sm:hidden">
            SurgiLar Móveis
          </span>
        </div>

        {/* Highlighted Site SurgiLar Button with Glow and Hover Animation */}
        <a
          href="https://surgilar.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#18151f] to-[#221727] text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-400 font-semibold text-[11px] sm:text-xs shadow-md shadow-rose-950/40 hover:shadow-rose-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          title="Acessar o Site Oficial SurgiLar em nova aba"
        >
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 opacity-20 group-hover:opacity-60 blur-xs transition-opacity" />
          <span className="relative flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold tracking-wide">🌐 Site SurgiLar</span>
            <ExternalLink className="w-3 h-3 text-rose-300/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </a>
      </div>

      {/* Main Header Bar with Menu Toggle, Account ID, Search & Actions */}
      <header className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left section: Mobile/Notebook toggle + Conta Gerencial Top Bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 sm:px-3 text-zinc-300 hover:text-white rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/40 transition-all flex items-center gap-2 shadow-sm group active:scale-95"
            title="Abrir / Fechar Menu de Navegação e Configurações"
          >
            <Menu className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-zinc-200 hidden sm:inline-block">Menu</span>
          </button>

          {/* Elegant CONTA GERENCIAL badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-zinc-900 via-zinc-900 to-rose-950/30 border border-rose-500/25 rounded-xl px-3.5 py-1.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
                Conta Gerencial:
              </span>

              {isEditingAccount ? (
                <form onSubmit={handleSaveAccount} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempAccount}
                    onChange={(e) => setTempAccount(e.target.value)}
                    className="w-24 bg-black border border-rose-500 rounded px-2 py-0.5 text-xs text-rose-300 font-mono focus:outline-none"
                    autoFocus
                    maxLength={12}
                  />
                  <button
                    type="submit"
                    className="p-1 bg-rose-600 text-white rounded hover:bg-rose-500 text-xs"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingAccount(false)}
                    className="p-1 bg-zinc-800 text-zinc-400 rounded hover:text-white text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5 group">
                  <span className="text-xs font-mono font-bold text-rose-300 tracking-wider">
                    {accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTempAccount(accountNumber);
                      setIsEditingAccount(true);
                    }}
                    className="opacity-60 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-rose-300 transition-opacity"
                    title="Alterar Conta Gerencial"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Company indicator for desktop */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-zinc-400 pl-2 border-l border-zinc-800">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-medium text-zinc-300">SurgiLar Móveis & Decoração</span>
          </div>
        </div>

        {/* Center/Right section: Search + Quick Add + Notifications */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 justify-end max-w-2xl">
          {/* Global Search Bar */}
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Pesquisar cliente, telefone ou produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121216] border border-zinc-800 hover:border-rose-500/40 focus:border-rose-500 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Add Client Button */}
          <button
            type="button"
            onClick={onAddClient}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 border border-rose-400/30 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Cliente</span>
          </button>

          {/* Quick Reminder Button */}
          <button
            type="button"
            onClick={onAddReminder}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 hover:border-rose-500/30 rounded-xl text-xs font-medium transition-colors"
            title="Criar novo lembrete rápido"
          >
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>+ Lembrete</span>
          </button>

          {/* Notifications Bell with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-zinc-300 hover:text-white rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              title="Central de Notificações"
            >
              <Bell className="w-4 h-4 text-zinc-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50 border border-zinc-950 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 bg-[#121216] border border-rose-500/25 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl">
                  <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#181820]/80">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                        Central de Notificações
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                          {unreadCount} novas
                        </span>
                      )}
                    </div>
                    {safeNotifications.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onClearAllNotifications?.()}
                        className="text-[11px] text-zinc-400 hover:text-rose-300 transition-colors"
                      >
                        Limpar todas
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
                    {safeNotifications.length === 0 ? (
                      <div className="p-6 text-center text-zinc-400 text-xs">
                        Nenhuma notificação no momento.
                      </div>
                    ) : (
                      safeNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onMarkNotificationAsRead?.(notif.id);
                            if (notif.clientId && onSelectClientFromNotification) {
                              onSelectClientFromNotification(notif.clientId);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-zinc-800/60 ${
                            notif.read ? 'bg-transparent text-zinc-400' : 'bg-rose-950/20 text-zinc-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-zinc-100 flex items-center gap-1.5">
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              )}
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                              {notif.time}
                            </span>
                          </div>
                          <p className="mt-1 text-zinc-300 text-[11px] leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

