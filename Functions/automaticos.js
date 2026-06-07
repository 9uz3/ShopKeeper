const Discord = require("discord.js");
const { ApplicationCommandType, EmbedBuilder, Webhook, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { produtos, configuracao } = require("../DataBaseJson");

async function automatico(interaction, client) {


        const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("configrepostagem")
            .setLabel('Repostagem Automatica')
            .setEmoji('1236318155056349224')
            .setDisabled(true)
            .setStyle(1),

            new ButtonBuilder()
            .setCustomId("configmsgauto")
            .setLabel('Mensagem Automatica')
            .setEmoji('1236318155056349224')
            .setStyle(1),

            new ButtonBuilder()
            .setCustomId("configlock")
            .setLabel('Lock Automatico')
            .setEmoji('1236318228477775993')
            .setStyle(1),

        )

        const row3 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("voltar1")
                .setEmoji(`1178068047202893869`)
                .setLabel('Voltar')
                .setStyle(2)

        )

    await interaction.update({ embeds: [], content: `Oque deseja configurar?`, flags: [Discord.MessageFlags.Ephemeral], components: [row2, row3]/* row4, row3]*/ })
}


module.exports = {
    automatico
}

