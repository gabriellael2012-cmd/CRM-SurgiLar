import { WhatsAppScript } from '../types/crm';

export const WHATSAPP_SCRIPTS: WhatsAppScript[] = [
  {
    id: 'script-aniversario',
    title: '🎂 Script: Aniversário do Cliente',
    category: 'aniversario',
    tag: 'Aniversário 🎉',
    description: 'Mensagem carinhosa de parabéns personalizada com o nome do cliente.',
    template: 'Olá, [NOME]! 🎉 Passando para desejar um feliz aniversário! Que seu novo ciclo seja repleto de coisas boas, saúde e muitos momentos especiais. Um grande abraço da Kely e da SurgiLar! 💗',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  },
  {
    id: 'script-saudacao',
    title: '👋 Script: Boas-vindas / Saudação Inicial',
    category: 'saudacao',
    tag: 'Primeiro Contato 👋',
    description: 'Primeira mensagem acolhedora para novos clientes ou leads.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely Alves da SurgiLar. Como posso te ajudar hoje com a escolha dos seus produtos? 😊',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'script-orcamento',
    title: '💰 Script: Envio de Orçamento Oficial',
    category: 'orcamento',
    tag: 'Orçamento 💰',
    description: 'Acompanhamento do envio do orçamento com disponibilidade para tirar dúvidas.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely Alves da SurgiLar. Conforme conversamos, segue o orçamento para o [PRODUTO]. Fico à disposição para tirar qualquer dúvida e personalizar os detalhes! 🛋️✨',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 'script-followup',
    title: '⏳ Script: Follow-up de Proposta em Análise',
    category: 'followup',
    tag: 'Follow-up ⏳',
    description: 'Perguntar sobre a análise da proposta e apresentar condições facilitadas.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely Alves da SurgiLar. Gostaria de saber se você conseguiu analisar a proposta para o [PRODUTO] que conversamos? Temos condições especiais de pagamento para você fechar hoje! ✨',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  {
    id: 'script-pos-venda',
    title: '🌟 Script: Pós-Venda & Agradecimento',
    category: 'pos_venda',
    tag: 'Pós-Venda 🌟',
    description: 'Agradecimento pela compra, conferência da entrega e fidelização.',
    template: 'Olá, [NOME]! Kely Alves da SurgiLar passando para agradecer pela confiança e parabenizar pela excelente escolha do [PRODUTO]! Como está sendo sua experiência? Conte sempre conosco! 🌟',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
  },
  {
    id: 'script-reativacao',
    title: '⏱️ Script: Reativação (Cliente há tempo sem comprar)',
    category: 'reativacao',
    tag: 'Reativação ⏱️',
    description: 'Retomar contato com clientes inativos apresentando novidades do catálogo.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely Alves da SurgiLar. Faz um tempinho que não nos falamos e lembrei de você! Estamos com novidades exclusivas e lançamentos no nosso catálogo para deixar seu espaço ainda mais lindo. Vamos bater um papo? 🛋️✨',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  },
  {
    id: 'script-showroom',
    title: '🛋️ Script: Convite para o Showroom SurgiLar',
    category: 'showroom',
    tag: 'Showroom 🛋️',
    description: 'Convidar o cliente para uma experiência presencial com atendimento VIP.',
    template: 'Olá, [NOME]! Tudo bem? Aqui é a Kely Alves da SurgiLar. Gostaria de te convidar para tomar um café conosco no nosso showroom e conhecer de perto o conforto e o acabamento dos nossos móveis! Qual o melhor dia para você? ☕✨',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'script-oferta',
    title: '💎 Script: Condição Especial de Fechamento',
    category: 'oferta',
    tag: 'Condição Especial 💎',
    description: 'Oferta de oportunidade exclusiva e por tempo limitado para fechar pedidos.',
    template: 'Olá, [NOME]! Aqui é a Kely da SurgiLar. Consegui uma condição especial com a diretoria válida para fechamento esta semana: parcelamento facilitado ou desconto exclusivo à vista! Posso reservar essa condição para você? 💎',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  }
];

export function fillScriptTemplate(
  template: string,
  clientName: string,
  productName?: string
): string {
  const firstName = clientName.trim().split(' ')[0] || 'Cliente';
  let text = template;
  
  // Replace both [NOME] and {cliente}
  text = text.replace(/\[NOME\]/gi, firstName);
  text = text.replace(/\{cliente\}/gi, firstName);
  text = text.replace(/\{nome\}/gi, firstName);
  
  // Replace [PRODUTO] and {produto}
  const prod = productName || 'produto';
  text = text.replace(/\[PRODUTO\]/gi, prod);
  text = text.replace(/\{produto\}/gi, prod);
  
  return text;
}
