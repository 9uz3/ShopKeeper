const { ActionRowBuilder, TextInputBuilder, TextInputStyle, InteractionType, ModalBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { configuracao } = require("../../DataBaseJson");
const { Gerenciar } = require("../../Functions/Gerenciar");
const { FormasDePagamentos } = require("../../Functions/FormasDePagamentosConfig");
const axios = require('axios');
const { msgbemvindo } = require("../../Functions/MensagemBemVindo");

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.isButton()) {


            if (interaction.customId === 'editarmensagemboasvindas') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju111idsjjsdua')
                    .setTitle(`Editar Boas Vindas`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`Mensagem`)
                    .setPlaceholder(`Insira aqui sua mensagem, use {member} para mencionar o membro e {guildname} para o servidor.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1000)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`TEMPO PARA APAGAR A MENSAGEM`)
                    .setPlaceholder(`Insira aqui a quantidade em segundos.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                    .setMaxLength(6)


                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('qualcanal')
                    .setLabel(`QUAL CANAL VAI SER ENVIADO?`)
                    .setPlaceholder(`Insira aqui o ID do canal que vai enviar. (ID, ID, ID)`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5);
                await interaction.showModal(modalaAA);

            }



            if (interaction.customId == '+18porra') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('tokenMP')
                    .setTitle(`Alterar Token`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel("TOKEN: APP_USR-000000000000000-XX...")
                    .setPlaceholder("APP_USR-000000000000000-XX...")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(256)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }

            if (interaction.customId == '-18porra') {


                const fernandinhaa = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setURL(`https://stormappsauth.squareweb.app/auth2/${interaction.guild.id}/VendasPrivadaV2`)
                            .setStyle(5)
                            .setLabel('Autorizar Mercado Pago'),
                        new ButtonBuilder()
                            .setCustomId('configurarmercadopago')
                            .setStyle(1)
                            .setEmoji('1178068047202893869')

                    )

                const forFormat = Date.now() + 10 * 60 * 1000

                const timestamp = Math.floor(forFormat / 1000)

                interaction.update({ embeds: [], content: `Autorizar seu **Mercado Pago** á **Storm Applications**\n\n**Status:** Aguardando você autorizar.\nEssa mensagem vai expirar em <t:${timestamp}:R>\n (Para autorizar, clique no botão abaixo, selecione 'Brasil' e clique em Continuar/Confirmar/Autorizar)`, components: [fernandinhaa] }).then(async msgg => {

                    const response2 = await axios.get(`https://stormappsauth.squareweb.app/token2/${interaction.guild.id}/VendasPrivadaV2`);
                    const geral = response2.data;

                    var existia = null

                    if (geral.message !== 'Usuario nao encontado!') {
                        existia = geral.access_token
                    } else {
                        existia = 'Não definido'
                    }

                    var status = false;
                    var intervalId = null;
                    var tempoLimite = 5 * 60 * 1000;

                    if (status === false) {
                        intervalId = setInterval(async () => {
                            const response = await axios.get(`https://stormappsauth.squareweb.app/token2/${interaction.guild.id}/VendasPrivadaV2`);
                            const geral = response.data;

                            if (geral.message == 'Usuario nao encontado!') {
                                status = false;
                            } else {
                                if (existia === 'Não definido' || existia !== geral.access_token) {
                                    status = true;
                                    clearInterval(intervalId);
                                    configuracao.set(`pagamentos.MpAPI`, geral.access_token)

                                    const fernandinhaa = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId('configurarmercadopago')
                                                .setStyle(1)
                                                .setEmoji('1178068047202893869')

                                        )

                                    interaction.editReply({
                                        content: `**Status:** ✅ Autorização bem sucedida!.`,
                                        components: [fernandinhaa]
                                    })
                                }
                            }
                        }, 5000);
                        setTimeout(() => {
                            clearInterval(intervalId);

                            const fernandinhaa = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('voltar1234sda')
                                        .setStyle(1)
                                        .setEmoji('1178068047202893869')

                                )

                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription('âŒ | Você não se cadastrou durante 5 Minutos, cadastre-se novamente!')
                                ],
                                components: [fernandinhaa]
                            })

                        }, tempoLimite);
                    }
                })
            }


            if (interaction.customId === 'voltaradawdwa') {
                Gerenciar(interaction, client)
            }
            if (interaction.customId === 'formasdepagamentos') {
                FormasDePagamentos(interaction)

            }
            if (interaction.customId == 'configurarmercadopago') {

                const fernandona = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("+18porra")
                            .setLabel('Setar Acess Token')
                            .setEmoji(`1224010902798602372`)
                            .setStyle(1)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("-18porra")
                            .setLabel('Autenticar MercadoPago')
                            .setEmoji(`1190793840697806855`)
                            .setStyle(3)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("bloquearbancos")
                            .setLabel('Bloquear Bancos')
                            .setEmoji(`1227962472389017672`)
                            .setStyle(4)
                            .setDisabled(false),

                        new ButtonBuilder()
                            .setCustomId("formasdepagamentos")
                            .setLabel('Voltar')
                            .setEmoji(`1178068047202893869`)
                            .setStyle(2)
                            .setDisabled(false),

                    )

                interaction.update({ embeds: [], components: [fernandona], content: `O que precisa configurar?` })


            }

            if (interaction.customId == 'bloquearbancos') {
                const gfgfggfg = configuracao.get(`pagamentos.BancosBloqueados`)
                var hhhh = ''
                for (const key in gfgfggfg) {
                    const element = gfgfggfg[key];
                    hhhh += `${element}`;
                    if (key !== Object.keys(gfgfggfg)[Object.keys(gfgfggfg).length - 1]) {
                        hhhh += ', ';
                    }
                }

                const modalaAA = new ModalBuilder()
                    .setCustomId('joaozinhompbanco')
                    .setTitle(`Bloquear Bancos`);

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel("BANCOS BLOQUEADOS")
                    .setPlaceholder(`Insira os bancos que deseja recusar separado por vírgula, ex: inter, nu`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(hhhh)
                    .setRequired(false)

                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                modalaAA.addComponents(firstActionRow4);
                await interaction.showModal(modalaAA);
            }
        }
        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'sdaju111idsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');
                let title2 = interaction.fields.getTextInputValue('tokenMP2');
                const title3 = interaction.fields.getTextInputValue('qualcanal');
