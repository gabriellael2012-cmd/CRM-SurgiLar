import React from 'react';
import {
  LayoutDashboard,
  Users,
  BadgePercent,
  PackageCheck,
  CalendarDays,
  BellRing,
  BarChart3,
  Settings,
  BookOpen,
  Sparkles,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Layers,
  Globe
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'catalog'
  | 'clients'
  | 'budgets'
  | 'sales'
  | 'schedule'
  | 'reminders'
  | 'reports'
  | 'settings'
  | 'tutorial';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  accountNumber?: string;
  unreadRemindersCount?: number;
  remindersCount?: number;
  catalogCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  accountNumber = '004829',
  unreadRemindersCount,
  remindersCount,
  catalogCount = 73,
  onLogout
}) => {
  const isMobileOpen = isOpenMobile ?? isMobileMenuOpen ?? false;
  const closeMobileMenu = () => {
    if (setIsOpenMobile) setIsOpenMobile(false);
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  const effectiveRemindersCount = unreadRemindersCount ?? remindersCount ?? 0;
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'catalog',
      label: 'Catálogo SurgiLar',
      icon: <Layers className="w-4 h-4" />,
      badge: catalogCount
    },
    {
      id: 'clients',
      label: 'Gestão de Clientes',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'budgets',
      label: 'Orçamentos',
      icon: <BadgePercent className="w-4 h-4" />
    },
    {
      id: 'sales',
      label: 'Vendas',
      icon: <PackageCheck className="w-4 h-4" />
    },
    {
      id: 'schedule',
      label: 'Agenda',
      icon: <CalendarDays className="w-4 h-4" />
    },
    {
      id: 'reminders',
      label: 'Lembretes',
      icon: <BellRing className="w-4 h-4" />,
      badge: effectiveRemindersCount > 0 ? effectiveRemindersCount : undefined
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-4 h-4" />
    }
  ];


  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    closeMobileMenu();
  };

  return (
    <>
      {/* Backdrop for Mobile, Tablet & Notebook */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Slide-in Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-[#0d0d11] border-r border-zinc-800/80 flex flex-col justify-between transition-transform duration-300 ease-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0 shadow-rose-950/50' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div className="p-5 border-b border-zinc-800/80 bg-gradient-to-b from-[#16161d] to-[#0d0d11]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/25 border border-rose-400/40">
                <span className="font-extrabold text-white tracking-tighter text-lg font-display">KA</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold text-white tracking-wide font-display">CRM KELY ALVES</h1>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium tracking-tight">SurgiLar • Gestão Inteligente</p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
              title="Fechar Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Status Pill */}
          <div className="mt-4 p-2.5 rounded-xl bg-zinc-900/90 border border-rose-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-medium text-zinc-300">Conta Ativa</span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
              #{accountNumber}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Navegação Principal
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold shadow-lg shadow-rose-950/50 border border-rose-400/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/70 hover:border-zinc-700/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-rose-400 transition-colors'}`}>
                    {item.icon}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-white text-rose-600'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-rose-200" />}
                </div>
              </button>
            );
          })}

          {/* Dedicated Section for the Tutorial requested */}
          <div className="pt-3">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-rose-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Manual & Treinamento</span>
            </div>
            <button
              type="button"
              onClick={() => handleSelect('tutorial')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                activeTab === 'tutorial'
                  ? 'bg-gradient-to-r from-rose-600/90 to-pink-600/90 text-white font-semibold shadow-lg shadow-rose-950/50 border border-rose-400/30'
                  : 'bg-zinc-900/60 border border-rose-500/20 text-rose-300 hover:bg-rose-950/30 hover:border-rose-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-rose-400" />
                <span className="font-semibold tracking-wide">Como Usar o CRM</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Guia VIP
              </span>
            </button>
          </div>
        </div>

        {/* Bottom User & SurgiLar Brand Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-[#0a0a0e] space-y-3">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold text-xs">
                KA
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-100">Kely Alves</p>
                <p className="text-[10px] text-zinc-400">SurgiLar Comercial</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
              title="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] px-1 text-zinc-400">
            <span className="font-bold tracking-wider text-rose-400 uppercase">SurgiLar</span>
            <span className="text-[10px] text-zinc-400">v2.6 Enterprise</span>
          </div>
        </div>
      </aside>
    </>
  );
};
