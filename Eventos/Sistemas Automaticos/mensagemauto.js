const { ChannelType, Permissions, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const automaticosPath = path.resolve(__dirname, '../../DataBaseJson/msgauto.json');

module.exports = {
    name: Events.ClientReady,
    run: async (client) => {
        let msgData = [];

        const loadMsgData = () => {
            if (fs.existsSync(automaticosPath)) {
                try {
                    msgData = JSON.parse(fs.readFileSync(automaticosPath));
                } catch (error) {
                    msgData = [];
                }
            }
        };

        const sendAutoMessages = async () => {
            const now = Date.now();

            for (const data of msgData) {
                for (const chatId of data.chatIds) {
                    const channel = client.channels.cache.get(chatId);
                    if (channel) {
                        // Cria o botão desativado
                        const disabledButton = new ButtonBuilder()
                            .setCustomId('system_message')
                            .setLabel('Mensagem Do Sistema')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true);

                        const row = new ActionRowBuilder().addComponents(disabledButton);

                        const message = await channel.send({
                            content: data.message,
                            components: [row]
                        });

                        // Deletar mensagem após deleteTime
                        setTimeout(() => {
                            message.delete().catch(console.error);
                        }, data.deleteTime * 1000);
                    }
                }
            }
        };

        // Carregar dados de mensagens automáticas inicialmente
        loadMsgData();

        // Agendar tarefa para enviar mensagens automáticas a cada minuto
        schedule.scheduleJob('* * * * *', sendAutoMessages);

        // Observar mudanças no arquivo de configuração
        chokidar.watch(automaticosPath).on('change', () => {
            loadMsgData();
        });
    }
};

