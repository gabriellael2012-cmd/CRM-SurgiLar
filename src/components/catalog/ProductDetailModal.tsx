import React, { useState, useMemo } from 'react';
import {
  X,
  Layers,
  Users,
  Tag,
  Palette,
  UserPlus,
  Search,
  Check,
  Plus,
  Edit2,
  ExternalLink,
  Sparkles,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CatalogProduct, Client } from '../../types/crm';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { formatPhoneDisplay } from '../../utils/whatsapp';

interface ProductDetailModalProps {
  product: CatalogProduct;
  clients: Client[];
  onClose: () => void;
  onSelectClient?: (client: Client) => void;
  onAssignProductToClient?: (clientId: string, productName: string) => void;
  onEditProduct?: (product: CatalogProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  clients,
  onClose,
  onSelectClient,
  onAssignProductToClient,
  onEditProduct
}) => {
  const [showAssignView, setShowAssignView] = useState(false);
  const [assignSearchQuery, setAssignSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Find all clients who have this product in productsOfInterest
  const interestedClients = useMemo(() => {
    const prodNameLower = product.name.toLowerCase().trim();
    return clients.filter((c) =>
      c.productsOfInterest?.some(
        (p) =>
          p.toLowerCase().trim() === prodNameLower ||
          prodNameLower.includes(p.toLowerCase().trim()) ||
          p.toLowerCase().trim().includes(prodNameLower)
      )
    );
  }, [clients, product.name]);

  // Clients available to assign (filtered by search)
  const assignableClients = useMemo(() => {
    const query = assignSearchQuery.toLowerCase().trim();
    return clients.filter((c) => {
      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query) ||
        c.whatsapp.includes(query) ||
        c.city?.toLowerCase().includes(query)
      );
    });
  }, [clients, assignSearchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-60 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-rose-400/40 text-xs font-semibold"
          >
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-2xl bg-[#121217] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-gradient-to-r from-[#181520] via-[#14121a] to-[#121217] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20">
                  {product.category}
                </span>
                <span className="text-[11px] text-zinc-400 hidden sm:inline-block">
                  Catálogo Oficial SurgiLar
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display truncate mt-0.5">
                {product.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors shrink-0 ml-2"
            title="Fechar visualização do produto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Specifications Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Categoria do Catálogo:
              </span>
              <span className="text-xs font-semibold text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 inline-block">
                🏷️ {product.category}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Material / Acabamento:
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                <span>{product.material || 'Acabamento Artesanal SurgiLar'}</span>
              </div>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Descrição & Detalhes:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {product.description ||
                  'Mobiliário de alto padrão da Linha SurgiLar com estrutura reforçada e acabamento artesanal de máxima durabilidade para áreas internas e externas.'}
              </p>
            </div>
          </div>

          {/* Section: Clientes com Interesse neste Produto */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-display">
                  Clientes com Interesse neste Item
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                  {interestedClients.length} {interestedClients.length === 1 ? 'cliente' : 'clientes'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAssignView(!showAssignView)}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all self-start sm:self-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{showAssignView ? 'Ocultar busca de clientes' : '+ Vincular a mais clientes'}</span>
              </button>
            </div>

            {/* Inline Client Assign Search Panel */}
            {showAssignView && (
              <div className="p-4 bg-zinc-900/90 rounded-2xl border border-rose-500/30 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200 text-xs">
                    Selecione um cliente para vincular este móvel:
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {assignableClients.length} encontrados
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar cliente por nome ou WhatsApp..."
                    value={assignSearchQuery}
                    onChange={(e) => setAssignSearchQuery(e.target.value)}
                    className="w-full bg-[#121217] border border-zinc-700 focus:border-rose-500 rounded-xl pl-9 pr-3 py-2 text-white placeholder-zinc-400 text-xs focus:outline-none"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-zinc-800/50">
                  {assignableClients.map((c) => {
                    const alreadyHas = c.productsOfInterest?.some(
                      (p) => p.toLowerCase().trim() === product.name.toLowerCase().trim()
                    );

                    return (
                      <div
                        key={c.id}
                        className="pt-1.5 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-100 truncate">{c.name}</p>
                          <p className="text-[11px] text-zinc-400 font-mono">
                            {formatPhoneDisplay(c.whatsapp)} {c.city ? `• ${c.city}` : ''}
                          </p>
                        </div>

                        {alreadyHas ? (
                          <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-500/30 shrink-0 flex items-center gap-1">
                            <Check className="w-3 h-3 text-rose-400" />
                            Já marcado
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onAssignProductToClient?.(c.id, product.name);
                              showToast(`"${product.name}" vinculado a ${c.name}!`);
                            }}
                            className="px-2.5 py-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-[11px] rounded-lg shrink-0 flex items-center gap-1 shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Vincular</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* List of Interested Clients */}
            {interestedClients.length === 0 ? (
              <div className="p-6 text-center bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800 text-zinc-400 space-y-2">
                <p className="text-xs">
                  Nenhum cliente possui este móvel marcado como produto de interesse no momento.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAssignView(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Vincular a um cliente agora</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {interestedClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-3 bg-zinc-900/80 hover:bg-zinc-900 rounded-xl border border-zinc-800 hover:border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-xs sm:text-sm truncate">
                          {client.name}
                        </p>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {client.status === 'venda_realizada'
                            ? '📦 Comprou'
                            : client.status === 'orcamento_enviado'
                            ? '💰 Orçamento'
                            : 'Interesse Ativo'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        📱 {formatPhoneDisplay(client.whatsapp)} {client.city ? `• 📍 ${client.city}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <WhatsAppButton
                        phone={client.whatsapp}
                        clientName={client.name}
                        productName={product.name}
                        size="sm"
                      />
                      {onSelectClient && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectClient(client);
                          }}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-semibold transition-colors border border-zinc-700"
                          title={`Abrir perfil completo de ${client.name}`}
                        >
                          Ver Perfil
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#0e0e13] flex items-center justify-between gap-2">
          {onEditProduct ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditProduct(product);
              }}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Editar Produto</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-950/40 transition-all"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
