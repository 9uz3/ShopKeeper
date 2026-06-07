const Discord = require("discord.js")
const config = require("../../config.js");
const { url, clientid } = require("../../DataBaseJson/configauth.json");
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();

module.exports = {
    name: "verify",
    description: "Enviar Botão de Verificação",
    type: Discord.ApplicationCommandType.ChatInput,
    defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has("Administrator")) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, flags: [Discord.MessageFlags.Ephemeral] });
            setTimeout(() => { interaction.deleteReply(); }, 3000);
        } else {
            const verifyUrl = (url && clientid)
                ? `${url}/auth/login`
                : "https://discord.com/oauth2/authorize?client_id=1241397849195810846&redirect_uri=https://restorecord.com/api/callback&response_type=code&scope=identify+guilds.join+email&state=1250189025189298226"

            const botao = new Discord.ButtonBuilder()
                .setLabel("Verificar-se")
                .setURL(verifyUrl)
                .setStyle(Discord.ButtonStyle.Link);
            const botao2 = new Discord.ButtonBuilder()
                .setCustomId('faq')
                .setLabel('Por que se verificar?')
                .setStyle(Discord.ButtonStyle.Secondary);
            let row = new Discord.ActionRowBuilder().addComponents(botao, botao2);
            
            await interaction.channel.send({ 
                content: "# __Verificação Flay Store__\n - Sua verificação é crucial para garantir a segurança do servidor e manter nossa comunidade protegida.\n - Também é essencial concluir a verificação para realizar compras no servidor e não perder o acesso aos nossos serviços.", 
                components: [row],
                files: ["https://cdn.discordapp.com/attachments/1249858017567051867/1264466015039787129/verifique-se.jpg"]
            });
            interaction.reply({ content: `✅`, flags: [Discord.MessageFlags.Ephemeral] });
        }
    }
};

