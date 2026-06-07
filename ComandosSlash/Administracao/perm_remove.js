const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "perm_remove",
  description: "Use este comando para remover a permissão de um usuário para gerenciar meu sistema.",
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,
  options: [
    {
      name: "user",
      description: "Usuário que terá a permissão removida",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    const user = interaction.options.getUser('user');
    const { dono } = require("../../config.js");

    const permsFilePath = path.join(__dirname, '..', '..', 'DataBaseJson', 'perms.json');
    if (!fs.existsSync(permsFilePath)) {
      return interaction.reply({ content: "âŒ O arquivo de permissões não existe.", flags: [Discord.MessageFlags.Ephemeral] });
    }

    if (dono !== interaction.user.id) {
      return interaction.reply({ content: `âŒ Você não possui permissão para remover um usuário da lista de permissões.`, flags: [Discord.MessageFlags.Ephemeral] });
    }

    let perms;
    try {
      perms = require(permsFilePath);
    } catch (error) {
      console.error("Erro ao carregar o arquivo de permissões:", error);
      return interaction.reply({ content: "âŒ O arquivo de permissões não pôde ser carregado.", flags: [Discord.MessageFlags.Ephemeral] });
    }

    if (!perms[user.id]) {
      return interaction.reply({ content: `âŒ O usuário ${user} não está na lista de permissões do BOT.`, flags: [Discord.MessageFlags.Ephemeral] });
    }

    delete perms[user.id];
    try {
      fs.writeFileSync(permsFilePath, JSON.stringify(perms, null, 2));
      interaction.reply({ content: `✅ O usuário ${user} foi removido da lista de permissões do BOT.`, flags: [Discord.MessageFlags.Ephemeral] });
    } catch (error) {
      console.error("Erro ao salvar o arquivo de permissões:", error);
      interaction.reply({ content: "âŒ Houve um erro ao salvar o arquivo de permissões.", flags: [Discord.MessageFlags.Ephemeral] });
    }
  }
}


