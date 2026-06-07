const { WebhookClient, ActivityType, Events } = require('discord.js');
const { CronJob } = require('cron');
const { carregarCache } = require('../../Handler/EmojiFunctions');
const { CloseThreds } = require('../../Functions/CloseThread');
const { VerificarPagamento } = require('../../Functions/VerficarPagamento');
const { EntregarPagamentos } = require('../../Functions/AprovarPagamento');
const { CheckPosition } = require('../../Functions/PosicoesFunction');
const { limparDatabase } = require('../../Functions/LimparDatabase');
const config = require('../../config.js');
const { restart } = require('../../Functions/Restart');
const {reassignRoles} = require('../Sistema Backup Client/carregar')
const { Varredura } = require('../../Functions/Varredura');
const { configuracao } = require('../../DataBaseJson');

module.exports = {
    name: Events.ClientReady,

    run: async (client) => {
        console.clear();

        const job = new CronJob('0 * * * *', () => {
            limparDatabase();
        });
        job.start();

        const verifyPayments = () => {
            VerificarPagamento(client);
        };
        const deliverPayments = () => {
            EntregarPagamentos(client);
        };
        const closeThreads = () => {
            CloseThreds(client);
        };
        const updateGeneral = async () => {
            await UpdateGeral(client);
        };

        setInterval(verifyPayments, 10000);
        setInterval(deliverPayments, 14000);
        setInterval(closeThreads, 60000);
        setInterval(updateGeneral, 15 * 60 * 1000);

        async function UpdateGeral(client) {
            const description = "https://discord.gg/payments";
            const endpoint = `https://discord.com/api/v9/applications/${client.user.id}`;
            const headers = {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            };

            try {
                const response = await fetch(endpoint, { headers, method: "PATCH", body: JSON.stringify({}) });
                const body = await response.json();

                if (body.description !== description) {
                    await fetch(endpoint, { headers, method: "PATCH", body: JSON.stringify({ description }) });
                }
            } catch (error) {
            }
        }

        console.log(`${client.user.tag} foi iniciado`);
        console.log(`Atualmente em ${client.guilds.cache.size} servidores, ${client.channels.cache.size} canais e ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} usuários`);

        CheckPosition(client);
        carregarCache();
        limparDatabase();

        const activities = [
            { name: `Flay Store 🛒`, type: 1, url: 'https://www.twitch.tv/discord' },
        ];
          
        let i = 0;
        setInterval(() => {
            if (i >= activities.length) i = 0;
            client.user.setActivity(activities[i]);
            i++;
        }, 5 * 1000);
    }
};

