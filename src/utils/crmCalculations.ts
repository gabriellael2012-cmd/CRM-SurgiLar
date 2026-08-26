import { Client, SaleRecord } from '../types/crm';
import { formatDate } from './formatters';

export interface DaysWithoutPurchaseResult {
  days: number | null;
  label: string;
  sublabel: string;
  hasPurchased: boolean;
  lastPurchaseDate?: string;
  lastPurchaseProduct?: string;
  lastPurchaseValue?: number;
  isAlert: boolean; // True if > 60 days
}

export function calculateDaysWithoutPurchase(
  client: Client,
  allSales?: SaleRecord[]
): DaysWithoutPurchaseResult {
  const purchaseDates: { date: string; product?: string; value?: number }[] = [];

  // Check purchase history inside client
  if (client.purchaseHistory && client.purchaseHistory.length > 0) {
    client.purchaseHistory.forEach((p) => {
      if (p.date) {
        purchaseDates.push({ date: p.date, product: p.product, value: p.value });
      }
    });
  }

  // Also check sales associated with client ID
  if (allSales && allSales.length > 0) {
    allSales.forEach((s) => {
      if (s.clientId === client.id && s.date && s.status !== 'cancelada') {
        purchaseDates.push({ date: s.date, product: s.product, value: s.value });
      }
    });
  }

  if (purchaseDates.length === 0) {
    return {
      days: null,
      label: 'Ainda não possui compras registradas.',
      sublabel: 'Cliente em potencial / Novo contato',
      hasPurchased: false,
      isAlert: false
    };
  }

  // Sort descending by date
  purchaseDates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const mostRecent = purchaseDates[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse YYYY-MM-DD
  const [year, month, day] = mostRecent.date.split('-').map(Number);
  const purchaseDate = new Date(year, month - 1, day);
  purchaseDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - purchaseDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  return {
    days: diffDays,
    label: `⏱️ ${diffDays === 0 ? 'Comprou hoje!' : diffDays === 1 ? '1 dia sem comprar' : `${diffDays} dias sem comprar`}`,
    sublabel: `Última compra em ${formatDate(mostRecent.date)}${mostRecent.product ? ` (${mostRecent.product})` : ''}`,
    hasPurchased: true,
    lastPurchaseDate: mostRecent.date,
    lastPurchaseProduct: mostRecent.product,
    lastPurchaseValue: mostRecent.value,
    isAlert: diffDays >= 60
  };
}

export interface BirthdayInfoResult {
  birthDate: string; // YYYY-MM-DD
  formattedBirthDate: string; // DD/MM/AAAA or DD/MM
  day: number;
  month: number;
  year?: number;
  age?: number;
  isToday: boolean;
  isTomorrow: boolean;
  daysUntil: number; // 0 for today, 1 for tomorrow, etc.
  category: 'hoje' | 'amanha' | 'proximos_7_dias' | 'proximos';
  statusText: string;
}

export function calculateBirthdayInfo(birthDate?: string): BirthdayInfoResult | null {
  if (!birthDate || !birthDate.trim()) return null;

  try {
    const parts = birthDate.split('-');
    if (parts.length < 3) return null;

    const birthYear = parseInt(parts[0], 10);
    const birthMonth = parseInt(parts[1], 10); // 1-12
    const birthDay = parseInt(parts[2], 10);

    if (isNaN(birthMonth) || isNaN(birthDay)) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();

    // Birthday this year
    let nextBirthday = new Date(currentYear, birthMonth - 1, birthDay);
    nextBirthday.setHours(0, 0, 0, 0);

    // If birthday already passed this year (and is not today), next birthday is next year
    if (nextBirthday.getTime() < today.getTime()) {
      nextBirthday = new Date(currentYear + 1, birthMonth - 1, birthDay);
      nextBirthday.setHours(0, 0, 0, 0);
    }

    const diffTime = nextBirthday.getTime() - today.getTime();
    const daysUntil = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const isToday = daysUntil === 0;
    const isTomorrow = daysUntil === 1;

    let category: 'hoje' | 'amanha' | 'proximos_7_dias' | 'proximos' = 'proximos';
    let statusText = `Aniversário em ${daysUntil} dias`;

    if (isToday) {
      category = 'hoje';
      statusText = '🎂 Hoje é aniversário!';
    } else if (isTomorrow) {
      category = 'amanha';
      statusText = '🎂 Aniversário amanhã!';
    } else if (daysUntil <= 7) {
      category = 'proximos_7_dias';
      statusText = `🎂 Faz aniversário em ${daysUntil} dias`;
    }

    const age = !isNaN(birthYear) && birthYear > 1900 ? currentYear - birthYear : undefined;

    return {
      birthDate,
      formattedBirthDate: formatDate(birthDate),
      day: birthDay,
      month: birthMonth,
      year: !isNaN(birthYear) && birthYear > 1900 ? birthYear : undefined,
      age,
      isToday,
      isTomorrow,
      daysUntil,
      category,
      statusText
    };
  } catch {
    return null;
  }
}
