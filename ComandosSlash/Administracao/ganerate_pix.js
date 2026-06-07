const Discord = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder } = require('discord.js');
const { configuracao } = require("../../DataBaseJson");
const { getMpApi } = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const uu = db.table('messagepixgerar');
const { qrGenerator } = require('../../Lib/QRCodeLib');

module.exports = {
  name: "generate_pix",
  description: 'Gere um pagamento via PIX.',
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,
  options: [
    {
      name: "valor",
      description: "Valor para ser resgatado",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "usuario",
      description: "Usuário para quem gerar o pagamento",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "produto",
      description: "Nome do produto a ser comprado",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "estoque",
      description: "Produto a ser entregue ao usuário",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let valor = interaction.options.getNumber('valor');
    let usuario = interaction.options.getUser('usuario');
    let produto = interaction.options.getString('produto');
    let estoque = interaction.options.getString('estoque');

    interaction.reply({ content: `🔄 | Gerando pagamento...` }).then(async msg => {
      try {
        const messages = await interaction.channel.messages.fetch({ limit: 1 });
        const lastMessage = messages.first();

        var payment_data = {
          transaction_amount: Number(valor),
          description: `Pagamento - ${produto}`,
          payment_method_id: 'pix',
          payer: {
            email: `${interaction.user.id}@gmail.com`,
            first_name: `Victor André`,
            last_name: `Ricardo Almeida`,
            identification: {
              type: 'CPF',
              number: '15084299872'
            },
            address: {
              zip_code: '86063190',
              street_name: 'Rua Jácomo Piccinin',
              street_number: '971',
              neighborhood: 'Pinheiros',
              city: 'Londrina',
              federal_unit: 'PR'
            }
          }
        };

        const { MercadoPagoConfig, Payment } = require('mercadopago');
        const clientMP = new MercadoPagoConfig({ accessToken: getMpApi() });
        const payment = new Payment(clientMP);
        const data = await payment.create({ body: payment_data });

        uu.set(lastMessage.id, {
          user: interaction.user.id,
          qrcode: data.point_of_interaction.transaction_data.qr_code_base64,
          pixcopiaecola: data.point_of_interaction.transaction_data.qr_code,
          id: data.id,
        });

        const qr = new qrGenerator({ imagePath: './Lib/aaaaa.png' });
        const qrcode = await qr.generate(data.point_of_interaction.transaction_data.qr_code);
        const buffer = Buffer.from(qrcode.response, "base64");
        const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

        let forFormat = Date.now() + 10 * 60 * 1000;
        let timestamp = Math.floor(forFormat / 1000);

        const embed = new EmbedBuilder()
          .setColor(configuracao.get(`Cores.Principal`) == null ? '#2b2d31' : `${configuracao.get('Cores.Principal')}`)
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setTitle(`Pagamento via PIX criado`)
          .addFields(
            { name: `Código copia e cola`, value: `\`\`\`${data.point_of_interaction.transaction_data.qr_code}\`\`\`` }
          )
          .setFooter({ text: `${interaction.guild.name} - Pagamento expira em 10 minutos.` })
          .setTimestamp()
          .setImage('attachment://payment.png');

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
              .setLabel('Código copia e cola')
              .setEmoji(`1192868868784394381`)
              .setStyle(2),
          );

        msg.edit({ content: ``, embeds: [embed], components: [row], files: [attachment] }).then(msggggg => {
          const interval = setInterval(async () => {
            try {
              const paymentStatus = await payment.get({ id: data.id });
              if (paymentStatus.status === "approved") {
                clearInterval(interval);

                const embedUser = new EmbedBuilder()
                  .setColor(configuracao.get(`Cores.Sucesso`) == null ? `#7464ff` : configuracao.get(`Cores.Sucesso`))
                  .setAuthor({ name: `Pedido #${data.id}`, iconURL: `https://images-ext-1.discordapp.net/external/CjyTPdl-laCV1ZOHeYVVHvqcGAyZL70PEVz9MRkQEqI/%3Fsize%3D2048/https/cdn.discordapp.com/emojis/1249486723520397314.png?format=webp&quality=lossless` })
                  .setDescription(`Seu produto foi anexado a essa mensagem`)
                  .addFields(
                    { name: `**Carrinho**`, value: `\`1x ${produto} - Entrega Automatica\`` },
                    { name: `**Valor pago**`, value: `\`R$ ${Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`` },
                    { name: `**Segue abaixo seus produtos:**`, value: `${estoque}` },
                  )
                  .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                  .setTimestamp();
                
                const embedSales = new EmbedBuilder()
                  .setColor(`#00aeff`)
                  .setAuthor({ name: `Compra Aprovada`, iconURL: `https://cdn.discordapp.com/attachments/1249858017567051867/1264129557322006629/shop.png?ex=669cbfe4&is=669b6e64&hm=529821f649f970c260d3e6d5ade02dbf3a55547841e4d2d0e73533a40f72579b&` })
                  .setDescription(`O usuário <@!${usuario.id}> realizou uma compra no servidor`)
                  .addFields(
                    { name: `**Carrinho**`, value: `\`1x ${produto}\``, inline: true },
                    { name: `**Valor pago**`, value: `\`R$ ${Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\``, inline: true }
                  )
                  .setImage(`https://cdn.discordapp.com/attachments/1249858017567051867/1264128373844873368/compra-aprovada.jpg?ex=669cbeca&is=669b6d4a&hm=46aa5fe08915c0251e3ca49d547aa9cf9dc7dccb3013c49b5e9e5e43b2add650&`)
                  .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                  .setTimestamp();

                // Envia uma mensagem privada ao usuário
                usuario.send({ embeds: [embedUser] });

                // Envia uma notificação no canal de vendas
                const xvideoscameraprive = await client.channels.fetch(configuracao.get(`ConfigChannels.eventbuy`));
                if (xvideoscameraprive) {
                  xvideoscameraprive.send({ embeds: [embedSales] });
                }

                // Atualiza a mensagem para confirmar o pagamento
                msggggg.edit({ content: `✅ | O pagamento foi confirmado!`, embeds: [], components: [], files: []});
              } else if (Date.now() >= forFormat) {
                clearInterval(interval);
                msggggg.edit({ content: `âŒ | O pagamento expirou.`, embeds: [], components: [], files: [] });
              }
            } catch (error) {
              console.error("Error fetching payment status:", error);
            }
          }, 10000); 
          
          setTimeout(async () => {
            try {
              await msggggg.delete();
            } catch (error) {
              console.error("Error deleting message:", error);
            }
          }, 10 * 60 * 1000);
        });

      } catch (error) {
       console.log(error)
      }
    });
  }
};

