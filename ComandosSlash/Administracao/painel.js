const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder,ButtonBuilder } = require("discord.js");
const startTime = Date.now();
const maxMemory = 100;
const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
const memoryUsagePercentage = (usedMemory / maxMemory) * 100;
const roundedPercentage = Math.min(100, Math.round(memoryUsagePercentage));
const { Painel } = require("../../Functions/Painel");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const Discord = require("discord.js");

module.exports = {
  name: "painel",
  description: "Use para configurar minhas funções",
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,

  run: async (client, interaction, message) => {
    const perm = await getPermissions(client.user.id)
    if (perm === null || !perm.includes(interaction.user.id)) {
      return interaction.reply({ content: `âŒ | Você não possui permissão para usar esse comando.`, flags: [Discord.MessageFlags.Ephemeral] });
    }

    Painel(interaction, client)
  }
}


