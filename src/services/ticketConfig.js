const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { tickets } = require('../database');
const { createBaseEmbed } = require('../utils/embedBuilder');
const { COLORS } = require('../constants');

async function painelTicket(interaction) {
    const embed = createBaseEmbed()
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });

    const appearance = tickets.get('tickets.aparencia');
    if (appearance?.title) embed.setTitle(appearance.title);
    if (appearance?.description) embed.setDescription(appearance.description);
    if (appearance?.color) embed.setColor(appearance.color);
    if (appearance?.banner) embed.setImage(appearance.banner);

    const funcoes = tickets.get('tickets.funcoes');
    if (funcoes) {
        let count = 0;
        for (const chave in funcoes) {
            if (count >= 4) break;
            const obj = funcoes[chave];
            embed.addFields({
                name: `**${obj.nome}**`,
                value: `**Pré-descrição:** \`${obj.predescricao}\`\n**Emoji:** ${obj.emoji || 'Não definido'}\n**Descrição:** ${obj.descricao || 'Não definido'}\n\n`
            });
            count++;
        }
        if (Object.keys(funcoes).length > 4) {
            embed.addFields({ name: '\u200B', value: `Mais ${Object.keys(funcoes).length - 4} item(ns)...` });
        }
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('definiraparencia').setLabel('Definir aparência').setEmoji('🎨').setStyle(1),
        new ButtonBuilder().setCustomId('definircategoriaticket').setLabel('Definir categoria').setEmoji('📂').setStyle(1),
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('addfuncaoticket').setLabel('Adicionar função').setEmoji('➕').setStyle(3),
        new ButtonBuilder().setCustomId('remfuncaoticket').setLabel('Remover função').setEmoji('➖').setStyle(4),
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('postarticket').setLabel('Postar').setEmoji('📤').setStyle(1),
        new ButtonBuilder().setCustomId('sincronizarticket').setLabel('Sincronizar').setEmoji('🔄').setStyle(2),
        new ButtonBuilder().setCustomId('voltar1').setLabel('Voltar').setEmoji('◀️').setStyle(2),
    );

    await interaction.update({ embeds: [embed], components: [row, row2, row3] });
}

async function definirAparencia(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('modal_aparencia_ticket')
        .setTitle('Definir Aparência do Ticket');

    const appearance = tickets.get('tickets.aparencia') || {};

    modal.addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('title').setLabel('TÍTULO').setStyle(TextInputStyle.Short).setValue(appearance.title || '').setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('description').setLabel('DESCRIÇíO').setStyle(TextInputStyle.Paragraph).setValue(appearance.description || '').setRequired(false).setMaxLength(4000)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('color').setLabel('COR (HEX)').setStyle(TextInputStyle.Short).setValue(appearance.color || COLORS.PRIMARY).setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('banner').setLabel('URL DO BANNER').setStyle(TextInputStyle.Short).setValue(appearance.banner || '').setRequired(false)
        ),
    );

    await interaction.showModal(modal);
}

async function definirCategoria(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('modal_categoria_ticket')
        .setTitle('Definir Categoria dos Tickets');

    modal.addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('categoryId')
                .setLabel('ID DA CATEGORIA')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Cole o ID da categoria aqui')
                .setValue(tickets.get('tickets.categoria') || '')
                .setRequired(true)
        ),
    );

    await interaction.showModal(modal);
}

async function adicionarFuncao(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('modal_add_funcao_ticket')
        .setTitle('Adicionar Função');

    modal.addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('nome').setLabel('NOME DA FUNÇíO').setStyle(TextInputStyle.Short).setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('predescricao').setLabel('PRÉ-DESCRIÇíO').setStyle(TextInputStyle.Short).setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('descricao').setLabel('DESCRIÇíO').setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(4000)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId('emoji').setLabel('EMOJI').setStyle(TextInputStyle.Short).setRequired(false)
        ),
    );

    await interaction.showModal(modal);
}

async function removerFuncao(interaction) {
    const funcoes = tickets.get('tickets.funcoes');
    if (!funcoes || Object.keys(funcoes).length === 0) {
        return interaction.reply({ content: '❌ | Nenhuma função configurada.', ephemeral: true });
    }

    const { StringSelectMenuBuilder } = require('discord.js');
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('remover_funcao_ticket_select')
        .setPlaceholder('Selecione a função para remover');

    for (const [key, func] of Object.entries(funcoes)) {
        selectMenu.addOptions({ label: func.nome, value: key, description: func.predescricao?.slice(0, 50) });
    }

    const row = new ActionRowBuilder().addComponents(selectMenu);
    await interaction.update({ content: 'Selecione a função para remover:', components: [row], embeds: [] });
}

