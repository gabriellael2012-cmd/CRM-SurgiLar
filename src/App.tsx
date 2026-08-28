import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ClientsView } from './components/clients/ClientsView';
import { ClientDetailModal } from './components/clients/ClientDetailModal';
import { ClientFormModal } from './components/clients/ClientFormModal';
import { CatalogView } from './components/catalog/CatalogView';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { BudgetsView } from './components/budgets/BudgetsView';
import { SalesView } from './components/sales/SalesView';
import { RemindersView } from './components/reminders/RemindersView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { TutorialView } from './components/tutorial/TutorialView';

import {
  Client,
  SaleRecord,
  ReminderRecord,
  AppNotification,
  AccountSettings,
  NavigationTab,
  ClientStatus,
  BudgetStatus,
  BudgetRecord,
  ContactHistoryRecord,
  PurchaseRecord,
  CatalogProduct
} from './types/crm';
import {
  loadClients,
  saveClients,
  loadSales,
  saveSales,
  loadReminders,
  saveReminders,
  loadSettings,
  saveSettings,
  loadProducts,
  saveProducts,
  loadCatalogProducts,
  saveCatalogProducts,
  loadNotifications,
  saveNotifications,
  resetToInitialData
} from './utils/storage';
import { formatCurrency } from './utils/formatters';

