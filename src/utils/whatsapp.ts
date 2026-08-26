/**
 * WhatsApp helpers & scripts for CRM Kely Alves - SurgiLar
 */

export interface CRMWhatsAppScript {
  id: string;
  title: string;
  category: 'aniversario' | 'saudacao' | 'orcamento' | 'followup' | 'pos_venda' | 'reativacao' | 'novidades';
  categoryLabel: string;
  emoji: string;
  type: 'birthday' | 'greeting' | 'budget_sent' | 'budget_followup' | 'post_sale' | 'reactivation' | 'custom';
  description: string;
  template: string;
  badgeClass: string;
}

export const ALL_WHATSAPP_SCRIPTS: CRMWhatsAppScript[] = [
  {
    id: 'script-birthday',
    title: 'Mensagem de Aniversário',
    category: 'aniversario',
    categoryLabel: '🎂 Aniversário',
    emoji: '🎂',
    type: 'birthday',
    description: 'Mensagem carinhosa e elegante para parabenizar o cliente no aniversário.',
    template: 'Olá, [NOME]! 🎉 Passando para desejar um feliz aniversário! Que seu novo ciclo seja repleto de coisas boas, saúde e muitos momentos especiais. Um grande abraço da Kely e da SurgiLar! 💗',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
  },
  {
    id: 'script-greeting',
    title: 'Saudação Inicial & Apresentação',
    category: 'saudacao',
    categoryLabel: '👋 Primeiro Contato',
    emoji: '👋',
    type: 'greeting',
    description: 'Primeira abordagem elegante para novos contatos e clientes interessados.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely Alves da SurgiLar. Como posso te ajudar hoje com a escolha dos seus produtos para deixar seu ambiente ainda mais especial? 😊🛋️',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'script-budget-sent',
    title: 'Envio de Proposta / Orçamento',
    category: 'orcamento',
    categoryLabel: '💰 Orçamento',
    emoji: '💰',
    type: 'budget_sent',
    description: 'Acompanhamento do envio do orçamento com disponibilidade para tirar dúvidas.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely Alves da SurgiLar. Conforme combinamos, preparei o orçamento com todo carinho para você! Fico à disposição para tirar qualquer dúvida e personalizar os detalhes dos tecidos e acabamentos! 🛋️✨',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'script-budget-followup',
    title: 'Follow-up de Orçamento em Aberto',
    category: 'followup',
    categoryLabel: '⏳ Follow-up',
    emoji: '⏳',
    type: 'budget_followup',
    description: 'Retomada de contato para clientes que receberam orçamento mas não responderam.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely Alves da SurgiLar. Gostaria de saber se você conseguiu analisar a proposta que conversamos? Temos condições especiais de pagamento facilitado para fecharmos seu pedido hoje! ✨',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  {
    id: 'script-post-sale',
    title: 'Pós-Venda & Agradecimento',
    category: 'pos_venda',
    categoryLabel: '🌟 Pós-Venda',
    emoji: '🌟',
    type: 'post_sale',
    description: 'Agradecimento pela compra realizada e verificação da satisfação.',
    template: 'Olá, [NOME]! Kely Alves da SurgiLar passando para agradecer pela confiança e parabenizar pela excelente escolha dos seus móveis! Como está sendo sua experiência com o espaço? Conte sempre conosco para o que precisar! 🌟💗',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
  },
  {
    id: 'script-reactivation',
    title: 'Reativação de Cliente (Sem Comprar)',
    category: 'reativacao',
    categoryLabel: '⏱️ Reativação',
    emoji: '⏱️',
    type: 'reactivation',
    description: 'Mensagem carinhosa para reconectar com clientes que estão há bastante tempo sem comprar.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely da SurgiLar. Faz um tempinho que não nos falamos e lembrei de você! Chegaram lançamentos maravilhosos no nosso catálogo para renovar seu espaço. Adoraria te mostrar as novidades! 🛋️✨',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  },
  {
    id: 'script-novidades',
    title: 'Convite para Conhecer o Catálogo',
    category: 'novidades',
    categoryLabel: '🛋️ Lançamentos',
    emoji: '🛋️',
    type: 'custom',
    description: 'Apresentação de novidades em alumínio e corda náutica.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely da SurgiLar. Acabamos de lançar novas composições e tecidos náuticos exclusivos. Se você estiver pensando em renovar sua área externa ou varanda, posso te mandar as fotos? 🛋️🌟',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  }
];

export function cleanPhoneNumber(phone: string, defaultCountryCode: string = '55'): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  
  if (digits.length >= 12 && digits.startsWith(defaultCountryCode)) {
    return digits;
  }
  
  if (digits.length === 10 || digits.length === 11) {
    return `${defaultCountryCode}${digits}`;
  }
  
  return `${defaultCountryCode}${digits}`;
}

