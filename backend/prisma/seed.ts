import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.like.deleteMany();             // primeiro os likes
  await prisma.comment.deleteMany();          // depois os comentários
  await prisma.initiativeUpdate.deleteMany(); // depois os updates
  await prisma.initiative.deleteMany();       // agora as iniciativas
  await prisma.user.deleteMany();   

  const users = [
    {
      id: "bwknr-zxtvq-mgsjd",
      email: "sofia.rodrigues@inithub.com",
      name: "Sofia Rodrigues",
      department: "Sustentabilidade",
      emojiAvatar: "👩‍🌾",
      isAdmin: false,
      createdAt: new Date("2025-08-02T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "fhlqp-xrzkv-nwtmg",
      email: "lucas.ferreira@inithub.com",
      name: "Lucas Ferreira",
      department: "Governança",
      emojiAvatar: "👤",
      isAdmin: false,
      createdAt: new Date("2025-08-05T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "kjvzn-qtbdx-prwhs",
      email: "isabela.alves@inithub.com",
      name: "Isabela Alves",
      department: "Tecnologia",
      emojiAvatar: "👩‍🔬",
      isAdmin: false,
      createdAt: new Date("2025-08-07T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "mklqz-pxvtr-hjnwg",
      email: "gabriel.souza@inithub.com",
      name: "Gabriel Souza",
      department: "Marketing",
      emojiAvatar: "👨‍💼",
      isAdmin: false,
      createdAt: new Date("2025-08-13T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "ndpkr-vxwql-jsmgt",
      email: "joao.santos@inithub.com",
      name: "João Santos",
      department: "Tecnologia",
      emojiAvatar: "👨‍💻",
      isAdmin: false,
      createdAt: new Date("2025-07-23T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "pqvzm-dhktj-xlgfn",
      email: "pedro.costa@inithub.com",
      name: "Pedro Costa",
      department: "RH",
      emojiAvatar: "👨‍💼",
      isAdmin: false,
      createdAt: new Date("2025-07-30T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "qnzpk-rxvtm-hgjlw",
      email: "thiago.barbosa@inithub.com",
      name: "Thiago Barbosa",
      department: "Governança",
      emojiAvatar: "👤",
      isAdmin: false,
      createdAt: new Date("2025-08-16T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "tgxzp-vlmnq-bwkjr",
      email: "camila.nunes@inithub.com",
      name: "Camila Nunes",
      department: "Cultura",
      emojiAvatar: "👩‍🎨",
      isAdmin: false,
      createdAt: new Date("2025-08-11T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "vzxqr-bgtnh-mwkjp",
      email: "juliana.martins@inithub.com",
      name: "Juliana Martins",
      department: "Tecnologia",
      emojiAvatar: "👩‍💻",
      isAdmin: false,
      createdAt: new Date("2025-08-15T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "wrqmz-hflpv-xkntg",
      email: "rafael.lima@inithub.com",
      name: "Rafael Lima",
      department: "Cultura",
      emojiAvatar: "👨‍🔧",
      isAdmin: false,
      createdAt: new Date("2025-08-09T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "xqfhm-pgktv-bzrws",
      email: "admin@inithub.com",
      name: "Ana Silva",
      department: "Governança",
      emojiAvatar: "👩‍💼",
      isAdmin: true,
      createdAt: new Date("2025-07-18T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    },
    {
      id: "ztblx-mvnhd-qwrjk",
      email: "maria.oliveira@inithub.com",
      name: "Maria Oliveira",
      department: "Marketing",
      emojiAvatar: "👩‍🎨",
      isAdmin: false,
      createdAt: new Date("2025-07-28T16:24:13.373Z"),
      updatedAt: new Date("2025-08-17T16:24:13.373Z")
    }
  ];

  const initiatives = [
    {
      id: "rxpzm-vbktj-qwlgn",
      title: "Ferramenta de Revisão Automática com IA",
      description: "Sistema inteligente para revisão automática de propostas internas utilizando modelos de linguagem avançados (LLMs). A ferramenta analisará documentos, identificará inconsistências, sugerirá melhorias de redação e verificará conformidade com políticas internas. Incluirá análise de sentimento, detecção de viés e sugestões de estruturação para maximizar clareza e impacto das propostas.",
      theme: "Inteligência Artificial",
      context: "O processo manual de revisão de propostas internas consome tempo excessivo das equipes e apresenta inconsistências na qualidade. Com o volume crescente de documentos e a necessidade de padronização, uma solução automatizada baseada em IA pode acelerar significativamente o processo mantendo alta qualidade.",
      deliverable: "Sistema web integrado com workflow de aprovação, API para upload de documentos, dashboard de métricas de qualidade e relatórios de sugestões implementadas",
      evaluationCriteria: "Redução de 70% no tempo de revisão, aumento de 85% na satisfação com qualidade das propostas revisadas e economia de 40 horas/semana de trabalho manual",
      status: "PENDING" as const,
      author: {
        connect: {
          id: "kjvzn-qtbdx-prwhs"
        }
      },
      likesCount: 16,
      commentsCount: 8,
      createdAt: new Date("2025-08-10T10:00:00Z"),
      updatedAt: new Date("2025-08-17T10:00:00Z")
    },
    {
      id: "kqwxn-mrhzv-tlpjg",
      title: "Pipeline de Anonimização Automática para ML",
      description: "Sistema automatizado para anonimização de dados sensíveis em pesquisas internas de Machine Learning, utilizando técnicas avançadas de preservação de privacidade como differential privacy, k-anonymity e synthetic data generation. O pipeline garantirá conformidade com LGPD/GDPR enquanto mantém a utilidade dos dados para análises e treinamento de modelos.",
      theme: "Privacy Tech",
      context: "Pesquisas internas de ML frequentemente requerem dados sensíveis que não podem ser compartilhados diretamente. A falta de um pipeline robusto de anonimização limita experimentos e pesquisas, criando gargalos para inovação enquanto expõe a empresa a riscos de compliance e vazamento de dados.",
      deliverable: "Pipeline automatizado de anonimização, API para processamento batch e streaming, dashboard de métricas de privacidade e documentação de conformidade LGPD",
      evaluationCriteria: "100% de conformidade em auditorias de privacidade, redução de 90% no tempo de preparação de dados para pesquisa e aumento de 200% no volume de experimentos ML internos",
      status: "APPROVED" as const,
      author: {
        connect: {
          id: "ndpkr-vxwql-jsmgt"
        }
      },
      assignedTo: {
        connect: {
          id: "ndpkr-vxwql-jsmgt"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-08-12T14:30:00Z"),
      likesCount: 8,
      commentsCount: 7,
      createdAt: new Date("2025-08-08T09:15:00Z"),
      updatedAt: new Date("2025-08-17T09:15:00Z")
    },
    {
      id: "zmvtx-jbqpr-wkghl",
      title: "Chatbot IA para Onboarding de Colaboradores",
      description: "Assistente virtual inteligente para apoiar novos colaboradores durante o processo de integração, fornecendo informações personalizadas, respondendo dúvidas em tempo real e guiando através de procedimentos internos. O chatbot utilizará processamento de linguagem natural avançado e estará integrado aos sistemas de RH para acesso contextual a informações relevantes.",
      theme: "Recursos Humanos",
      context: "O processo de onboarding atual é fragmentado e gera muitas dúvidas repetitivas que sobrecarregam o time de RH. Novos colaboradores frequentemente se sentem perdidos nos primeiros dias, impactando produtividade inicial e satisfação. Um assistente IA pode padronizar e acelerar essa experiência.",
      deliverable: "Chatbot integrado ao portal interno, base de conhecimento dinâmica, analytics de interações e satisfação, e sistema de escalação para casos complexos",
      evaluationCriteria: "Redução de 60% nas consultas manuais ao RH, aumento de 40% na satisfação de onboarding (NPS > 80) e redução de 50% no tempo até produtividade plena",
      status: "IN_EXECUTION" as const,
      author: {
        connect: {
          id: "pqvzm-dhktj-xlgfn"
        }
      },
      assignedTo: {
        connect: {
          id: "pqvzm-dhktj-xlgfn"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-08-14T16:00:00Z"),
      likesCount: 12,
      commentsCount: 3,
      createdAt: new Date("2025-08-11T11:20:00Z"),
      updatedAt: new Date("2025-08-17T11:20:00Z")
    },
    {
      id: "blvzq-thxpn-mjkwr",
      title: "Sistema de Detecção de Anomalias com ML",
      description: "Plataforma de machine learning para detecção proativa de anomalias em processos críticos de negócio, utilizando algoritmos de detecção não supervisionada e redes neurais. O sistema monitorará KPIs em tempo real, identificará padrões atípicos e alertará automaticamente as equipes responsáveis com análise de causa raiz sugerida.",
      theme: "Monitoramento Inteligente",
      context: "Anomalias em processos críticos frequentemente passam despercebidas até causarem impactos significativos. A detecção manual é reativa e ineficiente, resultando em perdas operacionais e financeiras que poderiam ser evitadas com monitoramento inteligente proativo.",
      deliverable: "Sistema de monitoramento em tempo real, dashboard de alertas inteligentes, modelos de ML para diferentes tipos de processos e relatórios de análise de tendências",
      evaluationCriteria: "Detecção de 95% das anomalias críticas em até 5 minutos, redução de 80% no tempo de resposta a incidentes e economia de R$ 500k anuais em perdas evitadas",
      status: "APPROVED" as const,
      author: {
        connect: {
          id: "vzxqr-bgtnh-mwkjp"
        }
      },
      assignedTo: {
        connect: {
          id: "vzxqr-bgtnh-mwkjp"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-08-15T13:45:00Z"),
      likesCount: 11,
      commentsCount: 6,
      createdAt: new Date("2025-08-09T08:30:00Z"),
      updatedAt: new Date("2025-08-17T08:30:00Z")
    },
    {
      id: "bxktn-rmvzq-phjlw",
      title: "Assistente IA para Análise de Dados",
      description: "Ferramenta de inteligência artificial que democratiza análise de dados complexos, permitindo que usuários não-técnicos façam consultas em linguagem natural e recebam insights automatizados. O sistema utilizará LLMs especializados em análise de dados, geração automática de visualizações e interpretação estatística inteligente.",
      theme: "Data Democratization",
      context: "Análises de dados complexas estão concentradas em poucos especialistas, criando gargalos e limitando o acesso a insights críticos para tomada de decisão. A democratização através de IA pode acelerar a cultura data-driven em toda organização.",
      deliverable: "Interface conversacional para consultas de dados, gerador automático de relatórios, biblioteca de visualizações inteligentes e sistema de recomendações de análises",
      evaluationCriteria: "Aumento de 300% no número de análises realizadas por mês, redução de 70% no tempo de geração de relatórios e adoção por 90% dos gestores não-técnicos",
      status: "APPROVED" as const,
      author: {
        connect: {
          id: "vzxqr-bgtnh-mwkjp"
        }
      },
      assignedTo: {
        connect: {
          id: "vzxqr-bgtnh-mwkjp"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-07-30T16:24:41.018Z"),
      likesCount: 23,
      commentsCount: 12,
      createdAt: new Date("2025-07-26T16:24:41.018Z"),
      updatedAt: new Date("2025-08-15T16:24:41.018Z")
    },
    {
      id: "hzvpk-nxqtr-wmglj",
      title: "Sistema de Recomendação Personalizada com Deep Learning",
      description: "Motor de recomendação avançado utilizando redes neurais profundas para personalizar experiências de usuários internos, sugerindo conteúdos relevantes, treinamentos, projetos e conexões baseados em comportamento, preferências e objetivos profissionais. Incluirá aprendizado contínuo e explicabilidade das recomendações.",
      theme: "Personalização IA",
      context: "Com o crescimento da base de conhecimento interna e diversidade de perfis profissionais, colaboradores frequentemente perdem oportunidades relevantes por falta de descoberta eficiente. Um sistema inteligente pode conectar pessoas, projetos e conhecimentos de forma otimizada.",
      deliverable: "Engine de recomendação em tempo real, API de personalização, dashboard de métricas de engajamento e sistema de feedback para melhoria contínua",
      evaluationCriteria: "Aumento de 150% no engajamento com conteúdos internos, melhoria de 60% na assertividade de matches projeto-pessoa e redução de 40% no tempo de descoberta de recursos relevantes",
      status: "IN_EXECUTION" as const,
      author: {
        connect: {
          id: "mklqz-pxvtr-hjnwg"
        }
      },
      assignedTo: {
        connect: {
          id: "mklqz-pxvtr-hjnwg"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-08-02T16:24:41.018Z"),
      likesCount: 18,
      commentsCount: 6,
      createdAt: new Date("2025-07-30T16:24:41.018Z"),
      updatedAt: new Date("2025-08-17T16:24:41.018Z")
    },
    {
      id: "kmnxz-rlvtq-pwhjg",
      title: "Automação de Documentação Técnica com IA",
      description: "Sistema automatizado para geração e manutenção de documentação técnica utilizando análise de código, processamento de linguagem natural e modelos generativos. A ferramenta extrairá automaticamente informações de repositórios, gerará documentação padronizada e manterá sincronização com mudanças no código.",
      theme: "DevOps Inteligente",
      context: "Documentação técnica frequentemente está desatualizada ou inexistente, criando barreiras para onboarding de desenvolvedores e manutenção de sistemas. O processo manual é custoso e raramente priorizado, resultando em débito técnico significativo.",
      deliverable: "Sistema de geração automática de docs, integração com Git, templates inteligentes e dashboard de cobertura de documentação",
      evaluationCriteria: "Aumento de 400% na cobertura de documentação, redução de 80% no tempo de onboarding técnico e melhoria de 90% na satisfação de desenvolvedores com qualidade da documentação",
      status: "PENDING" as const,
      author: {
        connect: {
          id: "qnzpk-rxvtm-hgjlw"
        }
      },
      likesCount: 11,
      commentsCount: 6,
      createdAt: new Date("2025-08-12T16:24:41.018Z"),
      updatedAt: new Date("2025-08-17T16:24:41.018Z")
    },
    {
      id: "nwxzq-jmktv-rbghl",
      title: "Otimização Inteligente de Recursos Computacionais",
      description: "Sistema de IA para otimização automática de alocação de recursos computacionais baseado em padrões de uso, previsão de demanda e análise de performance. Utilizará reinforcement learning para tomar decisões dinâmicas de scaling, migração e balanceamento de cargas, maximizando eficiência e minimizando custos.",
      theme: "Cloud Optimization",
      context: "Recursos computacionais são frequentemente subutilizados ou super-provisionados, resultando em desperdício financeiro significativo. A gestão manual é reativa e não consegue acompanhar padrões complexos de demanda, especialmente em ambientes cloud dinâmicos.",
      deliverable: "Sistema de auto-scaling inteligente, dashboard de otimização de custos, alertas preditivos de capacidade e relatórios de eficiência de recursos",
      evaluationCriteria: "Redução de 35% nos custos de infraestrutura, melhoria de 50% na utilização de recursos e redução de 90% em incidentes relacionados a capacidade",
      status: "PENDING" as const,
      author: {
        connect: {
          id: "fhlqp-xrzkv-nwtmg"
        }
      },
      likesCount: 12,
      commentsCount: 7,
      createdAt: new Date("2025-08-09T16:24:41.018Z"),
      updatedAt: new Date("2025-08-17T16:24:41.018Z")
    }
  ];

  const likes = [
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-07-27T08:30:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-07-27T10:15:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-07-27T14:20:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-07-28T09:00:00Z") },
    { userId: "tgxzp-vlmnq-bwkjr", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-07-28T11:45:00Z") },
    { userId: "ztblx-mvnhd-qwrjk", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-07-29T16:30:00Z") },
    { userId: "pqvzm-dhktj-xlgfn", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-07-30T08:15:00Z") },
    { userId: "fhlqp-xrzkv-nwtmg", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-08-01T10:00:00Z") },
    { userId: "mklqz-pxvtr-hjnwg", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-08-02T14:30:00Z") },
    { userId: "qnzpk-rxvtm-hgjlw", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-08-03T09:45:00Z") },
    { userId: "xqfhm-pgktv-bzrws", initiativeId: "bxktn-rmvzq-phjlw", createdAt: new Date("2025-08-04T11:20:00Z") },
    
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-07-31T08:30:00Z") },
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-01T10:15:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-01T14:30:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-02T09:45:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-03T11:20:00Z") },
    { userId: "tgxzp-vlmnq-bwkjr", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-04T15:00:00Z") },
    { userId: "pqvzm-dhktj-xlgfn", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-05T08:15:00Z") },
    { userId: "mklqz-pxvtr-hjnwg", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-06T13:30:00Z") },
    
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-15T08:00:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-15T10:30:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-15T14:15:00Z") },
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-16T09:20:00Z") },
    { userId: "ztblx-mvnhd-qwrjk", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-16T11:45:00Z") },
    { userId: "mklqz-pxvtr-hjnwg", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-16T15:30:00Z") },
    
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-09T08:30:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-09T10:15:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-10T14:30:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-11T09:45:00Z") },
    { userId: "tgxzp-vlmnq-bwkjr", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-12T13:20:00Z") },
    { userId: "pqvzm-dhktj-xlgfn", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-13T16:00:00Z") },
    { userId: "ztblx-mvnhd-qwrjk", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-14T11:30:00Z") },
    { userId: "mklqz-pxvtr-hjnwg", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-15T15:15:00Z") },
    
    { userId: "fhlqp-xrzkv-nwtmg", initiativeId: "blvzq-thxpn-mjkwr", createdAt: new Date("2025-08-10T08:15:00Z") },
    { userId: "qnzpk-rxvtm-hgjlw", initiativeId: "blvzq-thxpn-mjkwr", createdAt: new Date("2025-08-10T10:30:00Z") },
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "blvzq-thxpn-mjkwr", createdAt: new Date("2025-08-11T14:45:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "blvzq-thxpn-mjkwr", createdAt: new Date("2025-08-12T09:20:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "blvzq-thxpn-mjkwr", createdAt: new Date("2025-08-13T11:45:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "blvzq-thxpn-mjkwr", createdAt: new Date("2025-08-14T16:30:00Z") },
    { userId: "pqvzm-dhktj-xlgfn", initiativeId: "blvzq-thxpn-mjkwr", createdAt: new Date("2025-08-15T08:00:00Z") },
    { userId: "tgxzp-vlmnq-bwkjr", initiativeId: "blvzq-thxpn-mjkwr", createdAt: new Date("2025-08-16T13:15:00Z") },
    
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "zmvtx-jbqpr-wkghl", createdAt: new Date("2025-08-12T08:45:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "zmvtx-jbqpr-wkghl", createdAt: new Date("2025-08-12T11:30:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "zmvtx-jbqpr-wkghl", createdAt: new Date("2025-08-13T14:20:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "zmvtx-jbqpr-wkghl", createdAt: new Date("2025-08-14T09:15:00Z") },
    
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "nwxzq-jmktv-rbghl", createdAt: new Date("2025-08-10T09:15:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "nwxzq-jmktv-rbghl", createdAt: new Date("2025-08-10T11:30:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "nwxzq-jmktv-rbghl", createdAt: new Date("2025-08-11T15:45:00Z") },
    { userId: "fhlqp-xrzkv-nwtmg", initiativeId: "nwxzq-jmktv-rbghl", createdAt: new Date("2025-08-12T10:20:00Z") },
    
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "kmnxz-rlvtq-pwhjg", createdAt: new Date("2025-08-13T08:00:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "kmnxz-rlvtq-pwhjg", createdAt: new Date("2025-08-13T10:30:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "kmnxz-rlvtq-pwhjg", createdAt: new Date("2025-08-14T14:15:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "kmnxz-rlvtq-pwhjg", createdAt: new Date("2025-08-15T09:20:00Z") },
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "kmnxz-rlvtq-pwhjg", createdAt: new Date("2025-08-16T11:45:00Z") },
    { userId: "ztblx-mvnhd-qwrjk", initiativeId: "kmnxz-rlvtq-pwhjg", createdAt: new Date("2025-08-16T15:30:00Z") }
  ];

  const comments = [
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Excelente iniciativa de IA! Essa ferramenta vai revolucionar como analisamos dados na empresa. Posso contribuir com a arquitetura técnica?",
      createdAt: new Date("2025-07-27T09:30:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Podemos integrar com nossos sistemas existentes de BI? Seria incrível ter análises automatizadas em tempo real.",
      createdAt: new Date("2025-07-28T14:15:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Que tal incluir suporte para consultas em português? A democratização de dados seria ainda maior para nossa equipe.",
      createdAt: new Date("2025-07-29T10:45:00Z")
    },
    {
      userId: "xqfhm-pgktv-bzrws",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Projeto estratégico fundamental! Vamos priorizar este assistente de IA. Será um diferencial competitivo enorme.",
      createdAt: new Date("2025-08-01T16:20:00Z")
    },
    {
      userId: "wrqmz-hflpv-xkntg",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Posso ajudar com testes de usabilidade? É importante garantir que seja realmente intuitivo para não-técnicos.",
      createdAt: new Date("2025-08-03T11:30:00Z")
    },
    {
      userId: "tgxzp-vlmnq-bwkjr",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Vamos criar tutoriais visuais para onboarding dos usuários. A adoção será mais rápida com boa UX.",
      createdAt: new Date("2025-08-05T09:15:00Z")
    },
    {
      userId: "pqvzm-dhktj-xlgfn",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Importante incluir controles de governança de dados. Precisamos garantir acesso seguro às informações.",
      createdAt: new Date("2025-08-07T13:45:00Z")
    },
    {
      userId: "ztblx-mvnhd-qwrjk",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Essa IA vai potencializar muito nossas campanhas de marketing com insights mais profundos dos dados.",
      createdAt: new Date("2025-08-09T15:30:00Z")
    },
    {
      userId: "mklqz-pxvtr-hjnwg",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Perfeito para análises preditivas de vendas! Quando podemos começar a testar com dados reais?",
      createdAt: new Date("2025-08-11T08:20:00Z")
    },
    {
      userId: "fhlqp-xrzkv-nwtmg",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Vai facilitar muito nossas análises financeiras. Finalmente poderemos ter insights instantâneos!",
      createdAt: new Date("2025-08-13T14:00:00Z")
    },
    {
      userId: "qnzpk-rxvtm-hgjlw",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Sugiro integração com nossa ferramenta de documentação automática. Seria sinergia perfeita!",
      createdAt: new Date("2025-08-14T16:45:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Obrigada pelo apoio de todos! Vamos criar uma ferramenta que transforme como trabalhamos com dados! 🤖📊",
      createdAt: new Date("2025-08-15T10:30:00Z")
    },
    {
      userId: "bwknr-zxtvq-mgsjd",
      initiativeId: "hzvpk-nxqtr-wmglj",
      content: "Sistema de recomendação com deep learning é fantástico! Vai conectar pessoas e projetos de forma inteligente.",
      createdAt: new Date("2025-08-02T15:00:00Z")
    },
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "hzvpk-nxqtr-wmglj",
      content: "Posso contribuir com a infraestrutura de ML? Redes neurais precisam de arquitetura robusta para performance.",
      createdAt: new Date("2025-08-03T11:30:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "hzvpk-nxqtr-wmglj",
      content: "A explicabilidade das recomendações será crucial para confiança dos usuários. Ótima visão estratégica!",
      createdAt: new Date("2025-08-04T09:45:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "hzvpk-nxqtr-wmglj",
      content: "Que tal incluir recomendações de networking interno? Poderia conectar pessoas com interesses similares.",
      createdAt: new Date("2025-08-05T14:20:00Z")
    },
    {
      userId: "pqvzm-dhktj-xlgfn",
      initiativeId: "hzvpk-nxqtr-wmglj",
      content: "Perfeito para sugerir trilhas de desenvolvimento profissional personalizadas para cada colaborador.",
      createdAt: new Date("2025-08-06T13:30:00Z")
    },
    {
      userId: "mklqz-pxvtr-hjnwg",
      initiativeId: "hzvpk-nxqtr-wmglj",
      content: "Obrigado pelo feedback! Vamos criar um sistema que realmente conecte talentos e oportunidades de forma inteligente! 🚀",
      createdAt: new Date("2025-08-07T16:15:00Z")
    },
    {
      userId: "xqfhm-pgktv-bzrws",
      initiativeId: "rxpzm-vbktj-qwlgn",
      content: "Isabela, ferramenta de revisão automática com IA é genial! Vai padronizar e acelerar muito nossos processos.",
      createdAt: new Date("2025-08-15T14:30:00Z")
    },
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "rxpzm-vbktj-qwlgn",
      content: "Posso ajudar com a integração aos nossos sistemas de workflow? Seria ótimo ter revisão automática no pipeline.",
      createdAt: new Date("2025-08-16T10:45:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "rxpzm-vbktj-qwlgn",
      content: "A análise de sentimento e detecção de viés serão revolucionárias para qualidade das nossas propostas.",
      createdAt: new Date("2025-08-16T16:20:00Z")
    },
    {
      userId: "pqvzm-dhktj-xlgfn",
      initiativeId: "rxpzm-vbktj-qwlgn",
      content: "Excelente para padronizar comunicação interna! Vai melhorar muito a qualidade dos nossos documentos.",
      createdAt: new Date("2025-08-17T11:00:00Z")
    },
    {
      userId: "ztblx-mvnhd-qwrjk",
      initiativeId: "rxpzm-vbktj-qwlgn",
      content: "Isso vai facilitar muito a criação de materiais de marketing com maior impacto e clareza.",
      createdAt: new Date("2025-08-17T13:30:00Z")
    },
    {
      userId: "mklqz-pxvtr-hjnwg",
      initiativeId: "rxpzm-vbktj-qwlgn",
      content: "Perfeito para revisar propostas comerciais! Quando podemos começar os testes piloto?",
      createdAt: new Date("2025-08-17T15:45:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "rxpzm-vbktj-qwlgn",
      content: "Obrigada pelo entusiasmo! Vamos revolucionar a qualidade da nossa comunicação interna com IA! 📝✨",
      createdAt: new Date("2025-08-17T17:00:00Z")
    },
    {
      userId: "xqfhm-pgktv-bzrws",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "João, pipeline de anonimização é fundamental! Privacy by design será nosso diferencial competitivo.",
      createdAt: new Date("2025-08-17T14:20:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "Posso liderar a implementação das técnicas de differential privacy? Tenho experiência com preservação de privacidade.",
      createdAt: new Date("2025-08-16T16:15:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "Synthetic data generation será game-changer para nossos experimentos de ML! Quando começamos?",
      createdAt: new Date("2025-08-15T11:45:00Z")
    },
    {
      userId: "pqvzm-dhktj-xlgfn",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "Crucial para compliance com LGPD. Isso vai acelerar muito nossa capacidade de inovação responsável.",
      createdAt: new Date("2025-08-14T09:20:00Z")
    },
    {
      userId: "fhlqp-xrzkv-nwtmg",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "Excelente para reduzir riscos regulatórios! Investors vão valorizar muito essa iniciativa de privacy tech.",
      createdAt: new Date("2025-08-13T15:30:00Z")
    },
    {
      userId: "tgxzp-vlmnq-bwkjr",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "Vamos criar materiais educativos sobre privacidade para conscientizar toda a equipe sobre a importância.",
      createdAt: new Date("2025-08-12T12:00:00Z")
    },
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "Obrigado pelo support! Vamos construir o futuro da pesquisa ética com IA e privacy! 🔒🤖",
      createdAt: new Date("2025-08-11T10:30:00Z")
    }
  ];

  const initiativeUpdates = [
    {
      initiativeId: "zmvtx-jbqpr-wkghl",
      authorId: "pqvzm-dhktj-xlgfn",
      content: "Chatbot de onboarding iniciado! Primeiros protótipos de NLP em desenvolvimento.",
      isCompleted: false,
    },
    {
      initiativeId: "zmvtx-jbqpr-wkghl",
      authorId: "pqvzm-dhktj-xlgfn",
      content: "Integração com sistemas de RH concluída. Base de conhecimento sendo estruturada.",
      isCompleted: false,
    },
    {
      initiativeId: "zmvtx-jbqpr-wkghl",
      authorId: "pqvzm-dhktj-xlgfn",
      content: "Primeiros testes com colaboradores mostram 85% de satisfação. Refinando respostas.",
      isCompleted: false,
    },
    {
      initiativeId: "hzvpk-nxqtr-wmglj",
      authorId: "mklqz-pxvtr-hjnwg",
      content: "Modelo de deep learning treinado com dados internos. Primeiras recomendações muito precisas!",
      isCompleted: false,
    },
    {
      initiativeId: "hzvpk-nxqtr-wmglj",
      authorId: "mklqz-pxvtr-hjnwg",
      content: "Sistema de explicabilidade implementado. Usuários podem entender o 'porquê' das recomendações.",
      isCompleted: true,
    }
  ];

  for (const userData of users) {
    await prisma.user.create({
      data: userData
    });
  }

  for (const initiativeData of initiatives) {
    await prisma.initiative.create({
      data: initiativeData
    });
  }

  for (const likeData of likes) {
    await prisma.like.create({
      data: likeData
    });
  }

  for (const commentData of comments) {
    await prisma.comment.create({
      data: commentData
    });
  }

  for (const initiativeUpdateData of initiativeUpdates) {
    await prisma.initiativeUpdate.create({
      data: initiativeUpdateData
    });
  }

  console.log('🤖 Seed completed with AI-focused initiatives!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });