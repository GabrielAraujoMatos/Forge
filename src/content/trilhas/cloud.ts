import type { Trilha } from "@/lib/types";

const cloud: Trilha = {
  slug: "cloud",
  titulo: "Cloud",
  descricao:
    "Computação em nuvem do zero à arquitetura: identidade, redes virtuais, serviços gerenciados, IaC e custos, com AWS e Azure lado a lado.",
  icone: "cloud",
  topicos: [
    // ── Básico ──────────────────────────────────────────────
    {
      id: "conceitos",
      titulo: "O que é computação em nuvem",
      nivel: "basico",
      resumo:
        "Entenda o que muda quando a infraestrutura vira serviço: elasticidade, pagamento por uso e os modelos de implantação.",
      estudar: [
        "As cinco características essenciais (NIST)",
        "Nuvem pública, privada e híbrida",
        "CapEx x OpEx",
        "Elasticidade x escalabilidade",
      ],
      requisitos: [],
      recursos: [
        {
          titulo: "O que é computação em nuvem? (AWS)",
          url: "https://aws.amazon.com/pt/what-is-cloud-computing/",
          tipo: "artigo",
        },
        {
          titulo: "Definição de nuvem do NIST (SP 800-145)",
          url: "https://csrc.nist.gov/pubs/sp/800/145/final",
          tipo: "artigo",
        },
      ],
    },
    {
      id: "modelos-servico",
      titulo: "IaaS, PaaS, SaaS e responsabilidade compartilhada",
      nivel: "basico",
      resumo:
        "Quem cuida do quê? Veja onde termina a responsabilidade do provedor e começa a sua em cada modelo de serviço.",
      estudar: [
        "IaaS, PaaS, SaaS e serverless",
        "Modelo de responsabilidade compartilhada",
        "Exemplos de cada modelo nos provedores",
        "Quando escolher cada um",
      ],
      requisitos: ["conceitos"],
      recursos: [
        {
          titulo: "Modelo de responsabilidade compartilhada (AWS)",
          url: "https://aws.amazon.com/pt/compliance/shared-responsibility-model/",
          tipo: "doc",
        },
        {
          titulo: "Responsabilidade compartilhada na nuvem (Azure)",
          url: "https://learn.microsoft.com/pt-br/azure/security/fundamentals/shared-responsibility",
          tipo: "doc",
        },
      ],
    },
    {
      id: "infraestrutura-global",
      titulo: "Regiões, zonas e provedores",
      nivel: "basico",
      resumo:
        "AWS, Azure e Google Cloud: como os provedores organizam datacenters em regiões e zonas de disponibilidade, e por que isso importa.",
      estudar: [
        "Regiões e zonas de disponibilidade",
        "Pontos de presença (edge)",
        "Latência, soberania de dados e LGPD",
        "Comparação de serviços entre provedores",
      ],
      requisitos: ["conceitos"],
      recursos: [
        {
          titulo: "Infraestrutura global da AWS",
          url: "https://aws.amazon.com/pt/about-aws/global-infrastructure/",
          tipo: "doc",
        },
        {
          titulo: "Regiões e zonas do Azure",
          url: "https://learn.microsoft.com/pt-br/azure/reliability/availability-zones-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "console-cli",
      titulo: "Conta, console e CLI",
      nivel: "basico",
      resumo:
        "Crie sua conta com segurança, conheça o console web e passe a trabalhar pela linha de comando, que é como se automatiza.",
      estudar: [
        "Proteger a conta raiz com MFA",
        "Navegar pelo console",
        "AWS CLI e Azure CLI",
        "Cloud Shell no navegador",
      ],
      requisitos: ["infraestrutura-global"],
      recursos: [
        {
          titulo: "Guia do usuário da AWS CLI",
          url: "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html",
          tipo: "doc",
        },
        {
          titulo: "Introdução à Azure CLI",
          url: "https://learn.microsoft.com/pt-br/cli/azure/get-started-with-azure-cli",
          tipo: "doc",
        },
      ],
    },
    {
      id: "iam",
      titulo: "Identidade e acesso (IAM)",
      nivel: "basico",
      resumo:
        "Na nuvem, identidade é o novo perímetro. Aprenda usuários, grupos, funções e como dar só o acesso necessário.",
      estudar: [
        "Usuários, grupos e funções (roles)",
        "Políticas e permissões",
        "MFA e chaves de acesso",
        "RBAC do Azure",
      ],
      requisitos: ["console-cli"],
      recursos: [
        {
          titulo: "O que é o IAM? (AWS)",
          url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
          tipo: "doc",
        },
        {
          titulo: "O que é o RBAC do Azure?",
          url: "https://learn.microsoft.com/pt-br/azure/role-based-access-control/overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "computacao",
      titulo: "Máquinas virtuais na nuvem",
      nivel: "basico",
      resumo:
        "Suba sua primeira instância: tipos e tamanhos, imagens, chaves SSH e o ciclo de vida de uma VM na nuvem.",
      estudar: [
        "EC2 e Azure Virtual Machines",
        "Tipos de instância e famílias",
        "Imagens (AMI) e pares de chaves",
        "Sob demanda, reservada e spot",
      ],
      requisitos: ["console-cli", "modelos-servico"],
      recursos: [
        {
          titulo: "Introdução ao Amazon EC2",
          url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html",
          tipo: "doc",
        },
        {
          titulo: "Máquinas virtuais no Azure",
          url: "https://learn.microsoft.com/pt-br/azure/virtual-machines/overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "armazenamento",
      titulo: "Armazenamento de objetos, blocos e arquivos",
      nivel: "basico",
      resumo:
        "S3, Blob Storage e discos: entenda os tipos de armazenamento, as classes de custo e como não deixar dados públicos por engano.",
      estudar: [
        "Objetos x blocos x arquivos",
        "Amazon S3 e Azure Blob Storage",
        "Classes de armazenamento e ciclo de vida",
        "Bloqueio de acesso público",
      ],
      requisitos: ["iam"],
      recursos: [
        {
          titulo: "O que é o Amazon S3?",
          url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
          tipo: "doc",
        },
        {
          titulo: "Introdução ao Armazenamento do Azure",
          url: "https://learn.microsoft.com/pt-br/azure/storage/common/storage-introduction",
          tipo: "doc",
        },
      ],
    },
    {
      id: "custos",
      titulo: "Preços, nível gratuito e orçamentos",
      nivel: "basico",
      resumo:
        "Evite a fatura surpresa: como os serviços são cobrados, o que entra no nível gratuito e como criar alertas de orçamento.",
      estudar: [
        "Modelos de cobrança por serviço",
        "Free tier e créditos",
        "Calculadoras de preço",
        "Orçamentos e alertas de gasto",
      ],
      requisitos: ["console-cli"],
      recursos: [
        { titulo: "Nível gratuito da AWS", url: "https://aws.amazon.com/pt/free/", tipo: "pratica" },
        { titulo: "AWS Pricing Calculator", url: "https://calculator.aws/", tipo: "pratica" },
        {
          titulo: "Calculadora de preços do Azure",
          url: "https://azure.microsoft.com/pt-br/pricing/calculator/",
          tipo: "pratica",
        },
      ],
    },

    // ── Intermediário ───────────────────────────────────────
    {
      id: "redes-virtuais",
      titulo: "Redes virtuais: VPC e VNet",
      nivel: "intermediario",
      resumo:
        "Desenhe a rede da sua nuvem: blocos CIDR, sub-redes públicas e privadas, tabelas de rotas e saída para a internet.",
      estudar: [
        "VPC (AWS) e VNet (Azure)",
        "Sub-redes públicas x privadas",
        "Internet Gateway e NAT Gateway",
        "Peering entre redes",
      ],
      requisitos: ["computacao"],
      recursos: [
        {
          titulo: "Como a Amazon VPC funciona",
          url: "https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html",
          tipo: "doc",
        },
        {
          titulo: "O que é a Rede Virtual do Azure?",
          url: "https://learn.microsoft.com/pt-br/azure/virtual-network/virtual-networks-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "seguranca-rede",
      titulo: "Security Groups e NSGs",
      nivel: "intermediario",
      resumo:
        "Os firewalls da nuvem: regras com e sem estado, a diferença entre security groups e ACLs e como expor só o necessário.",
      estudar: [
        "Security Groups (com estado)",
        "Network ACLs (sem estado)",
        "Network Security Groups do Azure",
        "Bastion em vez de SSH aberto",
      ],
      requisitos: ["redes-virtuais"],
      recursos: [
        {
          titulo: "Security groups da VPC",
          url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html",
          tipo: "doc",
        },
        {
          titulo: "Grupos de segurança de rede do Azure",
          url: "https://learn.microsoft.com/pt-br/azure/virtual-network/network-security-groups-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "iam-avancado",
      titulo: "Políticas, roles e menor privilégio",
      nivel: "intermediario",
      resumo:
        "Escreva políticas de verdade, use funções em vez de chaves fixas e audite quem pode fazer o quê na sua conta.",
      estudar: [
        "Estrutura de uma política JSON",
        "Roles para serviços e AssumeRole",
        "Identidades gerenciadas do Azure",
        "IAM Access Analyzer",
      ],
      requisitos: ["iam"],
      recursos: [
        {
          titulo: "Práticas recomendadas do IAM",
          url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
          tipo: "doc",
        },
        {
          titulo: "Identidades gerenciadas do Azure",
          url: "https://learn.microsoft.com/pt-br/entra/identity/managed-identities-azure-resources/overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "bancos-gerenciados",
      titulo: "Bancos de dados gerenciados",
      nivel: "intermediario",
      resumo:
        "Deixe o provedor cuidar de backup, patches e réplicas: bancos relacionais e NoSQL como serviço.",
      estudar: [
        "Amazon RDS e Azure SQL Database",
        "Multi-AZ e réplicas de leitura",
        "Backups automáticos e point-in-time",
        "NoSQL: DynamoDB e Cosmos DB",
      ],
      requisitos: ["redes-virtuais"],
      recursos: [
        {
          titulo: "O que é o Amazon RDS?",
          url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html",
          tipo: "doc",
        },
        {
          titulo: "Banco de Dados SQL do Azure",
          url: "https://learn.microsoft.com/pt-br/azure/azure-sql/database/sql-database-paas-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "balanceamento",
      titulo: "Balanceadores de carga",
      nivel: "intermediario",
      resumo:
        "Distribua o tráfego entre várias instâncias com verificação de saúde, e escolha entre balanceadores de camada 4 e 7.",
      estudar: [
        "Application x Network Load Balancer",
        "Azure Load Balancer x Application Gateway",
        "Health checks e target groups",
        "Terminação TLS no balanceador",
      ],
      requisitos: ["redes-virtuais"],
      recursos: [
        {
          titulo: "Elastic Load Balancing",
          url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html",
          tipo: "doc",
        },
        {
          titulo: "Opções de balanceamento de carga do Azure",
          url: "https://learn.microsoft.com/pt-br/azure/architecture/guide/technology-choices/load-balancing-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "auto-escala",
      titulo: "Escalabilidade automática",
      nivel: "intermediario",
      resumo:
        "Cresça na alta e encolha na baixa sem intervenção: grupos de auto scaling, métricas de gatilho e imagens prontas.",
      estudar: [
        "Auto Scaling Groups e Scale Sets",
        "Políticas por métrica e agendadas",
        "Templates de lançamento",
        "Aplicações sem estado",
      ],
      requisitos: ["balanceamento"],
      recursos: [
        {
          titulo: "O que é o Amazon EC2 Auto Scaling?",
          url: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html",
          tipo: "doc",
        },
        {
          titulo: "Conjuntos de dimensionamento de VMs",
          url: "https://learn.microsoft.com/pt-br/azure/virtual-machine-scale-sets/overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "dns-cdn",
      titulo: "DNS gerenciado e CDN",
      nivel: "intermediario",
      resumo:
        "Leve o conteúdo para perto do usuário: DNS gerenciado com políticas de roteamento e CDN com cache na borda.",
      estudar: [
        "Route 53 e Azure DNS",
        "Políticas: latência, failover, geolocalização",
        "CloudFront e Azure Front Door",
        "Cache, TTL e invalidação",
      ],
      requisitos: ["armazenamento", "balanceamento"],
      recursos: [
        {
          titulo: "O que é o Amazon Route 53?",
          url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html",
          tipo: "doc",
        },
        {
          titulo: "O que é o Amazon CloudFront?",
          url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
          tipo: "doc",
        },
      ],
    },
    {
      id: "monitoramento",
      titulo: "Monitoramento e logs",
      nivel: "intermediario",
      resumo:
        "Saiba o que está acontecendo: métricas, logs, alarmes e a trilha de auditoria de tudo o que foi feito na conta.",
      estudar: [
        "CloudWatch e Azure Monitor",
        "Métricas, logs e alarmes",
        "CloudTrail e Log de Atividades",
        "Painéis e retenção de logs",
      ],
      requisitos: ["computacao"],
      recursos: [
        {
          titulo: "O que é o Amazon CloudWatch?",
          url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
          tipo: "doc",
        },
        {
          titulo: "Visão geral do Azure Monitor",
          url: "https://learn.microsoft.com/pt-br/azure/azure-monitor/overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "alta-disponibilidade",
      titulo: "Alta disponibilidade e recuperação de desastre",
      nivel: "intermediario",
      resumo:
        "Projete para a falha: múltiplas zonas, backups entre regiões e estratégias de DR com RTO e RPO definidos.",
      estudar: [
        "RTO e RPO",
        "Multi-AZ x multirregião",
        "Estratégias: backup, pilot light, warm standby",
        "AWS Backup e Azure Backup",
      ],
      requisitos: ["bancos-gerenciados", "auto-escala"],
      recursos: [
        {
          titulo: "Recuperação de desastres na AWS",
          url: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
          tipo: "artigo",
        },
        {
          titulo: "Visão geral do Azure Backup",
          url: "https://learn.microsoft.com/pt-br/azure/backup/backup-overview",
          tipo: "doc",
        },
      ],
    },

    // ── Avançado ────────────────────────────────────────────
    {
      id: "iac",
      titulo: "Infraestrutura como código",
      nivel: "avancado",
      resumo:
        "Pare de clicar no console: descreva a infraestrutura em arquivos versionados e recrie ambientes inteiros com um comando.",
      estudar: [
        "Declarativo x imperativo",
        "CloudFormation e Bicep",
        "Terraform multi-provedor",
        "Estado, planos e drift",
      ],
      requisitos: ["redes-virtuais", "iam-avancado"],
      recursos: [
        {
          titulo: "O que é o AWS CloudFormation?",
          url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",
          tipo: "doc",
        },
        {
          titulo: "O que é o Bicep?",
          url: "https://learn.microsoft.com/pt-br/azure/azure-resource-manager/bicep/overview",
          tipo: "doc",
        },
        {
          titulo: "Terraform: Get Started (AWS)",
          url: "https://developer.hashicorp.com/terraform/tutorials/aws-get-started",
          tipo: "curso",
        },
      ],
    },
    {
      id: "containers",
      titulo: "Containers na nuvem",
      nivel: "avancado",
      resumo:
        "Rode containers sem cuidar de servidores ou com Kubernetes gerenciado: ECS, Fargate, EKS e AKS.",
      estudar: [
        "Registros: ECR e ACR",
        "ECS e Fargate",
        "Kubernetes gerenciado: EKS e AKS",
        "Azure Container Apps",
      ],
      requisitos: ["auto-escala", "iam-avancado"],
      recursos: [
        {
          titulo: "O que é o Amazon ECS?",
          url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html",
          tipo: "doc",
        },
        {
          titulo: "O que é o AKS?",
          url: "https://learn.microsoft.com/pt-br/azure/aks/what-is-aks",
          tipo: "doc",
        },
      ],
    },
    {
      id: "serverless",
      titulo: "Serverless",
      nivel: "avancado",
      resumo:
        "Código que roda sob demanda e escala sozinho: funções, gatilhos por evento e as filas que conectam tudo.",
      estudar: [
        "AWS Lambda e Azure Functions",
        "Gatilhos e arquitetura orientada a eventos",
        "API Gateway",
        "Filas e eventos: SQS, SNS, EventBridge",
      ],
      requisitos: ["iam-avancado", "monitoramento"],
      recursos: [
        {
          titulo: "O que é o AWS Lambda?",
          url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
          tipo: "doc",
        },
        {
          titulo: "Introdução ao Azure Functions",
          url: "https://learn.microsoft.com/pt-br/azure/azure-functions/functions-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "conectividade-hibrida",
      titulo: "Conectividade híbrida",
      nivel: "avancado",
      resumo:
        "Ligue o datacenter à nuvem com VPN site a site ou links dedicados, e centralize o roteamento entre muitas redes.",
      estudar: [
        "VPN site a site",
        "Direct Connect e ExpressRoute",
        "Transit Gateway e Virtual WAN",
        "DNS híbrido",
      ],
      requisitos: ["seguranca-rede", "dns-cdn"],
      recursos: [
        {
          titulo: "O que é o AWS Site-to-Site VPN?",
          url: "https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html",
          tipo: "doc",
        },
        {
          titulo: "O que é o ExpressRoute?",
          url: "https://learn.microsoft.com/pt-br/azure/expressroute/expressroute-introduction",
          tipo: "doc",
        },
      ],
    },
    {
      id: "multi-conta",
      titulo: "Multicontas e landing zones",
      nivel: "avancado",
      resumo:
        "Organize a nuvem da empresa: contas separadas por ambiente, políticas centrais e uma base pronta para novos projetos.",
      estudar: [
        "AWS Organizations e SCPs",
        "Grupos de gerenciamento e Azure Policy",
        "Landing zones (Control Tower, CAF)",
        "Acesso centralizado (IAM Identity Center)",
      ],
      requisitos: ["iac"],
      recursos: [
        {
          titulo: "O que é o AWS Organizations?",
          url: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html",
          tipo: "doc",
        },
        {
          titulo: "Zonas de destino do Azure",
          url: "https://learn.microsoft.com/pt-br/azure/cloud-adoption-framework/ready/landing-zone/",
          tipo: "doc",
        },
      ],
    },
    {
      id: "seguranca-nuvem",
      titulo: "Segurança na nuvem",
      nivel: "avancado",
      resumo:
        "Criptografia, segredos, detecção de ameaças e postura de segurança: o que proteger além do IAM.",
      estudar: [
        "KMS e Key Vault",
        "Secrets Manager",
        "GuardDuty e Microsoft Defender for Cloud",
        "Postura e conformidade (Security Hub)",
      ],
      requisitos: ["iam-avancado", "monitoramento"],
      recursos: [
        {
          titulo: "Pilar de segurança do Well-Architected",
          url: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html",
          tipo: "doc",
        },
        {
          titulo: "Microsoft Defender for Cloud",
          url: "https://learn.microsoft.com/pt-br/azure/defender-for-cloud/defender-for-cloud-introduction",
          tipo: "doc",
        },
      ],
    },
    {
      id: "finops",
      titulo: "FinOps e otimização de custos",
      nivel: "avancado",
      resumo:
        "Custo também é arquitetura: tags, relatórios por time, compromissos de uso e ajuste fino de recursos ociosos.",
      estudar: [
        "Tags e alocação de custos",
        "Savings Plans e instâncias reservadas",
        "Rightsizing e recursos ociosos",
        "Práticas da FinOps Foundation",
      ],
      requisitos: ["custos", "auto-escala"],
      recursos: [
        { titulo: "FinOps Foundation", url: "https://www.finops.org/introduction/what-is-finops/", tipo: "artigo" },
        {
          titulo: "AWS Cost Explorer",
          url: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html",
          tipo: "doc",
        },
      ],
    },
    {
      id: "arquitetura",
      titulo: "Arquitetura bem estruturada",
      nivel: "avancado",
      resumo:
        "Junte tudo em decisões de arquitetura: os pilares do Well-Architected e como avaliar um sistema real com eles.",
      estudar: [
        "Pilares: excelência operacional, segurança, confiabilidade",
        "Eficiência de desempenho, custo e sustentabilidade",
        "Revisões de arquitetura",
        "Padrões de referência",
      ],
      requisitos: ["alta-disponibilidade", "seguranca-nuvem", "finops"],
      recursos: [
        {
          titulo: "AWS Well-Architected Framework",
          url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
          tipo: "doc",
        },
        {
          titulo: "Azure Well-Architected Framework",
          url: "https://learn.microsoft.com/pt-br/azure/well-architected/",
          tipo: "doc",
        },
      ],
    },
  ],
};

export default cloud;