async function postarTicket(interaction, client) {
    const appearance = tickets.get('tickets.aparencia');
    const funcoes = tickets.get('tickets.funcoes');

    if (!funcoes || Object.keys(funcoes).length === 0) {
        return interaction.reply({ content: '❌ | Nenhuma função configurada.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
        .setColor(appearance?.color || COLORS.PRIMARY);
    if (appearance?.title) embed.setTitle(appearance.title);
    if (appearance?.description) embed.setDescription(appearance.description);
    if (appearance?.banner) embed.setImage(appearance.banner);
    embed.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
    embed.setTimestamp();

    const selectMenu = new (require('discord.js').StringSelectMenuBuilder)()
        .setCustomId('ticket_create')
        .setPlaceholder('Selecione uma opção');

    for (const [key, func] of Object.entries(funcoes)) {
        selectMenu.addOptions({
            label: func.nome,
            value: key,
            description: func.predescricao?.slice(0, 50),
            emoji: func.emoji || undefined,
        });
    }

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const channelId = tickets.get('tickets.channel');
    const channel = channelId ? await client.channels.fetch(channelId).catch(() => null) : interaction.channel;

    if (channel) {
        await channel.send({ embeds: [embed], components: [row] });
        try {
            await interaction.reply({ content: '✅ | Ticket postado com sucesso!', flags: [require('discord.js').MessageFlags.Ephemeral] });
        } catch (e) {
            await interaction.editReply({ content: '✅ | Ticket postado com sucesso!', flags: [require('discord.js').MessageFlags.Ephemeral] }).catch(() => {});
        }
    } else {
        try {
            await interaction.reply({ content: '❌ | Canal não encontrado. Configure um canal primeiro.', flags: [require('discord.js').MessageFlags.Ephemeral] });
        } catch (e) {
            await interaction.editReply({ content: '❌ | Canal não encontrado. Configure um canal primeiro.', flags: [require('discord.js').MessageFlags.Ephemeral] }).catch(() => {});
        }
    }
}

async function sincronizarTicket(interaction, client) {
    const appearance = tickets.get('tickets.aparencia');
    const funcoes = tickets.get('tickets.funcoes');

    if (!funcoes || Object.keys(funcoes).length === 0) {
        return interaction.reply({ content: '❌ | Nenhuma função configurada.', ephemeral: true });
    }

    const channelId = tickets.get('tickets.channel');
    if (!channelId) {
        return interaction.reply({ content: '❌ | Nenhum canal configurado.', ephemeral: true });
    }

    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) {
        return interaction.reply({ content: '❌ | Canal não encontrado.', ephemeral: true });
    }

    const messages = await channel.messages.fetch({ limit: 10 });
    const botMessage = messages.find(m => m.author.id === client.user.id && m.components.length > 0);

    if (botMessage) {
        const embed = new EmbedBuilder()
            .setColor(appearance?.color || COLORS.PRIMARY);
        if (appearance?.title) embed.setTitle(appearance.title);
        if (appearance?.description) embed.setDescription(appearance.description);
        if (appearance?.banner) embed.setImage(appearance.banner);
        embed.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
        embed.setTimestamp();

        const selectMenu = new (require('discord.js').StringSelectMenuBuilder)()
            .setCustomId('ticket_create')
            .setPlaceholder('Selecione uma opção');

        for (const [key, func] of Object.entries(funcoes)) {
            selectMenu.addOptions({
                label: func.nome,
                value: key,
                description: func.predescricao?.slice(0, 50),
                emoji: func.emoji || undefined,
            });
        }

        const row = new ActionRowBuilder().addComponents(selectMenu);
        await botMessage.edit({ embeds: [embed], components: [row] });
        await interaction.reply({ content: '✅ | Ticket sincronizado com sucesso!', ephemeral: true });
    } else {
        await interaction.reply({ content: '❌ | Nenhuma mensagem de ticket encontrada no canal.', ephemeral: true });
    }
}

module.exports = {
    painelTicket,
    definirAparencia,
    definirCategoria,
    adicionarFuncao,
    removerFuncao,
    postarTicket,
    sincronizarTicket,
};
