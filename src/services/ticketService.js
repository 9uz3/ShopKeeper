const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, MessageFlags } = require('discord.js');
const { tickets: ticketDb, config } = require('../database');
const { COLORS } = require('../constants');
const { createTicketEmbed } = require('../utils/embedBuilder');

class TicketService {
    constructor() {
        this.ticketCache = new Map();
        this.slaTimers = new Map();
    }

    async createTicket(interaction, ticketType) {
        await interaction.deferReply({ ephemeral: true });

        const ticketConfig = ticketDb.get(`tickets.funcoes.${ticketType}`);
        const appearance = ticketDb.get('tickets.aparencia');
        const categoryId = ticketDb.get('tickets.categoria');

        if (!ticketConfig) {
            return interaction.editReply({ content: '❌ | Essa função de ticket não existe!' });
        }

        if (!categoryId) {
            return interaction.editReply({ content: '❌ | Nenhuma categoria foi configurada para os tickets!' });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.editReply({ content: '❌ | Não tenho permissão para gerenciar canais.' });
        }

        const existingChannel = interaction.guild.channels.cache.find(
            ch => ch.name.includes(interaction.user.id) && ch.parentId === categoryId
        );
        if (existingChannel) {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${existingChannel.id}`)
                    .setLabel('Ir para o Ticket')
                    .setStyle(ButtonStyle.Link)
            );
            return interaction.editReply({ content: '❌ | Você já possui um ticket aberto.', components: [row] });
        }

        try {
            const overwrites = [
                { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                { id: interaction.guild.members.me.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels] },
            ];

            const adminRoleId = config.get('ConfigRoles.cargoadm');
            const supportRoleId = config.get('ConfigRoles.cargosup');

            if (adminRoleId && interaction.guild.roles.cache.has(adminRoleId)) {
                overwrites.push({ id: adminRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
            }
            if (supportRoleId && interaction.guild.roles.cache.has(supportRoleId)) {
                overwrites.push({ id: supportRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
            }

            const channel = await interaction.guild.channels.create({
                name: `${ticketType}・${interaction.user.username}・${interaction.user.id}`,
                type: ChannelType.GuildText,
                parent: categoryId,
                permissionOverwrites: overwrites,
                reason: `Ticket aberto por ${interaction.user.tag}`,
            });

            this.saveTicketData(channel.id, {
                userId: interaction.user.id,
                type: ticketType,
                status: 'open',
                priority: 'medium',
                createdAt: Date.now(),
                claimedBy: null,
                messages: 0,
            });

            const embed = createTicketEmbed(
                ticketConfig.nome || ticketType,
                ticketConfig.descricao || ticketConfig.predescricao || 'Ticket criado com sucesso.',
                interaction.user,
                interaction.guild
            );

            if (ticketConfig.banner) embed.setImage(ticketConfig.banner);
            if (appearance?.color) embed.setColor(appearance.color);

            const actionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('ticket_claim').setLabel('Assumir').setEmoji('✋').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('ticket_admin_panel').setLabel('Painel Admin').setEmoji('⚙️').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('ticket_close').setLabel('Fechar').setEmoji('🔒').setStyle(ButtonStyle.Danger),
            );

            const actionRow2 = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_actions')
                    .setPlaceholder('Mais ações...')
                    .addOptions([
                        { label: 'Alterar prioridade', value: 'change_priority', emoji: '🏷️' },
                        { label: 'Transferir', value: 'transfer', emoji: '🔄' },
                        { label: 'Adicionar usuário', value: 'add_user', emoji: '➕' },
                        { label: 'Remover usuário', value: 'remove_user', emoji: '➖' },
                        { label: 'Renomear', value: 'rename', emoji: '✏️' },
                    ])
            );

            await channel.send({
                content: `${interaction.user} ${adminRoleId ? `<@&${adminRoleId}>` : ''} ${supportRoleId ? `<@&${supportRoleId}>` : ''}`,
                embeds: [embed],
                components: [actionRow, actionRow2],
            });

            await this.logTicketAction(interaction.guild, 'ticket_created', {
                userId: interaction.user.id,
                channelId: channel.id,
                type: ticketType,
            });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${channel.id}`)
                    .setLabel('Ir para o Ticket')
                    .setStyle(ButtonStyle.Link)
            );

