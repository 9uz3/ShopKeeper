const { ApplicationCommandType } = require("discord.js");
const path = require("path");
const fs = require("fs").promises;
const { configuracao } = require("../../DataBaseJson");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const Discord = require("discord.js");

module.exports = {
  name: "vincular_clientes",
  description: "Vincular clientes ao seu servidor",
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,

  run: async (client, interaction) => {
    const perm = await getPermissions(client.user.id);
    if (perm === null || !perm.includes(interaction.user.id)) {
      return interaction.reply({ content: `âŒ | Você não possui permissão para usar esse comando.`, flags: [Discord.MessageFlags.Ephemeral] });
    }

    try {
      const clientespach = path.resolve(__dirname, '../../DataBaseJson/clients.json');
      const data = await fs.readFile(clientespach, 'utf8');
      const clientes = JSON.parse(data);

      let totalClientes = clientes.length;
      let clientesSetadosComSucesso = 0;

      const initialMessage = await interaction.reply({
        content: `🔄 | Processo de sincronização de clientes foi iniciado.\n👥 | Progresso: \`0\`/\`${totalClientes}\` clientes sincronizados.`,
        flags: [Discord.MessageFlags.Ephemeral]
      });

      for (let i = 0; i < totalClientes; i++) {
        const clientId = clientes[i];
        try {
          const member = await interaction.guild.members.fetch(clientId);
          if (member) {
            await member.roles.add(configuracao.get(`ConfigRoles.cargoCliente`));
            clientesSetadosComSucesso++;
          }
        } catch (error) {
        }

        await initialMessage.edit({
          content: `🔄 | Processo de sincronização de clientes foi iniciado.\n👥 | Progresso: \`${clientesSetadosComSucesso}\`/\`${totalClientes}\` clientes sincronizados.`,
          flags: [Discord.MessageFlags.Ephemeral]
        });
      }

      await initialMessage.edit({
        content: `✅ | Processo de sincronização de clientes concluído. \`${clientesSetadosComSucesso}\` clientes foram sincronizados com sucesso.`,
        flags: [Discord.MessageFlags.Ephemeral]
      });

    } catch (error) {
      await interaction.reply({ content: `âŒ | Ocorreu um erro ao tentar sincronizar os clientes.`, flags: [Discord.MessageFlags.Ephemeral] });
    }
  }
};


