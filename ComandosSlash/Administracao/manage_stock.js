const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { MessageStock } = require("../../Functions/ConfigEstoque.js");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const Discord = require("discord.js");

module.exports = {
  name: "manage_stock",
  description: "Use para configurar minhas funções",
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,
  options: [{ name: "item", description: "-", type: 3, required: true, autocomplete: true }],

  run: async (client, interaction, message) => {

    const perm = await getPermissions(client.user.id)
    if (perm === null || !perm.includes(interaction.user.id)) {
      return interaction.reply({ content: `âŒ | Você não possui permissão para usar esse comando.`, flags: [Discord.MessageFlags.Ephemeral] });
    }

    if (interaction.options._hoistedOptions[0].value == 'nada') return interaction.reply({ content: `Nenhum item registrado em seu BOT`, flags: [Discord.MessageFlags.Ephemeral] })


    const separarpor_ = interaction.options._hoistedOptions[0].value.split('_')
    const produtoname = separarpor_[0]
    const camponame = separarpor_[1]

    MessageStock(interaction, 1, produtoname, camponame)

  }
}


