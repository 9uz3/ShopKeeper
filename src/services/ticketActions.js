const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

async function createPriorityMenu(interaction) {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('set_ticket_priority')
        .setPlaceholder('Selecione a prioridade')
        .addOptions([
            { label: '🟢 Baixa', value: 'low', description: 'Prioridade baixa' },
            { label: '🟡 Média', value: 'medium', description: 'Prioridade média' },
            { label: '🟠 Alta', value: 'high', description: 'Prioridade alta' },
            { label: '🔴 Urgente', value: 'urgent', description: 'Prioridade urgente' },
        ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);
    await interaction.update({ components: [row], ephemeral: true });
}

async function createTransferMenu(interaction) {
    const staffMembers = interaction.guild.members.cache.filter(
        m => !m.user.bot && m.roles.cache.some(r => r.permissions.has('ManageMessages'))
    );

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('transfer_ticket')
        .setPlaceholder('Selecione o staff para transferir');

    for (const member of staffMembers.values()) {
        selectMenu.addOptions({
            label: member.user.username,
            value: member.id,
            description: `Transferir ticket para ${member.user.username}`,
        });
    }

    const row = new ActionRowBuilder().addComponents(selectMenu);
    await interaction.update({ components: [row] });
}

module.exports = { createPriorityMenu, createTransferMenu };
