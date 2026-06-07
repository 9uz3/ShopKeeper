const Discord = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, ButtonStyle } = require("discord.js");
const { DentroCarrinho1 } = require("./DentroCarrinho");
const { carrinhos, configuracao } = require("../DataBaseJson");

function VerificaçõesCarrinho(infos) {
    if (infos.estoque <= 0) return { error: 400, message: `Sem Stock Dísponivel` }
    return { status: 202 }
}

async function CreateCarrinho(interaction, infos) {
    const verifyRoleId = configuracao.get('ConfigRoles.cargoCliente')
    const configAuthPath = require('path').join(__dirname, '..', 'DataBaseJson', 'configauth.json')
    let configAuth = { url: '', clientid: '' }
    try { configAuth = require(configAuthPath) } catch (e) {}
    const verifyLink = configuracao.get('verifyLink') ||
        (configAuth.url && configAuth.clientid
            ? `${configAuth.url}/auth/login`
            : 'https://discord.com/oauth2/authorize?client_id=1241397849195810846&redirect_uri=https://restorecord.com/api/callback&response_type=code&scope=identify+guilds.join+email&state=1250189025189298226')

    if (verifyRoleId) {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if (!member.roles.cache.has(verifyRoleId)) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setURL(verifyLink)
                        .setLabel('Clique aqui para se verificar')
                        .setStyle(ButtonStyle.Link)
                );

            await interaction.reply({ 
                content: `Este servidor requer que os membros estejam verificados para abrir carrinhos. Por favor, clique no botão abaixo e autorize para continuar.`,
                components: [row],
                flags: [Discord.MessageFlags.Ephemeral] 
            });
            return;
        }
    }

    await interaction.reply({ content: `🔄 Aguarde...`, flags: [Discord.MessageFlags.Ephemeral] }).then(async msg => {
        const thread2222 = interaction.channel.threads.cache.find(x => x.name === `🛒・${interaction.user.username}・${interaction.user.id}`);
        if (thread2222 !== undefined) {
            const row4 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${thread2222.id}`)
                        .setLabel('Ir para o carrinho')
                        .setStyle(5)
                );

            interaction.editReply({ content: `âŒ Você já possuí um carrinho aberto.`, components: [row4] });
            return;
        }

        const thread = await interaction.channel.threads.create({
            name: `🛒・${interaction.user.username}・${interaction.user.id}`,
            autoArchiveDuration: 60,
            type: ChannelType.PrivateThread,
            reason: 'Needed a separate thread for moderation',
            members: [interaction.user.id],
        });

        const row4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${thread.id}`)
                    .setLabel('Ir para o carrinho')
                    .setStyle(5)
            );

        msg.edit({ content: `✅ Carrinho criado!`, components: [row4] });

        await carrinhos.set(thread.id, { user: interaction.user, guild: interaction.guild, threadid: thread.id, infos: infos });

        DentroCarrinho1(thread);
    });
}

module.exports = {
    VerificaçõesCarrinho,
    CreateCarrinho
}


