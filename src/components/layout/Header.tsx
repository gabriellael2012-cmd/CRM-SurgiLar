import React, { useState, useEffect, useMemo } from 'react';
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
  Users,
  Layers,
  ChevronRight,
  Sparkles,
  Phone,
  Tag,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppNotification, Client, CatalogProduct } from '../../types/crm';
import { STATUS_CONFIG } from '../../utils/formatters';
import { formatPhoneDisplay } from '../../utils/whatsapp';

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
  clients?: Client[];
  catalogProducts?: CatalogProduct[];
  onSelectClient?: (client: Client) => void;
  onSelectProduct?: (product: CatalogProduct) => void;
}

// Helper for accent-insensitive and case-insensitive comparison
const normalizeSearchText = (text: string): string => {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

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
  onToggleMobileMenu,
  clients = [],
  catalogProducts = [],
  onSelectClient,
  onSelectProduct
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [tempAccount, setTempAccount] = useState(accountNumber);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempAccount.trim()) {
      onUpdateAccountNumber(tempAccount.trim());
      setIsEditingAccount(false);
    }
  };

  // Close search results dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest('[data-search-container]')) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Map of normalized product name -> clients count with interest
  const productInterestMap = useMemo(() => {
    const map: Record<string, number> = {};
    clients.forEach((c) => {
      c.productsOfInterest?.forEach((prodName) => {
        const normKey = normalizeSearchText(prodName);
        map[normKey] = (map[normKey] || 0) + 1;
      });
    });
    return map;
  }, [clients]);

  // Robust Search Results for Clients & Products
  const searchResults = useMemo(() => {
    const rawQuery = searchQuery.trim();
    if (!rawQuery) {
      return { clients: [], products: [] };
    }

    const normQuery = normalizeSearchText(rawQuery);
    const digitsQuery = rawQuery.replace(/\D/g, '');

    // 1. Search in Clients (by full name & WhatsApp)
    const matchedClients = clients.filter((c) => {
      const normClientName = normalizeSearchText(c.name);
      const cleanPhone = (c.whatsapp || '').replace(/\D/g, '');
      const normCity = normalizeSearchText(c.city || '');

      const matchesName = normClientName.includes(normQuery);
      const matchesPhone = digitsQuery.length > 0 && cleanPhone.includes(digitsQuery);
      const matchesCity = normCity.includes(normQuery);
      const matchesInterest = c.productsOfInterest?.some((p) =>
        normalizeSearchText(p).includes(normQuery)
      );

      return matchesName || matchesPhone || matchesCity || matchesInterest;
    });

    // 2. Search in Catalog Products (73 products by name, variation/material, category, description)
    const matchedProducts = catalogProducts.filter((p) => {
      const normName = normalizeSearchText(p.name);
      const normMaterial = normalizeSearchText(p.material);
      const normCategory = normalizeSearchText(p.category);
      const normDescription = normalizeSearchText(p.description || '');

      return (
        normName.includes(normQuery) ||
        normMaterial.includes(normQuery) ||
        normCategory.includes(normQuery) ||
        normDescription.includes(normQuery)
      );
    });

    return {
      clients: matchedClients,
      products: matchedProducts
    };
  }, [searchQuery, clients, catalogProducts]);

  const hasResults =
    searchResults.clients.length > 0 || searchResults.products.length > 0;
  const isSearching = searchQuery.trim().length > 0;
  const showResultsDropdown = isSearching && isSearchFocused;

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSelectClient = (client: Client) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    if (onSelectClient) {
      onSelectClient(client);
    }
  };

  const handleSelectProduct = (product: CatalogProduct) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div className="sticky top-0 z-40 flex flex-col bg-[#09090c]/95 backdrop-blur-xl border-b border-zinc-800/80">
      {/* Top Banner / Bar above Main Navigation - Official SurgiLar Site Link */}
      <div className="bg-gradient-to-r from-[#0d0d12] via-[#14121a] to-[#0d0d12] border-b border-rose-500/20 px-3 sm:px-4 lg:px-8 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          <span className="text-[11px] font-semibold text-zinc-300 hidden sm:inline-block">
            Portal Oficial SurgiLar Móveis & Decoração • Atendimento Kely Alves
          </span>
          <span className="text-[11px] font-semibold text-zinc-300 sm:hidden">
            SurgiLar • Kely Alves
          </span>
        </div>

        {/* Highlighted Site SurgiLar Button with Glow and Hover Animation */}
        <a
          href="https://surgilar.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-[#18151f] to-[#221727] text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-400 font-semibold text-[11px] sm:text-xs shadow-md shadow-rose-950/40 hover:shadow-rose-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-95"
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

      {/* Main Header Bar */}
      <header className="px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left section: Mobile/Notebook toggle + Conta Gerencial Top Bar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 sm:px-3 text-zinc-300 hover:text-white rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/40 transition-all flex items-center gap-2 shadow-sm group active:scale-95 min-h-[40px]"
            title="Abrir / Fechar Menu de Navegação e Configurações"
          >
            <Menu className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-zinc-200 hidden sm:inline-block">Menu</span>
          </button>

          {/* Elegant CONTA GERENCIAL badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-zinc-900 via-zinc-900 to-rose-950/30 border border-rose-500/25 rounded-xl px-2.5 sm:px-3.5 py-1.5 shadow-sm min-h-[40px]">
            <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-300 hidden xs:inline-block">
                Conta:
              </span>

              {isEditingAccount ? (
                <form onSubmit={handleSaveAccount} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempAccount}
                    onChange={(e) => setTempAccount(e.target.value)}
                    className="w-20 sm:w-24 bg-black border border-rose-500 rounded px-2 py-0.5 text-xs text-rose-300 font-mono focus:outline-none"
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

        {/* 💻 Center section on Desktop: Integrated Search Bar */}
        <div
          data-search-container="desktop"
          className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl relative mx-2"
        >
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 pointer-events-none" />
            <input
              type="text"
              placeholder="🔎 Pesquisar cliente ou produto..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full bg-[#121217] border border-zinc-800 hover:border-rose-500/40 focus:border-rose-500 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none transition-all shadow-inner focus:ring-2 focus:ring-rose-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/80 transition-colors"
                title="Limpar pesquisa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Instant Search Results Dropdown for Desktop */}
          {showResultsDropdown && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#121217] border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl max-h-[75vh] flex flex-col"
            >
              {renderSearchResultsContent()}
            </div>
          )}
        </div>

        {/* Right Section: Quick Add, Reminders, Notifications */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Add Client Button */}
          <button
            type="button"
            onClick={onAddClient}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-950/40 border border-rose-400/30 transition-all transform active:scale-95 min-h-[40px]"
            title="Cadastrar Novo Cliente"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline-block">+ Adicionar Cliente</span>
            <span className="xs:hidden">+ Cliente</span>
          </button>

          {/* Quick Reminder Button (Desktop) */}
          <button
            type="button"
            onClick={onAddReminder}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 hover:border-rose-500/30 rounded-xl text-xs font-medium transition-colors min-h-[40px]"
            title="Criar novo lembrete rápido"
          >
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>+ Lembrete</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-zinc-300 hover:text-white rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/40 transition-colors min-h-[40px] flex items-center justify-center"
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
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 bg-[#121217] border border-rose-500/25 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl">
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

      {/* 📱 MOBILE SEARCH BAR ROW (Full width, comfortable touch target, clean keyboard input) */}
      <div
        data-search-container="mobile"
        className="md:hidden px-3 sm:px-4 pb-3 pt-0.5 relative w-full"
      >
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400 pointer-events-none" />
          <input
            type="text"
            placeholder="🔎 Pesquisar cliente ou produto..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full h-12 bg-[#121217] border border-zinc-800 hover:border-rose-500/40 focus:border-rose-500 rounded-2xl pl-11 pr-11 text-sm sm:text-base text-zinc-100 placeholder-zinc-400 focus:outline-none transition-all shadow-inner focus:ring-2 focus:ring-rose-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl active:bg-zinc-800 transition-colors"
              title="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Search Results Overlay Dropdown */}
        {showResultsDropdown && (
          <div
            onMouseDown={(e) => e.preventDefault()}
            className="absolute top-full left-3 right-3 mt-1.5 z-50 bg-[#121217] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl max-h-[72vh] flex flex-col"
          >
            {renderSearchResultsContent()}
          </div>
        )}
      </div>
    </div>
  );

  function renderSearchResultsContent() {
    return (
      <>
        {/* Results Header */}
        <div className="p-3 sm:p-3.5 border-b border-zinc-800 bg-[#16141e] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-white font-display">
              Resultados para: <span className="text-rose-300">"{searchQuery}"</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSearchFocused(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Fechar resultados"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Scroll Body */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-4 divide-y divide-zinc-800/60 flex-1">
          {!hasResults ? (
            <div className="p-6 text-center text-zinc-400 space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-zinc-200">
                Não encontramos nenhum cliente ou produto.
              </p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Verifique se o nome do cliente, número de WhatsApp ou modelo do móvel está digitado corretamente.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchFocused(false);
                    onAddClient();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Cadastrar Novo Cliente</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800"
                >
                  Limpar busca
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 👤 CLIENTS RESULTS */}
              {searchResults.clients.length > 0 && (
                <div className="space-y-2 pt-1 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Clientes Encontrados ({searchResults.clients.length})</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">Clique para abrir o perfil</span>
                  </div>

                  <div className="space-y-1.5">
                    {searchResults.clients.map((client) => {
                      const statusInfo = STATUS_CONFIG[client.status] || {
                        label: client.status,
                        badgeColor: 'bg-zinc-800 text-zinc-300'
                      };

                      return (
                        <div
                          key={client.id}
                          onClick={() => handleSelectClient(client)}
                          className="p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-rose-500/50 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-white text-sm group-hover:text-rose-300 transition-colors truncate">
                                {client.name}
                              </p>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.badgeColor}`}
                              >
                                {statusInfo.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1 flex-wrap">
                              <span className="font-mono text-zinc-300">
                                📱 {formatPhoneDisplay(client.whatsapp)}
                              </span>
                              {client.city && <span>• 📍 {client.city}</span>}
                              {client.productsOfInterest && client.productsOfInterest.length > 0 && (
                                <span className="text-rose-300/90 truncate">
                                  • Interesse: {client.productsOfInterest.slice(0, 2).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                            <span>Ver Perfil</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 🛋️ PRODUCTS RESULTS (73 Products from Catalog) */}
              {searchResults.products.length > 0 && (
                <div className="space-y-2 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Produtos do Catálogo SurgiLar ({searchResults.products.length})</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">Clique para ver individualmente</span>
                  </div>

                  <div className="space-y-1.5">
                    {searchResults.products.map((product) => {
                      const normProdName = normalizeSearchText(product.name);
                      const interestCount = productInterestMap[normProdName] || 0;

                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-rose-500/50 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 shrink-0">
                                {product.category}
                              </span>
                              <p className="font-bold text-white text-sm group-hover:text-rose-300 transition-colors truncate">
                                {product.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1 flex-wrap">
                              <span className="text-zinc-300">
                                🎨 {product.material || 'Acabamento Artesanal SurgiLar'}
                              </span>
                              {interestCount > 0 ? (
                                <span className="text-pink-300 font-bold px-1.5 py-0.2 rounded bg-pink-500/10 border border-pink-500/20 shrink-0">
                                  ⭐ {interestCount} {interestCount === 1 ? 'cliente interessado' : 'clientes interessados'}
                                </span>
                              ) : (
                                <span className="text-zinc-500 italic shrink-0">
                                  Nenhum cliente vinculado ainda
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                            <span>Ver Móvel</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }
};
