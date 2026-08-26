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
  notificationsEnabled: true
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'João Silva',
    whatsapp: '(41) 99876-5432',
    birthDate: '1988-08-27', // Aniversário amanhã!
    createdAt: '2026-08-10',
    status: 'aguardando_resposta',
    notes: 'Cliente muito interessado para a área de piscina e varanda gourmet. Casa em condomínio fechado em Curitiba.',
    productsOfInterest: ['Conjunto Cataratas', 'Conjunto Cancún', 'Puff Comfy', 'Balanço Rincón'],
    lastContactDate: '2026-08-26',
    city: 'Curitiba - PR',
    email: 'joao.silva@arquitetura.com.br',
    totalSpent: 0,
    budgets: [
      {
        id: 'orc-101',
        product: 'Conjunto Cataratas + Balanço Rincón',
        value: 14800,
        date: '2026-08-24',
        status: 'aguardando_resposta',
        notes: 'Incluso frete grátis e tecido náutico impermeável cinza chumbo.'
      },
      {
        id: 'orc-102',
        product: 'Puff Comfy (Par)',
        value: 3400,
        date: '2026-08-15',
        status: 'enviado',
        notes: 'Opção complementar solicitada na primeira visita.'
      }
    ],
    contactHistory: [
      {
        id: 'ct-1',
        date: '2026-08-26',
        time: '10:15',
        type: 'whatsapp',
        observation: 'Conversei com o João pelo WhatsApp e reenviei o catálogo de tecidos náuticos. Ele ficou de responder até o final da tarde.'
      },
      {
        id: 'ct-2',
        date: '2026-08-24',
        time: '14:30',
        type: 'whatsapp',
        observation: 'Enviei o orçamento oficial do Conjunto Cataratas e do Balanço Rincón via WhatsApp com condições em 10x sem juros.'
      },
      {
        id: 'ct-3',
        date: '2026-08-10',
        time: '11:00',
        type: 'ligacao',
        observation: 'Primeiro contato telefônico. Cliente conheceu a SurgiLar por indicação de arquiteto parceiro.'
      }
    ],
    purchaseHistory: [],
    reminders: [
      {
        id: 'rem-1',
        clientId: 'cli-1',
        clientName: 'João Silva',
        clientPhone: '(41) 99876-5432',
        reason: 'perguntar_orcamento',
        date: '2026-08-26',
        time: '15:30',
        observation: 'Cobrar resposta sobre o orçamento do Conjunto Cataratas antes do fechamento semanal.',
        completed: false,
        productOfInterest: 'Conjunto Cataratas'
      }
    ]
  },
  {
    id: 'cli-2',
    name: 'Maria Clara Vasconcelos',
    whatsapp: '(41) 99123-8877',
    birthDate: '1992-08-26', // Hoje é aniversário!
    createdAt: '2026-08-18',
    status: 'followup_necessario',
    notes: 'Reformando cobertura no Batel. Solicitou amostras de corda náutica terracota.',
    productsOfInterest: ['Conjunto Cancún', 'Chaise Saint-Tropez'],
    lastContactDate: '2026-08-25',
    city: 'Curitiba - PR',
    email: 'mariana.costa@decor.com.br',
    totalSpent: 0,
    budgets: [
      {
        id: 'orc-201',
        product: 'Conjunto Cancún Terracota',
        value: 18900,
        date: '2026-08-20',
        status: 'enviado',
        notes: 'Composto por 1 sofá de 3 lugares + 2 poltronas + 1 mesa de centro.'
      }
    ],
    contactHistory: [
      {
        id: 'ct-21',
        date: '2026-08-25',
        time: '16:40',
        type: 'whatsapp',
        observation: 'Mandei fotos do showroom com a Chaise Saint-Tropez na luz natural. Ela adorou o acabamento.'
      },
      {
        id: 'ct-22',
        date: '2026-08-18',
        time: '15:00',
        type: 'visita',
        observation: 'Visita presencial da Mariana com a decoradora no espaço SurgiLar.'
      }
    ],
    purchaseHistory: [],
    reminders: [
      {
        id: 'rem-2',
        clientId: 'cli-2',
        clientName: 'Maria Clara Vasconcelos',
        clientPhone: '(41) 99123-8877',
        reason: 'fazer_followup',
        date: '2026-08-26',
        time: '16:30',
        observation: 'Confirmar medidas finais da varanda com a arquiteta dela para fechar o pedido.',
        completed: false,
        productOfInterest: 'Conjunto Cancún'
      }
    ]
  },
  {
    id: 'cli-3',
    name: 'Dr. Roberto Albuquerque',
    whatsapp: '(41) 98455-1122',
    birthDate: '1976-08-29', // Em 3 dias!
    createdAt: '2026-08-01',
    status: 'venda_realizada',
    notes: 'Cliente VIP. Comprou para a casa de praia em Guaratuba. Entrega rápida solicitada.',
    productsOfInterest: ['Conjunto Cataratas', 'Balanço Rincón', 'Puff Comfy'],
    lastContactDate: '2026-08-20',
    city: 'Guaratuba / Curitiba',
    email: 'roberto.albuquerque@clinica.com.br',
    totalSpent: 24600,
    budgets: [
      {
        id: 'orc-301',
        product: 'Conjunto Cataratas Especial Alumínio Preto',
        value: 16800,
        date: '2026-08-05',
        status: 'venda_realizada',
        notes: 'Fechado à vista com desconto especial de 5%.'
      },
      {
        id: 'orc-302',
        product: 'Balanço Rincón com suporte + 2 Puffs Comfy',
        value: 7800,
        date: '2026-08-18',
        status: 'venda_realizada',
        notes: 'Adicional incluído no mesmo caminhão de entrega.'
      }
    ],
    contactHistory: [
      {
        id: 'ct-31',
        date: '2026-08-20',
        time: '14:00',
        type: 'whatsapp',
        observation: 'Confirmado o pagamento do valor restante e agendada a entrega na casa de praia para sexta-feira.'
      },
      {
        id: 'ct-32',
        date: '2026-08-05',
        time: '10:30',
        type: 'reuniao',
        observation: 'Apresentação formal da proposta no consultório. Cliente aprovou na hora.'
      }
    ],
    purchaseHistory: [
      {
        id: 'pur-1',
        product: 'Conjunto Cataratas Alumínio Preto',
        value: 16800,
        date: '2026-08-06',
        paymentMethod: 'Pix à vista',
        notes: 'Entregue com nota fiscal e garantia de 5 anos na estrutura.'
      },
      {
        id: 'pur-2',
        product: 'Balanço Rincón + 2 Puffs Comfy',
        value: 7800,
        date: '2026-08-20',
        paymentMethod: 'Cartão de Crédito 3x',
        notes: 'Acessórios na cor grafite com almofadas impermeáveis.'
      }
    ],
    reminders: [
      {
        id: 'rem-3',
        clientId: 'cli-3',
        clientName: 'Dr. Roberto Albuquerque',
        clientPhone: '(41) 98455-1122',
        reason: 'pos_venda',
        date: '2026-08-28',
        time: '11:00',
        observation: 'Fazer pós-venda para saber se a entrega em Guaratuba correu perfeitamente.',
        completed: false,
        productOfInterest: 'Conjunto Cataratas'
      }
    ]
  },
  {
    id: 'cli-4',
    name: 'Fernanda Lima Gusmão',
    whatsapp: '(41) 99654-3321',
    birthDate: '1990-09-01', // Em 6 dias (próximos 7 dias)
    createdAt: '2026-08-22',
    status: 'negociacao',
    notes: 'Procurando móveis de alto padrão para espaço gourmet externo e pergolado.',
    productsOfInterest: ['Mesa Riviera 8 Lugares', 'Poltrona Elegance', 'Puff Comfy'],
    lastContactDate: '2026-08-25',
    city: 'Curitiba - PR',
    email: 'fernanda.gusmao@gmail.com',
    totalSpent: 0,
    budgets: [
      {
        id: 'orc-401',
        product: 'Mesa Riviera 8 Lugares + 8 Cadeiras Elegance',
        value: 21500,
        date: '2026-08-23',
        status: 'enviado',
        notes: 'Tampo em madeira cumaru tratada e cadeiras com tela sling preta.'
      }
    ],
    contactHistory: [
      {
        id: 'ct-41',
        date: '2026-08-25',
        time: '11:20',
        type: 'whatsapp',
        observation: 'Fernanda pediu para simular parcelamento em 6x e 10x sem juros.'
      },
      {
        id: 'ct-42',
        date: '2026-08-22',
        time: '17:00',
        type: 'whatsapp',
        observation: 'Cliente chamou pelo Instagram da SurgiLar perguntando sobre a Mesa Riviera.'
      }
    ],
    purchaseHistory: [],
    reminders: [
      {
        id: 'rem-4',
        clientId: 'cli-4',
        clientName: 'Fernanda Lima Gusmão',
        clientPhone: '(41) 99654-3321',
        reason: 'retomar_negociacao',
        date: '2026-08-26',
        time: '14:00',
        observation: 'Enviar as simulações de pagamento parcelado e fotos de projetos instalados.',
        completed: false,
        productOfInterest: 'Mesa Riviera 8 Lugares'
      }
    ]
  },
  {
    id: 'cli-5',
    name: 'Carlos Eduardo Meireles',
    whatsapp: '(41) 98899-7711',
    birthDate: '1984-05-14',
    createdAt: '2026-05-28',
    status: 'novo',
    notes: 'Cliente que comprou balanço há 90 dias e precisa de reativação.',
    productsOfInterest: ['Balanço Rincón', 'Puff Comfy'],
    lastContactDate: '2026-05-28',
    city: 'Curitiba - PR',
    email: 'cadu.meireles@eng.br',
    totalSpent: 4200,
    budgets: [],
    contactHistory: [
      {
        id: 'ct-51',
        date: '2026-05-28',
        time: '09:10',
        type: 'whatsapp',
        observation: 'Primeira mensagem enviada para o Carlos dando as boas-vindas e enviando catálogo em PDF do Balanço Rincón.'
      }
    ],
    purchaseHistory: [
      {
        id: 'pur-51',
        product: 'Balanço Rincón Individual',
        value: 4200,
        date: '2026-05-28', // Há 90 dias!
        paymentMethod: 'Pix à vista',
        notes: 'Entregue com suporte reforçado.'
      }
    ],
    reminders: [
      {
        id: 'rem-5',
        clientId: 'cli-5',
        clientName: 'Carlos Eduardo Meireles',
        clientPhone: '(41) 98899-7711',
        reason: 'retomar_negociacao',
        date: '2026-08-26',
        time: '10:00',
        observation: 'Cliente está há 90 dias sem comprar - enviar novidades do catálogo.',
        completed: false,
        productOfInterest: 'Puff Comfy'
      }
    ]
  },
  {
    id: 'cli-6',
    name: 'Luciana & Rodrigo Mendes',
    whatsapp: '(41) 99765-4433',
    birthDate: '1982-10-15',
    createdAt: '2026-07-28',
    status: 'venda_realizada',
    notes: 'Compraram mobiliário completo para a chácara em São José dos Pinhais.',
    productsOfInterest: ['Sofá Modular Lumina', 'Espreguiçadeira Acqua Lux', 'Bistrô Ibiza com 4 Banquetes'],
    lastContactDate: '2026-08-15',
    city: 'São José dos Pinhais - PR',
    email: 'luciana.mendes@adv.com.br',
    totalSpent: 32400,
    budgets: [
      {
        id: 'orc-601',
        product: 'Pacote Chácara Completo (Sofá Lumina + 2 Espreguiçadeiras + Bistrô Ibiza)',
        value: 32400,
        date: '2026-08-02',
        status: 'venda_realizada',
        notes: 'Pedido aprovado e faturado.'
      }
    ],
    contactHistory: [
      {
        id: 'ct-61',
        date: '2026-08-15',
        time: '16:00',
        type: 'whatsapp',
        observation: 'Cliente enviou fotos dos móveis instalados na chácara elogiando muito a qualidade da SurgiLar.'
      }
    ],
    purchaseHistory: [
      {
        id: 'pur-61',
        product: 'Pacote Chácara Completo (Lumina + Acqua Lux + Bistrô)',
        value: 32400,
        date: '2026-08-08',
        paymentMethod: 'Transferência Bancária',
        notes: 'Montagem realizada pela equipe própria da SurgiLar.'
      }
    ],
    reminders: []
  },
  {
    id: 'cli-7',
    name: 'Ana Carolina Peixoto',
    whatsapp: '(41) 99234-5566',
    birthDate: '1995-11-20',
    createdAt: '2026-08-12',
    status: 'followup_necessario',
    notes: 'Interesse no Conjunto Cataratas e Puff Comfy para varanda.',
    productsOfInterest: ['Conjunto Cataratas', 'Puff Comfy'],
    lastContactDate: '2026-08-21',
    city: 'Curitiba - PR',
    email: 'ana.peixoto@uol.com.br',
    totalSpent: 0,
    budgets: [
      {
        id: 'orc-701',
        product: 'Conjunto Cataratas Fibra Sintética Avelã',
        value: 12900,
        date: '2026-08-21',
        status: 'enviado',
        notes: 'Orçamento com validade de 15 dias.'
      }
    ],
    contactHistory: [
      {
        id: 'ct-71',
        date: '2026-08-21',
        time: '15:15',
        type: 'whatsapp',
        observation: 'Enviei orçamento detalhado e vídeo de demonstração da resistência à chuva.'
      }
    ],
    purchaseHistory: [],
    reminders: [
      {
        id: 'rem-7',
        clientId: 'cli-7',
        clientName: 'Ana Carolina Peixoto',
        clientPhone: '(41) 99234-5566',
        reason: 'entrar_em_contato',
        date: '2026-08-26',
        time: '17:00',
        observation: 'É hora de entrar em contato com Ana sobre a proposta da varanda.',
        completed: false,
        productOfInterest: 'Conjunto Cataratas'
      }
    ]
  }
];

