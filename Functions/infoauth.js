const Discord = require("discord.js");
const { ApplicationCommandType, EmbedBuilder, Webhook, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = require("discord.js")
const { owner, url, clientid, secret, webhook_logs, role, guild_id } = require("../DataBaseJson/configauth.json");
const { JsonDatabase } = require("wio.db");
const users = new JsonDatabase({ databasePath: "./DataBaseJson/users.json" });
const axios = require("axios");
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();

async function infoauth(interaction, client) {

    const all = await users.all().filter(a => a.data.username);
    const uri = oauth.generateAuthUrl({
        clientId: clientid,
        clientSecret: secret,
        scope: ["identify", "guilds.join"],
        redirectUri: `${url}/auth/callback`
    });


    const embed = new EmbedBuilder().setTitle(` ”” Importantes eCloud`)
    .setColor("Blue")
    .setDescription(`Configure as partes mais importantes do eCloud!`)
    .addFields(
        {
            name: "Client ID:",
            value: `\`${clientid}\``,
            inline: true
        },
        {
            name: "Secret:",
            value: `||${secret}||`,
            inline: true
        },
        {
            name: "ID Servidor",
            value: `\`${guild_id}\``,
            inline: true
        },
    );



  const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("clientid")
                .setLabel('Editar Client Id')
                .setEmoji(`1240459731584290929`)
                .setStyle(1),

            new ButtonBuilder()
                .setCustomId("secret")
                .setLabel('Editar Secret')
                .setEmoji(`1237422648598724638`)
                .setDisabled(false)
                .setStyle(1)
        )
    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltarconfigauth")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2)

        )

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("svid")
                .setLabel('Editar Id Servidor')
                .setEmoji(`1240450763595976715`)
                .setStyle(1)

        )

    await interaction.update({ content: ``, embeds: [embed], flags: [Discord.MessageFlags.Ephemeral], components: [row2, row4, row3] })

}

module.exports = {
    infoauth
}

