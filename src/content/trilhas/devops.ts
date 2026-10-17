import type { Trilha } from "@/lib/types";

const devops: Trilha = {
  slug: "devops",
  titulo: "DevOps",
  descricao:
    "Do commit à produção sem medo: Git, containers, pipelines, infraestrutura como código, Kubernetes e observabilidade.",
  icone: "infinity",
  topicos: [
    // ── Básico ──────────────────────────────────────────────
    {
      id: "cultura",
      titulo: "O que é DevOps",
      nivel: "basico",
      resumo:
        "DevOps é cultura antes de ferramenta: times que entregam juntos, ciclos curtos de feedback e automação de tudo que se repete.",
      estudar: [
        "Origem: a parede entre desenvolvimento e operações",
        "CALMS: cultura, automação, lean, medição, compartilhamento",
        "As quatro métricas DORA",
        "O ciclo planejar → codar → entregar → operar",
      ],
      requisitos: [],
      recursos: [
        { titulo: "O que é DevOps? (AWS)", url: "https://aws.amazon.com/pt/devops/what-is-devops/", tipo: "artigo" },
        { titulo: "Métricas DORA", url: "https://dora.dev/guides/dora-metrics-four-keys/", tipo: "artigo" },
      ],
    },
    {
      id: "git",
      titulo: "Git essencial",
      nivel: "basico",
      resumo:
        "Tudo começa no controle de versão. Aprenda commits, histórico e como desfazer erros sem perder trabalho.",
      estudar: [
        "init, add, commit, status e log",
        "O que é um commit e o HEAD",
        "diff, restore e revert",
        ".gitignore",
      ],
      requisitos: ["cultura"],
      recursos: [
        { titulo: "Pro Git (livro gratuito)", url: "https://git-scm.com/book/pt-br/v2", tipo: "curso" },
        { titulo: "Learn Git Branching", url: "https://learngitbranching.js.org/?locale=pt_BR", tipo: "pratica" },
      ],
    },
    {
      id: "git-colaboracao",
      titulo: "Branches, pull requests e fluxos",
      nivel: "basico",
      resumo:
        "Trabalhe em equipe sem atropelar ninguém: branches, merge, rebase, revisão de código e fluxos como trunk-based.",
      estudar: [
        "Branches, merge e conflitos",
        "Rebase x merge",
        "Pull requests e code review",
        "GitHub Flow e trunk-based development",
      ],
      requisitos: ["git"],
      recursos: [
        { titulo: "GitHub Flow", url: "https://docs.github.com/pt/get-started/using-github/github-flow", tipo: "doc" },
        { titulo: "Trunk Based Development", url: "https://trunkbaseddevelopment.com/", tipo: "artigo" },
      ],
    },
    {
      id: "scripting",
      titulo: "Shell script para automação",
      nivel: "basico",
      resumo:
        "Se você fez duas vezes, automatize. Scripts em Bash são a cola entre ferramentas em qualquer pipeline.",
      estudar: [
        "Variáveis, condicionais e laços",
        "Códigos de saída e set -euo pipefail",
        "Pipes, grep, sed e jq",
        "ShellCheck para evitar armadilhas",
      ],
      requisitos: ["cultura"],
      recursos: [
        { titulo: "Bash Guide (Greg's Wiki)", url: "https://mywiki.wooledge.org/BashGuide", tipo: "doc" },
        { titulo: "ShellCheck", url: "https://www.shellcheck.net/", tipo: "pratica" },
      ],
    },
    {
      id: "formatos",
      titulo: "YAML, JSON e configuração",
      nivel: "basico",
      resumo:
        "Pipelines, Kubernetes e Compose falam YAML. Entenda a sintaxe, as pegadinhas de indentação e como validar arquivos.",
      estudar: [
        "Sintaxe YAML: mapas, listas e escalares",
        "Âncoras e strings multilinha",
        "JSON e jq",
        "Validação e linters",
      ],
      requisitos: ["cultura"],
      recursos: [
        { titulo: "Learn YAML in Y minutes", url: "https://learnxinyminutes.com/yaml/", tipo: "artigo" },
        { titulo: "Manual do jq", url: "https://jqlang.org/manual/", tipo: "doc" },
      ],
    },
    {
      id: "docker",
      titulo: "Containers e Docker",
      nivel: "basico",
      resumo:
        "Empacote a aplicação com tudo o que ela precisa e rode igual em qualquer lugar. Entenda imagens, containers e volumes.",
      estudar: [
        "Container x máquina virtual",
        "docker run, ps, logs e exec",
        "Imagens, camadas e tags",
        "Volumes e redes",
      ],
      requisitos: ["scripting"],
      recursos: [
        { titulo: "Docker: Get started", url: "https://docs.docker.com/get-started/", tipo: "curso" },
        { titulo: "Play with Docker", url: "https://labs.play-with-docker.com/", tipo: "pratica" },
      ],
    },
    {
      id: "ci",
      titulo: "Integração contínua",
      nivel: "basico",
      resumo:
        "Cada mudança é compilada e testada automaticamente. Entenda o que é CI e por que ela muda a confiança do time.",
      estudar: [
        "O que é integração contínua",
        "Build, testes e artefatos",
        "Feedback rápido e branches curtos",
        "Ferramentas: GitHub Actions, GitLab CI, Jenkins",
      ],
      requisitos: ["git-colaboracao"],
      recursos: [
        {
          titulo: "Continuous Integration (Martin Fowler)",
          url: "https://martinfowler.com/articles/continuousIntegration.html",
          tipo: "artigo",
        },
      ],
    },
    {
      id: "testes",
      titulo: "Testes automatizados",
      nivel: "basico",
      resumo:
        "Sem testes, o pipeline só entrega bugs mais rápido. Conheça a pirâmide de testes e o que rodar em cada etapa.",
      estudar: [
        "Pirâmide: unidade, integração, ponta a ponta",
        "Linters e análise estática",
        "Testes no pipeline e cobertura",
        "Testes instáveis (flaky)",
      ],
      requisitos: ["ci"],
      recursos: [
        {
          titulo: "The Practical Test Pyramid",
          url: "https://martinfowler.com/articles/practical-test-pyramid.html",
          tipo: "artigo",
        },
      ],
    },

    // ── Intermediário ───────────────────────────────────────
    {
      id: "dockerfile",
      titulo: "Dockerfile e imagens otimizadas",
      nivel: "intermediario",
      resumo:
        "Construa imagens pequenas, rápidas e seguras com builds multiestágio, cache de camadas e usuário sem privilégios.",
      estudar: [
        "Instruções do Dockerfile",
        "Builds multiestágio",
        "Cache de camadas e .dockerignore",
        "Imagens base mínimas e usuário não root",
      ],
      requisitos: ["docker"],
      recursos: [
        {
          titulo: "Boas práticas de build",
          url: "https://docs.docker.com/build/building/best-practices/",
          tipo: "doc",
        },
        {
          titulo: "Builds multiestágio",
          url: "https://docs.docker.com/build/building/multi-stage/",
          tipo: "doc",
        },
      ],
    },
    {
      id: "compose",
      titulo: "Docker Compose",
      nivel: "intermediario",
      resumo:
        "Suba a aplicação inteira com banco, cache e fila num comando só, ótimo para desenvolvimento e testes de integração.",
      estudar: [
        "Serviços, redes e volumes no compose.yaml",
        "Variáveis e arquivos .env",
        "depends_on e healthchecks",
        "Perfis e override",
      ],
      requisitos: ["dockerfile", "formatos"],
      recursos: [
        { titulo: "Docker Compose", url: "https://docs.docker.com/compose/", tipo: "doc" },
      ],
    },
    {
      id: "github-actions",
      titulo: "Pipelines com GitHub Actions",
      nivel: "intermediario",
      resumo:
        "Escreva o seu primeiro pipeline de verdade: workflows, jobs, matrizes, cache e segredos no GitHub Actions.",
      estudar: [
        "Workflows, eventos, jobs e steps",
        "Actions do marketplace",
        "Matriz, cache e artefatos",
        "Segredos e ambientes",
      ],
      requisitos: ["testes", "formatos"],
      recursos: [
        {
          titulo: "Documentação do GitHub Actions",
          url: "https://docs.github.com/pt/actions",
          tipo: "doc",
        },
        {
          titulo: "Sintaxe de workflow",
          url: "https://docs.github.com/pt/actions/reference/workflows-and-actions/workflow-syntax",
          tipo: "doc",
        },
      ],
    },
    {
      id: "cd",
      titulo: "Entrega contínua e estratégias de deploy",
      nivel: "intermediario",
      resumo:
        "Leve cada mudança aprovada até a produção com segurança: ambientes, aprovações, blue-green, canary e rollback.",
      estudar: [
        "Entrega contínua x deploy contínuo",
        "Ambientes e promoção de artefatos",
        "Blue-green, canary e rolling",
        "Feature flags e rollback",
      ],
      requisitos: ["github-actions"],
      recursos: [
        {
          titulo: "Continuous Delivery (Martin Fowler)",
          url: "https://martinfowler.com/bliki/ContinuousDelivery.html",
          tipo: "artigo",
        },
        {
          titulo: "Feature Toggles",
          url: "https://martinfowler.com/articles/feature-toggles.html",
          tipo: "artigo",
        },
      ],
    },
    {
      id: "registros",
      titulo: "Registros de imagens e artefatos",
      nivel: "intermediario",
      resumo:
        "Guarde e versione o que o pipeline produz: registros de containers, tags imutáveis e retenção.",
      estudar: [
        "Docker Hub, GHCR, ECR e ACR",
        "Tags semânticas x digest",
        "Publicar imagens pelo pipeline",
        "Políticas de retenção",
      ],
      requisitos: ["dockerfile", "github-actions"],
      recursos: [
        {
          titulo: "GitHub Container Registry",
          url: "https://docs.github.com/pt/packages/working-with-a-github-packages-registry/working-with-the-container-registry",
          tipo: "doc",
        },
      ],
    },
    {
      id: "terraform",
      titulo: "Infraestrutura como código com Terraform",
      nivel: "intermediario",
      resumo:
        "Descreva servidores, redes e serviços em código: providers, plan e apply, estado remoto e módulos reutilizáveis.",
      estudar: [
        "Providers, recursos e variáveis",
        "terraform plan e apply",
        "Estado remoto e locking",
        "Módulos",
      ],
      requisitos: ["formatos", "git-colaboracao"],
      recursos: [
        {
          titulo: "Tutoriais do Terraform",
          url: "https://developer.hashicorp.com/terraform/tutorials",
          tipo: "curso",
        },
        { titulo: "OpenTofu", url: "https://opentofu.org/docs/", tipo: "doc" },
      ],
    },
    {
      id: "ansible",
      titulo: "Gerência de configuração com Ansible",
      nivel: "intermediario",
      resumo:
        "Configure dezenas de servidores de forma idempotente, sem agente, com playbooks legíveis em YAML.",
      estudar: [
        "Inventário e comandos ad hoc",
        "Playbooks, tasks e handlers",
        "Roles e Ansible Galaxy",
        "Variáveis e Ansible Vault",
      ],
      requisitos: ["formatos", "scripting"],
      recursos: [
        {
          titulo: "Introdução ao Ansible",
          url: "https://docs.ansible.com/ansible/latest/getting_started/index.html",
          tipo: "doc",
        },
      ],
    },
    {
      id: "segredos",
      titulo: "Gestão de segredos",
      nivel: "intermediario",
      resumo:
        "Senhas e chaves fora do código: cofres de segredos, injeção no pipeline e rotação, e o que fazer quando um vaza.",
      estudar: [
        "Por que segredos não vão para o Git",
        "Segredos no CI (GitHub Actions, OIDC)",
        "HashiCorp Vault e cofres da nuvem",
        "Rotação e varredura de vazamentos",
      ],
      requisitos: ["github-actions"],
      recursos: [
        {
          titulo: "Usar segredos no GitHub Actions",
          url: "https://docs.github.com/pt/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets",
          tipo: "doc",
        },
        {
          titulo: "O que é o Vault?",
          url: "https://developer.hashicorp.com/vault/docs/about-vault/what-is-vault",
          tipo: "doc",
        },
      ],
    },
    {
      id: "metricas-logs",
      titulo: "Métricas e logs com Prometheus",
      nivel: "intermediario",
      resumo:
        "Comece a observar seus sistemas: métricas com Prometheus, painéis no Grafana e logs centralizados.",
      estudar: [
        "Tipos de métrica: counter, gauge, histogram",
        "Prometheus e exporters",
        "PromQL básico",
        "Logs estruturados e centralizados",
      ],
      requisitos: ["compose"],
      recursos: [
        {
          titulo: "Prometheus: primeiros passos",
          url: "https://prometheus.io/docs/prometheus/latest/getting_started/",
          tipo: "doc",
        },
        { titulo: "Grafana: primeiros passos", url: "https://grafana.com/docs/grafana/latest/getting-started/", tipo: "doc" },
      ],
    },

    // ── Avançado ────────────────────────────────────────────
    {
      id: "kubernetes",
      titulo: "Kubernetes",
      nivel: "avancado",
      resumo:
        "O orquestrador padrão do mercado: pods, deployments, services e como o cluster mantém o estado desejado.",
      estudar: [
        "Arquitetura: control plane e nós",
        "Pods, Deployments e ReplicaSets",
        "Services e Ingress",
        "ConfigMaps, Secrets e kubectl",
      ],
      requisitos: ["registros", "compose"],
      recursos: [
        {
          titulo: "Conceitos do Kubernetes",
          url: "https://kubernetes.io/pt-br/docs/concepts/",
          tipo: "doc",
        },
        {
          titulo: "Tutorial básico do Kubernetes",
          url: "https://kubernetes.io/pt-br/docs/tutorials/kubernetes-basics/",
          tipo: "curso",
        },
        { titulo: "kind (Kubernetes local)", url: "https://kind.sigs.k8s.io/", tipo: "pratica" },
      ],
    },
    {
      id: "helm",
      titulo: "Kubernetes na prática: Helm e operação",
      nivel: "avancado",
      resumo:
        "Empacote aplicações com Helm e opere o cluster no dia a dia: recursos, probes, autoescala e atualizações sem queda.",
      estudar: [
        "Charts, values e releases do Helm",
        "Requests, limits e probes",
        "HPA e autoescala",
        "Rolling updates e rollback",
      ],
      requisitos: ["kubernetes"],
      recursos: [
        { titulo: "Documentação do Helm", url: "https://helm.sh/pt/docs/", tipo: "doc" },
        {
          titulo: "Liveness, readiness e startup probes",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/",
          tipo: "doc",
        },
      ],
    },
    {
      id: "gitops",
      titulo: "GitOps",
      nivel: "avancado",
      resumo:
        "O Git como fonte da verdade do cluster: um agente compara o repositório com o que está rodando e corrige a diferença.",
      estudar: [
        "Princípios do GitOps",
        "Pull x push no deploy",
        "Argo CD e Flux",
        "Promoção entre ambientes",
      ],
      requisitos: ["helm", "cd"],
      recursos: [
        { titulo: "OpenGitOps: princípios", url: "https://opengitops.dev/", tipo: "artigo" },
        { titulo: "Argo CD", url: "https://argo-cd.readthedocs.io/en/stable/", tipo: "doc" },
      ],
    },
    {
      id: "observabilidade",
      titulo: "Observabilidade e tracing",
      nivel: "avancado",
      resumo:
        "Vá além do monitoramento: correlacione métricas, logs e traces distribuídos para entender sistemas complexos.",
      estudar: [
        "Os três pilares e a correlação entre eles",
        "OpenTelemetry: instrumentação e coletor",
        "Tracing distribuído",
        "Alertas que valem acordar alguém",
      ],
      requisitos: ["metricas-logs", "kubernetes"],
      recursos: [
        { titulo: "Documentação do OpenTelemetry", url: "https://opentelemetry.io/pt/docs/", tipo: "doc" },
        {
          titulo: "Monitoring Distributed Systems (livro SRE)",
          url: "https://sre.google/sre-book/monitoring-distributed-systems/",
          tipo: "artigo",
        },
      ],
    },
    {
      id: "sre",
      titulo: "SRE: SLIs, SLOs e error budgets",
      nivel: "avancado",
      resumo:
        "Confiabilidade medida, não sentida: defina indicadores, metas e um orçamento de erros que equilibra velocidade e estabilidade.",
      estudar: [
        "SLI, SLO e SLA",
        "Error budgets e políticas",
        "Toil e automação",
        "Planejamento de capacidade",
      ],
      requisitos: ["observabilidade"],
      recursos: [
        { titulo: "Livro Site Reliability Engineering", url: "https://sre.google/sre-book/table-of-contents/", tipo: "curso" },
        {
          titulo: "Implementing SLOs (SRE Workbook)",
          url: "https://sre.google/workbook/implementing-slos/",
          tipo: "artigo",
        },
      ],
    },
    {
      id: "devsecops",
      titulo: "DevSecOps e cadeia de suprimentos",
      nivel: "avancado",
      resumo:
        "Segurança dentro do pipeline: análise de código, varredura de imagens e dependências, assinatura e SBOM.",
      estudar: [
        "SAST, DAST e análise de dependências",
        "Varredura de imagens com Trivy",
        "SBOM e assinatura com Sigstore",
        "Framework SLSA",
      ],
      requisitos: ["registros", "segredos"],
      recursos: [
        { titulo: "SLSA", url: "https://slsa.dev/", tipo: "doc" },
        { titulo: "Trivy", url: "https://trivy.dev/docs/latest/guide/", tipo: "doc" },
        { titulo: "OWASP DevSecOps Guideline", url: "https://owasp.org/www-project-devsecops-guideline/", tipo: "artigo" },
      ],
    },
    {
      id: "incidentes",
      titulo: "Gestão de incidentes e postmortems",
      nivel: "avancado",
      resumo:
        "Quando tudo quebra: papéis na resposta, comunicação, plantão saudável e postmortems sem culpados que melhoram o sistema.",
      estudar: [
        "Severidades e papéis (comandante, comunicação)",
        "Runbooks e plantão",
        "Postmortem sem culpados",
        "Engenharia do caos",
      ],
      requisitos: ["sre"],
      recursos: [
        {
          titulo: "Managing Incidents (livro SRE)",
          url: "https://sre.google/sre-book/managing-incidents/",
          tipo: "artigo",
        },
        {
          titulo: "Postmortem Culture (livro SRE)",
          url: "https://sre.google/sre-book/postmortem-culture/",
          tipo: "artigo",
        },
      ],
    },
    {
      id: "plataforma",
      titulo: "Engenharia de plataforma",
      nivel: "avancado",
      resumo:
        "Transforme o que você aprendeu em produto interno: caminhos prontos e autoatendimento para os times entregarem sozinhos.",
      estudar: [
        "Plataformas internas de desenvolvimento",
        "Golden paths e templates",
        "Portais como o Backstage",
        "Medir a experiência do desenvolvedor",
      ],
      requisitos: ["gitops", "terraform"],
      recursos: [
        { titulo: "platformengineering.org", url: "https://platformengineering.org/blog/what-is-platform-engineering", tipo: "artigo" },
        { titulo: "Backstage", url: "https://backstage.io/docs/overview/what-is-backstage", tipo: "doc" },
      ],
    },
  ],
};

export default devops;
