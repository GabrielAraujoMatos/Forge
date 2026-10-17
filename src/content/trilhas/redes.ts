import type { Trilha } from "@/lib/types";

const redes: Trilha = {
  slug: "redes",
  titulo: "Redes",
  descricao:
    "Como os dados viajam: de cabos e switches até roteamento da Internet, VPNs e segurança de redes.",
  icone: "network",
  topicos: [
    // ── Básico ──────────────────────────────────────────────
    {
      id: "fundamentos",
      titulo: "Fundamentos de redes",
      nivel: "basico",
      resumo:
        "O que é uma rede, que tipos existem e quais dispositivos conectam tudo.",
      estudar: [
        "LAN, WAN, MAN e Internet",
        "Topologias: estrela, malha, barramento",
        "Hosts, switches, roteadores e access points",
        "Cliente-servidor e peer-to-peer",
      ],
      requisitos: [],
      recursos: [
        { titulo: "Cloudflare: O que é uma LAN?", url: "https://www.cloudflare.com/pt-br/learning/network-layer/what-is-a-lan/", tipo: "artigo" },
        { titulo: "Practical Networking", url: "https://www.practicalnetworking.net/", tipo: "curso" },
      ],
    },
    {
      id: "modelos",
      titulo: "Modelos OSI e TCP/IP",
      nivel: "basico",
      resumo:
        "O mapa mental de toda a área de redes: as camadas, o que cada uma faz e como os dados são encapsulados.",
      estudar: [
        "As 7 camadas do OSI",
        "As 4 camadas do TCP/IP",
        "Encapsulamento e PDUs",
      ],
      requisitos: ["fundamentos"],
      recursos: [
        { titulo: "Cloudflare: Modelo OSI", url: "https://www.cloudflare.com/pt-br/learning/ddos/glossary/open-systems-interconnection-model-osi/", tipo: "artigo" },
        { titulo: "Wikipédia: Modelo OSI", url: "https://pt.wikipedia.org/wiki/Modelo_OSI", tipo: "artigo" },
      ],
    },
    {
      id: "meios-fisicos",
      titulo: "Meios físicos e cabeamento",
      nivel: "basico",
      resumo:
        "A camada que você pode tocar: cabos de par trançado, fibra óptica e os padrões que os definem.",
      estudar: [
        "Par trançado: Cat5e, Cat6, Cat6a",
        "Fibra monomodo x multimodo",
        "Padrões T568A/T568B",
        "Transceivers SFP",
      ],
      requisitos: ["fundamentos"],
      recursos: [
        { titulo: "Wikipédia: Par trançado", url: "https://pt.wikipedia.org/wiki/Par_tran%C3%A7ado", tipo: "artigo" },
        { titulo: "Wikipédia: Fibra óptica", url: "https://pt.wikipedia.org/wiki/Fibra_%C3%B3ptica", tipo: "artigo" },
      ],
    },
    {
      id: "ethernet",
      titulo: "Ethernet, MAC e switches",
      nivel: "basico",
      resumo:
        "Como os quadros circulam dentro de uma rede local e como um switch aprende onde está cada dispositivo.",
      estudar: [
        "Quadro Ethernet e endereço MAC",
        "Tabela MAC e encaminhamento",
        "Domínios de colisão e broadcast",
        "ARP",
      ],
      requisitos: ["modelos", "meios-fisicos"],
      recursos: [
        { titulo: "Practical Networking: Packet Traveling", url: "https://www.practicalnetworking.net/series/packet-traveling/packet-traveling/", tipo: "curso" },
        { titulo: "Wikipédia: Ethernet", url: "https://pt.wikipedia.org/wiki/Ethernet", tipo: "artigo" },
      ],
    },
    {
      id: "ipv4",
      titulo: "Endereçamento IPv4",
      nivel: "basico",
      resumo:
        "O endereço de cada dispositivo na rede: formato, máscara, gateway e faixas privadas.",
      estudar: [
        "Formato e notação decimal",
        "Máscara de rede e gateway padrão",
        "Faixas privadas (RFC 1918)",
        "Unicast, broadcast e multicast",
      ],
      requisitos: ["modelos"],
      recursos: [
        { titulo: "Cloudflare: Protocolo de Internet", url: "https://www.cloudflare.com/pt-br/learning/network-layer/internet-protocol/", tipo: "artigo" },
        { titulo: "RFC 1918", url: "https://www.rfc-editor.org/rfc/rfc1918", tipo: "doc" },
      ],
    },
    {
      id: "subnetting",
      titulo: "Sub-redes e CIDR",
      nivel: "basico",
      resumo:
        "Divida redes do tamanho certo. Subnetting é a habilidade mais cobrada em entrevistas e certificações.",
      estudar: [
        "Notação CIDR (/24, /26…)",
        "Cálculo de rede, broadcast e hosts",
        "VLSM",
        "Sumarização de rotas",
      ],
      requisitos: ["ipv4"],
      recursos: [
        { titulo: "Cloudflare: O que é uma sub-rede?", url: "https://www.cloudflare.com/pt-br/learning/network-layer/what-is-a-subnet/", tipo: "artigo" },
        { titulo: "Subnetting Practice", url: "https://subnettingpractice.com/", tipo: "pratica" },
        { titulo: "Practical Networking: Subnetting", url: "https://www.practicalnetworking.net/stand-alone/subnetting-mastery/", tipo: "curso" },
      ],
    },
    {
      id: "tcp-udp",
      titulo: "TCP, UDP e portas",
      nivel: "basico",
      resumo:
        "A camada de transporte: conexões confiáveis com TCP, velocidade com UDP e como as portas identificam serviços.",
      estudar: [
        "Handshake de três vias",
        "Controle de fluxo e retransmissão",
        "UDP e quando usá-lo",
        "Portas conhecidas (22, 53, 80, 443…)",
      ],
      requisitos: ["modelos"],
      recursos: [
        { titulo: "Cloudflare: TCP/IP", url: "https://www.cloudflare.com/pt-br/learning/ddos/glossary/tcp-ip/", tipo: "artigo" },
        { titulo: "RFC 9293: TCP", url: "https://www.rfc-editor.org/rfc/rfc9293", tipo: "doc" },
      ],
    },
    {
      id: "dns",
      titulo: "DNS",
      nivel: "basico",
      resumo:
        "A lista telefônica da Internet. Se algo está fora do ar, a primeira suspeita costuma ser o DNS.",
      estudar: [
        "Resolução recursiva x autoritativa",
        "Registros A, AAAA, CNAME, MX, TXT, NS",
        "TTL e cache",
        "dig e nslookup",
      ],
      requisitos: ["tcp-udp", "ipv4"],
      recursos: [
        { titulo: "Cloudflare: O que é DNS?", url: "https://www.cloudflare.com/pt-br/learning/dns/what-is-dns/", tipo: "artigo" },
        { titulo: "How DNS Works (quadrinho)", url: "https://howdns.works/", tipo: "artigo" },
      ],
    },
    {
      id: "dhcp",
      titulo: "DHCP",
      nivel: "basico",
      resumo:
        "Como os dispositivos ganham IP automaticamente ao entrar na rede, e o que fazer quando isso falha.",
      estudar: [
        "Processo DORA",
        "Escopos, reservas e lease",
        "DHCP relay",
      ],
      requisitos: ["ipv4"],
      recursos: [
        { titulo: "RFC 2131: DHCP", url: "https://www.rfc-editor.org/rfc/rfc2131", tipo: "doc" },
        { titulo: "Wikipédia: DHCP", url: "https://pt.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol", tipo: "artigo" },
      ],
    },

    // ── Intermediário ───────────────────────────────────────
    {
      id: "vlans",
      titulo: "VLANs e trunking",
      nivel: "intermediario",
      resumo:
        "Segmente uma rede física em várias redes lógicas para organizar, isolar e proteger o tráfego.",
      estudar: [
        "VLANs e portas de acesso",
        "Trunks e 802.1Q",
        "VLAN nativa",
        "Roteamento entre VLANs",
      ],
      requisitos: ["ethernet"],
      recursos: [
        { titulo: "Wikipédia: IEEE 802.1Q", url: "https://pt.wikipedia.org/wiki/IEEE_802.1Q", tipo: "artigo" },
        { titulo: "Packet Tracer (Cisco NetAcad)", url: "https://www.netacad.com/cisco-packet-tracer", tipo: "pratica" },
      ],
    },
    {
      id: "stp",
      titulo: "Spanning Tree (STP)",
      nivel: "intermediario",
      resumo:
        "Redundância sem loops. O STP evita que um cabo a mais derrube a rede inteira com tempestades de broadcast.",
      estudar: [
        "Loops de camada 2",
        "Root bridge e estados de porta",
        "RSTP e PortFast",
      ],
      requisitos: ["ethernet"],
      recursos: [
        { titulo: "Wikipédia: Spanning Tree Protocol", url: "https://pt.wikipedia.org/wiki/Spanning_Tree_Protocol", tipo: "artigo" },
      ],
    },
    {
      id: "roteamento",
      titulo: "Roteamento estático",
      nivel: "intermediario",
      resumo:
        "Como um pacote sai da sua rede e chega a outra: tabelas de roteamento, próximo salto e rota padrão.",
      estudar: [
        "Tabela de roteamento",
        "Rota padrão e próximo salto",
        "Longest prefix match",
        "Distância administrativa",
      ],
      requisitos: ["subnetting"],
      recursos: [
        { titulo: "Cloudflare: O que é roteamento?", url: "https://www.cloudflare.com/pt-br/learning/network-layer/what-is-routing/", tipo: "artigo" },
      ],
    },
    {
      id: "nat",
      titulo: "NAT e PAT",
      nivel: "intermediario",
      resumo:
        "Como milhares de dispositivos compartilham um único IP público, e os efeitos colaterais disso.",
      estudar: [
        "NAT estático e dinâmico",
        "PAT / masquerade",
        "Port forwarding",
        "CGNAT",
      ],
      requisitos: ["roteamento"],
      recursos: [
        { titulo: "Wikipédia: NAT", url: "https://pt.wikipedia.org/wiki/Network_address_translation", tipo: "artigo" },
      ],
    },
    {
      id: "ipv6",
      titulo: "IPv6",
      nivel: "intermediario",
      resumo:
        "O sucessor do IPv4 já está aqui. Endereços de 128 bits, autoconfiguração e o fim da escassez de IPs.",
      estudar: [
        "Formato e abreviação de endereços",
        "Link-local, global unicast e ULA",
        "SLAAC e DHCPv6",
        "Neighbor Discovery",
      ],
      requisitos: ["subnetting"],
      recursos: [
        { titulo: "IPv6.br (NIC.br)", url: "https://ipv6.br/", tipo: "curso" },
        { titulo: "RFC 8200: IPv6", url: "https://www.rfc-editor.org/rfc/rfc8200", tipo: "doc" },
      ],
    },
    {
      id: "wifi",
      titulo: "Redes sem fio",
      nivel: "intermediario",
      resumo:
        "Padrões Wi-Fi, canais, interferência e segurança. Quase todo usuário final está numa rede sem fio.",
      estudar: [
        "Padrões 802.11 (Wi-Fi 5, 6, 7)",
        "Bandas 2,4/5/6 GHz e canais",
        "WPA2, WPA3 e 802.1X",
        "Controladoras e roaming",
      ],
      requisitos: ["ethernet"],
      recursos: [
        { titulo: "Wikipédia: Wi-Fi", url: "https://pt.wikipedia.org/wiki/Wi-Fi", tipo: "artigo" },
      ],
    },
    {
      id: "diagnostico",
      titulo: "Ferramentas de diagnóstico",
      nivel: "intermediario",
      resumo:
        "Prove onde está o problema: conectividade, rota, DNS ou aplicação. E veja os pacotes de verdade com o Wireshark.",
      estudar: [
        "ping, traceroute e mtr",
        "dig, curl e nc",
        "tcpdump",
        "Wireshark e filtros de captura",
      ],
      requisitos: ["tcp-udp", "dns"],
      recursos: [
        { titulo: "Guia do usuário do Wireshark", url: "https://www.wireshark.org/docs/wsug_html_chunked/", tipo: "doc" },
        { titulo: "man tcpdump", url: "https://www.tcpdump.org/manpages/tcpdump.1.html", tipo: "doc" },
      ],
    },
    {
      id: "http-tls",
      titulo: "HTTP, HTTPS e TLS",
      nivel: "intermediario",
      resumo:
        "O protocolo da web e a criptografia que o protege: métodos, status, certificados e o handshake TLS.",
      estudar: [
        "Requisições, métodos e códigos de status",
        "HTTP/2 e HTTP/3",
        "Certificados e cadeia de confiança",
        "Handshake TLS 1.3",
      ],
      requisitos: ["dns", "tcp-udp"],
      recursos: [
        { titulo: "Cloudflare: O que é TLS?", url: "https://www.cloudflare.com/pt-br/learning/ssl/transport-layer-security-tls/", tipo: "artigo" },
        { titulo: "MDN: Visão geral do HTTP", url: "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview", tipo: "doc" },
        { titulo: "High Performance Browser Networking", url: "https://hpbn.co/", tipo: "curso" },
      ],
    },

    // ── Avançado ────────────────────────────────────────────
    {
      id: "ospf",
      titulo: "Roteamento dinâmico: OSPF",
      nivel: "avancado",
      resumo:
        "Roteadores que descobrem a topologia sozinhos e se recuperam de falhas. O OSPF é o padrão dentro das empresas.",
      estudar: [
        "Estado de enlace x vetor de distância",
        "Áreas e área 0",
        "Vizinhança, DR/BDR e LSAs",
        "Custo e convergência",
      ],
      requisitos: ["roteamento"],
      recursos: [
        { titulo: "RFC 2328: OSPFv2", url: "https://www.rfc-editor.org/rfc/rfc2328", tipo: "doc" },
        { titulo: "Containerlab", url: "https://containerlab.dev/", tipo: "pratica" },
      ],
    },
    {
      id: "bgp",
      titulo: "BGP e a Internet",
      nivel: "avancado",
      resumo:
        "O protocolo que cola a Internet. Sistemas autônomos, políticas de roteamento e por que um erro de BGP derruba sites gigantes.",
      estudar: [
        "Sistemas autônomos (AS)",
        "eBGP x iBGP",
        "Atributos e seleção de caminho",
        "Peering, trânsito e IX.br",
      ],
      requisitos: ["ospf"],
      recursos: [
        { titulo: "Cloudflare: O que é BGP?", url: "https://www.cloudflare.com/pt-br/learning/security/glossary/what-is-bgp/", tipo: "artigo" },
        { titulo: "Hurricane Electric BGP Toolkit", url: "https://bgp.he.net/", tipo: "pratica" },
        { titulo: "IX.br", url: "https://ix.br/", tipo: "artigo" },
      ],
    },
    {
      id: "firewalls",
      titulo: "Firewalls e ACLs",
      nivel: "avancado",
      resumo:
        "Defina o que pode conversar com o quê: filtragem stateless e stateful, zonas e firewalls de próxima geração.",
      estudar: [
        "ACLs stateless",
        "Firewall stateful e tabela de conexões",
        "Zonas e DMZ",
        "NGFW e inspeção de aplicação",
      ],
      requisitos: ["nat", "tcp-udp"],
      recursos: [
        { titulo: "Cloudflare: O que é um firewall?", url: "https://www.cloudflare.com/pt-br/learning/security/what-is-a-firewall/", tipo: "artigo" },
        { titulo: "pfSense: documentação", url: "https://docs.netgate.com/pfsense/en/latest/", tipo: "doc" },
      ],
    },
    {
      id: "vpn",
      titulo: "VPNs: IPsec e WireGuard",
      nivel: "avancado",
      resumo:
        "Túneis criptografados para conectar filiais e usuários remotos como se estivessem na mesma rede.",
      estudar: [
        "Site-to-site x acesso remoto",
        "IPsec: IKE, ESP e túneis",
        "WireGuard",
        "Split tunneling",
      ],
      requisitos: ["nat", "firewalls"],
      recursos: [
        { titulo: "WireGuard", url: "https://www.wireguard.com/", tipo: "doc" },
        { titulo: "strongSwan", url: "https://docs.strongswan.org/", tipo: "doc" },
        { titulo: "Cloudflare: O que é uma VPN?", url: "https://www.cloudflare.com/pt-br/learning/access-management/what-is-a-vpn/", tipo: "artigo" },
      ],
    },
    {
      id: "balanceamento",
      titulo: "Balanceamento de carga e proxies",
      nivel: "avancado",
      resumo:
        "Distribua tráfego entre servidores, termine TLS e mantenha serviços no ar mesmo quando uma máquina cai.",
      estudar: [
        "Balanceamento L4 x L7",
        "Algoritmos: round robin, least connections",
        "Health checks",
        "Proxy reverso com NGINX e HAProxy",
      ],
      requisitos: ["http-tls"],
      recursos: [
        { titulo: "Cloudflare: O que é balanceamento de carga?", url: "https://www.cloudflare.com/pt-br/learning/performance/what-is-load-balancing/", tipo: "artigo" },
        { titulo: "Documentação do NGINX", url: "https://nginx.org/en/docs/", tipo: "doc" },
        { titulo: "HAProxy", url: "https://www.haproxy.org/", tipo: "doc" },
      ],
    },
    {
      id: "qos",
      titulo: "QoS",
      nivel: "avancado",
      resumo:
        "Quando a banda acaba, quem tem prioridade? QoS garante que voz e vídeo não travem por causa de um download.",
      estudar: [
        "Classificação e marcação (DSCP)",
        "Filas e escalonamento",
        "Policing x shaping",
      ],
      requisitos: ["vlans", "roteamento"],
      recursos: [
        { titulo: "Wikipédia: Qualidade de serviço", url: "https://pt.wikipedia.org/wiki/Qualidade_de_servi%C3%A7o", tipo: "artigo" },
      ],
    },
    {
      id: "automacao-redes",
      titulo: "SDN e automação de redes",
      nivel: "avancado",
      resumo:
        "Configure a rede como código: APIs, fonte da verdade e laboratórios reproduzíveis.",
      estudar: [
        "Conceitos de SDN e overlays (VXLAN)",
        "Python com Netmiko e NAPALM",
        "Ansible para redes",
        "NetBox como fonte da verdade",
      ],
      requisitos: ["ospf", "vlans"],
      recursos: [
        { titulo: "NetBox", url: "https://netboxlabs.com/docs/netbox/", tipo: "doc" },
        { titulo: "Ansible para redes", url: "https://docs.ansible.com/ansible/latest/network/getting_started/index.html", tipo: "doc" },
        { titulo: "Containerlab", url: "https://containerlab.dev/", tipo: "pratica" },
      ],
    },
    {
      id: "seguranca-redes",
      titulo: "Segurança de redes",
      nivel: "avancado",
      resumo:
        "Defesa em profundidade: segmentação, detecção de intrusão e o modelo Zero Trust.",
      estudar: [
        "Segmentação e microsegmentação",
        "IDS/IPS (Suricata)",
        "802.1X e NAC",
        "Zero Trust",
      ],
      requisitos: ["firewalls", "vpn"],
      recursos: [
        { titulo: "Cloudflare: O que é Zero Trust?", url: "https://www.cloudflare.com/pt-br/learning/security/glossary/what-is-zero-trust/", tipo: "artigo" },
        { titulo: "Documentação do Suricata", url: "https://docs.suricata.io/", tipo: "doc" },
      ],
    },
  ],
};

export default redes;
