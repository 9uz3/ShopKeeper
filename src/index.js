require('./services/logger');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const express = require('express');
const config = require('./config');
const database = require('./database');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildModeration,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.ThreadMember,
    ]
});

client.setMaxListeners(20);
client.slashCommands = new Collection();

const { loadEvents } = require('./handlers/eventHandler');
const { loadCommands } = require('./handlers/commandHandler');

loadEvents(client);
loadCommands(client);

const app = express();
app.use(require('../routes/callback'));
app.use(require('../routes/login'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

process.on('unhandledRejection', (reason, promise) => {
    if (reason?.code === 10003 || reason?.code === 10062) return;
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error, origin) => {
    if (error?.code === 10003 || error?.code === 10062) return;
    console.error('Uncaught Exception:', error, 'origin:', origin);
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
    if (error?.code === 10003 || error?.code === 10062) return;
    console.error('Uncaught Exception Monitor:', error, 'origin:', origin);
});

process.on('SIGINT', () => {
    console.log('Bot encerrado via SIGINT');
    process.exit(0);
});

client.login(config.token).catch(err => {
    console.error('Falha ao fazer login:', err);
    process.exit(1);
});

module.exports = client;
