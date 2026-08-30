import { Client, SaleRecord, AppNotification, SystemSettings } from '../types/crm';

export const INITIAL_SETTINGS: SystemSettings = {
  accountNumber: '004829',
  companyName: 'SurgiLar',
  managerName: 'Kely Alves',
  managerRole: 'Gerente Comercial & Relacionamento',
  defaultWhatsAppCountryCode: '55',
  defaultWhatsAppTemplate: 'Olá {cliente}! Aqui é a Kely Alves da SurgiLar.',
  availableProducts: [
    'Conjunto Cataratas',
    'Conjunto Cancún',
    'Puff Comfy',
    'Balanço Rincón',
    'Poltrona Elegance',
    'Mesa Riviera 8 Lugares',
    'Chaise Saint-Tropez',
    'Sofá Modular Lumina',
    'Bistrô Ibiza com 4 Banquetes',
    'Espreguiçadeira Acqua Lux'
  ],
  notificationsEnabled: true,
  notificationPreferences: {
    enabled: true,
    newClient: true,
    birthdays: true,
    inactivity: true,
    inactivityDays: 90,
    followups: true,
    budgets: true,
    schedule: true,
    sales: true,
    reminders: true,
    delayedEvents: true,
    soundEnabled: true,
    vibrationEnabled: true
  }
};

export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_SALES: SaleRecord[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
