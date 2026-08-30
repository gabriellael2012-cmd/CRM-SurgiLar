export type ClientStatus =
  | 'novo'
  | 'negociacao'
  | 'orcamento_enviado'
  | 'aguardando_resposta'
  | 'followup_necessario'
  | 'venda_realizada'
  | 'cliente_perdido';

export type BudgetStatus =
  | 'rascunho'
  | 'enviado'
  | 'aguardando_resposta'
  | 'aprovado'
  | 'recusado'
  | 'venda_realizada';

export type ContactType = 'whatsapp' | 'ligacao' | 'reuniao' | 'email' | 'visita';

export type ReminderCategory = 'hoje' | 'amanha' | 'proximos' | 'atrasados';

export type ReminderReason =
  | 'entrar_em_contato'
  | 'fazer_followup'
  | 'enviar_orcamento'
  | 'perguntar_orcamento'
  | 'pos_venda'
  | 'retomar_negociacao';

export interface ContactRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: ContactType;
  observation: string;
  registeredBy?: string;
}

export type ContactHistoryRecord = ContactRecord;


export interface BudgetRecord {
  id: string;
  product: string;
  value: number;
  date: string; // YYYY-MM-DD
  status: BudgetStatus;
  notes: string;
}

export interface PurchaseRecord {
  id: string;
  product: string;
  value: number;
  date: string; // YYYY-MM-DD
  paymentMethod: string;
  notes: string;
}

export interface ReminderRecord {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  reason: ReminderReason;
  customReason?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  observation: string;
  completed: boolean;
  productOfInterest?: string;
  alertMoments?: string[]; // ['immediate', '5min', '10min', '15min', '30min', '1h', '2h', '1day']
  title?: string;
}

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  birthDate?: string; // YYYY-MM-DD or DD/MM/YYYY
  createdAt: string; // YYYY-MM-DD
  status: ClientStatus;
  notes: string;
  productsOfInterest: string[];
  budgets: BudgetRecord[];
  contactHistory: ContactRecord[];
  purchaseHistory: PurchaseRecord[];
  reminders: ReminderRecord[];
  lastContactDate?: string;
  city?: string;
  email?: string;
  totalSpent?: number;
}

export type PaymentStatus = 'pago' | 'pendente' | 'parcial' | 'cancelado';

export type PaymentMethodType = 'Pix' | 'Dinheiro' | 'Cartão' | 'Parcelado' | 'Outro';

export interface SaleRecord {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  product: string;
  originalPrice?: number; // Valor de catálogo
  value: number; // Valor final / Valor total da venda
  paidValue?: number; // Valor já pago
  pendingValue?: number; // Valor pendente (calculado automaticamente)
  paymentStatus: PaymentStatus; // Status do pagamento
  paymentMethod: string; // Ex: "Pix", "Cartão de Crédito", "Parcelado 6x"
  paymentMethodType?: PaymentMethodType;
  installments?: number; // Qtd de parcelas se for parcelado
  installmentValue?: number; // Valor de cada parcela calculado
  downPayment?: number; // Valor da entrada se houver
  invoiceNumber?: string; // Número de nota fiscal ou faturamento (ex: NF-004829)
  isInvoiced?: boolean; // Faturamento emitido
  date: string; // YYYY-MM-DD
  notes: string;
  status?: 'finalizada' | 'em_andamento' | 'cancelada';
  discount?: number; // Desconto em R$
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'birthday' | 'inactivity' | 'followup' | 'budget' | 'sale' | 'system' | 'reminder';
  read: boolean;
  clientId?: string;
  clientName?: string;
  actionUrl?: string;
  badge?: string;
}

export type ProductCategory =
  | 'Conjuntos'
  | 'Kits'
  | 'Espreguiçadeiras'
  | 'Cadeiras'
  | 'Chaises'
  | 'Balanços'
  | 'Mesas'
  | 'Banquetas'
  | 'Champanheiras'
  | 'Puffs'
  | 'Outros';

export interface CatalogProduct {
  id: string;
  name: string;
  category: ProductCategory;
  material: string;
  suggestedPrice?: number;
  description?: string;
  featured?: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  newClient: boolean;
  birthdays: boolean;
  inactivity: boolean;
  inactivityDays: number; // default: 90
  followups: boolean;
  budgets: boolean;
  schedule: boolean;
  sales: boolean;
  reminders: boolean;
  delayedEvents: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface SystemSettings {
  accountNumber: string;
  companyName: string;
  managerName: string;
  managerRole: string;
  defaultWhatsAppCountryCode: string;
  defaultWhatsAppTemplate: string;
  availableProducts: string[];
  notificationsEnabled: boolean;
  notificationPreferences?: NotificationPreferences;
  whatsappDefaultMessage?: string;
}

export type AccountSettings = SystemSettings;

export type NavigationTab =
  | 'dashboard'
  | 'clients'
  | 'birthdays'
  | 'scripts'
  | 'sales'
  | 'reminders'
  | 'catalog'
  | 'budgets'
  | 'schedule'
  | 'reports'
  | 'settings'
  | 'tutorial';

export interface WhatsAppScript {
  id: string;
  title: string;
  category: 'aniversario' | 'saudacao' | 'orcamento' | 'followup' | 'pos_venda' | 'reativacao' | 'oferta' | 'showroom';
  tag: string;
  description: string;
  template: string;
  badgeColor?: string;
}