export function formatPhoneDisplay(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 13 && digits.startsWith('55')) {
    return `+55 (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  
  return phone;
}

export function getWhatsAppUrl(phone: string, text?: string, defaultCountryCode: string = '55'): string {
  const cleanNumber = cleanPhoneNumber(phone, defaultCountryCode);
  if (!cleanNumber) return '#';
  
  const encodedText = text ? encodeURIComponent(text) : '';
  return `https://wa.me/${cleanNumber}${encodedText ? `?text=${encodedText}` : ''}`;
}

export function prepareScriptMessage(template: string, clientName: string): string {
  const firstName = clientName.trim().split(' ')[0] || 'Cliente';
  return template
    .replace(/\[NOME\]/gi, firstName)
    .replace(/\{NOME\}/gi, firstName)
    .replace(/\{cliente\}/gi, firstName)
    .replace(/\{nome\}/gi, firstName);
}

export function generateWhatsAppMessage(
  clientName: string,
  type: 'greeting' | 'birthday' | 'budget_followup' | 'budget_sent' | 'post_sale' | 'reactivation' | 'custom',
  options?: { productName?: string; budgetValue?: number; customText?: string }
): string {
  const firstName = clientName.trim().split(' ')[0] || 'Cliente';
  
  switch (type) {
    case 'birthday':
      return `Olá, ${firstName}! 🎉 Passando para desejar um feliz aniversário! Que seu novo ciclo seja repleto de coisas boas, saúde e muitos momentos especiais. Um grande abraço da Kely e da SurgiLar! 💗`;

    case 'budget_sent':
      return `Olá, ${firstName}! Tudo bem? Aqui é a Kely Alves da SurgiLar. Conforme conversamos, segue o orçamento para o ${options?.productName || 'seu produto de interesse'}. Fico à disposição para tirar qualquer dúvida e personalizar os detalhes! 🛋️✨`;
      
    case 'budget_followup':
      return `Olá, ${firstName}! Tudo bem? Aqui é a Kely Alves da SurgiLar. Gostaria de saber se você conseguiu analisar a proposta para o ${options?.productName || 'produto'} que conversamos? Temos condições especiais de pagamento para você fechar hoje! ✨`;
      
    case 'post_sale':
      return `Olá, ${firstName}! Kely Alves da SurgiLar passando para agradecer pela confiança e parabenizar pela excelente escolha do ${options?.productName || 'produto'}! Como está sendo sua experiência? Conte sempre conosco! 🌟`;

    case 'reactivation':
      return `Olá, ${firstName}! Tudo bem? Aqui é a Kely Alves da SurgiLar. Faz um tempinho que não nos falamos e lembrei de você! Estamos com novidades exclusivas e lançamentos no nosso catálogo para deixar seu espaço ainda mais lindo. Vamos bater um papo? 🛋️✨`;

    case 'greeting':
    default:
      return `Olá, ${firstName}! Tudo bem? Aqui é a Kely Alves da SurgiLar. Como posso te ajudar hoje com a escolha dos seus produtos? 😊`;
  }
}

export function openWhatsAppDirect(phone: string, messageText?: string): void {
  const url = getWhatsAppUrl(phone, messageText);
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
