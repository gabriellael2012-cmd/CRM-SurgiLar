import { Client, SaleRecord, AppNotification, SystemSettings, ReminderRecord, CatalogProduct } from '../types/crm';
import { INITIAL_CLIENTS, INITIAL_SALES, INITIAL_NOTIFICATIONS, INITIAL_SETTINGS } from '../data/mockData';
import { SURGILAR_CATALOG_PRODUCTS, RAW_CATALOG_NAMES } from '../data/catalogProducts';

const KEYS = {
  CLIENTS: 'crm_kely_alves_clients_v4_clean',
  SALES: 'crm_kely_alves_sales_v4_clean',
  REMINDERS: 'crm_kely_alves_reminders_v4_clean',
  NOTIFICATIONS: 'crm_kely_alves_notifications_v4_clean',
  SETTINGS: 'crm_kely_alves_settings_v4_clean',
  PRODUCTS: 'crm_kely_alves_products_v4_clean',
  CATALOG: 'crm_kely_alves_catalog_v4_clean',
  AUTH: 'crm_kely_alves_auth_v4_clean'
};

// Cleanup old legacy version mock keys from localStorage
export const cleanLegacyMockKeys = (): void => {
  try {
    const legacyKeys = [
      'crm_kely_alves_clients_v1',
      'crm_kely_alves_sales_v1',
      'crm_kely_alves_reminders_v1',
      'crm_kely_alves_notifications_v1',
      'crm_kely_alves_clients_v2',
      'crm_kely_alves_sales_v2',
      'crm_kely_alves_reminders_v2',
      'crm_kely_alves_notifications_v2',
      'crm_kely_alves_clients_v3',
      'crm_kely_alves_sales_v3',
      'crm_kely_alves_reminders_v3',
      'crm_kely_alves_notifications_v3'
    ];
    legacyKeys.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    // Ignore in SSR / restrictive environments
  }
};

cleanLegacyMockKeys();

export const loadCatalogProducts = (): CatalogProduct[] => {
  try {
    const data = localStorage.getItem(KEYS.CATALOG);
    if (!data) {
      localStorage.setItem(KEYS.CATALOG, JSON.stringify(SURGILAR_CATALOG_PRODUCTS));
      return SURGILAR_CATALOG_PRODUCTS;
    }
    const parsed = JSON.parse(data);
    // If empty or corrupted, ensure full 73 products catalog is loaded
    if (!Array.isArray(parsed) || parsed.length < 50) {
      localStorage.setItem(KEYS.CATALOG, JSON.stringify(SURGILAR_CATALOG_PRODUCTS));
      return SURGILAR_CATALOG_PRODUCTS;
    }
    return parsed;
  } catch {
    return SURGILAR_CATALOG_PRODUCTS;
  }
};

export const saveCatalogProducts = (products: CatalogProduct[]): void => {
  try {
    localStorage.setItem(KEYS.CATALOG, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving catalog products to localStorage', e);
  }
};

export const loadClients = (): Client[] => {
  try {
    const data = localStorage.getItem(KEYS.CLIENTS);
    if (!data) {
      localStorage.setItem(KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CLIENTS;
  }
};

export const saveClients = (clients: Client[]): void => {
  try {
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
  } catch (e) {
    console.error('Error saving clients to localStorage', e);
  }
};

export const loadSales = (): SaleRecord[] => {
  try {
    const data = localStorage.getItem(KEYS.SALES);
    if (!data) {
      localStorage.setItem(KEYS.SALES, JSON.stringify(INITIAL_SALES));
      return INITIAL_SALES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SALES;
  }
};

export const saveSales = (sales: SaleRecord[]): void => {
  try {
    localStorage.setItem(KEYS.SALES, JSON.stringify(sales));
  } catch (e) {
    console.error('Error saving sales to localStorage', e);
  }
};

export const loadReminders = (): ReminderRecord[] => {
  try {
    const data = localStorage.getItem(KEYS.REMINDERS);
    if (!data) {
      localStorage.setItem(KEYS.REMINDERS, JSON.stringify([]));
      return [];
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveReminders = (reminders: ReminderRecord[]): void => {
  try {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    console.error('Error saving reminders to localStorage', e);
  }
};

export const loadSettings = (): SystemSettings => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = (settings: SystemSettings): void => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
};

export const loadProducts = (): string[] => {
  try {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(RAW_CATALOG_NAMES));
      return RAW_CATALOG_NAMES;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length < 50) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(RAW_CATALOG_NAMES));
      return RAW_CATALOG_NAMES;
    }
    return parsed;
  } catch {
    return RAW_CATALOG_NAMES;
  }
};

export const saveProducts = (products: string[]): void => {
  try {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage', e);
  }
};

export const loadNotifications = (): AppNotification[] => {
  try {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!data) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveNotifications = (notifications: AppNotification[]): void => {
  try {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving notifications to localStorage', e);
  }
};

export const resetToInitialData = (): void => {
  try {
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify([]));
    localStorage.setItem(KEYS.SALES, JSON.stringify([]));
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify([]));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(RAW_CATALOG_NAMES));
    localStorage.setItem(KEYS.CATALOG, JSON.stringify(SURGILAR_CATALOG_PRODUCTS));
  } catch (e) {
    console.error('Error resetting database', e);
  }
};

export const storage = {
  getClients: loadClients,
  saveClients,
  getSales: loadSales,
  saveSales,
  getReminders: loadReminders,
  saveReminders,
  getSettings: loadSettings,
  saveSettings,
  getProducts: loadProducts,
  saveProducts,
  getCatalogProducts: loadCatalogProducts,
  saveCatalogProducts,
  getNotifications: loadNotifications,
  saveNotifications,
  resetToInitialData
};
