import type { Certificacao } from "@/lib/types";

// Os tópicos de cada prova são uma aproximação feita a partir dos objetivos
// oficiais; a página oficial (url) é a referência. Chaves no formato
// "trilha/topico", então uma prova pode cobrir tópicos de outras trilhas.

const linux = (...ids: string[]) => ids.map((id) => `linux/${id}`);
const redes = (...ids: string[]) => ids.map((id) => `redes/${id}`);
const windows = (...ids: string[]) => ids.map((id) => `windows-server/${id}`);
const cloud = (...ids: string[]) => ids.map((id) => `cloud/${id}`);
const devops = (...ids: string[]) => ids.map((id) => `devops/${id}`);

export const certificacoes: Certificacao[] = [
  {
    id: "linux-essentials",
    sigla: "Linux Essentials",
    nome: "LPI Linux Essentials",
    emissor: "LPI",
    nivel: "fundamentos",
    trilha: "linux",
    url: "https://www.lpi.org/our-certifications/linux-essentials-overview/",
    topicos: linux("intro", "terminal", "arquivos", "fhs", "permissoes", "texto", "processos", "bash", "rede-linux"),
  },
  {
    id: "lpic-1",
    sigla: "LPIC-1",
    nome: "LPIC-1 Linux Administrator",
    emissor: "LPI",
    nivel: "associado",
    trilha: "linux",
    url: "https://www.lpi.org/our-certifications/lpic-1-overview/",
    topicos: linux(
      "intro", "instalacao", "terminal", "arquivos", "fhs", "editores", "permissoes", "pacotes", "texto",
      "processos", "bash", "systemd", "logs", "discos", "rede-linux", "ssh", "agendamento", "kernel-boot",
    ),
  },
  {
    id: "rhcsa",
    sigla: "RHCSA",
    nome: "Red Hat Certified System Administrator",
    emissor: "Red Hat",
    nivel: "profissional",
    trilha: "linux",
    url: "https://www.redhat.com/en/services/certification/rhcsa",
    topicos: linux(
      "terminal", "arquivos", "editores", "permissoes", "pacotes", "texto", "processos", "bash", "systemd",
      "logs", "discos", "rede-linux", "ssh", "agendamento", "lvm-raid", "firewall", "hardening", "kernel-boot",
    ),
  },
  {
    id: "network-plus",
    sigla: "Network+",
    nome: "CompTIA Network+",
    emissor: "CompTIA",
    nivel: "fundamentos",
    trilha: "redes",
    url: "https://www.comptia.org/en-us/certifications/network/",
    topicos: redes(
      "fundamentos", "modelos", "meios-fisicos", "ethernet", "ipv4", "subnetting", "tcp-udp", "dns", "dhcp",
      "vlans", "stp", "roteamento", "nat", "ipv6", "wifi", "diagnostico", "http-tls", "firewalls", "vpn",
      "seguranca-redes",
    ),
  },
  {
    id: "ccna",
    sigla: "CCNA",
    nome: "Cisco Certified Network Associate",
    emissor: "Cisco",
    nivel: "associado",
    trilha: "redes",
    url: "https://learningnetwork.cisco.com/s/ccna-exam-topics",
    topicos: redes(
      "fundamentos", "modelos", "meios-fisicos", "ethernet", "ipv4", "subnetting", "tcp-udp", "dns", "dhcp",
      "vlans", "stp", "roteamento", "nat", "ipv6", "wifi", "diagnostico", "ospf", "firewalls", "vpn", "qos",
      "automacao-redes", "seguranca-redes",
    ),
  },
  {
    id: "az-802",
    sigla: "AZ-802",
    nome: "Windows Server Hybrid Administrator Associate",
    emissor: "Microsoft",
    nivel: "associado",
    trilha: "windows-server",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/windows-server-hybrid-administrator/",
    topicos: windows(
      "gerenciamento", "powershell", "armazenamento", "compartilhamentos", "rede", "ad-ds", "dns-windows",
      "dhcp-windows", "objetos-ad", "gpo", "powershell-scripts", "backup", "atualizacoes", "monitoramento",
      "hyper-v", "cluster", "ad-avancado", "seguranca", "hibrido",
    ),
  },
  {
    id: "az-900",
    sigla: "AZ-900",
    nome: "Microsoft Azure Fundamentals",
    emissor: "Microsoft",
    nivel: "fundamentos",
    trilha: "cloud",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
    topicos: cloud(
      "conceitos", "modelos-servico", "infraestrutura-global", "console-cli", "iam", "computacao",
      "armazenamento", "custos", "redes-virtuais", "monitoramento", "alta-disponibilidade",
    ),
  },
  {
    id: "aws-ccp",
    sigla: "AWS CCP",
    nome: "AWS Certified Cloud Practitioner",
    emissor: "AWS",
    nivel: "fundamentos",
    trilha: "cloud",
    url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    topicos: cloud(
      "conceitos", "modelos-servico", "infraestrutura-global", "console-cli", "iam", "computacao",
      "armazenamento", "custos", "redes-virtuais", "bancos-gerenciados", "monitoramento", "alta-disponibilidade",
      "serverless", "seguranca-nuvem", "arquitetura",
    ),
  },
  {
    id: "az-104",
    sigla: "AZ-104",
    nome: "Microsoft Azure Administrator",
    emissor: "Microsoft",
    nivel: "associado",
    trilha: "cloud",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/",
    topicos: cloud(
      "console-cli", "iam", "computacao", "armazenamento", "redes-virtuais", "seguranca-rede", "iam-avancado",
      "balanceamento", "auto-escala", "dns-cdn", "monitoramento", "alta-disponibilidade", "iac", "containers",
      "conectividade-hibrida",
    ),
  },
  {
    id: "aws-saa",
    sigla: "AWS SAA",
    nome: "AWS Certified Solutions Architect – Associate",
    emissor: "AWS",
    nivel: "associado",
    trilha: "cloud",
    url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    topicos: cloud(
      "iam", "computacao", "armazenamento", "custos", "redes-virtuais", "seguranca-rede", "iam-avancado",
      "bancos-gerenciados", "balanceamento", "auto-escala", "dns-cdn", "monitoramento", "alta-disponibilidade",
      "containers", "serverless", "conectividade-hibrida", "multi-conta", "seguranca-nuvem", "finops", "arquitetura",
    ),
  },
  {
    id: "gh-200",
    sigla: "GH-200",
    nome: "GitHub Actions",
    emissor: "GitHub",
    nivel: "associado",
    trilha: "devops",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/github-actions/",
    topicos: devops("git", "git-colaboracao", "formatos", "ci", "github-actions", "cd", "registros", "segredos", "devsecops"),
  },
  {
    id: "cka",
    sigla: "CKA",
    nome: "Certified Kubernetes Administrator",
    emissor: "Linux Foundation",
    nivel: "profissional",
    trilha: "devops",
    url: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
    topicos: [
      ...devops("formatos", "docker", "kubernetes", "helm", "metricas-logs"),
      ...linux("systemd", "containers", "troubleshooting"),
      ...redes("dns"),
    ],
  },
];

export function certificacoesDaTrilha(slug: string) {
  return certificacoes.filter((c) => c.trilha === slug);
}

/** Provas que cobrem o tópico (chave "trilha/topico"). */
export function certificacoesDoTopico(chave: string) {
  return certificacoes.filter((c) => c.topicos.includes(chave));
}
