import { Client, SaleRecord, ClientStatus, BudgetStatus, ContactType, ReminderReason } from '../types/crm';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value || 0);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateStr: string, timeStr?: string): string {
  const formattedDate = formatDate(dateStr);
  if (!timeStr) return formattedDate;
  return `${formattedDate} — ${timeStr}`;
}

export function formatBirthDate(birthDateStr?: string): string {
  if (!birthDateStr) return 'Não informada';
  try {
    if (birthDateStr.includes('/')) return birthDateStr;
    const parts = birthDateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    if (parts.length === 2) {
      return `${parts[1]}/${parts[0]}`;
    }
    return birthDateStr;
  } catch {
    return birthDateStr;
  }
}

/**
 * Calculates days since last purchase for a client.
 * Returns exact text according to Kely Alves requirements:
 * "⏱️ X dias sem comprar" or "Ainda não possui compras registradas."
 */
export function getDaysSinceLastPurchase(
  client: Client,
  sales?: SaleRecord[]
): {
  days: number | null;
  text: string;
  hasPurchased: boolean;
  lastPurchaseDate?: string;
  lastProduct?: string;
  lastValue?: number;
} {
  // Collect all purchases from client's purchaseHistory and sales list
  const purchases = [...(client.purchaseHistory || [])];
  
  if (sales && sales.length > 0) {
    const clientSales = sales.filter((s) => s.clientId === client.id && s.paymentStatus !== 'cancelado');
    clientSales.forEach((s) => {
      if (!purchases.some((p) => p.id === s.id || (p.date === s.date && p.product === s.product))) {
        purchases.push({
          id: s.id,
          product: s.product,
          value: s.value,
          date: s.date,
          paymentMethod: s.paymentMethod,
          notes: s.notes
        });
      }
    });
  }

  if (purchases.length === 0) {
    return {
      days: null,
      text: 'Ainda não possui compras registradas.',
      hasPurchased: false
    };
  }

  // Sort descending by purchase date
  purchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestPurchase = purchases[0];

  const purchaseDate = new Date(latestPurchase.date + 'T00:00:00');
  const now = new Date();
  // Clear time component for pure day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = today.getTime() - purchaseDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  let text = '';
  if (diffDays === 0) {
    text = '⏱️ Comprou hoje';
  } else if (diffDays === 1) {
    text = '⏱️ 1 dia sem comprar';
  } else {
    text = `⏱️ ${diffDays} dias sem comprar`;
  }

  return {
    days: diffDays,
    text,
    hasPurchased: true,
    lastPurchaseDate: latestPurchase.date,
    lastProduct: latestPurchase.product,
    lastValue: latestPurchase.value
  };
}

/**
 * Calculates birthday proximity and info for a client based on their birthDate.
 * Handles "Hoje", "Amanhã", "Próximos 7 dias" and relative days.
 */
