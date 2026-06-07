const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require('discord.js');
const { config } = require('../database');
const { COLORS } = require('../constants');
const { getGreeting, formatCurrency } = require('../utils/helpers');
const ticketService = require('./ticketService');

async function showStaffPanel(interaction) {
    const stats = ticketService.getTicketStats();

    const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle('👨‍💼 Painel Administrativo')
        .setDescription(`${getGreeting()}, **${interaction.user.username}**! Bem-vindo ao painel de gerenciamento.`)
        .addFields(
            { name: '📊 Tickets Abertos', value: `\`${stats.open}\``, inline: true },
            { name: '🔒 Tickets Fechados', value: `\`${stats.closed}\``, inline: true },
            { name: '🔄 Em Atendimento', value: `\`${stats.inProgress}\``, inline: true },
            { name: '📈 Total', value: `\`${stats.total}\``, inline: true },
            { name: '👥 Staff Online', value: `\`${interaction.guild.members.cache.filter(m => !m.user.bot && m.presence?.status === 'online').size}\``, inline: true },
            { name: '🏓 Ping', value: `\`${interaction.client.ws.ping}ms\``, inline: true },
        )
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('panel_dashboard').setLabel('📊 Dashboard').setStyle(1),
        new ButtonBuilder().setCustomId('panel_staff').setLabel('👨‍💼 Gestão de Staff').setStyle(1),
        new ButtonBuilder().setCustomId('panel_tickets').setLabel('🎫 Gestão de Tickets').setStyle(1),
        new ButtonBuilder().setCustomId('panel_finance').setLabel('💰 Financeiro').setStyle(3),
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('panel_reports').setLabel('📈 Relatórios').setStyle(2),
        new ButtonBuilder().setCustomId('panel_notifications').setLabel('🔔 Notificações').setStyle(2),
        new ButtonBuilder().setCustomId('panel_settings').setLabel('⚙️ Configurações').setStyle(2),
        new ButtonBuilder().setCustomId('panel_logs').setLabel('📋 Logs').setStyle(2),
    );

    await interaction.reply({ embeds: [embed], components: [row1, row2], ephemeral: true });
}

async function showDashboard(interaction) {
    const stats = ticketService.getTicketStats();
    const members = interaction.guild.members.cache;
    const onlineStaff = members.filter(m => !m.user.bot && m.presence?.status === 'online').size;
    const busyStaff = members.filter(m => !m.user.bot && m.presence?.status === 'dnd').size;

    const embed = new EmbedBuilder()
        .setColor(COLORS.SURFACE)
        .setTitle('📊 Dashboard')
        .setDescription('Visão geral do sistema de tickets.')
        .addFields(
            { name: '🎫 Tickets', value: `Abertos: \`${stats.open}\`\nFechados: \`${stats.closed}\`\nEm atendimento: \`${stats.inProgress}\``, inline: true },
            { name: '👥 Staff', value: `Online: \`${onlineStaff}\`\nOcupados: \`${busyStaff}\`\nTotal: \`${members.filter(m => !m.user.bot).size}\``, inline: true },
            { name: '📊 Performance', value: `Ping: \`${interaction.client.ws.ping}ms\`\nUptime: <t:${Math.floor(Date.now() / 1000 - process.uptime())}:R>`, inline: true },
        )
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    if (Object.keys(stats.byCategory).length > 0) {
        let catText = '';
        for (const [cat, count] of Object.entries(stats.byCategory)) {
            catText += `\`${cat}\`: ${count}\n`;
        }
        embed.addFields({ name: '📁 Tickets por Categoria', value: catText, inline: false });
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('panel_back').setLabel('◀️ Voltar').setStyle(2)
    );

    await interaction.update({ embeds: [embed], components: [row] });
}

async function showStaffManagement(interaction) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.SURFACE)
        .setTitle('👨‍💼 Gestão de Staff')
        .setDescription('Gerencie os membros da equipe de suporte.')
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('staff_add').setLabel('➕ Adicionar Staff').setStyle(3),
        new ButtonBuilder().setCustomId('staff_remove').setLabel('➖ Remover Staff').setStyle(4),
        new ButtonBuilder().setCustomId('staff_list').setLabel('📋 Listar Staff').setStyle(1),
        new ButtonBuilder().setCustomId('staff_rank').setLabel('🏆 Ranking').setStyle(2),
        new ButtonBuilder().setCustomId('panel_back').setLabel('◀️ Voltar').setStyle(2),
    );

    await interaction.update({ embeds: [embed], components: [row] });
}

async function showTicketManagement(interaction) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.SURFACE)
        .setTitle('🎫 Gestão de Tickets')
        .setDescription('Gerencie todos os tickets do servidor.')
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_list_open').setLabel('📋 Tickets Abertos').setStyle(1),
        new ButtonBuilder().setCustomId('ticket_list_closed').setLabel('📋 Tickets Fechados').setStyle(2),
        new ButtonBuilder().setCustomId('ticket_export').setLabel('📤 Exportar Transcript').setStyle(2),
        new ButtonBuilder().setCustomId('panel_back').setLabel('◀️ Voltar').setStyle(2),
    );

    await interaction.update({ embeds: [embed], components: [row] });
}

async function showFinancePanel(interaction) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.SURFACE)
        .setTitle('💰 Sistema Financeiro')
        .setDescription('Gerencie pagamentos e finanças.')
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('finance_pending').setLabel('⏳ Pagamentos Pendentes').setStyle(1),
        new ButtonBuilder().setCustomId('finance_history').setLabel('📜 Histórico').setStyle(2),
        new ButtonBuilder().setCustomId('finance_reports').setLabel('📊 Relatórios').setStyle(2),
        new ButtonBuilder().setCustomId('panel_back').setLabel('◀️ Voltar').setStyle(2),
    );

    await interaction.update({ embeds: [embed], components: [row] });
}

module.exports = {
    showStaffPanel,
    showDashboard,
    showStaffManagement,
    showTicketManagement,
    showFinancePanel,
};
