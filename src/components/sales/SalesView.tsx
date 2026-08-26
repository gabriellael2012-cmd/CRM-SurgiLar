import React, { useState, useMemo } from 'react';
import {
  PackageCheck,
  Plus,
  DollarSign,
  TrendingUp,
  Award,
  CreditCard,
  Calendar,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Edit,
  Trash2,
  Send,
  ArrowUpRight,
  Receipt,
  Percent,
  Check,
  X,
  Layers,
  ChevronDown
} from 'lucide-react';
import { SaleRecord, Client, CatalogProduct, PaymentStatus } from '../../types/crm';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SaleFormModal } from './SaleFormModal';
import { WhatsAppButton } from '../common/WhatsAppButton';
import confetti from 'canvas-confetti';

interface SalesViewProps {
  sales: SaleRecord[];
  clients: Client[];
  availableProducts: string[];
  catalogProducts?: CatalogProduct[];
  onAddSale: (sale: SaleRecord) => void;
  onUpdateSale?: (sale: SaleRecord) => void;
  onDeleteSale?: (saleId: string) => void;
  onFinalizeSale?: (sale: SaleRecord) => void;
  onSelectClient?: (client: Client) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  sales,
  clients,
  availableProducts,
  catalogProducts = [],
  onAddSale,
  onUpdateSale,
  onDeleteSale,
  onFinalizeSale,
  onSelectClient
}) => {
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<SaleRecord | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<SaleRecord | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'paid' | 'pending' | 'partial' | 'installments' | 'invoiced'>('all');

  // Overall Financial Calculations
  const totalRevenue = useMemo(() => sales.reduce((sum, s) => sum + (s.value || 0), 0), [sales]);
  const totalPaid = useMemo(
    () => sales.reduce((sum, s) => sum + (s.paidValue !== undefined ? s.paidValue : s.value || 0), 0),
    [sales]
  );
  const totalPending = useMemo(
    () => sales.reduce((sum, s) => sum + (s.pendingValue !== undefined ? s.pendingValue : (s.paymentStatus === 'pendente' ? s.value : 0)), 0),
    [sales]
  );
  const totalSalesCount = sales.length;
  const averageTicket = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

  // Filtered Sales calculation
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      // Search matches
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        s.clientName.toLowerCase().includes(term) ||
        s.product.toLowerCase().includes(term) ||
        (s.clientPhone && s.clientPhone.includes(term)) ||
        (s.paymentMethod && s.paymentMethod.toLowerCase().includes(term)) ||
        (s.invoiceNumber && s.invoiceNumber.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      // Filter tabs
      if (activeFilterTab === 'paid') return s.paymentStatus === 'pago';
      if (activeFilterTab === 'pending') return s.paymentStatus === 'pendente';
      if (activeFilterTab === 'partial') return s.paymentStatus === 'parcial';
      if (activeFilterTab === 'installments') return (s.installments && s.installments > 1) || s.paymentMethod?.toLowerCase().includes('parcel');
      if (activeFilterTab === 'invoiced') return s.isInvoiced || !!s.invoiceNumber;

      return true;
    });
  }, [sales, searchTerm, activeFilterTab]);

  // Top Products calculation
  const topSoldProducts = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    sales.forEach((s) => {
      if (!map[s.product]) {
        map[s.product] = { count: 0, total: 0 };
      }
      map[s.product].count += 1;
      map[s.product].total += s.value;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [sales]);

  // Handle Save (Create or Update)
  const handleSaveSale = (saleData: SaleRecord, finalizeNow = false) => {
    if (saleToEdit) {
      if (onUpdateSale) {
        onUpdateSale(saleData);
      }
    } else {
      onAddSale(saleData);
    }

    if (finalizeNow) {
      triggerConfetti();
    }

    setShowFormModal(false);
    setSaleToEdit(null);
  };

  // Handle Quick Finalize
  const handleQuickFinalize = (sale: SaleRecord) => {
    const updated: SaleRecord = {
      ...sale,
      paymentStatus: 'pago',
      paidValue: sale.value,
      pendingValue: 0,
      status: 'finalizada'
    };

    if (onFinalizeSale) {
      onFinalizeSale(updated);
    } else if (onUpdateSale) {
      onUpdateSale(updated);
    }

    triggerConfetti();
  };

  // Handle Quick Delete
  const handleConfirmDelete = () => {
    if (saleToDelete && onDeleteSale) {
      onDeleteSale(saleToDelete.id);
    }
    setSaleToDelete(null);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#10b981', '#ffffff', '#fbbf24']
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-rose-500/30 bg-gradient-to-r from-[#141219] via-[#1a1420] to-[#121217]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl lg:text-2xl font-extrabold text-white font-display">
              Gestão Inteligente de Vendas
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {totalSalesCount} vendas cadastradas
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-1">
            Controle automatizado de valores com catálogo SurgiLar, formas de pagamento, parcelamentos, faturamento e sincronização com histórico de clientes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSaleToEdit(null);
            setShowFormModal(true);
          }}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 via-rose-600 to-pink-600 hover:from-emerald-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 border border-emerald-400/30 flex items-center gap-2 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Nova Venda</span>
        </button>
      </div>

      {/* KPI Cards: Automated Totals & Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Faturado */}
        <div className="glass-panel rounded-2xl p-4 border-rose-500/30 bg-gradient-to-b from-[#1c1320] to-[#111116]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
              Total Faturado
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl lg:text-2xl font-extrabold text-white font-mono truncate">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-[10px] text-rose-300/80 mt-0.5 font-medium">Volume total acumulado</p>
          </div>
        </div>

        {/* Total Recebido (Pago) */}
        <div className="glass-panel rounded-2xl p-4 border-emerald-500/30 bg-gradient-to-b from-[#111c16] to-[#101512]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Valor Recebido
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl lg:text-2xl font-extrabold text-emerald-400 font-mono truncate">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-[10px] text-emerald-300/80 mt-0.5 font-medium">Pagamentos liquidados</p>
          </div>
        </div>

        {/* Total a Receber (Pendente) */}
        <div className="glass-panel rounded-2xl p-4 border-amber-500/30 bg-gradient-to-b from-[#1f1911] to-[#141210]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              A Receber / Pendente
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl lg:text-2xl font-extrabold text-amber-300 font-mono truncate">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-[10px] text-amber-300/80 mt-0.5 font-medium">Saldo parcelado ou aberto</p>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Ticket Médio
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl lg:text-2xl font-extrabold text-cyan-300 font-mono truncate">
              {formatCurrency(averageTicket)}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">Média por pedido fechado</p>
          </div>
        </div>

        {/* Fechamentos */}
        <div className="glass-panel rounded-2xl p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Fechamentos
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl lg:text-2xl font-extrabold text-purple-300 font-display">
              {totalSalesCount} pedidos
            </div>
            <p className="text-[10px] text-purple-300/80 mt-0.5 font-medium">Vendas sincronizadas</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Top Products & Detailed Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sold Products */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <Award className="w-4 h-4 text-rose-400" />
              Ranking de Vendas (SurgiLar)
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">
              {topSoldProducts.length} itens vendidos
            </span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {topSoldProducts.map(([prodName, stat], idx) => (
              <div
                key={prodName}
                className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-rose-500/40 transition-all space-y-1.5"
              >
                <div className="flex justify-between items-start text-xs gap-2">
                  <span className="font-bold text-zinc-100 flex items-start gap-1.5 min-w-0">
                    <span className="text-rose-400 font-mono font-bold">#{idx + 1}</span>
                    <span className="truncate">{prodName}</span>
                  </span>
                  <span className="text-emerald-400 font-mono font-bold whitespace-nowrap">
                    {formatCurrency(stat.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-0.5">
                  <span className="text-zinc-300 font-medium">
                    {stat.count} {stat.count === 1 ? 'unidade vendida' : 'unidades vendidas'}
                  </span>
                  <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-300 rounded font-semibold text-[9px]">
                    Linha Alta Durabilidade
                  </span>
                </div>
              </div>
            ))}

            {topSoldProducts.length === 0 && (
              <div className="py-8 text-center text-zinc-500 text-xs">
                Nenhum produto vendido registrado ainda.
              </div>
            )}
          </div>
        </div>

        {/* Detailed Sales History & Editable Cards */}
        <div className="glass-panel rounded-2xl p-5 lg:col-span-2 space-y-4">
          {/* Controls: Search & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              Histórico Detalhado & Gerenciador ({filteredSales.length})
            </h3>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar cliente, produto, NF ou pagamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-900 border border-zinc-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 w-full sm:w-64"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
            {[
              { key: 'all', label: 'Todas as Vendas', count: sales.length },
              { key: 'paid', label: '✅ 100% Pagas', count: sales.filter((s) => s.paymentStatus === 'pago').length },
              { key: 'pending', label: '⏳ Pendentes', count: sales.filter((s) => s.paymentStatus === 'pendente').length },
              { key: 'partial', label: '🔄 Parciais', count: sales.filter((s) => s.paymentStatus === 'parcial').length },
              { key: 'installments', label: '📑 Parceladas', count: sales.filter((s) => (s.installments && s.installments > 1) || s.paymentMethod?.toLowerCase().includes('parcel')).length },
              { key: 'invoiced', label: '🧾 Faturadas (NF)', count: sales.filter((s) => s.isInvoiced || s.invoiceNumber).length }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilterTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap border transition-all text-xs flex items-center gap-1.5 ${
                  activeFilterTab === tab.key
                    ? 'bg-rose-600 text-white font-bold border-rose-500 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeFilterTab === tab.key ? 'bg-black/30 text-white font-mono' : 'bg-zinc-800 text-zinc-400'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sales Cards List */}
          <div className="space-y-3.5 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredSales.map((sale) => {
              const isPaid = sale.paymentStatus === 'pago';
              const isPending = sale.paymentStatus === 'pendente';
              const isPartial = sale.paymentStatus === 'parcial';
              const curPaid = sale.paidValue !== undefined ? sale.paidValue : (isPaid ? sale.value : 0);
              const curPending = sale.pendingValue !== undefined ? sale.pendingValue : (isPaid ? 0 : sale.value);
              const matchedClient = clients.find((c) => c.id === sale.clientId);

              return (
                <div
                  key={sale.id}
                  className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-rose-500/30 transition-all space-y-3 shadow-lg shadow-black/20"
                >
                  {/* Top Bar: Client & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          if (matchedClient && onSelectClient) {
                            onSelectClient(matchedClient);
                          }
                        }}
                        className="text-sm font-bold text-white hover:text-rose-400 transition-colors flex items-center gap-1.5"
                      >
                        <span>👤</span>
                        <span>{sale.clientName}</span>
                      </button>

                      {sale.clientPhone && (
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {sale.clientPhone}
                        </span>
                      )}

                      {/* Payment Status Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          isPaid
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : isPending
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : isPartial
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        {isPaid && '✅ 100% Pago'}
                        {isPending && '⏳ Pendente'}
                        {isPartial && '🔄 Parcial'}
                        {sale.paymentStatus === 'cancelado' && '🚫 Cancelado'}
                      </span>

                      {/* Invoicing Badge */}
                      {sale.invoiceNumber && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                          🧾 {sale.invoiceNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {/* WhatsApp Button */}
                      {sale.clientPhone && (
                        <WhatsAppButton
                          phone={sale.clientPhone}
                          message={`Olá ${sale.clientName}! Passando para agradecer pela compra do ${sale.product} na SurgiLar. Seu pedido está confirmado!`}
                          className="px-2.5 py-1 text-[11px]"
                          label="WhatsApp"
                        />
                      )}

                      {/* Quick Edit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSaleToEdit(sale);
                          setShowFormModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-all text-xs"
                        title="Editar venda e valores"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Sale */}
                      <button
                        type="button"
                        onClick={() => setSaleToDelete(sale)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/40 transition-all text-xs"
                        title="Excluir venda"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Middle Row: Product & Price Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-black/40 rounded-xl border border-zinc-800/80">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                        Produto Adquirido:
                      </span>
                      <p className="text-xs font-bold text-zinc-100 flex items-center gap-1.5 mt-0.5">
                        <span>🛋️</span>
                        <span>{sale.product}</span>
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-400">
                        <span>Forma:</span>
                        <span className="font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          {sale.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center md:items-end">
                      <div className="flex items-baseline gap-2">
                        {sale.originalPrice && sale.originalPrice > sale.value && (
                          <span className="text-xs text-zinc-500 line-through font-mono">
                            {formatCurrency(sale.originalPrice)}
                          </span>
                        )}
                        <span className="text-lg font-extrabold text-emerald-400 font-mono">
                          {formatCurrency(sale.value)}
                        </span>
                      </div>

                      {/* Paid and Pending Breakdown */}
                      <div className="flex items-center gap-3 text-[11px] mt-1 font-mono">
                        <span className="text-emerald-400 font-semibold">
                          Pago: {formatCurrency(curPaid)}
                        </span>
                        {curPending > 0 && (
                          <span className="text-amber-400 font-semibold">
                            Pendente: {formatCurrency(curPending)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Date, Notes & Finalize Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 flex-wrap">
                      <span>📅 {formatDate(sale.date)}</span>
                      {sale.notes && <span>• "{sale.notes}"</span>}
                    </div>

                    {/* If sale is not yet marked 100% paid / finalized, provide 1-click button */}
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => handleQuickFinalize(sale)}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition-all self-end sm:self-auto"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Finalizar & Quitar Venda</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredSales.length === 0 && (
              <div className="p-8 text-center space-y-3 bg-black/20 rounded-2xl border border-zinc-800/80">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Nenhuma venda encontrada</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Não foram encontradas vendas com o filtro selecionado. Clique no botão abaixo para cadastrar uma nova venda.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSaleToEdit(null);
                    setShowFormModal(true);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
                >
                  + Registrar Nova Venda
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sale Form Modal (Create / Edit) */}
      <SaleFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSaleToEdit(null);
        }}
        onSave={handleSaveSale}
        clients={clients}
        catalogProducts={catalogProducts}
        availableProducts={availableProducts}
        saleToEdit={saleToEdit}
      />

      {/* Delete Confirmation Modal */}
      {saleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#121216] border border-red-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Excluir Registro de Venda?</h3>
                <p className="text-xs text-zinc-400">Esta ação atualizará os totais do CRM e Faturamento.</p>
              </div>
            </div>

            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs space-y-1">
              <p className="text-zinc-200">
                <strong>Cliente:</strong> {saleToDelete.clientName}
              </p>
              <p className="text-zinc-200">
                <strong>Produto:</strong> {saleToDelete.product}
              </p>
              <p className="text-emerald-400 font-mono font-bold">
                <strong>Valor:</strong> {formatCurrency(saleToDelete.value)}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSaleToDelete(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/50"
              >
                Sim, Excluir Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