export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'sale-1',
    clientId: 'cli-3',
    clientName: 'Dr. Roberto Albuquerque',
    clientPhone: '(41) 98455-1122',
    product: 'Conjunto Cataratas Especial Alumínio Preto',
    originalPrice: 16800,
    value: 16800,
    paidValue: 16800,
    pendingValue: 0,
    paymentStatus: 'pago',
    paymentMethod: 'Pix à vista',
    paymentMethodType: 'Pix',
    invoiceNumber: 'NF-004821',
    isInvoiced: true,
    date: '2026-08-06',
    notes: 'Entregue com nota fiscal e garantia de 5 anos.',
    status: 'finalizada'
  },
  {
    id: 'sale-2',
    clientId: 'cli-6',
    clientName: 'Luciana & Rodrigo Mendes',
    clientPhone: '(41) 99765-4433',
    product: 'Pacote Chácara Completo (Lumina + Acqua Lux + Bistrô)',
    originalPrice: 34000,
    value: 32400,
    paidValue: 32400,
    pendingValue: 0,
    discount: 1600,
    paymentStatus: 'pago',
    paymentMethod: 'Transferência Bancária',
    paymentMethodType: 'Outro',
    invoiceNumber: 'NF-004822',
    isInvoiced: true,
    date: '2026-08-08',
    notes: 'Montagem realizada pela equipe SurgiLar.',
    status: 'finalizada'
  },
  {
    id: 'sale-3',
    clientId: 'cli-3',
    clientName: 'Dr. Roberto Albuquerque',
    clientPhone: '(41) 98455-1122',
    product: 'Balanço Rincón + 2 Puffs Comfy',
    originalPrice: 8200,
    value: 7800,
    paidValue: 7800,
    pendingValue: 0,
    discount: 400,
    paymentStatus: 'pago',
    paymentMethod: 'Cartão de Crédito 3x',
    paymentMethodType: 'Parcelado',
    installments: 3,
    installmentValue: 2600,
    invoiceNumber: 'NF-004825',
    isInvoiced: true,
    date: '2026-08-20',
    notes: 'Acessórios grafite para casa de praia.',
    status: 'finalizada'
  },
  {
    id: 'sale-4',
    clientId: 'cli-5',
    clientName: 'Carlos Eduardo Meireles',
    clientPhone: '(41) 98899-7711',
    product: 'Balanço Rincón Individual',
    originalPrice: 4200,
    value: 4200,
    paidValue: 4200,
    pendingValue: 0,
    paymentStatus: 'pago',
    paymentMethod: 'Pix à vista',
    paymentMethodType: 'Pix',
    invoiceNumber: 'NF-004802',
    isInvoiced: true,
    date: '2026-05-28',
    notes: 'Venda realizada há 90 dias.',
    status: 'finalizada'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🎂 Hoje é aniversário de Maria Clara!',
    message: 'Maria Clara Vasconcelos faz aniversário hoje! Clique para enviar a mensagem de parabéns.',
    time: 'Hoje',
    type: 'birthday',
    read: false,
    clientId: 'cli-2',
    clientName: 'Maria Clara Vasconcelos',
    badge: 'Aniversário Hoje 🎉'
  },
  {
    id: 'notif-2',
    title: '🎂 João Silva faz aniversário amanhã!',
    message: 'Aniversário próximo: João Silva completa mais um ano de vida amanhã.',
    time: 'Amanhã',
    type: 'birthday',
    read: false,
    clientId: 'cli-1',
    clientName: 'João Silva',
    badge: 'Aniversário Amanhã 🎂'
  },
  {
    id: 'notif-3',
    title: '⏱️ Carlos está há 90 dias sem comprar',
    message: 'Carlos Eduardo Meireles realizou a última compra em 28/05/2026. Que tal enviar novidades do catálogo?',
    time: 'Hoje',
    type: 'inactivity',
    read: false,
    clientId: 'cli-5',
    clientName: 'Carlos Eduardo Meireles',
    badge: '90 dias sem comprar ⏱️'
  },
  {
    id: 'notif-4',
    title: '🔔 É hora de entrar em contato com Ana',
    message: 'Ana Carolina Peixoto aguarda retorno sobre o orçamento da varanda.',
    time: 'Hoje, 17:00',
    type: 'reminder',
    read: false,
    clientId: 'cli-7',
    clientName: 'Ana Carolina Peixoto',
    badge: 'Lembrete Hoje 🔔'
  }
];
