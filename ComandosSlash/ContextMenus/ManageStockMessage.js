const Discord = require("discord.js");
const { profileuser } = require("../../Functions/profile");
const { produtos } = require("../../DataBaseJson");
const { MessageStock } = require("../../Functions/ConfigEstoque");

module.exports = {
  name: "ðŸ“¦ Manage Stock",
  type: Discord.ApplicationCommandType.Message,



  run: async (client, interaction) => {

    const message = await interaction.channel.messages.fetch(interaction.targetId);

    // como verifico se e um button ou select menu?
    // console.log(message.components[0].components[0])

    const msg = message.components[0].components[0].data

    if (msg.type == 2) {
      const campo = msg.custom_id.split('_')[1]
      const produto = msg.custom_id.split('_')[2]

      if (produto == undefined) return interaction.reply({ content: `âŒ | Produto não encontrado.`, flags: [Discord.MessageFlags.Ephemeral] })
      const aa = produtos.get(produto)
      if (aa == null) return interaction.reply({ content: `âŒ | Produto não encontrado.`, flags: [Discord.MessageFlags.Ephemeral] })

      MessageStock(interaction, 1, produto, campo, true, true)
    }
    if (msg.type == 3) {
      const campo = msg.options[0].value.split('_')[0]
      const produto = msg.options[0].value.split('_')[1]

      if (produto == undefined) return interaction.reply({ content: `âŒ | Produto não encontrado.`, flags: [Discord.MessageFlags.Ephemeral] })
      const aa = produtos.get(produto)
      if (aa == null) return interaction.reply({ content: `âŒ | Produto não encontrado.`, flags: [Discord.MessageFlags.Ephemeral] })

      const selectMenu = new Discord.StringSelectMenuBuilder()
        .setCustomId('stockhasdhvsudasd')
        .setPlaceholder('Clique aqui para selecionar')
        .addOptions(msg.options)

      const row = new Discord.ActionRowBuilder()
        .addComponents(selectMenu)


      interaction.reply({ content: `${interaction.user} Qual estoque de \`${produto}\` deseja gerenciar?`, flags: [Discord.MessageFlags.Ephemeral], components: [row] })
    }
  }
}

