import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  DollarSign,
  Calendar,
  CreditCard,
  User,
  Package,
  FileText,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SaleRecord, Client, PaymentStatus, PaymentMethodType, CatalogProduct } from '../../types/crm';
import { getSuggestedPriceForProduct, SURGILAR_CATALOG_PRODUCTS } from '../../data/catalogProducts';
import { formatCurrency } from '../../utils/formatters';

interface SaleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: SaleRecord, finalizeNow?: boolean) => void;
  clients: Client[];
  catalogProducts?: CatalogProduct[];
  availableProducts: string[];
  saleToEdit?: SaleRecord | null;
}

export const SaleFormModal: React.FC<SaleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clients,
  catalogProducts = SURGILAR_CATALOG_PRODUCTS,
  availableProducts,
  saleToEdit
}) => {
  if (!isOpen) return null;

  const isEditing = !!saleToEdit;

  // Selected Client
  const [selectedClientId, setSelectedClientId] = useState<string>(
    saleToEdit?.clientId || clients[0]?.id || 'custom'
  );
  const [customClientName, setCustomClientName] = useState<string>(
    saleToEdit?.clientId === 'custom' || !saleToEdit?.clientId ? saleToEdit?.clientName || '' : ''
  );
  const [customClientPhone, setCustomClientPhone] = useState<string>(
    saleToEdit?.clientId === 'custom' || !saleToEdit?.clientId ? saleToEdit?.clientPhone || '' : ''
  );

  // Product Selection & Catalog
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>(
    saleToEdit?.product || catalogProducts[0]?.name || availableProducts[0] || 'Conjunto Bariloche – Corda Náutica Champanhe'
  );
  const [customProductInput, setCustomProductInput] = useState('');
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  // Pricing & Calculations
  const [originalCatalogPrice, setOriginalCatalogPrice] = useState<number>(() => {
    if (saleToEdit?.originalPrice) return saleToEdit.originalPrice;
    return getSuggestedPriceForProduct(selectedProduct);
  });
  const [saleValue, setSaleValue] = useState<string>(() => {
    if (saleToEdit) return saleToEdit.value.toString();
    const suggested = getSuggestedPriceForProduct(selectedProduct);
    return suggested.toString();
  });

  // Payment Method & Installments
  const [paymentMethodType, setPaymentMethodType] = useState<PaymentMethodType>(() => {
    if (saleToEdit?.paymentMethodType) return saleToEdit.paymentMethodType;
    if (saleToEdit?.paymentMethod?.toLowerCase().includes('pix')) return 'Pix';
    if (saleToEdit?.paymentMethod?.toLowerCase().includes('dinheiro')) return 'Dinheiro';
    if (saleToEdit?.paymentMethod?.toLowerCase().includes('parcel')) return 'Parcelado';
    if (saleToEdit?.paymentMethod?.toLowerCase().includes('cart')) return 'Cartão';
    return 'Pix';
  });
  const [installments, setInstallments] = useState<number>(saleToEdit?.installments || 6);
  const [downPayment, setDownPayment] = useState<string>(
    saleToEdit?.downPayment ? saleToEdit.downPayment.toString() : '0'
  );
  const [customPaymentDetails, setCustomPaymentDetails] = useState<string>(
    saleToEdit?.paymentMethod || 'Pix à vista com 5% desconto'
  );

  // Payment Status & Amounts
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    saleToEdit?.paymentStatus || 'pago'
  );
  const [paidValue, setPaidValue] = useState<string>(() => {
    if (saleToEdit?.paidValue !== undefined) return saleToEdit.paidValue.toString();
    if (saleToEdit?.value) return saleToEdit.value.toString();
    const suggested = getSuggestedPriceForProduct(selectedProduct);
    return suggested.toString();
  });

  // Invoice & Date
  const [date, setDate] = useState<string>(
    saleToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [isInvoiced, setIsInvoiced] = useState<boolean>(saleToEdit?.isInvoiced ?? true);
  const [invoiceNumber, setInvoiceNumber] = useState<string>(
    saleToEdit?.invoiceNumber || `NF-00${Math.floor(4800 + Math.random() * 90)}`
  );
  const [notes, setNotes] = useState<string>(
    saleToEdit?.notes || 'Venda de mobiliário de alto padrão SurgiLar. Garantia de 5 anos.'
  );

  // Automated price pre-filling when selecting product (if not editing or if user picks a new product)
  const handleSelectProduct = (prodName: string) => {
    setSelectedProduct(prodName);
    const suggested = getSuggestedPriceForProduct(prodName);
    setOriginalCatalogPrice(suggested);
    setSaleValue(suggested.toString());

    // Update paid value default if status is 'pago'
    if (paymentStatus === 'pago') {
      setPaidValue(suggested.toString());
    } else if (paymentStatus === 'pendente') {
      setPaidValue('0');
    }
    setShowCatalogDropdown(false);
    setProductSearch('');
  };

  // Numerical value calculations
  const numericSaleValue = parseFloat(saleValue) || 0;
  const numericPaidValue = parseFloat(paidValue) || 0;
  const numericDownPayment = parseFloat(downPayment) || 0;
  const pendingValue = Math.max(0, numericSaleValue - numericPaidValue);

  // Discount calculation
  const discountAmount = Math.max(0, originalCatalogPrice - numericSaleValue);
  const discountPercent =
    originalCatalogPrice > 0 && discountAmount > 0
      ? ((discountAmount / originalCatalogPrice) * 100).toFixed(1)
      : '0';

  // Installment calculation: (Total - DownPayment) / Installments
  const calculatedInstallmentValue = useMemo(() => {
    if (installments <= 0) return 0;
    const remainingToInstall = Math.max(0, numericSaleValue - numericDownPayment);
    return remainingToInstall / installments;
  }, [numericSaleValue, numericDownPayment, installments]);

  // Sync paid value when paymentStatus switches
  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    setPaymentStatus(newStatus);
    if (newStatus === 'pago') {
      setPaidValue(numericSaleValue.toString());
    } else if (newStatus === 'pendente') {
      setPaidValue('0');
    } else if (newStatus === 'parcial' && numericPaidValue === 0) {
      setPaidValue((numericSaleValue / 2).toFixed(2));
    }
  };

  // Quick discount buttons
  const applyQuickPrice = (type: 'original' | '5off' | '10off' | 'freight') => {
    if (type === 'original') {
      setSaleValue(originalCatalogPrice.toString());
      if (paymentStatus === 'pago') setPaidValue(originalCatalogPrice.toString());
    } else if (type === '5off') {
      const val = Math.round(originalCatalogPrice * 0.95);
      setSaleValue(val.toString());
      if (paymentStatus === 'pago') setPaidValue(val.toString());
    } else if (type === '10off') {
      const val = Math.round(originalCatalogPrice * 0.90);
      setSaleValue(val.toString());
      if (paymentStatus === 'pago') setPaidValue(val.toString());
    } else if (type === 'freight') {
      const val = originalCatalogPrice + 350;
      setSaleValue(val.toString());
      if (paymentStatus === 'pago') setPaidValue(val.toString());
    }
  };

  // Filter catalog list for search
  const filteredCatalog = useMemo(() => {
    if (!productSearch) return catalogProducts.slice(0, 15);
    return catalogProducts.filter((p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.material.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [catalogProducts, productSearch]);

  const handleSubmit = (e: React.FormEvent, finalize = false) => {
    e.preventDefault();

    let clientName = 'Cliente Avulso';
    let clientPhone = '';
    let clientId = selectedClientId;

    if (selectedClientId === 'custom') {
      clientName = customClientName || 'Cliente Avulso';
      clientPhone = customClientPhone || '';
      clientId = `cli-custom-${Date.now()}`;
    } else {
      const foundClient = clients.find((c) => c.id === selectedClientId);
      if (foundClient) {
        clientName = foundClient.name;
        clientPhone = foundClient.whatsapp;
      }
    }

    // Build final payment method text
    let finalPaymentMethod = customPaymentDetails;
    if (paymentMethodType === 'Pix') {
      finalPaymentMethod = 'Pix à vista';
    } else if (paymentMethodType === 'Dinheiro') {
      finalPaymentMethod = 'Dinheiro em espécie';
    } else if (paymentMethodType === 'Cartão') {
      finalPaymentMethod = 'Cartão de Débito/Crédito 1x';
    } else if (paymentMethodType === 'Parcelado') {
      if (numericDownPayment > 0) {
        finalPaymentMethod = `Entrada de ${formatCurrency(numericDownPayment)} + ${installments}x de ${formatCurrency(calculatedInstallmentValue)}`;
      } else {
        finalPaymentMethod = `Parcelado em ${installments}x de ${formatCurrency(calculatedInstallmentValue)}`;
      }
    }

    const salePayload: SaleRecord = {
      id: saleToEdit?.id || `sale-${Date.now()}`,
      clientId,
      clientName,
      clientPhone,
      product: selectedProduct || customProductInput || 'Mobiliário SurgiLar',
      originalPrice: originalCatalogPrice,
      value: numericSaleValue,
      paidValue: numericPaidValue,
      pendingValue: pendingValue,
      paymentStatus: finalize ? 'pago' : paymentStatus,
      paymentMethod: finalPaymentMethod,
      paymentMethodType,
      installments: paymentMethodType === 'Parcelado' ? installments : undefined,
      installmentValue: paymentMethodType === 'Parcelado' ? calculatedInstallmentValue : undefined,
      downPayment: numericDownPayment > 0 ? numericDownPayment : undefined,
      invoiceNumber: isInvoiced ? invoiceNumber : undefined,
      isInvoiced,
      date,
      notes,
      discount: discountAmount > 0 ? discountAmount : undefined,
      status: finalize ? 'finalizada' : saleToEdit?.status || 'finalizada'
    };

    onSave(salePayload, finalize);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#111116] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-900 via-[#181119] to-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-rose-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {isEditing ? 'Editar Venda e Valores' : 'Registrar Nova Venda Inteligente'}
              </h3>
              <p className="text-xs text-zinc-400">
                Preenchimento automático do Catálogo SurgiLar com recálculo em tempo real
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Section 1: Cliente */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-400" />
              1. Cliente Comprador
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
                >
                  <optgroup label="Clientes Cadastrados">
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        👤 {c.name} — {c.whatsapp}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Outro">
                    <option value="custom">+ Cadastrar Cliente Avulso</option>
                  </optgroup>
                </select>
              </div>

              {selectedClientId === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nome do cliente"
                    value={customClientName}
                    onChange={(e) => setCustomClientName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp (ex: 41 99999-8888)"
                    value={customClientPhone}
                    onChange={(e) => setCustomClientPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Produto e Auto-Preenchimento */}
          <div className="space-y-2 pt-1 border-t border-zinc-800/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-rose-400" />
                2. Produto Vendido (Catálogo SurgiLar)
              </label>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-preenchimento ativado
              </span>
            </div>

            {/* Current Product Selected Display */}
            <div className="p-3 bg-zinc-900/90 border border-zinc-700/80 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">🛋️</span>
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">
                    {selectedProduct}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Preço sugerido do catálogo: <strong className="text-emerald-400">{formatCurrency(originalCatalogPrice)}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCatalogDropdown(!showCatalogDropdown)}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
              >
                {showCatalogDropdown ? 'Fechar Catálogo' : 'Trocar Produto'}
              </button>
            </div>

            {/* Catalog Selector Dropdown */}
            {showCatalogDropdown && (
              <div className="p-3 bg-black/70 border border-rose-500/30 rounded-xl space-y-2 animate-in fade-in duration-150">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar entre os 73 produtos da SurgiLar..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="max-h-44 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                  {filteredCatalog.map((p) => {
                    const isCur = selectedProduct === p.name;
                    const price = p.suggestedPrice || getSuggestedPriceForProduct(p.name);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProduct(p.name)}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                          isCur
                            ? 'bg-rose-600 text-white font-bold'
                            : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200'
                        }`}
                      >
                        <span className="truncate pr-2">{p.name}</span>
                        <span className="font-mono text-emerald-300 font-bold whitespace-nowrap">
                          {formatCurrency(price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Valor da Venda e Descontos */}
          <div className="space-y-2 pt-1 border-t border-zinc-800/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-rose-400" />
                3. Valor da Venda e Ajuste Comercial
              </label>
              {discountAmount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Desconto de {formatCurrency(discountAmount)} ({discountPercent}%)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1 font-medium">
                  Valor Final Fechado (R$) — <span className="text-rose-400 font-semibold">100% Editável</span>:
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={saleValue}
                    onChange={(e) => {
                      setSaleValue(e.target.value);
                      if (paymentStatus === 'pago') {
                        setPaidValue(e.target.value);
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-rose-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">
                  Atalhos Rápidos de Negociação:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyQuickPrice('original')}
                    className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-[11px] text-zinc-300 transition-all text-center truncate"
                    title="Voltar ao preço de tabela"
                  >
                    Tabela ({formatCurrency(originalCatalogPrice)})
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickPrice('5off')}
                    className="px-2 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 font-semibold transition-all text-center"
                    title="-5% à vista"
                  >
                    -5% À Vista
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickPrice('10off')}
                    className="px-2 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 rounded-lg text-[11px] text-rose-300 font-semibold transition-all text-center"
                    title="-10% negociação especial"
                  >
                    -10% Especial
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickPrice('freight')}
                    className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-[11px] text-zinc-300 transition-all text-center"
                    title="+ R$ 350 frete"
                  >
                    + R$ 350 Frete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Forma de Pagamento e Parcelas */}
          <div className="space-y-2 pt-1 border-t border-zinc-800/60">
            <label className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-rose-400" />
              4. Forma de Pagamento
            </label>

            {/* Payment Method Badges */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['Pix', 'Dinheiro', 'Cartão', 'Parcelado', 'Outro'] as PaymentMethodType[]).map((type) => {
                const isSelected = paymentMethodType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPaymentMethodType(type)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-400 shadow-md'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {type === 'Pix' && '⚡ Pix'}
                    {type === 'Dinheiro' && '💵 Dinheiro'}
                    {type === 'Cartão' && '💳 Cartão'}
                    {type === 'Parcelado' && '📑 Parcelado'}
                    {type === 'Outro' && '🔄 Outro'}
                  </button>
                );
              })}
            </div>

            {/* If Parcelado, show smart installments calculation */}
            {paymentMethodType === 'Parcelado' && (
              <div className="p-3 bg-gradient-to-br from-rose-950/20 via-zinc-900 to-zinc-900 border border-rose-500/30 rounded-xl space-y-3 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">
                      Quantidade de Parcelas:
                    </label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                      className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-xs text-white font-bold"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 24].map((num) => (
                        <option key={num} value={num}>
                          {num}x sem juros (ou conforme negociação)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">
                      Valor da Entrada (R$) opcional:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Live Installment Calculation Display */}
                <div className="p-2.5 bg-black/60 rounded-lg border border-rose-500/20 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">
                    {numericDownPayment > 0 ? (
                      <>
                        Entrada de <strong className="text-emerald-400">{formatCurrency(numericDownPayment)}</strong> +{' '}
                        <strong className="text-rose-300">{installments}x</strong> de:
                      </>
                    ) : (
                      <>
                        Plano de <strong className="text-rose-300">{installments}x</strong> parcelas de:
                      </>
                    )}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
                    {formatCurrency(calculatedInstallmentValue)} / mês
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Status do Pagamento e Valores Recebido / Pendente */}
          <div className="space-y-2 pt-1 border-t border-zinc-800/60">
            <label className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              5. Status do Pagamento e Controle Financeiro
            </label>

            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'pago', label: '✅ 100% Pago', color: 'border-emerald-500 text-emerald-300 bg-emerald-950/30' },
                { key: 'pendente', label: '⏳ Pendente', color: 'border-amber-500 text-amber-300 bg-amber-950/30' },
                { key: 'parcial', label: '🔄 Parcial', color: 'border-cyan-500 text-cyan-300 bg-cyan-950/30' },
                { key: 'cancelado', label: '🚫 Cancelado', color: 'border-red-500 text-red-300 bg-red-950/30' }
              ].map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => handlePaymentStatusChange(st.key as PaymentStatus)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                    paymentStatus === st.key ? `${st.color} shadow-sm font-extrabold` : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Paid and Pending input display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] text-emerald-300 font-semibold block mb-1">
                  💵 Valor já Pago / Recebido (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paidValue}
                  onChange={(e) => setPaidValue(e.target.value)}
                  className="w-full bg-zinc-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-amber-300 font-semibold block mb-1">
                  ⏳ Valor Pendente a Receber (R$):
                </label>
                <div className="w-full bg-zinc-900/80 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold">
                  {formatCurrency(pendingValue)}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Faturamento & Data */}
          <div className="space-y-2 pt-1 border-t border-zinc-800/60">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">Data da Venda:</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">Nota Fiscal / Pedido:</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Ex: NF-004830"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isInvoiced}
                    onChange={(e) => setIsInvoiced(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 bg-zinc-900 border-zinc-700"
                  />
                  <span>Faturamento Emitido</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-300 block mb-1">Observações da Venda:</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Prazo de entrega, arquiteto parceiro, condições especiais..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Real-time Recalculated Summary Card */}
          <div className="p-4 bg-gradient-to-r from-zinc-900 via-[#19121a] to-zinc-900 border border-rose-500/30 rounded-2xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider block">
              📊 Resumo da Operação Recalculado:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Total da Venda</span>
                <span className="font-mono font-bold text-white">{formatCurrency(numericSaleValue)}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 block">Valor Pago</span>
                <span className="font-mono font-bold text-emerald-400">{formatCurrency(numericPaidValue)}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400 block">Valor Pendente</span>
                <span className="font-mono font-bold text-amber-300">{formatCurrency(pendingValue)}</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-400 block">Faturamento</span>
                <span className="font-mono font-bold text-rose-300">{isInvoiced ? invoiceNumber : 'Pendente'}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-all"
            >
              Cancelar
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs border border-zinc-700 transition-all"
              >
                {isEditing ? 'Salvar Alterações' : 'Salvar como Rascunho'}
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-rose-600 to-pink-600 hover:from-emerald-500 hover:to-pink-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-950/40 border border-emerald-400/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Finalizar Venda 🎉</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
