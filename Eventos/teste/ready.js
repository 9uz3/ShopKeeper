const { ActivityType, Events } = require('discord.js');
const { VerificarPagamento } = require('../../Functions/VerficarPagamento');
const { EntregarPagamentos } = require('../../Functions/AprovarPagamento');
const { CloseThreds } = require('../../Functions/CloseThread');
const { Varredura } = require('../../Functions/Varredura');

module.exports = {
    name: Events.ClientReady,
    once: true,
    run: async (client) => {
        console.log(`✅ Bot online como ${client.user.tag}`);

        client.user.setPresence({
            activities: [{
                name: '🎫 Sistema de Tickets',
                type: ActivityType.Playing,
            }],
            status: 'online',
        });

        setInterval(() => {
            VerificarPagamento(client);
            EntregarPagamentos(client);
            CloseThreds(client);
        }, 15000);

        setInterval(() => {
            Varredura(client);
        }, 120000);
    },
};
