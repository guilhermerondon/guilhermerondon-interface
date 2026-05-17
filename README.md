<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=8b5cf6&height=110&section=header&animation=fadeIn"/>

# RONDON Core Interface

Repositório do frontend unificado do ecossistema de microsserviços. Esta interface foi projetada sob a estética *Dark Obsidian*, focando em alta performance, carregamento reativo e design industrial para exibição de telemetria, dashboards financeiros e logs de sistemas em tempo real.

---

## 🚀 Tecnologias e Arquitetura

* **Angular 17+**: Arquitetura moderna baseada em *Standalone Components* para eliminação completa de acoplamentos e módulos complexos.
* **Signals**: Gerenciamento de estado nativo e reativo de alta fidelidade, minimizando os ciclos de renderização e garantindo performance sob uso intenso de dados.
* **Estética Core**: Interface *Dark Obsidian* com efeitos sutilmente aplicados de *Glassmorphism*, bordas chanfradas e tipografia *JetBrains Mono*. Identidade visual unificada sob a marca **RONDON**.
* **Orquestração Assíncrona**: Consumo simultâneo e tratamento estrito de políticas de CORS para a comunicação com os microsserviços do ecossistema: `.NET 8` (Finance Core Ledger), `Go` (Infrastructure Pulse) e `Python/FastAPI` (Athlete Macro Analytics).

---

## 🛠️ Execução Local

### Pré-requisitos
* Node.js (Versão LTS estável)
* NPM (Gerenciador de pacotes)

### Instalação e Inicialização
```bash
# Instalar as dependências do projeto
npm install

# Inicializar o servidor de desenvolvimento local
npm run start
