const { EmbedBuilder } = require("discord.js");
const { configuracao } = require("../../DataBaseJson");

module.exports = {
    name: 'messageUpdate',
    run: async (oldMessage, newMessage, client) => {
        if (!oldMessage.guild) return;

        if (oldMessage.partial) {
            try {
                oldMessage = await oldMessage.fetch();
            } catch {
                return;
            }
        }

        if (newMessage?.partial) {
            try {
                newMessage = await newMessage.fetch();
            } catch {
                return;
            }
        }

        if (!oldMessage.author || oldMessage.author.bot || !newMessage) return;
        if (oldMessage.content === newMessage.content) return;

        const embed = new EmbedBuilder()
            .setColor(`#FFA500`)
            .setAuthor({ name: `Mensagem Editada`, iconURL: `https://media.discordapp.net/attachments/1223385767816986754/1250237861379440640/eu_tambem_tenho_24.png?ex=666a363e&is=6668e4be&hm=059c8660b7e0fda863bd2f8a42915292455d6ed10b084d798b4b37300b88676c&=&format=webp&quality=lossless` })
            .setDescription(`O usuário ${oldMessage.author} acabou de editar uma mensagem`)
            .addFields(
                { name: `**Autor**`, value: `${oldMessage.author} \`(${oldMessage.author.id})\``, inline: true },
                { name: `**Canal**`, value: `${oldMessage.channel}`, inline: true },
                { name: `**Mensagem Antiga**`, value: `${oldMessage.content}`, inline: false },
                { name: `**Mensagem Nova**`, value: `${newMessage.content}`, inline: false },
            )
            .setFooter({ text: oldMessage.guild.name, iconURL: oldMessage.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        const logChannelId = configuracao.get(`ConfigChannels.mensagens`);
        const logChannel = client.channels.cache.get(logChannelId);

        if (logChannel) {
            logChannel.send({ embeds: [embed] });
        } else {
        }
    }
};

