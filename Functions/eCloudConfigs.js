const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, InteractionType } = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = require("discord.js")
const Discord = require("discord.js")

async function configauth(interaction, client) {


    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("cargoauth")
                .setEmoji(`1249510835735498814`)
                .setLabel('Cargo Verificado')
                .setStyle(1),

            new ButtonBuilder()
                .setCustomId("logauth")
                .setLabel('Configurar WebHook')
                .setEmoji('1249510835735498814')
                .setStyle(1),

        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
             .setCustomId("infosauth")
             .setLabel('Minhas Informações')
             .setEmoji('1236318308756750438')
             .setStyle(1),
            new ButtonBuilder()
             .setCustomId("infoauth")
             .setLabel('Configurações Obrigatorias')
             .setEmoji('1236318155056349224')
             .setStyle(1),

        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltarauth")
                .setEmoji(`1178068047202893869`)
                .setLabel('Voltar')
                .setStyle(2)
        )

    if (interaction.message == undefined) {
        interaction.reply({ embeds: [], components: [row1, row2, row3], content: `Oque deseja configurar?` })
    } else {
        interaction.update({ embeds: [], components: [row1, row2, row3], content: `Oque deseja configurar?` })
    }

}


module.exports = {
    configauth
}


