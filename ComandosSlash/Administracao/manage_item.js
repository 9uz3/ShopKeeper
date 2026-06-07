const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const { GerenciarCampos2 } = require("../../Functions/GerenciarCampos");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const db = new QuickDB();
const Discord = require("discord.js");

module.exports = {
  name: "manage_item",
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

    GerenciarCampos2(interaction, camponame, produtoname)



  }
}


