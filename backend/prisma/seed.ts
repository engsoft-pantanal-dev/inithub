import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.like.deleteMany();             // primeiro os likes
  await prisma.comment.deleteMany();          // depois os comentários
  await prisma.initiativeUpdate.deleteMany(); // depois os updates
  await prisma.initiative.deleteMany();       // agora as iniciativas
  await prisma.user.deleteMany();
  const salt = await bcrypt.genSalt();   
  const hashedPassword = await bcrypt.hash('umaSenhaPadrao123', salt);
  const users = [
    {
      id: "bwknr-zxtvq-mgsjd",
      email: "sofia.rodrigues@inithub.com",
      name: "Sofia Rodrigues",
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      password: hashedPassword,
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
      title: "Planejamento Estratégico 2026",
      description: "Desenvolver um plano estratégico abrangente da empresa para os próximos 3 anos com foco em inovação tecnológica, sustentabilidade ambiental e expansão de mercado. Este projeto envolverá análise SWOT detalhada, benchmarking competitivo, definição de OKRs estratégicos e criação de um roadmap de implementação com marcos trimestrais. Incluirá workshops com lideranças, pesquisa de mercado e modelagem de cenários para garantir que a empresa se posicione de forma competitiva no mercado em constante evolução.",
      theme: "Estratégia",
      context: "A empresa precisa se posicionar melhor no mercado altamente competitivo e definir direcionamentos claros para crescimento sustentável. Com as mudanças aceleradas no cenário de negócios pós-pandemia e a necessidade de adaptação às tendências de ESG, torna-se fundamental uma revisão estratégica completa que alinhe visão, missão e valores com as expectativas do mercado e stakeholders.",
      deliverable: "Documento estratégico completo de 50+ páginas, roadmap de implementação detalhado com cronograma, dashboard de indicadores de performance (KPIs), apresentação executiva e planos de comunicação interna",
      evaluationCriteria: "Aprovação unânime do board executivo, implementação bem-sucedida de pelo menos 80% das iniciativas estratégicas no primeiro ano, aumento measurável de market share e satisfação dos stakeholders acima de 85%",
      status: "PENDING" as const,
      author: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date("2025-08-10T10:00:00Z"),
      updatedAt: new Date("2025-08-17T10:00:00Z")
    },
    {
      id: "kqwxn-mrhzv-tlpjg",
      title: "Transformação Digital Corporativa",
      description: "Liderar uma transformação digital completa da empresa, implementando novas tecnologias disruptivas, automatizando processos críticos e criando uma cultura digital organizacional. O projeto abrangerá desde a migração para cloud computing, implementação de ferramentas de collaboration, até o desenvolvimento de competências digitais em todos os níveis hierárquicos. Incluirá análise de maturidade digital, seleção de tecnologias, gestão da mudança cultural e criação de centros de excelência digital.",
      theme: "Transformação Digital",
      context: "A empresa precisa urgentemente se modernizar para competir efetivamente no mercado digital atual, onde a velocidade de inovação e a experiência do cliente são diferenciais competitivos cruciais. O atraso tecnológico atual representa um risco significativo à sustentabilidade do negócio e à capacidade de atração e retenção de talentos digitais.",
      deliverable: "Plataforma digital integrada multi-departamental, automação completa de processos críticos, programa de treinamento digital para 100% dos funcionários, dashboard executivo de métricas digitais e documentação completa de novos processos",
      evaluationCriteria: "Redução comprovada de 60% no tempo de processos manuais, aumento de 40% na produtividade geral, NPS interno acima de 80% e ROI positivo em 18 meses",
      status: "APPROVED" as const,
      author: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
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
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date("2025-08-08T09:15:00Z"),
      updatedAt: new Date("2025-08-17T09:15:00Z")
    },
    {
      id: "zmvtx-jbqpr-wkghl",
      title: "Programa de Governança Corporativa",
      description: "Implementar uma estrutura robusta de governança corporativa moderna, transparente e alinhada às melhores práticas internacionais. O programa incluirá a criação de comitês especializados, definição de políticas de compliance, implementação de controles internos rigorosos, e estabelecimento de processos de auditoria contínua. Abrangerá também treinamento em ética empresarial, gestão de riscos integrada e relatórios de sustentabilidade seguindo padrões GRI.",
      theme: "Governança",
      context: "Investidores institucionais e stakeholders exigem cada vez mais transparência, accountability e controles internos robustos. A pressão regulatória crescente e a necessidade de acesso a mercados de capitais mais sofisticados tornam essencial uma governança corporativa exemplar que inspire confiança e reduza riscos operacionais e reputacionais.",
      deliverable: "Framework completo de governança corporativa, comitês executivos estruturados e funcionais, políticas e procedimentos documentados, sistema de compliance integrado e relatórios periódicos de governança",
      evaluationCriteria: "Obtenção de certificação internacional de governança corporativa, aprovação em auditoria externa rigorosa, compliance rate de 100% e feedback positivo de investidores acima de 90%",
      status: "IN_EXECUTION" as const,
      author: {
        connect: {
          id: "ndpkr-vxwql-jsmgt"
        }
      },
      assignedTo: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-08-14T16:00:00Z"),
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date("2025-08-11T11:20:00Z"),
      updatedAt: new Date("2025-08-17T11:20:00Z")
    },
    {
      id: "blvzq-thxpn-mjkwr",
      title: "Programa de Desenvolvimento de Liderança",
      description: "Criar um programa abrangente e estruturado para identificar, desenvolver e reter líderes excepcionais em todos os níveis organizacionais. O programa incluirá avaliação de potencial de liderança, trilhas de desenvolvimento personalizadas, mentoring executivo, coaching especializado e experiências de liderança prática. Contemplará também sucessão planejada, diversity & inclusion, e formação de uma cultura de liderança colaborativa e inovadora que inspire alta performance.",
      theme: "Liderança",
      context: "A empresa enfrenta um gap crítico de liderança qualificada para sustentar o crescimento acelerado planejado. Com a guerra por talentos intensificada e a necessidade de líderes que naveguem complexidade e incerteza, torna-se fundamental um investimento estruturado no desenvolvimento de capacidades de liderança que garantam continuidade e excelência operacional.",
      deliverable: "Programa estruturado de mentoring e coaching, workshops intensivos de liderança, sistema de avaliação 360 graus implementado, planos de carreira individualizados e academia interna de liderança",
      evaluationCriteria: "Aumento de 50% na satisfação com qualidade da liderança, redução de 30% no turnover de talentos-chave, promoção interna de 70% das posições de liderança e Net Promoter Score de liderança acima de 75",
      status: "APPROVED" as const,
      author: {
        connect: {
          id: "ztblx-mvnhd-qwrjk"
        }
      },
      assignedTo: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-08-15T13:45:00Z"),
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date("2025-08-09T08:30:00Z"),
      updatedAt: new Date("2025-08-17T08:30:00Z")
    },
    {
      id: "bxktn-rmvzq-phjlw",
      title: "Programa de Sustentabilidade Corporativa",
      description: "Implementar práticas sustentáveis abrangentes em todos os setores da empresa, criando uma cultura organizacional ambientalmente responsável e economicamente viável. O programa incluirá auditoria ambiental completa, implementação de tecnologias limpas, gestão inteligente de resíduos, eficiência energética, e engajamento de stakeholders em iniciativas de sustentabilidade. Contemplará também relatórios ESG detalhados e certificações ambientais internacionais.",
      theme: "Sustentabilidade",
      context: "A empresa precisa urgentemente reduzir seu impacto ambiental e se alinhar rigorosamente às crescentes expectativas e regulamentações ESG (Environmental, Social, Governance). Pressões de investidores, consumidores conscientes e reguladores tornam a sustentabilidade não apenas uma responsabilidade social, mas um imperativo de negócio para competitividade e acesso a mercados.",
      deliverable: "Manual abrangente de práticas sustentáveis, certificação ISO 14001 obtida, relatório anual de impacto ambiental, sistema de monitoramento contínuo de pegada de carbono e programa de educação ambiental para colaboradores",
      evaluationCriteria: "Redução comprovada de 25% no consumo energético, diminuição de 30% na geração de resíduos, obtenção de certificação ambiental internacional e reconhecimento público como empresa sustentável",
      status: "APPROVED" as const,
      author: {
        connect: {
          id: "bwknr-zxtvq-mgsjd"
        }
      },
      assignedTo: {
        connect: {
          id: "bwknr-zxtvq-mgsjd"
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
      title: "Campanha Digital Inovadora",
      description: "Criar uma campanha de marketing digital revolucionária utilizando tecnologias emergentes como Inteligência Artificial, Realidade Aumentada e personalização avançada. A campanha incluirá experiências imersivas para o cliente, automação inteligente de marketing, segmentação comportamental sofisticada e analytics preditivos. Contemplará também integração omnichannel completa e estratégias de growth hacking para maximizar reach e engagement.",
      theme: "Marketing Digital",
      context: "O mercado cada vez mais saturado e competitivo exige estratégias de marketing disruptivas e inovadoras para se destacar e capturar a atenção do público-alvo. As expectativas dos consumidores por experiências personalizadas e interativas tornam essencial a adoção de tecnologias avançadas para criar conexões emocionais duradouras com a marca.",
      deliverable: "Campanha completa com experiências em Realidade Aumentada, chatbot com IA conversacional avançada, dashboard interativo de métricas em tempo real, conteúdo personalizado por segmento e estratégia de distribuição multicanal",
      evaluationCriteria: "Aumento de 50% no engagement rate, crescimento de 35% em leads qualificados, ROI superior a 200% e alcance de pelo menos 1 milhão de impressões qualificadas",
      status: "IN_EXECUTION" as const,
      author: {
        connect: {
          id: "ztblx-mvnhd-qwrjk"
        }
      },
      assignedTo: {
        connect: {
          id: "ztblx-mvnhd-qwrjk"
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
      title: "Centro de Atendimento Omnichannel",
      description: "Unificar todos os canais de atendimento ao cliente em uma plataforma integrada e inteligente que proporcione experiência consistente e personalizada. O projeto incluirá implementação de chatbots com IA, integração de sistemas legados, analytics avançados de comportamento do cliente, e automação inteligente de processos de suporte. Contemplará também treinamento especializado da equipe e métricas de excelência em atendimento.",
      theme: "Atendimento ao Cliente",
      context: "Clientes demonstram frustração crescente com a falta de integração e consistência entre diferentes canais de atendimento, resultando em experiências fragmentadas e insatisfação. A necessidade de atendimento 24/7 e expectativas por resoluções rápidas e eficazes tornam essencial uma abordagem omnichannel sofisticada e tecnologicamente avançada.",
      deliverable: "Plataforma omnichannel totalmente integrada, chatbot inteligente com processamento de linguagem natural, sistema unificado de tickets e histórico, dashboard de analytics de atendimento e procedimentos otimizados de suporte",
      evaluationCriteria: "Redução de 50% no tempo médio de resposta, aumento de 35% na satisfação do cliente (NPS), resolução de 80% dos casos no primeiro contato e redução de 40% nos custos operacionais de atendimento",
      status: "PENDING" as const,
      author: {
        connect: {
          id: "vzxqr-bgtnh-mwkjp"
        }
      },
      likesCount: 11,
      commentsCount: 6,
      createdAt: new Date("2025-08-12T16:24:41.018Z"),
      updatedAt: new Date("2025-08-17T16:24:41.018Z")
    },
    {
      id: "nwxzq-jmktv-rbghl",
      title: "Programa de Bem-estar Integral",
      description: "Implementar um programa holístico de saúde física, mental e emocional para todos os funcionários, criando um ambiente de trabalho que promova qualidade de vida, produtividade e retenção de talentos. O programa incluirá aplicativo personalizado de bem-estar, sessões de mindfulness e meditação, programa de exercícios físicos, apoio psicológico profissional, e workshops de gestão de estresse e work-life balance.",
      theme: "Recursos Humanos",
      context: "O aumento alarmante do estresse ocupacional, casos de burnout e problemas de saúde mental entre colaboradores representa um risco significativo à produtividade e sustentabilidade organizacional. A guerra por talentos e a necessidade de criar um ambiente de trabalho atrativo e saudável tornam fundamental um investimento estruturado no bem-estar integral dos funcionários.",
      deliverable: "Aplicativo móvel personalizado de bem-estar, programa estruturado de exercícios físicos e mentais, sessões regulares de mindfulness e relaxamento, suporte psicológico acessível e workshops de desenvolvimento pessoal",
      evaluationCriteria: "Redução de 40% nas taxas de absenteísmo, aumento de 30% na satisfação geral dos funcionários, diminuição de 50% nos casos reportados de estresse ocupacional e melhoria de 25% nos indicadores de produtividade",
      status: "PENDING" as const,
      author: {
        connect: {
          id: "pqvzm-dhktj-xlgfn"
        }
      },
      likesCount: 12,
      commentsCount: 7,
      createdAt: new Date("2025-08-09T16:24:41.018Z"),
      updatedAt: new Date("2025-08-17T16:24:41.018Z")
    },
    {
      id: "pvwzq-ntmkr-xhgjl",
      title: "CRM Inteligente para Vendas",
      description: "Implementar um sistema CRM de nova geração com Inteligência Artificial para previsão precisa de vendas, automação inteligente de processos comerciais e personalização avançada do relacionamento com clientes. O sistema incluirá machine learning para scoring de leads, automação de follow-ups, integração com múltiplos canais de comunicação, analytics preditivos e dashboards executivos em tempo real para otimização contínua da performance comercial.",
      theme: "Vendas",
      context: "A equipe de vendas enfrenta desafios significativos no acompanhamento eficaz de leads e oportunidades, resultando em perda de negócios e baixa conversão. A necessidade de previsibilidade comercial e otimização do funil de vendas torna essencial um sistema inteligente que potencialize a produtividade da equipe e melhore a experiência do cliente durante o processo comercial.",
      deliverable: "Sistema CRM totalmente customizado com IA integrada, dashboards interativos e personalizáveis, integração nativa com WhatsApp, email marketing e telefonia, módulo de previsão de vendas e relatórios automatizados de performance",
      evaluationCriteria: "Aumento de 40% na taxa de conversão de leads qualificados, redução de 30% no ciclo médio de vendas, melhoria de 50% na precisão das previsões comerciais e aumento de 25% na produtividade individual dos vendedores",
      status: "APPROVED" as const,
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
      assignedAt: new Date("2025-08-05T16:24:41.018Z"),
      likesCount: 14,
      commentsCount: 5,
      createdAt: new Date("2025-08-02T16:24:41.018Z"),
      updatedAt: new Date("2025-08-17T16:24:41.018Z")
    },
    {
      id: "qmvzx-klrnp-twgjh",
      title: "Plataforma de Colaboração Interna",
      description: "Desenvolver uma plataforma web moderna e intuitiva para revolucionar a colaboração entre departamentos, eliminando silos organizacionais e promovendo trabalho integrado e eficiente. A plataforma incluirá ferramentas avançadas de comunicação, gestão de projetos com metodologias ágeis, compartilhamento seguro de arquivos, wikis de conhecimento, e analytics de colaboração para otimização contínua dos processos interdepartamentais.",
      theme: "Tecnologia",
      context: "Atualmente os departamentos utilizam ferramentas fragmentadas e incompatíveis, causando sérios problemas de comunicação, duplicação de esforços e perda de informações críticas. A falta de visibilidade entre áreas compromete a agilidade organizacional e a capacidade de resposta às demandas do mercado, tornando essencial uma solução integrada de colaboração.",
      deliverable: "Sistema web responsivo e mobile-first com chat empresarial integrado, sistema robusto de compartilhamento e versionamento de arquivos, módulo completo de gestão de projetos colaborativos e dashboard de métricas de produtividade interdepartamental",
      evaluationCriteria: "Aumento mensurável de 40% na colaboração efetiva entre departamentos, redução de 30% no tempo médio de execução de projetos interdisciplinares, diminuição de 50% na duplicação de atividades e satisfação dos usuários acima de 85%",
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
      assignedAt: new Date("2025-07-28T16:24:41.018Z"),
      likesCount: 15,
      commentsCount: 8,
      createdAt: new Date("2025-07-23T16:24:41.018Z"),
      updatedAt: new Date("2025-08-16T16:24:41.018Z")
    },
    {
      id: "qxtpn-zvmlr-wkhjg",
      title: "Laboratório de Inteligência Artificial",
      description: "Criar um laboratório interno de pesquisa e desenvolvimento em Inteligência Artificial para explorar aplicações inovadoras de IA nos processos de negócio, desenvolver soluções proprietárias e manter a empresa na vanguarda tecnológica. O laboratório incluirá infraestrutura computacional de alto desempenho, equipe especializada multidisciplinar, parcerias acadêmicas estratégicas e metodologia structured de experimentação e prototipagem rápida.",
      theme: "Inovação",
      context: "A empresa precisa urgentemente se posicionar como líder tecnológico e se manter competitiva investindo proativamente em tecnologias emergentes de Inteligência Artificial. O ritmo acelerado de inovação no mercado e a pressão competitiva tornam essencial uma capacidade interna de pesquisa e desenvolvimento que garanta vantagem tecnológica sustentável.",
      deliverable: "Laboratório completamente equipado com hardware especializado para IA, equipe técnica altamente qualificada e dedicada, infraestrutura cloud escalável, projetos piloto funcionais de IA aplicada ao negócio e documentação completa de metodologias de desenvolvimento",
      evaluationCriteria: "Desenvolvimento e implementação de pelo menos 3 soluções inovadoras de IA aplicadas diretamente ao negócio em 12 meses, geração de propriedade intelectual registrada e reconhecimento externo como empresa inovadora em IA",
      status: "PENDING" as const,
      author: {
        connect: {
          id: "kjvzn-qtbdx-prwhs"
        }
      },
      likesCount: 16,
      commentsCount: 8,
      createdAt: new Date("2025-08-14T16:24:41.018Z"),
      updatedAt: new Date("2025-08-17T16:24:41.018Z")
    },
    {
      id: "rlmvx-thkzq-pwnfj",
      title: "Hub de Inovação Colaborativa",
      description: "Criar um espaço físico e virtual inovador dedicado ao fomento da criatividade, experimentação e desenvolvimento de ideias disruptivas. O hub incluirá ambientes de co-criação, workshops de design thinking, hackathons internos, incubadora de projetos inovadores, e metodologias estruturadas de gestão da inovação. Contemplará também parcerias com startups, universidades e centros de pesquisa para acelerar o desenvolvimento de soluções inovadoras.",
      theme: "Inovação",
      context: "Funcionários demonstram grande potencial criativo e apresentam ideias valiosas, mas a empresa carece de estrutura adequada, processos sistematizados e ambiente propício para transformar essas ideias em soluções concretas e implementáveis. A necessidade de acelerar a inovação interna torna fundamental um espaço dedicado e metodologias estruturadas de desenvolvimento de ideias.",
      deliverable: "Espaço físico moderno e tecnologicamente equipado para inovação, plataforma digital integrada para gestão de ideias e projetos, metodologia proprietária de inovação implementada, programa de capacitação em criatividade e workshops regulares de co-criação",
      evaluationCriteria: "Aumento de 60% no número de ideias inovadoras submetidas pelos colaboradores, implementação bem-sucedida de pelo menos 20% das ideias aprovadas, geração mensurável de valor através das inovações implementadas e engajamento de 80% dos funcionários no processo de inovação",
      status: "PENDING" as const,
      author: {
        connect: {
          id: "kjvzn-qtbdx-prwhs"
        }
      },
      likesCount: 9,
      commentsCount: 4,
      createdAt: new Date("2025-08-07T16:24:41.018Z"),
      updatedAt: new Date("2025-08-16T16:24:41.018Z")
    },
    {
      id: "tklzx-pvnrm-qwhjg",
      title: "Sistema de Gestão Financeira Inteligente",
      description: "Desenvolver um sistema financeiro de nova geração com Inteligência Artificial para previsões econômicas precisas, análises financeiras avançadas e automação inteligente de processos contábeis. O sistema incluirá modelos de machine learning para análise de riscos, dashboards executivos interativos, automação de reconciliações bancárias, alertas inteligentes de anomalias e relatórios financeiros automatizados que suportem tomadas de decisão estratégicas mais ágeis e assertivas.",
      theme: "Financeiro",
      context: "As ferramentas financeiras atuais são inadequadas e não oferecem os insights preditivos e analytics avançados necessários para tomadas de decisão estratégicas em um ambiente de negócios cada vez mais volátil e complexo. A necessidade de agilidade financeira e previsibilidade torna essencial um sistema inteligente que potencialize a análise e o planejamento financeiro organizacional.",
      deliverable: "Dashboard financeiro interativo com visualizações avançadas, modelos de machine learning para previsões e análises, sistema de relatórios automatizados e personalizáveis, módulo de alertas inteligentes para anomalias financeiras e integração completa com sistemas ERP existentes",
      evaluationCriteria: "Melhoria de 35% na precisão das previsões financeiras, redução de 50% no tempo necessário para análises complexas, automação de 80% dos relatórios financeiros rotineiros e aumento da satisfação da liderança com informações financeiras para 90%",
      status: "PENDING" as const,
      author: {
        connect: {
          id: "fhlqp-xrzkv-nwtmg"
        }
      },
      likesCount: 7,
      commentsCount: 3,
      createdAt: new Date("2025-08-11T16:24:41.018Z"),
      updatedAt: new Date("2025-08-17T16:24:41.018Z")
    },
    {
      id: "wjzxq-mplvr-nkthg",
      title: "Otimização da Cadeia Logística",
      description: "Implementar Internet das Coisas (IoT) e análise avançada de dados para revolucionar e otimizar completamente o processo de entregas e gestão logística. O projeto incluirá sensores inteligentes em toda a cadeia, rastreamento em tempo real, algoritmos de machine learning para otimização dinâmica de rotas, previsão de demanda e automação de processos logísticos críticos para garantir eficiência máxima e satisfação do cliente.",
      theme: "Logística",
      context: "A empresa enfrenta problemas recorrentes de atrasos nas entregas e carece de visibilidade completa do processo logístico, resultando em insatisfação do cliente e custos operacionais elevados. A crescente expectativa por entregas rápidas e confiáveis torna essencial uma modernização tecnológica completa da cadeia logística para manter competitividade no mercado.",
      deliverable: "Rede completa de sensores IoT implementada, dashboard em tempo real de rastreamento logístico, algoritmos proprietários de otimização de rotas, sistema de previsão de demanda e plataforma integrada de gestão logística",
      evaluationCriteria: "Redução de 30% nos atrasos de entrega, diminuição de 20% nos custos totais de transporte, aumento de 40% na satisfação do cliente com entregas e melhoria de 25% na eficiência operacional logística",
      status: "REJECTED" as const,
      author: {
        connect: {
          id: "qnzpk-rxvtm-hgjlw"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-08-09T16:24:41.018Z"),
      likesCount: 5,
      commentsCount: 2,
      createdAt: new Date("2025-08-08T16:24:41.018Z"),
      updatedAt: new Date("2025-08-10T16:24:41.018Z")
    },
    {
      id: "xrmvq-klztp-nwgjh",
      title: "Otimização de Processos Operacionais",
      description: "Automatizar e otimizar completamente os processos manuais críticos da operação empresarial, eliminando gargalos, reduzindo erros humanos e maximizando eficiência operacional. O projeto incluirá mapeamento detalhado de processos atuais, implementação de automação robótica de processos (RPA), desenvolvimento de workflows inteligentes, sistema de monitoramento contínuo de performance e documentação completa de novos processos otimizados.",
      theme: "Operações",
      context: "Muitos processos operacionais fundamentais ainda são executados manualmente, causando erros frequentes, lentidão operacional e desperdício de recursos humanos valiosos. A necessidade de escalabilidade e eficiência operacional torna essencial uma modernização completa desses processos através de automação inteligente e otimização sistemática.",
      deliverable: "Fluxos de trabalho completamente automatizados, sistema robusto de monitoramento de performance operacional, documentação detalhada de todos os processos otimizados, treinamento completo das equipes e dashboards de acompanhamento em tempo real",
      evaluationCriteria: "Redução de 45% no tempo médio de execução dos processos críticos, diminuição de 80% na taxa de erros operacionais, aumento de 35% na produtividade geral das equipes e ROI positivo em 6 meses",
      status: "COMPLETED" as const,
      author: {
        connect: {
          id: "wrqmz-hflpv-xkntg"
        }
      },
      assignedTo: {
        connect: {
          id: "wrqmz-hflpv-xkntg"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-07-23T16:24:41.018Z"),
      likesCount: 28,
      commentsCount: 15,
      createdAt: new Date("2025-07-20T16:24:41.018Z"),
      updatedAt: new Date("2025-08-14T16:24:41.018Z")
    },
    {
      id: "zbqpk-xvtrn-mwhlj",
      title: "Redesign da Identidade Visual",
      description: "Modernizar completamente a identidade visual da empresa para refletir authenticamente os novos valores organizacionais, posicionamento estratégico e visão de futuro. O projeto incluirá pesquisa de mercado aprofundada, análise de percepção da marca, desenvolvimento de nova identidade visual contemporânea, criação de manual de marca abrangente, templates corporativos modernos e implementação consistente em todos os pontos de contato digitais e físicos da empresa.",
      theme: "Design",
      context: "A identidade visual atual da empresa está desalinhada e não reflete mais adequadamente os valores evoluídos, posicionamento estratégico atual e aspirações futuras da organização. A necessidade de uma imagem corporativa mais moderna, autêntica e impactante torna essencial uma reformulação completa que inspire confiança, credibilidade e conexão emocional com stakeholders.",
      deliverable: "Manual completo de identidade visual atualizada, biblioteca abrangente de templates corporativos modernos, aplicações criativas da nova marca em materiais digitais e físicos, guia detalhado de implementação e sistema de monitoramento de consistência da marca",
      evaluationCriteria: "Aumento mensurável de 25% no reconhecimento espontâneo da marca, feedback positivo superior a 90% em pesquisas de percepção, implementação consistente em 100% dos materiais corporativos e aumento da confiança dos stakeholders na marca",
      status: "COMPLETED" as const,
      author: {
        connect: {
          id: "tgxzp-vlmnq-bwkjr"
        }
      },
      assignedTo: {
        connect: {
          id: "tgxzp-vlmnq-bwkjr"
        }
      },
      assignedBy: {
        connect: {
          id: "xqfhm-pgktv-bzrws"
        }
      },
      assignedAt: new Date("2025-07-26T16:24:41.018Z"),
      likesCount: 31,
      commentsCount: 9,
      createdAt: new Date("2025-07-23T16:24:41.018Z"),
      updatedAt: new Date("2025-08-12T16:24:41.018Z")
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
    
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-24T08:00:00Z") },
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-24T09:30:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-24T11:15:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-24T14:45:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-25T08:20:00Z") },
    { userId: "pqvzm-dhktj-xlgfn", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-25T10:00:00Z") },
    { userId: "fhlqp-xrzkv-nwtmg", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-25T13:30:00Z") },
    { userId: "mklqz-pxvtr-hjnwg", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-26T09:15:00Z") },
    { userId: "qnzpk-rxvtm-hgjlw", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-26T11:45:00Z") },
    { userId: "ztblx-mvnhd-qwrjk", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-27T15:20:00Z") },
    { userId: "xqfhm-pgktv-bzrws", initiativeId: "zbqpk-xvtrn-mwhlj", createdAt: new Date("2025-07-28T08:30:00Z") },
    
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-07-21T08:15:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-07-21T10:30:00Z") },
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-07-22T09:00:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-07-22T14:20:00Z") },
    { userId: "tgxzp-vlmnq-bwkjr", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-07-23T11:45:00Z") },
    { userId: "pqvzm-dhktj-xlgfn", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-07-24T08:30:00Z") },
    { userId: "fhlqp-xrzkv-nwtmg", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-07-25T13:15:00Z") },
    { userId: "mklqz-pxvtr-hjnwg", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-07-26T16:00:00Z") },
    { userId: "ztblx-mvnhd-qwrjk", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-08-01T09:30:00Z") },
    { userId: "qnzpk-rxvtm-hgjlw", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-08-02T11:15:00Z") },
    { userId: "xqfhm-pgktv-bzrws", initiativeId: "xrmvq-klztp-nwgjh", createdAt: new Date("2025-08-05T14:45:00Z") },
    
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-07-31T08:30:00Z") },
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-01T10:15:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-01T14:30:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-02T09:45:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-03T11:20:00Z") },
    { userId: "tgxzp-vlmnq-bwkjr", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-04T15:00:00Z") },
    { userId: "pqvzm-dhktj-xlgfn", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-05T08:15:00Z") },
    { userId: "mklqz-pxvtr-hjnwg", initiativeId: "hzvpk-nxqtr-wmglj", createdAt: new Date("2025-08-06T13:30:00Z") },
    
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "qxtpn-zvmlr-wkhjg", createdAt: new Date("2025-08-15T08:00:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "qxtpn-zvmlr-wkhjg", createdAt: new Date("2025-08-15T10:30:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "qxtpn-zvmlr-wkhjg", createdAt: new Date("2025-08-15T14:15:00Z") },
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "qxtpn-zvmlr-wkhjg", createdAt: new Date("2025-08-16T09:20:00Z") },
    { userId: "ztblx-mvnhd-qwrjk", initiativeId: "qxtpn-zvmlr-wkhjg", createdAt: new Date("2025-08-16T11:45:00Z") },
    { userId: "mklqz-pxvtr-hjnwg", initiativeId: "qxtpn-zvmlr-wkhjg", createdAt: new Date("2025-08-16T15:30:00Z") },
    
    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "qmvzx-klrnp-twgjh", createdAt: new Date("2025-07-24T08:45:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "qmvzx-klrnp-twgjh", createdAt: new Date("2025-07-24T11:30:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "qmvzx-klrnp-twgjh", createdAt: new Date("2025-07-25T14:20:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "qmvzx-klrnp-twgjh", createdAt: new Date("2025-07-26T09:15:00Z") },

    { userId: "wrqmz-hflpv-xkntg", initiativeId: "tklzx-pvnrm-qwhjg", createdAt: new Date("2025-07-26T09:15:00Z") },

    { userId: "bwknr-zxtvq-mgsjd", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-09T08:30:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-09T10:15:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-10T14:30:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-11T09:45:00Z") },
    { userId: "tgxzp-vlmnq-bwkjr", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-12T13:20:00Z") },
    { userId: "pqvzm-dhktj-xlgfn", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-13T16:00:00Z") },
    { userId: "ztblx-mvnhd-qwrjk", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-14T11:30:00Z") },
    { userId: "mklqz-pxvtr-hjnwg", initiativeId: "kqwxn-mrhzv-tlpjg", createdAt: new Date("2025-08-15T15:15:00Z") },
    
    { userId: "fhlqp-xrzkv-nwtmg", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-11T08:15:00Z") },
    { userId: "qnzpk-rxvtm-hgjlw", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-11T10:30:00Z") },
    { userId: "ndpkr-vxwql-jsmgt", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-12T14:45:00Z") },
    { userId: "kjvzn-qtbdx-prwhs", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-13T09:20:00Z") },
    { userId: "vzxqr-bgtnh-mwkjp", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-14T11:45:00Z") },
    { userId: "wrqmz-hflpv-xkntg", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-15T16:30:00Z") },
    { userId: "pqvzm-dhktj-xlgfn", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-16T08:00:00Z") },
    { userId: "tgxzp-vlmnq-bwkjr", initiativeId: "rxpzm-vbktj-qwlgn", createdAt: new Date("2025-08-17T13:15:00Z") }
  ];

  const comments = [
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Excelente iniciativa! A sustentabilidade precisa ser prioridade máxima na nossa estratégia empresarial. Sugiro incluir também métricas de economia de água.",
      createdAt: new Date("2025-07-27T09:30:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Podemos integrar sensores IoT para monitoramento em tempo real do consumo energético? Isso daria dados mais precisos para o relatório.",
      createdAt: new Date("2025-07-28T14:15:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Que tal incluir um programa de conscientização para funcionários? A mudança cultural é fundamental para o sucesso do projeto.",
      createdAt: new Date("2025-07-29T10:45:00Z")
    },
    {
      userId: "xqfhm-pgktv-bzrws",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Muito bem estruturado, Sofia! Vamos agendar uma reunião para discutir o cronograma de implementação e orçamento necessário.",
      createdAt: new Date("2025-08-01T16:20:00Z")
    },
    {
      userId: "wrqmz-hflpv-xkntg",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Posso contribuir com a parte de gestão de resíduos recicláveis. Tenho experiência com implementação de processos de separação seletiva.",
      createdAt: new Date("2025-08-03T11:30:00Z")
    },
    {
      userId: "tgxzp-vlmnq-bwkjr",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Vamos criar materiais visuais para comunicar as práticas sustentáveis de forma clara e atrativa para todos os departamentos.",
      createdAt: new Date("2025-08-05T09:15:00Z")
    },
    {
      userId: "pqvzm-dhktj-xlgfn",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Importante incluir treinamento específico sobre sustentabilidade no onboarding de novos funcionários.",
      createdAt: new Date("2025-08-07T13:45:00Z")
    },
    {
      userId: "ztblx-mvnhd-qwrjk",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Podemos usar essa iniciativa em nossa comunicação externa? Seria um diferencial competitivo importante no marketing.",
      createdAt: new Date("2025-08-09T15:30:00Z")
    },
    {
      userId: "mklqz-pxvtr-hjnwg",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Excelente! Sugiro criar indicadores de ROI ambiental para apresentar aos investidores e stakeholders.",
      createdAt: new Date("2025-08-11T08:20:00Z")
    },
    {
      userId: "fhlqp-xrzkv-nwtmg",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Muito alinhado com as tendências ESG que os investidores estão exigindo. Isso vai fortalecer nossa governança corporativa.",
      createdAt: new Date("2025-08-13T14:00:00Z")
    },
    {
      userId: "qnzpk-rxvtm-hgjlw",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Sugiro parcerias com ONGs ambientais locais para amplificar o impacto e gerar maior visibilidade positiva.",
      createdAt: new Date("2025-08-14T16:45:00Z")
    },
    {
      userId: "bwknr-zxtvq-mgsjd",
      initiativeId: "bxktn-rmvzq-phjlw",
      content: "Obrigada pelo apoio de todos! Vamos conseguir transformar nossa empresa em referência de sustentabilidade no mercado. 🌱",
      createdAt: new Date("2025-08-15T10:30:00Z")
    },
    {
      userId: "xqfhm-pgktv-bzrws",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Rafael, projeto excepcional! Os resultados superaram todas as expectativas. Parabéns pela execução impecável.",
      createdAt: new Date("2025-08-14T15:00:00Z")
    },
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "A automação implementada é impressionante. Reduziu drasticamente o tempo que gastávamos com tarefas manuais.",
      createdAt: new Date("2025-08-13T11:30:00Z")
    },
    {
      userId: "bwknr-zxtvq-mgsjd",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Os dashboards de monitoramento são fantásticos! Agora temos visibilidade total dos nossos processos.",
      createdAt: new Date("2025-08-12T09:45:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Que tal implementar essa metodologia em outros departamentos? Os resultados foram extraordinários.",
      createdAt: new Date("2025-08-10T14:20:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "A documentação ficou perfeita. Muito fácil para novos funcionários entenderem os processos otimizados.",
      createdAt: new Date("2025-08-08T16:15:00Z")
    },
    {
      userId: "tgxzp-vlmnq-bwkjr",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Impressionante como a taxa de erros praticamente zerou! Isso vai impactar muito a qualidade do nosso trabalho.",
      createdAt: new Date("2025-08-06T13:30:00Z")
    },
    {
      userId: "pqvzm-dhktj-xlgfn",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "O treinamento das equipes foi muito bem estruturado. Todos se adaptaram rapidamente às mudanças.",
      createdAt: new Date("2025-08-04T10:45:00Z")
    },
    {
      userId: "ztblx-mvnhd-qwrjk",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Com essa otimização, conseguimos focar mais em estratégia e menos em tarefas operacionais repetitivas.",
      createdAt: new Date("2025-08-02T12:00:00Z")
    },
    {
      userId: "mklqz-pxvtr-hjnwg",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "O ROI de 6 meses foi alcançado! Agora podemos investir a economia em novas iniciativas de crescimento.",
      createdAt: new Date("2025-07-31T08:30:00Z")
    },
    {
      userId: "fhlqp-xrzkv-nwtmg",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Excelente trabalho! Esse tipo de eficiência operacional fortalece toda nossa estrutura organizacional.",
      createdAt: new Date("2025-07-29T15:15:00Z")
    },
    {
      userId: "qnzpk-rxvtm-hgjlw",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "A metodologia pode ser replicada para outras áreas? Gostaria de aplicar na governança corporativa também.",
      createdAt: new Date("2025-07-27T11:20:00Z")
    },
    {
      userId: "wrqmz-hflpv-xkntg",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Muito obrigado pelo reconhecimento! Foi um prazer liderar este projeto transformador. Já estou pensando nas próximas otimizações.",
      createdAt: new Date("2025-07-25T14:45:00Z")
    },
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Rafael, você poderia apresentar os resultados para a diretoria? Seria inspirador para outros projetos.",
      createdAt: new Date("2025-07-23T09:30:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Esse projeto deveria ser case de sucesso interno. Parabéns pela visão e execução estratégica!",
      createdAt: new Date("2025-07-21T16:00:00Z")
    },
    {
      userId: "bwknr-zxtvq-mgsjd",
      initiativeId: "xrmvq-klztp-nwgjh",
      content: "Trabalho inspirador! Mostra como a inovação em processos pode gerar resultados extraordinários.",
      createdAt: new Date("2025-07-20T13:15:00Z")
    },
    {
      userId: "xqfhm-pgktv-bzrws",
      initiativeId: "zbqpk-xvtrn-mwhlj",
      content: "Camila, o resultado final ficou excepcional! A nova identidade realmente reflete nossos valores atuais.",
      createdAt: new Date("2025-08-12T14:30:00Z")
    },
    {
      userId: "ztblx-mvnhd-qwrjk",
      initiativeId: "zbqpk-xvtrn-mwhlj",
      content: "A nova marca está sendo muito bem recebida pelos clientes. Parabéns pela criatividade e execução!",
      createdAt: new Date("2025-08-10T16:45:00Z")
    },
    {
      userId: "mklqz-pxvtr-hjnwg",
      initiativeId: "zbqpk-xvtrn-mwhlj",
      content: "Os templates corporativos estão facilitando muito nosso trabalho de marketing. Design moderno e funcional.",
      createdAt: new Date("2025-08-08T11:20:00Z")
    },
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "zbqpk-xvtrn-mwhlj",
      content: "O manual de marca ficou muito completo e claro. Facilita a implementação consistente em todos os materiais.",
      createdAt: new Date("2025-08-05T09:15:00Z")
    },
    {
      userId: "pqvzm-dhktj-xlgfn",
      initiativeId: "zbqpk-xvtrn-mwhlj",
      content: "A nova identidade está gerando muito engajamento interno. Os funcionários se sentem mais orgulhosos da empresa.",
      createdAt: new Date("2025-08-02T13:30:00Z")
    },
    {
      userId: "bwknr-zxtvq-mgsjd",
      initiativeId: "zbqpk-xvtrn-mwhlj",
      content: "Design sustentável e moderno! Combina perfeitamente com nossos valores ambientais e de inovação.",
      createdAt: new Date("2025-07-30T15:45:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "zbqpk-xvtrn-mwhlj",
      content: "A identidade tecnológica ficou muito bem representada. Transmite inovação e confiabilidade.",
      createdAt: new Date("2025-07-27T10:00:00Z")
    },
    {
      userId: "wrqmz-hflpv-xkntg",
      initiativeId: "zbqpk-xvtrn-mwhlj",
      content: "Excelente trabalho, Camila! A nova marca está muito mais alinhada com nossa cultura organizacional.",
      createdAt: new Date("2025-07-25T12:15:00Z")
    },
    {
      userId: "tgxzp-vlmnq-bwkjr",
      initiativeId: "zbqpk-xvtrn-mwhlj",
      content: "Obrigada a todos pelo apoio! Foi um projeto desafiador mas muito gratificante. A nova marca representa nossa evolução! 🎨",
      createdAt: new Date("2025-07-24T08:30:00Z")
    },
    {
      userId: "xqfhm-pgktv-bzrws",
      initiativeId: "qmvzx-klrnp-twgjh",
      content: "João, o progresso está excelente! A plataforma vai revolucionar nossa colaboração interna. Quando teremos o beta?",
      createdAt: new Date("2025-08-16T15:30:00Z")
    },
    {
      userId: "bwknr-zxtvq-mgsjd",
      initiativeId: "qmvzx-klrnp-twgjh",
      content: "Mal posso esperar para usar! Vai facilitar muito a integração entre sustentabilidade e outros departamentos.",
      createdAt: new Date("2025-08-14T10:45:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "qmvzx-klrnp-twgjh",
      content: "Posso ajudar com testes de segurança e performance? Tenho experiência com plataformas web escaláveis.",
      createdAt: new Date("2025-08-12T13:20:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "qmvzx-klrnp-twgjh",
      content: "Seria ótimo incluir integração com ferramentas de videoconferência. Facilitaria reuniões remotas.",
      createdAt: new Date("2025-08-09T16:00:00Z")
    },
    {
      userId: "tgxzp-vlmnq-bwkjr",
      initiativeId: "qmvzx-klrnp-twgjh",
      content: "O design da interface pode seguir nossa nova identidade visual? Seria uma aplicação perfeita da marca.",
      createdAt: new Date("2025-08-06T11:15:00Z")
    },
    {
      userId: "pqvzm-dhktj-xlgfn",
      initiativeId: "qmvzx-klrnp-twgjh",
      content: "Importante incluir controles de acesso e permissões para diferentes níveis hierárquicos.",
      createdAt: new Date("2025-08-03T14:30:00Z")
    },
    {
      userId: "wrqmz-hflpv-xkntg",
      initiativeId: "qmvzx-klrnp-twgjh",
      content: "Excelente iniciativa! Vai eliminar os silos que ainda existem entre algumas áreas.",
      createdAt: new Date("2025-07-31T09:45:00Z")
    },
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "qmvzx-klrnp-twgjh",
      content: "Obrigado pelas sugestões! Estou incorporando todas no desenvolvimento. Logo teremos uma versão para testes internos.",
      createdAt: new Date("2025-07-28T12:00:00Z")
    },
    {
      userId: "ndpkr-vxwql-jsmgt",
      initiativeId: "qxtpn-zvmlr-wkhjg",
      content: "Isabela, ideia brilhante! Posso contribuir com a arquitetura de infraestrutura cloud para o laboratório?",
      createdAt: new Date("2025-08-15T09:30:00Z")
    },
    {
      userId: "xqfhm-pgktv-bzrws",
      initiativeId: "qxtpn-zvmlr-wkhjg",
      content: "Projeto estratégico fundamental! Vamos discutir orçamento e cronograma. A IA será nosso diferencial competitivo.",
      createdAt: new Date("2025-08-15T14:15:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "qxtpn-zvmlr-wkhjg",
      content: "Podemos focar em IA aplicada ao atendimento ao cliente também? Seria uma excelente aplicação prática.",
      createdAt: new Date("2025-08-16T11:45:00Z")
    },
    {
      userId: "bwknr-zxtvq-mgsjd",
      initiativeId: "qxtpn-zvmlr-wkhjg",
      content: "IA para otimização de processos sustentáveis seria incrível! Poderíamos prever e reduzir desperdícios.",
      createdAt: new Date("2025-08-16T16:20:00Z")
    },
    {
      userId: "ztblx-mvnhd-qwrjk",
      initiativeId: "qxtpn-zvmlr-wkhjg",
      content: "Marketing preditivo com IA seria revolucionário para nossas campanhas. Apoio total a esta iniciativa!",
      createdAt: new Date("2025-08-17T08:00:00Z")
    },
    {
      userId: "mklqz-pxvtr-hjnwg",
      initiativeId: "qxtpn-zvmlr-wkhjg",
      content: "IA para análise de dados de vendas e previsão de demanda seria fantástico para nossa estratégia comercial.",
      createdAt: new Date("2025-08-17T13:30:00Z")
    },
    {
      userId: "wrqmz-hflpv-xkntg",
      initiativeId: "qxtpn-zvmlr-wkhjg",
      content: "Podemos aplicar IA na otimização de processos operacionais também. As possibilidades são infinitas!",
      createdAt: new Date("2025-08-17T15:45:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "qxtpn-zvmlr-wkhjg",
      content: "Obrigada pelo entusiasmo de todos! Vamos criar algo revolucionário que posicione nossa empresa na vanguarda tecnológica. 🚀",
      createdAt: new Date("2025-08-17T17:00:00Z")
    },
    {
      userId: "xqfhm-pgktv-bzrws",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "João, excelente progresso! A transformação digital é nossa prioridade máxima. Como posso apoiar ainda mais?",
      createdAt: new Date("2025-08-17T14:20:00Z")
    },
    {
      userId: "bwknr-zxtvq-mgsjd",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "A migração para cloud vai facilitar muito nossa gestão de dados ambientais. Quando começamos os testes?",
      createdAt: new Date("2025-08-16T10:30:00Z")
    },
    {
      userId: "kjvzn-qtbdx-prwhs",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "Posso liderar a parte de segurança digital? É fundamental garantir proteção total dos dados na transformação.",
      createdAt: new Date("2025-08-15T16:15:00Z")
    },
    {
      userId: "vzxqr-bgtnh-mwkjp",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "O treinamento digital será crucial. Sugiro começar com os líderes de cada departamento primeiro.",
      createdAt: new Date("2025-08-14T11:45:00Z")
    },
    {
      userId: "pqvzm-dhktj-xlgfn",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "Importante incluir gestão da mudança cultural. A transformação digital vai além da tecnologia.",
      createdAt: new Date("2025-08-13T09:20:00Z")
    },
    {
      userId: "tgxzp-vlmnq-bwkjr",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "Vamos criar materiais visuais para comunicar as mudanças de forma clara e motivadora para todos.",
      createdAt: new Date("2025-08-12T15:30:00Z")
    },
    {
      userId: "wrqmz-hflpv-xkntg",
      initiativeId: "kqwxn-mrhzv-tlpjg",
      content: "A automação vai liberar muito tempo para atividades mais estratégicas. Estou ansioso pelos resultados!",
      createdAt: new Date("2025-08-11T12:00:00Z")
    }
  ];

  const initiativeUpdates = [
    {
      initiativeId: "zmvtx-jbqpr-wkghl",
      authorId: "xqfhm-pgktv-bzrws",
      content: "Iniciativa iniciada, análise do projeto em andamento.",
      isCompleted: false,
    },
    {
      initiativeId: "zmvtx-jbqpr-wkghl",
      authorId: "xqfhm-pgktv-bzrws",
      content: "Primeiras entregas realizadas, equipe no prazo.",
      isCompleted: false,
    },
    {
      initiativeId: "zmvtx-jbqpr-wkghl",
      authorId: "xqfhm-pgktv-bzrws",
      content: "Iniciativa concluída com sucesso! Todos os objetivos atingidos.",
      isCompleted: true,
    },
    {
      initiativeId: "hzvpk-nxqtr-wmglj",
      authorId: "ztblx-mvnhd-qwrjk",
      content: "Testes finais e ajustes de última hora antes da entrega.",
      isCompleted: false,
    },
    {
      initiativeId: "hzvpk-nxqtr-wmglj",
      authorId: "ztblx-mvnhd-qwrjk",
      content: "Iniciativa concluída. Relatório final enviado.",
      isCompleted: true,
    }
  ]

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
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
