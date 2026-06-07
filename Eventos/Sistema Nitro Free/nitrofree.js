const Discord = require("discord.js");
const { ApplicationCommandType, PermissionsBitField, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require("discord.js");
const { xvideos, configuracao } = require("../../DataBaseJson");

module.exports = {
    name: 'interactionCreate',
    run: async (interaction, client) => {
        try {
            if (interaction.isButton() && interaction.customId === 'confignitrofree') {
                const guild = interaction.guild;
                let g;

                try {
                    g = await xvideos.get(`${guild.id}`);
                } catch (error) {
                    console.error(`Erro ao obter dados para guild ${guild.id}:`, error);
                    g = null;
                }

                if (!g) {
                    try {
                        await xvideos.set(`${guild.id}`, {
                            "channel_feedback": null,
                            "feedbacks": [
                                "10/10",
                                "top",
                                "gostei",
                                "loja boa",
                                "parabéns"
                            ],
                            "message": {
                                "content": "# FEEDBACK\n- Resgate sua recompensa",
                                "embeds": []
                            },
                            "button": {
                                "style": 3,
                                "label": "Resgatar",
                                "emoji": "ðŸŽ"
                            }
                        });
                        console.log(`Dados definidos para guild ${guild.id}`);
                    } catch (error) {
                        console.error(`Erro ao definir dados para guild ${guild.id}:`, error);
                        return interaction.reply({ content: "Ocorreu um erro ao configurar o bot de avaliações.", flags: [Discord.MessageFlags.Ephemeral] });
                    }
                }

                const actionRow2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('voltar00')
                            .setLabel('Voltar')
                            .setEmoji('1178068047202893869')
                            .setStyle(2)
                    );

                await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(configuracao.get('Cores.Principal') || '0cd4cc')
                            .setTitle(`ðŸŽ Configure o seu bot de avaliações`)
                            .setDescription("Configure o seu bot de avaliações de acordo com as suas preferências.")
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId("config_msg")
                                    .setPlaceholder("ðŸ’¬ - Configure as mensagens")
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .addOptions(
                                        {
                                            label: "Configurar canal de avaliações",
                                            value: "channel_avaliation"
                                        },
                                        {
                                            label: "Configurar feedbacks permitidos",
                                            value: "feedbackspermission"
                                        },
                                        {
                                            label: "Configurar mensagem de resgate",
                                            value: "msg_resgate"
                                        },
                                        {
                                            label: "Configurar estoque de nitro",
                                            value: "stock_nitro"
                                        }
                                    )
                            ), 
                        actionRow2
                    ],
                    flags: [Discord.MessageFlags.Ephemeral]
                });
            }
        } catch (error) {
            console.error("Error handling interaction:", error);
            try {
                await interaction.reply({ content: "Ocorreu um erro ao processar sua solicitação.", flags: [Discord.MessageFlags.Ephemeral] });
            } catch (err) {
                console.error("Erro ao responder com mensagem de erro:", err);
            }
        }
    }
};


