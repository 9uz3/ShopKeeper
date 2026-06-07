<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,50:FF6B35,100:000000&height=200&section=header&text=ShopKeeper&fontSize=70&fontColor=FFFFFF&animation=fadeIn" width="100%"/>
</div>

<h1 align="center">ShopKeeper — Bot de Vendas, Tickets e Verificacao para Discord</h1>

<p align="center">
  <a href="./README.md"><b>Voltar para selecao de idioma</b></a>
</p>

<p align="center">
  <b>Bot multifuncional para Discord — Vendas, Tickets e Verificacao.</b><br/>
  <sub>Completo, moderno e modular.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/discord.js-v14.18-5865F2?style=for-the-badge&logo=discord&logoColor=white&labelColor=000" />
  <img src="https://img.shields.io/badge/node-%3E%3D18.0-339933?style=for-the-badge&logo=node.js&logoColor=white&labelColor=000" />
  <img src="https://img.shields.io/badge/Express-4.21-000?style=for-the-badge&logo=express&logoColor=white&labelColor=000" />
  <img src="https://img.shields.io/badge/license-MIT-FF6B35?style=for-the-badge&labelColor=000" />
</p>

---

## Indice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como Usar](#como-usar)
- [Configuracao](#configuracao)
- [Comandos](#comandos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Licenca](#licenca)

---

## Sobre

**ShopKeeper** e um bot multifuncional para Discord desenvolvido em **Discord.js v14** com foco em:

- **Loja integrada** com carrinho de compras, estoque e pagamento via **PIX (Mercado Pago)**
- **Sistema de tickets** completo com painel administrativo
- **Verificacao de usuarios** via OAuth2 do Discord
- **Sistema de cargos por posicao** (rankings)
- **Sistema Nitro Free** com resgate por feedback

---

## Funcionalidades

### Loja & Vendas
- Produtos com multiplos campos (variacoes)
- Carrinho de compras interativo
- Cupons de desconto personalizaveis
- Pagamento via **PIX** (Mercado Pago)
- Entrega automatica de produtos
- Logs de pedidos e vendas

### Tickets
- Criacao de tickets com selecao de categoria
- Painel administrativo com opcoes de:
  - Renomear, trancar, reabrir
  - Adicionar/remover usuarios
  - Fechar com transcript
- Sistema de prioridades
- Logs completos de acoes

### Verificacao
- Autenticacao via **OAuth2 do Discord**
- Atribuicao automatica de cargo
- Registro de IP, dispositivo e localizacao
- Webhook de logs
- Integracao com sistema de compras (cargo obrigatorio)

### Extras
- Painel de administracao completo
- Sistema de posicoes (rankings por cargo)
- Sistema de convites (invite tracker)
- Protecao e moderacao
- Comandos de utilidade
- Sistema Nitro Free

---

## Tecnologias

| Tecnologia | Versao | Finalidade |
|-----------|--------|------------|
| [Node.js](https://nodejs.org/) | >= 18 | Runtime |
| [Discord.js](https://discord.js.org/) | 14.18 | API do Discord |
| [Express](https://expressjs.com/) | 4.21 | Servidor HTTP (OAuth) |
| [Mercado Pago](https://www.mercadopago.com.br/) | 2.2 | Pagamentos PIX |
| [quick.db](https://www.npmjs.com/package/quick.db) | 9.1 | Banco de dados local |
| [wio.db](https://www.npmjs.com/package/wio.db) | 4.0 | Banco de dados JSON |
| [discord-oauth2](https://www.npmjs.com/package/discord-oauth2) | 2.12 | Autenticacao OAuth2 |

---

## Como Usar

### Pre-requisitos

- Node.js **18+**
- Um bot no [Discord Developer Portal](https://discord.com/developers/applications)
- Conta no [Mercado Pago](https://www.mercadopago.com.br/) (para vendas)

### Instalacao

```bash
git clone https://github.com/9uz3/ShopKeeper.git
cd ShopKeeper
npm install
```

### Configuracao Rapida

```bash
cp .env.example .env
```

Edite o arquivo **`.env`**:

```env
TOKEN=seu_token_do_bot_aqui
OWNER_ID=seu_id_do_discord_aqui
MP_API_KEY=sua_chave_do_mercado_pago_aqui
```

### Configurar Autenticacao OAuth2

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

## Configuracao

### Via Painel (Recomendado)

Use o comando `/painel` no Discord para acessar o painel de administracao completo:

| Botao | Funcao |
|-------|--------|
| **Loja** | Gerenciar produtos, estoque, posicoes |
| **Ticket** | Configurar sistema de tickets |
| **Boas Vindas** | Mensagens de boas-vindas e antifake |
| **Acoes** | Cargos e canais automaticos |
| **Personalizar** | Cores e aparencia do bot |
| **eCloud** | Configurar OAuth2 e verificacao |
| **Rendimento** | Estatisticas de vendas |
| **Definicoes** | Configuracoes gerais |

---

## Comandos

### Administracao

| Comando | Descricao |
|---------|-----------|
| `/painel` | Abre o painel de administracao |
| `/verify` | Envia botao de verificacao OAuth2 |
| `/dm` | Envia mensagem direta a um usuario |
| `/say` | Envia mensagem como o bot |
| `/lock` | Tranca um canal |
| `/unlock` | Destranca um canal |
| `/perm_add` | Adiciona permissao a um usuario |
| `/perm_remove` | Remove permissao de um usuario |
| `/perm_list` | Lista usuarios com permissao |
| `/close_ticket` | Fecha um ticket manualmente |
| `/vincular_clientes` | Vincula clientes |
| `/entregar` | Entrega manual de produto |
| `/manage_item` | Gerenciar item do estoque |
| `/manage_stock` | Gerenciar estoque |
| `/manage_product` | Gerenciar produto |
| `/create_mass_coupon` | Criar cupons em massa |
| `/remove_mass_coupon` | Remover cupons em massa |
| `/ganerate_pix` | Gerar QR Code PIX |

### Usuarios

| Comando | Descricao |
|---------|-----------|
| `/profile` | Exibe perfil do usuario |
| `/rank` | Exibe ranking de vendas |

---

## Estrutura do Projeto

```
ShopKeeper/
├── ComandosSlash/          # Comandos de barra (/) do Discord
│   ├── Administracao/      # Comandos administrativos
│   ├── ContextMenus/       # Menus de contexto
│   └── Usuarios/           # Comandos de usuario
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
├── Functions/              # Funcoes e logica do bot
├── Handler/                # Handlers de eventos e comandos
├── Lib/                    # Bibliotecas auxiliares
├── routes/                 # Rotas HTTP (Express)
│   ├── callback.js         # Callback OAuth2
│   └── login.js            # Login OAuth2
├── src/                    # Codigo-fonte principal
│   ├── config/             # Configuracoes
│   ├── constants/          # Constantes
│   ├── database/           # Conexao com banco
│   ├── events/             # Eventos src
│   ├── handlers/           # Handlers src
│   ├── services/           # Servicos (tickets, seguranca, etc.)
│   └── utils/              # Utilitarios
├── config.js               # Configuracao principal (token, API keys)
├── index.js                # Entrypoint
├── package.json
└── README.md
```

---

## Licenca

Distribuido sob a licenca **MIT**.

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,50:FF6B35,100:000000&height=120&section=footer" width="100%"/>
  <br/><br/>
  <sub>Feito por <a href="https://github.com/9uz3">Andriel</a></sub>
</div>