let arrayDeBancos
                if (title3 !== '') {
                    const stringSemEspacos = title3.replace(/\s/g, '');
                     arrayDeBancos = stringSemEspacos.split(',');
                }else{
                    arrayDeBancos = []
                }

                if (title2 !== '') {
                    if (isNaN(title2) == true) return interaction.reply({ content: `âŒ | Você colocou um tempo incorreto para a mensagem ser apagada!`, flags: [Discord.MessageFlags.Ephemeral] })
                } else {
                    title2 = 0
                }


                configuracao.set('Entradas', {
                    msg: title,
                    tempo: title2,
                    channelid: arrayDeBancos,
                })

                await msgbemvindo(interaction, client)
            }


            if (interaction.customId === 'joaozinhompbanco') {
                const title2 = interaction.fields.getTextInputValue('tokenMP2');



                if (title2 !== ``) {
                    const stringSemEspacos = title2.replace(/\s/g, '');
                    const arrayDeBancos = stringSemEspacos.split(',');
                    configuracao.set(`pagamentos.BancosBloqueados`, arrayDeBancos)
                    const gfgfggfg = configuracao.get(`pagamentos.BancosBloqueados`)
                    var hhhh = ''
                    for (const key in gfgfggfg) {
                        const element = gfgfggfg[key];
                        hhhh += `${element}`;
                        if (key !== Object.keys(gfgfggfg)[Object.keys(gfgfggfg).length - 1]) {
                            hhhh += ', ';
                        }
                    }
                } else {
                    configuracao.set(`pagamentos.BancosBloqueados`, [])
                }

                FormasDePagamentos(interaction)

            }



            if (interaction.customId === 'tokenMP') {
                const tokenMP = interaction.fields.getTextInputValue('tokenMP');
                try {
                    const dsdasda = '10';

                    const payment_data = {
                        transaction_amount: parseFloat(dsdasda),
                        description: 'Testando se o token é Válido | StorM Applications',
                        payment_method_id: 'pix',
                        payer: {
                            email: 'stormappsrecebimentos@gmail.com',
                            first_name: 'Victor André',
                            last_name: 'Ricardo Almeida',
                            identification: {
                                type: 'CPF',
                                number: '15084299872',
                            },
                            address: {
                                zip_code: '86063190',
                                street_name: 'Rua Jácomo Piccinin',
                                street_number: '971',
                                neighborhood: 'Pinheiros',
                                city: 'Londrina',
                                federal_unit: 'PR',
                            },
                        },
                    };

                    const { MercadoPagoConfig, Payment } = require('mercadopago');
                    const clientMP = new MercadoPagoConfig({ accessToken: tokenMP });
                    const payment = new Payment(clientMP);
                    await payment.create({ body: payment_data });


                } catch (error) {

                    await interaction.reply({
                        content: `âš ï¸ | Access Token inválido!\n${error}\n\n> Tutorial para pegar o Access Token: [CliqueAqui](https://www.youtube.com/watch?v=w7kyGZUrkVY&feature=youtu.be)\n> Lembre-se de cadastrar uma chave pix na sua conta mercado pago!`,
                        flags: [Discord.MessageFlags.Ephemeral],
                    });

                    return
                }

                //interaction.deferUpdate()
                FormasDePagamentos(interaction)
                configuracao.set(`pagamentos.MpAPI`, tokenMP);



            }
        }
    }
}

