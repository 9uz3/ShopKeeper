const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const { configuracao } = require("../../DataBaseJson");

module.exports = {
  name: "perm_list",
  description: "Confira os usuários autorizados para gerenciar meu sistema.",
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,

  run: async (client, interaction, message) => {
    const { dono } = require("../../config.js");
    const permsFilePath = path.join(__dirname, '..', '..', 'DataBaseJson', 'perms.json');

    // Verifica se o arquivo de permissões existe
    if (!fs.existsSync(permsFilePath)) {
      return interaction.reply({ content: "âŒ O arquivo de permissões não foi encontrado.", flags: [Discord.MessageFlags.Ephemeral] });
    }

    // Verifica se o usuário é o dono do bot
    if (dono !== interaction.user.id) {
      return interaction.reply({ content: `âŒ Você não tem permissão para utilizar este comando.`, flags: [Discord.MessageFlags.Ephemeral] });
    }

    let perms;
    try {
      perms = require(permsFilePath);
    } catch (error) {
      console.error("Erro ao carregar o arquivo de permissões:", error);
      return interaction.reply({ content: "âŒ O arquivo de permissões não pôde ser carregado.", flags: [Discord.MessageFlags.Ephemeral] });
    }

    // Coleta membros com permissões configuradas
    const membersWithPerms = [];
    for (const userId in perms) {
      try {
        const member = await interaction.guild.members.fetch(userId);
        membersWithPerms.push(member);
      } catch (error) {
        console.error(`Erro ao buscar membro com ID ${userId}:`, error);
      }
    }

    // Verifica se há membros com permissões
    if (membersWithPerms.length === 0) {
      return interaction.reply({ content: "Nenhum membro foi autorizado a utilizar o BOT.", flags: [Discord.MessageFlags.Ephemeral] });
    }

    // Monta a lista de membros com permissões
    let membersList = '';
    for (const member of membersWithPerms) {
      membersList += `ðŸ”§ - ${member} \`(${member.id})\`\n`;
    }

    // Cria e envia o embed com os membros autorizados
    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setTitle(`:regional_indicator_a: ”” Membros Autorizados (${membersWithPerms.length})`)
      .setDescription(membersList)
      .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc': configuracao.get('Cores.Principal')}`)
      .setFooter(
        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
      )
    interaction.reply({ embeds: [embed], flags: [Discord.MessageFlags.Ephemeral] });
  }
}


