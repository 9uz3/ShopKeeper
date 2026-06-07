<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,50:FF6B35,100:000000&height=200&section=header&text=ShopKeeper&fontSize=70&fontColor=FFFFFF&animation=fadeIn" width="100%"/>
</div>

<h1 align="center">ShopKeeper — Discord Sales, Tickets & Verification Bot</h1>

<p align="center">
  <a href="./README.md"><b>Back to language selection</b></a>
</p>

<p align="center">
  <b>Multi-purpose Discord bot — Sales, Tickets, and User Verification.</b><br/>
  <sub>Complete, modern, and modular.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/discord.js-v14.18-5865F2?style=for-the-badge&logo=discord&logoColor=white&labelColor=000" />
  <img src="https://img.shields.io/badge/node-%3E%3D18.0-339933?style=for-the-badge&logo=node.js&logoColor=white&labelColor=000" />
  <img src="https://img.shields.io/badge/Express-4.21-000?style=for-the-badge&logo=express&logoColor=white&labelColor=000" />
  <img src="https://img.shields.io/badge/license-MIT-FF6B35?style=for-the-badge&labelColor=000" />
</p>

---

## Index

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [How to Use](#how-to-use)
- [Configuration](#configuration)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [License](#license)

---

## About

**ShopKeeper** is a multi-purpose Discord bot built with **Discord.js v14** focused on:

- **Integrated store** with shopping cart, inventory, and **PIX payments (Mercado Pago)**
- **Complete ticket system** with admin panel
- **User verification** via Discord OAuth2
- **Position-based role system** (rankings)
- **Nitro Free system** with feedback redemption

---

## Features

### Store & Sales
- Products with multiple fields (variations)
- Interactive shopping cart
- Customizable discount coupons
- **PIX payment** (Mercado Pago)
- Automatic product delivery
- Order and sales logs

### Tickets
- Ticket creation with category selection
- Admin panel with options for:
  - Rename, lock, reopen
  - Add/remove users
  - Close with transcript
- Priority system
- Complete action logs

### Verification
- Authentication via **Discord OAuth2**
- Automatic role assignment
- IP, device, and location logging
- Webhook logs
- Integration with store system (required role)

### Extras
- Complete administration panel
- Position system (role-based rankings)
- Invite tracking system
- Protection and moderation
- Utility commands
- Nitro Free system

---

## Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Node.js](https://nodejs.org/) | >= 18 | Runtime |
| [Discord.js](https://discord.js.org/) | 14.18 | Discord API |
| [Express](https://expressjs.com/) | 4.21 | HTTP Server (OAuth) |
| [Mercado Pago](https://www.mercadopago.com.br/) | 2.2 | PIX Payments |
| [quick.db](https://www.npmjs.com/package/quick.db) | 9.1 | Local database |
| [wio.db](https://www.npmjs.com/package/wio.db) | 4.0 | JSON database |
| [discord-oauth2](https://www.npmjs.com/package/discord-oauth2) | 2.12 | OAuth2 Authentication |

---

## How to Use

### Prerequisites

- Node.js **18+**
- A bot on the [Discord Developer Portal](https://discord.com/developers/applications)
- A [Mercado Pago](https://www.mercadopago.com.br/) account (for sales)

### Installation

```bash
git clone https://github.com/9uz3/ShopKeeper.git
cd ShopKeeper
npm install
```

### Quick Setup

```bash
cp .env.example .env
```

Edit the **`.env`** file:

```env
TOKEN=your_bot_token_here
OWNER_ID=your_discord_id_here
MP_API_KEY=your_mercado_pago_key_here
```

### Configure OAuth2 Authentication

Edit **`DataBaseJson/configauth.json`**:

```json
{
  "secret": "your_bot_client_secret",
  "clientid": "your_bot_client_id",
  "url": "https://yourdomain.com",
  "webhook_logs": "https://discord.com/api/webhooks/...",
  "role": "verified_role_id",
  "guild_id": "your_server_id"
}
```

On the **Discord Developer Portal**, add the redirect URL:

```
https://yourdomain.com/auth/callback
```

### Start

```bash
npm start
```

---

## Configuration

### Via Panel (Recommended)

Use the `/painel` command in Discord to access the full admin panel:

| Button | Function |
|--------|----------|
| **Store** | Manage products, inventory, positions |
| **Ticket** | Configure the ticket system |
| **Welcome** | Welcome messages and antifake |
| **Actions** | Auto roles and channels |
| **Customize** | Bot colors and appearance |
| **eCloud** | Configure OAuth2 and verification |
| **Revenue** | Sales statistics |
| **Settings** | General settings |

---

## Commands

### Administration

| Command | Description |
|---------|-------------|
| `/painel` | Opens the administration panel |
| `/verify` | Sends OAuth2 verification button |
| `/dm` | Sends a direct message to a user |
| `/say` | Sends a message as the bot |
| `/lock` | Locks a channel |
| `/unlock` | Unlocks a channel |
| `/perm_add` | Adds permission to a user |
| `/perm_remove` | Removes permission from a user |
| `/perm_list` | Lists users with permission |
| `/close_ticket` | Manually closes a ticket |
| `/vincular_clientes` | Links customers |
| `/entregar` | Manual product delivery |
| `/manage_item` | Manage inventory item |
| `/manage_stock` | Manage inventory |
| `/manage_product` | Manage product |
| `/create_mass_coupon` | Create coupons in bulk |
| `/remove_mass_coupon` | Remove coupons in bulk |
| `/ganerate_pix` | Generate PIX QR Code |

### Users

| Command | Description |
|---------|-------------|
| `/profile` | Shows user profile |
| `/rank` | Shows sales ranking |

---

## Project Structure

```
ShopKeeper/
├── ComandosSlash/          # Slash commands
│   ├── Administracao/      # Admin commands
│   ├── ContextMenus/       # Context menus
│   └── Usuarios/           # User commands
├── DataBaseJson/           # JSON database
├── Eventos/                # Discord events
│   ├── Sistema De Configuracao/
│   ├── Sistema De Handlers/
│   ├── Sistema De Invites/
│   ├── Sistema De Logs/
│   ├── Sistema De Protecao/
│   ├── Sistema Nitro Free/
│   ├── Sistemas Automaticos/
│   └── teste/
├── Functions/              # Bot logic
├── Handler/                # Event and command handlers
├── Lib/                    # Libraries
├── routes/                 # HTTP routes (Express)
│   ├── callback.js         # OAuth2 callback
│   └── login.js            # OAuth2 login
├── src/                    # Main source code
│   ├── config/             # Configurations
│   ├── constants/          # Constants
│   ├── database/           # Database connection
│   ├── events/             # Events
│   ├── handlers/           # Handlers
│   ├── services/           # Services (tickets, security, etc.)
│   └── utils/              # Utilities
├── config.js               # Main config (token, API keys)
├── index.js                # Entrypoint
├── package.json
└── README.md
```

---

## License

Distributed under the **MIT** license.

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,50:FF6B35,100:000000&height=120&section=footer" width="100%"/>
  <br/><br/>
  <sub>Made by <a href="https://github.com/9uz3">Andriel</a></sub>
</div>
