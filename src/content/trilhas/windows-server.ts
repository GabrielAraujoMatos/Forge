import type { Trilha } from "@/lib/types";

const windowsServer: Trilha = {
  slug: "windows-server",
  titulo: "Windows Server",
  descricao:
    "Do primeiro servidor ao domínio corporativo: Active Directory, GPO, PowerShell, virtualização e ambientes híbridos.",
  icone: "server",
  topicos: [
    // ── Básico ──────────────────────────────────────────────
    {
      id: "intro",
      titulo: "Windows Server: edições e funções",
      nivel: "basico",
      resumo:
        "Conheça o papel do Windows Server nas empresas, as edições disponíveis e o modelo de funções (roles) e recursos (features).",
      estudar: [
        "Standard x Datacenter e o modelo de licenciamento",
        "Funções (roles) x recursos (features)",
        "Ciclo de vida: LTSC e versões suportadas",
        "Onde o Windows Server aparece: AD, arquivos, virtualização",
      ],
      requisitos: [],
      recursos: [
        { titulo: "Documentação do Windows Server", url: "https://learn.microsoft.com/pt-br/windows-server/", tipo: "doc" },
        {
          titulo: "Comparar edições do Windows Server",
          url: "https://learn.microsoft.com/pt-br/windows-server/get-started/editions-comparison",
          tipo: "doc",
        },
      ],
    },
    {
      id: "instalacao",
      titulo: "Instalação: Desktop Experience x Core",
      nivel: "basico",
      resumo:
        "Monte o laboratório com uma avaliação gratuita em máquina virtual e entenda quando usar a instalação com interface ou a Server Core.",
      estudar: [
        "Download da versão de avaliação (180 dias)",
        "Desktop Experience x Server Core",
        "sconfig para a configuração inicial no Core",
        "Nome do computador, fuso e ativação",
      ],
      requisitos: ["intro"],
      recursos: [
        {
          titulo: "Avaliação do Windows Server",
          url: "https://www.microsoft.com/pt-br/evalcenter/evaluate-windows-server-2022",
          tipo: "pratica",
        },
        {
          titulo: "O que é o Server Core",
          url: "https://learn.microsoft.com/pt-br/windows-server/administration/server-core/what-is-server-core",
          tipo: "doc",
        },
      ],
    },
    {
      id: "gerenciamento",
      titulo: "Ferramentas de gerenciamento",
      nivel: "basico",
      resumo:
        "Server Manager, Windows Admin Center e os consoles MMC: as ferramentas para administrar um ou vários servidores.",
      estudar: [
        "Server Manager e adicionar funções",
        "Windows Admin Center no navegador",
        "Consoles MMC e RSAT",
        "Área de Trabalho Remota para administração",
      ],
      requisitos: ["instalacao"],
      recursos: [
        {
          titulo: "Windows Admin Center",
          url: "https://learn.microsoft.com/pt-br/windows-server/manage/windows-admin-center/overview",
          tipo: "doc",
        },
        {
          titulo: "Ferramentas RSAT",
          url: "https://learn.microsoft.com/pt-br/troubleshoot/windows-server/system-management-components/remote-server-administration-tools",
          tipo: "doc",
        },
      ],
    },
    {
      id: "powershell",
      titulo: "PowerShell essencial",
      nivel: "basico",
      resumo:
        "O PowerShell é a bigorna do administrador Windows. Aprenda cmdlets, o pipeline de objetos e como descobrir comandos sozinho.",
      estudar: [
        "Verbo-Substantivo, Get-Command e Get-Help",
        "Pipeline de objetos, Where-Object e Select-Object",
        "Get-Member e propriedades",
        "Política de execução e perfis",
      ],
      requisitos: ["instalacao"],
      recursos: [
        { titulo: "Documentação do PowerShell", url: "https://learn.microsoft.com/pt-br/powershell/", tipo: "doc" },
        {
          titulo: "PowerShell 101",
          url: "https://learn.microsoft.com/pt-br/powershell/scripting/learn/ps101/00-introduction",
          tipo: "curso",
        },
      ],
    },
    {
      id: "contas-ntfs",
      titulo: "Contas locais e permissões NTFS",
      nivel: "basico",
      resumo:
        "Usuários e grupos locais, permissões NTFS e herança: a base para controlar quem acessa o quê em qualquer servidor.",
      estudar: [
        "Usuários e grupos locais",
        "Permissões NTFS básicas e avançadas",
        "Herança e permissões efetivas",
        "Princípio do menor privilégio",
      ],
      requisitos: ["gerenciamento"],
      recursos: [
        {
          titulo: "Permissões de arquivos e pastas",
          url: "https://learn.microsoft.com/pt-br/windows/security/identity-protection/access-control/access-control",
          tipo: "doc",
        },
        {
          titulo: "icacls",
          url: "https://learn.microsoft.com/pt-br/windows-server/administration/windows-commands/icacls",
          tipo: "doc",
        },
      ],
    },
    {
      id: "armazenamento",
      titulo: "Discos, volumes e sistemas de arquivos",
      nivel: "basico",
      resumo:
        "Prepare discos, crie volumes e escolha entre NTFS e ReFS. Conheça também os Espaços de Armazenamento para juntar discos.",
      estudar: [
        "Gerenciamento de Disco e diskpart",
        "MBR x GPT",
        "NTFS x ReFS",
        "Espaços de Armazenamento (Storage Spaces)",
      ],
      requisitos: ["gerenciamento"],
      recursos: [
        {
          titulo: "Visão geral do ReFS",
          url: "https://learn.microsoft.com/pt-br/windows-server/storage/refs/refs-overview",
          tipo: "doc",
        },
        {
          titulo: "Espaços de Armazenamento",
          url: "https://learn.microsoft.com/pt-br/windows-server/storage/storage-spaces/overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "rede",
      titulo: "Rede no Windows Server",
      nivel: "basico",
      resumo:
        "Configure IP fixo, DNS e firewall do Windows, e use os comandos de diagnóstico de rede do dia a dia.",
      estudar: [
        "IP estático com GUI e New-NetIPAddress",
        "ipconfig, Test-NetConnection e Resolve-DnsName",
        "Windows Defender Firewall e regras",
        "NIC Teaming e SET",
      ],
      requisitos: ["powershell"],
      recursos: [
        {
          titulo: "Módulo NetTCPIP",
          url: "https://learn.microsoft.com/pt-br/powershell/module/nettcpip/",
          tipo: "doc",
        },
        {
          titulo: "Windows Defender Firewall",
          url: "https://learn.microsoft.com/pt-br/windows/security/operating-system-security/network-security/windows-firewall/",
          tipo: "doc",
        },
      ],
    },
    {
      id: "compartilhamentos",
      titulo: "Servidor de arquivos e SMB",
      nivel: "basico",
      resumo:
        "Compartilhe pastas na rede com SMB, combine permissões de compartilhamento com NTFS e controle cotas e tipos de arquivo.",
      estudar: [
        "Criar compartilhamentos (GUI e New-SmbShare)",
        "Permissão de compartilhamento x NTFS",
        "Access-Based Enumeration",
        "FSRM: cotas e triagem de arquivos",
      ],
      requisitos: ["contas-ntfs", "armazenamento"],
      recursos: [
        {
          titulo: "Visão geral do SMB",
          url: "https://learn.microsoft.com/pt-br/windows-server/storage/file-server/file-server-smb-overview",
          tipo: "doc",
        },
        {
          titulo: "Gerenciador de Recursos de Servidor de Arquivos",
          url: "https://learn.microsoft.com/pt-br/windows-server/storage/fsrm/fsrm-overview",
          tipo: "doc",
        },
      ],
    },

    // ── Intermediário ───────────────────────────────────────
    {
      id: "ad-ds",
      titulo: "Active Directory: conceitos e instalação",
      nivel: "intermediario",
      resumo:
        "O coração da rede corporativa. Entenda domínio, floresta e controlador de domínio, e promova o seu primeiro DC.",
      estudar: [
        "Domínio, árvore e floresta",
        "Controladores de domínio e o banco NTDS",
        "Promover um DC (Install-ADDSForest)",
        "Ingressar computadores no domínio",
      ],
      requisitos: ["rede", "contas-ntfs"],
      recursos: [
        {
          titulo: "Visão geral do AD DS",
          url: "https://learn.microsoft.com/pt-br/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview",
          tipo: "doc",
        },
        {
          titulo: "Instalar o AD DS",
          url: "https://learn.microsoft.com/pt-br/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-",
          tipo: "doc",
        },
      ],
    },
    {
      id: "dns-windows",
      titulo: "DNS no Windows Server",
      nivel: "intermediario",
      resumo:
        "O AD depende do DNS. Aprenda zonas integradas ao AD, registros SRV, encaminhadores e como diagnosticar resolução de nomes.",
      estudar: [
        "Zonas primárias e integradas ao AD",
        "Registros A, CNAME, SRV e PTR",
        "Encaminhadores e encaminhamento condicional",
        "Limpeza (scavenging) e diagnóstico",
      ],
      requisitos: ["ad-ds"],
      recursos: [
        {
          titulo: "DNS no Windows Server",
          url: "https://learn.microsoft.com/pt-br/windows-server/networking/dns/dns-top",
          tipo: "doc",
        },
      ],
    },
    {
      id: "dhcp-windows",
      titulo: "DHCP no Windows Server",
      nivel: "intermediario",
      resumo:
        "Distribua endereços automaticamente com escopos, reservas e opções, e garanta alta disponibilidade com failover.",
      estudar: [
        "Escopos, exclusões e reservas",
        "Opções de servidor e de escopo",
        "Autorização do DHCP no AD",
        "Failover de DHCP",
      ],
      requisitos: ["ad-ds"],
      recursos: [
        {
          titulo: "DHCP no Windows Server",
          url: "https://learn.microsoft.com/pt-br/windows-server/networking/technologies/dhcp/dhcp-top",
          tipo: "doc",
        },
      ],
    },
    {
      id: "objetos-ad",
      titulo: "Usuários, grupos e OUs",
      nivel: "intermediario",
      resumo:
        "Organize o diretório em unidades organizacionais, gerencie contas em massa com PowerShell e use grupos do jeito certo.",
      estudar: [
        "Unidades organizacionais e delegação",
        "Grupos de segurança x distribuição e escopos",
        "Módulo ActiveDirectory do PowerShell",
        "Contas de serviço gerenciadas (gMSA)",
      ],
      requisitos: ["ad-ds", "powershell"],
      recursos: [
        {
          titulo: "Módulo ActiveDirectory",
          url: "https://learn.microsoft.com/pt-br/powershell/module/activedirectory/",
          tipo: "doc",
        },
        {
          titulo: "Grupos de segurança do AD",
          url: "https://learn.microsoft.com/pt-br/windows-server/identity/ad-ds/manage/understand-security-groups",
          tipo: "doc",
        },
      ],
    },
    {
      id: "gpo",
      titulo: "Políticas de Grupo (GPO)",
      nivel: "intermediario",
      resumo:
        "Configure centenas de máquinas de uma vez. Entenda a ordem de aplicação, filtros e como diagnosticar uma GPO que não aplica.",
      estudar: [
        "GPMC, vínculos e ordem LSDOU",
        "Herança, bloqueio e imposição",
        "Filtragem por segurança e WMI",
        "gpresult e gpupdate",
      ],
      requisitos: ["objetos-ad"],
      recursos: [
        {
          titulo: "Visão geral da Política de Grupo",
          url: "https://learn.microsoft.com/pt-br/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/hh831791(v=ws.11)",
          tipo: "doc",
        },
        {
          titulo: "gpresult",
          url: "https://learn.microsoft.com/pt-br/windows-server/administration/windows-commands/gpresult",
          tipo: "doc",
        },
      ],
    },
    {
      id: "powershell-scripts",
      titulo: "Scripts e PowerShell Remoting",
      nivel: "intermediario",
      resumo:
        "Saia dos comandos soltos: escreva scripts com funções e tratamento de erro, e administre muitos servidores de uma vez.",
      estudar: [
        "Funções avançadas e parâmetros",
        "try/catch e -ErrorAction",
        "Invoke-Command e Enter-PSSession",
        "Módulos e a PowerShell Gallery",
      ],
      requisitos: ["powershell"],
      recursos: [
        {
          titulo: "Sobre o Remoting",
          url: "https://learn.microsoft.com/pt-br/powershell/scripting/security/remoting/running-remote-commands",
          tipo: "doc",
        },
        {
          titulo: "Funções avançadas",
          url: "https://learn.microsoft.com/pt-br/powershell/module/microsoft.powershell.core/about/about_functions_advanced",
          tipo: "doc",
        },
      ],
    },
    {
      id: "backup",
      titulo: "Backup e recuperação",
      nivel: "intermediario",
      resumo:
        "Proteja servidores e o AD com Windows Server Backup e cópias de sombra, e treine a restauração antes de precisar dela.",
      estudar: [
        "Windows Server Backup e wbadmin",
        "Cópias de sombra (VSS)",
        "Restauração autoritativa x não autoritativa do AD",
        "Lixeira do Active Directory",
      ],
      requisitos: ["ad-ds", "armazenamento"],
      recursos: [
        {
          titulo: "wbadmin",
          url: "https://learn.microsoft.com/pt-br/windows-server/administration/windows-commands/wbadmin",
          tipo: "doc",
        },
        {
          titulo: "Lixeira do Active Directory",
          url: "https://learn.microsoft.com/pt-br/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-",
          tipo: "doc",
        },
      ],
    },
    {
      id: "atualizacoes",
      titulo: "Atualizações e WSUS",
      nivel: "intermediario",
      resumo:
        "Mantenha o parque atualizado sem sustos: aprovação de atualizações, grupos de teste e janelas de manutenção.",
      estudar: [
        "Windows Update e o ciclo de Patch Tuesday",
        "WSUS: grupos, aprovação e limpeza",
        "Configurar clientes por GPO",
        "Azure Update Manager como alternativa",
      ],
      requisitos: ["gpo"],
      recursos: [
        {
          titulo: "Implantar o WSUS",
          url: "https://learn.microsoft.com/pt-br/windows-server/administration/windows-server-update-services/plan/plan-your-wsus-deployment",
          tipo: "doc",
        },
      ],
    },
    {
      id: "monitoramento",
      titulo: "Eventos e desempenho",
      nivel: "intermediario",
      resumo:
        "Descubra o que aconteceu e o que está lento: Visualizador de Eventos, Monitor de Desempenho e coleta centralizada de logs.",
      estudar: [
        "Logs do Windows e Get-WinEvent",
        "IDs de evento importantes (logon, falhas)",
        "Monitor de Desempenho e contadores",
        "Encaminhamento de eventos (WEF)",
      ],
      requisitos: ["powershell", "gerenciamento"],
      recursos: [
        {
          titulo: "Get-WinEvent",
          url: "https://learn.microsoft.com/pt-br/powershell/module/microsoft.powershell.diagnostics/get-winevent",
          tipo: "doc",
        },
        {
          titulo: "Encaminhamento de eventos do Windows",
          url: "https://learn.microsoft.com/pt-br/windows/security/operating-system-security/device-management/use-windows-event-forwarding-to-assist-in-intrusion-detection",
          tipo: "artigo",
        },
      ],
    },

    // ── Avançado ────────────────────────────────────────────
    {
      id: "hyper-v",
      titulo: "Virtualização com Hyper-V",
      nivel: "avancado",
      resumo:
        "Rode várias máquinas num só host: switches virtuais, checkpoints, migração ao vivo e réplica entre servidores.",
      estudar: [
        "Instalar o Hyper-V e criar VMs",
        "Switches virtuais externos, internos e privados",
        "Checkpoints e discos VHDX",
        "Live Migration e Hyper-V Replica",
      ],
      requisitos: ["rede", "armazenamento"],
      recursos: [
        {
          titulo: "Hyper-V no Windows Server",
          url: "https://learn.microsoft.com/pt-br/windows-server/virtualization/hyper-v/hyper-v-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "cluster",
      titulo: "Failover Clustering",
      nivel: "avancado",
      resumo:
        "Alta disponibilidade para serviços críticos: quando um nó cai, outro assume. Aprenda quórum, armazenamento compartilhado e validação.",
      estudar: [
        "Validação e criação do cluster",
        "Quórum e testemunha (witness)",
        "Cluster Shared Volumes",
        "Storage Spaces Direct",
      ],
      requisitos: ["hyper-v", "ad-ds"],
      recursos: [
        {
          titulo: "Failover Clustering",
          url: "https://learn.microsoft.com/pt-br/windows-server/failover-clustering/failover-clustering-overview",
          tipo: "doc",
        },
        {
          titulo: "Storage Spaces Direct",
          url: "https://learn.microsoft.com/pt-br/windows-server/storage/storage-spaces/storage-spaces-direct-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "ad-avancado",
      titulo: "AD avançado: sites, replicação e FSMO",
      nivel: "avancado",
      resumo:
        "Domínios com várias filiais: sites e links de replicação, funções FSMO, relações de confiança e saúde do diretório.",
      estudar: [
        "Sites, sub-redes e links de site",
        "Replicação e repadmin",
        "Funções FSMO e transferência",
        "Relações de confiança entre florestas",
      ],
      requisitos: ["dns-windows", "objetos-ad"],
      recursos: [
        {
          titulo: "Replicação do Active Directory",
          url: "https://learn.microsoft.com/pt-br/windows-server/identity/ad-ds/get-started/replication/active-directory-replication-concepts",
          tipo: "doc",
        },
        {
          titulo: "Funções FSMO",
          url: "https://learn.microsoft.com/pt-br/troubleshoot/windows-server/active-directory/fsmo-roles",
          tipo: "doc",
        },
      ],
    },
    {
      id: "pki",
      titulo: "Certificados com AD CS",
      nivel: "avancado",
      resumo:
        "Monte uma infraestrutura de chaves públicas interna para emitir certificados de servidores, usuários e dispositivos.",
      estudar: [
        "CA raiz offline e CA subordinada",
        "Modelos de certificado",
        "Autoinscrição por GPO",
        "CRL, OCSP e renovação",
      ],
      requisitos: ["gpo"],
      recursos: [
        {
          titulo: "Visão geral do AD CS",
          url: "https://learn.microsoft.com/pt-br/windows-server/identity/ad-cs/active-directory-certificate-services-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "seguranca",
      titulo: "Hardening e segurança do AD",
      nivel: "avancado",
      resumo:
        "Proteja o alvo número um dos atacantes: modelo de camadas, contas privilegiadas, LAPS e linhas de base de segurança.",
      estudar: [
        "Modelo de acesso em camadas (tiering)",
        "Windows LAPS para administradores locais",
        "Grupo Protected Users e Credential Guard",
        "Security baselines da Microsoft",
      ],
      requisitos: ["gpo", "ad-avancado"],
      recursos: [
        {
          titulo: "Práticas recomendadas para proteger o AD",
          url: "https://learn.microsoft.com/pt-br/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory",
          tipo: "doc",
        },
        {
          titulo: "Windows LAPS",
          url: "https://learn.microsoft.com/pt-br/windows-server/identity/laps/laps-overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "rds",
      titulo: "Serviços de Área de Trabalho Remota",
      nivel: "avancado",
      resumo:
        "Publique áreas de trabalho e aplicativos para muitos usuários com RDS: Connection Broker, Gateway e licenciamento.",
      estudar: [
        "Session Host e Connection Broker",
        "RD Gateway e RD Web Access",
        "RemoteApp",
        "Licenciamento de CALs",
      ],
      requisitos: ["ad-ds", "pki"],
      recursos: [
        {
          titulo: "Remote Desktop Services",
          url: "https://learn.microsoft.com/pt-br/windows-server/remote/remote-desktop-services/welcome-to-rds",
          tipo: "doc",
        },
      ],
    },
    {
      id: "automacao",
      titulo: "Automação e configuração desejada",
      nivel: "avancado",
      resumo:
        "Garanta que todo servidor fique como deveria: DSC, servidores padronizados e infraestrutura descrita em código.",
      estudar: [
        "PowerShell DSC: configurações e recursos",
        "Idempotência e desvio de configuração",
        "Azure Machine Configuration",
        "Pipelines para scripts de infraestrutura",
      ],
      requisitos: ["powershell-scripts"],
      recursos: [
        {
          titulo: "PowerShell DSC",
          url: "https://learn.microsoft.com/pt-br/powershell/dsc/overview",
          tipo: "doc",
        },
      ],
    },
    {
      id: "hibrido",
      titulo: "Ambiente híbrido com o Azure",
      nivel: "avancado",
      resumo:
        "Conecte o datacenter à nuvem: sincronize identidades com o Microsoft Entra ID e gerencie servidores locais pelo Azure Arc.",
      estudar: [
        "Microsoft Entra Connect e sincronização",
        "Autenticação: hash de senha, PTA e federação",
        "Azure Arc para servidores",
        "Azure File Sync",
      ],
      requisitos: ["ad-avancado", "automacao"],
      recursos: [
        {
          titulo: "Microsoft Entra Connect",
          url: "https://learn.microsoft.com/pt-br/entra/identity/hybrid/connect/whatis-azure-ad-connect",
          tipo: "doc",
        },
        {
          titulo: "Azure Arc para servidores",
          url: "https://learn.microsoft.com/pt-br/azure/azure-arc/servers/overview",
          tipo: "doc",
        },
      ],
    },
  ],
};

export default windowsServer;
