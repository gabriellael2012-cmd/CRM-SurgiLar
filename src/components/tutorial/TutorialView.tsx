import React, { useState } from 'react';
import {
  BookOpen,
  UserPlus,
  MessageCircle,
  Package,
  DollarSign,
  History,
  RefreshCw,
  Award,
  BellRing,
  CalendarDays,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

export const TutorialView: React.FC = () => {
  const [openChapter, setOpenChapter] = useState<number | null>(null);

  const toggleChapter = (index: number) => {
    setOpenChapter(openChapter === index ? null : index);
  };

  const chapters = [
    {
      num: 1,
      title: '1. Como Adicionar um Cliente',
      icon: <UserPlus className="w-5 h-5 text-rose-400" />,
      summary: 'Passo a passo completo para cadastrar um novo cliente no sistema.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300">
          <p className="font-semibold text-rose-300">Siga o roteiro oficial de 10 passos:</p>
          <ol className="list-decimal pl-5 space-y-2 text-zinc-300 leading-relaxed">
            <li><strong className="text-white">Clique no menu "Clientes"</strong> na barra lateral ou no botão "+ Adicionar Cliente" no topo.</li>
            <li><strong className="text-white">Clique em "+ Adicionar Cliente"</strong> para abrir a janela de formulário elegante.</li>
            <li><strong className="text-white">Digite o nome completo</strong> do cliente (ex: João Silva).</li>
            <li><strong className="text-white">Digite o WhatsApp</strong> com DDD (ex: (41) 99876-5432). O sistema formata automaticamente.</li>
            <li><strong className="text-white">Adicione os produtos</strong> pelos quais o cliente se interessa selecionando os botões ou digitando.</li>
            <li><strong className="text-white">Registre o orçamento</strong> inicial caso já tenha um valor negociado.</li>
            <li><strong className="text-white">Registre a data do contato</strong> e notas relevantes.</li>
            <li><strong className="text-white">Escolha o status inicial</strong> (ex: "Novo cliente" ou "Em negociação").</li>
            <li><strong className="text-white">Adicione observações</strong> (ex: arquiteto parceiro, condomínio, horário preferido).</li>
            <li><strong className="text-white">Crie um lembrete</strong> para a data e hora do próximo contato ou follow-up.</li>
          </ol>
        </div>
      )
    },
    {
      num: 2,
      title: '2. Como Cadastrar o WhatsApp e Usar o Direcionamento',
      icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
      summary: 'Como funciona o botão inteligente que abre diretamente a conversa do cliente.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            No CRM Kely Alves, o WhatsApp não abre simplesmente a tela inicial do aplicativo. Ele utiliza o número cadastrado para <strong className="text-white">abrir diretamente a conversa privativa daquele cliente específico</strong>.
          </p>
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase">Exemplo na interface:</span>
              <p className="text-sm font-bold text-white">📱 (41) 99876-5432</p>
            </div>
            <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-rose-600 text-white rounded-lg text-xs font-bold">
              WhatsApp 💬
            </span>
          </div>
          <p>
            Ao passar o mouse sobre o botão, você verá um efeito suave de deslizar (slide). Ao clicar, o WhatsApp Web ou aplicativo oficial no seu celular será aberto instantaneamente na conversa de Kely com aquele cliente.
          </p>
        </div>
      )
    },
    {
      num: 3,
      title: '3. Como Adicionar Produtos de Interesse',
      icon: <Package className="w-5 h-5 text-pink-400" />,
      summary: 'Gerenciamento de produtos do catálogo SurgiLar desejados pelo cliente.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Cada cliente possui uma seção exclusiva <strong className="text-rose-300">"🛋️ Produtos de Interesse"</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Você pode adicionar múltiplos produtos por cliente (ex: <em>Conjunto Cataratas, Conjunto Cancún, Puff Comfy, Balanço Rincón</em>).</li>
            <li>Basta clicar nas tags rápidas do catálogo SurgiLar para adicionar com 1 clique.</li>
            <li>Para produtos sob medida ou novidades, digite no campo personalizado e clique em "Adicionar".</li>
            <li>Para remover um produto, clique no ícone de lixeira ao lado dele.</li>
          </ul>
        </div>
      )
    },
    {
      num: 4,
      title: '4. Como Registrar um Orçamento',
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      summary: 'Registro e controle de valores, condições e status das propostas.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Dentro do perfil do cliente, acesse a aba <strong className="text-amber-300">"💰 Orçamentos Enviados"</strong> e clique em <em>"+ Novo Orçamento"</em>:
          </p>
          <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
            <div><strong className="text-white">Produto:</strong> Item ou conjunto cotado</div>
            <div><strong className="text-white">Valor:</strong> Valor total em R$</div>
            <div><strong className="text-white">Data:</strong> Data de envio da proposta</div>
            <div><strong className="text-white">Status:</strong> Rascunho, Enviado, Aprovado, etc.</div>
          </div>
          <p>
            O CRM calcula automaticamente o total em propostas na sua página inicial e na aba de Orçamentos.
          </p>
        </div>
      )
    },
    {
      num: 5,
      title: '5. Como Registrar uma Conversa ou Contato',
      icon: <History className="w-5 h-5 text-purple-400" />,
      summary: 'Linha do tempo histórica de cada interação realizada.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Toda vez que você conversar com o cliente pelo WhatsApp, por telefone ou presencialmente no showroom:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Abra o perfil do cliente e vá na aba <strong className="text-purple-300">"📅 Histórico de Contatos"</strong>.</li>
            <li>Clique em <em>"+ Registrar Conversa"</em>.</li>
            <li>Selecione o canal (WhatsApp, Ligação, Visita Showroom, Reunião ou E-mail).</li>
            <li>Escreva o resumo da conversa (ex: <em>"26/08/2026 — 14:30: Conversei com o cliente pelo WhatsApp e enviei o orçamento do conjunto"</em>).</li>
            <li>Salve para manter a linha do tempo impecavelmente atualizada.</li>
          </ol>
        </div>
      )
    },
    {
      num: 6,
      title: '6. Como Alterar o Status do Cliente no Funil',
      icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
      summary: 'Entenda os 7 estágios da negociação no CRM Kely Alves.',
      content: (
        <div className="space-y-2.5 text-xs text-zinc-300 leading-relaxed">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
              <strong className="text-emerald-400">🆕 Novo cliente:</strong> Lead recém-chegado que ainda não recebeu atendimento aprofundado.
            </div>
            <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
              <strong className="text-cyan-400">💬 Em negociação:</strong> Cliente em conversa ativa escolhendo tecidos, medidas ou modelos.
            </div>
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/20">
              <strong className="text-amber-400">💰 Orçamento enviado:</strong> Proposta formal de valores já entregue ao cliente.
            </div>
            <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/20">
              <strong className="text-purple-400">⏳ Aguardando resposta:</strong> Cliente analisando a proposta antes da decisão.
            </div>
            <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/30">
              <strong className="text-rose-300">🔔 Follow-up necessário:</strong> Prazo de retorno vencendo; Kely precisa entrar em contato hoje!
            </div>
            <div className="p-2 rounded-lg bg-pink-950/40 border border-pink-500/40">
              <strong className="text-pink-300">📦 Venda realizada:</strong> Negócio fechado com sucesso e pedido faturado!
            </div>
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-750">
              <strong className="text-zinc-400">❌ Cliente perdido:</strong> Desistiu da compra ou optou por adiar o projeto.
            </div>
          </div>
        </div>
      )
    },
    {
      num: 7,
      title: '7. Como Registrar uma Venda',
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      summary: 'Transformar uma negociação em venda faturada com celebração visual.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Quando o cliente confirmar o pedido, você tem duas formas rápidas:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>No perfil do cliente, altere o status para <strong className="text-pink-300">"📦 Venda Realizada"</strong> e adicione os dados na aba "Histórico de Compras".</li>
            <li>Ou vá na página <strong className="text-white">"Vendas"</strong> no menu lateral e clique em <em>"+ Registrar Nova Venda"</em>.</li>
            <li>O sistema disparará uma animação especial de confetes e atualizará automaticamente o faturamento total da SurgiLar.</li>
          </ul>
        </div>
      )
    },
    {
      num: 8,
      title: '8. Como Registrar uma Compra no Histórico',
      icon: <Package className="w-5 h-5 text-pink-400" />,
      summary: 'Adicionar produtos comprados, valores, datas e formas de pagamento.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            No perfil do cliente, acesse a aba <strong className="text-pink-300">"📦 Histórico de Compras"</strong>:
          </p>
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
            <p className="font-bold text-white">Exemplo de registro:</p>
            <p className="text-rose-300 font-semibold">Conjunto Cataratas Alumínio Preto</p>
            <p className="text-emerald-400 font-mono font-bold">R$ 16.800,00 — Pix à vista</p>
            <p className="text-[11px] text-zinc-400">Compra realizada em 20/08/2026.</p>
          </div>
          <p>
            Isso permite que Kely saiba exatamente o que o cliente já possui em casa para futuras ofertas e pós-venda.
          </p>
        </div>
      )
    },
    {
      num: 9,
      title: '9. Como Criar e Gerenciar Lembretes',
      icon: <BellRing className="w-5 h-5 text-rose-400" />,
      summary: 'Organização de follow-ups em Hoje, Amanhã, Próximos Dias e Atrasados.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Os lembretes são o coração da organização comercial de Kely Alves. Crie lembretes para:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">• Entrar em contato</div>
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">• Fazer follow-up</div>
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">• Enviar orçamento</div>
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">• Perguntar sobre orçamento</div>
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">• Pós-venda e satisfação</div>
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">• Retomar negociação</div>
          </div>
          <p>
            Clientes que precisam de contato hoje recebem <strong className="text-rose-400 font-semibold">destaque visual com efeito pulsante</strong> no topo do Dashboard.
          </p>
        </div>
      )
    },
    {
      num: 10,
      title: '10. Como Utilizar a Agenda Inteligente',
      icon: <CalendarDays className="w-5 h-5 text-purple-400" />,
      summary: 'Visualização do calendário mensal, semanal e diário com cartões rápidos.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            No menu <strong className="text-white">"Agenda"</strong>, você visualiza todos os seus compromissos no calendário:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Ex: <strong className="text-rose-300">14:00 — Falar com João Silva</strong></li>
            <li>Ex: <strong className="text-amber-300">16:30 — Enviar orçamento para Mariana</strong></li>
            <li>Ao clicar em qualquer evento, um painel instantâneo exibe o WhatsApp do cliente, os produtos de interesse, o orçamento e o botão direto para iniciar a conversa.</li>
          </ul>
        </div>
      )
    },
    {
      num: 11,
      title: '11. Como Usar o WhatsApp com Mensagens Prontas',
      icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
      summary: 'Agilidade com modelos de mensagens profissionais da SurgiLar.',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Ao lado do botão de WhatsApp em cada cliente, você encontrará uma setinha com <strong className="text-emerald-400">Mensagens Rápidas</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-white">Saudação Inicial:</strong> Apresentação de Kely Alves e catálogo.</li>
            <li><strong className="text-white">Envio de Orçamento:</strong> Texto formal acompanhando a cotação.</li>
            <li><strong className="text-white">Follow-up de Proposta:</strong> Retorno educado perguntando sobre a análise da proposta.</li>
            <li><strong className="text-white">Pós-venda:</strong> Mensagem de agradecimento e suporte.</li>
          </ul>
        </div>
      )
    },
    {
      num: 12,
      title: '12. Dicas de Ouro para Manter o CRM Sempre Organizado',
      icon: <Sparkles className="w-5 h-5 text-rose-400" />,
      summary: '7 regras práticas essenciais para a alta performance de Kely Alves.',
      content: (
        <div className="space-y-2.5 text-xs text-zinc-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              1. Cadastre todos os clientes imediatamente ao receber o lead.
            </div>
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              2. Atualize o status após cada contato no WhatsApp ou telefone.
            </div>
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              3. Registre todos os orçamentos com valor e data de validade.
            </div>
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              4. Registre todas as vendas para alimentar o faturamento da SurgiLar.
            </div>
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              5. Use os lembretes com data e horário para não esquecer ninguém.
            </div>
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              6. Mantenha o histórico atualizado na linha do tempo.
            </div>
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              7. Faça follow-up prioritário dos clientes com status "Aguardando resposta".
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#16121b] via-[#1a121d] to-[#121216] border border-rose-500/40 p-6 lg:p-8 shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manual Oficial de Treinamento</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white font-display">
            📚 COMO USAR O CRM KELY ALVES
          </h2>
          <p className="text-zinc-300 text-sm mt-1 max-w-2xl">
            Guia completo e didático para Kely Alves gerenciar clientes, orçamentos, vendas e WhatsApp com máxima eficiência na SurgiLar.
          </p>
        </div>
      </div>

      {/* Chapters Grid / Accordion */}
      <div className="space-y-4">
        {chapters.map((chapter) => {
          const isOpen = openChapter === chapter.num;
          return (
            <div
              key={chapter.num}
              className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'border-rose-500/60 shadow-lg shadow-rose-950/30 bg-[#121218]'
                  : 'hover:border-zinc-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleChapter(chapter.num)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    {chapter.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {chapter.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 hidden sm:inline-block">
                    Capítulo {chapter.num}
                  </span>
                  <div className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="p-6 pt-2 border-t border-zinc-800/80 bg-black/40 animate-in fade-in">
                  {chapter.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
