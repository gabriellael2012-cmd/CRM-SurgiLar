import { Client, AppNotification, ReminderRecord, SystemSettings } from '../types/crm';

// Luxury acoustic gentle chime using Web Audio API
export const playNotificationChime = (): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic bell chime
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1046.5, now); // C6
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.18); // A6

    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.85);
    osc2.stop(now + 0.85);
  } catch (e) {
    // Graceful fallback if audio context is blocked
    console.debug('Audio chime could not be played', e);
  }
};

// Android Haptic Vibration
export const triggerHapticVibration = (pattern: number[] = [100, 50, 100]): void => {
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // Ignore in unsupported environments
  }
};

// Request Native Android / Web Notification Permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
};

// Send Native Android / Web Notification
export const sendNativeNotification = (title: string, options?: NotificationOptions): void => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          ...options
        } as NotificationOptions);
      });
    } else {
      new Notification(title, {
        icon: '/icon-192.png',
        ...options
      });
    }
  } catch (e) {
    console.debug('Could not send native notification', e);
  }
};

// Parse flexible birth date formats (YYYY-MM-DD or DD/MM/YYYY)
export const calculateDaysUntilBirthday = (birthDateStr?: string): number | null => {
  if (!birthDateStr) return null;

  let birthMonth: number;
  let birthDay: number;

  if (birthDateStr.includes('/')) {
    const parts = birthDateStr.split('/');
    if (parts.length < 2) return null;
    birthDay = parseInt(parts[0], 10);
    birthMonth = parseInt(parts[1], 10) - 1;
  } else if (birthDateStr.includes('-')) {
    const parts = birthDateStr.split('-');
    if (parts.length < 3) return null;
    birthMonth = parseInt(parts[1], 10) - 1;
    birthDay = parseInt(parts[2], 10);
  } else {
    return null;
  }

  if (isNaN(birthDay) || isNaN(birthMonth)) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisYearBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
  thisYearBirthday.setHours(0, 0, 0, 0);

  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

// Calculate Days without purchase or contact
export const calculateDaysInactive = (client: Client): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check last purchase date
  let lastDateStr = client.lastContactDate || client.createdAt;
  if (client.purchaseHistory && client.purchaseHistory.length > 0) {
    const sortedPurchases = [...client.purchaseHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    lastDateStr = sortedPurchases[0].date;
  }

  if (!lastDateStr) return 0;

  const lastDate = new Date(lastDateStr);
  if (isNaN(lastDate.getTime())) return 0;

  const diffTime = today.getTime() - lastDate.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
};

// Check Smart Automated Notifications
export const evaluateSmartNotifications = (
  clients: Client[],
  reminders: ReminderRecord[],
  settings: SystemSettings,
  existingNotifications: AppNotification[]
): AppNotification[] => {
  const prefs = settings.notificationPreferences || {
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
  };

  if (!prefs.enabled && !settings.notificationsEnabled) {
    return [];
  }

  const newGenerated: AppNotification[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Birthday Notifications (Approaching every 3 days: 12, 9, 6, 3 days, and Today: 0 days)
  if (prefs.birthdays) {
    clients.forEach((client) => {
      const daysUntil = calculateDaysUntilBirthday(client.birthDate);
      if (daysUntil === null) return;

      // Target intervals: 12, 9, 6, 3 days or 0 (today)
      if (daysUntil === 0) {
        const notifId = `bday-today-${client.id}-${todayStr}`;
        const alreadyExists = existingNotifications.some((n) => n.id === notifId);

        if (!alreadyExists) {
          newGenerated.push({
            id: notifId,
            title: `🎉 Hoje é aniversário de ${client.name}!`,
            message: `Hoje é o aniversário de ${client.name}! Que tal enviar uma mensagem de felicitações personalizada pelo WhatsApp da SurgiLar?`,
            time: 'Hoje',
            type: 'birthday',
            read: false,
            clientId: client.id,
            clientName: client.name,
            badge: 'Aniversário Hoje'
          });
        }
      } else if ([12, 9, 6, 3].includes(daysUntil)) {
        const notifId = `bday-approach-${client.id}-${daysUntil}d-${todayStr}`;
        const alreadyExists = existingNotifications.some(
          (n) => n.id === notifId || (n.clientId === client.id && n.type === 'birthday' && n.title.includes(`${daysUntil} dias`))
        );

        if (!alreadyExists) {
          newGenerated.push({
            id: notifId,
            title: `🎂 O aniversário de ${client.name} está se aproximando!`,
            message: `O aniversário de ${client.name} está chegando! Faltam apenas ${daysUntil} dias. Uma excelente oportunidade para remarketing e estreitar laços.`,
            time: `Faltam ${daysUntil} dias`,
            type: 'birthday',
            read: false,
            clientId: client.id,
            clientName: client.name,
            badge: `Em ${daysUntil} dias`
          });
        }
      }
    });
  }

  // 2. Inactivity Remarketing Notifications (Clients with no purchases/contact for X days)
  if (prefs.inactivity) {
    const thresholdDays = prefs.inactivityDays || 90;

    clients.forEach((client) => {
      // Only notify if client has purchase history or is an existing customer
      const daysInactive = calculateDaysInactive(client);
      if (daysInactive >= thresholdDays) {
        const notifId = `inact-${client.id}-${Math.floor(daysInactive / 30)}m`;
        const alreadyExists = existingNotifications.some((n) => n.id === notifId);

        if (!alreadyExists) {
          newGenerated.push({
            id: notifId,
            title: `⏱️ ${client.name} está há ${daysInactive} dias sem comprar`,
            message: `${client.name} realizou sua última interação há ${daysInactive} dias. Talvez seja um momento oportuno para apresentar lançamentos do catálogo SurgiLar.`,
            time: `${daysInactive} dias atrás`,
            type: 'inactivity',
            read: false,
            clientId: client.id,
            clientName: client.name,
            badge: 'Remarketing'
          });
        }
      }
    });
  }

  // 3. Delayed Events (Agenda atrasada)
  if (prefs.delayedEvents) {
    reminders.forEach((rem) => {
      if (!rem.completed && rem.date < todayStr) {
        const notifId = `delay-event-${rem.id}`;
        const alreadyExists = existingNotifications.some((n) => n.id === notifId);

        if (!alreadyExists) {
          newGenerated.push({
            id: notifId,
            title: `⚠️ Compromisso Atrasado: ${rem.clientName}`,
            message: `O compromisso "${rem.observation || rem.title || 'Follow-up'}" agendado para ${rem.date} ${rem.time} ainda não foi finalizado.`,
            time: 'Atrasado',
            type: 'reminder',
            read: false,
            clientId: rem.clientId,
            clientName: rem.clientName,
            badge: 'Atrasado'
          });
        }
      }
    });
  }

  return newGenerated;
};
