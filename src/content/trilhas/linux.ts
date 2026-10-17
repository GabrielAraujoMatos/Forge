import type { Trilha } from "@/lib/types";

const linux: Trilha = {
  slug: "linux",
  titulo: "Linux",
  descricao:
    "Do primeiro comando no terminal até kernel, containers e automação. A base de quase toda a infraestrutura moderna.",
  icone: "terminal",
  topicos: [
    // ── Básico ──────────────────────────────────────────────
    {
      id: "intro",
      titulo: "O que é Linux e distribuições",
      nivel: "basico",
      resumo:
        "Entenda a diferença entre kernel e sistema operacional, a filosofia do software livre e como as distribuições se organizam em famílias.",
      estudar: [
        "Kernel x sistema operacional x distribuição",
        "Famílias: Debian/Ubuntu, RHEL/Fedora, Arch, SUSE",
        "Licença GPL e software livre",
        "Onde o Linux roda: servidores, nuvem, embarcados",
      ],
      requisitos: [],
      recursos: [
        { titulo: "Linux Journey: Getting Started", url: "https://linuxjourney.com/", tipo: "curso" },
        { titulo: "DistroWatch", url: "https://distrowatch.com/", tipo: "artigo" },
      ],
    },
    {
      id: "instalacao",
      titulo: "Instalação e máquinas virtuais",
      nivel: "basico",
      resumo:
        "Monte seu laboratório: instale uma distribuição em uma máquina virtual para experimentar sem medo de quebrar nada.",
      estudar: [
        "Hipervisores para desktop (VirtualBox, VMware, Hyper-V)",
        "Instalação de Ubuntu Server ou Debian",
        "Snapshots para voltar atrás",
        "WSL2 como alternativa no Windows",
      ],
      requisitos: ["intro"],
      recursos: [
        { titulo: "Manual do VirtualBox", url: "https://www.virtualbox.org/manual/", tipo: "doc" },
        { titulo: "Instalar o Ubuntu Server", url: "https://ubuntu.com/tutorials/install-ubuntu-server", tipo: "doc" },
        { titulo: "Instalar o WSL", url: "https://learn.microsoft.com/pt-br/windows/wsl/install", tipo: "doc" },
      ],
    },
    {
      id: "terminal",
      titulo: "Terminal e shell",
      nivel: "basico",
      resumo:
        "O terminal é a sua bigorna. Aprenda a navegar, pedir ajuda ao próprio sistema e entender o que cada comando faz.",
      estudar: [
        "pwd, cd, ls e caminhos absolutos x relativos",
        "man, --help e tldr",
        "Histórico, atalhos e autocompletar",
        "Variáveis de ambiente e PATH",
      ],
      requisitos: ["instalacao"],
      recursos: [
        { titulo: "Linux Journey: Command Line", url: "https://linuxjourney.com/lesson/the-shell", tipo: "curso" },
        { titulo: "explainshell", url: "https://explainshell.com/", tipo: "pratica" },
        { titulo: "OverTheWire: Bandit", url: "https://overthewire.org/wargames/bandit/", tipo: "pratica" },
      ],
    },
    {
      id: "arquivos",
      titulo: "Manipulação de arquivos",
      nivel: "basico",
      resumo:
        "Criar, copiar, mover, procurar e inspecionar arquivos e diretórios: o dia a dia de quem administra sistemas.",
      estudar: [
        "touch, mkdir, cp, mv, rm",
        "cat, less, head, tail",
        "find e locate",
        "Links simbólicos e hard links",
      ],
      requisitos: ["terminal"],
      recursos: [
        { titulo: "GNU Coreutils", url: "https://www.gnu.org/software/coreutils/manual/coreutils.html", tipo: "doc" },
        { titulo: "Linux Journey: Text-Fu", url: "https://linuxjourney.com/lesson/stdout-standard-out-redirect", tipo: "curso" },
      ],
    },
    {
      id: "fhs",
      titulo: "Hierarquia do sistema de arquivos",
      nivel: "basico",
      resumo:
        "Saiba onde as coisas moram: configurações em /etc, logs em /var/log, binários em /usr/bin e por que tudo é arquivo.",
      estudar: [
        "/etc, /var, /usr, /home, /opt, /tmp",
        "/proc e /sys como sistemas de arquivos virtuais",
        "Tipos de arquivo e inodes",
      ],
      requisitos: ["terminal"],
      recursos: [
        { titulo: "Filesystem Hierarchy Standard 3.0", url: "https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html", tipo: "doc" },
        { titulo: "man hier", url: "https://man7.org/linux/man-pages/man7/hier.7.html", tipo: "doc" },
      ],
    },
    {
      id: "editores",
      titulo: "Editores de texto: nano e vim",
      nivel: "basico",
      resumo:
        "Em um servidor você nem sempre terá interface gráfica. Domine pelo menos o nano e o suficiente de vim para sobreviver.",
      estudar: [
        "nano para edições rápidas",
        "Modos do vim: normal, inserção, comando",
        "Salvar, sair, buscar e substituir no vim",
      ],
      requisitos: ["arquivos"],
      recursos: [
        { titulo: "vimtutor (rode no terminal)", url: "https://vimhelp.org/usr_01.txt.html", tipo: "pratica" },
        { titulo: "Documentação do nano", url: "https://www.nano-editor.org/docs.php", tipo: "doc" },
      ],
    },
    {
      id: "permissoes",
      titulo: "Usuários, grupos e permissões",
      nivel: "basico",
      resumo:
        "Quem pode ler, escrever e executar o quê. Permissões erradas são uma das maiores fontes de falhas e brechas.",
      estudar: [
        "useradd, usermod, passwd, groups",
        "rwx, notação octal, chmod e chown",
        "sudo e o arquivo sudoers",
        "SUID, SGID, sticky bit e umask",
      ],
      requisitos: ["fhs", "arquivos"],
      recursos: [
        { titulo: "ArchWiki: File permissions", url: "https://wiki.archlinux.org/title/File_permissions_and_attributes", tipo: "doc" },
        { titulo: "ArchWiki: Users and groups", url: "https://wiki.archlinux.org/title/Users_and_groups", tipo: "doc" },
      ],
    },
    {
      id: "pacotes",
      titulo: "Gerenciamento de pacotes",
      nivel: "basico",
      resumo:
        "Instale, atualize e remova software do jeito certo usando os gerenciadores da sua distribuição e seus repositórios.",
      estudar: [
        "apt e dpkg (Debian/Ubuntu)",
        "dnf e rpm (Fedora/RHEL)",
        "Repositórios, chaves GPG e mirrors",
        "Atualizações de segurança",
      ],
      requisitos: ["terminal"],
      recursos: [
        { titulo: "Debian Reference: gerenciamento de pacotes", url: "https://www.debian.org/doc/manuals/debian-reference/ch02.en.html", tipo: "doc" },
        { titulo: "Documentação do DNF", url: "https://dnf.readthedocs.io/en/latest/", tipo: "doc" },
      ],
    },

    // ── Intermediário ───────────────────────────────────────
    {
      id: "texto",
      titulo: "Pipes, redirecionamento e filtros",
      nivel: "intermediario",
      resumo:
        "Combine pequenos comandos em ferramentas poderosas. grep, sed e awk transformam logs gigantes em respostas.",
      estudar: [
        "stdin, stdout, stderr e redirecionamento",
        "Pipes e xargs",
        "grep e expressões regulares",
        "sed, awk, cut, sort, uniq, wc",
      ],
      requisitos: ["arquivos"],
      recursos: [
        { titulo: "GNU grep", url: "https://www.gnu.org/software/grep/manual/grep.html", tipo: "doc" },
        { titulo: "GNU awk", url: "https://www.gnu.org/software/gawk/manual/gawk.html", tipo: "doc" },
        { titulo: "regex101", url: "https://regex101.com/", tipo: "pratica" },
      ],
    },
    {
      id: "processos",
      titulo: "Processos e sinais",
      nivel: "intermediario",
      resumo:
        "Tudo que roda é um processo. Aprenda a listar, priorizar, pausar e encerrar processos com segurança.",
      estudar: [
        "ps, top, htop e pstree",
        "Sinais: SIGTERM, SIGKILL, SIGHUP",
        "kill, pkill, nice e renice",
        "Jobs em primeiro e segundo plano",
      ],
      requisitos: ["permissoes"],
      recursos: [
        { titulo: "man signal(7)", url: "https://man7.org/linux/man-pages/man7/signal.7.html", tipo: "doc" },
        { titulo: "Linux Journey: Processes", url: "https://linuxjourney.com/lesson/monitor-processes-ps-command", tipo: "curso" },
      ],
    },
    {
      id: "bash",
      titulo: "Shell script com Bash",
      nivel: "intermediario",
      resumo:
        "Automatize tarefas repetitivas. Scripts são o primeiro passo de qualquer automação de infraestrutura.",
      estudar: [
        "Variáveis, condicionais e laços",
        "Funções e argumentos",
        "Códigos de saída e set -euo pipefail",
        "Boas práticas com ShellCheck",
      ],
      requisitos: ["texto", "editores"],
      recursos: [
        { titulo: "BashGuide (Greg's Wiki)", url: "https://mywiki.wooledge.org/BashGuide", tipo: "curso" },
        { titulo: "Manual do Bash", url: "https://www.gnu.org/software/bash/manual/bash.html", tipo: "doc" },
        { titulo: "ShellCheck", url: "https://www.shellcheck.net/", tipo: "pratica" },
      ],
    },
    {
      id: "systemd",
      titulo: "systemd e serviços",
      nivel: "intermediario",
      resumo:
        "O systemd inicia e supervisiona os serviços do sistema. Saiba criar, habilitar e depurar suas próprias units.",
      estudar: [
        "systemctl start/stop/enable/status",
        "Escrevendo um arquivo .service",
        "Targets e ordem de boot",
        "Dependências entre units",
      ],
      requisitos: ["processos"],
      recursos: [
        { titulo: "systemd.service", url: "https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html", tipo: "doc" },
        { titulo: "ArchWiki: systemd", url: "https://wiki.archlinux.org/title/Systemd", tipo: "doc" },
      ],
    },
    {
      id: "logs",
      titulo: "Logs e journalctl",
      nivel: "intermediario",
      resumo:
        "Quando algo dá errado, os logs contam a história. Aprenda a filtrar o journal e entender o rsyslog.",
      estudar: [
        "journalctl: filtros por unit, tempo e prioridade",
        "/var/log e rsyslog",
        "Rotação de logs com logrotate",
      ],
      requisitos: ["systemd"],
      recursos: [
        { titulo: "journalctl", url: "https://www.freedesktop.org/software/systemd/man/latest/journalctl.html", tipo: "doc" },
        { titulo: "ArchWiki: systemd/Journal", url: "https://wiki.archlinux.org/title/Systemd/Journal", tipo: "doc" },
      ],
    },
    {
      id: "discos",
      titulo: "Discos, partições e montagem",
      nivel: "intermediario",
      resumo:
        "Adicione discos, crie partições e sistemas de arquivos, e configure montagens que sobrevivem ao reboot.",
      estudar: [
        "lsblk, fdisk, parted",
        "ext4, xfs e btrfs",
        "mount, umount e /etc/fstab",
        "df, du e espaço em disco",
      ],
      requisitos: ["fhs"],
      recursos: [
        { titulo: "ArchWiki: Partitioning", url: "https://wiki.archlinux.org/title/Partitioning", tipo: "doc" },
        { titulo: "ArchWiki: fstab", url: "https://wiki.archlinux.org/title/Fstab", tipo: "doc" },
      ],
    },
    {
      id: "rede-linux",
      titulo: "Rede no Linux",
      nivel: "intermediario",
      resumo:
        "Configure interfaces, rotas e DNS, e descubra quais portas estão abertas, tudo pela linha de comando.",
      estudar: [
        "ip addr, ip route, ip link",
        "ss e portas em escuta",
        "Netplan / NetworkManager",
        "/etc/hosts e /etc/resolv.conf",
      ],
      requisitos: ["pacotes"],
      recursos: [
        { titulo: "man ip(8)", url: "https://man7.org/linux/man-pages/man8/ip.8.html", tipo: "doc" },
        { titulo: "man ss(8)", url: "https://man7.org/linux/man-pages/man8/ss.8.html", tipo: "doc" },
        { titulo: "Netplan", url: "https://netplan.readthedocs.io/en/stable/", tipo: "doc" },
      ],
    },
    {
      id: "ssh",
      titulo: "SSH e acesso remoto",
      nivel: "intermediario",
      resumo:
        "A porta de entrada de todo servidor. Use chaves, configure o cliente e o servidor e transfira arquivos com segurança.",
      estudar: [
        "Autenticação por chave (ssh-keygen, ssh-copy-id)",
        "~/.ssh/config e jump hosts",
        "sshd_config: desabilitar senha e root",
        "scp, rsync e túneis",
      ],
      requisitos: ["rede-linux", "permissoes"],
      recursos: [
        { titulo: "ArchWiki: OpenSSH", url: "https://wiki.archlinux.org/title/OpenSSH", tipo: "doc" },
        { titulo: "ArchWiki: SSH keys", url: "https://wiki.archlinux.org/title/SSH_keys", tipo: "doc" },
      ],
    },
    {
      id: "agendamento",
      titulo: "Agendamento: cron e timers",
      nivel: "intermediario",
      resumo:
        "Rode backups, limpezas e relatórios no horário certo, com cron ou com timers do systemd.",
      estudar: [
        "Sintaxe do crontab",
        "systemd timers",
        "Logs e alertas de tarefas agendadas",
      ],
      requisitos: ["bash", "systemd"],
      recursos: [
        { titulo: "crontab.guru", url: "https://crontab.guru/", tipo: "pratica" },
        { titulo: "ArchWiki: systemd/Timers", url: "https://wiki.archlinux.org/title/Systemd/Timers", tipo: "doc" },
      ],
    },

    // ── Avançado ────────────────────────────────────────────
    {
      id: "lvm-raid",
      titulo: "LVM e RAID",
      nivel: "avancado",
      resumo:
        "Volumes flexíveis que crescem sem downtime e redundância de discos para que uma falha não derrube o servidor.",
      estudar: [
        "PV, VG e LV",
        "Redimensionar volumes e snapshots",
        "RAID 0, 1, 5, 6 e 10 com mdadm",
      ],
      requisitos: ["discos"],
      recursos: [
        { titulo: "ArchWiki: LVM", url: "https://wiki.archlinux.org/title/LVM", tipo: "doc" },
        { titulo: "ArchWiki: RAID", url: "https://wiki.archlinux.org/title/RAID", tipo: "doc" },
      ],
    },
    {
      id: "firewall",
      titulo: "Firewall no Linux",
      nivel: "avancado",
      resumo:
        "Controle o tráfego que entra e sai com nftables e as camadas amigáveis ufw e firewalld.",
      estudar: [
        "Netfilter, tabelas e chains",
        "nftables",
        "ufw (Ubuntu) e firewalld (RHEL)",
      ],
      requisitos: ["rede-linux"],
      recursos: [
        { titulo: "ArchWiki: nftables", url: "https://wiki.archlinux.org/title/Nftables", tipo: "doc" },
        { titulo: "firewalld", url: "https://firewalld.org/documentation/", tipo: "doc" },
        { titulo: "Ubuntu: UFW", url: "https://help.ubuntu.com/community/UFW", tipo: "doc" },
      ],
    },
    {
      id: "hardening",
      titulo: "Hardening e segurança",
      nivel: "avancado",
      resumo:
        "Reduza a superfície de ataque: mínimo privilégio, controle de acesso obrigatório e auditoria.",
      estudar: [
        "Princípio do menor privilégio",
        "SELinux e AppArmor",
        "fail2ban e auditd",
        "CIS Benchmarks",
      ],
      requisitos: ["ssh", "firewall"],
      recursos: [
        { titulo: "ArchWiki: Security", url: "https://wiki.archlinux.org/title/Security", tipo: "doc" },
        { titulo: "CIS Benchmarks", url: "https://www.cisecurity.org/cis-benchmarks", tipo: "doc" },
        { titulo: "ArchWiki: AppArmor", url: "https://wiki.archlinux.org/title/AppArmor", tipo: "doc" },
      ],
    },
    {
      id: "performance",
      titulo: "Monitoramento e performance",
      nivel: "avancado",
      resumo:
        "Descubra se o gargalo é CPU, memória, disco ou rede usando a metodologia USE e as ferramentas certas.",
      estudar: [
        "Load average e uso de CPU",
        "Memória, swap e cache",
        "vmstat, iostat, sar",
        "Metodologia USE",
      ],
      requisitos: ["processos", "logs"],
      recursos: [
        { titulo: "Linux Performance (Brendan Gregg)", url: "https://www.brendangregg.com/linuxperf.html", tipo: "artigo" },
        { titulo: "The USE Method", url: "https://www.brendangregg.com/usemethod.html", tipo: "artigo" },
      ],
    },
    {
      id: "kernel-boot",
      titulo: "Kernel, módulos e boot",
      nivel: "avancado",
      resumo:
        "Entenda o que acontece do botão de ligar até o login: firmware, bootloader, initramfs e kernel.",
      estudar: [
        "UEFI, GRUB e initramfs",
        "Módulos do kernel (lsmod, modprobe)",
        "Parâmetros do kernel e sysctl",
      ],
      requisitos: ["systemd", "discos"],
      recursos: [
        { titulo: "ArchWiki: Arch boot process", url: "https://wiki.archlinux.org/title/Arch_boot_process", tipo: "doc" },
        { titulo: "ArchWiki: Kernel module", url: "https://wiki.archlinux.org/title/Kernel_module", tipo: "doc" },
        { titulo: "Documentação do kernel", url: "https://docs.kernel.org/", tipo: "doc" },
      ],
    },
    {
      id: "containers",
      titulo: "Namespaces, cgroups e containers",
      nivel: "avancado",
      resumo:
        "Containers são recursos do kernel, não mágica. Entenda o que o Docker faz por baixo dos panos.",
      estudar: [
        "Namespaces (pid, net, mnt, user)",
        "cgroups v2 e limites de recursos",
        "Runtimes: runc, containerd e Podman",
      ],
      requisitos: ["kernel-boot", "processos"],
      recursos: [
        { titulo: "man namespaces(7)", url: "https://man7.org/linux/man-pages/man7/namespaces.7.html", tipo: "doc" },
        { titulo: "man cgroups(7)", url: "https://man7.org/linux/man-pages/man7/cgroups.7.html", tipo: "doc" },
        { titulo: "iximiuz Labs", url: "https://labs.iximiuz.com/", tipo: "pratica" },
      ],
    },
    {
      id: "ansible",
      titulo: "Automação com Ansible",
      nivel: "avancado",
      resumo:
        "Configure dezenas de servidores de uma vez, de forma repetível e versionada, sem instalar agentes.",
      estudar: [
        "Inventário e comandos ad-hoc",
        "Playbooks, tasks e handlers",
        "Roles e variáveis",
        "Idempotência",
      ],
      requisitos: ["ssh", "bash"],
      recursos: [
        { titulo: "Ansible: Getting started", url: "https://docs.ansible.com/ansible/latest/getting_started/index.html", tipo: "doc" },
      ],
    },
    {
      id: "troubleshooting",
      titulo: "Troubleshooting avançado",
      nivel: "avancado",
      resumo:
        "Quando os logs não bastam: rastreie chamadas de sistema, arquivos abertos e o que o kernel está fazendo.",
      estudar: [
        "strace e ltrace",
        "lsof e arquivos abertos",
        "perf e flame graphs",
        "Metodologia de diagnóstico",
      ],
      requisitos: ["performance"],
      recursos: [
        { titulo: "man strace(1)", url: "https://man7.org/linux/man-pages/man1/strace.1.html", tipo: "doc" },
        { titulo: "perf Examples (Brendan Gregg)", url: "https://www.brendangregg.com/perf.html", tipo: "artigo" },
      ],
    },
  ],
};

export default linux;