export const App: React.FC = () => {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data States with localStorage initializers
  const [clients, setClients] = useState<Client[]>(() => loadClients());
  const [sales, setSales] = useState<SaleRecord[]>(() => loadSales());
  const [reminders, setReminders] = useState<ReminderRecord[]>(() => loadReminders());
  const [settings, setSettings] = useState<AccountSettings>(() => loadSettings());
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>(() => loadCatalogProducts());
  const [availableProducts, setAvailableProducts] = useState<string[]>(() => loadProducts());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications());

  // Modals state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<CatalogProduct | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  useEffect(() => {
    saveSales(sales);
  }, [sales]);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveCatalogProducts(catalogProducts);
    // Keep availableProducts string array synchronized with catalog names
    const names = catalogProducts.map((p) => p.name);
    setAvailableProducts(names);
    saveProducts(names);
  }, [catalogProducts]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Calculations for Today's reminders badge
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRemindersCount = useMemo(() => {
    return reminders.filter((r) => !r.completed && r.date === todayStr).length;
  }, [reminders, todayStr]);

  // Clients Handlers
  const handleAddClient = (clientData: Partial<Client>) => {
    const newClient = clientData as Client;
    setClients((prev) => [newClient, ...prev]);

    // Also register any initial reminders into the global reminders table
    if (newClient.reminders && newClient.reminders.length > 0) {
      setReminders((prev) => [...newClient.reminders!, ...prev]);
    }
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
    setSelectedClient(updatedClient);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    setReminders((prev) => prev.filter((r) => r.clientId !== clientId));
    if (selectedClient?.id === clientId) {
      setSelectedClient(null);
    }
  };

  const handleUpdateClientStatus = (clientId: string, status: ClientStatus) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, status } : c))
    );
    if (selectedClient?.id === clientId) {
      setSelectedClient((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Budget Handlers
  const handleAddBudget = (clientId: string, budget: BudgetRecord) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const currentBudgets = c.budgets || [];
          return {
            ...c,
            budgets: [budget, ...currentBudgets],
            status: c.status === 'novo' ? 'orcamento_enviado' : c.status
          };
        }
        return c;
      })
    );

    if (selectedClient?.id === clientId) {
      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              budgets: [budget, ...(prev.budgets || [])],
              status: prev.status === 'novo' ? 'orcamento_enviado' : prev.status
            }
          : null
      );
    }
  };

  const handleUpdateBudgetStatus = (
    clientId: string,
    budgetId: string,
    newStatus: BudgetStatus
  ) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId && c.budgets) {
          return {
            ...c,
            budgets: c.budgets.map((b) =>
              b.id === budgetId ? { ...b, status: newStatus } : b
            )
          };
        }
        return c;
      })
    );
  };

  // Contact Handlers
  const handleAddContact = (clientId: string, contact: ContactHistoryRecord) => {
    const today = new Date().toISOString().split('T')[0];
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          return {
            ...c,
            lastContactDate: today,
            contactHistory: [contact, ...(c.contactHistory || [])]
          };
        }
        return c;
      })
    );

    if (selectedClient?.id === clientId) {
      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              lastContactDate: today,
              contactHistory: [contact, ...(prev.contactHistory || [])]
            }
          : null
      );
    }
  };

  // Purchase Handlers
  const handleAddPurchase = (clientId: string, purchase: PurchaseRecord) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          return {
            ...c,
            status: 'venda_realizada',
            purchaseHistory: [purchase, ...(c.purchaseHistory || [])]
          };
        }
        return c;
      })
    );

    // Also add to global Sales
    const client = clients.find((c) => c.id === clientId);
    const newSale: SaleRecord = {
      id: purchase.id,
      clientId,
      clientName: client?.name || selectedClient?.name || 'Cliente SurgiLar',
      clientPhone: client?.whatsapp || selectedClient?.whatsapp || '',
      product: purchase.product,
      value: purchase.value,
      paidValue: purchase.value,
      pendingValue: 0,
      paymentStatus: 'pago',
      paymentMethod: purchase.paymentMethod || 'Pix à vista',
      date: purchase.date,
      notes: purchase.notes,
      status: 'finalizada'
    };
    setSales((prev) => [newSale, ...prev]);

    if (selectedClient?.id === clientId) {
      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              status: 'venda_realizada',
              purchaseHistory: [purchase, ...(prev.purchaseHistory || [])]
            }
          : null
      );
    }
  };

  // Reminder Handlers
  const handleAddReminder = (reminder: ReminderRecord) => {
    setReminders((prev) => [reminder, ...prev]);

    // Also add to client's internal list
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === reminder.clientId) {
          return {
            ...c,
            reminders: [reminder, ...(c.reminders || [])]
          };
        }
        return c;
      })
    );

    if (selectedClient?.id === reminder.clientId) {
      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              reminders: [reminder, ...(prev.reminders || [])]
            }
          : null
      );
    }
  };

  const handleToggleReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, completed: !r.completed } : r))
    );

    setClients((prev) =>
      prev.map((c) => {
        if (c.reminders) {
          return {
            ...c,
            reminders: c.reminders.map((r) =>
              r.id === reminderId ? { ...r, completed: !r.completed } : r
            )
          };
        }
        return c;
      })
    );
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));

    setClients((prev) =>
      prev.map((c) => {
        if (c.reminders) {
          return {
            ...c,
            reminders: c.reminders.filter((r) => r.id !== reminderId)
          };
        }
        return c;
      })
    );
  };

  // Sales Handlers with Complete Synchronization
  const handleAddSale = (sale: SaleRecord) => {
    setSales((prev) => [sale, ...prev]);

    // Synchronize Client: Status, Purchase History, Total Spent
    if (sale.clientId) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === sale.clientId) {
            const currentPurchases = c.purchaseHistory || [];
            const newPurchase: PurchaseRecord = {
              id: `pur-${sale.id}`,
              product: sale.product,
              value: sale.value,
              date: sale.date,
              paymentMethod: sale.paymentMethod,
              notes: sale.notes || 'Venda registrada via CRM SurgiLar'
            };

            // Update matching budget if exists
            const updatedBudgets = c.budgets?.map((b) =>
              b.product.toLowerCase().includes(sale.product.toLowerCase()) || sale.product.toLowerCase().includes(b.product.toLowerCase())
                ? { ...b, status: 'venda_realizada' as const }
                : b
            ) || [];

            // Update products of interest
            const currentInterest = c.productsOfInterest || [];
            const updatedInterest = currentInterest.includes(sale.product)
              ? currentInterest
              : [...currentInterest, sale.product];

            return {
              ...c,
              status: 'venda_realizada',
              totalSpent: (c.totalSpent || 0) + sale.value,
              purchaseHistory: [newPurchase, ...currentPurchases],
              budgets: updatedBudgets,
              productsOfInterest: updatedInterest,
              lastContactDate: sale.date
            };
          }
          return c;
        })
      );

      if (selectedClient?.id === sale.clientId) {
        setSelectedClient((prev) => {
          if (!prev) return null;
          const currentPurchases = prev.purchaseHistory || [];
          const newPurchase: PurchaseRecord = {
            id: `pur-${sale.id}`,
            product: sale.product,
            value: sale.value,
            date: sale.date,
            paymentMethod: sale.paymentMethod,
            notes: sale.notes || 'Venda registrada via CRM SurgiLar'
          };
          return {
            ...prev,
            status: 'venda_realizada',
            totalSpent: (prev.totalSpent || 0) + sale.value,
            purchaseHistory: [newPurchase, ...currentPurchases],
            lastContactDate: sale.date
          };
        });
      }
    }

    // Add Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: '🎉 Nova Venda Registrada!',
      message: `${sale.clientName} comprou ${sale.product} (${formatCurrency(sale.value)}). Status do cliente atualizado para Venda Realizada!`,
      time: 'Agora',
      type: 'sale',
      read: false,
      clientId: sale.clientId
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateSale = (updatedSale: SaleRecord) => {
    setSales((prev) =>
      prev.map((s) => (s.id === updatedSale.id ? updatedSale : s))
    );

    // Update Client's purchase history entry
    if (updatedSale.clientId) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === updatedSale.clientId && c.purchaseHistory) {
            const updatedPurchases = c.purchaseHistory.map((p) =>
              p.id === `pur-${updatedSale.id}` || p.product === updatedSale.product
                ? {
                    ...p,
                    product: updatedSale.product,
                    value: updatedSale.value,
                    date: updatedSale.date,
                    paymentMethod: updatedSale.paymentMethod,
                    notes: updatedSale.notes
                  }
                : p
            );
            return {
              ...c,
              purchaseHistory: updatedPurchases
            };
          }
          return c;
        })
      );
    }
  };

  const handleDeleteSale = (saleId: string) => {
    const saleToDelete = sales.find((s) => s.id === saleId);
    setSales((prev) => prev.filter((s) => s.id !== saleId));

    if (saleToDelete?.clientId) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === saleToDelete.clientId) {
            const updatedPurchases = (c.purchaseHistory || []).filter(
              (p) => p.id !== `pur-${saleId}`
            );
            const newTotalSpent = Math.max(0, (c.totalSpent || 0) - saleToDelete.value);
            return {
              ...c,
              totalSpent: newTotalSpent,
              purchaseHistory: updatedPurchases
            };
          }
          return c;
        })
      );

      if (selectedClient?.id === saleToDelete.clientId) {
        setSelectedClient((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            totalSpent: Math.max(0, (prev.totalSpent || 0) - saleToDelete.value),
            purchaseHistory: (prev.purchaseHistory || []).filter((p) => p.id !== `pur-${saleId}`)
          };
        });
      }
    }
  };

  const handleFinalizeSale = (sale: SaleRecord) => {
    handleUpdateSale(sale);
    if (sale.clientId) {
      handleUpdateClientStatus(sale.clientId, 'venda_realizada');
    }
  };

  // Catalog Handlers
  const handleAddCatalogProduct = (newProduct: Omit<CatalogProduct, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const productWithId: CatalogProduct = { ...newProduct, id };
    setCatalogProducts((prev) => [productWithId, ...prev]);
  };

  const handleUpdateCatalogProduct = (updatedProduct: CatalogProduct) => {
    setCatalogProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteCatalogProduct = (productId: string) => {
    setCatalogProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAssignCatalogProductToClient = (clientId: string, productName: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const currentInterest = c.productsOfInterest || [];
          if (!currentInterest.includes(productName)) {
            return {
              ...c,
              productsOfInterest: [...currentInterest, productName]
            };
          }
        }
        return c;
      })
    );

    if (selectedClient?.id === clientId) {
      setSelectedClient((prev) => {
        if (!prev) return null;
        const currentInterest = prev.productsOfInterest || [];
        if (!currentInterest.includes(productName)) {
          return {
            ...prev,
            productsOfInterest: [...currentInterest, productName]
          };
        }
        return prev;
      });
    }
  };

  // Products Handler (string compatibility)
  const handleAddProduct = (prod: string) => {
    if (!availableProducts.includes(prod)) {
      const newCatalogItem: CatalogProduct = {
        id: `prod-${Date.now()}`,
        name: prod,
        category: 'Conjuntos',
        material: 'Personalizado',
        description: 'Produto adicionado via configurações'
      };
      setCatalogProducts((prev) => [newCatalogItem, ...prev]);
    }
  };

  const handleRemoveProduct = (prod: string) => {
    setCatalogProducts((prev) => prev.filter((p) => p.name !== prod));
  };

  // Settings & Reset Handlers
  const handleUpdateSettings = (newSettings: Partial<AccountSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleResetData = () => {
    resetToInitialData();
    setClients(loadClients());
    setSales(loadSales());
    setReminders(loadReminders());
    setSettings(loadSettings());
    setCatalogProducts(loadCatalogProducts());
    setAvailableProducts(loadProducts());
    setSelectedClient(null);
  };

  const handleExportData = () => {
    const backup = {
      settings,
      clients,
      sales,
      reminders,
      catalog: catalogProducts,
      products: availableProducts,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crm_kely_alves_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-zinc-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-rose-950/20 rounded-full blur-[160px]" />
      </div>

      <div className="flex flex-1 z-10 relative overflow-hidden">
        {/* Main Luxury Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpenMobile={isMobileMenuOpen}
          setIsOpenMobile={setIsMobileMenuOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          accountNumber={settings.accountNumber}
          remindersCount={todayRemindersCount}
          unreadRemindersCount={todayRemindersCount}
          catalogCount={catalogProducts.length}
          onLogout={() => {
            if (window.confirm('Deseja reiniciar os dados de demonstração ou manter as alterações?')) {
              resetToInitialData();
              window.location.reload();
            }
          }}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Top Header */}
          <Header
            accountNumber={settings.accountNumber}
            onUpdateAccountNumber={(acc) => handleUpdateSettings({ accountNumber: acc })}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddClient={() => setShowClientForm(true)}
            onAddReminder={() => setActiveTab('reminders')}
            notifications={notifications}
            onMarkNotificationAsRead={(id) => {
              setNotifications((prev) =>
                (prev || []).map((n) => (n.id === id ? { ...n, read: true } : n))
              );
            }}
            onClearAllNotifications={() => setNotifications([])}
            onSelectClientFromNotification={(clientId) => {
              const client = clients.find((c) => c.id === clientId);
              if (client) setSelectedClient(client);
            }}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            clients={clients}
            catalogProducts={catalogProducts}
            onSelectClient={(c) => setSelectedClient(c)}
            onSelectProduct={(p) => setSelectedProductForDetail(p)}
          />

          {/* Main View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
            {activeTab === 'dashboard' && (
              <DashboardView
                clients={clients}
                sales={sales}
                reminders={reminders}
                onSelectClient={(c) => setSelectedClient(c)}
                onAddClient={() => setShowClientForm(true)}
                onNavigateToClients={() => setActiveTab('clients')}
                onNavigateToReminders={() => setActiveTab('reminders')}
                onNavigateToSales={() => setActiveTab('sales')}
              />
            )}

            {activeTab === 'catalog' && (
              <CatalogView
                catalogProducts={catalogProducts}
                clients={clients}
                onAddProduct={handleAddCatalogProduct}
                onUpdateProduct={handleUpdateCatalogProduct}
                onDeleteProduct={handleDeleteCatalogProduct}
                onAssignProductToClient={handleAssignCatalogProductToClient}
                onSelectClient={(c) => setSelectedClient(c)}
              />
            )}

            {activeTab === 'clients' && (
              <ClientsView
                clients={clients}
                onSelectClient={(c) => setSelectedClient(c)}
                onAddClient={() => setShowClientForm(true)}
                onDeleteClient={handleDeleteClient}
                onUpdateClientStatus={handleUpdateClientStatus}
                availableProducts={availableProducts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {activeTab === 'budgets' && (
              <BudgetsView
                clients={clients}
                onSelectClient={(c) => setSelectedClient(c)}
                onUpdateBudgetStatus={handleUpdateBudgetStatus}
              />
            )}

            {activeTab === 'sales' && (
              <SalesView
                sales={sales}
                clients={clients}
                availableProducts={availableProducts}
                catalogProducts={catalogProducts}
                onAddSale={handleAddSale}
                onUpdateSale={handleUpdateSale}
                onDeleteSale={handleDeleteSale}
                onFinalizeSale={handleFinalizeSale}
                onSelectClient={(c) => {
                  setSelectedClient(c);
                  setActiveTab('clients');
                }}
              />
            )}

            {activeTab === 'reminders' && (
              <RemindersView
                reminders={reminders}
                clients={clients}
                onToggleReminder={handleToggleReminder}
                onDeleteReminder={handleDeleteReminder}
                onAddReminder={handleAddReminder}
                onSelectClient={(c) => setSelectedClient(c)}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleView
                reminders={reminders}
                clients={clients}
                onAddReminder={() => setActiveTab('reminders')}
                onSelectClient={(c) => setSelectedClient(c)}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                clients={clients}
                sales={sales}
                onExportData={handleExportData}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                availableProducts={availableProducts}
                onAddProduct={handleAddProduct}
                onRemoveProduct={handleRemoveProduct}
                onResetData={handleResetData}
              />
            )}

            {activeTab === 'tutorial' && <TutorialView />}
          </main>
        </div>
      </div>

      {/* Client Detail Full Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdateClient={handleUpdateClient}
          onDeleteClient={handleDeleteClient}
          availableProducts={availableProducts}
          onAddBudget={handleAddBudget}
          onAddContact={handleAddContact}
          onAddPurchase={handleAddPurchase}
          onAddReminder={handleAddReminder}
          onToggleReminder={handleToggleReminder}
        />
      )}

      {/* New Client Form Modal */}
      {showClientForm && (
        <ClientFormModal
          onClose={() => setShowClientForm(false)}
          onSave={handleAddClient}
          availableProducts={availableProducts}
        />
      )}

      {/* Individual Product Detail Modal (from Search or Catalog) */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          clients={clients}
          onClose={() => setSelectedProductForDetail(null)}
          onSelectClient={(c) => {
            setSelectedProductForDetail(null);
            setSelectedClient(c);
          }}
          onAssignProductToClient={handleAssignCatalogProductToClient}
          onEditProduct={(p) => {
            setSelectedProductForDetail(null);
            setActiveTab('catalog');
          }}
        />
      )}
    </div>
  );
};

export default App;