export function getBirthdayInfo(birthDateStr?: string): {
  isToday: boolean;
  isTomorrow: boolean;
  isWithin7Days: boolean;
  daysUntil: number | null;
  ageTurning?: number;
  formattedBirthDate: string;
  nextBirthdayDate?: Date;
  statusBadgeText: string;
} {
  if (!birthDateStr) {
    return {
      isToday: false,
      isTomorrow: false,
      isWithin7Days: false,
      daysUntil: null,
      formattedBirthDate: 'Não informada',
      statusBadgeText: ''
    };
  }

  try {
    let day = 0;
    let month = 0; // 0-indexed
    let birthYear = 0;

    if (birthDateStr.includes('-')) {
      const parts = birthDateStr.split('-').map(Number);
      if (parts.length === 3) {
        birthYear = parts[0];
        month = parts[1] - 1;
        day = parts[2];
      }
    } else if (birthDateStr.includes('/')) {
      const parts = birthDateStr.split('/').map(Number);
      if (parts.length >= 2) {
        day = parts[0];
        month = parts[1] - 1;
        if (parts.length === 3) birthYear = parts[2];
      }
    }

    if (!day || month === undefined || month < 0 || month > 11) {
      return {
        isToday: false,
        isTomorrow: false,
        isWithin7Days: false,
        daysUntil: null,
        formattedBirthDate: birthDateStr,
        statusBadgeText: ''
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const today = new Date(currentYear, now.getMonth(), now.getDate());

    // Next birthday date in current year
    let nextBirthday = new Date(currentYear, month, day);
    if (nextBirthday.getTime() < today.getTime()) {
      // If birthday already passed this year, next is next year
      nextBirthday = new Date(currentYear + 1, month, day);
    }

    const diffTime = nextBirthday.getTime() - today.getTime();
    const daysUntil = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const isToday = daysUntil === 0;
    const isTomorrow = daysUntil === 1;
    const isWithin7Days = daysUntil >= 0 && daysUntil <= 7;

    const ageTurning = birthYear > 0 ? nextBirthday.getFullYear() - birthYear : undefined;

    const dayPad = String(day).padStart(2, '0');
    const monthPad = String(month + 1).padStart(2, '0');
    const formattedBirthDate = birthYear > 0 ? `${dayPad}/${monthPad}/${birthYear}` : `${dayPad}/${monthPad}`;

    let statusBadgeText = '';
    if (isToday) {
      statusBadgeText = '🎉 Aniversário Hoje!';
    } else if (isTomorrow) {
      statusBadgeText = '🎂 Aniversário Amanhã';
    } else if (daysUntil <= 7) {
      statusBadgeText = `🎂 Faz aniversário em ${daysUntil} dias`;
    } else if (daysUntil <= 30) {
      statusBadgeText = `Em ${daysUntil} dias`;
    }

    return {
      isToday,
      isTomorrow,
      isWithin7Days,
      daysUntil,
      ageTurning,
      formattedBirthDate,
      nextBirthdayDate: nextBirthday,
      statusBadgeText
    };
  } catch {
    return {
      isToday: false,
      isTomorrow: false,
      isWithin7Days: false,
      daysUntil: null,
      formattedBirthDate: birthDateStr,
      statusBadgeText: ''
    };
  }
}

export const STATUS_CONFIG: Record<
  ClientStatus,
  { label: string; emoji: string; bg: string; text: string; border: string; badgeClass: string }
> = {
  novo: {
    label: 'Novo cliente',
    emoji: '🆕',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  },
  negociacao: {
    label: 'Em negociação',
    emoji: '💬',
    bg: 'bg-cyan-950/40',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
  },
  orcamento_enviado: {
    label: 'Orçamento enviado',
    emoji: '💰',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  },
  aguardando_resposta: {
    label: 'Aguardando resposta',
    emoji: '⏳',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    badgeClass: 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
  },
  followup_necessario: {
    label: 'Follow-up necessário',
    emoji: '🔔',
    bg: 'bg-rose-950/50',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
    badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
  },
  venda_realizada: {
    label: 'Venda realizada',
    emoji: '📦',
    bg: 'bg-pink-950/50',
    text: 'text-pink-300',
    border: 'border-pink-500/40',
    badgeClass: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
  },
  cliente_perdido: {
    label: 'Cliente perdido',
    emoji: '❌',
    bg: 'bg-zinc-900/60',
    text: 'text-zinc-400',
    border: 'border-zinc-700/40',
    badgeClass: 'bg-zinc-800 text-zinc-400 border border-zinc-700'
  }
};

export const BUDGET_STATUS_CONFIG: Record<
  BudgetStatus,
  { label: string; badgeClass: string }
> = {
  rascunho: {
    label: 'Rascunho',
    badgeClass: 'bg-zinc-800 text-zinc-300 border border-zinc-700'
  },
  enviado: {
    label: 'Enviado',
    badgeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
  },
  aguardando_resposta: {
    label: 'Aguardando resposta',
    badgeClass: 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
  },
  aprovado: {
    label: 'Aprovado',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
  },
  recusado: {
    label: 'Recusado',
    badgeClass: 'bg-red-500/10 text-red-400 border border-red-500/30'
  },
  venda_realizada: {
    label: 'Venda realizada',
    badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
  }
};

export const CONTACT_TYPE_CONFIG: Record<
  ContactType,
  { label: string; iconName: string; color: string }
> = {
  whatsapp: { label: 'WhatsApp', iconName: 'MessageSquare', color: 'text-emerald-400' },
  ligacao: { label: 'Ligação Telefônica', iconName: 'Phone', color: 'text-cyan-400' },
  reuniao: { label: 'Reunião / Apresentação', iconName: 'Users', color: 'text-purple-400' },
  email: { label: 'E-mail Comercial', iconName: 'Mail', color: 'text-amber-400' },
  visita: { label: 'Visita Showroom / Local', iconName: 'MapPin', color: 'text-rose-400' }
};

export const REMINDER_REASON_CONFIG: Record<
  ReminderReason,
  { label: string; iconName: string; color: string }
> = {
  entrar_em_contato: { label: 'Entrar em contato', iconName: 'PhoneCall', color: 'text-sky-400' },
  fazer_followup: { label: 'Fazer follow-up', iconName: 'RefreshCw', color: 'text-rose-400' },
  enviar_orcamento: { label: 'Enviar orçamento', iconName: 'FileText', color: 'text-amber-400' },
  perguntar_orcamento: { label: 'Perguntar sobre orçamento', iconName: 'HelpCircle', color: 'text-purple-400' },
  pos_venda: { label: 'Pós-venda e satisfação', iconName: 'HeartHandshake', color: 'text-pink-400' },
  retomar_negociacao: { label: 'Retomar negociação', iconName: 'Repeat', color: 'text-emerald-400' }
};