            return interaction.editReply({ content: '✅ Ticket criado com sucesso!', components: [row] });
        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            return interaction.editReply({ content: `❌ | Erro ao criar o ticket: ${error.message}` });
        }
    }

    async closeTicket(channel, closerId, reason = 'Fechado pelo usuário') {
        const configData = await config.fetchAll();
        const logChannelId = (configData.find(e => e.ID === 'ConfigChannels.logsticket')?.data);

        try {
            const messages = await channel.messages.fetch({ limit: 100 });
            const transcript = messages.reverse().map(m =>
                `[${m.createdAt.toLocaleString('pt-BR')}] ${m.author.tag}: ${m.content || '(embed/arquivo)'}`
            ).join('\n');

            const transcriptBuffer = Buffer.from(transcript, 'utf-8');

            if (logChannelId) {
                const logChannel = await channel.guild.channels.fetch(logChannelId).catch(() => null);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor(COLORS.WARNING)
                        .setTitle('🎫 Ticket Fechado')
                        .addFields(
                            { name: 'Canal', value: `${channel.name}`, inline: true },
                            { name: 'Fechado por', value: `<@${closerId}>`, inline: true },
                            { name: 'Motivo', value: reason, inline: false },
                        )
                        .setTimestamp();
                    await logChannel.send({
                        embeds: [logEmbed],
                        files: [{ attachment: transcriptBuffer, name: `transcript-${channel.id}.txt` }],
                    });
                }
            }
        } catch (e) {
            console.error('Erro ao gerar transcript:', e);
        }
        const ticketData = this.getTicketData(channel.id);
        if (!ticketData) return null;

        ticketData.status = 'closed';
        ticketData.closedAt = Date.now();
        ticketData.closedBy = closerId;
        ticketData.closeReason = reason;
        this.saveTicketData(channel.id, ticketData);

        try {
            const embed = new EmbedBuilder()
                .setColor(COLORS.WARNING)
                .setTitle('🔒 Ticket Fechado')
                .setDescription(`Este ticket foi fechado.\n**Motivo:** ${reason}`)
                .setTimestamp();

            await channel.send({ embeds: [embed] });

            await this.logTicketAction(channel.guild, 'ticket_closed', {
                userId: closerId,
                channelId: channel.id,
                reason,
            });

            const everyone = channel.guild.roles.everyone;
            await channel.permissionOverwrites.edit(everyone, { ViewChannel: false });
            await channel.permissionOverwrites.edit(ticketData.userId, { SendMessages: false });

            setTimeout(async () => {
                try {
                    await channel.delete();
                    this.deleteTicketData(channel.id);
                } catch (e) { }
            }, 30000);

            return ticketData;
        } catch (error) {
            console.error('Erro ao fechar ticket:', error);
            return null;
        }
    }

    async claimTicket(interaction) {
        const ticketData = this.getTicketData(interaction.channel.id);
        if (!ticketData) return interaction.reply({ content: '❌ | Ticket não encontrado.', flags: [MessageFlags.Ephemeral] });

        if (ticketData.claimedBy) {
            return interaction.reply({ content: `❌ | Este ticket já foi assumido por <@${ticketData.claimedBy}>.`, flags: [MessageFlags.Ephemeral] });
        }

        ticketData.claimedBy = interaction.user.id;
        ticketData.claimedAt = Date.now();
        ticketData.status = 'in_progress';
        this.saveTicketData(interaction.channel.id, ticketData);

        const embed = new EmbedBuilder()
            .setColor(COLORS.SUCCESS)
            .setDescription(`✅ | Ticket assumido por ${interaction.user}.`)
            .setTimestamp();

        await this.logTicketAction(interaction.guild, 'ticket_claimed', {
            userId: interaction.user.id,
            channelId: interaction.channel.id,
        });

        return interaction.reply({ embeds: [embed] });
    }

    async showAdminPanel(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ | Você não tem permissão de Administrador para acessar este painel.', flags: [MessageFlags.Ephemeral] });
        }

        const embed = new EmbedBuilder()
            .setColor(COLORS.PRIMARY)
            .setTitle('⚙️ Painel Administrativo do Ticket')
            .setDescription('Selecione uma ação para gerenciar este ticket.')
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket_admin_rename').setLabel('✏️ Renomear Ticket').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('ticket_admin_lock').setLabel('🔒 Trancar Ticket').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('ticket_admin_unlock').setLabel('🔓 Reabrir Ticket').setStyle(ButtonStyle.Secondary),
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket_admin_adduser').setLabel('➕ Adicionar Pessoa').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('ticket_admin_removeuser').setLabel('➖ Remover Pessoa').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('ticket_admin_delete').setLabel('🗑️ Fechar Ticket').setStyle(ButtonStyle.Danger),
        );

        return interaction.reply({ embeds: [embed], components: [row, row2], flags: [MessageFlags.Ephemeral] });
    }

    async renameTicket(interaction, newName) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ | Sem permissão.', flags: [MessageFlags.Ephemeral] });
        }
        try {
            const oldName = interaction.channel.name;
            await interaction.channel.setName(newName);
            await this.logTicketAction(interaction.guild, 'ticket_renamed', {
                userId: interaction.user.id,
                channelId: interaction.channel.id,
                oldName,
                newName,
            });
            return interaction.reply({ content: `✅ | Ticket renomeado para \`${newName}\`.`, flags: [MessageFlags.Ephemeral] });
        } catch (e) {
            return interaction.reply({ content: `❌ | Erro ao renomear: ${e.message}`, flags: [MessageFlags.Ephemeral] });
        }
    }

    async lockTicket(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ | Sem permissão.', flags: [MessageFlags.Ephemeral] });
        }
        const ticketData = this.getTicketData(interaction.channel.id);
        if (ticketData) {
            await interaction.channel.permissionOverwrites.edit(ticketData.userId, { SendMessages: false });
            await this.logTicketAction(interaction.guild, 'ticket_locked', {
                userId: interaction.user.id,
                channelId: interaction.channel.id,
            });
            return interaction.reply({ content: '🔒 | Ticket trancado.', flags: [MessageFlags.Ephemeral] });
        }
    }

    async unlockTicket(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ | Sem permissão.', flags: [MessageFlags.Ephemeral] });
        }
        const ticketData = this.getTicketData(interaction.channel.id);
        if (ticketData) {
            await interaction.channel.permissionOverwrites.edit(ticketData.userId, { SendMessages: true });
            await this.logTicketAction(interaction.guild, 'ticket_unlocked', {
                userId: interaction.user.id,
                channelId: interaction.channel.id,
            });
            return interaction.reply({ content: '🔓 | Ticket reaberto.', flags: [MessageFlags.Ephemeral] });
        }
    }

    async addUserToTicket(interaction, userId) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ | Sem permissão.', flags: [MessageFlags.Ephemeral] });
        }
        await interaction.channel.permissionOverwrites.edit(userId, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
        });
        await this.logTicketAction(interaction.guild, 'ticket_user_added', {
            userId: interaction.user.id,
            targetId: userId,
            channelId: interaction.channel.id,
        });
        return interaction.reply({ content: `✅ | <@${userId}> adicionado ao ticket.`, flags: [MessageFlags.Ephemeral] });
    }

    async removeUserFromTicket(interaction, userId) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ | Sem permissão.', flags: [MessageFlags.Ephemeral] });
        }
        await interaction.channel.permissionOverwrites.delete(userId);
        await this.logTicketAction(interaction.guild, 'ticket_user_removed', {
            userId: interaction.user.id,
            targetId: userId,
            channelId: interaction.channel.id,
        });
        return interaction.reply({ content: `✅ | <@${userId}> removido do ticket.`, flags: [MessageFlags.Ephemeral] });
    }

    async logTicketAction(guild, action, data) {
        try {
            const configData = await config.fetchAll();
            const logChannelId = (configData.find(e => e.ID === 'ConfigChannels.logsticket')?.data);
            if (!logChannelId) return;

            const logChannel = await guild.channels.fetch(logChannelId).catch(() => null);
            if (!logChannel) return;

            const actionLabels = {
                ticket_created: { title: '🎫 Ticket Criado', color: COLORS.SUCCESS },
                ticket_claimed: { title: '✋ Ticket Assumido', color: COLORS.PRIMARY },
                ticket_closed: { title: '🔒 Ticket Fechado', color: COLORS.WARNING },
                ticket_renamed: { title: '✏️ Ticket Renomeado', color: COLORS.PRIMARY },
                ticket_locked: { title: '🔒 Ticket Trancado', color: COLORS.DANGER },
                ticket_unlocked: { title: '🔓 Ticket Reaberto', color: COLORS.SUCCESS },
                ticket_user_added: { title: '➕ Usuário Adicionado', color: COLORS.SUCCESS },
                ticket_user_removed: { title: '➖ Usuário Removido', color: COLORS.DANGER },
                ticket_deleted: { title: '🗑️ Ticket Deletado', color: COLORS.DANGER },
            };

            const info = actionLabels[action] || { title: action, color: COLORS.PRIMARY };
            const embed = new EmbedBuilder()
                .setColor(info.color)
                .setTitle(info.title)
                .setTimestamp();

            if (data.userId) embed.addFields({ name: 'Autor', value: `<@${data.userId}>`, inline: true });
            if (data.channelId) embed.addFields({ name: 'Canal', value: `<#${data.channelId}>`, inline: true });
            if (data.targetId) embed.addFields({ name: 'Alvo', value: `<@${data.targetId}>`, inline: true });
            if (data.type) embed.addFields({ name: 'Tipo', value: data.type, inline: true });
            if (data.oldName) embed.addFields({ name: 'Nome Antigo', value: data.oldName, inline: true });
            if (data.newName) embed.addFields({ name: 'Novo Nome', value: data.newName, inline: true });

            await logChannel.send({ embeds: [embed] });
        } catch (e) {
            console.error('Erro ao registrar log de ticket:', e);
        }
    }

    saveTicketData(channelId, data) {
        this.ticketCache.set(channelId, data);
        ticketDb.set(`tickets.ativos.${channelId}`, data);
    }

    getTicketData(channelId) {
        if (this.ticketCache.has(channelId)) {
            return this.ticketCache.get(channelId);
        }
        const data = ticketDb.get(`tickets.ativos.${channelId}`);
        if (data) this.ticketCache.set(channelId, data);
        return data;
    }

    deleteTicketData(channelId) {
        this.ticketCache.delete(channelId);
        ticketDb.delete(`tickets.ativos.${channelId}`);
    }

    getTicketStats() {
        const allTickets = ticketDb.fetchAll();
        let open = 0, closed = 0, inProgress = 0;
        const byCategory = {};
        const byStaff = {};

        for (const entry of allTickets) {
            if (entry.ID.startsWith('tickets.ativos.')) {
                const data = entry.data;
                switch (data.status) {
                    case 'open': open++; break;
                    case 'closed': closed++; break;
                    case 'in_progress': inProgress++; break;
                }
                if (data.type) byCategory[data.type] = (byCategory[data.type] || 0) + 1;
                if (data.claimedBy) byStaff[data.claimedBy] = (byStaff[data.claimedBy] || 0) + 1;
            }
        }

        return { open, closed, inProgress, byCategory, byStaff, total: open + closed + inProgress };
    }
}

module.exports = new TicketService();
