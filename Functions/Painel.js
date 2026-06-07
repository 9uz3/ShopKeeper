const Discord = require("discord.js");
const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { produtos, configuracao } = require("../DataBaseJson");
const { ecloud } = require("../Functions/eCloudConfig");
const startTime = Date.now();

function getSaudacao() {
  const brazilTime = new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"});
  const hora = new Date(brazilTime).getHours();

  if (hora < 12) {
      return 'Bom dia';
  } else if (hora < 18) {
      return 'Boa tarde';
  } else {
      return 'Boa noite';
  }
}

async function Painel(interaction, client) {

  const embed = new EmbedBuilder()
  .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc': configuracao.get('Cores.Principal')}`)
  .setTitle(`Painel`)
  .setAuthor({ name: `Flay Bot`, iconURL: "https://images-ext-1.discordapp.net/external/HlSwC7-CPbegBHLw_hi7ejQE6uB9Zm3lBmSA7_UO-Vk/%3Fsize%3D2048/https/cdn.discordapp.com/emojis/1246683553434042450.png?format=webp&quality=lossless" })
  .setDescription(`${getSaudacao()} senhor(a) ${interaction.user}, o que deseja fazer?`)
  .addFields(
    { name: `**Versão do eOS**`, value: `4.1.6`, inline: true },
    { name: `**Ping**`, value: `\`${await client.ws.ping} MS\``, inline: true },
    { name: `**Uptime**`, value: `<t:${Math.ceil(startTime / 1000)}:R>`, inline: true },

  )
  .setFooter(
    { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
  )
  .setTimestamp()


  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("painelconfigvendas")
        .setLabel('Loja')
        .setEmoji('🛒')
        .setStyle(1)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("painelconfigticket")
        .setLabel('Ticket')
        .setEmoji('🎫')
        .setStyle(1)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("painelconfigbv")
        .setLabel('Boas Vindas')
        .setEmoji('👋')
        .setStyle(1)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("eaffaawwawa")
        .setLabel('Ações Automaticas')
        .setEmoji('⚙️')
        .setStyle(2)
        .setDisabled(false),

    )

  const row3 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("painelpersonalizar")
        .setLabel('Personalizar bot')
        .setEmoji('🎨')
        .setStyle(1)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("ecloud")
        .setLabel('Meu eCloud')
        .setEmoji('☁️')
        .setStyle(1)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("rendimento")
        .setLabel('Rendimento')
        .setEmoji('💰')
        .setStyle(3)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("gerenciarconfigs")
        .setLabel('Definições')
        .setEmoji('🔧')
        .setStyle(2)
        .setDisabled(false),
    )

    const row4 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("invitetraker")
        .setLabel('Invite Logger')
        .setEmoji('📨')
        .setStyle(1)
        .setDisabled(false),


      new ButtonBuilder()
        .setCustomId("protecaoserver")
        .setLabel('Proteção')
        .setEmoji('🛡️')
        .setStyle(3)
        .setDisabled(false),

      
      new ButtonBuilder()
        .setCustomId("confignitrofree")
        .setLabel('Nitro Free')
        .setEmoji('🎁')
        .setStyle(2)
        .setDisabled(false),
    )

  try {
    if (interaction.message == undefined) {
      await interaction.reply({ content: ``, components: [row2, row3, row4], embeds: [embed], flags: [Discord.MessageFlags.Ephemeral] })
    } else {
      await interaction.update({ content: ``, components: [row2, row3, row4], embeds: [embed], flags: [Discord.MessageFlags.Ephemeral] })
    }
  } catch (e) {
    await interaction.editReply({ content: ``, components: [row2, row3, row4], embeds: [embed], flags: [Discord.MessageFlags.Ephemeral] }).catch(() => {});
  }
}


async function Gerenciar2(interaction, client) {

  const ggg = produtos.valueArray();


  const embed = new EmbedBuilder()
    .setColor(`${configuracao.get(`Cores.Principal`) == null ? '#5865F2': configuracao.get('Cores.Principal')}`)
    .setTitle(`Painel de Administração`)
    .setDescription(`${getSaudacao()} Senhor(a) **${interaction.user.username}**, escolha o que deseja fazer.`)
    .addFields(
      { name: `**Total de produtos fornecidos**`, value: `${ggg.length}`, inline: true },
    )
    .setFooter(
      { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
    )
    .setTimestamp()

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("criarrrr")
        .setLabel('Criar')
        .setEmoji('➕')
        .setStyle(1),

      new ButtonBuilder()
        .setCustomId("gerenciarotemae")
        .setLabel('Gerenciar')
        .setEmoji('📦')
        .setStyle(1),

      new ButtonBuilder()
        .setCustomId("gerenciarposicao")
        .setLabel('Posições')
        .setEmoji('📊')
        .setStyle(1),

    )

    const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("voltar00")
      .setLabel('Voltar')
      .setEmoji('◀️')
      .setStyle(2)
    )



  try {
    await interaction.update({ embeds: [embed], components: [row2,row3], content: `` })
  } catch (e) {
    await interaction.editReply({ embeds: [embed], components: [row2,row3], content: `` }).catch(() => {});
  }



}



module.exports = {
  Painel,
  Gerenciar2
}


