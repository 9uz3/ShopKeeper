<div align="center">

# 🤖 Flay Store Bot

### Bot de Vendas, Tickets e Verificação para Discord — completo, moderno e modular.

![Discord.js](https://img.shields.io/badge/discord.js-v14.18-%235865F2?logo=discord&logoColor=white)
![Node](https://img.shields.io/badge/node-%3E%3D18.0-%23339933?logo=node.js&logoColor=white)
![Licença](https://img.shields.io/badge/licença-MIT-%23FF6B35)
![Status](https://img.shields.io/badge/status-em%20produ%C3%A7%C3%A3o-%2300C853)

---

</div>

## 📋 Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Capturas de Tela](#-capturas-de-tela)
- [Tecnologias](#-tecnologias)
- [Como Usar](#-como-usar)
- [Configuração](#-configuração)
- [Comandos](#-comandos)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🧠 Sobre

O **Flay Store Bot** é um bot multifuncional para Discord desenvolvido em **Discord.js v14** com foco em:

- **Loja integrada** com carrinho de compras, estoque e pagamento via **PIX (Mercado Pago)**
- **Sistema de tickets** completo com painel administrativo
- **Verificação de usuários** via OAuth2 do Discord
- **Sistema de cargos por posição** (rankings)
- **Sistema Nitro Free** com resgate por feedback

---

## ✨ Funcionalidades

### 🛒 Loja & Vendas
- Produtos com múltiplos campos (variações)
- Carrinho de compras interativo
- Cupons de desconto personalizáveis
- Pagamento via **PIX** (Mercado Pago)
- Entrega automática de produtos
- Logs de pedidos e vendas

### 🎫 Tickets
- Criação de tickets com seleção de categoria
- Painel administrativo com opções de:
  - Renomear, trancar, reabrir
  - Adicionar/remover usuários
  - Fechar com transcript
- Sistema de prioridades
- Logs completos de ações

### 🔐 Verificação
- Autenticação via **OAuth2 do Discord**
- Atribuição automática de cargo
- Registro de IP, dispositivo e localização
- Webhook de logs
- Integração com sistema de compras (cargo obrigatório)

### 📊 Extras
- Painel de administração completo
- Sistema de posições (rankings por cargo)
- Sistema de convites (invite tracker)
- Proteção e moderação
- Comandos de utilidade
- Sistema Nitro Free

---

## 🖼️ Capturas de Tela

| Painel Principal | Carrinho | Pagamento |
|:---:|:---:|:---:|
| ![Painel](https://via.placeholder.com/250x150?text=Painel) | ![Carrinho](https://via.placeholder.com/250x150?text=Carrinho) | ![PIX](https://via.placeholder.com/250x150?text=PIX) |

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Finalidade |
|-----------|--------|------------|
| [Node.js](https://nodejs.org/) | ≥ 18 | Runtime |
| [Discord.js](https://discord.js.org/) | 14.18 | API do Discord |
| [Express](https://expressjs.com/) | 4.21 | Servidor HTTP (OAuth) |
| [Mercado Pago](https://www.mercadopago.com.br/) | 2.2 | Pagamentos PIX |
| [quick.db](https://www.npmjs.com/package/quick.db) | 9.1 | Banco de dados local |
| [wio.db](https://www.npmjs.com/package/wio.db) | 4.0 | Banco de dados JSON |
| [discord-oauth2](https://www.npmjs.com/package/discord-oauth2) | 2.12 | Autenticação OAuth2 |

---

## 🚀 Como Usar

### Pré-requisitos

- Node.js **18+**
- Um bot no [Discord Developer Portal](https://discord.com/developers/applications)
- Conta no [Mercado Pago](https://www.mercadopago.com.br/) (para vendas)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/flay-store-bot.git

# Acesse a pasta
cd flay-store-bot

# Instale as dependências
npm install
```

### Configuração Rápida

```bash
# Crie o arquivo de ambiente
cp .env.example .env
```

Edite o arquivo **`.env`**:

```env
TOKEN=seu_token_do_bot_aqui
OWNER_ID=seu_id_do_discord_aqui
MP_API_KEY=sua_chave_do_mercado_pago_aqui
```

### Configurar Autenticação OAuth2

Edite **`DataBaseJson/configauth.json`**:

```json
{
  "secret": "client_secret_do_seu_bot",
  "clientid": "id_do_seu_bot",
  "url": "https://seudominio.com",
  "webhook_logs": "https://discord.com/api/webhooks/...",
  "role": "id_do_cargo_de_verificado",
  "guild_id": "id_do_servidor"
}
```

No **Discord Developer Portal**, adicione a URL de redirect:

```
https://seudominio.com/auth/callback
```

### Iniciar

```bash
npm start
```

---

## ⚙️ Configuração

### Via Painel (Recomendado)

Use o comando `/painel` no Discord para acessar o painel de administração completo:

| Botão | Função |
|-------|--------|
| 🛒 **Loja** | Gerenciar produtos, estoque, posições |
| 🎫 **Ticket** | Configurar sistema de tickets |
| 👋 **Boas Vindas** | Mensagens de boas-vindas e antifake |
| ⚙️ **Ações** | Cargos e canais automáticos |
| 🎨 **Personalizar** | Cores e aparência do bot |
| ☁️ **eCloud** | Configurar OAuth2 e verificação |
| 💰 **Rendimento** | Estatísticas de vendas |
| 🔧 **Definições** | Configurações gerais |

---

## 📁 Comandos

### Administração

| Comando | Descrição |
|---------|-----------|
| `/painel` | Abre o painel de administração |
| `/verify` | Envia botão de verificação OAuth2 |
| `/dm` | Envia mensagem direta a um usuário |
| `/say` | Envia mensagem como o bot |
| `/lock` | Tranca um canal |
| `/unlock` | Destranca um canal |
| `/perm_add` | Adiciona permissão a um usuário |
| `/perm_remove` | Remove permissão de um usuário |
| `/perm_list` | Lista usuários com permissão |
| `/close_ticket` | Fecha um ticket manualmente |
| `/vincular_clientes` | Vincula clientes |
| `/entregar` | Entrega manual de produto |
| `/manage_item` | Gerenciar item do estoque |
| `/manage_stock` | Gerenciar estoque |
| `/manage_product` | Gerenciar produto |
| `/create_mass_coupon` | Criar cupons em massa |
| `/remove_mass_coupon` | Remover cupons em massa |
| `/ganerate_pix` | Gerar QR Code PIX |

### Usuários

| Comando | Descrição |
|---------|-----------|
| `/profile` | Exibe perfil do usuário |
| `/rank` | Exibe ranking de vendas |

---

## 📂 Estrutura do Projeto

```
BotV2/
├── ComandosSlash/          # Comandos de barra (/) do Discord
│   ├── Administracao/      # Comandos administrativos
│   ├── ContextMenus/       # Menus de contexto
│   └── Usuarios/           # Comandos de usuário
├── DataBaseJson/           # Banco de dados JSON
├── Eventos/                # Eventos do Discord
│   ├── Sistema De Configuracao/
│   ├── Sistema De Handlers/
│   ├── Sistema De Invites/
│   ├── Sistema De Logs/
│   ├── Sistema De Protecao/
│   ├── Sistema Nitro Free/
│   ├── Sistemas Automaticos/
│   └── teste/
├── Functions/              # Funções e lógica do bot
├── Handler/                # Handlers de eventos e comandos
├── Lib/                    # Bibliotecas auxiliares
├── routes/                 # Rotas HTTP (Express)
│   ├── callback.js         # Callback OAuth2
│   └── login.js            # Login OAuth2
├── src/                    # Código-fonte principal
│   ├── config/             # Configurações
│   ├── constants/          # Constantes
│   ├── database/           # Conexão com banco
│   ├── events/             # Eventos src
│   ├── handlers/           # Handlers src
│   ├── services/           # Serviços (tickets, segurança, etc.)
│   └── utils/              # Utilitários
├── config.js               # Configuração principal (token, API keys)
├── index.js                # Entrypoint
├── package.json
└── README.md
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos:

1. **Fork** o projeto
2. Crie uma **branch** (`git checkout -b feature/minha-feature`)
3. **Commit** suas mudanças (`git commit -m 'feat: minha nova feature'`)
4. **Push** para a branch (`git push origin feature/minha-feature`)
5. Abra um **Pull Request**

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](LICENSE) para mais informações.

---

<div align="center">

Feito com ❤️ por [Andriel](https://github.com/9uz3)

</div>
