import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  UserPlus,
  Layers,
  Sparkles,
  Check,
  X,
  MessageCircle,
  ExternalLink,
  Tag,
  Palette,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CatalogProduct, ProductCategory, Client } from '../../types/crm';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { ProductDetailModal } from './ProductDetailModal';

interface CatalogViewProps {
  catalogProducts: CatalogProduct[];
  clients: Client[];
  onAddProduct: (newProduct: Omit<CatalogProduct, 'id'>) => void;
  onUpdateProduct: (product: CatalogProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onAssignProductToClient: (clientId: string, productName: string) => void;
  onSelectClient?: (client: Client) => void;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'todos', label: 'Todos', icon: '✨' },
  { id: 'Conjuntos', label: 'Conjuntos', icon: '🛋️' },
  { id: 'Kits', label: 'Kits', icon: '📦' },
  { id: 'Espreguiçadeiras', label: 'Espreguiçadeiras', icon: '🏖️' },
  { id: 'Cadeiras', label: 'Cadeiras', icon: '🪑' },
  { id: 'Chaises', label: 'Chaises', icon: '🌴' },
  { id: 'Balanços', label: 'Balanços', icon: '🌿' },
  { id: 'Mesas', label: 'Mesas', icon: '🪵' },
  { id: 'Banquetas', label: 'Banquetas & Bistrôs', icon: '🍸' },
  { id: 'Champanheiras', label: 'Champanheiras', icon: '🍾' },
  { id: 'Puffs', label: 'Puffs', icon: '🛋️' }
];

