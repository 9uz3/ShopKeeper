const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { configuracao, tickets } = require("../DataBaseJson");

async function CreateTicket(interaction, valor) {
    await interaction.reply({ content: `🔄 | Aguarde estamos criando seu Ticket!`, flags: [Discord.MessageFlags.Ephemeral] });

    const ticketFunction = tickets.get(`tickets.funcoes.${valor}`);
    const appearance = tickets.get(`tickets.aparencia`);
    const categoriaId = tickets.get(`tickets.categoria`);

    if (!ticketFunction || Object.keys(ticketFunction).length === 0) {
        return interaction.editReply({ content: `❌ | Essa função não existe!`, flags: [Discord.MessageFlags.Ephemeral] });
    }

    if (!categoriaId) {
        return interaction.editReply({ content: `❌ | Nenhuma categoria foi configurada para os tickets! Peça para um administrador configurar.`, flags: [Discord.MessageFlags.Ephemeral] });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.editReply({ content: `❌ | Eu não tenho permissão "Gerenciar Canais" necessária para criar o ticket.`, flags: [Discord.MessageFlags.Ephemeral] });
    }

    const existingChannel = interaction.guild.channels.cache.find(
        ch => ch.name.includes(interaction.user.id) && ch.parentId === categoriaId
    );
    if (existingChannel) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${existingChannel.id}`)
                .setLabel('Ir para o Ticket')
                .setStyle(5)
        );
        return interaction.editReply({ content: `❌ | Você já possui um ticket aberto.`, components: [row], flags: [Discord.MessageFlags.Ephemeral] });
    }

    try {
        const overwrites = [
            {
                id: interaction.guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            },
            {
                id: interaction.guild.members.me.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels],
            },
        ];

        const admRoleId = configuracao.get('ConfigRoles.cargoadm');
        if (admRoleId && interaction.guild.roles.cache.has(admRoleId)) {
            overwrites.push({
                id: admRoleId,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }

        const supRoleId = configuracao.get('ConfigRoles.cargosup');
        if (supRoleId && interaction.guild.roles.cache.has(supRoleId)) {
            overwrites.push({
                id: supRoleId,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }

        const channel = await interaction.guild.channels.create({
            name: `${valor}・${interaction.user.username}・${interaction.user.id}`,
            type: ChannelType.GuildText,
            parent: categoriaId,
            permissionOverwrites: overwrites,
            reason: 'Ticket aberto',
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${channel.id}`)
                .setLabel('Ir para o Ticket')
                .setStyle(5)
        );

        await interaction.editReply({ content: `✅ Ticket criado com sucesso!`, components: [row], flags: [Discord.MessageFlags.Ephemeral] });

        const embed = new EmbedBuilder()
            .setColor(`${configuracao.get(`Cores.Principal`) == null ? '#5865F2' : configuracao.get('Cores.Principal')}`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(valor)
            .setDescription(ticketFunction.descricao || ticketFunction.predescricao)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        if (ticketFunction.banner) {
            embed.setImage(ticketFunction.banner);
        }

        if (appearance.color) {
            embed.setColor(appearance.color);
        }

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('lembrar123')
                .setLabel('Lembrar')
                .setEmoji('🔔')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId('assumir')
                .setLabel('Assumir')
                .setEmoji('✋')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId('deletar')
                .setLabel('Deletar')
                .setEmoji('🗑️')
                .setStyle(4)
        );

        await channel.send({
            components: [actionRow],
            embeds: [embed],
            content: `${interaction.user} ${configuracao.get('ConfigRoles.cargoadm') ? `<@&${configuracao.get('ConfigRoles.cargoadm')}>` : ''} ${configuracao.get('ConfigRoles.cargosup') ? `<@&${configuracao.get('ConfigRoles.cargosup')}>` : ''}`
        });
    } catch (error) {
        console.error('Erro ao criar ticket:', error);
        try {
            await interaction.editReply({ content: `❌ | Erro ao criar o ticket: ${error.message}`, flags: [Discord.MessageFlags.Ephemeral] });
        } catch (e) {
        }
    }
}

module.exports = {
    CreateTicket
};
