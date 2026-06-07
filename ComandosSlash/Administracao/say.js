const Discord = require("discord.js")
const config = require("../../config.js")


module.exports = {
    name: "say",
    description: "Enviar Mensagem",
    type: Discord.ApplicationCommandType.ChatInput,
    defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'texto',
            description: 'Oque Deseja Enviar?.',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (Client, interaction) => {

        if (!interaction.member.permissions.has("Administrator")) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando. ðŸ”´`, flags: [Discord.MessageFlags.Ephemeral] })
            setTimeout(() => { interaction.deleteReply(); }, 3000);
        } else {
            let dados = interaction.options.getString('texto')
                interaction.reply({ content: `✅・Mensagem enviada com êxito. Verifique agora mesmo!`, flags: [Discord.MessageFlags.Ephemeral] })
                interaction.channel.send({content: `${dados}`})
                setTimeout(() => { interaction.deleteReply(); }, 5000);
            }

        }

    }