// Helper for accent-insensitive and case-insensitive comparison
const normalizeSearchText = (text: string): string => {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export const CatalogView: React.FC<CatalogViewProps> = ({
  catalogProducts,
  clients,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAssignProductToClient,
  onSelectClient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Modals
  const [detailProduct, setDetailProduct] = useState<CatalogProduct | null>(null);
  const [editProduct, setEditProduct] = useState<CatalogProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [assignProduct, setAssignProduct] = useState<CatalogProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<CatalogProduct | null>(null);

  // Form states for Create/Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Conjuntos');
  const [formMaterial, setFormMaterial] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Assign modal state
  const [assignClientSearch, setAssignClientSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Pre-fill edit form
  const handleOpenEdit = (prod: CatalogProduct) => {
    setEditProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormMaterial(prod.material);
    setFormDescription(prod.description || '');
  };

  // Open create form
  const handleOpenCreate = () => {
    setIsCreating(true);
    setFormName('');
    setFormCategory('Conjuntos');
    setFormMaterial('');
    setFormDescription('');
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editProduct) {
      onUpdateProduct({
        ...editProduct,
        name: formName.trim(),
        category: formCategory,
        material: formMaterial.trim() || 'Acabamento Artesanal SurgiLar',
        description: formDescription.trim()
      });
      showToast(`Produto "${formName.trim()}" atualizado com sucesso!`);
      setEditProduct(null);
    } else if (isCreating) {
      onAddProduct({
        name: formName.trim(),
        category: formCategory,
        material: formMaterial.trim() || 'Acabamento Artesanal SurgiLar',
        description: formDescription.trim()
      });
      showToast(`Novo produto "${formName.trim()}" cadastrado no catálogo!`);
      setIsCreating(false);
    }
  };

  // Map of product -> clients who have it in productsOfInterest
  const productInterestMap = useMemo(() => {
    const map: Record<string, Client[]> = {};
    clients.forEach((client) => {
      client.productsOfInterest?.forEach((prodName) => {
        const normKey = normalizeSearchText(prodName);
        if (!map[normKey]) map[normKey] = [];
        map[normKey].push(client);
      });
    });
    return map;
  }, [clients]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    const rawQuery = searchQuery.trim();
    const normQuery = normalizeSearchText(rawQuery);

    return catalogProducts.filter((prod) => {
      const normName = normalizeSearchText(prod.name);
      const normMaterial = normalizeSearchText(prod.material);
      const normCategory = normalizeSearchText(prod.category);
      const normDescription = normalizeSearchText(prod.description || '');

      const matchesSearch =
        !rawQuery ||
        normName.includes(normQuery) ||
        normMaterial.includes(normQuery) ||
        normCategory.includes(normQuery) ||
        normDescription.includes(normQuery);

      const matchesCat =
        selectedCategory === 'todos' ||
        (selectedCategory === 'Banquetas'
          ? prod.category === 'Banquetas' || normName.includes('bistro')
          : prod.category === selectedCategory);

      return matchesSearch && matchesCat;
    });
  }, [catalogProducts, searchQuery, selectedCategory]);

  // Category count map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: catalogProducts.length };
    catalogProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [catalogProducts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-rose-400/40 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner: Title, Subtitle, Stats and Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141219] via-[#161420] to-[#121217] border border-rose-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
              Catálogo de Produtos — SurgiLar
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            {catalogProducts.length} móveis e acabamentos exclusivos cadastrados no CRM para atendimento e propostas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://surgilar.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-rose-300 hover:text-white border border-rose-500/30 hover:border-rose-500 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>🌐 Ver Site Oficial</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/50 border border-rose-400/30 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Search & Categories Filter Bar */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Pesquisar produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121217] border border-zinc-800 focus:border-rose-500 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder-zinc-400 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'todos' ? catalogProducts.length : (categoryCounts[cat.id] || 0);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold border-rose-400/50 shadow-md shadow-rose-950/40'
                    : 'bg-[#121217] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ml-0.5 ${
                    isSelected ? 'bg-white/20 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>
          Mostrando <strong className="text-zinc-200">{filteredProducts.length}</strong> de{' '}
          <strong className="text-zinc-200">{catalogProducts.length}</strong> produtos
          {selectedCategory !== 'todos' ? ` na categoria "${selectedCategory}"` : ''}
          {searchQuery ? ` com a busca "${searchQuery}"` : ''}
        </span>
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-[#121217] rounded-2xl border border-dashed border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-display">Nenhum produto encontrado</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Não encontramos nenhum produto que coincida com os termos buscados. Tente limpar os filtros.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('todos');
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
          >
            Limpar Filtros de Pesquisa
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const interestedClients = productInterestMap[normalizeSearchText(product.name)] || [];
              const interestedCount = interestedClients.length;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="bg-[#121217] hover:bg-[#15151c] border border-zinc-800/90 hover:border-rose-500/40 rounded-2xl p-5 flex flex-col justify-between group transition-all duration-200 shadow-lg relative overflow-hidden"
                >
                  {/* Subtle pink accent gradient corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none group-hover:bg-rose-500/10 transition-colors" />

                  <div>
                    {/* Top Row: Category Pill & Action Icons */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5 text-rose-400" />
                        {product.category}
                      </span>

                      {/* Quick Action Icons: Details, Edit, Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setDetailProduct(product)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-500/30 transition-colors"
                          title="Visualizar detalhes do produto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 border border-zinc-800 hover:border-amber-500/30 transition-colors"
                          title="Editar produto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteProduct(product)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/30 transition-colors"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors font-display leading-snug mb-2">
                      {product.name}
                    </h3>

                    {/* Material / Acabamento */}
                    <div className="mt-2.5 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-start gap-2">
                      <Palette className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                          Material / Acabamento:
                        </span>
                        <p className="text-xs text-zinc-200 font-medium truncate">
                          {product.material}
                        </p>
                      </div>
                    </div>

                    {/* Interested Clients Indicator */}
                    <div className="mt-3 flex items-center justify-between text-xs pt-2">
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Clientes interessados:</span>
                      </span>
                      {interestedCount > 0 ? (
                        <span className="text-[11px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          {interestedCount} {interestedCount === 1 ? 'cliente' : 'clientes'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-400 italic">Nenhum ainda</span>
                      )}
                    </div>
                  </div>

                  {/* Primary Action: Adicionar ao interesse do cliente */}
                  <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAssignProduct(product)}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600/90 to-pink-600/90 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40 border border-rose-400/30 flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Adicionar ao interesse do cliente</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* MODAL 1: Adicionar ao Interesse do Cliente */}
      <AnimatePresence>
        {assignProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative w-full max-w-lg bg-[#121217] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-zinc-800 bg-[#16141e] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      Vincular Interesse do Cliente
                    </h3>
                    <p className="text-xs text-zinc-400 truncate max-w-xs sm:max-w-sm">
                      {assignProduct.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAssignProduct(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Search client and list */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">
                    Selecione o cliente para adicionar este produto ao perfil:
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Buscar cliente por nome ou telefone..."
                      value={assignClientSearch}
                      onChange={(e) => setAssignClientSearch(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Clients list */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {clients
                    .filter(
                      (c) =>
                        c.name.toLowerCase().includes(assignClientSearch.toLowerCase()) ||
                        c.whatsapp.includes(assignClientSearch)
                    )
                    .map((client) => {
                      const alreadyHas = client.productsOfInterest?.includes(assignProduct.name);

                      return (
                        <div
                          key={client.id}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                            alreadyHas
                              ? 'bg-rose-500/10 border-rose-500/30'
                              : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-white text-xs">{client.name}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">
                              {client.whatsapp} {client.city ? `• ${client.city}` : ''}
                            </p>
                          </div>

                          {alreadyHas ? (
                            <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-1 bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/30">
                              <Check className="w-3 h-3 text-rose-400" />
                              Já vinculado
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onAssignProductToClient(client.id, assignProduct.name);
                                showToast(`"${assignProduct.name}" adicionado para ${client.name}!`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-sm flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Adicionar</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-800 bg-[#0e0e13] flex justify-end">
                <button
                  type="button"
                  onClick={() => setAssignProduct(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold"
                >
                  Concluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Visualizar Detalhes do Produto */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          clients={clients}
          onClose={() => setDetailProduct(null)}
          onSelectClient={(c) => {
            setDetailProduct(null);
            onSelectClient?.(c);
          }}
          onAssignProductToClient={onAssignProductToClient}
          onEditProduct={(p) => {
            setDetailProduct(null);
            handleOpenEdit(p);
          }}
        />
      )}

      {/* MODAL 3: Cadastrar ou Editar Produto */}
      <AnimatePresence>
        {(isCreating || editProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative w-full max-w-lg bg-[#121217] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-800 bg-[#16141e] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      {editProduct ? 'Editar Produto do Catálogo' : '+ Novo Produto no Catálogo'}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Preencha o nome, categoria e acabamento oficial SurgiLar
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditProduct(null);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveProductForm} className="p-6 space-y-4 overflow-y-auto text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Nome Completo do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Conjunto Cancún – Corda Náutica Champanhe"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Categoria *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Conjuntos">Conjuntos</option>
                      <option value="Kits">Kits</option>
                      <option value="Espreguiçadeiras">Espreguiçadeiras</option>
                      <option value="Cadeiras">Cadeiras</option>
                      <option value="Chaises">Chaises</option>
                      <option value="Balanços">Balanços</option>
                      <option value="Mesas">Mesas</option>
                      <option value="Banquetas">Banquetas</option>
                      <option value="Champanheiras">Champanheiras</option>
                      <option value="Puffs">Puffs</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Material / Acabamento
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Corda Náutica Champanhe"
                      value={formMaterial}
                      onChange={(e) => setFormMaterial(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Descrição & Observações
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descrição da estrutura, garantia, acabamento..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-400 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditProduct(null);
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30"
                  >
                    {editProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Confirmação de Exclusão */}
      <AnimatePresence>
        {deleteProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative w-full max-w-md bg-[#121217] border border-rose-500/40 rounded-2xl shadow-2xl p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2 font-display">
                Excluir produto do catálogo?
              </h3>

              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Tem certeza que deseja remover o produto{' '}
                <strong className="text-zinc-200 font-semibold">{deleteProduct.name}</strong> do
                catálogo da SurgiLar?
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteProduct(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDeleteProduct(deleteProduct.id);
                    showToast(`Produto "${deleteProduct.name}" excluído.`);
                    setDeleteProduct(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Produto</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
