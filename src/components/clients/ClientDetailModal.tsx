import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Package,
  Bell,
  CheckCircle2,
  Edit,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Send,
  AlertCircle,
  Search,
  Check,
  Layers
} from 'lucide-react';
import {
  Client,
  ClientStatus,
  BudgetRecord,
  ContactRecord,
  PurchaseRecord,
  ReminderRecord,
  BudgetStatus,
  ContactType,
  ReminderReason
} from '../../types/crm';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  STATUS_CONFIG,
  BUDGET_STATUS_CONFIG,
  CONTACT_TYPE_CONFIG,
  REMINDER_REASON_CONFIG
} from '../../utils/formatters';
import { WhatsAppButton } from '../common/WhatsAppButton';
import confetti from 'canvas-confetti';

interface ClientDetailModalProps {
  client: Client;
  onClose: () => void;
  onUpdateClient: (updatedClient: Client) => void;
  onDeleteClient: (clientId: string) => void;
  availableProducts: string[];
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  onClose,
  onUpdateClient,
  onDeleteClient,
  availableProducts
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'produtos' | 'orcamentos' | 'contatos' | 'compras' | 'lembretes' | 'dados'
  >('produtos');

  // New item states
  const [newProductInput, setNewProductInput] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('todos');
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);

  const filteredAvailableProducts = useMemo(() => {
    return availableProducts.filter((prod) => {
      const matchesSearch = prod.toLowerCase().includes(productSearch.toLowerCase());
      if (productCategoryFilter === 'todos') return matchesSearch;
      return matchesSearch && prod.toLowerCase().includes(productCategoryFilter.toLowerCase());
    });
  }, [availableProducts, productSearch, productCategoryFilter]);

  // Form states for Budget
  const [budgetForm, setBudgetForm] = useState<{
    product: string;
    value: string;
    date: string;
    status: BudgetStatus;
    notes: string;
  }>({
    product: client.productsOfInterest?.[0] || availableProducts[0] || '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    status: 'enviado',
    notes: ''
  });

  // Form states for Contact
  const [contactForm, setContactForm] = useState<{
    date: string;
    time: string;
    type: ContactType;
    observation: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    type: 'whatsapp',
    observation: ''
  });

  // Form states for Purchase
  const [purchaseForm, setPurchaseForm] = useState<{
    product: string;
    value: string;
    date: string;
    paymentMethod: string;
    notes: string;
  }>({
    product: client.productsOfInterest?.[0] || availableProducts[0] || '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Pix à vista',
    notes: ''
  });

  // Form states for Reminder
  const [reminderForm, setReminderForm] = useState<{
    reason: ReminderReason;
    date: string;
    time: string;
    observation: string;
  }>({
    reason: 'fazer_followup',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    observation: ''
  });

  // Quick Change Client Status
  const handleStatusChange = (newStatus: ClientStatus) => {
    const updated = { ...client, status: newStatus };
    if (newStatus === 'venda_realizada') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#f43f5e', '#ffffff', '#fbbf24']
        });
      } catch (e) {
        console.error(e);
      }
    }
    onUpdateClient(updated);
  };

  // Add Product of Interest
  const handleAddProduct = (productToAdd: string) => {
    const name = productToAdd.trim();
    if (!name || client.productsOfInterest?.includes(name)) return;
    const updatedList = [...(client.productsOfInterest || []), name];
    onUpdateClient({ ...client, productsOfInterest: updatedList });
    setNewProductInput('');
  };

  // Remove Product of Interest
  const handleRemoveProduct = (prodToRemove: string) => {
    const updatedList = (client.productsOfInterest || []).filter((p) => p !== prodToRemove);
    onUpdateClient({ ...client, productsOfInterest: updatedList });
  };

  // Add Budget
  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetForm.value.replace(/\./g, '').replace(',', '.')) || 0;
    const newBudget: BudgetRecord = {
      id: `orc-${Date.now()}`,
      product: budgetForm.product,
      value: val,
      date: budgetForm.date,
      status: budgetForm.status,
      notes: budgetForm.notes
    };

    const updatedBudgets = [newBudget, ...(client.budgets || [])];
    onUpdateClient({ ...client, budgets: updatedBudgets });
    setShowAddBudget(false);
    setBudgetForm({
      product: client.productsOfInterest?.[0] || availableProducts[0] || '',
      value: '',
      date: new Date().toISOString().split('T')[0],
      status: 'enviado',
      notes: ''
    });
  };

  // Add Contact History
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.observation.trim()) return;
    const newContact: ContactRecord = {
      id: `ct-${Date.now()}`,
      date: contactForm.date,
      time: contactForm.time,
      type: contactForm.type,
      observation: contactForm.observation.trim()
    };

    const updatedHistory = [newContact, ...(client.contactHistory || [])];
    onUpdateClient({
      ...client,
      contactHistory: updatedHistory,
      lastContactDate: contactForm.date
    });
    setShowAddContact(false);
    setContactForm({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'whatsapp',
      observation: ''
    });
  };

  // Add Purchase Record
  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(purchaseForm.value.replace(/\./g, '').replace(',', '.')) || 0;
    const newPurchase: PurchaseRecord = {
      id: `pur-${Date.now()}`,
      product: purchaseForm.product,
      value: val,
      date: purchaseForm.date,
      paymentMethod: purchaseForm.paymentMethod,
      notes: purchaseForm.notes
    };

    const updatedPurchases = [newPurchase, ...(client.purchaseHistory || [])];
    const totalSpent = updatedPurchases.reduce((acc, p) => acc + p.value, 0);

    onUpdateClient({
      ...client,
      status: 'venda_realizada',
      purchaseHistory: updatedPurchases,
      totalSpent
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ec4899', '#f43f5e', '#34d399', '#ffffff']
      });
    } catch (err) {
      console.error(err);
    }

    setShowAddPurchase(false);
  };

  // Add Reminder
  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: ReminderRecord = {
      id: `rem-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.whatsapp,
      reason: reminderForm.reason,
      date: reminderForm.date,
      time: reminderForm.time,
      observation: reminderForm.observation,
      completed: false,
      productOfInterest: client.productsOfInterest?.[0]
    };

    const updatedReminders = [newReminder, ...(client.reminders || [])];
    onUpdateClient({ ...client, reminders: updatedReminders });
    setShowAddReminder(false);
  };

  const currentStatusConfig = STATUS_CONFIG[client.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0f0f14] border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header Profile Banner */}
        <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-[#181822] via-[#15121b] to-[#111116]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 via-pink-600 to-rose-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-rose-600/30 border border-rose-400/40">
                {client.name.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl font-bold text-white font-display">
                    {client.name}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${currentStatusConfig?.badgeClass}`}
                  >
                    {currentStatusConfig?.emoji} {currentStatusConfig?.label}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1 font-mono text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {client.whatsapp}
                  </span>
                  {client.city && (
                    <span className="flex items-center gap-1 text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {client.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    Cadastrado em {formatDate(client.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <WhatsAppButton
                phone={client.whatsapp}
                clientName={client.name}
                productName={client.productsOfInterest?.[0]}
                size="md"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stage Switcher */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-rose-400" />
              Estágio da Negociação:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(Object.keys(STATUS_CONFIG) as ClientStatus[]).map((st) => {
                const isCurrent = client.status === st;
                const cfg = STATUS_CONFIG[st];
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      isCurrent
                        ? `${cfg.badgeClass} font-bold ring-1 ring-rose-400/50`
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-zinc-800 bg-[#0c0c10] flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'produtos', label: '🛋️ Produtos de Interesse', count: client.productsOfInterest?.length },
            { id: 'orcamentos', label: '💰 Orçamentos Enviados', count: client.budgets?.length },
            { id: 'contatos', label: '📅 Histórico de Contatos', count: client.contactHistory?.length },
            { id: 'compras', label: '📦 Histórico de Compras', count: client.purchaseHistory?.length },
            { id: 'lembretes', label: '🔔 Lembretes', count: client.reminders?.filter((r) => !r.completed).length },
            { id: 'dados', label: '👤 Informações Pessoais' }
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-3.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                  isActive
                    ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PRODUTOS DE INTERESSE */}
          {activeSubTab === 'produtos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                    <span>🛋️</span> Produtos pelos quais {client.name} se interessa
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Adicione itens do catálogo SurgiLar ou produtos personalizados
                  </p>
                </div>
              </div>

              {/* Add Product Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Digite o nome do produto ou selecione abaixo..."
                    value={newProductInput}
                    onChange={(e) => setNewProductInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddProduct(newProductInput);
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddProduct(newProductInput)}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-semibold shadow-md border border-rose-400/30"
                >
                  + Adicionar Produto
                </button>
              </div>

              {/* Quick Search & Filter for Catalog */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-300">
                    Catálogo SurgiLar ({availableProducts.length} itens disponíveis):
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Clique para adicionar ou remover
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Filtrar catálogo por nome ou acabamento..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-rose-500"
                  />
                  {productSearch && (
                    <button
                      type="button"
                      onClick={() => setProductSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
                  {['todos', 'Conjunto', 'Kit', 'Espreguiçadeira', 'Cadeira', 'Chaise', 'Balanço', 'Mesa', 'Banqueta', 'Champanheira', 'Puff'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap border transition-all ${
                        productCategoryFilter === cat
                          ? 'bg-rose-600 text-white font-semibold border-rose-500 shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {cat === 'todos' ? 'Todos' : cat}
                    </button>
                  ))}
                </div>

                {/* Scrollable list of products */}
                <div className="max-h-48 overflow-y-auto p-2 bg-black/40 border border-zinc-800 rounded-xl flex flex-wrap gap-1.5">
                  {filteredAvailableProducts.map((p) => {
                    const isAdded = client.productsOfInterest?.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => (isAdded ? handleRemoveProduct(p) : handleAddProduct(p))}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                          isAdded
                            ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-400/50 font-semibold shadow-sm'
                            : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:text-white hover:border-rose-500/40'
                        }`}
                      >
                        <span>{isAdded ? '✓' : '+'}</span>
                        <span>{p}</span>
                      </button>
                    );
                  })}
                  {filteredAvailableProducts.length === 0 && (
                    <div className="w-full py-4 text-center text-zinc-400 text-xs">
                      Nenhum produto encontrado para "{productSearch}".
                    </div>
                  )}
                </div>
              </div>

              {/* Current Selected Products List */}
              <div className="pt-4 border-t border-zinc-800">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Produtos Selecionados para este Cliente ({client.productsOfInterest?.length || 0})
                </h5>

                {(!client.productsOfInterest || client.productsOfInterest.length === 0) ? (
                  <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-dashed border-zinc-800 text-zinc-400 text-xs">
                    Nenhum produto de interesse cadastrado ainda. Selecione opções do catálogo acima.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {client.productsOfInterest.map((item) => (
                      <div
                        key={item}
                        className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between group hover:border-rose-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center text-sm">
                            🛋️
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-zinc-100">{item}</p>
                            <p className="text-[10px] text-zinc-400">Linha Luxo SurgiLar</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(item)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Remover produto de interesse"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORÇAMENTOS ENVIADOS */}
          {activeSubTab === 'orcamentos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    💰 Orçamentos Enviados
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Histórico de propostas comerciais e cotações da SurgiLar
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddBudget(!showAddBudget)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  {showAddBudget ? 'Cancelar' : '+ Novo Orçamento'}
                </button>
              </div>

              {/* New Budget Form Modal */}
              {showAddBudget && (
                <form
                  onSubmit={handleCreateBudget}
                  className="p-4 rounded-xl bg-zinc-900/90 border border-amber-500/30 space-y-4 animate-in fade-in duration-200"
                >
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Registrar Novo Orçamento
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-300 mb-1">Produto / Conjunto</label>
                      <input
                        type="text"
                        required
                        value={budgetForm.product}
                        onChange={(e) => setBudgetForm({ ...budgetForm, product: e.target.value })}
                        placeholder="Ex: Conjunto Cataratas Alumínio"
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Valor do Orçamento (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={budgetForm.value}
                        onChange={(e) => setBudgetForm({ ...budgetForm, value: e.target.value })}
                        placeholder="Ex: 14800.00"
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Data do Orçamento</label>
                      <input
                        type="date"
                        required
                        value={budgetForm.date}
                        onChange={(e) => setBudgetForm({ ...budgetForm, date: e.target.value })}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Status da Proposta</label>
                      <select
                        value={budgetForm.status}
                        onChange={(e) => setBudgetForm({ ...budgetForm, status: e.target.value as BudgetStatus })}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-400"
                      >
                        <option value="rascunho">Rascunho</option>
                        <option value="enviado">Enviado</option>
                        <option value="aguardando_resposta">Aguardando resposta</option>
                        <option value="aprovado">Aprovado</option>
                        <option value="recusado">Recusado</option>
                        <option value="venda_realizada">Venda realizada</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-zinc-300 mb-1">Observações / Condições</label>
                      <textarea
                        rows={2}
                        value={budgetForm.notes}
                        onChange={(e) => setBudgetForm({ ...budgetForm, notes: e.target.value })}
                        placeholder="Ex: Frete incluso, tecido náutico cinza, pagamento em até 10x sem juros..."
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddBudget(false)}
                      className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs"
                    >
                      Salvar Orçamento
                    </button>
                  </div>
                </form>
              )}

              {/* Budgets List / Cards */}
              {(!client.budgets || client.budgets.length === 0) ? (
                <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-dashed border-zinc-800 text-zinc-400 text-xs">
                  Nenhum orçamento registrado para este cliente ainda.
                </div>
              ) : (
                <div className="space-y-3">
                  {client.budgets.map((b) => {
                    const stCfg = BUDGET_STATUS_CONFIG[b.status];
                    return (
                      <div
                        key={b.id}
                        className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-amber-500/40 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-bold text-white">{b.product}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stCfg?.badgeClass}`}>
                              {stCfg?.label}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400">
                            Enviado em <span className="text-zinc-200">{formatDate(b.date)}</span>
                          </div>
                          {b.notes && (
                            <p className="text-xs text-zinc-300 italic pt-1">
                              "{b.notes}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-400 block uppercase">Valor Proposta</span>
                            <span className="text-base font-extrabold text-amber-400 font-mono">
                              {formatCurrency(b.value)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = (client.budgets || []).filter((x) => x.id !== b.id);
                              onUpdateClient({ ...client, budgets: updated });
                            }}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Remover orçamento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HISTÓRICO DE CONTATOS (TIMELINE) */}
          {activeSubTab === 'contatos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    📅 Histórico de Contatos & Comunicação
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Linha do tempo com todas as conversas, ligações e reuniões realizadas por Kely Alves
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddContact(!showAddContact)}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  {showAddContact ? 'Cancelar' : '+ Registrar Conversa'}
                </button>
              </div>

              {/* Form to add conversation */}
              {showAddContact && (
                <form
                  onSubmit={handleCreateContact}
                  className="p-4 rounded-xl bg-zinc-900/90 border border-emerald-500/30 space-y-4 animate-in fade-in duration-200"
                >
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Registrar Novo Contato
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-300 mb-1">Data</label>
                      <input
                        type="date"
                        required
                        value={contactForm.date}
                        onChange={(e) => setContactForm({ ...contactForm, date: e.target.value })}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Horário</label>
                      <input
                        type="time"
                        required
                        value={contactForm.time}
                        onChange={(e) => setContactForm({ ...contactForm, time: e.target.value })}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Canal de Contato</label>
                      <select
                        value={contactForm.type}
                        onChange={(e) => setContactForm({ ...contactForm, type: e.target.value as ContactType })}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="whatsapp">💬 WhatsApp</option>
                        <option value="ligacao">📞 Ligação Telefônica</option>
                        <option value="visita">📍 Visita Showroom / Local</option>
                        <option value="reuniao">👥 Reunião Presencial</option>
                        <option value="email">✉️ E-mail Comercial</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-zinc-300 mb-1">Observação da Conversa</label>
                      <textarea
                        rows={3}
                        required
                        value={contactForm.observation}
                        onChange={(e) => setContactForm({ ...contactForm, observation: e.target.value })}
                        placeholder="Ex: Conversei com o cliente pelo WhatsApp e enviei o catálogo de tecidos..."
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddContact(false)}
                      className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                    >
                      Salvar Histórico
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline Display */}
              {(!client.contactHistory || client.contactHistory.length === 0) ? (
                <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-dashed border-zinc-800 text-zinc-400 text-xs">
                  Nenhum contato registrado ainda.
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                  {client.contactHistory.map((contact) => {
                    const cfg = CONTACT_TYPE_CONFIG[contact.type];
                    return (
                      <div key={contact.id} className="relative group">
                        {/* Dot indicator */}
                        <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-[#121216] border-2 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] group-hover:scale-125 transition-transform" />

                        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-rose-300 font-mono">
                                {formatDateTime(contact.date, contact.time)}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 ${cfg?.color}`}>
                                {cfg?.label}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = (client.contactHistory || []).filter((x) => x.id !== contact.id);
                                onUpdateClient({ ...client, contactHistory: updated });
                              }}
                              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-400 transition-opacity"
                              title="Excluir registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-xs text-zinc-200 leading-relaxed">
                            "{contact.observation}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HISTÓRICO DE COMPRAS */}
          {activeSubTab === 'compras' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                    <Package className="w-4 h-4 text-pink-400" />
                    📦 Histórico de Compras Realizadas
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Móveis e produtos já adquiridos por {client.name} na SurgiLar
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddPurchase(!showAddPurchase)}
                  className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  {showAddPurchase ? 'Cancelar' : '+ Registrar Nova Compra'}
                </button>
              </div>

              {/* Add Purchase Form */}
              {showAddPurchase && (
                <form
                  onSubmit={handleCreatePurchase}
                  className="p-4 rounded-xl bg-zinc-900/90 border border-pink-500/30 space-y-4 animate-in fade-in duration-200"
                >
                  <h5 className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                    Registrar Venda Fechada / Compra
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-300 mb-1">Produto Comprado</label>
                      <input
                        type="text"
                        required
                        value={purchaseForm.product}
                        onChange={(e) => setPurchaseForm({ ...purchaseForm, product: e.target.value })}
                        placeholder="Ex: Conjunto Cataratas Alumínio"
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Valor Total Pago (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={purchaseForm.value}
                        onChange={(e) => setPurchaseForm({ ...purchaseForm, value: e.target.value })}
                        placeholder="Ex: 16800.00"
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Data da Venda</label>
                      <input
                        type="date"
                        required
                        value={purchaseForm.date}
                        onChange={(e) => setPurchaseForm({ ...purchaseForm, date: e.target.value })}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Forma de Pagamento</label>
                      <input
                        type="text"
                        value={purchaseForm.paymentMethod}
                        onChange={(e) => setPurchaseForm({ ...purchaseForm, paymentMethod: e.target.value })}
                        placeholder="Ex: Pix à vista, Cartão 10x..."
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-zinc-300 mb-1">Observações da Entrega / Garantia</label>
                      <textarea
                        rows={2}
                        value={purchaseForm.notes}
                        onChange={(e) => setPurchaseForm({ ...purchaseForm, notes: e.target.value })}
                        placeholder="Ex: Entrega agendada para condomínio com nota fiscal..."
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPurchase(false)}
                      className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-lg text-xs shadow-lg shadow-pink-600/30"
                    >
                      Confirmar Compra 🎉
                    </button>
                  </div>
                </form>
              )}

              {/* Purchases List */}
              {(!client.purchaseHistory || client.purchaseHistory.length === 0) ? (
                <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-dashed border-zinc-800 text-zinc-400 text-xs">
                  Nenhuma compra registrada para este cliente até o momento.
                </div>
              ) : (
                <div className="space-y-3">
                  {client.purchaseHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-gradient-to-r from-zinc-900/90 to-pink-950/20 border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{item.product}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                            Compra Confirmada
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          Compra realizada em <span className="text-zinc-200">{formatDate(item.date)}</span> • Pagamento: <span className="text-zinc-200">{item.paymentMethod}</span>
                        </p>
                        {item.notes && (
                          <p className="text-xs text-zinc-300 mt-1 italic">
                            "{item.notes}"
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 block uppercase">Valor Total</span>
                        <span className="text-base font-extrabold text-pink-400 font-mono">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: LEMBRETES */}
          {activeSubTab === 'lembretes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                    <Bell className="w-4 h-4 text-rose-400" />
                    🔔 Próximos Lembretes de Contato
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tarefas e follow-ups agendados para este cliente
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddReminder(!showAddReminder)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  {showAddReminder ? 'Cancelar' : '+ Novo Lembrete'}
                </button>
              </div>

              {/* Add Reminder Form */}
              {showAddReminder && (
                <form
                  onSubmit={handleCreateReminder}
                  className="p-4 rounded-xl bg-zinc-900/90 border border-rose-500/30 space-y-4 animate-in fade-in duration-200"
                >
                  <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Agendar Follow-up / Lembrete
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-300 mb-1">Motivo do Lembrete</label>
                      <select
                        value={reminderForm.reason}
                        onChange={(e) => setReminderForm({ ...reminderForm, reason: e.target.value as ReminderReason })}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="fazer_followup">🔔 Fazer follow-up</option>
                        <option value="perguntar_orcamento">💰 Perguntar sobre orçamento</option>
                        <option value="enviar_orcamento">📄 Enviar orçamento</option>
                        <option value="retomar_negociacao">🔄 Retomar negociação</option>
                        <option value="pos_venda">🌟 Pós-venda</option>
                        <option value="entrar_em_contato">📞 Entrar em contato</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Data</label>
                      <input
                        type="date"
                        required
                        value={reminderForm.date}
                        onChange={(e) => setReminderForm({ ...reminderForm, date: e.target.value })}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Horário</label>
                      <input
                        type="time"
                        required
                        value={reminderForm.time}
                        onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-zinc-300 mb-1">Observação do Lembrete</label>
                      <input
                        type="text"
                        required
                        value={reminderForm.observation}
                        onChange={(e) => setReminderForm({ ...reminderForm, observation: e.target.value })}
                        placeholder="Ex: Ligar para confirmar se a arquiteta aprovou as medidas..."
                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddReminder(false)}
                      className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs"
                    >
                      Salvar Lembrete
                    </button>
                  </div>
                </form>
              )}

              {/* Reminders List */}
              {(!client.reminders || client.reminders.length === 0) ? (
                <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-dashed border-zinc-800 text-zinc-400 text-xs">
                  Nenhum lembrete agendado para este cliente.
                </div>
              ) : (
                <div className="space-y-3">
                  {client.reminders.map((rem) => {
                    const cfg = REMINDER_REASON_CONFIG[rem.reason];
                    return (
                      <div
                        key={rem.id}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                          rem.completed
                            ? 'bg-zinc-900/40 border-zinc-800 opacity-60'
                            : 'bg-zinc-900/90 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = client.reminders.map((r) =>
                                r.id === rem.id ? { ...r, completed: !r.completed } : r
                              );
                              onUpdateClient({ ...client, reminders: updated });
                            }}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              rem.completed
                                ? 'bg-emerald-500 border-emerald-500 text-black'
                                : 'border-zinc-700 hover:border-rose-500'
                            }`}
                          >
                            {rem.completed && <CheckCircle2 className="w-4 h-4" />}
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${rem.completed ? 'line-through text-zinc-400' : 'text-white'}`}>
                                {rem.observation}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 ${cfg?.color}`}>
                                {cfg?.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              {formatDateTime(rem.date, rem.time)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = (client.reminders || []).filter((r) => r.id !== rem.id);
                            onUpdateClient({ ...client, reminders: updated });
                          }}
                          className="text-zinc-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: DADOS E OBSERVAÇÕES */}
          {activeSubTab === 'dados' && (
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                <FileText className="w-4 h-4 text-rose-400" />
                👤 Informações e Observações Gerais
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-zinc-400 uppercase font-semibold">Nome Completo</span>
                  <p className="text-sm font-bold text-white">{client.name}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-zinc-400 uppercase font-semibold">WhatsApp</span>
                  <p className="text-sm font-mono font-bold text-emerald-400">{client.whatsapp}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-zinc-400 uppercase font-semibold">E-mail</span>
                  <p className="text-sm text-zinc-200">{client.email || 'Não informado'}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-zinc-400 uppercase font-semibold">Cidade / Região</span>
                  <p className="text-sm text-zinc-200">{client.city || 'Não informado'}</p>
                </div>

                <div className="sm:col-span-2 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <span className="text-[11px] text-zinc-400 uppercase font-semibold">Observações Gerais</span>
                  <textarea
                    rows={4}
                    defaultValue={client.notes}
                    onBlur={(e) => onUpdateClient({ ...client, notes: e.target.value })}
                    placeholder="Adicione anotações sobre o perfil do cliente, preferências de cores, arquitetos parceiros..."
                    className="w-full bg-black/60 border border-zinc-800 focus:border-rose-500 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-400 block">
                    (As alterações nas anotações são salvas automaticamente ao clicar fora do campo)
                  </span>
                </div>
              </div>

              {/* Danger Zone: Delete Client */}
              <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-zinc-300">Excluir Cadastro</h5>
                  <p className="text-[11px] text-zinc-400">Esta ação removerá este cliente permanentemente.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir o cadastro de ${client.name}?`)) {
                      onDeleteClient(client.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/80 text-red-400 hover:text-white rounded-xl text-xs font-semibold border border-red-800/50 transition-colors"
                >
                  Excluir Cliente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
