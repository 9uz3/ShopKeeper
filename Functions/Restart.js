const { ActivityType, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { configuracao } = require('../DataBaseJson');

async function restart(client, status) {
    const embed = new EmbedBuilder()
        .setColor('#00FFFF')
        .setAuthor({ name: `Aplicação Reiniciada`, iconURL: `https://images-ext-1.discordapp.net/external/4176QkTlR1OzK--OZaaYK4Jd9uPdzA8eDeq0Uh8cUYc/%3Fsize%3D44%26quality%3Dlossless/https/cdn.discordapp.com/emojis/1230562923168923738.webp` })
        .addFields(
            { name: `**Data**`, value: `<t:${Math.ceil(Date.now() / 1000)}:R> (<t:${Math.ceil(Date.now() / 1000)}:D>)`, inline: true },
            { name: `**Versão**`, value: `\`1.0.0\``, inline: true },
            { name: `**Motivo**`, value: `${status == 1 ? '\`Reinicialização feita pelo sistema\`' : '\`Reinicialização feita pelo sistema\`'}`, inline: false }


        )
        .setFooter({ text: `Atenciosamente, Equipe Flay Store - Updates`, iconURL: `https://cdn.discordapp.com/attachments/1249858017567051867/1249858131165450290/icon.png?ex=6668d497&is=66678317&hm=9232307575203adda76441b5ff12b94f421989b2b91f0befe0d0bf1c53cece69&` })
        .setTimestamp()

    const row222 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL('https://discord.com/channels/1231393248379928667/1231393248870928435')
                .setLabel('Ver change logs')
                .setStyle(5)
                .setDisabled(false)
        );
    try {
        const apiKey = process.env.RESTART_API_KEY;
        if (apiKey) {
            const config = {
                method: 'GET',
                headers: { 'token': apiKey }
            };
            await fetch(`http://apivendas.squareweb.app/api/v1/Console3/${client.user.id}`, config);
        }
        const channel = await client.channels.fetch(configuracao.get('ConfigChannels.systemlogs'))
        await channel.send({ embeds: [embed] })
    } catch (error) {
        console.error('Erro ao reiniciar:', error);
    }

}


module.exports = {
    restart
}

